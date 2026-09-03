const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const rpcs = await p.$queryRawUnsafe(`
    SELECT proname, pronargs 
    FROM pg_proc 
    WHERE proname IN ('ensure_candidate_profile','get_my_sessions','get_candidate_evaluation','get_candidate_assignment','get_consultation_outcome','book_session_atomic','reschedule_session_atomic','cancel_session_atomic','get_candidate_interview_state')
    ORDER BY proname;
  `);
  console.log('RPCs verified:', JSON.stringify(rpcs, null, 2));

  // Test anon-key endpoint for ensure_candidate_profile and new read RPCs
  const anonPerms = await p.$queryRawUnsafe(`
    SELECT routine_name, grantee, privilege_type
    FROM information_schema.routine_privileges
    WHERE routine_name IN ('ensure_candidate_profile','get_my_sessions','get_candidate_evaluation','get_candidate_assignment','get_consultation_outcome')
      AND grantee = 'anon'
    ORDER BY routine_name;
  `);
  console.log('Anon permissions:', JSON.stringify(anonPerms, null, 2));
}

main().finally(() => p.$disconnect());
