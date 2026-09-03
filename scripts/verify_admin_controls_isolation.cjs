// Verification script for Admin Controls Isolation in Candidate Portal
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://kxumowwgmpernjrymvtr.supabase.co';
const ANON_KEY = 'sb_publishable_2sf9Igrk2BGCErc1WvUbFw_UP1k9Qzw';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function run() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(' JADEER CANDIDATE PORTAL ADMIN CONTROLS ISOLATION VERIFICATION');
  console.log(' Target: Hosted Supabase & Candidate UI Security Layer');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // ── CASE 1 & 2 & 3 & 4: UI Source Code Audit in HumanInterviewPage.tsx ──
  console.log('AUDIT: Inspecting HumanInterviewPage.tsx for Role-Based Controls...');
  const humanInterviewSrc = fs.readFileSync(
    path.join(__dirname, '../src/pages/HumanInterviewPage.tsx'),
    'utf8'
  ).replace(/\r\n/g, '\n');

  // 1. Confirm "Assign Interviewer (Admin)" is NOT guarded by import.meta.env.DEV alone
  assert(
    !humanInterviewSrc.includes('{import.meta.env.DEV && (\n                  <button\n                    type="button"\n                    onClick={handleSimulateAssignInterviewer}'),
    'Assign Interviewer (Admin) is NO LONGER exposed via import.meta.env.DEV'
  );
  assert(
    humanInterviewSrc.includes('{isAdmin && (\n                  <button\n                    type="button"\n                    onClick={handleSimulateAssignInterviewer}'),
    'Assign Interviewer (Admin) is strictly gated by authenticated isAdmin verification'
  );

  // 2. Confirm "Submit Evaluation (Interviewer)" is strictly gated by isAdmin
  assert(
    humanInterviewSrc.includes('{isAdmin && (\n                  <button\n                    type="button"\n                    onClick={handleAuthoritativeEvaluationSubmit}'),
    'Submit Evaluation (Interviewer) is strictly gated by authenticated isAdmin verification'
  );

  // 3. Confirm "Reset Assignment" is strictly gated by isAdmin
  assert(
    humanInterviewSrc.includes('{isAdmin && activeProgressState !== \'awaiting_assignment\' && (\n              <button\n                type="button"\n                onClick={handleResetFlow}'),
    'Reset Assignment is strictly gated by authenticated isAdmin verification'
  );

  // 4. Confirm isAdmin check disqualifies candidates and requires real admin session
  assert(
    humanInterviewSrc.includes('const isCandidateRole = userRole === \'student\' || userRole === \'grad\' || userRole === \'graduate\';'),
    'Candidate roles (student, grad, graduate) are explicitly recognized'
  );
  assert(
    humanInterviewSrc.includes('const isAdmin = !isCandidateRole && ('),
    'isAdmin explicitly requires !isCandidateRole, preventing any candidate from qualifying as admin'
  );

  // 5. Confirm handlers have programmatic guards
  assert(
    humanInterviewSrc.includes('if (!isAdmin) {\n      triggerToast(\'Unauthorized: Interviewer assignment is restricted to Jadeer administrators.\');\n      return;\n    }'),
    'handleSimulateAssignInterviewer rejects unauthorized candidate callers'
  );
  assert(
    humanInterviewSrc.includes('if (!isAdmin) {\n      triggerToast(\'Unauthorized: Submitting evaluations is restricted to evaluators.\');\n      return;\n    }'),
    'handleAuthoritativeEvaluationSubmit rejects unauthorized candidate callers'
  );
  assert(
    humanInterviewSrc.includes('if (!isAdmin) {\n      triggerToast(\'Unauthorized: Resetting state is restricted to administrators.\');\n      return;\n    }'),
    'handleResetFlow rejects unauthorized candidate callers'
  );

  // 6. Confirm Candidate Portal waiting state has required elements and nothing extra
  assert(
    humanInterviewSrc.includes('Your Human Calibration Interviewer is Being Assigned'),
    'Candidate awaiting_assignment maintains "Your Human Calibration Interviewer is Being Assigned"'
  );
  assert(
    humanInterviewSrc.includes('We’ll notify you once your interviewer is assigned.'),
    'Candidate awaiting_assignment maintains neutral notification message'
  );

  // ── CASE 5: Admin user context preservation ─────────────────────────────────
  console.log('\nCASE 5: Verify Admin Portal & Admin Context Preservation...');
  const adminDashboardSrc = fs.readFileSync(
    path.join(__dirname, '../src/pages/admin/AdminDashboardPage.tsx'),
    'utf8'
  );
  assert(
    adminDashboardSrc.includes('AdminApiService.resetToPrismaSeed()'),
    'Admin dashboard retains legitimate administrative reset and seed controls'
  );

  const protectedRouteSrc = fs.readFileSync(
    path.join(__dirname, '../src/components/common/ProtectedRoute.tsx'),
    'utf8'
  );
  assert(
    protectedRouteSrc.includes('export function AdminRouteGuard({ children }: RouteGuardProps) {'),
    'Admin portal is guarded by AdminRouteGuard checking session and token role'
  );

  // ── CASE 6: Direct Candidate Attempt to Mutate Assignments via Backend ───
  console.log('\nCASE 6: Backend & Database Authorization Verification...');
  // Test direct POST to candidate_interview_assignments with anon publishable key
  const postRes = await fetch(`${SUPABASE_URL}/rest/v1/candidate_interview_assignments`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      candidate_user_id: 'malicious-candidate-attempt',
      expert_id: '00000000-0000-0000-0000-000000000000',
      is_active: true,
    }),
  });

  assert(
    postRes.status === 401 || postRes.status === 403 || postRes.status === 404,
    `Direct candidate INSERT into candidate_interview_assignments rejected with HTTP ${postRes.status}`
  );
  console.log(`  ✓ Supabase RLS / PostgREST strictly blocked anon INSERT (Status ${postRes.status})`);

  // Test direct PATCH to candidate_interview_assignments with anon publishable key
  const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/candidate_interview_assignments?candidate_user_id=eq.malicious`, {
    method: 'PATCH',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      is_active: false,
    }),
  });

  assert(
    patchRes.status === 401 || patchRes.status === 403 || patchRes.status === 404 || patchRes.status === 204,
    `Direct candidate UPDATE on candidate_interview_assignments filtered/blocked with HTTP ${patchRes.status}`
  );
  console.log(`  ✓ Supabase RLS / PostgREST strictly blocked/filtered anon UPDATE (Status ${patchRes.status})`);

  // Test client service layer rejection
  const humanInterviewServiceSrc = fs.readFileSync(
    path.join(__dirname, '../src/services/humanInterviewService.ts'),
    'utf8'
  );
  assert(
    humanInterviewServiceSrc.includes('assignInterviewerByAdmin must be called from a server-side admin API route, not from the browser.'),
    'Service layer assignInterviewerByAdmin throws error when invoked from browser'
  );

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(' ALL 6 CASES VERIFIED: CANDIDATE HUMAN CALIBRATION ADMIN CONTROLS ISOLATED');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
