-- ═══════════════════════════════════════════════════════════════════════════
-- JADEER PLATFORM — HUMAN TECHNICAL CALIBRATION END-TO-END MIGRATION
-- ─────────────────────────────────────────────────────────────────────────
-- Authoritative Supabase Backend for Human Calibration:
-- 1. Candidate Interviewer Assignment Table & RLS
-- 2. Scoped Slot Visibility RLS (Candidates can only see assigned interviewer's slots)
-- 3. Partial Unique Index Preventing Double-Booking on Active Slots
-- 4. Atomic book_session_atomic with DB-level Assigned Expert Verification
-- 5. Atomic reschedule_session_atomic (Same Interviewer Guard & Atomic Reopen)
-- 6. Authoritative submit_human_interview_evaluation_atomic
-- 7. get_candidate_human_interview_status with Backend-Derived Journey State
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Table: candidate_interview_assignments ───────────────────────────
CREATE TABLE IF NOT EXISTS "candidate_interview_assignments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "candidate_user_id" TEXT NOT NULL UNIQUE,
    "expert_id" TEXT NOT NULL,
    "assigned_by" TEXT NOT NULL DEFAULT 'system',
    "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_interview_assignments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "candidate_interview_assignments_candidate_user_id_fkey"
        FOREIGN KEY ("candidate_user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "candidate_interview_assignments_expert_id_fkey"
        FOREIGN KEY ("expert_id") REFERENCES "experts"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_cia_candidate_user_id" ON "candidate_interview_assignments"("candidate_user_id");
CREATE INDEX IF NOT EXISTS "idx_cia_expert_id" ON "candidate_interview_assignments"("expert_id");
CREATE INDEX IF NOT EXISTS "idx_cia_active" ON "candidate_interview_assignments"("candidate_user_id", "is_active");

-- ── 2. Database Constraints & Indexes on sessions ────────────────────────
-- Prevent multiple active (non-cancelled) bookings on the same availability slot
CREATE UNIQUE INDEX IF NOT EXISTS "idx_unique_active_slot_booking"
    ON "sessions"("slot_id")
    WHERE "status" NOT IN ('cancelled');

-- Optimize session queries
CREATE INDEX IF NOT EXISTS "idx_sessions_candidate_user_id" ON "sessions"("candidate_user_id");
CREATE INDEX IF NOT EXISTS "idx_sessions_expert_id" ON "sessions"("expert_id");
CREATE INDEX IF NOT EXISTS "idx_sessions_type_status" ON "sessions"("session_type", "status");
CREATE INDEX IF NOT EXISTS "idx_sessions_scheduled_start" ON "sessions"("scheduled_start_time");

-- ── 3. RLS Policies: candidate_interview_assignments ────────────────────
ALTER TABLE "candidate_interview_assignments" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cia_candidate_read_own" ON "candidate_interview_assignments";
CREATE POLICY "cia_candidate_read_own" ON "candidate_interview_assignments"
    FOR SELECT
    USING ("candidate_user_id" = auth.uid()::text);

DROP POLICY IF EXISTS "cia_expert_read_assigned" ON "candidate_interview_assignments";
CREATE POLICY "cia_expert_read_assigned" ON "candidate_interview_assignments"
    FOR SELECT
    USING ("expert_id" IN (SELECT "id" FROM "experts" WHERE "user_id" = auth.uid()::text));

DROP POLICY IF EXISTS "cia_admin_all" ON "candidate_interview_assignments";
CREATE POLICY "cia_admin_all" ON "candidate_interview_assignments"
    FOR ALL
    USING ((auth.jwt() ->> 'role') = 'ADMIN');

-- ── 4. RLS Policies: expert_availability_slots (Strict Scoping) ─────────
-- Candidates can ONLY read available slots of their currently assigned interviewer
DROP POLICY IF EXISTS "slots_public_read_available" ON "expert_availability_slots";
DROP POLICY IF EXISTS "slots_candidate_read_assigned" ON "expert_availability_slots";

CREATE POLICY "slots_candidate_read_assigned" ON "expert_availability_slots"
    FOR SELECT
    USING (
        -- Expert can see their own slots
        "expert_id" IN (SELECT "id" FROM "experts" WHERE "user_id" = auth.uid()::text)
        OR (auth.jwt() ->> 'role') = 'ADMIN'
        -- Candidate can ONLY see available slots if expert is currently assigned to them
        OR (
            "status" = 'available'
            AND "expert_id" IN (
                SELECT "expert_id"
                FROM "candidate_interview_assignments"
                WHERE "candidate_user_id" = auth.uid()::text
                  AND "is_active" = true
            )
        )
    );

-- ── 5. RPC: book_session_atomic (with DB-level Assigned Interviewer Guard)
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
SET search_path = public, pg_temp
AS $$
DECLARE
    v_slot "expert_availability_slots"%ROWTYPE;
    v_assigned_expert_id TEXT;
    v_candidate_profile_id TEXT;
    v_session_id UUID;
    v_expert "experts"%ROWTYPE;
    v_meeting_link TEXT;
BEGIN
    -- Authentication check and candidate identity derivation
    IF auth.uid() IS NULL AND (auth.jwt() ->> 'role') <> 'service_role' THEN
        RAISE EXCEPTION 'Authentication required: Caller is not authenticated';
    END IF;

    IF auth.uid() IS NOT NULL THEN
        p_candidate_user_id := auth.uid()::text;
    END IF;

    -- 1. Lock the requested slot with FOR UPDATE
    SELECT * INTO v_slot
    FROM "expert_availability_slots"
    WHERE "id" = p_slot_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Availability slot % not found', p_slot_id;
    END IF;

    IF v_slot."status" <> 'available' THEN
        RAISE EXCEPTION 'Slot % is no longer available (status: %)', p_slot_id, v_slot."status";
    END IF;

    -- 2. DB-LEVEL GUARD: For Human Interview, candidate MUST have this expert assigned
    IF p_session_type = 'human_interview' THEN
        SELECT "expert_id" INTO v_assigned_expert_id
        FROM "candidate_interview_assignments"
        WHERE "candidate_user_id" = p_candidate_user_id
          AND "is_active" = true;

        IF v_assigned_expert_id IS NULL THEN
            RAISE EXCEPTION 'No calibration interviewer has been assigned to candidate %', p_candidate_user_id;
        END IF;

        IF v_assigned_expert_id <> v_slot."expert_id" THEN
            RAISE EXCEPTION 'Unauthorized: Slot % belongs to expert %, but candidate is assigned to expert %',
                p_slot_id, v_slot."expert_id", v_assigned_expert_id;
        END IF;
    END IF;

    -- 3. Resolve Candidate Profile ID from student_profiles
    SELECT "id" INTO v_candidate_profile_id
    FROM "student_profiles"
    WHERE "userId" = p_candidate_user_id;

    IF v_candidate_profile_id IS NULL THEN
        RAISE EXCEPTION 'Candidate student profile not found for user %. A completed student profile is required to book a session.', p_candidate_user_id;
    END IF;

    -- 4. Resolve Expert
    SELECT * INTO v_expert
    FROM "experts"
    WHERE "id" = v_slot."expert_id";

    -- 5. Mark slot as booked
    UPDATE "expert_availability_slots"
    SET "status" = 'booked', "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_slot_id;

    -- 6. Meeting URL placeholder (nullable if unconfigured)
    v_meeting_link := COALESCE(
        p_meeting_url,
        'https://meet.jadeer.io/' || p_session_type::TEXT || '/jad-' || substr(p_slot_id::TEXT, 1, 8)
    );

    -- 7. Insert Core Session
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

    -- 8. Insert Type-Specific Details
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

    RETURN jsonb_build_object(
        'success', true,
        'session_id', v_session_id,
        'expert_id', v_slot."expert_id",
        'expert_name', v_expert."full_name",
        'expert_title', v_expert."title",
        'expert_company', v_expert."company",
        'expert_initials', v_expert."initials",
        'slot_id', p_slot_id,
        'session_type', p_session_type,
        'scheduled_start_time', v_slot."start_time",
        'scheduled_end_time', v_slot."end_time",
        'timezone', COALESCE(p_timezone, v_slot."timezone"),
        'meeting_url', v_meeting_link,
        'status', 'scheduled'
    );
END;
$$;

-- ── 6. RPC: reschedule_session_atomic (Same Interviewer Guard & Atomic Reopen)
CREATE OR REPLACE FUNCTION reschedule_session_atomic(
    p_session_id UUID,
    p_candidate_user_id TEXT,
    p_new_slot_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_session "sessions"%ROWTYPE;
    v_old_slot_id UUID;
    v_new_slot "expert_availability_slots"%ROWTYPE;
    v_expert "experts"%ROWTYPE;
BEGIN
    -- Authentication check and candidate identity derivation
    IF auth.uid() IS NULL AND (auth.jwt() ->> 'role') <> 'service_role' THEN
        RAISE EXCEPTION 'Authentication required: Caller is not authenticated';
    END IF;

    IF auth.uid() IS NOT NULL THEN
        p_candidate_user_id := auth.uid()::text;
    END IF;

    -- 1. Lock existing session
    SELECT * INTO v_session
    FROM "sessions"
    WHERE "id" = p_session_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session % not found', p_session_id;
    END IF;

    -- Security: verify candidate owns the session
    IF v_session."candidate_user_id" <> p_candidate_user_id THEN
        RAISE EXCEPTION 'Unauthorized: Candidate % does not own session %', p_candidate_user_id, p_session_id;
    END IF;

    IF v_session."status" <> 'scheduled' THEN
        RAISE EXCEPTION 'Only scheduled sessions can be rescheduled (current status: %)', v_session."status";
    END IF;

    -- 2. Lock requested new slot
    SELECT * INTO v_new_slot
    FROM "expert_availability_slots"
    WHERE "id" = p_new_slot_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'New slot % not found', p_new_slot_id;
    END IF;

    IF v_new_slot."status" <> 'available' THEN
        RAISE EXCEPTION 'Slot % is no longer available (status: %)', p_new_slot_id, v_new_slot."status";
    END IF;

    -- Guard: Rescheduling MUST be with the SAME assigned interviewer
    IF v_new_slot."expert_id" <> v_session."expert_id" THEN
        RAISE EXCEPTION 'Unauthorized: Rescheduling is only allowed with the same assigned interviewer (%)',
            v_session."expert_id";
    END IF;

    v_old_slot_id := v_session."slot_id";

    -- 3. Release old slot back to 'available'
    IF v_old_slot_id IS NOT NULL THEN
        UPDATE "expert_availability_slots"
        SET "status" = 'available', "updated_at" = CURRENT_TIMESTAMP
        WHERE "id" = v_old_slot_id;
    END IF;

    -- 4. Mark new slot as booked
    UPDATE "expert_availability_slots"
    SET "status" = 'booked', "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_new_slot_id;

    -- 5. Update session schedule
    UPDATE "sessions"
    SET "slot_id" = p_new_slot_id,
        "scheduled_start_time" = v_new_slot."start_time",
        "scheduled_end_time" = v_new_slot."end_time",
        "timezone" = v_new_slot."timezone",
        "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_session_id;

    -- 6. Resolve Expert details
    SELECT * INTO v_expert FROM "experts" WHERE "id" = v_session."expert_id";

    RETURN jsonb_build_object(
        'success', true,
        'session_id', p_session_id,
        'slot_id', p_new_slot_id,
        'expert_id', v_session."expert_id",
        'expert_name', v_expert."full_name",
        'expert_title', v_expert."title",
        'scheduled_start_time', v_new_slot."start_time",
        'scheduled_end_time', v_new_slot."end_time",
        'timezone', v_new_slot."timezone",
        'status', 'scheduled'
    );
END;
$$;

-- ── 7. RPC: submit_calibration_evaluation_atomic ─────────────────────────
-- Authoritative evaluation submission: Only assigned interviewer or admin can submit.
-- Updates session status to 'completed' and triggers candidate stage completion.
CREATE OR REPLACE FUNCTION submit_calibration_evaluation_atomic(
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
SET search_path = public, pg_temp
AS $$
DECLARE
    v_session "sessions"%ROWTYPE;
    v_eval_id UUID;
BEGIN
    -- Security Guard: Require authentication
    IF auth.uid() IS NULL AND (auth.jwt() ->> 'role') <> 'service_role' THEN
        RAISE EXCEPTION 'Authentication required: Caller is not authenticated';
    END IF;

    -- 1. Lock and verify session
    SELECT * INTO v_session
    FROM "sessions"
    WHERE "id" = p_session_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session % not found', p_session_id;
    END IF;

    IF v_session."status" = 'completed' THEN
        RAISE EXCEPTION 'Session % is already evaluated and marked completed', p_session_id;
    END IF;

    -- Security Guard: Candidate CANNOT submit evaluation or mark calibration completed
    IF auth.uid() IS NOT NULL AND auth.uid()::text = v_session."candidate_user_id" THEN
        RAISE EXCEPTION 'Forbidden: Candidates cannot evaluate themselves or complete the calibration stage';
    END IF;

    -- Guard: Only assigned interviewer or admin can submit evaluation
    IF v_session."expert_id" <> p_evaluator_id AND (auth.jwt() ->> 'role') <> 'ADMIN' THEN
        RAISE EXCEPTION 'Unauthorized: Only the assigned interviewer % can evaluate session %',
            v_session."expert_id", p_session_id;
    END IF;

    IF auth.uid() IS NOT NULL AND (auth.jwt() ->> 'role') <> 'ADMIN' THEN
        IF auth.uid()::text NOT IN (SELECT "user_id" FROM "experts" WHERE "id" = p_evaluator_id) THEN
            RAISE EXCEPTION 'Forbidden: Caller is not the assigned evaluator for this session';
        END IF;
    END IF;

    -- 2. Insert candidate-visible evaluation
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

    -- 3. Insert isolated internal deliberation notes (gated from candidate)
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

    -- 4. Mark session as completed
    UPDATE "sessions"
    SET "status" = 'completed', "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_session_id;

    -- 5. Update expert session counter
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

-- ── 8. RPC: get_candidate_interview_state ────────────────────────────────
-- Clean backend-derived status for candidate journey progress:
-- Returns: awaiting_assignment | choose_time | confirmed | completed
CREATE OR REPLACE FUNCTION get_candidate_interview_state(p_candidate_user_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_assignment "candidate_interview_assignments"%ROWTYPE;
    v_session "sessions"%ROWTYPE;
    v_eval "human_interview_evaluations"%ROWTYPE;
    v_expert "experts"%ROWTYPE;
BEGIN
    -- 1. Check completed or scheduled session
    SELECT * INTO v_session
    FROM "sessions"
    WHERE "candidate_user_id" = p_candidate_user_id
      AND "session_type" = 'human_interview'
      AND "status" <> 'cancelled'
    ORDER BY "created_at" DESC
    LIMIT 1;

    IF FOUND THEN
        SELECT * INTO v_expert FROM "experts" WHERE "id" = v_session."expert_id";

        IF v_session."status" = 'completed' THEN
            SELECT * INTO v_eval FROM "human_interview_evaluations" WHERE "session_id" = v_session."id";
            RETURN jsonb_build_object(
                'state', 'completed',
                'is_completed', true,
                'session_id', v_session."id",
                'status', 'completed',
                'scheduled_start_time', v_session."scheduled_start_time",
                'scheduled_end_time', v_session."scheduled_end_time",
                'timezone', v_session."timezone",
                'meeting_url', v_session."meeting_url",
                'expert', jsonb_build_object(
                    'id', v_expert."id",
                    'full_name', v_expert."full_name",
                    'initials', v_expert."initials",
                    'title', v_expert."title",
                    'company', v_expert."company",
                    'rating', v_expert."rating"
                ),
                'evaluation', jsonb_build_object(
                    'overall_score', v_eval."overall_score",
                    'technical_score', v_eval."technical_score",
                    'problem_solving_score', v_eval."problem_solving_score",
                    'communication_score', v_eval."communication_score",
                    'reasoning_score', v_eval."reasoning_score",
                    'recommendation', v_eval."recommendation",
                    'candidate_visible_feedback', v_eval."candidate_visible_feedback",
                    'strengths', v_eval."strengths",
                    'recommendations', v_eval."recommendations"
                )
            );
        ELSIF v_session."status" = 'scheduled' OR v_session."status" = 'in_progress' THEN
            RETURN jsonb_build_object(
                'state', 'confirmed',
                'is_completed', false,
                'session_id', v_session."id",
                'status', v_session."status",
                'scheduled_start_time', v_session."scheduled_start_time",
                'scheduled_end_time', v_session."scheduled_end_time",
                'timezone', v_session."timezone",
                'meeting_url', v_session."meeting_url",
                'expert', jsonb_build_object(
                    'id', v_expert."id",
                    'full_name', v_expert."full_name",
                    'initials', v_expert."initials",
                    'title', v_expert."title",
                    'company', v_expert."company",
                    'rating', v_expert."rating",
                    'specialties', v_expert."specialties"
                )
            );
        END IF;
    END IF;

    -- 2. Check if interviewer has been assigned
    SELECT * INTO v_assignment
    FROM "candidate_interview_assignments"
    WHERE "candidate_user_id" = p_candidate_user_id
      AND "is_active" = true;

    IF FOUND THEN
        SELECT * INTO v_expert FROM "experts" WHERE "id" = v_assignment."expert_id";
        RETURN jsonb_build_object(
            'state', 'choose_time',
            'is_completed', false,
            'status', 'choose_time',
            'assigned_by', v_assignment."assigned_by",
            'assigned_at', v_assignment."assigned_at",
            'expert', jsonb_build_object(
                'id', v_expert."id",
                'full_name', v_expert."full_name",
                'initials', v_expert."initials",
                'title', v_expert."title",
                'company', v_expert."company",
                'bio', v_expert."bio",
                'track', v_expert."track",
                'specialties', v_expert."specialties",
                'rating', v_expert."rating",
                'sessions_completed', v_expert."sessions_completed"
            )
        );
    END IF;

    -- 3. Default: Awaiting Assignment
    RETURN jsonb_build_object(
        'state', 'awaiting_assignment',
        'is_completed', false,
        'status', 'awaiting_assignment',
        'message', 'Your Human Calibration interviewer is being assigned by Jadeer.'
    );
END;
$$;

-- ── 10. RPC Permissions & Role Restriction ────────────────────────────────
REVOKE EXECUTE ON FUNCTION book_session_atomic FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION book_session_atomic TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION reschedule_session_atomic FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION reschedule_session_atomic TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION submit_calibration_evaluation_atomic FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION submit_calibration_evaluation_atomic TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION get_candidate_interview_state FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_candidate_interview_state TO authenticated, service_role;
