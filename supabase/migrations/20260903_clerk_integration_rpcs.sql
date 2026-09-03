-- ═══════════════════════════════════════════════════════════════════════════
-- JADEER PLATFORM — CLERK INTEGRATION BRIDGE RPCS
-- ─────────────────────────────────────────────────────────────────────────
-- Extends the scheduling backend to support Clerk authentication alongside
-- the existing Supabase Auth RLS. Since Clerk manages user sessions and the
-- Supabase anon key is used for browser calls, these SECURITY DEFINER RPCs
-- allow Clerk user IDs (text) to be passed directly without requiring a
-- Supabase Auth session (auth.uid() may be null for anon-key callers).
--
-- Security model:
--   - All read RPCs validate that the returned data belongs to p_candidate_user_id.
--   - The anon PostgREST key does NOT have direct table read permissions for
--     sessions/evaluations (RLS blocks it). Only these RPCs grant read access.
--   - Write RPCs (book, reschedule, cancel) are patched to allow anon-key callers
--     with an explicit p_candidate_user_id (Clerk user ID) in addition to the
--     existing Supabase Auth flow.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Candidate Profile Provisioning ──────────────────────────────────────
-- Called on first Clerk sign-in to ensure a users + student_profiles row exists.
-- Safe to call multiple times (idempotent ON CONFLICT DO NOTHING).

CREATE OR REPLACE FUNCTION "ensure_candidate_profile"(
    p_user_id        TEXT,
    p_email          TEXT,
    p_full_name      TEXT  DEFAULT 'Jadeer Candidate',
    p_track          "SoftwareTrack" DEFAULT 'BACKEND'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_profile_id TEXT;
BEGIN
    -- Upsert into users
    INSERT INTO "users" ("id", "email", "role", "authProvider", "isActive", "isVerified", "updatedAt")
    VALUES (p_user_id, p_email, 'STUDENT', 'EMAIL', true, true, CURRENT_TIMESTAMP)
    ON CONFLICT ("id") DO UPDATE SET
        "email"     = EXCLUDED."email",
        "isActive"  = true,
        "updatedAt" = CURRENT_TIMESTAMP;

    -- Upsert into student_profiles
    INSERT INTO "student_profiles" ("id", "userId", "fullName", "softwareTrack", "updatedAt")
    VALUES (
        'prof-' || p_user_id,
        p_user_id,
        p_full_name,
        p_track,
        CURRENT_TIMESTAMP
    )
    ON CONFLICT ("userId") DO UPDATE SET
        "fullName"      = EXCLUDED."fullName",
        "softwareTrack" = EXCLUDED."softwareTrack",
        "updatedAt"     = CURRENT_TIMESTAMP
    RETURNING "id" INTO v_profile_id;

    IF v_profile_id IS NULL THEN
        SELECT "id" INTO v_profile_id FROM "student_profiles" WHERE "userId" = p_user_id;
    END IF;

    RETURN jsonb_build_object(
        'success',     true,
        'user_id',     p_user_id,
        'profile_id',  v_profile_id
    );
END;
$$;

REVOKE ALL ON FUNCTION "ensure_candidate_profile"(TEXT, TEXT, TEXT, "SoftwareTrack") FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "ensure_candidate_profile"(TEXT, TEXT, TEXT, "SoftwareTrack") TO anon;
GRANT EXECUTE ON FUNCTION "ensure_candidate_profile"(TEXT, TEXT, TEXT, "SoftwareTrack") TO authenticated;
GRANT EXECUTE ON FUNCTION "ensure_candidate_profile"(TEXT, TEXT, TEXT, "SoftwareTrack") TO service_role;

-- ── 2. Read: My Sessions (Consultation or Human Interview) ─────────────────
-- SECURITY DEFINER: bypasses RLS, validates ownership via p_candidate_user_id.
-- Returns sessions with expert data and detail rows joined.

CREATE OR REPLACE FUNCTION "get_my_sessions"(
    p_candidate_user_id  TEXT,
    p_session_type       session_type DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF p_candidate_user_id IS NULL OR p_candidate_user_id = '' THEN
        RAISE EXCEPTION 'p_candidate_user_id is required';
    END IF;

    SELECT jsonb_agg(
        jsonb_build_object(
            'session_id',            s."id",
            'status',                s."status",
            'session_type',          s."session_type",
            'slot_id',               s."slot_id",
            'scheduled_start_time',  s."scheduled_start_time",
            'scheduled_end_time',    s."scheduled_end_time",
            'timezone',              s."timezone",
            'meeting_url',           s."meeting_url",
            'created_at',            s."created_at",
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
                    'created_at',       cd."created_at",
                    'updated_at',       cd."updated_at"
                )
                FROM "consultation_details" cd
                WHERE cd."session_id" = s."id"
                LIMIT 1
            ),
            'human_interview_details', (
                SELECT jsonb_build_object(
                    'software_track',    hd."software_track",
                    'calibration_stage', hd."calibration_stage"
                )
                FROM "human_interview_details" hd
                WHERE hd."session_id" = s."id"
                LIMIT 1
            )
        )
        ORDER BY s."scheduled_start_time" DESC
    ) INTO v_result
    FROM "sessions" s
    LEFT JOIN "experts" e ON e."id" = s."expert_id"
    WHERE s."candidate_user_id" = p_candidate_user_id
      AND (p_session_type IS NULL OR s."session_type" = p_session_type)
      AND s."status" <> 'cancelled';

    RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$;

REVOKE ALL ON FUNCTION "get_my_sessions"(TEXT, session_type) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "get_my_sessions"(TEXT, session_type) TO anon;
GRANT EXECUTE ON FUNCTION "get_my_sessions"(TEXT, session_type) TO authenticated;
GRANT EXECUTE ON FUNCTION "get_my_sessions"(TEXT, session_type) TO service_role;

-- ── 3. Read: Candidate Visible Evaluation ────────────────────────────────────
-- Returns candidate-visible evaluation fields for the latest completed
-- human_interview session. Never returns internal notes.

CREATE OR REPLACE FUNCTION "get_candidate_evaluation"(
    p_candidate_user_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF p_candidate_user_id IS NULL OR p_candidate_user_id = '' THEN
        RAISE EXCEPTION 'p_candidate_user_id is required';
    END IF;

    SELECT jsonb_build_object(
        'has_evaluation',               true,
        'session_id',                   s."id",
        'overall_score',                ev."overall_score",
        'technical_score',              ev."technical_score",
        'problem_solving_score',        ev."problem_solving_score",
        'communication_score',          ev."communication_score",
        'reasoning_score',              ev."reasoning_score",
        'recommendation',               ev."recommendation",
        'candidate_visible_feedback',   ev."candidate_visible_feedback",
        'strengths',                    ev."strengths",
        'recommendations',              ev."recommendations",
        'submitted_at',                 ev."submitted_at"
    ) INTO v_result
    FROM "sessions" s
    JOIN "human_interview_evaluations" ev ON ev."session_id" = s."id"
    WHERE s."candidate_user_id" = p_candidate_user_id
      AND s."session_type"       = 'human_interview'
      AND s."status"             = 'completed'
    ORDER BY s."created_at" DESC
    LIMIT 1;

    RETURN COALESCE(v_result, jsonb_build_object('has_evaluation', false));
END;
$$;

REVOKE ALL ON FUNCTION "get_candidate_evaluation"(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "get_candidate_evaluation"(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION "get_candidate_evaluation"(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION "get_candidate_evaluation"(TEXT) TO service_role;

-- ── 4. Read: Candidate Interview Assignment ───────────────────────────────────
-- Returns the active interviewer assignment for a candidate (if any).

CREATE OR REPLACE FUNCTION "get_candidate_assignment"(
    p_candidate_user_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF p_candidate_user_id IS NULL OR p_candidate_user_id = '' THEN
        RAISE EXCEPTION 'p_candidate_user_id is required';
    END IF;

    SELECT jsonb_build_object(
        'assigned',     true,
        'assigned_by',  cia."assigned_by",
        'expert', jsonb_build_object(
            'id',                e."id",
            'full_name',         e."full_name",
            'initials',          e."initials",
            'title',             e."title",
            'company',           e."company",
            'bio',               e."bio",
            'track',             e."track",
            'specialties',       e."specialties",
            'rating',            e."rating",
            'sessions_completed',e."sessions_completed"
        )
    ) INTO v_result
    FROM "candidate_interview_assignments" cia
    JOIN "experts" e ON e."id" = cia."expert_id"
    WHERE cia."candidate_user_id" = p_candidate_user_id
      AND cia."is_active" = true
    ORDER BY cia."assigned_at" DESC
    LIMIT 1;

    RETURN COALESCE(v_result, jsonb_build_object('assigned', false));
END;
$$;

REVOKE ALL ON FUNCTION "get_candidate_assignment"(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "get_candidate_assignment"(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION "get_candidate_assignment"(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION "get_candidate_assignment"(TEXT) TO service_role;

-- ── 5. Read: Consultation Outcome ─────────────────────────────────────────
-- Returns the outcome + action items for a specific session the candidate owns.

CREATE OR REPLACE FUNCTION "get_consultation_outcome"(
    p_session_id         UUID,
    p_candidate_user_id  TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF p_candidate_user_id IS NULL OR p_candidate_user_id = '' THEN
        RAISE EXCEPTION 'p_candidate_user_id is required';
    END IF;

    SELECT jsonb_build_object(
        'has_outcome',     (cd."outcome_summary" IS NOT NULL AND cd."outcome_summary" <> ''),
        'session_id',      s."id",
        'status',          s."status",
        'topic',           cd."topic",
        'topic_title',     cd."topic_title",
        'goal',            cd."goal",
        'outcome_summary', cd."outcome_summary",
        'action_items',    cd."action_items",
        'deliverables',    cd."deliverables",
        'completed_at',    cd."updated_at",
        'consultant', jsonb_build_object(
            'full_name', e."full_name",
            'title',     e."title",
            'company',   e."company"
        )
    ) INTO v_result
    FROM "sessions" s
    JOIN "consultation_details" cd ON cd."session_id" = s."id"
    LEFT JOIN "experts" e ON e."id" = s."expert_id"
    WHERE s."id" = p_session_id
      AND s."candidate_user_id" = p_candidate_user_id;

    RETURN COALESCE(v_result, jsonb_build_object('has_outcome', false));
END;
$$;

REVOKE ALL ON FUNCTION "get_consultation_outcome"(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "get_consultation_outcome"(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION "get_consultation_outcome"(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION "get_consultation_outcome"(UUID, TEXT) TO service_role;

-- ── 6. Patch: book_session_atomic — Allow Anon Key + Clerk User ID ──────────
-- Replaces the existing function to allow anon-key callers (Clerk integration)
-- by treating an explicit non-empty p_candidate_user_id as authoritative when
-- auth.uid() is null.  All other logic is identical to the previous version.

CREATE OR REPLACE FUNCTION "book_session_atomic"(
    p_candidate_user_id       TEXT,
    p_slot_id                 UUID,
    p_session_type            session_type,
    p_timezone                TEXT          DEFAULT 'Asia/Riyadh',
    p_meeting_url             TEXT          DEFAULT NULL,
    p_software_track          "SoftwareTrack" DEFAULT NULL,
    p_candidate_notes         TEXT          DEFAULT NULL,
    p_calibration_stage       TEXT          DEFAULT NULL,
    p_consultation_topic      TEXT          DEFAULT NULL,
    p_consultation_topic_title TEXT         DEFAULT NULL,
    p_consultation_goal       TEXT          DEFAULT NULL,
    p_consultation_message    TEXT          DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_slot "expert_availability_slots"%ROWTYPE;
    v_candidate_profile_id TEXT;
    v_session_id UUID;
    v_expert "experts"%ROWTYPE;
    v_meeting_link TEXT;
BEGIN
    -- Authentication: allow auth.uid() users OR anon-key callers with explicit candidate id
    IF auth.uid() IS NULL
       AND (auth.jwt() ->> 'role') <> 'service_role'
       AND (auth.jwt() ->> 'role') <> 'anon'
    THEN
        RAISE EXCEPTION 'Authentication required: Caller is not authenticated';
    END IF;

    -- Override candidate ID with Supabase Auth UID when authenticated via Supabase Auth
    IF auth.uid() IS NOT NULL THEN
        p_candidate_user_id := auth.uid()::text;
    END IF;

    IF p_candidate_user_id IS NULL OR p_candidate_user_id = '' THEN
        RAISE EXCEPTION 'candidate_user_id is required';
    END IF;

    -- 1. Lock the slot row against concurrent attempts
    SELECT * INTO v_slot
    FROM "expert_availability_slots"
    WHERE "id" = p_slot_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Availability slot % not found', p_slot_id;
    END IF;

    IF v_slot."status" <> 'available' THEN
        RAISE EXCEPTION 'Slot % is no longer available (current status: %)', p_slot_id, v_slot."status";
    END IF;

    -- 2. Resolve Candidate Profile ID from student_profiles
    SELECT "id" INTO v_candidate_profile_id
    FROM "student_profiles"
    WHERE "userId" = p_candidate_user_id;

    IF v_candidate_profile_id IS NULL THEN
        RAISE EXCEPTION 'Candidate student profile not found for user %. A completed student profile is required to book a session.', p_candidate_user_id;
    END IF;

    -- 3. Resolve Expert
    SELECT * INTO v_expert
    FROM "experts"
    WHERE "id" = v_slot."expert_id";

    -- 4. Mark slot as booked
    UPDATE "expert_availability_slots"
    SET "status" = 'booked', "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_slot_id;

    -- 5. Generate meeting link
    v_meeting_link := COALESCE(
        p_meeting_url,
        'https://meet.jadeer.io/' || p_session_type::text || '/' || gen_random_uuid()::text
    );

    -- 6. Insert session record
    INSERT INTO "sessions" (
        "candidate_id",
        "candidate_user_id",
        "expert_id",
        "slot_id",
        "session_type",
        "status",
        "scheduled_start_time",
        "scheduled_end_time",
        "timezone",
        "meeting_url"
    )
    VALUES (
        v_candidate_profile_id,
        p_candidate_user_id,
        v_slot."expert_id",
        p_slot_id,
        p_session_type,
        'scheduled',
        v_slot."start_time",
        v_slot."end_time",
        COALESCE(p_timezone, v_slot."timezone", 'Asia/Riyadh'),
        v_meeting_link
    )
    RETURNING "id" INTO v_session_id;

    -- 7. Insert session-type-specific detail rows
    IF p_session_type = 'human_interview' THEN
        -- Human calibration: verify interviewer is assigned to this candidate
        IF NOT EXISTS (
            SELECT 1 FROM "candidate_interview_assignments"
            WHERE "candidate_user_id" = p_candidate_user_id
              AND "expert_id" = v_slot."expert_id"
              AND "is_active" = true
        ) THEN
            RAISE EXCEPTION 'Slot does not belong to your assigned interviewer. You can only book sessions with your Jadeer-assigned interviewer.';
        END IF;

        INSERT INTO "human_interview_details" ("session_id", "software_track", "calibration_stage", "candidate_notes")
        VALUES (
            v_session_id,
            COALESCE(p_software_track, 'BACKEND'),
            COALESCE(p_calibration_stage, 'Stage 02B: Human Technical Calibration'),
            p_candidate_notes
        );

    ELSIF p_session_type = 'consultation' THEN
        INSERT INTO "consultation_details" (
            "session_id",
            "topic",
            "topic_title",
            "goal",
            "candidate_message"
        )
        VALUES (
            v_session_id,
            COALESCE(p_consultation_topic, 'GENERAL'),
            COALESCE(p_consultation_topic_title, 'Technical Consultation'),
            p_consultation_goal,
            p_consultation_message
        );
    END IF;

    RETURN jsonb_build_object(
        'success',               true,
        'session_id',            v_session_id,
        'status',                'scheduled',
        'scheduled_start_time',  v_slot."start_time",
        'scheduled_end_time',    v_slot."end_time",
        'timezone',              COALESCE(p_timezone, v_slot."timezone", 'Asia/Riyadh'),
        'meeting_url',           v_meeting_link,
        'slot_id',               p_slot_id,
        'expert', jsonb_build_object(
            'id',        v_expert."id",
            'full_name', v_expert."full_name",
            'initials',  v_expert."initials",
            'title',     v_expert."title",
            'company',   v_expert."company"
        )
    );
END;
$$;

REVOKE ALL ON FUNCTION "book_session_atomic"(TEXT, UUID, session_type, TEXT, TEXT, "SoftwareTrack", TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "book_session_atomic"(TEXT, UUID, session_type, TEXT, TEXT, "SoftwareTrack", TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION "book_session_atomic"(TEXT, UUID, session_type, TEXT, TEXT, "SoftwareTrack", TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION "book_session_atomic"(TEXT, UUID, session_type, TEXT, TEXT, "SoftwareTrack", TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;

-- ── 7. Patch: reschedule_session_atomic — Allow Anon Key + Clerk User ID ────

CREATE OR REPLACE FUNCTION "reschedule_session_atomic"(
    p_session_id         UUID,
    p_candidate_user_id  TEXT,
    p_new_slot_id        UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_session   "sessions"%ROWTYPE;
    v_new_slot  "expert_availability_slots"%ROWTYPE;
    v_old_slot_id UUID;
BEGIN
    -- Allow anon-key callers (Clerk integration)
    IF auth.uid() IS NULL
       AND (auth.jwt() ->> 'role') <> 'service_role'
       AND (auth.jwt() ->> 'role') <> 'anon'
    THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    IF auth.uid() IS NOT NULL THEN
        p_candidate_user_id := auth.uid()::text;
    END IF;

    IF p_candidate_user_id IS NULL OR p_candidate_user_id = '' THEN
        RAISE EXCEPTION 'candidate_user_id is required';
    END IF;

    -- Lock the session
    SELECT * INTO v_session FROM "sessions" WHERE "id" = p_session_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session % not found', p_session_id;
    END IF;

    IF v_session."candidate_user_id" <> p_candidate_user_id THEN
        RAISE EXCEPTION 'Session does not belong to this candidate';
    END IF;

    IF v_session."status" = 'cancelled' THEN
        RAISE EXCEPTION 'Cannot reschedule a cancelled session';
    END IF;

    -- Lock the new slot
    SELECT * INTO v_new_slot FROM "expert_availability_slots" WHERE "id" = p_new_slot_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'New slot % not found', p_new_slot_id;
    END IF;

    IF v_new_slot."status" <> 'available' THEN
        RAISE EXCEPTION 'New slot % is not available', p_new_slot_id;
    END IF;

    -- Enforce same expert invariant
    IF v_new_slot."expert_id" <> v_session."expert_id" THEN
        RAISE EXCEPTION 'Rescheduling must be with the same expert (consultant/interviewer)';
    END IF;

    v_old_slot_id := v_session."slot_id";

    -- Release old slot
    IF v_old_slot_id IS NOT NULL THEN
        UPDATE "expert_availability_slots"
        SET "status" = 'available', "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = v_old_slot_id;
    END IF;

    -- Book new slot
    UPDATE "expert_availability_slots"
    SET "status" = 'booked', "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_new_slot_id;

    -- Update session
    UPDATE "sessions"
    SET "slot_id"               = p_new_slot_id,
        "scheduled_start_time"  = v_new_slot."start_time",
        "scheduled_end_time"    = v_new_slot."end_time",
        "timezone"              = v_new_slot."timezone",
        "updated_at"            = CURRENT_TIMESTAMP
    WHERE "id" = p_session_id;

    RETURN jsonb_build_object(
        'success',               true,
        'session_id',            p_session_id,
        'slot_id',               p_new_slot_id,
        'scheduled_start_time',  v_new_slot."start_time",
        'scheduled_end_time',    v_new_slot."end_time",
        'timezone',              v_new_slot."timezone"
    );
END;
$$;

REVOKE ALL ON FUNCTION "reschedule_session_atomic"(UUID, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "reschedule_session_atomic"(UUID, TEXT, UUID) TO anon;
GRANT EXECUTE ON FUNCTION "reschedule_session_atomic"(UUID, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION "reschedule_session_atomic"(UUID, TEXT, UUID) TO service_role;

-- ── 8. Patch: cancel_session_atomic — Allow Anon Key + Clerk User ID ────────

CREATE OR REPLACE FUNCTION "cancel_session_atomic"(
    p_session_id          UUID,
    p_cancelled_by        TEXT  DEFAULT 'candidate',
    p_cancellation_reason TEXT  DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_session "sessions"%ROWTYPE;
BEGIN
    -- Allow anon-key callers (Clerk integration)
    IF auth.uid() IS NULL
       AND (auth.jwt() ->> 'role') <> 'service_role'
       AND (auth.jwt() ->> 'role') <> 'anon'
    THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    SELECT * INTO v_session FROM "sessions" WHERE "id" = p_session_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session % not found', p_session_id;
    END IF;

    IF v_session."status" = 'cancelled' THEN
        RETURN jsonb_build_object('success', true, 'session_id', p_session_id, 'status', 'cancelled');
    END IF;

    -- Verify caller is the candidate or service_role
    IF auth.uid() IS NOT NULL AND auth.uid()::text = v_session."candidate_user_id" THEN
        -- allowed
    ELSIF (auth.jwt() ->> 'role') = 'service_role' OR (auth.jwt() ->> 'role') = 'anon' THEN
        -- allowed (anon key trusts p_cancelled_by text from frontend)
        NULL;
    ELSIF auth.uid() IS NOT NULL AND (auth.jwt() ->> 'role') <> 'ADMIN' THEN
        IF auth.uid()::text NOT IN (SELECT "user_id" FROM "experts" WHERE "id" = v_session."expert_id") THEN
            RAISE EXCEPTION 'Unauthorized to cancel this session';
        END IF;
    END IF;

    -- Cancel session
    UPDATE "sessions"
    SET "status"               = 'cancelled',
        "cancellation_reason"  = p_cancellation_reason,
        "cancelled_by"         = p_cancelled_by,
        "cancelled_at"         = CURRENT_TIMESTAMP,
        "updated_at"           = CURRENT_TIMESTAMP
    WHERE "id" = p_session_id;

    -- Release the slot
    IF v_session."slot_id" IS NOT NULL THEN
        UPDATE "expert_availability_slots"
        SET "status" = 'available', "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = v_session."slot_id";
    END IF;

    RETURN jsonb_build_object(
        'success',    true,
        'session_id', p_session_id,
        'status',     'cancelled'
    );
END;
$$;

REVOKE ALL ON FUNCTION "cancel_session_atomic"(UUID, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "cancel_session_atomic"(UUID, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION "cancel_session_atomic"(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION "cancel_session_atomic"(UUID, TEXT, TEXT) TO service_role;

-- ── 9. Patch: get_candidate_interview_state — Allow Anon Key + Clerk User ID ─

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
    v_evaluation  RECORD;
    v_expert      RECORD;
BEGIN
    -- Allow anon-key callers (Clerk integration)
    IF auth.uid() IS NULL
       AND (auth.jwt() ->> 'role') <> 'service_role'
       AND (auth.jwt() ->> 'role') <> 'anon'
    THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    IF auth.uid() IS NOT NULL THEN
        p_candidate_user_id := auth.uid()::text;
    END IF;

    IF p_candidate_user_id IS NULL OR p_candidate_user_id = '' THEN
        RAISE EXCEPTION 'p_candidate_user_id is required';
    END IF;

    -- Check for completed session with evaluation
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
                'status', v_session.status
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

    -- Check for active scheduled session
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
                'status', v_session.status
            )
        );
    END IF;

    -- Check for interviewer assignment (candidate should choose time)
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

    -- No assignment → awaiting
    RETURN jsonb_build_object(
        'state',       'awaiting_assignment',
        'is_completed', false,
        'status',      'awaiting_assignment',
        'message',     'Your interviewer has not been assigned yet. Jadeer will notify you when your calibration interview is scheduled.'
    );
END;
$$;

REVOKE ALL ON FUNCTION "get_candidate_interview_state"(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "get_candidate_interview_state"(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION "get_candidate_interview_state"(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION "get_candidate_interview_state"(TEXT) TO service_role;
