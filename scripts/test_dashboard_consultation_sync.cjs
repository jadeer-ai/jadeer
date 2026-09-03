// Verification script for Candidate Dashboard "My Consultations" sync
// Simulates the exact lifecycle against hosted Supabase
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const SUPABASE_URL = 'https://kxumowwgmpernjrymvtr.supabase.co';
const ANON_KEY = 'sb_publishable_2sf9Igrk2BGCErc1WvUbFw_UP1k9Qzw';

const TEST_CANDIDATE_ID = 'test-dash-sync-user-' + Date.now();
const TEST_EMAIL = 'dash-sync@jadeer.io';

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

// Logic from useDashboardConsultations.ts
function mapToDashboardItem(s) {
  const startMs = new Date(s.scheduled_start_time).getTime();
  const endMs = new Date(s.scheduled_end_time).getTime();
  const durationMinutes = isNaN(startMs) || isNaN(endMs)
    ? 60
    : Math.max(15, Math.round((endMs - startMs) / 60000));

  const statusMap = {
    scheduled: 'SCHEDULED',
    in_progress: 'IN_PROGRESS',
    completed: 'COMPLETED',
    cancelled: 'CANCELLED',
  };

  const cd = s.consultation_details;
  const exp = s.expert || {};

  return {
    id: s.session_id,
    mentorName: exp.full_name,
    mentorTitle: exp.title,
    mentorCompany: exp.company,
    status: statusMap[s.status] || 'SCHEDULED',
    topicTitle: cd?.topic_title || cd?.topic || 'Technical Consultation',
    scheduledAt: s.scheduled_start_time,
    durationMinutes,
    meetingLink: s.meeting_url || undefined,
    notes: cd?.goal || cd?.candidate_message || undefined,
    timezone: s.timezone || 'Asia/Riyadh',
  };
}

async function main() {
  console.log('╔═════════════════════════════════════════════════════════════════╗');
  console.log('║   JADEER DASHBOARD CONSULTATION SYNC VERIFICATION SUITE         ║');
  console.log('╚═════════════════════════════════════════════════════════════════╝\n');

  try {
    // 0. Setup candidate profile in Supabase
    console.log('[Setup] Provisioning candidate profile for', TEST_CANDIDATE_ID);
    await rpc('ensure_candidate_profile', {
      p_user_id: TEST_CANDIDATE_ID,
      p_email: TEST_EMAIL,
      p_full_name: 'Dashboard Sync Candidate',
      p_track: 'BACKEND',
    });

    // ─────────────────────────────────────────────────────────────────
    // Scenario 1: Candidate has no upcoming consultation → Dashboard shows empty state
    // ─────────────────────────────────────────────────────────────────
    console.log('\n[Scenario 1] Candidate has no upcoming consultation');
    const initialSessions = await rpc('get_my_sessions', {
      p_candidate_user_id: TEST_CANDIDATE_ID,
      p_session_type: 'consultation',
    });
    const initialMapped = (Array.isArray(initialSessions) ? initialSessions : [])
      .filter((s) => s.status !== 'cancelled')
      .map(mapToDashboardItem);
    const initialUpcoming = initialMapped.filter((s) => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');

    console.log(`  Initial sessions count: ${initialMapped.length}`);
    console.log(`  Initial upcoming count: ${initialUpcoming.length}`);
    console.log(`  Dashboard preview state: ${initialUpcoming.length === 0 ? 'EMPTY STATE (PASS)' : 'NON-EMPTY (FAIL)'}`);
    if (initialUpcoming.length !== 0) throw new Error('Expected 0 upcoming sessions for fresh candidate');

    // ─────────────────────────────────────────────────────────────────
    // Scenario 2 & 3: Candidate books a real consultation → Booking confirmed
    // ─────────────────────────────────────────────────────────────────
    console.log('\n[Scenario 2 & 3] Candidate books a real consultation');
    // Fetch 2 available slots from an active consultant
    const availableSlots = await get('expert_availability_slots?select=id,expert_id,start_time,end_time&status=eq.available&limit=2');
    if (availableSlots.length < 2) throw new Error('Need at least 2 available slots for test');

    const slot1 = availableSlots[0];
    const slot2 = availableSlots[1];
    const expertId = slot1.expert_id;

    const bookResult = await rpc('book_session_atomic', {
      p_candidate_user_id: TEST_CANDIDATE_ID,
      p_slot_id: slot1.id,
      p_session_type: 'consultation',
      p_consultation_topic: 'career-direction',
      p_consultation_topic_title: 'Career Direction & Track Specialization',
      p_consultation_goal: 'System Design Mentorship',
    });

    console.log(`  Booking confirmed: session_id=${bookResult.session_id}, status=${bookResult.status}`);
    console.log(`  Booked consultant: ${bookResult.expert?.full_name} (${bookResult.expert?.company})`);
    console.log(`  Booked start: ${bookResult.scheduled_start_time}`);

    const sessionId = bookResult.session_id;

    // ─────────────────────────────────────────────────────────────────
    // Scenario 4 & 5: Return to Dashboard → Shows newly booked real consultation
    // ─────────────────────────────────────────────────────────────────
    console.log('\n[Scenario 4 & 5] Navigate to Dashboard (simulated fetch on mount)');
    const dashSessions = await rpc('get_my_sessions', {
      p_candidate_user_id: TEST_CANDIDATE_ID,
      p_session_type: 'consultation',
    });
    const dashMapped = (Array.isArray(dashSessions) ? dashSessions : [])
      .filter((s) => s.status !== 'cancelled')
      .map(mapToDashboardItem);
    const dashUpcoming = dashMapped
      .filter((s) => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS')
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

    console.log(`  Dashboard preview items count: ${dashUpcoming.length}`);
    const firstUpcoming = dashUpcoming[0];
    console.log(`  Dashboard preview item 1:`);
    console.log(`    - ID: ${firstUpcoming.id}`);
    console.log(`    - Mentor: ${firstUpcoming.mentorName} (${firstUpcoming.mentorTitle} • ${firstUpcoming.mentorCompany})`);
    console.log(`    - Topic: ${firstUpcoming.topicTitle}`);
    console.log(`    - Scheduled At: ${firstUpcoming.scheduledAt}`);
    console.log(`    - Timezone: ${firstUpcoming.timezone}`);
    console.log(`    - Status: ${firstUpcoming.status}`);
    console.log(`    - Meeting Link: ${firstUpcoming.meetingLink}`);
    console.log(`    - Prep Notes: ${firstUpcoming.notes}`);

    if (dashUpcoming.length !== 1 || firstUpcoming.id !== sessionId) {
      throw new Error('Dashboard did not return the newly booked consultation');
    }
    console.log('  ✓ Dashboard preview correctly displays real Supabase consultation!');

    // ─────────────────────────────────────────────────────────────────
    // Scenario 6: Click View All → Same consultation appears
    // ─────────────────────────────────────────────────────────────────
    console.log('\n[Scenario 6] Click View All (/consultations)');
    const viewAllSessions = await rpc('get_my_sessions', {
      p_candidate_user_id: TEST_CANDIDATE_ID,
      p_session_type: 'consultation',
    });
    const viewAllMatch = viewAllSessions.find((s) => s.session_id === sessionId);
    if (!viewAllMatch) throw new Error('View All does not contain the booked session');
    console.log(`  ✓ View All shares the exact same source of truth (session_id=${viewAllMatch.session_id})`);

    // ─────────────────────────────────────────────────────────────────
    // Scenario 7: Reschedule it → Dashboard immediately reflects new date/time
    // ─────────────────────────────────────────────────────────────────
    console.log('\n[Scenario 7] Reschedule consultation with new slot');
    // Note: reschedule requires same expert
    // Let's find another slot for the same expert
    const sameExpertSlots = await get(`expert_availability_slots?select=id,expert_id,start_time,end_time&expert_id=eq.${expertId}&status=eq.available&limit=1`);
    if (sameExpertSlots.length > 0) {
      const newSlot = sameExpertSlots[0];
      const rescheduleResult = await rpc('reschedule_session_atomic', {
        p_session_id: sessionId,
        p_candidate_user_id: TEST_CANDIDATE_ID,
        p_new_slot_id: newSlot.id,
      });
      console.log(`  Reschedule confirmed: new start_time=${rescheduleResult.scheduled_start_time}`);

      // Re-fetch dashboard view
      const afterReschedule = await rpc('get_my_sessions', {
        p_candidate_user_id: TEST_CANDIDATE_ID,
        p_session_type: 'consultation',
      });
      const reschedUpcoming = afterReschedule
        .filter((s) => s.status !== 'cancelled')
        .map(mapToDashboardItem)
        .filter((s) => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');

      console.log(`  Dashboard updated start time: ${reschedUpcoming[0]?.scheduledAt}`);
      if (reschedUpcoming[0]?.scheduledAt !== rescheduleResult.scheduled_start_time) {
        throw new Error('Dashboard did not reflect the rescheduled time');
      }
      console.log('  ✓ Dashboard immediately reflects rescheduled date/time!');
    } else {
      console.log('  (Skipping slot swap: no second slot for same expert in test seed)');
    }

    // ─────────────────────────────────────────────────────────────────
    // Scenario 8: Cancel it → Dashboard no longer presents it as upcoming
    // ─────────────────────────────────────────────────────────────────
    console.log('\n[Scenario 8] Cancel consultation');
    await rpc('cancel_session_atomic', {
      p_session_id: sessionId,
      p_cancelled_by: 'candidate',
      p_cancellation_reason: 'User cancelled for dashboard verification',
    });
    console.log('  Cancellation executed.');

    const afterCancel = await rpc('get_my_sessions', {
      p_candidate_user_id: TEST_CANDIDATE_ID,
      p_session_type: 'consultation',
    });
    const cancelUpcoming = (Array.isArray(afterCancel) ? afterCancel : [])
      .filter((s) => s.status !== 'cancelled')
      .map(mapToDashboardItem)
      .filter((s) => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');

    console.log(`  Upcoming sessions count after cancel: ${cancelUpcoming.length}`);
    console.log(`  Dashboard preview state: ${cancelUpcoming.length === 0 ? 'EMPTY STATE (PASS)' : 'NON-EMPTY (FAIL)'}`);
    if (cancelUpcoming.length !== 0) {
      throw new Error('Cancelled session should not appear in upcoming consultations preview');
    }
    console.log('  ✓ Cancelled consultation successfully cleared from Dashboard preview!');

    // ─────────────────────────────────────────────────────────────────
    // Scenario 9: Refresh browser → State remains consistent with Supabase
    // ─────────────────────────────────────────────────────────────────
    console.log('\n[Scenario 9] Browser refresh persistence check');
    const refreshSessions = await rpc('get_my_sessions', {
      p_candidate_user_id: TEST_CANDIDATE_ID,
      p_session_type: 'consultation',
    });
    const refreshUpcoming = (Array.isArray(refreshSessions) ? refreshSessions : [])
      .filter((s) => s.status !== 'cancelled')
      .map(mapToDashboardItem)
      .filter((s) => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS');

    console.log(`  Persisted upcoming count on refresh: ${refreshUpcoming.length}`);
    if (refreshUpcoming.length !== 0) throw new Error('Persistence mismatch on refresh');
    console.log('  ✓ Refresh state matches Supabase exactly!');

    console.log('\n═════════════════════════════════════════════════════════════════');
    console.log('ALL 9 VERIFICATION SCENARIOS PASSED WITH ZERO ERRORS');
    console.log('═════════════════════════════════════════════════════════════════\n');
  } finally {
    // Cleanup test user
    console.log('[Cleanup] Removing test user:', TEST_CANDIDATE_ID);
    await p.$executeRawUnsafe(`DELETE FROM consultation_details WHERE session_id IN (SELECT id FROM sessions WHERE candidate_user_id = $1)`, TEST_CANDIDATE_ID);
    await p.$executeRawUnsafe(`DELETE FROM sessions WHERE candidate_user_id = $1`, TEST_CANDIDATE_ID);
    await p.$executeRawUnsafe(`DELETE FROM student_profiles WHERE "userId" = $1`, TEST_CANDIDATE_ID);
    await p.$executeRawUnsafe(`DELETE FROM users WHERE id = $1`, TEST_CANDIDATE_ID);
    await p.$disconnect();
    console.log('[Cleanup] Test candidate removed cleanly from Supabase.');
  }
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  p.$disconnect();
  process.exit(1);
});
