/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — HUMAN TECHNICAL CALIBRATION CLIENT SERVICE (SUPABASE PRODUCTION)
   ─────────────────────────────────────────────────────────────────────────
   Production Supabase client service for Candidate Human Technical Calibration.
   Uses SECURITY DEFINER RPCs that accept Clerk user IDs directly (no Supabase
   Auth session required). All reads go through RPC — never raw SELECT under RLS.

   Supabase operations:
     • ensure_candidate_profile       — upsert user + student_profile rows
     • get_candidate_interview_state  — authoritative lifecycle state (SDRF)
     • get_candidate_assignment       — assigned interviewer (SDRF)
     • get_candidate_evaluation       — candidate-visible scorecard (SDRF)
     • get_my_sessions                — session history (SDRF)
     • book_session_atomic            — atomic slot lock + session create
     • reschedule_session_atomic      — atomic slot swap, same expert
     • cancel_session_atomic          — cancel + slot release
     • expert_availability_slots      — available slots (PostgREST via RLS)
     • experts                        — consultant/expert read (PostgREST via RLS)
   ═══════════════════════════════════════════════════════════════════════════ */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  syncSessionToCalendar,
  deleteCalendarEvent,
} from './googleCalendarClient';

/* ── isDev: explicit development-only demo flag ─────────────────────────── */
const isDev = import.meta.env.DEV === true && import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

export interface AssignedExpertProfile {
  id: string;
  fullName: string;
  initials: string;
  title: string;
  company: string;
  bio?: string | null;
  track: string;
  specialties: string[];
  rating: number;
  sessionsCompleted: number;
  avatarUrl?: string | null;
  languages?: string[];
  factualCredential?: string;
}

export interface AvailabilitySlotItem {
  id: string;
  expertId: string;
  dateKey: string;
  timeLabel: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: 'available' | 'booked';
}

export interface ConfirmedSessionSummary {
  sessionId: string;
  slotId?: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  timezone: string;
  meetingUrl: string | null;
  dateKey?: string;
  timeLabel?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  expert?: AssignedExpertProfile;
  googleCalendarEventId?: string | null;
  googleCalendarSyncStatus?: 'not_connected' | 'pending' | 'synced' | 'failed';
  googleCalendarSyncedAt?: string | null;
  googleCalendarLastError?: string | null;
  googleCalendarHtmlLink?: string | null;
}

export interface CandidateEvaluationResult {
  hasEvaluation: boolean;
  sessionId?: string;
  overallScore?: number;
  technicalScore?: number;
  problemSolvingScore?: number;
  communicationScore?: number;
  reasoningScore?: number;
  recommendation?: 'STRONG_HIRE' | 'HIRE' | 'CALIBRATED_JUNIOR' | 'NEEDS_PRACTICE';
  candidateVisibleFeedback?: string;
  strengths?: string[];
  recommendations?: string[];
  submittedAt?: string;
  verifiedBadge?: string;
  message?: string;
}

export interface HumanInterviewLifecycleState {
  state: 'awaiting_assignment' | 'choose_time' | 'confirmed' | 'completed';
  isCompleted: boolean;
  status: string;
  message?: string;
  assignedBy?: string;
  assignedAt?: string;
  expert?: AssignedExpertProfile | null;
  session?: ConfirmedSessionSummary | null;
  evaluation?: CandidateEvaluationResult | null;
}

/* ── Mock data — only returned when isDev=true (VITE_ENABLE_MOCK_DATA=true) */
export const FALLBACK_INTERVIEWER: AssignedExpertProfile = {
  id: 'exp-tariq-001',
  fullName: 'Eng. Tariq Al-Mansour',
  initials: 'TM',
  title: 'Principal Systems Architect & Calibration Lead',
  company: 'Jadeer Calibration Panel',
  bio: 'Lead calibration interviewer for high-throughput distributed systems, POSIX network primitives, and modern C++20 / Go engineering.',
  track: 'Backend Development',
  specialties: ['Distributed Systems', 'Linux Socket I/O (epoll)', 'C++20 & Go', 'High-Concurrency'],
  rating: 4.95,
  sessionsCompleted: 142,
  factualCredential: 'Jadeer Principal Calibration Lead',
};

export const FALLBACK_SLOTS: Record<string, AvailabilitySlotItem[]> = {};

/* ── Utility helpers ──────────────────────────────────────────────────────── */
function toDateKey(iso: string): string {
  try { return new Date(iso).toISOString().split('T')[0]; } catch { return iso.substring(0, 10); }
}

function toTimeLabel(startIso: string, endIso: string): string {
  try {
    const s = new Date(startIso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const e = new Date(endIso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${s} – ${e}`;
  } catch { return `${startIso} - ${endIso}`; }
}

function mapExpert(e: any): AssignedExpertProfile {
  return {
    id: e.id,
    fullName: e.full_name,
    initials: e.initials,
    title: e.title,
    company: e.company,
    bio: e.bio,
    track: e.track,
    specialties: e.specialties || [],
    rating: Number(e.rating) || 5.0,
    sessionsCompleted: Number(e.sessions_completed) || 0,
    factualCredential: `${e.title} • ${e.company}`,
  };
}

/* ── Candidate Profile Provisioning ────────────────────────────────────────
   Called on first load to ensure the Clerk user exists in public.users
   and public.student_profiles. Idempotent. */
export async function ensureCandidateProfile(params: {
  userId: string;
  email: string;
  fullName?: string;
  track?: string;
}): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured) {
    if (isDev) return { success: true };
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.rpc('ensure_candidate_profile', {
    p_user_id: params.userId,
    p_email: params.email,
    p_full_name: params.fullName || 'Jadeer Candidate',
    p_track: normalizeTrack(params.track),
  });

  if (error) throw new Error(error.message);
  return { success: Boolean((data as any)?.success) };
}

function normalizeTrack(track?: string): string {
  if (!track) return 'BACKEND';
  const t = track.toUpperCase();
  if (t.includes('FRONTEND') || t.includes('FRONT')) return 'FRONTEND';
  if (t.includes('AI') || t.includes('ML') || t.includes('DATA')) return 'AI_ML';
  if (t.includes('DEVOPS') || t.includes('CLOUD') || t.includes('INFRA')) return 'DEVOPS';
  if (t.includes('FULL')) return 'FULLSTACK';
  return 'BACKEND';
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. Authoritative Lifecycle State
   ═══════════════════════════════════════════════════════════════════════════ */
export async function getHumanInterviewState(
  candidateUserId: string
): Promise<HumanInterviewLifecycleState> {
  if (!isSupabaseConfigured) {
    if (isDev) {
      return {
        state: 'choose_time',
        isCompleted: false,
        status: 'choose_time',
        assignedBy: 'Jadeer Calibration Panel',
        assignedAt: new Date().toISOString(),
        expert: FALLBACK_INTERVIEWER,
      };
    }
    throw new Error('Supabase is not configured. Cannot load calibration state.');
  }

  const { data, error } = await supabase.rpc('get_candidate_interview_state', {
    p_candidate_user_id: candidateUserId,
  });

  if (error) throw new Error(error.message);

  const parsed = typeof data === 'string' ? JSON.parse(data) : (data as any);
  const state = (parsed.state === 'assigned' ? 'choose_time' : parsed.state) || 'awaiting_assignment';

  return {
    state,
    isCompleted: Boolean(parsed.is_completed),
    status: parsed.status || state,
    message: parsed.message,
    assignedBy: parsed.assigned_by,
    assignedAt: parsed.assigned_at,
    expert: parsed.expert ? mapExpert(parsed.expert) : null,
    session: parsed.session
      ? {
          sessionId: parsed.session.session_id || parsed.session.id,
          slotId: parsed.session.slot_id,
          scheduledStartTime: parsed.session.scheduled_start_time,
          scheduledEndTime: parsed.session.scheduled_end_time,
          timezone: parsed.session.timezone || 'Asia/Riyadh',
          meetingUrl: parsed.session.meeting_url,
          dateKey: toDateKey(parsed.session.scheduled_start_time),
          timeLabel: toTimeLabel(parsed.session.scheduled_start_time, parsed.session.scheduled_end_time),
          status: parsed.session.status,
          googleCalendarEventId: parsed.session.google_calendar_event_id || null,
          googleCalendarSyncStatus: parsed.session.google_calendar_sync_status || 'not_connected',
          googleCalendarSyncedAt: parsed.session.google_calendar_synced_at || null,
          googleCalendarLastError: parsed.session.google_calendar_last_error || null,
          googleCalendarHtmlLink: parsed.session.google_calendar_event_id
            ? `https://calendar.google.com/calendar/event?eid=${parsed.session.google_calendar_event_id}`
            : null,
        }
      : null,
    evaluation: parsed.evaluation
      ? {
          hasEvaluation: true,
          sessionId: parsed.evaluation.session_id,
          overallScore: parsed.evaluation.overall_score,
          technicalScore: parsed.evaluation.technical_score,
          problemSolvingScore: parsed.evaluation.problem_solving_score,
          communicationScore: parsed.evaluation.communication_score,
          reasoningScore: parsed.evaluation.reasoning_score,
          recommendation: parsed.evaluation.recommendation,
          candidateVisibleFeedback: parsed.evaluation.candidate_visible_feedback,
          strengths: parsed.evaluation.strengths || [],
          recommendations: parsed.evaluation.recommendations || [],
          submittedAt: parsed.evaluation.submitted_at,
        }
      : null,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. Assigned Interviewer
   ═══════════════════════════════════════════════════════════════════════════ */
export async function getAssignedInterviewer(
  candidateUserId: string,
  _track?: string
): Promise<{ assigned: boolean; expert: AssignedExpertProfile | null; assignedBy?: string }> {
  if (!isSupabaseConfigured) {
    if (isDev) return { assigned: true, expert: FALLBACK_INTERVIEWER, assignedBy: 'Jadeer Calibration Panel' };
    return { assigned: false, expert: null };
  }

  const { data, error } = await supabase.rpc('get_candidate_assignment', {
    p_candidate_user_id: candidateUserId,
  });

  if (error) throw new Error(error.message);
  const parsed = typeof data === 'string' ? JSON.parse(data) : (data as any);

  if (!parsed.assigned) return { assigned: false, expert: null };
  return {
    assigned: true,
    assignedBy: parsed.assigned_by,
    expert: mapExpert(parsed.expert),
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. Assigned Interviewer's Availability Slots
   ═══════════════════════════════════════════════════════════════════════════ */
export async function getAssignedInterviewerAvailability(
  expertId: string,
  _candidateUserId?: string
): Promise<Record<string, AvailabilitySlotItem[]>> {
  if (!isSupabaseConfigured) {
    if (isDev) return FALLBACK_SLOTS;
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('expert_availability_slots')
    .select('id, expert_id, start_time, end_time, timezone, status')
    .eq('expert_id', expertId)
    .eq('status', 'available')
    .order('start_time', { ascending: true });

  if (error) throw new Error(error.message);

  const grouped: Record<string, AvailabilitySlotItem[]> = {};
  for (const slot of (data || [])) {
    const dateKey = toDateKey(slot.start_time);
    const item: AvailabilitySlotItem = {
      id: slot.id,
      expertId: slot.expert_id,
      dateKey,
      timeLabel: toTimeLabel(slot.start_time, slot.end_time),
      startTime: slot.start_time,
      endTime: slot.end_time,
      timezone: slot.timezone || 'Asia/Riyadh',
      status: 'available',
    };
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(item);
  }
  return grouped;
}

/** Domain-level alias */
export const getHumanInterviewAvailability = getAssignedInterviewerAvailability;

/* ═══════════════════════════════════════════════════════════════════════════
   4. Book Human Interview (Atomic Slot Lock)
   ═══════════════════════════════════════════════════════════════════════════ */
export async function bookHumanInterview(params: {
  candidateUserId: string;
  slotId: string;
  softwareTrack?: string;
  candidateNotes?: string;
  timezone?: string;
}): Promise<{
  success: boolean;
  sessionId: string;
  status: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  timezone: string;
  meetingUrl: string;
  dateKey?: string;
  timeLabel?: string;
}> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Cannot book calibration session.');
  }

  const { data, error } = await supabase.rpc('book_session_atomic', {
    p_candidate_user_id: params.candidateUserId,
    p_slot_id: params.slotId,
    p_session_type: 'human_interview',
    p_software_track: normalizeTrack(params.softwareTrack) as any,
    p_candidate_notes: params.candidateNotes || null,
    p_calibration_stage: 'Stage 02B: Human Technical Calibration',
    p_timezone: params.timezone || 'Asia/Riyadh',
  });

  if (error) throw new Error(error.message);

  const res = typeof data === 'string' ? JSON.parse(data) : (data as any);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jadeer:human-calibration-changed'));
  }

  const sessionId = res.session_id || res.id;

  // External Google Calendar sync (background task, non-blocking)
  syncSessionToCalendar({
    sessionId,
    candidateUserId: params.candidateUserId,
    sessionType: 'human_interview',
    scheduledStartTime: res.scheduled_start_time,
    scheduledEndTime: res.scheduled_end_time,
    timezone: res.timezone || params.timezone || 'Asia/Riyadh',
    meetingUrl: res.meeting_url,
    expertName: res.expert?.full_name || 'Principal Calibration Lead',
    expertTitle: res.expert?.title || 'Jadeer Calibration Lead',
    track: params.softwareTrack,
  }).catch(() => {
    // Non-blocking: calendar failure never interrupts Jadeer booking
  });

  return {
    success: true,
    sessionId,
    status: res.status || 'scheduled',
    scheduledStartTime: res.scheduled_start_time,
    scheduledEndTime: res.scheduled_end_time,
    timezone: res.timezone || params.timezone || 'Asia/Riyadh',
    meetingUrl: res.meeting_url,
    dateKey: toDateKey(res.scheduled_start_time),
    timeLabel: toTimeLabel(res.scheduled_start_time, res.scheduled_end_time),
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. Reschedule Human Interview (Same Interviewer)
   ═══════════════════════════════════════════════════════════════════════════ */
export async function rescheduleHumanInterview(params: {
  sessionId: string;
  newSlotId: string;
  candidateUserId: string;
}): Promise<{
  success: boolean;
  sessionId: string;
  slotId: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  timezone: string;
  dateKey?: string;
  timeLabel?: string;
}> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Cannot reschedule session.');
  }

  const { data, error } = await supabase.rpc('reschedule_session_atomic', {
    p_session_id: params.sessionId,
    p_candidate_user_id: params.candidateUserId,
    p_new_slot_id: params.newSlotId,
  });

  if (error) throw new Error(error.message);

  const res = typeof data === 'string' ? JSON.parse(data) : (data as any);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jadeer:human-calibration-changed'));
  }

  // Reschedule existing Google Calendar event (non-blocking)
  syncSessionToCalendar({
    sessionId: res.session_id,
    candidateUserId: params.candidateUserId,
    sessionType: 'human_interview',
    scheduledStartTime: res.scheduled_start_time,
    scheduledEndTime: res.scheduled_end_time,
    timezone: res.timezone || 'Asia/Riyadh',
    meetingUrl: null,
    expertName: 'Principal Calibration Lead',
  }).catch(() => {
    // Non-blocking
  });

  return {
    success: true,
    sessionId: res.session_id,
    slotId: res.slot_id,
    scheduledStartTime: res.scheduled_start_time,
    scheduledEndTime: res.scheduled_end_time,
    timezone: res.timezone || 'Asia/Riyadh',
    dateKey: toDateKey(res.scheduled_start_time),
    timeLabel: toTimeLabel(res.scheduled_start_time, res.scheduled_end_time),
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. Cancel Human Interview (Slot Released)
   ═══════════════════════════════════════════════════════════════════════════ */
export async function cancelHumanInterview(params: {
  sessionId: string;
  reason?: string;
  cancelledBy?: string;
}): Promise<{ success: boolean; sessionId: string; cancelledAt?: string }> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Cannot cancel session.');
  }

  const { data, error } = await supabase.rpc('cancel_session_atomic', {
    p_session_id: params.sessionId,
    p_cancelled_by: params.cancelledBy || 'candidate',
    p_cancellation_reason: params.reason || 'Candidate requested cancellation via portal',
  });

  if (error) throw new Error(error.message);

  const res = typeof data === 'string' ? JSON.parse(data) : (data as any);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jadeer:human-calibration-changed'));
  }

  // Delete Google Calendar event (non-blocking)
  (async () => {
    try {
      const { data: sess } = await supabase
        .from('sessions')
        .select('candidate_user_id, google_calendar_event_id')
        .eq('id', params.sessionId)
        .maybeSingle();

      if (sess?.google_calendar_event_id) {
        await deleteCalendarEvent(
          sess.candidate_user_id,
          sess.google_calendar_event_id,
          params.sessionId
        );
      }
    } catch {
      // Non-blocking: failure never undoes Jadeer cancellation
    }
  })();

  return {
    success: true,
    sessionId: res.session_id,
    cancelledAt: new Date().toISOString(),
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. Candidate-Visible Evaluation Scorecard
   ═══════════════════════════════════════════════════════════════════════════ */
export async function fetchCandidateVisibleInterviewResult(
  candidateUserId: string
): Promise<CandidateEvaluationResult> {
  if (!isSupabaseConfigured) {
    if (isDev) return { hasEvaluation: false };
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.rpc('get_candidate_evaluation', {
    p_candidate_user_id: candidateUserId,
  });

  if (error) throw new Error(error.message);
  const parsed = typeof data === 'string' ? JSON.parse(data) : (data as any);

  if (!parsed.has_evaluation) return { hasEvaluation: false };

  return {
    hasEvaluation: true,
    sessionId: parsed.session_id,
    overallScore: Number(parsed.overall_score),
    technicalScore: Number(parsed.technical_score),
    problemSolvingScore: Number(parsed.problem_solving_score),
    communicationScore: Number(parsed.communication_score),
    reasoningScore: Number(parsed.reasoning_score),
    recommendation: parsed.recommendation,
    candidateVisibleFeedback: parsed.candidate_visible_feedback,
    strengths: parsed.strengths || [],
    recommendations: parsed.recommendations || [],
    submittedAt: parsed.submitted_at,
    verifiedBadge: 'Jadeer Calibrated Engineer',
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. Evaluation Submission (by Interviewer / Admin only)
   ═══════════════════════════════════════════════════════════════════════════ */
export async function submitHumanInterviewEvaluation(params: {
  sessionId: string;
  evaluatorId: string;
  technicalScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  reasoningScore: number;
  overallScore: number;
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'CALIBRATED_JUNIOR' | 'NEEDS_PRACTICE';
  candidateVisibleFeedback: string;
  internalNotes?: string;
  strengths?: string[];
  recommendations?: string[];
}): Promise<{ success: boolean; evaluationId: string; status: string }> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Cannot submit evaluation.');
  }

  const { data, error } = await supabase.rpc('submit_calibration_evaluation_atomic', {
    p_session_id: params.sessionId,
    p_evaluator_id: params.evaluatorId,
    p_technical_score: params.technicalScore,
    p_problem_solving_score: params.problemSolvingScore,
    p_communication_score: params.communicationScore,
    p_reasoning_score: params.reasoningScore,
    p_overall_score: params.overallScore,
    p_recommendation: params.recommendation,
    p_candidate_visible_feedback: params.candidateVisibleFeedback,
    p_internal_notes: params.internalNotes || null,
    p_strengths: params.strengths || [],
    p_recommendations: params.recommendations || [],
  });

  if (error) throw new Error(error.message);

  const res = typeof data === 'string' ? JSON.parse(data) : (data as any);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jadeer:human-calibration-changed'));
  }

  return {
    success: true,
    evaluationId: res.evaluation_id,
    status: res.status || 'completed',
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   9. Admin Helpers (server-side only — use admin API routes in production)
   ═══════════════════════════════════════════════════════════════════════════ */
export async function assignInterviewerByAdmin(
  candidateUserId: string,
  expertId?: string
): Promise<{ success: boolean; expert: AssignedExpertProfile }> {
  throw new Error(
    'assignInterviewerByAdmin must be called from a server-side admin API route, not from the browser.'
  );
}

export async function resetCandidateAssignment(
  candidateUserId: string
): Promise<{ success: boolean }> {
  throw new Error(
    'resetCandidateAssignment must be called from a server-side admin API route, not from the browser.'
  );
}
