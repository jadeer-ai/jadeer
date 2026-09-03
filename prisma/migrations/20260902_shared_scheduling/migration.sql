-- ═══════════════════════════════════════════════════════════════════════════
-- JADEER PLATFORM — SHARED SCHEDULING & SESSION BACKEND MIGRATION
-- ─────────────────────────────────────────────────────────────────────────
-- Unified backend for Stage 02B Human Technical Calibration & 1-to-1 Mentorship.
-- Includes: Core Sessions, Experts, Availability Slots, Interview/Consultation Details,
-- Human Interview Evaluations, Isolated Internal Notes, RLS Policies, and Atomic RPCs.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. PostgreSQL Custom Enums ──────────────────────────────────────────

DO $$ BEGIN
    CREATE TYPE "expert_role" AS ENUM ('INTERVIEWER', 'CONSULTANT', 'BOTH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "slot_status" AS ENUM ('available', 'held', 'booked', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "session_type" AS ENUM ('human_interview', 'consultation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "session_status" AS ENUM ('scheduled', 'completed', 'cancelled', 'in_progress', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "evaluation_recommendation" AS ENUM ('STRONG_HIRE', 'HIRE', 'CALIBRATED_JUNIOR', 'NEEDS_PRACTICE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ── 2. Table: experts ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "experts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT UNIQUE,
    "role" "expert_role" NOT NULL DEFAULT 'BOTH',
    "full_name" TEXT NOT NULL,
    "initials" TEXT,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "bio" TEXT,
    "track" "SoftwareTrack" NOT NULL DEFAULT 'BACKEND',
    "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rating" NUMERIC(3,2) NOT NULL DEFAULT 5.00,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "sessions_completed" INTEGER NOT NULL DEFAULT 0,
    "avatar_url" TEXT,
    "languages" TEXT[] DEFAULT ARRAY['Arabic', 'English']::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "experts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "experts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "idx_experts_role" ON "experts"("role");
CREATE INDEX IF NOT EXISTS "idx_experts_track" ON "experts"("track");
CREATE INDEX IF NOT EXISTS "idx_experts_is_active" ON "experts"("is_active");

-- ── 3. Table: expert_availability_slots ──────────────────────────────────

CREATE TABLE IF NOT EXISTS "expert_availability_slots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "expert_id" TEXT NOT NULL,
    "start_time" TIMESTAMPTZ NOT NULL,
    "end_time" TIMESTAMPTZ NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Riyadh',
    "status" "slot_status" NOT NULL DEFAULT 'available',
    "held_until" TIMESTAMPTZ,
    "held_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expert_availability_slots_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "expert_availability_slots_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE CASCADE,
    CONSTRAINT "chk_slot_time_order" CHECK ("end_time" > "start_time")
);

CREATE INDEX IF NOT EXISTS "idx_expert_slots_expert_status" ON "expert_availability_slots"("expert_id", "status");
CREATE INDEX IF NOT EXISTS "idx_expert_slots_start_time" ON "expert_availability_slots"("start_time");
CREATE INDEX IF NOT EXISTS "idx_expert_slots_status" ON "expert_availability_slots"("status");

-- ── 4. Table: sessions (Core Shared Booking Entity) ─────────────────────

CREATE TABLE IF NOT EXISTS "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "candidate_id" TEXT NOT NULL,
    "candidate_user_id" TEXT NOT NULL,
    "expert_id" TEXT NOT NULL,
    "slot_id" UUID,
    "session_type" "session_type" NOT NULL,
    "status" "session_status" NOT NULL DEFAULT 'scheduled',
    "scheduled_start_time" TIMESTAMPTZ NOT NULL,
    "scheduled_end_time" TIMESTAMPTZ NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Riyadh',
    "meeting_provider" TEXT DEFAULT 'custom',
    "meeting_url" TEXT,
    "cancellation_reason" TEXT,
    "cancelled_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "rescheduled_from_session_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "sessions_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "student_profiles"("id") ON DELETE RESTRICT,
    CONSTRAINT "sessions_candidate_user_id_fkey" FOREIGN KEY ("candidate_user_id") REFERENCES "users"("id") ON DELETE RESTRICT,
    CONSTRAINT "sessions_expert_id_fkey" FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE RESTRICT,
    CONSTRAINT "sessions_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "expert_availability_slots"("id") ON DELETE SET NULL,
    CONSTRAINT "sessions_rescheduled_from_fkey" FOREIGN KEY ("rescheduled_from_session_id") REFERENCES "sessions"("id") ON DELETE SET NULL,
    CONSTRAINT "chk_session_time_order" CHECK ("scheduled_end_time" > "scheduled_start_time")
);

CREATE INDEX IF NOT EXISTS "idx_sessions_candidate_user" ON "sessions"("candidate_user_id");
CREATE INDEX IF NOT EXISTS "idx_sessions_expert" ON "sessions"("expert_id");
CREATE INDEX IF NOT EXISTS "idx_sessions_type_status" ON "sessions"("session_type", "status");
CREATE INDEX IF NOT EXISTS "idx_sessions_start_time" ON "sessions"("scheduled_start_time");

-- ── 5. Table: human_interview_details ───────────────────────────────────

CREATE TABLE IF NOT EXISTS "human_interview_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL UNIQUE,
    "software_track" "SoftwareTrack" NOT NULL DEFAULT 'BACKEND',
    "calibration_stage" TEXT NOT NULL DEFAULT 'Stage 02B: Human Technical Calibration',
    "candidate_notes" TEXT,
    "target_role" TEXT DEFAULT 'Junior Software Engineer',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "human_interview_details_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "human_interview_details_session_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_human_interview_track" ON "human_interview_details"("software_track");

-- ── 6. Table: consultation_details ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS "consultation_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL UNIQUE,
    "topic" TEXT NOT NULL,
    "topic_title" TEXT NOT NULL,
    "goal" TEXT,
    "candidate_message" TEXT,
    "outcome_summary" TEXT,
    "action_items" JSONB DEFAULT '[]'::JSONB,
    "deliverables" JSONB DEFAULT '{}'::JSONB,
    "candidate_rating" INTEGER CHECK ("candidate_rating" >= 1 AND "candidate_rating" <= 5),
    "candidate_feedback" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultation_details_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "consultation_details_session_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_consultation_topic" ON "consultation_details"("topic");

-- ── 7. Table: human_interview_evaluations ────────────────────────────────

CREATE TABLE IF NOT EXISTS "human_interview_evaluations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL UNIQUE,
    "evaluator_id" TEXT NOT NULL,
    "technical_score" NUMERIC(5,2) NOT NULL CHECK ("technical_score" >= 0 AND "technical_score" <= 100),
    "problem_solving_score" NUMERIC(5,2) NOT NULL CHECK ("problem_solving_score" >= 0 AND "problem_solving_score" <= 100),
    "communication_score" NUMERIC(5,2) NOT NULL CHECK ("communication_score" >= 0 AND "communication_score" <= 100),
    "reasoning_score" NUMERIC(5,2) NOT NULL CHECK ("reasoning_score" >= 0 AND "reasoning_score" <= 100),
    "overall_score" NUMERIC(5,2) NOT NULL CHECK ("overall_score" >= 0 AND "overall_score" <= 100),
    "recommendation" TEXT NOT NULL,
    "candidate_visible_feedback" TEXT NOT NULL,
    "strengths" JSONB DEFAULT '[]'::JSONB,
    "recommendations" JSONB DEFAULT '[]'::JSONB,
    "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "human_interview_evaluations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "human_interview_evaluations_session_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE,
    CONSTRAINT "human_interview_evaluations_evaluator_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "experts"("id") ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "idx_interview_evaluations_evaluator" ON "human_interview_evaluations"("evaluator_id");
CREATE INDEX IF NOT EXISTS "idx_interview_evaluations_overall_score" ON "human_interview_evaluations"("overall_score");

-- ── 8. Table: human_interview_internal_notes ────────────────────────────
-- STRICT SECURITY: Evaluator-only internal notes isolated from candidates.

CREATE TABLE IF NOT EXISTS "human_interview_internal_notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "evaluation_id" UUID NOT NULL UNIQUE,
    "evaluator_id" TEXT NOT NULL,
    "internal_notes" TEXT NOT NULL,
    "private_flags" JSONB DEFAULT '{}'::JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "human_interview_internal_notes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "human_interview_internal_notes_eval_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "human_interview_evaluations"("id") ON DELETE CASCADE,
    CONSTRAINT "human_interview_internal_notes_evaluator_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "experts"("id") ON DELETE RESTRICT
);

-- ═══════════════════════════════════════════════════════════════════════════
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE "experts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "expert_availability_slots" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "human_interview_details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "consultation_details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "human_interview_evaluations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "human_interview_internal_notes" ENABLE ROW LEVEL SECURITY;

-- ── experts policies ──
DROP POLICY IF EXISTS "experts_public_read_active" ON "experts";
CREATE POLICY "experts_public_read_active" ON "experts"
    FOR SELECT
    USING ("is_active" = true);

DROP POLICY IF EXISTS "experts_self_update" ON "experts";
CREATE POLICY "experts_self_update" ON "experts"
    FOR UPDATE
    USING ("user_id" = auth.uid()::text OR (auth.jwt() ->> 'role') = 'ADMIN');

-- ── expert_availability_slots policies ──
DROP POLICY IF EXISTS "slots_public_read_available" ON "expert_availability_slots";
CREATE POLICY "slots_public_read_available" ON "expert_availability_slots"
    FOR SELECT
    USING ("status" = 'available' OR "expert_id" IN (SELECT "id" FROM "experts" WHERE "user_id" = auth.uid()::text));

DROP POLICY IF EXISTS "slots_expert_manage" ON "expert_availability_slots";
CREATE POLICY "slots_expert_manage" ON "expert_availability_slots"
    FOR ALL
    USING ("expert_id" IN (SELECT "id" FROM "experts" WHERE "user_id" = auth.uid()::text) OR (auth.jwt() ->> 'role') = 'ADMIN');

-- ── sessions policies ──
DROP POLICY IF EXISTS "sessions_candidate_read_own" ON "sessions";
CREATE POLICY "sessions_candidate_read_own" ON "sessions"
    FOR SELECT
    USING ("candidate_user_id" = auth.uid()::text);

DROP POLICY IF EXISTS "sessions_expert_read_assigned" ON "sessions";
CREATE POLICY "sessions_expert_read_assigned" ON "sessions"
    FOR SELECT
    USING ("expert_id" IN (SELECT "id" FROM "experts" WHERE "user_id" = auth.uid()::text));

DROP POLICY IF EXISTS "sessions_admin_all" ON "sessions";
CREATE POLICY "sessions_admin_all" ON "sessions"
    FOR ALL
    USING ((auth.jwt() ->> 'role') = 'ADMIN');

-- ── human_interview_details policies ──
DROP POLICY IF EXISTS "hid_candidate_and_expert_read" ON "human_interview_details";
CREATE POLICY "hid_candidate_and_expert_read" ON "human_interview_details"
    FOR SELECT
    USING (
        "session_id" IN (
            SELECT "id" FROM "sessions"
            WHERE "candidate_user_id" = auth.uid()::text
               OR "expert_id" IN (SELECT "id" FROM "experts" WHERE "user_id" = auth.uid()::text)
        )
        OR (auth.jwt() ->> 'role') = 'ADMIN'
    );

-- ── consultation_details policies ──
DROP POLICY IF EXISTS "cd_candidate_and_expert_read" ON "consultation_details";
CREATE POLICY "cd_candidate_and_expert_read" ON "consultation_details"
    FOR SELECT
    USING (
        "session_id" IN (
            SELECT "id" FROM "sessions"
            WHERE "candidate_user_id" = auth.uid()::text
               OR "expert_id" IN (SELECT "id" FROM "experts" WHERE "user_id" = auth.uid()::text)
        )
        OR (auth.jwt() ->> 'role') = 'ADMIN'
    );

DROP POLICY IF EXISTS "cd_expert_update_deliverables" ON "consultation_details";
CREATE POLICY "cd_expert_update_deliverables" ON "consultation_details"
    FOR UPDATE
    USING (
        "session_id" IN (
            SELECT "id" FROM "sessions"
            WHERE "expert_id" IN (SELECT "id" FROM "experts" WHERE "user_id" = auth.uid()::text)
        )
        OR (auth.jwt() ->> 'role') = 'ADMIN'
    );

-- ── human_interview_evaluations policies ──
DROP POLICY IF EXISTS "eval_candidate_read_own" ON "human_interview_evaluations";
CREATE POLICY "eval_candidate_read_own" ON "human_interview_evaluations"
    FOR SELECT
    USING (
        "session_id" IN (
            SELECT "id" FROM "sessions"
            WHERE "candidate_user_id" = auth.uid()::text
        )
    );

DROP POLICY IF EXISTS "eval_expert_manage" ON "human_interview_evaluations";
CREATE POLICY "eval_expert_manage" ON "human_interview_evaluations"
    FOR ALL
    USING (
        "evaluator_id" IN (SELECT "id" FROM "experts" WHERE "user_id" = auth.uid()::text)
        OR (auth.jwt() ->> 'role') = 'ADMIN'
    );

-- ── human_interview_internal_notes policies (STRICT: NO CANDIDATE ACCESS) ──
DROP POLICY IF EXISTS "internal_notes_expert_only" ON "human_interview_internal_notes";
CREATE POLICY "internal_notes_expert_only" ON "human_interview_internal_notes"
    FOR ALL
    USING (
        "evaluator_id" IN (SELECT "id" FROM "experts" WHERE "user_id" = auth.uid()::text)
        OR (auth.jwt() ->> 'role') = 'ADMIN'
    );

-- ═══════════════════════════════════════════════════════════════════════════
-- 10. ATOMIC POSTGRESQL RPC FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- ── RPC 1: book_session_atomic ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION book_session_atomic(
    p_candidate_user_id TEXT,
    p_slot_id UUID,
    p_session_type "session_type",
    p_timezone TEXT DEFAULT 'Asia/Riyadh',
    p_meeting_url TEXT DEFAULT NULL,
    p_software_track "SoftwareTrack" DEFAULT NULL,
    p_candidate_notes TEXT DEFAULT NULL,
    p_calibration_stage TEXT DEFAULT 'Stage 02B: Human Technical Calibration',
    p_consultation_topic TEXT DEFAULT NULL,
    p_consultation_topic_title TEXT DEFAULT NULL,
    p_consultation_goal TEXT DEFAULT NULL,
    p_consultation_message TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_slot "expert_availability_slots"%ROWTYPE;
    v_candidate_profile_id TEXT;
    v_session_id UUID;
    v_expert "experts"%ROWTYPE;
    v_meeting_link TEXT;
BEGIN
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
        IF NOT EXISTS (SELECT 1 FROM "users" WHERE "id" = p_candidate_user_id) THEN
            RAISE EXCEPTION 'Candidate user % not found', p_candidate_user_id;
        END IF;
        v_candidate_profile_id := p_candidate_user_id;
    END IF;

    -- 3. Resolve Expert
    SELECT * INTO v_expert
    FROM "experts"
    WHERE "id" = v_slot."expert_id";

    -- 4. Mark slot as booked
    UPDATE "expert_availability_slots"
    SET "status" = 'booked', "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_slot_id;

    -- 5. Prepare meeting URL placeholder if not provided
    v_meeting_link := COALESCE(
        p_meeting_url,
        'https://meet.jadeer.io/' || p_session_type::TEXT || '/jad-' || substr(p_slot_id::TEXT, 1, 8)
    );

    -- 6. Insert Core Session
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
        "meeting_provider",
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
        COALESCE(p_timezone, v_slot."timezone"),
        'custom',
        v_meeting_link
    )
    RETURNING "id" INTO v_session_id;

    -- 7. Insert Subtype Details
    IF p_session_type = 'human_interview' THEN
        INSERT INTO "human_interview_details" (
            "session_id",
            "software_track",
            "calibration_stage",
            "candidate_notes"
        )
        VALUES (
            v_session_id,
            COALESCE(p_software_track, v_expert."track", 'BACKEND'::"SoftwareTrack"),
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
            COALESCE(p_consultation_topic, 'system-design'),
            COALESCE(p_consultation_topic_title, '1-to-1 Technical Consultation'),
            p_consultation_goal,
            p_consultation_message
        );
    END IF;

    -- 8. Return response payload
    RETURN jsonb_build_object(
        'success', true,
        'session_id', v_session_id,
        'expert_id', v_slot."expert_id",
        'expert_name', v_expert."full_name",
        'expert_title', v_expert."title",
        'expert_company', v_expert."company",
        'slot_id', p_slot_id,
        'session_type', p_session_type,
        'scheduled_start_time', v_slot."start_time",
        'scheduled_end_time', v_slot."end_time",
        'meeting_url', v_meeting_link,
        'status', 'scheduled'
    );
END;
$$;

-- ── RPC 2: cancel_session_atomic ────────────────────────────────────────

CREATE OR REPLACE FUNCTION cancel_session_atomic(
    p_session_id UUID,
    p_cancelled_by TEXT,
    p_cancellation_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session "sessions"%ROWTYPE;
BEGIN
    SELECT * INTO v_session
    FROM "sessions"
    WHERE "id" = p_session_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session % not found', p_session_id;
    END IF;

    IF v_session."status" = 'cancelled' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Session is already cancelled');
    END IF;

    -- Update session
    UPDATE "sessions"
    SET "status" = 'cancelled',
        "cancelled_by" = p_cancelled_by,
        "cancellation_reason" = p_cancellation_reason,
        "cancelled_at" = CURRENT_TIMESTAMP,
        "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_session_id;

    -- Reopen slot if attached
    IF v_session."slot_id" IS NOT NULL THEN
        UPDATE "expert_availability_slots"
        SET "status" = 'available', "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = v_session."slot_id";
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'session_id', p_session_id,
        'status', 'cancelled'
    );
END;
$$;

-- ── RPC 3: submit_human_interview_evaluation_atomic ─────────────────────

CREATE OR REPLACE FUNCTION submit_human_interview_evaluation_atomic(
    p_session_id UUID,
    p_evaluator_id TEXT,
    p_technical_score NUMERIC,
    p_problem_solving_score NUMERIC,
    p_communication_score NUMERIC,
    p_reasoning_score NUMERIC,
    p_overall_score NUMERIC,
    p_recommendation TEXT,
    p_candidate_visible_feedback TEXT,
    p_internal_notes TEXT DEFAULT NULL,
    p_strengths JSONB DEFAULT '[]'::JSONB,
    p_recommendations JSONB DEFAULT '[]'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_eval_id UUID;
BEGIN
    -- 1. Insert candidate-visible evaluation
    INSERT INTO "human_interview_evaluations" (
        "session_id",
        "evaluator_id",
        "technical_score",
        "problem_solving_score",
        "communication_score",
        "reasoning_score",
        "overall_score",
        "recommendation",
        "candidate_visible_feedback",
        "strengths",
        "recommendations",
        "submitted_at"
    )
    VALUES (
        p_session_id,
        p_evaluator_id,
        p_technical_score,
        p_problem_solving_score,
        p_communication_score,
        p_reasoning_score,
        p_overall_score,
        p_recommendation,
        p_candidate_visible_feedback,
        COALESCE(p_strengths, '[]'::JSONB),
        COALESCE(p_recommendations, '[]'::JSONB),
        CURRENT_TIMESTAMP
    )
    RETURNING "id" INTO v_eval_id;

    -- 2. Insert isolated internal deliberation notes (gated from candidate)
    IF p_internal_notes IS NOT NULL AND trim(p_internal_notes) <> '' THEN
        INSERT INTO "human_interview_internal_notes" (
            "evaluation_id",
            "evaluator_id",
            "internal_notes"
        )
        VALUES (
            v_eval_id,
            p_evaluator_id,
            p_internal_notes
        );
    END IF;

    -- 3. Mark session as completed
    UPDATE "sessions"
    SET "status" = 'completed', "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_session_id;

    -- 4. Update expert session counter
    UPDATE "experts"
    SET "sessions_completed" = "sessions_completed" + 1, "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_evaluator_id;

    RETURN jsonb_build_object(
        'success', true,
        'evaluation_id', v_eval_id,
        'session_id', p_session_id,
        'overall_score', p_overall_score,
        'status', 'completed'
    );
END;
$$;

-- ── RPC 4: get_candidate_human_interview_status ─────────────────────────

CREATE OR REPLACE FUNCTION get_candidate_human_interview_status(p_candidate_user_id TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(
        (
            SELECT jsonb_build_object(
                'has_interview', true,
                'is_completed', (s."status" = 'completed'),
                'session_id', s."id",
                'status', s."status",
                'scheduled_start_time', s."scheduled_start_time",
                'scheduled_end_time', s."scheduled_end_time",
                'timezone', s."timezone",
                'meeting_url', s."meeting_url",
                'expert_name', e."full_name",
                'expert_title', e."title",
                'expert_company', e."company",
                'overall_score', ev."overall_score",
                'recommendation', ev."recommendation",
                'candidate_feedback', ev."candidate_visible_feedback",
                'strengths', ev."strengths",
                'recommendations', ev."recommendations"
            )
            FROM "sessions" s
            JOIN "experts" e ON e."id" = s."expert_id"
            LEFT JOIN "human_interview_evaluations" ev ON ev."session_id" = s."id"
            WHERE s."candidate_user_id" = p_candidate_user_id
              AND s."session_type" = 'human_interview'
              AND s."status" <> 'cancelled'
            ORDER BY s."created_at" DESC
            LIMIT 1
        ),
        jsonb_build_object('has_interview', false, 'is_completed', false, 'status', 'not_scheduled')
    );
$$;
