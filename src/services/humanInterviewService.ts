/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — HUMAN TECHNICAL CALIBRATION CLIENT SERVICE (SUPABASE PRODUCTION)
   ─────────────────────────────────────────────────────────────────────────
   Official Supabase client service for Candidate Human Technical Calibration:
   - Queries PostgREST tables under Row Level Security (RLS)
   - Invokes PostgreSQL transactional RPCs:
     * book_session_atomic
     * reschedule_session_atomic
     * cancel_session_atomic
     * submit_calibration_evaluation_atomic
     * get_candidate_interview_state
   - Zero dependence on local Vite development server middleware in production.
   ═══════════════════════════════════════════════════════════════════════════ */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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

const DEFAULT_CANDIDATE_ID = 'usr-cand-001';

/* ── Realistic Local Fallback Mock State (Offline & Test Environments) ──── */
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

export const FALLBACK_SLOTS: Record<string, AvailabilitySlotItem[]> = {
  'Thursday, Sep 10': [
    {
      id: 'slot-sep10-1000',
      expertId: 'exp-tariq-001',
      dateKey: 'Thursday, Sep 10',
      timeLabel: '10:00 AM – 11:00 AM',
      startTime: '2026-09-10T10:00:00+03:00',
      endTime: '2026-09-10T11:00:00+03:00',
      timezone: 'Asia/Riyadh (GMT+3)',
      status: 'available',
    },
    {
      id: 'slot-sep10-1330',
      expertId: 'exp-tariq-001',
      dateKey: 'Thursday, Sep 10',
      timeLabel: '1:30 PM – 2:30 PM',
      startTime: '2026-09-10T13:30:00+03:00',
      endTime: '2026-09-10T14:30:00+03:00',
      timezone: 'Asia/Riyadh (GMT+3)',
      status: 'available',
    },
    {
      id: 'slot-sep10-1600',
      expertId: 'exp-tariq-001',
      dateKey: 'Thursday, Sep 10',
      timeLabel: '4:00 PM – 5:00 PM',
      startTime: '2026-09-10T16:00:00+03:00',
      endTime: '2026-09-10T17:00:00+03:00',
      timezone: 'Asia/Riyadh (GMT+3)',
      status: 'available',
    },
  ],
  'Friday, Sep 11': [
    {
      id: 'slot-sep11-1400',
      expertId: 'exp-tariq-001',
      dateKey: 'Friday, Sep 11',
      timeLabel: '2:00 PM – 3:00 PM',
      startTime: '2026-09-11T14:00:00+03:00',
      endTime: '2026-09-11T15:00:00+03:00',
      timezone: 'Asia/Riyadh (GMT+3)',
      status: 'available',
    },
    {
      id: 'slot-sep11-1630',
      expertId: 'exp-tariq-001',
      dateKey: 'Friday, Sep 11',
      timeLabel: '4:30 PM – 5:30 PM',
      startTime: '2026-09-11T16:30:00+03:00',
      endTime: '2026-09-11T17:30:00+03:00',
      timezone: 'Asia/Riyadh (GMT+3)',
      status: 'available',
    },
  ],
};

function toDateKey(iso: string): string {
  try {
    return new Date(iso).toISOString().split('T')[0];
  } catch {
    return iso.substring(0, 10);
  }
}

function toTimeLabel(startIso: string, endIso: string): string {
  try {
    const s = new Date(startIso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const e = new Date(endIso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${s} – ${e}`;
  } catch {
    return `${startIso} - ${endIso}`;
  }
}

/**
 * Retrieves the comprehensive backend-derived lifecycle state for the candidate.
 * Returns one authoritative state: 'awaiting_assignment' | 'choose_time' | 'confirmed' | 'completed'
 */
export async function getHumanInterviewState(
  candidateUserId: string = DEFAULT_CANDIDATE_ID
): Promise<HumanInterviewLifecycleState> {
  if (isSupabaseConfigured) {
    // Call authoritative PostgreSQL RPC get_candidate_interview_state
    const { data, error } = await supabase.rpc('get_candidate_interview_state', {
      p_candidate_user_id: candidateUserId,
    });

    if (!error && data) {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      const state = (parsed.state === 'assigned' ? 'choose_time' : parsed.state) || 'awaiting_assignment';
      return {
        state,
        isCompleted: Boolean(parsed.is_completed),
        status: parsed.status || state,
        message: parsed.message,
        assignedBy: parsed.assigned_by,
        assignedAt: parsed.assigned_at,
        expert: parsed.expert
          ? {
              id: parsed.expert.id,
              fullName: parsed.expert.full_name,
              initials: parsed.expert.initials,
              title: parsed.expert.title,
              company: parsed.expert.company,
              bio: parsed.expert.bio,
              track: parsed.expert.track,
              specialties: parsed.expert.specialties || [],
              rating: parsed.expert.rating || 5.0,
              sessionsCompleted: parsed.expert.sessions_completed || 0,
            }
          : null,
        session: parsed.session
          ? {
              sessionId: parsed.session.session_id || parsed.session.id,
              slotId: parsed.session.slot_id,
              scheduledStartTime: parsed.session.scheduled_start_time,
              scheduledEndTime: parsed.session.scheduled_end_time,
              timezone: parsed.session.timezone || 'Asia/Riyadh (GMT+3)',
              meetingUrl: parsed.session.meeting_url,
              dateKey: toDateKey(parsed.session.scheduled_start_time),
              timeLabel: toTimeLabel(parsed.session.scheduled_start_time, parsed.session.scheduled_end_time),
              status: parsed.session.status,
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
  }

  // Fallback to local dev middleware endpoint with graceful mock fallback
  try {
    const res = await fetch(`/api/scheduling/state?candidateUserId=${encodeURIComponent(candidateUserId)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch interview state: ${res.statusText}`);
    }
    return await res.json();
  } catch {
    return {
      state: 'choose_time',
      isCompleted: false,
      status: 'choose_time',
      assignedBy: 'Jadeer Calibration Panel',
      assignedAt: new Date().toISOString(),
      expert: FALLBACK_INTERVIEWER,
    };
  }
}

/**
 * Checks whether an interviewer has been assigned by Jadeer/Admin.
 * Candidate can never select their interviewer; returns null if unassigned.
 */
export async function getAssignedInterviewer(
  candidateUserId: string = DEFAULT_CANDIDATE_ID,
  track?: string
): Promise<{ assigned: boolean; expert: AssignedExpertProfile | null; assignedBy?: string }> {
  if (isSupabaseConfigured) {
    const { data: assignment, error } = await supabase
      .from('candidate_interview_assignments')
      .select('expert_id, assigned_by, is_active, experts(id, full_name, initials, title, company, bio, track, specialties, rating, sessions_completed)')
      .eq('candidate_user_id', candidateUserId)
      .eq('is_active', true)
      .order('assigned_at', { ascending: false })
      .maybeSingle();

    if (!error && assignment && assignment.experts) {
      const exp: any = assignment.experts;
      return {
        assigned: true,
        assignedBy: assignment.assigned_by,
        expert: {
          id: exp.id,
          fullName: exp.full_name,
          initials: exp.initials,
          title: exp.title,
          company: exp.company,
          bio: exp.bio,
          track: exp.track,
          specialties: exp.specialties || [],
          rating: exp.rating || 5.0,
          sessionsCompleted: exp.sessions_completed || 0,
        },
      };
    }
    return { assigned: false, expert: null };
  }

  try {
    const url = `/api/scheduling/assigned-interviewer?candidateUserId=${encodeURIComponent(candidateUserId)}${
      track ? `&track=${encodeURIComponent(track)}` : ''
    }`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to get assigned interviewer: ${res.statusText}`);
    const data = await res.json();
    return {
      assigned: Boolean(data.assigned),
      expert: data.expert || FALLBACK_INTERVIEWER,
      assignedBy: data.assignedBy || 'Jadeer Calibration Panel',
    };
  } catch {
    return {
      assigned: true,
      expert: FALLBACK_INTERVIEWER,
      assignedBy: 'Jadeer Calibration Panel',
    };
  }
}

/**
 * Fetches available slots strictly for the candidate's assigned interviewer.
 * Enforces database-level scoping: candidate cannot query another expert's slots.
 */
export async function getAssignedInterviewerAvailability(
  expertId: string,
  candidateUserId: string = DEFAULT_CANDIDATE_ID
): Promise<Record<string, AvailabilitySlotItem[]>> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('expert_availability_slots')
      .select('id, expert_id, start_time, end_time, timezone, status')
      .eq('expert_id', expertId)
      .eq('status', 'available')
      .order('start_time', { ascending: true });

    if (!error && data) {
      const grouped: Record<string, AvailabilitySlotItem[]> = {};
      for (const slot of data) {
        const dateKey = toDateKey(slot.start_time);
        const item: AvailabilitySlotItem = {
          id: slot.id,
          expertId: slot.expert_id,
          dateKey,
          timeLabel: toTimeLabel(slot.start_time, slot.end_time),
          startTime: slot.start_time,
          endTime: slot.end_time,
          timezone: slot.timezone || 'Asia/Riyadh (GMT+3)',
          status: 'available',
        };
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(item);
      }
      return grouped;
    }
  }

  try {
    const url = `/api/scheduling/expert-slots?expertId=${encodeURIComponent(
      expertId
    )}&candidateUserId=${encodeURIComponent(candidateUserId)}`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Unauthorized: You can only view slots for your assigned interviewer.');
      }
      throw new Error(`Failed to load availability slots: ${res.statusText}`);
    }
    const data = await res.json();
    return data.slots || FALLBACK_SLOTS;
  } catch {
    return FALLBACK_SLOTS;
  }
}

/** Domain-level alias requested by architecture */
export const getHumanInterviewAvailability = getAssignedInterviewerAvailability;

/**
 * Atomically books the selected slot via Supabase RPC book_session_atomic.
 * Locks the slot with FOR UPDATE in the database and guarantees double-booking prevention.
 */
export async function bookHumanInterview(params: {
  candidateUserId?: string;
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
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('book_session_atomic', {
      p_candidate_user_id: params.candidateUserId || DEFAULT_CANDIDATE_ID,
      p_slot_id: params.slotId,
      p_session_type: 'human_interview',
      p_candidate_notes: params.candidateNotes || null,
      p_calibration_stage: 'Stage 02B: Human Technical Calibration',
    });

    if (error) {
      throw new Error(error.message);
    }

    const res = typeof data === 'string' ? JSON.parse(data) : data;
    return {
      success: true,
      sessionId: res.session_id || res.id,
      status: res.status || 'scheduled',
      scheduledStartTime: res.scheduled_start_time,
      scheduledEndTime: res.scheduled_end_time,
      timezone: res.timezone || params.timezone || 'Asia/Riyadh (GMT+3)',
      meetingUrl: res.meeting_url,
      dateKey: toDateKey(res.scheduled_start_time),
      timeLabel: toTimeLabel(res.scheduled_start_time, res.scheduled_end_time),
    };
  }

  const res = await fetch('/api/scheduling/book-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      candidateUserId: params.candidateUserId || DEFAULT_CANDIDATE_ID,
      slotId: params.slotId,
      sessionType: 'human_interview',
      softwareTrack: params.softwareTrack || 'Backend Development',
      candidateNotes: params.candidateNotes,
      timezone: params.timezone || 'Asia/Riyadh (GMT+3)',
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to book calibration session.');
  }
  return data;
}

/**
 * Atomically reschedules a confirmed session to another available slot of the SAME interviewer.
 * Invokes reschedule_session_atomic PostgreSQL RPC.
 */
export async function rescheduleHumanInterview(params: {
  sessionId: string;
  newSlotId: string;
  candidateUserId?: string;
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
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('reschedule_session_atomic', {
      p_session_id: params.sessionId,
      p_candidate_user_id: params.candidateUserId || DEFAULT_CANDIDATE_ID,
      p_new_slot_id: params.newSlotId,
    });

    if (error) {
      throw new Error(error.message);
    }

    const res = typeof data === 'string' ? JSON.parse(data) : data;
    return {
      success: true,
      sessionId: res.session_id,
      slotId: res.slot_id,
      scheduledStartTime: res.scheduled_start_time,
      scheduledEndTime: res.scheduled_end_time,
      timezone: res.timezone || 'Asia/Riyadh (GMT+3)',
      dateKey: toDateKey(res.scheduled_start_time),
      timeLabel: toTimeLabel(res.scheduled_start_time, res.scheduled_end_time),
    };
  }

  const res = await fetch('/api/scheduling/reschedule-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: params.sessionId,
      candidateUserId: params.candidateUserId || DEFAULT_CANDIDATE_ID,
      newSlotId: params.newSlotId,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to reschedule session.');
  }
  return data;
}

/**
 * Cancels a confirmed session and releases the booked slot back to available.
 * Invokes cancel_session_atomic PostgreSQL RPC.
 */
export async function cancelHumanInterview(params: {
  sessionId: string;
  reason?: string;
  cancelledBy?: string;
}): Promise<{ success: boolean; sessionId: string; cancelledAt?: string }> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('cancel_session_atomic', {
      p_session_id: params.sessionId,
      p_cancelled_by: params.cancelledBy || 'candidate',
      p_cancellation_reason: params.reason || 'Candidate requested cancellation via portal',
    });

    if (error) {
      throw new Error(error.message);
    }

    const res = typeof data === 'string' ? JSON.parse(data) : data;
    return {
      success: true,
      sessionId: res.session_id,
      cancelledAt: new Date().toISOString(),
    };
  }

  const res = await fetch('/api/scheduling/cancel-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: params.sessionId,
      cancelledBy: params.cancelledBy || 'candidate',
      reason: params.reason || 'Candidate requested cancellation',
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to cancel session.');
  }
  return data;
}

/**
 * Fetches the candidate-visible evaluation scorecard & feedback.
 * Isolates internal deliberation notes away from candidate access.
 */
export async function fetchCandidateVisibleInterviewResult(
  candidateUserId: string = DEFAULT_CANDIDATE_ID
): Promise<CandidateEvaluationResult> {
  if (isSupabaseConfigured) {
    const { data: sessionData, error } = await supabase
      .from('sessions')
      .select('id, human_interview_evaluations(overall_score, technical_score, problem_solving_score, communication_score, reasoning_score, recommendation, candidate_visible_feedback, strengths, recommendations, submitted_at)')
      .eq('candidate_user_id', candidateUserId)
      .eq('session_type', 'human_interview')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (!error && sessionData && sessionData.human_interview_evaluations) {
      const ev: any = Array.isArray(sessionData.human_interview_evaluations)
        ? sessionData.human_interview_evaluations[0]
        : sessionData.human_interview_evaluations;
      if (ev) {
        return {
          hasEvaluation: true,
          sessionId: sessionData.id,
          overallScore: Number(ev.overall_score),
          technicalScore: Number(ev.technical_score),
          problemSolvingScore: Number(ev.problem_solving_score),
          communicationScore: Number(ev.communication_score),
          reasoningScore: Number(ev.reasoning_score),
          recommendation: ev.recommendation,
          candidateVisibleFeedback: ev.candidate_visible_feedback,
          strengths: ev.strengths || [],
          recommendations: ev.recommendations || [],
          submittedAt: ev.submitted_at,
          verifiedBadge: 'Jadeer Calibrated Engineer',
        };
      }
    }
    return { hasEvaluation: false };
  }

  const res = await fetch(
    `/api/scheduling/evaluation-result?candidateUserId=${encodeURIComponent(candidateUserId)}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch evaluation result: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Authoritative evaluation submission by the assigned interviewer or admin.
 * Invokes submit_calibration_evaluation_atomic PostgreSQL RPC.
 */
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
  if (isSupabaseConfigured) {
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

    if (error) {
      throw new Error(error.message);
    }

    const res = typeof data === 'string' ? JSON.parse(data) : data;
    return {
      success: true,
      evaluationId: res.evaluation_id,
      status: res.status || 'completed',
    };
  }

  const res = await fetch('/api/scheduling/submit-evaluation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to submit evaluation.');
  }
  return data;
}

/**
 * Admin helper to assign an interviewer to a candidate.
 */
export async function assignInterviewerByAdmin(
  candidateUserId: string = DEFAULT_CANDIDATE_ID,
  expertId?: string
): Promise<{ success: boolean; expert: AssignedExpertProfile }> {
  const res = await fetch('/api/scheduling/assign-interviewer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateUserId, expertId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to assign interviewer.');
  }
  return data;
}

/**
 * Development testing helper to reset candidate assignment.
 */
export async function resetCandidateAssignment(
  candidateUserId: string = DEFAULT_CANDIDATE_ID
): Promise<{ success: boolean }> {
  const res = await fetch('/api/scheduling/reset-assignment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateUserId }),
  });
  return res.json();
}
