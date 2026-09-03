const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Clean up E2E test user created during RPC verification
  const TEST_USER = 'clerk-test-user-e2e';
  
  // Cancel any remaining sessions first (FK constraint)
  await p.$executeRawUnsafe(`
    UPDATE sessions SET status = 'cancelled' WHERE candidate_user_id = $1
  `, TEST_USER);
  
  // Delete sessions
  await p.$executeRawUnsafe(`DELETE FROM sessions WHERE candidate_user_id = $1`, TEST_USER);
  
  // Delete student_profiles
  await p.$executeRawUnsafe(`DELETE FROM student_profiles WHERE "userId" = $1`, TEST_USER);
  
  // Delete users
  await p.$executeRawUnsafe(`DELETE FROM users WHERE id = $1`, TEST_USER);
  
  console.log('✓ Test user clerk-test-user-e2e cleaned up from remote DB');
}

main().catch(console.error).finally(() => p.$disconnect());
