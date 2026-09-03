const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const sql1 = `
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
  `;

  const sql2 = `GRANT EXECUTE ON FUNCTION "get_session_calendar_info"(UUID, TEXT) TO anon, authenticated, service_role;`;

  const sql3 = `
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
  `;

  await prisma.$executeRawUnsafe(sql3);
  console.log('✓ RPC update_session_calendar_sync updated on hosted Supabase');
  await prisma.$disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
