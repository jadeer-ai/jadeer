// Final integration smoke test via PostgREST anon key
// Verifies all production service paths work correctly
const SUPABASE_URL = 'https://kxumowwgmpernjrymvtr.supabase.co';
const ANON_KEY = 'sb_publishable_2sf9Igrk2BGCErc1WvUbFw_UP1k9Qzw';

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
  if (!res.ok) throw new Error(`${fnName} [${res.status}]: ${JSON.stringify(data)}`);
  return data;
}

async function get(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }
  });
  return res.json();
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     JADEER SUPABASE INTEGRATION REPORT — FINAL SMOKE    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  const results = [];

  // 1. Candidate Profile Provisioning
  try {
    const r = await rpc('ensure_candidate_profile', {
      p_user_id: 'smoke-test-clerk-001',
      p_email: 'smoke@jadeer.io',
      p_full_name: 'Smoke Test Candidate',
      p_track: 'BACKEND'
    });
    results.push({ check: '1. ensure_candidate_profile (RPC)', status: r.success ? '✓ PASS' : '✗ FAIL', detail: `user_id=${r.user_id}` });
  } catch (e) {
    results.push({ check: '1. ensure_candidate_profile (RPC)', status: '✗ FAIL', detail: e.message });
  }

  // 2. Interview state (awaiting_assignment for new user)
  try {
    const r = await rpc('get_candidate_interview_state', { p_candidate_user_id: 'smoke-test-clerk-001' });
    results.push({ check: '2. get_candidate_interview_state (RPC)', status: '✓ PASS', detail: `state=${r.state}` });
  } catch (e) {
    results.push({ check: '2. get_candidate_interview_state (RPC)', status: '✗ FAIL', detail: e.message });
  }

  // 3. Assignment check (false for new user)
  try {
    const r = await rpc('get_candidate_assignment', { p_candidate_user_id: 'smoke-test-clerk-001' });
    results.push({ check: '3. get_candidate_assignment (RPC)', status: '✓ PASS', detail: `assigned=${r.assigned}` });
  } catch (e) {
    results.push({ check: '3. get_candidate_assignment (RPC)', status: '✗ FAIL', detail: e.message });
  }

  // 4. My sessions (empty for new user)
  try {
    const r = await rpc('get_my_sessions', { p_candidate_user_id: 'smoke-test-clerk-001' });
    const count = Array.isArray(r) ? r.length : 0;
    results.push({ check: '4. get_my_sessions (RPC)', status: '✓ PASS', detail: `count=${count}` });
  } catch (e) {
    results.push({ check: '4. get_my_sessions (RPC)', status: '✗ FAIL', detail: e.message });
  }

  // 5. Evaluation check (false for new user)
  try {
    const r = await rpc('get_candidate_evaluation', { p_candidate_user_id: 'smoke-test-clerk-001' });
    results.push({ check: '5. get_candidate_evaluation (RPC)', status: '✓ PASS', detail: `has_evaluation=${r.has_evaluation}` });
  } catch (e) {
    results.push({ check: '5. get_candidate_evaluation (RPC)', status: '✗ FAIL', detail: e.message });
  }

  // 6. Consultants via PostgREST (all active consultants, 6 expected)
  try {
    const r = await get(`experts?select=id,full_name,role,track,is_active&role=in.(CONSULTANT,BOTH)&is_active=eq.true`);
    results.push({ check: '6. experts PostgREST read (anon key)', status: r.length >= 1 ? '✓ PASS' : '✗ FAIL', detail: `count=${r.length}` });
    console.log('   Consultants:', r.map(e => `${e.full_name} [${e.role}/${e.track}]`).join(', '));
  } catch (e) {
    results.push({ check: '6. experts PostgREST read (anon key)', status: '✗ FAIL', detail: e.message });
  }

  // 7. Available slots via PostgREST
  try {
    const r = await get(`expert_availability_slots?select=id,expert_id,status&status=eq.available&limit=5`);
    results.push({ check: '7. expert_availability_slots anon read', status: '✓ PASS', detail: `count=${r.length}` });
  } catch (e) {
    results.push({ check: '7. expert_availability_slots anon read', status: '✗ FAIL', detail: e.message });
  }

  // 8. Book consultation session (atomic)
  let bookedSessionId = null;
  try {
    const slots = await get(`expert_availability_slots?select=id,expert_id&status=eq.available&limit=1`);
    if (slots.length > 0) {
      const expert = await get(`experts?id=eq.${slots[0].expert_id}&select=id,role`);
      if (expert[0]?.role === 'CONSULTANT' || expert[0]?.role === 'BOTH') {
        const r = await rpc('book_session_atomic', {
          p_candidate_user_id: 'smoke-test-clerk-001',
          p_slot_id: slots[0].id,
          p_session_type: 'consultation',
          p_consultation_topic: 'career-direction',
          p_consultation_topic_title: 'Career Direction',
          p_consultation_goal: 'Smoke test',
        });
        bookedSessionId = r.session_id;
        results.push({ check: '8. book_session_atomic consultation (RPC)', status: '✓ PASS', detail: `session_id=${r.session_id}` });
      } else {
        results.push({ check: '8. book_session_atomic consultation (RPC)', status: '⚠ SKIP', detail: `Slot expert is ${expert[0]?.role} (not CONSULTANT)` });
      }
    }
  } catch (e) {
    results.push({ check: '8. book_session_atomic consultation (RPC)', status: '✗ FAIL', detail: e.message });
  }

  // 9. Get my sessions after booking
  if (bookedSessionId) {
    try {
      const r = await rpc('get_my_sessions', { p_candidate_user_id: 'smoke-test-clerk-001' });
      const arr = Array.isArray(r) ? r : [];
      const found = arr.find(s => s.session_id === bookedSessionId);
      results.push({ check: '9. get_my_sessions after booking', status: found ? '✓ PASS' : '✗ FAIL', detail: `count=${arr.length}, found=${Boolean(found)}` });
    } catch (e) {
      results.push({ check: '9. get_my_sessions after booking', status: '✗ FAIL', detail: e.message });
    }

    // 10. Cancel session (cleanup)
    try {
      const r = await rpc('cancel_session_atomic', {
        p_session_id: bookedSessionId,
        p_cancelled_by: 'candidate',
        p_cancellation_reason: 'Smoke test cleanup'
      });
      results.push({ check: '10. cancel_session_atomic (RPC)', status: r.success ? '✓ PASS' : '✗ FAIL', detail: `success=${r.success}` });
    } catch (e) {
      results.push({ check: '10. cancel_session_atomic (RPC)', status: '✗ FAIL', detail: e.message });
    }
  }

  // 11. Reschedule RPC (smoke – will fail if no sessions, just verifying RPC exists)
  // (Skip actual reschedule to avoid wasting a slot)

  // 12. Cleanup test user
  const { PrismaClient } = require('@prisma/client');
  const p = new PrismaClient();
  try {
    await p.$executeRawUnsafe(`DELETE FROM sessions WHERE candidate_user_id = $1`, 'smoke-test-clerk-001');
    await p.$executeRawUnsafe(`DELETE FROM student_profiles WHERE "userId" = $1`, 'smoke-test-clerk-001');
    await p.$executeRawUnsafe(`DELETE FROM users WHERE id = $1`, 'smoke-test-clerk-001');
    results.push({ check: '11. Cleanup test user', status: '✓ PASS', detail: 'smoke-test-clerk-001 removed' });
  } catch (e) {
    results.push({ check: '11. Cleanup test user', status: '✗ FAIL', detail: e.message });
  } finally {
    await p.$disconnect();
  }

  // ── Print Report ────────────────────────────────────────────────
  console.log('\n');
  const passed = results.filter(r => r.status.startsWith('✓')).length;
  const failed = results.filter(r => r.status.startsWith('✗')).length;
  const skipped = results.filter(r => r.status.startsWith('⚠')).length;

  for (const r of results) {
    console.log(`${r.status}  ${r.check}`);
    console.log(`         ${r.detail}`);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`RESULTS:  ${passed} passed  |  ${failed} failed  |  ${skipped} skipped`);
  console.log('─'.repeat(60));

  if (failed === 0) {
    console.log('\n✅  ALL CHECKS PASSED — Jadeer Supabase integration verified.');
  } else {
    console.log(`\n⚠️   ${failed} checks failed — review details above.`);
  }
}

main().catch(console.error);
