-- ═══════════════════════════════════════════════════════════════════════════
-- JADEER PLATFORM MIGRATION: Google Calendar Synchronization
-- Date: 2026-09-04
-- Target: Hosted Supabase PostgreSQL
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Add Calendar Sync Columns to "sessions" ──────────────────────────────
ALTER TABLE "sessions"
    ADD COLUMN IF NOT EXISTS "google_calendar_event_id"   TEXT,
    ADD COLUMN IF NOT EXISTS "google_calendar_sync_status" TEXT NOT NULL DEFAULT 'not_connected',
    ADD COLUMN IF NOT EXISTS "google_calendar_synced_at"   TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS "google_calendar_last_error"  TEXT;

CREATE INDEX IF NOT EXISTS "idx_sessions_calendar_event"
    ON "sessions"("google_calendar_event_id")
    WHERE "google_calendar_event_id" IS NOT NULL;

-- ── 2. Candidate Google Calendar Tokens Table ────────────────────────────────
-- Stores OAuth access & refresh tokens securely in PostgreSQL.
-- Never exposed to browser clients directly.
CREATE TABLE IF NOT EXISTS "candidate_google_tokens" (
    "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "candidate_user_id" TEXT NOT NULL UNIQUE,
    "access_token"      TEXT NOT NULL,
    "refresh_token"     TEXT,
    "scope"             TEXT,
    "token_type"        TEXT DEFAULT 'Bearer',
    "expiry_date"       BIGINT,
    "google_email"      TEXT,
    "created_at"        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_cgt_candidate_user_id"
    ON "candidate_google_tokens"("candidate_user_id");

ALTER TABLE "candidate_google_tokens" ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access
DROP POLICY IF EXISTS "cgt_service_role_all" ON "candidate_google_tokens";
CREATE POLICY "cgt_service_role_all" ON "candidate_google_tokens"
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ── 3. RPC: Upsert Candidate Calendar Token (SECURITY DEFINER) ─────────────
CREATE OR REPLACE FUNCTION "upsert_candidate_calendar_token"(
    p_candidate_user_id TEXT,
    p_access_token      TEXT,
    p_refresh_token     TEXT DEFAULT NULL,
    p_scope             TEXT DEFAULT NULL,
    p_expiry_date       BIGINT DEFAULT NULL,
    p_google_email      TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF p_candidate_user_id IS NULL OR p_candidate_user_id = '' THEN
        RAISE EXCEPTION 'p_candidate_user_id is required';
    END IF;

    INSERT INTO "candidate_google_tokens" (
        "candidate_user_id",
        "access_token",
        "refresh_token",
        "scope",
        "expiry_date",
        "google_email",
        "updated_at"
    )
    VALUES (
        p_candidate_user_id,
        p_access_token,
        p_refresh_token,
        p_scope,
        p_expiry_date,
        p_google_email,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT ("candidate_user_id") DO UPDATE
    SET "access_token"  = EXCLUDED."access_token",
        "refresh_token" = COALESCE(EXCLUDED."refresh_token", "candidate_google_tokens"."refresh_token"),
        "scope"         = COALESCE(EXCLUDED."scope", "candidate_google_tokens"."scope"),
        "expiry_date"   = COALESCE(EXCLUDED."expiry_date", "candidate_google_tokens"."expiry_date"),
        "google_email"  = COALESCE(EXCLUDED."google_email", "candidate_google_tokens"."google_email"),
        "updated_at"    = CURRENT_TIMESTAMP;

    RETURN jsonb_build_object(
        'success', true,
        'candidate_user_id', p_candidate_user_id,
        'google_email', p_google_email
    );
END;
$$;

GRANT EXECUTE ON FUNCTION "upsert_candidate_calendar_token"(TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT) TO anon, authenticated, service_role;

-- ── 4. RPC: Get Candidate Calendar Token (SECURITY DEFINER) ────────────────
CREATE OR REPLACE FUNCTION "get_candidate_calendar_token"(
    p_candidate_user_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_row "candidate_google_tokens"%ROWTYPE;
BEGIN
    SELECT * INTO v_row
    FROM "candidate_google_tokens"
    WHERE "candidate_user_id" = p_candidate_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('connected', false);
    END IF;

    RETURN jsonb_build_object(
        'connected',     true,
        'access_token',  v_row."access_token",
        'refresh_token', v_row."refresh_token",
        'scope',         v_row."scope",
        'expiry_date',   v_row."expiry_date",
        'google_email',  v_row."google_email",
        'updated_at',    v_row."updated_at"
    );
END;
$$;

GRANT EXECUTE ON FUNCTION "get_candidate_calendar_token"(TEXT) TO anon, authenticated, service_role;

-- ── 5. RPC: Disconnect Candidate Calendar (SECURITY DEFINER) ───────────────
CREATE OR REPLACE FUNCTION "disconnect_candidate_calendar"(
    p_candidate_user_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    DELETE FROM "candidate_google_tokens"
    WHERE "candidate_user_id" = p_candidate_user_id;

    -- Update existing sessions to not_connected
    UPDATE "sessions"
    SET "google_calendar_sync_status" = 'not_connected'
    WHERE "candidate_user_id" = p_candidate_user_id
      AND "google_calendar_sync_status" <> 'synced';

    RETURN jsonb_build_object('success', true, 'disconnected', true);
END;
$$;

GRANT EXECUTE ON FUNCTION "disconnect_candidate_calendar"(TEXT) TO anon, authenticated, service_role;

-- ── 6. RPC: Update Session Calendar Sync Status ────────────────────────────
CREATE OR REPLACE FUNCTION "update_session_calendar_sync"(
    p_session_id          UUID,
    p_candidate_user_id   TEXT,
    p_event_id            TEXT DEFAULT NULL,
    p_sync_status         TEXT DEFAULT 'synced',
    p_last_error          TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE "sessions"
    SET "google_calendar_event_id"   = CASE 
            WHEN p_sync_status = 'not_connected' AND p_event_id IS NULL THEN NULL
            ELSE COALESCE(p_event_id, "google_calendar_event_id")
        END,
        "google_calendar_sync_status" = p_sync_status,
        "google_calendar_synced_at"   = CASE WHEN p_sync_status = 'synced' THEN CURRENT_TIMESTAMP ELSE "google_calendar_synced_at" END,
        "google_calendar_last_error"  = p_last_error,
        "updated_at"                  = CURRENT_TIMESTAMP
    WHERE "id" = p_session_id
      AND ("candidate_user_id" = p_candidate_user_id OR p_candidate_user_id = 'service_role');

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Session not found or unauthorized');
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'session_id', p_session_id,
        'sync_status', p_sync_status,
        'event_id', p_event_id
    );
END;
$$;

GRANT EXECUTE ON FUNCTION "update_session_calendar_sync"(UUID, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- ── 6B. RPC: Get Session Calendar Info (SECURITY DEFINER) ───────────────────
CREATE OR REPLACE FUNCTION "get_session_calendar_info"(
    p_session_id          UUID,
    p_candidate_user_id   TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_event_id TEXT;
    v_status   TEXT;
BEGIN
    SELECT "google_calendar_event_id", "google_calendar_sync_status"
    INTO v_event_id, v_status
    FROM "sessions"
    WHERE "id" = p_session_id
      AND ("candidate_user_id" = p_candidate_user_id OR p_candidate_user_id = 'service_role');

    IF NOT FOUND THEN
        RETURN jsonb_build_object('found', false);
    END IF;

    RETURN jsonb_build_object(
        'found', true,
        'google_calendar_event_id', v_event_id,
        'google_calendar_sync_status', v_status
    );
END;
$$;

GRANT EXECUTE ON FUNCTION "get_session_calendar_info"(UUID, TEXT) TO anon, authenticated, service_role;

-- ── 7. Patch: get_candidate_interview_state with Calendar Sync Fields ───────
CREATE OR REPLACE FUNCTION "get_candidate_interview_state"(
    p_candidate_user_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_assignment  RECORD;
    v_session     RECORD;
    v_expert      RECORD;
BEGIN
    IF auth.uid() IS NOT NULL THEN
        p_candidate_user_id := auth.uid()::text;
    END IF;

    IF p_candidate_user_id IS NULL OR p_candidate_user_id = '' THEN
        RAISE EXCEPTION 'p_candidate_user_id is required';
    END IF;

    -- 1. Check for completed session with evaluation
    SELECT s.*, e.overall_score, e.technical_score, e.problem_solving_score,
           e.communication_score, e.reasoning_score, e.recommendation,
           e.candidate_visible_feedback, e.strengths, e.recommendations, e.submitted_at
    INTO v_session
    FROM "sessions" s
    JOIN "human_interview_evaluations" e ON e.session_id = s.id
    WHERE s."candidate_user_id" = p_candidate_user_id
      AND s."session_type" = 'human_interview'
      AND s."status" = 'completed'
    ORDER BY s."created_at" DESC
    LIMIT 1;

    IF FOUND THEN
        SELECT * INTO v_expert FROM "experts" WHERE "id" = v_session."expert_id";
        RETURN jsonb_build_object(
            'state',        'completed',
            'is_completed', true,
            'status',       'completed',
            'expert', jsonb_build_object(
                'id', v_expert.id, 'full_name', v_expert.full_name,
                'initials', v_expert.initials, 'title', v_expert.title,
                'company', v_expert.company, 'bio', v_expert.bio,
                'track', v_expert.track, 'specialties', v_expert.specialties,
                'rating', v_expert.rating, 'sessions_completed', v_expert.sessions_completed
            ),
            'session', jsonb_build_object(
                'session_id', v_session.id, 'slot_id', v_session.slot_id,
                'scheduled_start_time', v_session.scheduled_start_time,
                'scheduled_end_time', v_session.scheduled_end_time,
                'timezone', v_session.timezone, 'meeting_url', v_session.meeting_url,
                'status', v_session.status,
                'google_calendar_event_id', v_session.google_calendar_event_id,
                'google_calendar_sync_status', v_session.google_calendar_sync_status,
                'google_calendar_synced_at', v_session.google_calendar_synced_at,
                'google_calendar_last_error', v_session.google_calendar_last_error
            ),
            'evaluation', jsonb_build_object(
                'overall_score', v_session.overall_score,
                'technical_score', v_session.technical_score,
                'problem_solving_score', v_session.problem_solving_score,
                'communication_score', v_session.communication_score,
                'reasoning_score', v_session.reasoning_score,
                'recommendation', v_session.recommendation,
                'candidate_visible_feedback', v_session.candidate_visible_feedback,
                'strengths', v_session.strengths,
                'recommendations', v_session.recommendations,
                'submitted_at', v_session.submitted_at
            )
        );
    END IF;

    -- 2. Check for active scheduled session
    SELECT * INTO v_session
    FROM "sessions"
    WHERE "candidate_user_id" = p_candidate_user_id
      AND "session_type" = 'human_interview'
      AND "status" IN ('scheduled', 'in_progress')
    ORDER BY "scheduled_start_time" ASC
    LIMIT 1;

    IF FOUND THEN
        SELECT * INTO v_expert FROM "experts" WHERE "id" = v_session."expert_id";
        RETURN jsonb_build_object(
            'state',        'confirmed',
            'is_completed', false,
            'status',       'confirmed',
            'expert', jsonb_build_object(
                'id', v_expert.id, 'full_name', v_expert.full_name,
                'initials', v_expert.initials, 'title', v_expert.title,
                'company', v_expert.company, 'bio', v_expert.bio,
                'track', v_expert.track, 'specialties', v_expert.specialties,
                'rating', v_expert.rating, 'sessions_completed', v_expert.sessions_completed
            ),
            'session', jsonb_build_object(
                'session_id', v_session.id, 'slot_id', v_session.slot_id,
                'scheduled_start_time', v_session.scheduled_start_time,
                'scheduled_end_time', v_session.scheduled_end_time,
                'timezone', v_session.timezone, 'meeting_url', v_session.meeting_url,
                'status', v_session.status,
                'google_calendar_event_id', v_session.google_calendar_event_id,
                'google_calendar_sync_status', v_session.google_calendar_sync_status,
                'google_calendar_synced_at', v_session.google_calendar_synced_at,
                'google_calendar_last_error', v_session.google_calendar_last_error
            )
        );
    END IF;

    -- 3. Check for interviewer assignment
    SELECT cia.*, e.id AS expert_id_val, e.full_name, e.initials, e.title,
           e.company, e.bio, e.track, e.specialties, e.rating, e.sessions_completed,
           cia.assigned_by
    INTO v_assignment
    FROM "candidate_interview_assignments" cia
    JOIN "experts" e ON e."id" = cia."expert_id"
    WHERE cia."candidate_user_id" = p_candidate_user_id
      AND cia."is_active" = true
    ORDER BY cia."assigned_at" DESC
    LIMIT 1;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'state',       'choose_time',
            'is_completed', false,
            'status',      'choose_time',
            'assigned_by', v_assignment.assigned_by,
            'expert', jsonb_build_object(
                'id', v_assignment.expert_id_val,
                'full_name', v_assignment.full_name,
                'initials', v_assignment.initials,
                'title', v_assignment.title,
                'company', v_assignment.company,
                'bio', v_assignment.bio,
                'track', v_assignment.track,
                'specialties', v_assignment.specialties,
                'rating', v_assignment.rating,
                'sessions_completed', v_assignment.sessions_completed
            )
        );
    END IF;

    -- 4. Default: awaiting assignment
    RETURN jsonb_build_object(
        'state',        'awaiting_assignment',
        'is_completed', false,
        'status',       'awaiting_assignment',
        'expert',       null,
        'session',      null,
        'evaluation',   null
    );
END;
$$;

GRANT EXECUTE ON FUNCTION "get_candidate_interview_state"(TEXT) TO anon, authenticated, service_role;

-- ── 8. Patch: get_my_sessions with Calendar Sync Fields ─────────────────────
CREATE OR REPLACE FUNCTION "get_my_sessions"(
    p_candidate_user_id  TEXT,
    p_session_type       session_type DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF p_candidate_user_id IS NULL OR p_candidate_user_id = '' THEN
        RAISE EXCEPTION 'p_candidate_user_id is required';
    END IF;

    RETURN (
        SELECT COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'session_id',                   s."id",
                    'status',                       s."status",
                    'session_type',                 s."session_type",
                    'slot_id',                      s."slot_id",
                    'scheduled_start_time',         s."scheduled_start_time",
                    'scheduled_end_time',           s."scheduled_end_time",
                    'timezone',                     s."timezone",
                    'meeting_url',                  s."meeting_url",
                    'google_calendar_event_id',     s."google_calendar_event_id",
                    'google_calendar_sync_status',   s."google_calendar_sync_status",
                    'google_calendar_synced_at',     s."google_calendar_synced_at",
                    'google_calendar_last_error',    s."google_calendar_last_error",
                    'created_at',                   s."created_at",
                    'expert', jsonb_build_object(
                        'id',        e."id",
                        'full_name', e."full_name",
                        'initials',  e."initials",
                        'title',     e."title",
                        'company',   e."company"
                    ),
                    'consultation_details', (
                        SELECT jsonb_build_object(
                            'id',               cd."id",
                            'topic',            cd."topic",
                            'topic_title',      cd."topic_title",
                            'goal',             cd."goal",
                            'candidate_message',cd."candidate_message",
                            'outcome_summary',  cd."outcome_summary",
                            'action_items',     cd."action_items",
                            'deliverables',     cd."deliverables",
                            'created_at',       cd."created_at"
                        )
                        FROM "consultation_details" cd
                        WHERE cd."session_id" = s."id"
                        LIMIT 1
                    ),
                    'evaluation', (
                        SELECT jsonb_build_object(
                            'overall_score',             hie."overall_score",
                            'recommendation',            hie."recommendation",
                            'candidate_visible_feedback',hie."candidate_visible_feedback",
                            'submitted_at',              hie."submitted_at"
                        )
                        FROM "human_interview_evaluations" hie
                        WHERE hie."session_id" = s."id"
                        LIMIT 1
                    )
                )
                ORDER BY s."scheduled_start_time" ASC
            ),
            '[]'::jsonb
        )
        FROM "sessions" s
        JOIN "experts" e ON e."id" = s."expert_id"
        WHERE s."candidate_user_id" = p_candidate_user_id
          AND (p_session_type IS NULL OR s."session_type" = p_session_type)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION "get_my_sessions"(TEXT, session_type) TO anon, authenticated, service_role;
