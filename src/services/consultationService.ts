/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — 1-TO-1 TECHNICAL CONSULTATION CLIENT SERVICE (SUPABASE PRODUCTION)
   ─────────────────────────────────────────────────────────────────────────
   Production Supabase client service for Candidate 1-to-1 Consultations.
   Uses SECURITY DEFINER RPCs that accept Clerk user IDs directly (no Supabase
   Auth session required). All candidate reads go through RPC — never raw SELECT.

   Supabase operations:
     • ensure_candidate_profile       — upsert user + student_profile rows
     • get_my_sessions                — consultation history (SDRF)
     • get_consultation_outcome       — outcome + action items (SDRF)
     • book_session_atomic            — atomic slot lock + session create
     • reschedule_session_atomic      — atomic slot swap, same consultant
     • cancel_session_atomic          — cancel + slot release
     • experts                        — consultant list (PostgREST, RLS-public)
     • expert_availability_slots      — available slots (PostgREST, RLS-public)
   ═══════════════════════════════════════════════════════════════════════════ */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  syncSessionToCalendar,
  deleteCalendarEvent,
} from './googleCalendarClient';

/* ── isDev: explicit development-only demo flag ─────────────────────────── */
const isDev = import.meta.env.DEV === true && import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

/* ════════════════════════════════════════════════════════
   INTERFACES
   ════════════════════════════════════════════════════════ */

export interface ConsultationTopic {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  estimatedMinutes: number;
  learningOutcomes: string[];
  badge?: string;
  shortDesc?: string;
}

export interface FactualConsultant {
  id: string;
  fullName: string;
  initials: string;
  title: string;
  company: string;
  bio: string;
  track: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  avatarUrl?: string;
  factualCredential: string;
  nextAvailable?: string;
}

export interface ConsultationSlot {
  id: string;
  expertId: string;
  dateKey: string;
  timeLabel: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: 'available' | 'booked';
}

export interface BookConsultationParams {
  candidateUserId: string;
  consultantId: string;
  slotId: string;
  topic: string;
  topicTitle: string;
  goal?: string;
  candidateMessage?: string;
  timezone?: string;
}

export interface BookConsultationResult {
  success: boolean;
  sessionId: string;
  consultantId: string;
  topic: string;
  topicTitle: string;
  goal?: string;
  candidateMessage?: string;
  slotId: string;
  dateKey: string;
  timeLabel: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  timezone: string;
  meetingUrl: string;
  status: string;
  message: string;
  consultant: {
    id: string;
    fullName: string;
    initials: string;
    title: string;
    company: string;
    factualCredential: string;
  };
  googleCalendarEventId?: string | null;
  googleCalendarSyncStatus?: 'not_connected' | 'pending' | 'synced' | 'failed';
  googleCalendarHtmlLink?: string | null;
}

export interface CandidateConsultationItem {
  sessionId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  slotId?: string;
  dateKey: string;
  timeLabel: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  timezone: string;
  meetingUrl: string;
  consultant: {
    id: string;
    fullName: string;
    initials: string;
    title: string;
    company: string;
    factualCredential: string;
  };
  consultationDetails?: {
    id: string;
    sessionId: string;
    topic: string;
    topicTitle: string;
    goal?: string;
    candidateMessage?: string;
    outcomeSummary?: string;
    actionItems?: string[];
    deliverables?: any;
    createdAt: string;
    updatedAt: string;
  };
  googleCalendarEventId?: string | null;
  googleCalendarSyncStatus?: 'not_connected' | 'pending' | 'synced' | 'failed';
  googleCalendarSyncedAt?: string | null;
  googleCalendarLastError?: string | null;
  googleCalendarHtmlLink?: string | null;
}

export interface RescheduleConsultationParams {
  sessionId: string;
  candidateUserId: string;
  newSlotId: string;
}

export interface RescheduleConsultationResult {
  success: boolean;
  sessionId: string;
  slotId: string;
  dateKey: string;
  timeLabel: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  timezone: string;
  status: string;
  message: string;
}

export interface CancelConsultationParams {
  sessionId: string;
  cancelledBy?: string;
  reason?: string;
}

export interface ConsultationOutcomeResult {
  hasOutcome: boolean;
  sessionId?: string;
  status?: string;
  consultant?: { fullName: string; title: string; company: string };
  topic?: string;
  topicTitle?: string;
  goal?: string;
  outcomeSummary?: string;
  actionItems?: string[];
  deliverables?: {
    recordingUrl?: string;
    recordingDuration?: string;
    resources?: Array<{ title: string; url: string; type?: string }>;
  };
  completedAt?: string;
  message?: string;
}

export interface SubmitOutcomeParams {
  sessionId: string;
  expertId: string;
  outcomeSummary: string;
  actionItems?: string[];
  deliverables?: any;
}

/* ════════════════════════════════════════════════════════
   STATIC DATA
   ════════════════════════════════════════════════════════ */

const STANDARDIZED_TOPICS: ConsultationTopic[] = [
  {
    id: 'career-direction',
    title: 'Career Direction & Track Specialization',
    subtitle: 'High-Impact Engineering Growth',
    description: 'Map out senior/staff engineering progression, technical focus areas, and industry positioning.',
    iconName: 'Compass',
    estimatedMinutes: 60,
    learningOutcomes: [
      'Tailored 12-month engineering specialization path',
      'Target compensation and company tiers in Saudi/GCC tech',
      'Core technical competencies to prioritize',
    ],
  },
  {
    id: 'technical-gap',
    title: 'Technical Gap Review',
    subtitle: 'Deep-Dive Assessment Analysis',
    description: 'Break down strengths and gaps identified during the AI Assessment or Human Calibration.',
    iconName: 'Cpu',
    estimatedMinutes: 60,
    learningOutcomes: [
      'Actionable remediation plan for identified blindspots',
      'Curated distributed systems reading list & problem sets',
      'Architectural patterns and trade-off defense mastery',
    ],
  },
  {
    id: 'project-guidance',
    title: 'Project & System Architecture Guidance',
    subtitle: 'Capstone & Production Architecture',
    description: 'Review system design choices, asynchronous event topologies, data models, and benchmark telemetry.',
    iconName: 'Layers',
    estimatedMinutes: 60,
    learningOutcomes: [
      'Architectural review of capstone distributed systems',
      'Database schema, index strategy, and caching optimization',
      'Production observability and resilience validation',
    ],
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation & Live Defense',
    subtitle: 'Tier-1 Tech Technical Interviews',
    description: 'Practice whiteboarding, live system design defense, and deep dive into technical questions.',
    iconName: 'GraduationCap',
    estimatedMinutes: 60,
    learningOutcomes: [
      'Live mock design round with architectural critique',
      'Techniques for structuring complex scalability answers',
      'Framework for articulating concurrency and fault tolerance',
    ],
  },
  {
    id: 'portfolio-review',
    title: 'Evidence Portfolio & Code Review',
    subtitle: 'Verification Proof Artifacts',
    description: 'Fine-tune git commits, pull request narratives, benchmark runs, and technical evidence.',
    iconName: 'Code',
    estimatedMinutes: 60,
    learningOutcomes: [
      'Code quality, linting, and architectural review',
      'Evidence presentation optimization for employer hiring managers',
      'Repository documentation and setup friction elimination',
    ],
  },
  {
    id: 'job-readiness',
    title: 'Job Readiness & Salary Negotiation',
    subtitle: 'Landing the Role',
    description: 'Navigate engineering offers, equity terms, technical culture matching, and interview pipelines.',
    iconName: 'Briefcase',
    estimatedMinutes: 60,
    learningOutcomes: [
      'Offer evaluation and market compensation benchmarks',
      'Technical interview pipeline navigation strategies',
      'Long-term engineering career trajectory alignment',
    ],
  },
];

/* Mock data — only shown when isDev=true */
export const FALLBACK_CONSULTANTS: FactualConsultant[] = [];
export const FALLBACK_CONSULTATION_SLOTS: Record<string, ConsultationSlot[]> = {};

/* ════════════════════════════════════════════════════════
   UTILITY HELPERS
   ════════════════════════════════════════════════════════ */

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

function mapConsultant(exp: any): FactualConsultant {
  return {
    id: exp.id,
    fullName: exp.full_name,
    initials: exp.initials || (exp.full_name?.split(' ').map((w: string) => w[0]).join('') || '?'),
    title: exp.title,
    company: exp.company,
    bio: exp.bio || '',
    track: exp.track,
    specialties: exp.specialties || [],
    rating: Number(exp.rating) || 5.0,
    reviewCount: Number(exp.review_count) || 0,
    sessionsCompleted: Number(exp.sessions_completed) || 0,
    factualCredential: `${exp.title} • ${exp.company}`,
  };
}

/* ════════════════════════════════════════════════════════
   1. CONSULTATION TOPICS (static)
   ════════════════════════════════════════════════════════ */
export async function getConsultationTopics(): Promise<ConsultationTopic[]> {
  return STANDARDIZED_TOPICS;
}

/* ════════════════════════════════════════════════════════
   2. ELIGIBLE CONSULTANTS
   All active consultants visible to any candidate.
   Topic is context only — does NOT filter eligibility.
   Track filter is advisory (shows best matches first) but
   falls back to all active consultants if no track match.
   ════════════════════════════════════════════════════════ */
export async function getEligibleConsultants(
  _candidateTrack?: string
): Promise<FactualConsultant[]> {
  if (!isSupabaseConfigured) {
    if (isDev) return FALLBACK_CONSULTANTS;
    throw new Error('Supabase is not configured. Cannot load consultants.');
  }

  // All active consultants — show all regardless of track (topic/track are context only)
  const { data, error } = await supabase
    .from('experts')
    .select('id, role, full_name, initials, title, company, bio, track, specialties, rating, review_count, sessions_completed')
    .in('role', ['CONSULTANT', 'BOTH'])
    .eq('is_active', true)
    .order('rating', { ascending: false });

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return [];

  return data.map(mapConsultant);
}

/** Domain-level alias */
export const getConsultantsForTrack = getEligibleConsultants;

/* ════════════════════════════════════════════════════════
   3. CONSULTANT AVAILABILITY SLOTS
   ════════════════════════════════════════════════════════ */
export async function getConsultantAvailability(
  consultantId: string
): Promise<{ consultant: any; slots: Record<string, ConsultationSlot[]>; totalAvailable: number }> {
  if (!isSupabaseConfigured) {
    if (isDev) {
      return { consultant: null, slots: {}, totalAvailable: 0 };
    }
    throw new Error('Supabase is not configured.');
  }

  const [expertResult, slotsResult] = await Promise.all([
    supabase
      .from('experts')
      .select('id, full_name, initials, title, company')
      .eq('id', consultantId)
      .maybeSingle(),
    supabase
      .from('expert_availability_slots')
      .select('id, expert_id, start_time, end_time, timezone, status')
      .eq('expert_id', consultantId)
      .eq('status', 'available')
      .order('start_time', { ascending: true }),
  ]);

  if (slotsResult.error) throw new Error(slotsResult.error.message);

  const expert = expertResult.data;
  const slotsData = slotsResult.data || [];

  const grouped: Record<string, ConsultationSlot[]> = {};
  for (const s of slotsData) {
    const dateKey = toDateKey(s.start_time);
    const item: ConsultationSlot = {
      id: s.id,
      expertId: s.expert_id,
      dateKey,
      timeLabel: toTimeLabel(s.start_time, s.end_time),
      startTime: s.start_time,
      endTime: s.end_time,
      timezone: s.timezone || 'Asia/Riyadh',
      status: 'available',
    };
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(item);
  }

  return {
    consultant: expert
      ? {
          id: expert.id,
          fullName: expert.full_name,
          initials: expert.initials,
          title: expert.title,
          company: expert.company,
          factualCredential: `${expert.title} • ${expert.company}`,
        }
      : null,
    slots: grouped,
    totalAvailable: slotsData.length,
  };
}

/* ════════════════════════════════════════════════════════
   4. BOOK CONSULTATION SESSION (Atomic)
   ════════════════════════════════════════════════════════ */
export async function bookConsultation(
  params: BookConsultationParams
): Promise<BookConsultationResult> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Cannot book consultation.');
  }

  const { data, error } = await supabase.rpc('book_session_atomic', {
    p_candidate_user_id: params.candidateUserId,
    p_slot_id: params.slotId,
    p_session_type: 'consultation',
    p_consultation_topic: params.topic,
    p_consultation_topic_title: params.topicTitle,
    p_consultation_goal: params.goal || null,
    p_consultation_message: params.candidateMessage || null,
    p_timezone: params.timezone || 'Asia/Riyadh',
  });

  if (error) throw new Error(error.message);

  const res = typeof data === 'string' ? JSON.parse(data) : (data as any);
  const expData = res.expert || {};

  const result: BookConsultationResult = {
    success: true,
    sessionId: res.session_id || res.id,
    consultantId: params.consultantId,
    topic: params.topic,
    topicTitle: params.topicTitle,
    goal: params.goal,
    candidateMessage: params.candidateMessage,
    slotId: res.slot_id,
    dateKey: toDateKey(res.scheduled_start_time),
    timeLabel: toTimeLabel(res.scheduled_start_time, res.scheduled_end_time),
    scheduledStartTime: res.scheduled_start_time,
    scheduledEndTime: res.scheduled_end_time,
    timezone: res.timezone || params.timezone || 'Asia/Riyadh',
    meetingUrl: res.meeting_url,
    status: res.status || 'scheduled',
    message: 'Consultation confirmed successfully',
    consultant: {
      id: expData.id || params.consultantId,
      fullName: expData.full_name || expData.fullName || 'Consultant',
      initials: expData.initials || 'C',
      title: expData.title || 'Technical Mentor',
      company: expData.company || 'Jadeer',
      factualCredential: `${expData.title || 'Mentor'} • ${expData.company || 'Jadeer'}`,
    },
  };

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jadeer:consultations-changed'));
  }

  // External Google Calendar sync (background task, non-blocking)
  syncSessionToCalendar({
    sessionId: result.sessionId,
    candidateUserId: params.candidateUserId,
    sessionType: 'consultation',
    scheduledStartTime: result.scheduledStartTime,
    scheduledEndTime: result.scheduledEndTime,
    timezone: result.timezone || 'Asia/Riyadh',
    meetingUrl: result.meetingUrl,
    expertName: result.consultant.fullName,
    expertTitle: result.consultant.title,
    topicTitle: result.topicTitle,
  }).catch(() => {
    // Non-blocking
  });

  return result;
}

/* ════════════════════════════════════════════════════════
   5. MY CONSULTATIONS (Active & Completed History)
   ════════════════════════════════════════════════════════ */
export async function getMyConsultations(
  candidateUserId: string
): Promise<CandidateConsultationItem[]> {
  if (!isSupabaseConfigured) {
    if (isDev) return [];
    throw new Error('Supabase is not configured. Cannot load consultations.');
  }

  const { data, error } = await supabase.rpc('get_my_sessions', {
    p_candidate_user_id: candidateUserId,
    p_session_type: 'consultation',
  });

  if (error) throw new Error(error.message);

  const sessions: any[] = Array.isArray(data) ? data : [];

  return sessions.map((s) => {
    const exp = s.expert || {};
    const cd = s.consultation_details;
    return {
      sessionId: s.session_id,
      status: s.status,
      slotId: s.slot_id,
      dateKey: toDateKey(s.scheduled_start_time),
      timeLabel: toTimeLabel(s.scheduled_start_time, s.scheduled_end_time),
      scheduledStartTime: s.scheduled_start_time,
      scheduledEndTime: s.scheduled_end_time,
      timezone: s.timezone || 'Asia/Riyadh',
      meetingUrl: s.meeting_url,
      googleCalendarEventId: s.google_calendar_event_id || null,
      googleCalendarSyncStatus: s.google_calendar_sync_status || 'not_connected',
      googleCalendarSyncedAt: s.google_calendar_synced_at || null,
      googleCalendarLastError: s.google_calendar_last_error || null,
      googleCalendarHtmlLink: s.google_calendar_event_id
        ? `https://calendar.google.com/calendar/event?eid=${s.google_calendar_event_id}`
        : null,
      consultant: {
        id: exp.id || '',
        fullName: exp.full_name || 'Consultant',
        initials: exp.initials || 'C',
        title: exp.title || 'Technical Mentor',
        company: exp.company || 'Jadeer',
        factualCredential: `${exp.title || 'Mentor'} • ${exp.company || 'Jadeer'}`,
      },
      consultationDetails: cd
        ? {
            id: cd.id || s.session_id,
            sessionId: s.session_id,
            topic: cd.topic,
            topicTitle: cd.topic_title,
            goal: cd.goal,
            candidateMessage: cd.candidate_message,
            outcomeSummary: cd.outcome_summary,
            actionItems: cd.action_items,
            deliverables: cd.deliverables,
            createdAt: cd.created_at,
            updatedAt: cd.updated_at,
          }
        : undefined,
    };
  });
}

/* ════════════════════════════════════════════════════════
   6. RESCHEDULE CONSULTATION (Same Consultant)
   ════════════════════════════════════════════════════════ */
export async function rescheduleConsultation(
  params: RescheduleConsultationParams
): Promise<RescheduleConsultationResult> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Cannot reschedule consultation.');
  }

  const { data, error } = await supabase.rpc('reschedule_session_atomic', {
    p_session_id: params.sessionId,
    p_candidate_user_id: params.candidateUserId,
    p_new_slot_id: params.newSlotId,
  });

  if (error) throw new Error(error.message);

  const res = typeof data === 'string' ? JSON.parse(data) : (data as any);
  const result: RescheduleConsultationResult = {
    success: true,
    sessionId: res.session_id,
    slotId: res.slot_id,
    dateKey: toDateKey(res.scheduled_start_time),
    timeLabel: toTimeLabel(res.scheduled_start_time, res.scheduled_end_time),
    scheduledStartTime: res.scheduled_start_time,
    scheduledEndTime: res.scheduled_end_time,
    timezone: res.timezone || 'Asia/Riyadh',
    status: 'scheduled',
    message: 'Consultation rescheduled successfully with same consultant',
  };

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jadeer:consultations-changed'));
  }

  // Reschedule existing Google Calendar event (non-blocking)
  syncSessionToCalendar({
    sessionId: params.sessionId,
    candidateUserId: params.candidateUserId,
    sessionType: 'consultation',
    scheduledStartTime: result.scheduledStartTime,
    scheduledEndTime: result.scheduledEndTime,
    timezone: result.timezone || 'Asia/Riyadh',
    meetingUrl: null,
    expertName: 'Technical Mentor',
  }).catch(() => {
    // Non-blocking
  });

  return result;
}

/* ════════════════════════════════════════════════════════
   7. CANCEL CONSULTATION
   ════════════════════════════════════════════════════════ */
export async function cancelConsultation(
  params: CancelConsultationParams
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Cannot cancel consultation.');
  }

  const { data, error } = await supabase.rpc('cancel_session_atomic', {
    p_session_id: params.sessionId,
    p_cancelled_by: params.cancelledBy || 'candidate',
    p_cancellation_reason: params.reason || 'Candidate requested cancellation via portal',
  });

  if (error) throw new Error(error.message);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jadeer:consultations-changed'));
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
    message: 'Consultation cancelled and slot released successfully',
  };
}

/* ════════════════════════════════════════════════════════
   8. CONSULTATION OUTCOME & ACTION ITEMS
   ════════════════════════════════════════════════════════ */
export async function getConsultationOutcome(
  sessionId: string,
  candidateUserId: string
): Promise<ConsultationOutcomeResult> {
  if (!isSupabaseConfigured) {
    if (isDev) return { hasOutcome: false };
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.rpc('get_consultation_outcome', {
    p_session_id: sessionId,
    p_candidate_user_id: candidateUserId,
  });

  if (error) throw new Error(error.message);
  const parsed = typeof data === 'string' ? JSON.parse(data) : (data as any);

  return {
    hasOutcome: Boolean(parsed.has_outcome),
    sessionId: parsed.session_id,
    status: parsed.status,
    consultant: parsed.consultant,
    topic: parsed.topic,
    topicTitle: parsed.topic_title,
    goal: parsed.goal,
    outcomeSummary: parsed.outcome_summary,
    actionItems: parsed.action_items || [],
    deliverables: parsed.deliverables || {},
    completedAt: parsed.completed_at,
  };
}

/* ════════════════════════════════════════════════════════
   9. SUBMIT CONSULTATION OUTCOME (Consultant Action)
   ════════════════════════════════════════════════════════ */
export async function submitConsultationOutcome(
  params: SubmitOutcomeParams
): Promise<{ success: boolean; message?: string }> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Cannot submit outcome.');
  }

  const { data, error } = await supabase.rpc('submit_consultation_outcome_atomic', {
    p_session_id: params.sessionId,
    p_expert_id: params.expertId,
    p_outcome_summary: params.outcomeSummary,
    p_action_items: params.actionItems || [],
    p_deliverables: params.deliverables || {},
  });

  if (error) throw new Error(error.message);

  return {
    success: true,
    message: 'Consultation deliverables submitted successfully',
  };
}
