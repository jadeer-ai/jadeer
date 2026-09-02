-- ═══════════════════════════════════════════════════════════════════════════
-- JADEER PLATFORM — 1-TO-1 CONSULTATION END-TO-END MIGRATION
-- ─────────────────────────────────────────────────────────────────────────
-- Builds upon the shared scheduling infrastructure:
-- 1. Reuses experts, expert_availability_slots, sessions, and consultation_details
-- 2. Consultant discovery & filtering RLS
-- 3. Atomic booking for session_type = 'consultation'
-- 4. Atomic reschedule for consultation (same consultant guard)
-- 5. Cancellation & slot reopening
-- 6. Authoritative outcome summary & action items submission
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. RLS Policies: Consultant Discovery & Scoped Availability ──────────
-- Candidates can discover active consultants (role = 'CONSULTANT' or 'BOTH')
DROP POLICY IF EXISTS "experts_candidate_read_active_consultants" ON "experts";
CREATE POLICY "experts_candidate_read_active_consultants" ON "experts"
    FOR SELECT
    USING (
        "is_active" = true
        AND "role" IN ('CONSULTANT', 'BOTH')
    );

-- Allow candidates to view available slots for active consultants
DROP POLICY IF EXISTS "slots_candidate_read_consultant_available" ON "expert_availability_slots";
CREATE POLICY "slots_candidate_read_consultant_available" ON "expert_availability_slots"
    FOR SELECT
    USING (
        "status" = 'available'
        AND "expert_id" IN (
            SELECT "id" FROM "experts"
            WHERE "is_active" = true
              AND "role" IN ('CONSULTANT', 'BOTH')
        )
    );

-- ── 2. RLS Policies: consultation_details ────────────────────────────────
ALTER TABLE "consultation_details" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cd_candidate_and_expert_read" ON "consultation_details";
DROP POLICY IF EXISTS "cd_expert_update_deliverables" ON "consultation_details";
DROP POLICY IF EXISTS "cd_candidate_read_own" ON "consultation_details";
CREATE POLICY "cd_candidate_read_own" ON "consultation_details"
    FOR SELECT
    USING (
        "session_id" IN (
            SELECT "id" FROM "sessions"
            WHERE "candidate_user_id" = auth.uid()::text
        )
    );

DROP POLICY IF EXISTS "cd_consultant_manage_own" ON "consultation_details";
CREATE POLICY "cd_consultant_manage_own" ON "consultation_details"
    FOR ALL
    USING (
        "session_id" IN (
            SELECT "id" FROM "sessions"
            WHERE "expert_id" IN (SELECT "id" FROM "experts" WHERE "user_id" = auth.uid()::text)
        )
        OR (auth.jwt() ->> 'role') = 'ADMIN'
    );

-- ── 3. RPC: submit_consultation_outcome_atomic ───────────────────────────
-- Allows the consultant to submit an outcome summary, action items, and deliverables.
-- Marks the consultation session as 'completed' authoritatively.
CREATE OR REPLACE FUNCTION submit_consultation_outcome_atomic(
    p_session_id UUID,
    p_expert_id TEXT,
    p_outcome_summary TEXT,
    p_action_items JSONB DEFAULT '[]'::JSONB,
    p_deliverables JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_session "sessions"%ROWTYPE;
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
        RAISE EXCEPTION 'Consultation session % not found', p_session_id;
    END IF;

    IF v_session."session_type" <> 'consultation' THEN
        RAISE EXCEPTION 'Session % is not a 1-to-1 consultation', p_session_id;
    END IF;

    -- Security Guard: Candidates cannot submit outcomes or mark consultation completed
    IF auth.uid() IS NOT NULL AND auth.uid()::text = v_session."candidate_user_id" THEN
        RAISE EXCEPTION 'Forbidden: Candidates cannot submit consultation deliverables or mark it completed';
    END IF;

    -- Security Guard: Only the booked consultant or admin can submit outcome
    IF v_session."expert_id" <> p_expert_id AND (auth.jwt() ->> 'role') <> 'ADMIN' THEN
        RAISE EXCEPTION 'Unauthorized: Only the assigned consultant % can submit deliverables for session %',
            v_session."expert_id", p_session_id;
    END IF;

    IF auth.uid() IS NOT NULL AND (auth.jwt() ->> 'role') <> 'ADMIN' THEN
        IF auth.uid()::text NOT IN (SELECT "user_id" FROM "experts" WHERE "id" = p_expert_id) THEN
            RAISE EXCEPTION 'Forbidden: Caller is not the assigned consultant for this session';
        END IF;
    END IF;

    -- 2. Update consultation_details with outcome summary and action items
    UPDATE "consultation_details"
    SET "outcome_summary" = p_outcome_summary,
        "action_items" = COALESCE(p_action_items, '[]'::JSONB),
        "deliverables" = COALESCE(p_deliverables, '{}'::JSONB),
        "updated_at" = CURRENT_TIMESTAMP
    WHERE "session_id" = p_session_id;

    -- 3. Mark session completed
    UPDATE "sessions"
    SET "status" = 'completed', "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_session_id;

    -- 4. Increment expert session count
    UPDATE "experts"
    SET "sessions_completed" = "sessions_completed" + 1, "updated_at" = CURRENT_TIMESTAMP
    WHERE "id" = p_expert_id;

    RETURN jsonb_build_object(
        'success', true,
        'session_id', p_session_id,
        'status', 'completed',
        'outcome_summary', p_outcome_summary
    );
END;
$$;

-- ── 4. Seed Consultants & Slots ──────────────────────────────────────────
INSERT INTO "experts" (
    "id", "role", "full_name", "initials", "title", "company", "bio", "track", "specialties", "rating", "review_count", "sessions_completed"
)
VALUES
(
    'exp-khaled-hamdy',
    'CONSULTANT',
    'Eng. Khaled Hamdy',
    'KH',
    'Senior Engineering Lead',
    'Jadeer Senior Mentor',
    'Leading payment gateway infrastructure and microservices resilience. Passionate about asynchronous message brokers, PostgreSQL, and career progression.',
    'BACKEND',
    ARRAY['PostgreSQL & Redis', 'Kafka Pipelines', 'Microservices Architecture', 'System Design']::TEXT[],
    4.85,
    106,
    142
),
(
    'exp-sarah-tamimi',
    'CONSULTANT',
    'Eng. Sarah Al-Tamimi',
    'ST',
    'Principal Cloud & DevOps Architect',
    'Jadeer Cloud Mentor',
    'Cloud-native Kubernetes orchestration, zero-downtime CI/CD deployments, and infrastructure resilience on AWS & GCP. Specializes in DevOps transition.',
    'DEVOPS',
    ARRAY['Kubernetes', 'Terraform & CI/CD', 'AWS & GCP Infrastructure', 'Observability']::TEXT[],
    4.92,
    78,
    115
)
ON CONFLICT ("id") DO NOTHING;

-- Seed slots for Eng. Khaled Hamdy
INSERT INTO "expert_availability_slots" ("id", "expert_id", "start_time", "end_time", "timezone", "status")
VALUES
    ('c0000001-0000-0000-0000-000000000001', 'exp-khaled-hamdy', '2026-09-10 11:00:00+03', '2026-09-10 12:00:00+03', 'Asia/Riyadh', 'available'),
    ('c0000001-0000-0000-0000-000000000002', 'exp-khaled-hamdy', '2026-09-10 15:00:00+03', '2026-09-10 16:00:00+03', 'Asia/Riyadh', 'available'),
    ('c0000001-0000-0000-0000-000000000003', 'exp-khaled-hamdy', '2026-09-13 10:00:00+03', '2026-09-13 11:00:00+03', 'Asia/Riyadh', 'available')
ON CONFLICT ("id") DO NOTHING;

-- Seed slots for Eng. Sarah Al-Tamimi
INSERT INTO "expert_availability_slots" ("id", "expert_id", "start_time", "end_time", "timezone", "status")
VALUES
    ('d0000001-0000-0000-0000-000000000001', 'exp-sarah-tamimi', '2026-09-11 14:00:00+03', '2026-09-11 15:00:00+03', 'Asia/Riyadh', 'available'),
    ('d0000001-0000-0000-0000-000000000002', 'exp-sarah-tamimi', '2026-09-12 11:30:00+03', '2026-09-12 12:30:00+03', 'Asia/Riyadh', 'available')
ON CONFLICT ("id") DO NOTHING;

-- ── 5. RPC Permissions & Role Restriction ─────────────────────────────────
REVOKE EXECUTE ON FUNCTION submit_consultation_outcome_atomic(UUID, TEXT, TEXT, JSONB, JSONB) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION submit_consultation_outcome_atomic(UUID, TEXT, TEXT, JSONB, JSONB) FROM anon;
GRANT EXECUTE ON FUNCTION submit_consultation_outcome_atomic(UUID, TEXT, TEXT, JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION submit_consultation_outcome_atomic(UUID, TEXT, TEXT, JSONB, JSONB) TO service_role;

