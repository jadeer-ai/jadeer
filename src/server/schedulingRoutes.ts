/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — SHARED SCHEDULING, HUMAN CALIBRATION & 1-TO-1 CONSULTATION API
   ─────────────────────────────────────────────────────────────────────────
   Unified backend logic powering both Stage 02B Human Technical Calibration
   and 1-to-1 Mentorship Consultations using the same core experts, slots,
   and sessions architecture.
   ═══════════════════════════════════════════════════════════════════════════ */

import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | null = null;
function getPrisma(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

/* ── Types & Interfaces ─────────────────────────────────────────────────── */
export interface ExpertRecord {
  id: string;
  fullName: string;
  initials: string;
  title: string;
  company: string;
  bio: string;
  role: 'INTERVIEWER' | 'CONSULTANT' | 'BOTH';
  track: string;
  specialties: string[];
  consultationTopics?: string[];
  rating: number;
  sessionsCompleted: number;
  avatarUrl: string | null;
  languages: string[];
  factualCredential: string;
}

export interface SlotRecord {
  id: string;
  expertId: string;
  dateKey: string;
  timeLabel: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: 'available' | 'booked';
}

export interface ConsultationDetailRecord {
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
}

export interface EvaluationRecord {
  evaluationId: string;
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
  strengths: string[];
  recommendations: string[];
  submittedAt: string;
}

export interface SessionRecord {
  sessionId: string;
  candidateUserId: string;
  expertId: string;
  slotId: string;
  sessionType: 'human_interview' | 'consultation';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  scheduledStartTime: string;
  scheduledEndTime: string;
  timezone: string;
  meetingUrl: string;
  candidateNotes?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  dateKey?: string;
  timeLabel?: string;
  consultationDetails?: ConsultationDetailRecord;
  evaluation?: EvaluationRecord;
}

/* ── Standardized Consultation Topics ───────────────────────────────────── */
export interface ConsultationTopicDef {
  id: string;
  title: string;
  shortDesc: string;
  badge: string;
}

export const STANDARDIZED_CONSULTATION_TOPICS: ConsultationTopicDef[] = [
  {
    id: 'career-direction',
    title: 'Career Direction',
    shortDesc: 'Engineering career roadmap, leveling from junior to staff, and software specialization choice.',
    badge: 'Strategy',
  },
  {
    id: 'technical-gap',
    title: 'Technical Gap Review',
    shortDesc: 'Deep-dive analysis of AI assessment findings, concurrency gaps, and systems architecture bottlenecks.',
    badge: 'Architecture',
  },
  {
    id: 'project-guidance',
    title: 'Project Guidance',
    shortDesc: 'Live code critique, RAII memory management in C++20/Go, microservices patterns, and repository review.',
    badge: 'Code Quality',
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation',
    shortDesc: 'Simulated senior engineering interview, architectural defense, and algorithmic trade-off defense.',
    badge: 'Interview',
  },
  {
    id: 'portfolio-review',
    title: 'Evidence Portfolio Review',
    shortDesc: 'Structuring your Jadeer Verified Evidence Dossier and presenting engineering telemetry to employers.',
    badge: 'Portfolio',
  },
  {
    id: 'job-readiness',
    title: 'Job Readiness',
    shortDesc: 'Technical workplace communication, compensation navigation, and team collaboration readiness.',
    badge: 'Readiness',
  },
];

/* ── Seed Expert Directory (Shared Interviewers & Consultants) ─────────── */
const ALL_EXPERTS: ExpertRecord[] = [
  {
    id: 'exp-tariq-001',
    fullName: 'Eng. Tariq Al-Mansour',
    initials: 'TM',
    title: 'Principal Systems Architect & Calibration Lead',
    company: 'Jadeer Calibration Panel',
    bio: '15+ years architecting fault-tolerant microservices, Linux socket multiplexing with epoll, and C++20 concurrency.',
    role: 'BOTH',
    track: 'Backend Development',
    specialties: ['Distributed Systems', 'Linux epoll', 'Modern C++20 & Go', 'Cache Invalidation'],
    consultationTopics: ['career-direction', 'technical-gap', 'interview-prep'],
    rating: 4.95,
    sessionsCompleted: 180,
    avatarUrl: null,
    languages: ['Arabic', 'English'],
    factualCredential: 'Verified Calibration Lead',
  },
  {
    id: 'exp-mariam-ashraf',
    fullName: 'Eng. Mariam Ashraf',
    initials: 'MA',
    title: 'Principal Software Architect',
    company: 'Jadeer Technical Mentor',
    bio: '12+ years building high-throughput distributed systems and low-latency cloud infrastructure. Specializes in Go and systems architecture.',
    role: 'BOTH',
    track: 'Backend Development',
    specialties: ['Distributed Systems', 'High-Concurrency APIs', 'C++20 & Go', 'Cloud Architecture'],
    consultationTopics: ['technical-gap', 'project-guidance', 'interview-prep'],
    rating: 4.9,
    sessionsCompleted: 128,
    avatarUrl: null,
    languages: ['Arabic', 'English'],
    factualCredential: 'Jadeer Senior Mentor',
  },
  {
    id: 'exp-khaled-hamdy',
    fullName: 'Eng. Khaled Hamdy',
    initials: 'KH',
    title: 'Senior Engineering Lead',
    company: 'Jadeer Senior Mentor',
    bio: 'Leading payment gateway infrastructure and microservices resilience. Passionate about asynchronous message brokers and career growth.',
    role: 'CONSULTANT',
    track: 'Backend Development',
    specialties: ['PostgreSQL & Redis', 'Kafka Pipelines', 'Microservices Architecture', 'System Design'],
    consultationTopics: ['career-direction', 'technical-gap', 'job-readiness'],
    rating: 4.85,
    sessionsCompleted: 142,
    avatarUrl: null,
    languages: ['Arabic', 'English'],
    factualCredential: 'Jadeer Verified Mentor',
  },
  {
    id: 'exp-yasmin-farouk',
    fullName: 'Eng. Yasmin Farouk',
    initials: 'YF',
    title: 'Staff Frontend Architect',
    company: 'Jadeer UI/UX Panel',
    bio: 'Designing high-performance web applications, design systems with React 19, and accessible micro-frontends with ultra-fast Core Web Vitals.',
    role: 'BOTH',
    track: 'Frontend Development',
    specialties: ['React 19 & Next.js', 'TypeScript', 'Design Systems', 'Web Performance'],
    consultationTopics: ['project-guidance', 'portfolio-review', 'interview-prep'],
    rating: 4.9,
    sessionsCompleted: 92,
    avatarUrl: null,
    languages: ['Arabic', 'English'],
    factualCredential: 'Jadeer Senior Mentor',
  },
  {
    id: 'exp-nour-eldin',
    fullName: 'Dr. Nour El-Din',
    initials: 'ND',
    title: 'Staff AI Research Engineer',
    company: 'Jadeer AI Lead',
    bio: 'PhD in Deep Learning and LLM architecture. Experienced in PyTorch distributed training, RAG vector pipelines, and inference optimization.',
    role: 'BOTH',
    track: 'AI & Data Engineering',
    specialties: ['PyTorch & LLMs', 'Vector Databases', 'Data Pipelines', 'Model Quantization'],
    consultationTopics: ['technical-gap', 'career-direction', 'job-readiness'],
    rating: 4.98,
    sessionsCompleted: 74,
    avatarUrl: null,
    languages: ['Arabic', 'English'],
    factualCredential: 'Jadeer AI Research Fellow',
  },
  {
    id: 'exp-sarah-tamimi',
    fullName: 'Eng. Sarah Al-Tamimi',
    initials: 'ST',
    title: 'Principal Cloud & DevOps Architect',
    company: 'Jadeer Infrastructure Lead',
    bio: 'Cloud-native Kubernetes orchestration, zero-downtime CI/CD deployments, and infrastructure resilience on AWS & GCP.',
    role: 'CONSULTANT',
    track: 'DevOps & Cloud Engineering',
    specialties: ['Kubernetes', 'Terraform & CI/CD', 'AWS & GCP Infrastructure', 'Site Reliability'],
    consultationTopics: ['job-readiness', 'project-guidance', 'career-direction'],
    rating: 4.92,
    sessionsCompleted: 115,
    avatarUrl: null,
    languages: ['Arabic', 'English'],
    factualCredential: 'Verified Cloud Mentor',
  },
];

const SEED_EXPERT: ExpertRecord = ALL_EXPERTS[0];

/* ── Seed Availability Slots ────────────────────────────────────────────── */
const INITIAL_SLOTS: SlotRecord[] = [
  // Eng. Tariq Al-Mansour
  { id: 'slot-sep10-1000', expertId: 'exp-tariq-001', dateKey: 'Thursday, Sep 10', timeLabel: '10:00 AM', startTime: '2026-09-10T10:00:00+03:00', endTime: '2026-09-10T11:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
  { id: 'slot-sep10-1330', expertId: 'exp-tariq-001', dateKey: 'Thursday, Sep 10', timeLabel: '1:30 PM', startTime: '2026-09-10T13:30:00+03:00', endTime: '2026-09-10T14:30:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
  { id: 'slot-sep10-1600', expertId: 'exp-tariq-001', dateKey: 'Thursday, Sep 10', timeLabel: '4:00 PM', startTime: '2026-09-10T16:00:00+03:00', endTime: '2026-09-10T17:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
  { id: 'slot-sep13-1100', expertId: 'exp-tariq-001', dateKey: 'Sunday, Sep 13', timeLabel: '11:00 AM', startTime: '2026-09-13T11:00:00+03:00', endTime: '2026-09-13T12:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
  { id: 'slot-sep13-1500', expertId: 'exp-tariq-001', dateKey: 'Sunday, Sep 13', timeLabel: '3:00 PM', startTime: '2026-09-13T15:00:00+03:00', endTime: '2026-09-13T16:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },

  // Eng. Mariam Ashraf
  { id: 'slot-ma-sep10-1400', expertId: 'exp-mariam-ashraf', dateKey: 'Thursday, Sep 10', timeLabel: '2:00 PM', startTime: '2026-09-10T14:00:00+03:00', endTime: '2026-09-10T15:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
  { id: 'slot-ma-sep11-1000', expertId: 'exp-mariam-ashraf', dateKey: 'Friday, Sep 11', timeLabel: '10:00 AM', startTime: '2026-09-11T10:00:00+03:00', endTime: '2026-09-11T11:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
  { id: 'slot-ma-sep13-1600', expertId: 'exp-mariam-ashraf', dateKey: 'Sunday, Sep 13', timeLabel: '4:00 PM', startTime: '2026-09-13T16:00:00+03:00', endTime: '2026-09-13T17:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },

  // Eng. Khaled Hamdy
  { id: 'slot-kh-sep10-1100', expertId: 'exp-khaled-hamdy', dateKey: 'Thursday, Sep 10', timeLabel: '11:00 AM', startTime: '2026-09-10T11:00:00+03:00', endTime: '2026-09-10T12:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
  { id: 'slot-kh-sep10-1500', expertId: 'exp-khaled-hamdy', dateKey: 'Thursday, Sep 10', timeLabel: '3:00 PM', startTime: '2026-09-10T15:00:00+03:00', endTime: '2026-09-10T16:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
  { id: 'slot-kh-sep12-1600', expertId: 'exp-khaled-hamdy', dateKey: 'Saturday, Sep 12', timeLabel: '4:00 PM', startTime: '2026-09-12T16:00:00+03:00', endTime: '2026-09-12T17:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },

  // Eng. Yasmin Farouk
  { id: 'slot-yf-sep10-1300', expertId: 'exp-yasmin-farouk', dateKey: 'Thursday, Sep 10', timeLabel: '1:00 PM', startTime: '2026-09-10T13:00:00+03:00', endTime: '2026-09-10T14:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
  { id: 'slot-yf-sep12-1100', expertId: 'exp-yasmin-farouk', dateKey: 'Saturday, Sep 12', timeLabel: '11:00 AM', startTime: '2026-09-12T11:00:00+03:00', endTime: '2026-09-12T12:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },

  // Dr. Nour El-Din
  { id: 'slot-nd-sep11-1500', expertId: 'exp-nour-eldin', dateKey: 'Friday, Sep 11', timeLabel: '3:00 PM', startTime: '2026-09-11T15:00:00+03:00', endTime: '2026-09-11T16:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
  { id: 'slot-nd-sep13-1400', expertId: 'exp-nour-eldin', dateKey: 'Sunday, Sep 13', timeLabel: '2:00 PM', startTime: '2026-09-13T14:00:00+03:00', endTime: '2026-09-13T15:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },

  // Eng. Sarah Al-Tamimi
  { id: 'slot-st-sep11-1400', expertId: 'exp-sarah-tamimi', dateKey: 'Friday, Sep 11', timeLabel: '2:00 PM', startTime: '2026-09-11T14:00:00+03:00', endTime: '2026-09-11T15:00:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
  { id: 'slot-st-sep12-1130', expertId: 'exp-sarah-tamimi', dateKey: 'Saturday, Sep 12', timeLabel: '11:30 AM', startTime: '2026-09-12T11:30:00+03:00', endTime: '2026-09-12T12:30:00+03:00', timezone: 'Asia/Riyadh (GMT+3)', status: 'available' },
];

/* ── In-Memory Persistence Store ────────────────────────────────────────── */
const memoryAssignments = new Map<string, { expertId: string; assignedBy: string; assignedAt: string }>();
const memorySlots: SlotRecord[] = [...INITIAL_SLOTS];
// Sessions stored by sessionId for multi-session support
const memorySessions = new Map<string, SessionRecord>();

// Pre-populate completed consultation demo session for testing deliverables
const SEED_CONSULTATION_ID = 'ses-con-completed-001';
memorySessions.set(SEED_CONSULTATION_ID, {
  sessionId: SEED_CONSULTATION_ID,
  candidateUserId: 'usr-cand-001',
  expertId: 'exp-khaled-hamdy',
  slotId: 'slot-kh-sep10-1100',
  sessionType: 'consultation',
  status: 'completed',
  scheduledStartTime: '2026-08-25T11:00:00+03:00',
  scheduledEndTime: '2026-08-25T12:00:00+03:00',
  timezone: 'Asia/Riyadh (GMT+3)',
  meetingUrl: 'https://meet.jadeer.io/consultation/jad-tech-8492',
  dateKey: 'Monday, Aug 25',
  timeLabel: '11:00 AM',
  consultationDetails: {
    id: 'cd-completed-001',
    sessionId: SEED_CONSULTATION_ID,
    topic: 'career-direction',
    topicTitle: 'Career Direction',
    goal: 'Navigate transition from junior backend developer to systems architect.',
    candidateMessage: 'I would like guidance on which distributed systems projects to prioritize.',
    outcomeSummary: 'Ahmad has a solid foundation in modern C++20 and asynchronous socket programming. Recommended focusing next on distributed consensus (Raft/Paxos) and write-through caching invalidation.',
    actionItems: [
      'Read "Designing Data-Intensive Applications" chapters 5 & 6 (Replication & Partitioning).',
      'Implement a two-phase commit simulation repository with Docker test harness.',
      'Refine verified dossier evidence to highlight RAII and memory safety benchmarks.',
    ],
    deliverables: {
      recordingUrl: 'https://cdn.jadeer.io/recordings/consultation-jad-8492.mp4',
      resources: [
        { title: 'Distributed Systems Architecture Guide.pdf', url: '#' },
        { title: 'Raft Consensus Go Implementation Template', url: 'https://github.com/jadeer/raft-template' },
      ],
    },
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-08-25T12:05:00Z',
  },
});

/* ═══════════════════════════════════════════════════════════════════════════
   PART A: SHARED CORE SCHEDULING (HUMAN CALIBRATION FLOWS)
   ═══════════════════════════════════════════════════════════════════════════ */

export async function handleGetAssignedInterviewer(params: {
  candidateUserId: string;
  track?: string;
}): Promise<{ statusCode: number; data: any }> {
  const { candidateUserId } = params;

  if (!candidateUserId) {
    return { statusCode: 400, data: { error: 'candidateUserId is required' } };
  }

  // 1. Try Prisma
  try {
    const prisma = getPrisma();
    const assignment = await prisma.candidateInterviewAssignment.findUnique({
      where: { candidateUserId },
      include: { expert: true },
    });

    if (assignment && assignment.isActive && assignment.expert) {
      const exp = assignment.expert;
      return {
        statusCode: 200,
        data: {
          assigned: true,
          status: 'assigned',
          expert: {
            id: exp.id,
            fullName: exp.fullName,
            initials: exp.initials || exp.fullName.slice(0, 2).toUpperCase(),
            title: exp.title,
            company: exp.company,
            bio: exp.bio,
            track: exp.track,
            specialties: exp.specialties,
            rating: Number(exp.rating),
            sessionsCompleted: exp.sessionsCompleted,
            avatarUrl: exp.avatarUrl,
            languages: exp.languages,
            factualCredential: 'Verified Calibration Lead',
          },
          assignedBy: assignment.assignedBy,
          assignedAt: assignment.assignedAt.toISOString(),
        },
      };
    }
  } catch {
    // Fallback
  }

  const memAssign = memoryAssignments.get(candidateUserId);
  if (memAssign) {
    return {
      statusCode: 200,
      data: {
        assigned: true,
        status: 'assigned',
        expert: SEED_EXPERT,
        assignedBy: memAssign.assignedBy,
        assignedAt: memAssign.assignedAt,
      },
    };
  }

  return {
    statusCode: 200,
    data: {
      assigned: false,
      status: 'awaiting_assignment',
      message: 'Your Human Calibration interviewer is being assigned by Jadeer.',
    },
  };
}

export async function handleAssignInterviewer(body: {
  candidateUserId: string;
  expertId?: string;
  assignedBy?: string;
}): Promise<{ statusCode: number; data: any }> {
  const { candidateUserId, expertId = SEED_EXPERT.id, assignedBy = 'Jadeer Admin' } = body;

  if (!candidateUserId) {
    return { statusCode: 400, data: { error: 'candidateUserId is required' } };
  }

  try {
    const prisma = getPrisma();
    await prisma.candidateInterviewAssignment.upsert({
      where: { candidateUserId },
      create: { candidateUserId, expertId, assignedBy, isActive: true },
      update: { expertId, assignedBy, isActive: true, assignedAt: new Date() },
    });
  } catch {
    // Fallback
  }

  memoryAssignments.set(candidateUserId, {
    expertId,
    assignedBy,
    assignedAt: new Date().toISOString(),
  });

  return {
    statusCode: 200,
    data: { success: true, assigned: true, status: 'assigned', expert: SEED_EXPERT, assignedBy },
  };
}

export async function handleGetExpertSlots(params: {
  expertId: string;
  candidateUserId?: string;
}): Promise<{ statusCode: number; data: any }> {
  const { expertId, candidateUserId } = params;

  if (!expertId) {
    return { statusCode: 400, data: { error: 'expertId is required' } };
  }

  // Security check: if candidateUserId provided for human interview, verify assignment
  if (candidateUserId) {
    let assignedExpertId: string | null = null;
    const mem = memoryAssignments.get(candidateUserId);
    if (mem) assignedExpertId = mem.expertId;

    if (assignedExpertId && assignedExpertId !== expertId) {
      return {
        statusCode: 403,
        data: { error: 'Unauthorized: You may only view availability for your assigned interviewer.' },
      };
    }
  }

  const grouped: Record<string, SlotRecord[]> = {};
  for (const s of memorySlots) {
    if (s.expertId === expertId && s.status === 'available') {
      if (!grouped[s.dateKey]) grouped[s.dateKey] = [];
      grouped[s.dateKey].push(s);
    }
  }

  return {
    statusCode: 200,
    data: {
      expertId,
      slots: grouped,
      totalAvailable: Object.values(grouped).reduce((acc, arr) => acc + arr.length, 0),
    },
  };
}

export async function handleBookSession(body: {
  candidateUserId: string;
  slotId: string;
  sessionType?: 'human_interview' | 'consultation';
  softwareTrack?: string;
  candidateNotes?: string;
  timezone?: string;
}): Promise<{ statusCode: number; data: any }> {
  const {
    candidateUserId,
    slotId,
    sessionType = 'human_interview',
    candidateNotes,
    timezone = 'Asia/Riyadh (GMT+3)',
  } = body;

  if (!candidateUserId || !slotId) {
    return { statusCode: 400, data: { error: 'candidateUserId and slotId are required' } };
  }

  const slot = memorySlots.find((s) => s.id === slotId);
  if (!slot) {
    return { statusCode: 404, data: { error: 'Selected availability slot does not exist.' } };
  }

  // Security Guard: Human Calibration candidate may ONLY book their assigned interviewer's slot!
  if (sessionType === 'human_interview') {
    const assignment = memoryAssignments.get(candidateUserId);
    if (!assignment) {
      return {
        statusCode: 403,
        data: { error: 'Forbidden: No interviewer has been assigned to this candidate yet.' },
      };
    }
    if (slot.expertId !== assignment.expertId) {
      return {
        statusCode: 403,
        data: { error: 'Forbidden: Unauthorized to book availability belonging to an unassigned interviewer.' },
      };
    }
  }

  if (slot.status !== 'available') {
    return { statusCode: 409, data: { error: 'This time slot is no longer available. Please select another time.' } };
  }

  slot.status = 'booked';

  const sessionId = `ses-hc-${Date.now()}`;
  const meetingUrl = 'https://meet.jadeer.io/interview/jad-tech-8492';

  const sessionObj: SessionRecord = {
    sessionId,
    candidateUserId,
    expertId: slot.expertId,
    slotId,
    sessionType,
    status: 'scheduled',
    scheduledStartTime: slot.startTime,
    scheduledEndTime: slot.endTime,
    timezone,
    meetingUrl,
    candidateNotes,
    dateKey: slot.dateKey,
    timeLabel: slot.timeLabel,
  };

  memorySessions.set(sessionId, sessionObj);

  return {
    statusCode: 200,
    data: {
      success: true,
      sessionId,
      status: 'scheduled',
      slotId,
      expertId: slot.expertId,
      scheduledStartTime: slot.startTime,
      scheduledEndTime: slot.endTime,
      timezone,
      meetingUrl,
      dateKey: slot.dateKey,
      timeLabel: slot.timeLabel,
    },
  };
}

export async function handleRescheduleSession(body: {
  sessionId: string;
  candidateUserId: string;
  newSlotId: string;
}): Promise<{ statusCode: number; data: any }> {
  const { sessionId, candidateUserId, newSlotId } = body;

  if (!sessionId || !candidateUserId || !newSlotId) {
    return { statusCode: 400, data: { error: 'sessionId, candidateUserId, and newSlotId are required' } };
  }

  const session = memorySessions.get(sessionId);
  if (!session || session.candidateUserId !== candidateUserId) {
    return { statusCode: 404, data: { error: 'Scheduled session not found.' } };
  }

  if (session.status !== 'scheduled') {
    return { statusCode: 400, data: { error: `Cannot reschedule session with status: ${session.status}` } };
  }

  const newSlot = memorySlots.find((s) => s.id === newSlotId);
  if (!newSlot) {
    return { statusCode: 404, data: { error: 'Requested new slot not found.' } };
  }

  if (newSlot.status !== 'available') {
    return { statusCode: 409, data: { error: 'New slot is no longer available.' } };
  }

  // Guard: New slot MUST belong to the SAME expert
  if (newSlot.expertId !== session.expertId) {
    return {
      statusCode: 403,
      data: { error: 'Unauthorized: Rescheduling is only permitted with your assigned expert.' },
    };
  }

  const oldSlot = memorySlots.find((s) => s.id === session.slotId);
  if (oldSlot) {
    oldSlot.status = 'available';
  }

  newSlot.status = 'booked';

  session.slotId = newSlotId;
  session.scheduledStartTime = newSlot.startTime;
  session.scheduledEndTime = newSlot.endTime;
  session.timezone = newSlot.timezone;
  session.dateKey = newSlot.dateKey;
  session.timeLabel = newSlot.timeLabel;

  return {
    statusCode: 200,
    data: {
      success: true,
      sessionId: session.sessionId,
      slotId: newSlotId,
      expertId: session.expertId,
      scheduledStartTime: newSlot.startTime,
      scheduledEndTime: newSlot.endTime,
      timezone: newSlot.timezone,
      dateKey: newSlot.dateKey,
      timeLabel: newSlot.timeLabel,
      status: 'scheduled',
      message: 'Session successfully rescheduled.',
    },
  };
}

export async function handleCancelSession(body: {
  sessionId: string;
  cancelledBy?: string;
  reason?: string;
}): Promise<{ statusCode: number; data: any }> {
  const { sessionId, cancelledBy = 'candidate', reason = 'Candidate requested cancellation' } = body;

  if (!sessionId) {
    return { statusCode: 400, data: { error: 'sessionId is required' } };
  }

  const matchedSession = memorySessions.get(sessionId);
  if (!matchedSession) {
    return { statusCode: 404, data: { error: 'Session not found' } };
  }

  matchedSession.status = 'cancelled';
  matchedSession.cancellationReason = reason;
  matchedSession.cancelledBy = cancelledBy;
  matchedSession.cancelledAt = new Date().toISOString();

  const slot = memorySlots.find((s) => s.id === matchedSession?.slotId);
  if (slot) {
    slot.status = 'available';
  }

  return {
    statusCode: 200,
    data: {
      success: true,
      sessionId,
      status: 'cancelled',
      cancelledAt: matchedSession.cancelledAt,
      cancellationReason: reason,
      message: 'Session cancelled and availability slot returned to open pool.',
    },
  };
}

export async function handleSubmitEvaluation(body: {
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
}): Promise<{ statusCode: number; data: any }> {
  const {
    sessionId,
    evaluatorId,
    technicalScore,
    problemSolvingScore,
    communicationScore,
    reasoningScore,
    overallScore,
    recommendation,
    candidateVisibleFeedback,
    internalNotes,
    strengths = [],
    recommendations = [],
  } = body;

  if (!sessionId || !evaluatorId) {
    return { statusCode: 400, data: { error: 'sessionId and evaluatorId are required' } };
  }

  let matchedSession = memorySessions.get(sessionId);
  if (!matchedSession) {
    return { statusCode: 404, data: { error: 'Session not found for evaluation' } };
  }

  // Security Guard: Candidates cannot submit evaluations or complete the stage directly
  if (evaluatorId === matchedSession.candidateUserId) {
    return {
      statusCode: 403,
      data: { error: 'Forbidden: Candidates cannot evaluate themselves or mark calibration completed.' },
    };
  }

  if (evaluatorId !== matchedSession.expertId && evaluatorId !== 'admin') {
    return {
      statusCode: 403,
      data: { error: 'Forbidden: Only the assigned calibration evaluator can submit the rubric.' },
    };
  }

  const evaluationId = `eval-${Date.now()}`;
  const evalRecord: EvaluationRecord = {
    evaluationId,
    sessionId,
    evaluatorId,
    technicalScore,
    problemSolvingScore,
    communicationScore,
    reasoningScore,
    overallScore,
    recommendation,
    candidateVisibleFeedback,
    internalNotes,
    strengths,
    recommendations,
    submittedAt: new Date().toISOString(),
  };

  matchedSession.evaluation = evalRecord;
  matchedSession.status = 'completed';

  return {
    statusCode: 200,
    data: {
      success: true,
      evaluationId,
      sessionId,
      status: 'completed',
      overallScore,
      recommendation,
      submittedAt: evalRecord.submittedAt,
    },
  };
}

export async function handleGetCandidateVisibleResult(params: {
  candidateUserId: string;
}): Promise<{ statusCode: number; data: any }> {
  const { candidateUserId } = params;

  if (!candidateUserId) {
    return { statusCode: 400, data: { error: 'candidateUserId is required' } };
  }

  for (const [, session] of memorySessions.entries()) {
    if (
      session.candidateUserId === candidateUserId &&
      session.sessionType === 'human_interview' &&
      session.status === 'completed' &&
      session.evaluation
    ) {
      const ev = session.evaluation;
      return {
        statusCode: 200,
        data: {
          hasEvaluation: true,
          sessionId: session.sessionId,
          overallScore: ev.overallScore,
          technicalScore: ev.technicalScore,
          problemSolvingScore: ev.problemSolvingScore,
          communicationScore: ev.communicationScore,
          reasoningScore: ev.reasoningScore,
          recommendation: ev.recommendation,
          candidateVisibleFeedback: ev.candidateVisibleFeedback,
          strengths: ev.strengths,
          recommendations: ev.recommendations,
          submittedAt: ev.submittedAt,
          verifiedBadge: 'Jadeer Human-Calibrated Senior Engineer Badge',
        },
      };
    }
  }

  return {
    statusCode: 200,
    data: { hasEvaluation: false, message: 'Evaluation has not yet been submitted by your interviewer.' },
  };
}

export async function handleGetHumanInterviewState(params: {
  candidateUserId: string;
}): Promise<{ statusCode: number; data: any }> {
  const { candidateUserId } = params;

  if (!candidateUserId) {
    return { statusCode: 400, data: { error: 'candidateUserId is required' } };
  }

  for (const [, session] of memorySessions.entries()) {
    if (session.candidateUserId === candidateUserId && session.sessionType === 'human_interview') {
      if (session.status === 'completed') {
        const ev = session.evaluation;
        return {
          statusCode: 200,
          data: {
            state: 'completed',
            isCompleted: true,
            status: 'completed',
            session: {
              sessionId: session.sessionId,
              scheduledStartTime: session.scheduledStartTime,
              scheduledEndTime: session.scheduledEndTime,
              timezone: session.timezone,
              meetingUrl: session.meetingUrl,
            },
            expert: SEED_EXPERT,
            evaluation: ev || null,
          },
        };
      }

      if (session.status === 'scheduled' || session.status === 'in_progress') {
        return {
          statusCode: 200,
          data: {
            state: 'confirmed',
            isCompleted: false,
            status: session.status,
            session: {
              sessionId: session.sessionId,
              slotId: session.slotId,
              scheduledStartTime: session.scheduledStartTime,
              scheduledEndTime: session.scheduledEndTime,
              timezone: session.timezone,
              meetingUrl: session.meetingUrl,
            },
            expert: SEED_EXPERT,
          },
        };
      }
    }
  }

  const assignment = memoryAssignments.get(candidateUserId);
  if (assignment) {
    return {
      statusCode: 200,
      data: {
        state: 'choose_time',
        isCompleted: false,
        status: 'assigned',
        expert: SEED_EXPERT,
        assignedBy: assignment.assignedBy,
        assignedAt: assignment.assignedAt,
      },
    };
  }

  return {
    statusCode: 200,
    data: {
      state: 'awaiting_assignment',
      isCompleted: false,
      status: 'awaiting_assignment',
      message: 'Your Human Calibration interviewer is being assigned by Jadeer.',
    },
  };
}

export async function handleGetSessionStatus(params: {
  candidateUserId: string;
}): Promise<{ statusCode: number; data: any }> {
  return handleGetHumanInterviewState(params);
}

export async function handleResetAssignment(body: {
  candidateUserId: string;
}): Promise<{ statusCode: number; data: any }> {
  const { candidateUserId } = body;

  if (!candidateUserId) {
    return { statusCode: 400, data: { error: 'candidateUserId is required' } };
  }

  memoryAssignments.delete(candidateUserId);
  for (const [id, s] of memorySessions.entries()) {
    if (s.candidateUserId === candidateUserId && s.sessionType === 'human_interview') {
      memorySessions.delete(id);
    }
  }

  for (const s of memorySlots) {
    if (s.expertId === SEED_EXPERT.id) {
      s.status = 'available';
    }
  }

  return {
    statusCode: 200,
    data: { success: true, message: 'Candidate state reset to awaiting_assignment' },
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   PART B: 1-TO-1 CONSULTATIONS (SHARED SCHEDULING INFRASTRUCTURE)
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * 1. GET /api/consultations/topics
 * Returns standardized consultation topics.
 */
export async function handleGetConsultationTopics(): Promise<{ statusCode: number; data: any }> {
  return {
    statusCode: 200,
    data: {
      topics: STANDARDIZED_CONSULTATION_TOPICS,
    },
  };
}

/**
 * 2. GET /api/consultations/eligible-consultants
 * Queries active consultants (role = 'CONSULTANT' | 'BOTH') eligible for the candidate's technical track.
 * The consultation topic is NOT used to filter or rank consultants; it serves as session context only.
 * Returns factual consultant profiles only.
 */
export async function handleGetEligibleConsultants(params: {
  track?: string;
}): Promise<{ statusCode: number; data: any }> {
  const { track } = params;

  // 1. Query active consultants (role: CONSULTANT or BOTH)
  let consultants = ALL_EXPERTS.filter((e) => e.role === 'CONSULTANT' || e.role === 'BOTH');

  // 2. Eligibility filter: Candidate technical track compatibility
  if (track) {
    const trackMatched = consultants.filter(
      (e) => e.track.toLowerCase() === track.toLowerCase()
    );
    // If track-specific consultants exist, scope to that track; otherwise keep active consultants pool
    if (trackMatched.length > 0) {
      consultants = trackMatched;
    }
  }

  // 3. Map to factual public fields only (no rankings or score sorting)
  const factualList = consultants.map((c) => {
    const nextSlot = memorySlots.find((s) => s.expertId === c.id && s.status === 'available');
    return {
      id: c.id,
      fullName: c.fullName,
      initials: c.initials,
      title: c.title,
      company: c.company,
      bio: c.bio,
      track: c.track,
      specialties: c.specialties,
      rating: c.rating,
      sessionsCompleted: c.sessionsCompleted,
      factualCredential: c.factualCredential,
      avatarUrl: c.avatarUrl,
      nextAvailable: nextSlot ? `${nextSlot.dateKey}, ${nextSlot.timeLabel}` : 'Check Schedule',
    };
  });

  return {
    statusCode: 200,
    data: {
      consultants: factualList,
      total: factualList.length,
      track: track || null,
    },
  };
}

/**
 * 3. GET /api/consultations/availability
 * Returns available slots strictly for the selected consultant.
 */
export async function handleGetConsultantAvailability(params: {
  consultantId: string;
}): Promise<{ statusCode: number; data: any }> {
  const { consultantId } = params;

  if (!consultantId) {
    return { statusCode: 400, data: { error: 'consultantId is required' } };
  }

  const consultant = ALL_EXPERTS.find((e) => e.id === consultantId);
  if (!consultant) {
    return { statusCode: 404, data: { error: 'Consultant not found' } };
  }

  const grouped: Record<string, SlotRecord[]> = {};
  for (const s of memorySlots) {
    if (s.expertId === consultantId && s.status === 'available') {
      if (!grouped[s.dateKey]) grouped[s.dateKey] = [];
      grouped[s.dateKey].push(s);
    }
  }

  return {
    statusCode: 200,
    data: {
      consultant: {
        id: consultant.id,
        fullName: consultant.fullName,
        initials: consultant.initials,
        title: consultant.title,
        factualCredential: consultant.factualCredential,
      },
      slots: grouped,
      totalAvailable: Object.values(grouped).reduce((acc, arr) => acc + arr.length, 0),
    },
  };
}

/**
 * 4. POST /api/consultations/book
 * Atomically books consultation session using the shared sessions model.
 * Locks slot, verifies status, and creates consultation_details.
 */
export async function handleBookConsultation(body: {
  candidateUserId: string;
  consultantId: string;
  slotId: string;
  topic: string;
  topicTitle?: string;
  goal?: string;
  candidateMessage?: string;
  timezone?: string;
}): Promise<{ statusCode: number; data: any }> {
  const {
    candidateUserId,
    consultantId,
    slotId,
    topic,
    topicTitle,
    goal,
    candidateMessage,
    timezone = 'Asia/Riyadh (GMT+3)',
  } = body;

  if (!candidateUserId || !consultantId || !slotId || !topic) {
    return {
      statusCode: 400,
      data: { error: 'candidateUserId, consultantId, slotId, and topic are required' },
    };
  }

  // 1. Lock slot
  const slot = memorySlots.find((s) => s.id === slotId);
  if (!slot) {
    return { statusCode: 404, data: { error: 'Availability slot not found' } };
  }

  // Guard: Slot must belong to the selected consultant!
  if (slot.expertId !== consultantId) {
    return {
      statusCode: 403,
      data: { error: 'Unauthorized: Slot does not belong to the selected consultant.' },
    };
  }

  if (slot.status !== 'available') {
    return { statusCode: 409, data: { error: 'This time slot is no longer available. Please choose another time.' } };
  }

  slot.status = 'booked';

  const sessionId = `ses-con-${Date.now()}`;
  const meetingUrl = `https://meet.jadeer.io/consultation/jad-${sessionId.slice(-6)}`;
  const consultant = ALL_EXPERTS.find((e) => e.id === consultantId) || SEED_EXPERT;

  const consultationDetailObj: ConsultationDetailRecord = {
    id: `cd-${Date.now()}`,
    sessionId,
    topic,
    topicTitle: topicTitle || topic,
    goal,
    candidateMessage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sessionObj: SessionRecord = {
    sessionId,
    candidateUserId,
    expertId: consultantId,
    slotId,
    sessionType: 'consultation',
    status: 'scheduled',
    scheduledStartTime: slot.startTime,
    scheduledEndTime: slot.endTime,
    timezone,
    meetingUrl,
    dateKey: slot.dateKey,
    timeLabel: slot.timeLabel,
    consultationDetails: consultationDetailObj,
  };

  memorySessions.set(sessionId, sessionObj);

  return {
    statusCode: 200,
    data: {
      success: true,
      sessionId,
      consultationId: consultationDetailObj.id,
      consultant: {
        id: consultant.id,
        fullName: consultant.fullName,
        initials: consultant.initials,
        title: consultant.title,
        company: consultant.company,
        factualCredential: consultant.factualCredential,
      },
      topic,
      topicTitle: consultationDetailObj.topicTitle,
      goal: consultationDetailObj.goal,
      candidateMessage: consultationDetailObj.candidateMessage,
      dateKey: slot.dateKey,
      timeLabel: slot.timeLabel,
      scheduledStartTime: slot.startTime,
      scheduledEndTime: slot.endTime,
      timezone,
      meetingUrl,
      status: 'scheduled',
    },
  };
}

/**
 * 5. GET /api/consultations/my-consultations
 * Returns all active and completed consultations for the candidate.
 */
export async function handleGetCandidateConsultations(params: {
  candidateUserId: string;
}): Promise<{ statusCode: number; data: any }> {
  const { candidateUserId } = params;

  if (!candidateUserId) {
    return { statusCode: 400, data: { error: 'candidateUserId is required' } };
  }

  const list: any[] = [];
  for (const [, s] of memorySessions.entries()) {
    if (s.candidateUserId === candidateUserId && s.sessionType === 'consultation') {
      const expert = ALL_EXPERTS.find((e) => e.id === s.expertId) || SEED_EXPERT;
      list.push({
        sessionId: s.sessionId,
        status: s.status,
        scheduledStartTime: s.scheduledStartTime,
        scheduledEndTime: s.scheduledEndTime,
        dateKey: s.dateKey,
        timeLabel: s.timeLabel,
        timezone: s.timezone,
        meetingUrl: s.meetingUrl,
        consultant: {
          id: expert.id,
          fullName: expert.fullName,
          initials: expert.initials,
          title: expert.title,
          company: expert.company,
          factualCredential: expert.factualCredential,
        },
        consultationDetails: s.consultationDetails,
      });
    }
  }

  // Sort: upcoming scheduled first, then completed descending
  list.sort((a, b) => new Date(b.scheduledStartTime).getTime() - new Date(a.scheduledStartTime).getTime());

  return {
    statusCode: 200,
    data: {
      consultations: list,
      total: list.length,
    },
  };
}

/**
 * 6. POST /api/consultations/reschedule
 * Safe atomic reschedule to another slot of the SAME consultant.
 */
export async function handleRescheduleConsultation(body: {
  sessionId: string;
  candidateUserId: string;
  newSlotId: string;
}): Promise<{ statusCode: number; data: any }> {
  const { sessionId, candidateUserId, newSlotId } = body;

  if (!sessionId || !candidateUserId || !newSlotId) {
    return { statusCode: 400, data: { error: 'sessionId, candidateUserId, and newSlotId are required' } };
  }

  const session = memorySessions.get(sessionId);
  if (!session || session.candidateUserId !== candidateUserId || session.sessionType !== 'consultation') {
    return { statusCode: 404, data: { error: 'Consultation session not found' } };
  }

  if (session.status !== 'scheduled') {
    return { statusCode: 400, data: { error: `Cannot reschedule consultation in status: ${session.status}` } };
  }

  const newSlot = memorySlots.find((s) => s.id === newSlotId);
  if (!newSlot) {
    return { statusCode: 404, data: { error: 'New availability slot not found' } };
  }

  if (newSlot.status !== 'available') {
    return { statusCode: 409, data: { error: 'New slot is no longer available' } };
  }

  // Guard: Same consultant rule
  if (newSlot.expertId !== session.expertId) {
    return {
      statusCode: 403,
      data: { error: 'Unauthorized: Rescheduling is only permitted with the same consultant.' },
    };
  }

  // Atomic slot swap
  const oldSlot = memorySlots.find((s) => s.id === session.slotId);
  if (oldSlot) oldSlot.status = 'available';

  newSlot.status = 'booked';

  session.slotId = newSlotId;
  session.scheduledStartTime = newSlot.startTime;
  session.scheduledEndTime = newSlot.endTime;
  session.dateKey = newSlot.dateKey;
  session.timeLabel = newSlot.timeLabel;

  return {
    statusCode: 200,
    data: {
      success: true,
      sessionId,
      slotId: newSlotId,
      dateKey: newSlot.dateKey,
      timeLabel: newSlot.timeLabel,
      scheduledStartTime: newSlot.startTime,
      scheduledEndTime: newSlot.endTime,
      timezone: newSlot.timezone,
      status: 'scheduled',
      message: 'Consultation successfully rescheduled with your consultant.',
    },
  };
}

/**
 * 7. POST /api/consultations/cancel
 * Cancels consultation session and releases slot back to available.
 */
export async function handleCancelConsultation(body: {
  sessionId: string;
  cancelledBy?: string;
  reason?: string;
}): Promise<{ statusCode: number; data: any }> {
  return handleCancelSession(body);
}

/**
 * 8. POST /api/consultations/submit-outcome
 * Consultant/Admin submits outcome notes & action items and authoritatively completes session.
 */
export async function handleSubmitConsultationOutcome(body: {
  sessionId: string;
  expertId: string;
  outcomeSummary: string;
  actionItems?: string[];
  deliverables?: any;
}): Promise<{ statusCode: number; data: any }> {
  const { sessionId, expertId, outcomeSummary, actionItems = [], deliverables = {} } = body;

  if (!sessionId || !expertId || !outcomeSummary) {
    return { statusCode: 400, data: { error: 'sessionId, expertId, and outcomeSummary are required' } };
  }

  const session = memorySessions.get(sessionId);
  if (!session || session.sessionType !== 'consultation') {
    return { statusCode: 404, data: { error: 'Consultation session not found' } };
  }

  // Guard: Only booked consultant or admin
  if (session.expertId !== expertId && expertId !== 'usr-adm-001') {
    return {
      statusCode: 403,
      data: { error: 'Unauthorized: Only the booked consultant can submit deliverables for this session.' },
    };
  }

  session.status = 'completed';
  if (session.consultationDetails) {
    session.consultationDetails.outcomeSummary = outcomeSummary;
    session.consultationDetails.actionItems = actionItems;
    session.consultationDetails.deliverables = deliverables;
    session.consultationDetails.updatedAt = new Date().toISOString();
  }

  return {
    statusCode: 200,
    data: {
      success: true,
      sessionId,
      status: 'completed',
      outcomeSummary,
      actionItems,
      deliverables,
    },
  };
}

/**
 * 9. GET /api/consultations/outcome
 * Returns candidate-visible outcome summary and action items.
 */
export async function handleGetConsultationOutcome(params: {
  sessionId: string;
  candidateUserId: string;
}): Promise<{ statusCode: number; data: any }> {
  const { sessionId, candidateUserId } = params;

  if (!sessionId || !candidateUserId) {
    return { statusCode: 400, data: { error: 'sessionId and candidateUserId are required' } };
  }

  const session = memorySessions.get(sessionId);
  if (!session || session.candidateUserId !== candidateUserId || session.sessionType !== 'consultation') {
    return { statusCode: 404, data: { error: 'Consultation session not found' } };
  }

  if (session.status !== 'completed' || !session.consultationDetails?.outcomeSummary) {
    return {
      statusCode: 200,
      data: {
        hasOutcome: false,
        status: session.status,
        message: 'Your consultant has not yet submitted the post-session deliverables.',
      },
    };
  }

  const expert = ALL_EXPERTS.find((e) => e.id === session.expertId) || SEED_EXPERT;

  return {
    statusCode: 200,
    data: {
      hasOutcome: true,
      sessionId,
      status: 'completed',
      consultant: {
        fullName: expert.fullName,
        title: expert.title,
        company: expert.company,
      },
      topic: session.consultationDetails.topic,
      topicTitle: session.consultationDetails.topicTitle,
      goal: session.consultationDetails.goal,
      outcomeSummary: session.consultationDetails.outcomeSummary,
      actionItems: session.consultationDetails.actionItems || [],
      deliverables: session.consultationDetails.deliverables || {},
      completedAt: session.consultationDetails.updatedAt,
    },
  };
}
