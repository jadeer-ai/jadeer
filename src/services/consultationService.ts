/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — 1-TO-1 TECHNICAL CONSULTATION CLIENT SERVICE (SUPABASE PRODUCTION)
   ─────────────────────────────────────────────────────────────────────────
   Official Supabase client service for Candidate 1-to-1 Consultations:
   - Queries PostgREST tables under Row Level Security (RLS)
   - Invokes PostgreSQL transactional RPCs:
     * book_session_atomic (with session_type = 'consultation')
     * reschedule_session_atomic (same consultant invariant)
     * cancel_session_atomic (releases slot back to available)
     * submit_consultation_outcome_atomic (consultant deliverable entry)
   - Zero dependence on local Vite development server middleware in production.
   ═══════════════════════════════════════════════════════════════════════════ */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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
  consultant?: {
    fullName: string;
    title: string;
    company: string;
  };
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

export const FALLBACK_CONSULTANTS: FactualConsultant[] = [
  {
    id: 'exp-khaled-hamdy',
    fullName: 'Eng. Khaled Hamdy',
    initials: 'KH',
    title: 'Principal Backend Architect',
    company: 'Jadeer Senior Mentor',
    bio: 'Specialized in microservices architecture, asynchronous event buses with Kafka, and database sharding at scale.',
    track: 'Backend Development',
    specialties: ['Microservices', 'Kafka & Event Streaming', 'PostgreSQL & Sharding', 'System Design'],
    rating: 4.9,
    reviewCount: 29,
    sessionsCompleted: 78,
    factualCredential: 'Jadeer Senior Mentor',
    nextAvailable: 'Thursday, Sep 10',
  },
  {
    id: 'exp-yasmin-farouk',
    fullName: 'Eng. Yasmin Farouk',
    initials: 'YF',
    title: 'Staff Frontend Architect',
    company: 'Jadeer UI/UX Panel',
    bio: 'Designing high-performance web applications, design systems with React 19, and accessible micro-frontends with ultra-fast Core Web Vitals.',
    track: 'Frontend Development',
    specialties: ['React 19 & Next.js', 'TypeScript', 'Design Systems', 'Web Performance'],
    rating: 4.9,
    reviewCount: 24,
    sessionsCompleted: 92,
    factualCredential: 'Jadeer Senior Mentor',
    nextAvailable: 'Friday, Sep 11',
  },
  {
    id: 'exp-nour-eldin',
    fullName: 'Dr. Nour El-Din',
    initials: 'ND',
    title: 'Staff AI Research Engineer',
    company: 'Jadeer AI Lead',
    bio: 'PhD in Deep Learning and LLM architecture. Experienced in PyTorch distributed training, RAG vector pipelines, and inference optimization.',
    track: 'AI & Data Engineering',
    specialties: ['PyTorch & LLMs', 'Vector Databases', 'Data Pipelines', 'Model Quantization'],
    rating: 4.98,
    reviewCount: 31,
    sessionsCompleted: 74,
    factualCredential: 'Jadeer AI Research Fellow',
    nextAvailable: 'Saturday, Sep 12',
  },
  {
    id: 'exp-sarah-tamimi',
    fullName: 'Eng. Sarah Al-Tamimi',
    initials: 'ST',
    title: 'Principal Cloud & DevOps Architect',
    company: 'Jadeer Infrastructure Lead',
    bio: 'Cloud-native Kubernetes orchestration, zero-downtime CI/CD deployments, and infrastructure resilience on AWS & GCP.',
    track: 'DevOps & Cloud Engineering',
    specialties: ['Kubernetes', 'Terraform & CI/CD', 'AWS & GCP Infrastructure', 'Site Reliability'],
    rating: 4.92,
    reviewCount: 42,
    sessionsCompleted: 115,
    factualCredential: 'Verified Cloud Mentor',
    nextAvailable: 'Friday, Sep 11',
  },
];

export const FALLBACK_CONSULTATION_SLOTS: Record<string, ConsultationSlot[]> = {
  'exp-khaled-hamdy': [
    {
      id: 'c-slot-kh-1',
      expertId: 'exp-khaled-hamdy',
      dateKey: 'Thursday, Sep 10',
      timeLabel: '11:00 AM – 12:00 PM',
      startTime: '2026-09-10T11:00:00+03:00',
      endTime: '2026-09-10T12:00:00+03:00',
      timezone: 'Asia/Riyadh (GMT+3)',
      status: 'available',
    },
    {
      id: 'c-slot-kh-2',
      expertId: 'exp-khaled-hamdy',
      dateKey: 'Thursday, Sep 10',
      timeLabel: '3:00 PM – 4:00 PM',
      startTime: '2026-09-10T15:00:00+03:00',
      endTime: '2026-09-10T16:00:00+03:00',
      timezone: 'Asia/Riyadh (GMT+3)',
      status: 'available',
    },
  ],
  'exp-sarah-tamimi': [
    {
      id: 'c-slot-st-1',
      expertId: 'exp-sarah-tamimi',
      dateKey: 'Friday, Sep 11',
      timeLabel: '2:00 PM – 3:00 PM',
      startTime: '2026-09-11T14:00:00+03:00',
      endTime: '2026-09-11T15:00:00+03:00',
      timezone: 'Asia/Riyadh (GMT+3)',
      status: 'available',
    },
  ],
};

/* ── 1. Fetch Standardized Consultation Topics ──────────────────────────── */
export async function getConsultationTopics(): Promise<ConsultationTopic[]> {
  return STANDARDIZED_TOPICS;
}

/* ── 2. Query Eligible Consultants (Eligible by Candidate Track) ────────── */
export async function getEligibleConsultants(
  candidateTrack?: string
): Promise<FactualConsultant[]> {
  if (isSupabaseConfigured) {
    let query = supabase
      .from('experts')
      .select('id, role, full_name, initials, title, company, bio, track, specialties, rating, review_count, sessions_completed')
      .in('role', ['CONSULTANT', 'BOTH']);

    if (candidateTrack) {
      const norm = candidateTrack.toUpperCase().includes('BACKEND') ? 'BACKEND' : candidateTrack.toUpperCase();
      query = query.eq('track', norm);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data.map((exp: any) => ({
        id: exp.id,
        fullName: exp.full_name,
        initials: exp.initials,
        title: exp.title,
        company: exp.company,
        bio: exp.bio || '',
        track: exp.track,
        specialties: exp.specialties || [],
        rating: Number(exp.rating) || 5.0,
        reviewCount: Number(exp.review_count) || 0,
        sessionsCompleted: Number(exp.sessions_completed) || 0,
        factualCredential: `${exp.title} • ${exp.company}`,
      }));
    }
  }

  try {
    const params = new URLSearchParams();
    if (candidateTrack) params.set('track', candidateTrack);

    const res = await fetch(`/api/consultations/eligible-consultants?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch eligible consultants');
    const data = await res.json();
    return data.consultants || FALLBACK_CONSULTANTS;
  } catch {
    if (candidateTrack) {
      const norm = candidateTrack.toLowerCase();
      const filtered = FALLBACK_CONSULTANTS.filter((c) =>
        c.track.toLowerCase().includes(norm) || norm.includes(c.track.toLowerCase())
      );
      return filtered.length > 0 ? filtered : FALLBACK_CONSULTANTS;
    }
    return FALLBACK_CONSULTANTS;
  }
}

/** Domain-level alias requested by architecture */
export const getConsultantsForTrack = getEligibleConsultants;

/* ── 3. Get Scoped Availability for Selected Consultant ─────────────────── */
export async function getConsultantAvailability(
  consultantId: string
): Promise<{
  consultant: any;
  slots: Record<string, ConsultationSlot[]>;
  totalAvailable: number;
}> {
  if (isSupabaseConfigured) {
    const { data: expert } = await supabase
      .from('experts')
      .select('id, full_name, initials, title, company')
      .eq('id', consultantId)
      .maybeSingle();

    const { data: slotsData, error } = await supabase
      .from('expert_availability_slots')
      .select('id, expert_id, start_time, end_time, timezone, status')
      .eq('expert_id', consultantId)
      .eq('status', 'available')
      .order('start_time', { ascending: true });

    if (!error && slotsData) {
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
          timezone: s.timezone || 'Asia/Riyadh (GMT+3)',
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
  }

  try {
    const res = await fetch(
      `/api/consultations/availability?consultantId=${encodeURIComponent(consultantId)}`
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch consultant availability');
    }
    const data = await res.json();
    return {
      consultant: data.consultant,
      slots: data.slots || {},
      totalAvailable: data.totalAvailable || 0,
    };
  } catch {
    const consultant = FALLBACK_CONSULTANTS.find((c) => c.id === consultantId) || null;
    const slotsList = FALLBACK_CONSULTATION_SLOTS[consultantId] || [
      {
        id: `c-slot-${consultantId}-1`,
        expertId: consultantId,
        dateKey: 'Thursday, Sep 10',
        timeLabel: '10:00 AM – 11:00 AM',
        startTime: '2026-09-10T10:00:00+03:00',
        endTime: '2026-09-10T11:00:00+03:00',
        timezone: 'Asia/Riyadh (GMT+3)',
        status: 'available',
      },
      {
        id: `c-slot-${consultantId}-2`,
        expertId: consultantId,
        dateKey: 'Friday, Sep 11',
        timeLabel: '3:00 PM – 4:00 PM',
        startTime: '2026-09-11T15:00:00+03:00',
        endTime: '2026-09-11T16:00:00+03:00',
        timezone: 'Asia/Riyadh (GMT+3)',
        status: 'available',
      },
    ];
    const grouped: Record<string, ConsultationSlot[]> = {};
    for (const s of slotsList) {
      if (!grouped[s.dateKey]) grouped[s.dateKey] = [];
      grouped[s.dateKey].push(s);
    }
    return {
      consultant,
      slots: grouped,
      totalAvailable: slotsList.length,
    };
  }
}

/* ── 4. Book Consultation Session (Atomic Slot Lock) ────────────────────── */
export async function bookConsultation(
  params: BookConsultationParams
): Promise<BookConsultationResult> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('book_session_atomic', {
      p_candidate_user_id: params.candidateUserId,
      p_slot_id: params.slotId,
      p_session_type: 'consultation',
      p_consultation_topic: params.topic,
      p_consultation_topic_title: params.topicTitle,
      p_consultation_goal: params.goal || null,
      p_consultation_message: params.candidateMessage || null,
    });

    if (error) {
      throw new Error(error.message);
    }

    const res = typeof data === 'string' ? JSON.parse(data) : data;
    const expData = res.expert || {};
    return {
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
      timezone: res.timezone || params.timezone || 'Asia/Riyadh (GMT+3)',
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
  }

  const res = await fetch('/api/consultations/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...params,
      timezone: params.timezone || 'Asia/Riyadh (GMT+3)',
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to book consultation session');
  }

  return res.json();
}

/* ── 5. Get All Candidate Consultations (Active & Completed History) ────── */
export async function getMyConsultations(
  candidateUserId = 'usr-cand-001'
): Promise<CandidateConsultationItem[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        id,
        status,
        slot_id,
        scheduled_start_time,
        scheduled_end_time,
        timezone,
        meeting_url,
        created_at,
        experts (
          id,
          full_name,
          initials,
          title,
          company
        ),
        consultation_details (
          id,
          topic,
          topic_title,
          goal,
          candidate_message,
          outcome_summary,
          action_items,
          deliverables,
          created_at,
          updated_at
        )
      `)
      .eq('candidate_user_id', candidateUserId)
      .eq('session_type', 'consultation')
      .neq('status', 'cancelled')
      .order('scheduled_start_time', { ascending: false });

    if (!error && data) {
      return data.map((s: any) => {
        const exp = Array.isArray(s.experts) ? s.experts[0] : s.experts;
        const cd = Array.isArray(s.consultation_details) ? s.consultation_details[0] : s.consultation_details;
        return {
          sessionId: s.id,
          status: s.status,
          slotId: s.slot_id,
          dateKey: toDateKey(s.scheduled_start_time),
          timeLabel: toTimeLabel(s.scheduled_start_time, s.scheduled_end_time),
          scheduledStartTime: s.scheduled_start_time,
          scheduledEndTime: s.scheduled_end_time,
          timezone: s.timezone || 'Asia/Riyadh (GMT+3)',
          meetingUrl: s.meeting_url,
          consultant: {
            id: exp?.id || '',
            fullName: exp?.full_name || 'Consultant',
            initials: exp?.initials || 'C',
            title: exp?.title || 'Technical Mentor',
            company: exp?.company || 'Jadeer',
            factualCredential: `${exp?.title || 'Mentor'} • ${exp?.company || 'Jadeer'}`,
          },
          consultationDetails: cd
            ? {
                id: cd.id,
                sessionId: s.id,
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
  }

  try {
    const res = await fetch(
      `/api/consultations/my-consultations?candidateUserId=${encodeURIComponent(candidateUserId)}`
    );
    if (!res.ok) throw new Error('Failed to fetch consultations');
    const data = await res.json();
    return data.consultations || [];
  } catch (err) {
    console.error('Error in getMyConsultations:', err);
    return [];
  }
}

/* ── 6. Reschedule Consultation (Atomic Slot Swap - Same Consultant) ─────── */
export async function rescheduleConsultation(
  params: RescheduleConsultationParams
): Promise<RescheduleConsultationResult> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('reschedule_session_atomic', {
      p_session_id: params.sessionId,
      p_candidate_user_id: params.candidateUserId,
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
      dateKey: toDateKey(res.scheduled_start_time),
      timeLabel: toTimeLabel(res.scheduled_start_time, res.scheduled_end_time),
      scheduledStartTime: res.scheduled_start_time,
      scheduledEndTime: res.scheduled_end_time,
      timezone: res.timezone || 'Asia/Riyadh (GMT+3)',
      status: 'scheduled',
      message: 'Consultation rescheduled successfully with same consultant',
    };
  }

  const res = await fetch('/api/consultations/reschedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to reschedule consultation');
  }

  return res.json();
}

/* ── 7. Cancel Consultation (Slot Reopened) ──────────────────────────────── */
export async function cancelConsultation(
  params: CancelConsultationParams
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('cancel_session_atomic', {
      p_session_id: params.sessionId,
      p_cancelled_by: params.cancelledBy || 'candidate',
      p_cancellation_reason: params.reason || 'Candidate requested cancellation via portal',
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Consultation cancelled and slot released successfully',
    };
  }

  const res = await fetch('/api/consultations/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to cancel consultation');
  }

  return res.json();
}

/* ── 8. Get Candidate-Visible Outcome & Action Items ─────────────────────── */
export async function getConsultationOutcome(
  sessionId: string,
  candidateUserId = 'usr-cand-001'
): Promise<ConsultationOutcomeResult> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        id,
        status,
        experts (
          full_name,
          title,
          company
        ),
        consultation_details (
          topic,
          topic_title,
          goal,
          outcome_summary,
          action_items,
          deliverables,
          updated_at
        )
      `)
      .eq('id', sessionId)
      .eq('candidate_user_id', candidateUserId)
      .maybeSingle();

    if (!error && data && data.consultation_details) {
      const exp = Array.isArray(data.experts) ? data.experts[0] : data.experts;
      const cd = Array.isArray(data.consultation_details) ? data.consultation_details[0] : data.consultation_details;
      return {
        hasOutcome: Boolean(cd?.outcome_summary),
        sessionId: data.id,
        status: data.status,
        consultant: exp ? {
          fullName: exp.full_name,
          title: exp.title,
          company: exp.company,
        } : undefined,
        topic: cd?.topic,
        topicTitle: cd?.topic_title,
        goal: cd?.goal,
        outcomeSummary: cd?.outcome_summary,
        actionItems: cd?.action_items || [],
        deliverables: cd?.deliverables || {},
        completedAt: cd?.updated_at,
      };
    }
  }

  try {
    const res = await fetch(
      `/api/consultations/outcome?sessionId=${encodeURIComponent(sessionId)}&candidateUserId=${encodeURIComponent(candidateUserId)}`
    );
    if (!res.ok) throw new Error('Failed to fetch outcome deliverables');
    return res.json();
  } catch (err) {
    console.error('Error in getConsultationOutcome:', err);
    return { hasOutcome: false };
  }
}

/* ── 9. Submit Outcome Summary & Action Items (Consultant Action) ──────── */
export async function submitConsultationOutcome(
  params: SubmitOutcomeParams
): Promise<{ success: boolean; message?: string }> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('submit_consultation_outcome_atomic', {
      p_session_id: params.sessionId,
      p_expert_id: params.expertId,
      p_outcome_summary: params.outcomeSummary,
      p_action_items: params.actionItems || [],
      p_deliverables: params.deliverables || {},
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: 'Consultation deliverables submitted successfully',
    };
  }

  const res = await fetch('/api/consultations/submit-outcome', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit consultation deliverables');
  }

  return res.json();
}
