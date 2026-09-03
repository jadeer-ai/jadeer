// Quick end-to-end test of the new Clerk integration RPCs via PostgREST anon key
const SUPABASE_URL = 'https://kxumowwgmpernjrymvtr.supabase.co';
const ANON_KEY = 'sb_publishable_2sf9Igrk2BGCErc1WvUbFw_UP1k9Qzw';

const TEST_USER_ID = 'clerk-test-user-e2e';
const TEST_EMAIL = 'clerk-test@jadeer.io';

async function rpc(fnName, params) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${fnName} failed [${res.status}]: ${JSON.stringify(data)}`);
  return data;
}

async function main() {
  console.log('=== Clerk Integration RPC E2E Test ===\n');

  // 1. Provision candidate profile
  try {
    const result = await rpc('ensure_candidate_profile', {
      p_user_id: TEST_USER_ID,
      p_email: TEST_EMAIL,
      p_full_name: 'Clerk Test Candidate',
      p_track: 'BACKEND'
    });
    console.log('✓ ensure_candidate_profile:', result.success ? 'SUCCESS' : 'FAILED', result);
  } catch (e) {
    console.error('❌ ensure_candidate_profile failed:', e.message);
  }

  // 2. get_candidate_interview_state (no assignment yet → awaiting_assignment)
  try {
    const state = await rpc('get_candidate_interview_state', { p_candidate_user_id: TEST_USER_ID });
    console.log(`✓ get_candidate_interview_state: state=${state.state}`);
    if (state.state !== 'awaiting_assignment') {
      console.log('  NOTE: Unexpected state for a new user:', JSON.stringify(state));
    }
  } catch (e) {
    console.error('❌ get_candidate_interview_state failed:', e.message);
  }

  // 3. get_candidate_assignment (no assignment → assigned=false)
  try {
    const assignment = await rpc('get_candidate_assignment', { p_candidate_user_id: TEST_USER_ID });
    console.log(`✓ get_candidate_assignment: assigned=${assignment.assigned}`);
  } catch (e) {
    console.error('❌ get_candidate_assignment failed:', e.message);
  }

  // 4. get_my_sessions (no sessions → empty array)
  try {
    const sessions = await rpc('get_my_sessions', { p_candidate_user_id: TEST_USER_ID });
    const arr = Array.isArray(sessions) ? sessions : [];
    console.log(`✓ get_my_sessions: count=${arr.length}`);
  } catch (e) {
    console.error('❌ get_my_sessions failed:', e.message);
  }

  // 5. get_candidate_evaluation (no eval → has_evaluation=false)
  try {
    const ev = await rpc('get_candidate_evaluation', { p_candidate_user_id: TEST_USER_ID });
    console.log(`✓ get_candidate_evaluation: has_evaluation=${ev.has_evaluation}`);
  } catch (e) {
    console.error('❌ get_candidate_evaluation failed:', e.message);
  }

  // 6. Get available slots via PostgREST (should work with anon key from RLS policy)
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/expert_availability_slots?select=id,expert_id,status&status=eq.available&limit=3`, {
      headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }
    });
    const slots = await res.json();
    console.log(`✓ expert_availability_slots anon read: count=${slots.length} (via RLS 'status=available' policy)`);
  } catch (e) {
    console.error('❌ expert_availability_slots anon read failed:', e.message);
  }

  // 7. Get consultants via PostgREST (should work - active consultants readable by anon)
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/experts?select=id,full_name,role,track&role=in.(CONSULTANT,BOTH)&is_active=eq.true`, {
      headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }
    });
    const experts = await res.json();
    console.log(`✓ experts anon read (consultants): count=${experts.length}`);
  } catch (e) {
    console.error('❌ experts anon read failed:', e.message);
  }

  // 8. Test book_session_atomic with anon key (should work now)
  // First find an available slot
  let slotId;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/expert_availability_slots?select=id,expert_id&status=eq.available&limit=1`, {
      headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }
    });
    const slots = await res.json();
    if (slots.length > 0) {
      slotId = slots[0].id;
      const expertId = slots[0].expert_id;
      console.log(`  Using slot ${slotId} for expert ${expertId}`);

      // Check if this expert has a CONSULTANT/BOTH role
      const expRes = await fetch(`${SUPABASE_URL}/rest/v1/experts?id=eq.${expertId}&select=id,role`, {
        headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }
      });
      const expData = await expRes.json();
      const expert = expData[0];

      if (expert.role === 'CONSULTANT' || expert.role === 'BOTH') {
        const bookResult = await rpc('book_session_atomic', {
          p_candidate_user_id: TEST_USER_ID,
          p_slot_id: slotId,
          p_session_type: 'consultation',
          p_consultation_topic: 'career-direction',
          p_consultation_topic_title: 'Career Direction Test',
          p_consultation_goal: 'E2E Integration Test',
        });
        console.log(`✓ book_session_atomic (consultation): session_id=${bookResult.session_id}`);

        const sessionId = bookResult.session_id;

        // 9. Test get_my_sessions after booking
        const sessions2 = await rpc('get_my_sessions', { p_candidate_user_id: TEST_USER_ID });
        const arr2 = Array.isArray(sessions2) ? sessions2 : [];
        console.log(`✓ get_my_sessions after booking: count=${arr2.length}`);

        // 10. Test cancellation to clean up
        const cancelResult = await rpc('cancel_session_atomic', {
          p_session_id: sessionId,
          p_cancelled_by: 'candidate',
          p_cancellation_reason: 'E2E Test cleanup'
        });
        console.log(`✓ cancel_session_atomic: success=${cancelResult.success}`);
      } else {
        console.log(`  Skipping book test - expert ${expertId} is role ${expert.role} (needs assignment first for human_interview)`);
      }
    }
  } catch (e) {
    console.error('❌ book/cancel test failed:', e.message);
  }

  // Cleanup: Remove the test user (use the postgres connection for cleanup)
  console.log('\n=== Cleaning up test user (will use DB connection) ===');
  console.log('Note: Test user clerk-test-user-e2e was created. Clean up via DB if needed.');

  console.log('\n=== E2E Test Complete ===');
}

main().catch(console.error);
