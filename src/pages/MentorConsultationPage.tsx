import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useUserProfile } from '@/contexts/UserProfileContext';
import {
  Search,
  Star,
  Users,
  Calendar,
  Video,
  Clock,
  Briefcase,
  Code2,
  Database,
  Globe,
  Cpu,
  Brain,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Download,
  ExternalLink,
  ChevronRight,
  Play,
  FileText,
  Layers,
  Check,
  X,
  MessageSquare,
  Copy,
  CalendarCheck,
  Award,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — UNIFIED 1-TO-1 CONSULTATIONS & DELIVERABLES MODULE (/consultations)
   Integrated Mentor Directory matched strictly to candidate's track,
   1-Hour Booking Wizard, and Post-Session Deliverables Dossier.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Storage Key ────────────────────────────────────────────────────────── */
const SESSIONS_STORAGE_KEY = 'jadeer-consultation-sessions';

/* ── Deliverables & Session Data Interfaces ─────────────────────────────── */
export interface SessionDeliverableResource {
  id: string;
  title: string;
  type: 'pdf' | 'github' | 'guide';
  url: string;
  description: string;
}

export interface SessionTimelineChapter {
  time: string;
  title: string;
}

export interface SessionDeliverables {
  recordingUrl: string;
  recordingDuration: string;
  recordingChapters: SessionTimelineChapter[];
  summaryNotes: string;
  keyStrengths: string[];
  actionItems: string[];
  resources: SessionDeliverableResource[];
}

export interface ConsultationSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorTitle: string;
  mentorCompany: string;
  mentorInitials: string;
  mentorTrack: string;
  topicId: string;
  topicTitle: string;
  date: string;          // YYYY-MM-DD
  dateDisplay: string;   // e.g. "Thu, Aug 28, 2026"
  timeSlot: string;      // e.g. "11:00 AM - 12:00 PM (1 hr)"
  timezone: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingLink: string;
  candidateNotes?: string;
  createdAt: string;
  deliverables?: SessionDeliverables;
}

/* ── Mentor Interface ───────────────────────────────────────────────────── */
export interface Mentor {
  id: string;
  name: string;
  initials: string;
  title: string;
  company: string;
  bio: string;
  track: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  nextAvailable: string;
  availableDays: {
    date: string;
    dayLabel: string;
    slots: string[];
  }[];
  languages: string[];
}

/* ── Session Topics ─────────────────────────────────────────────────────── */
const SESSION_TOPICS = [
  {
    id: 'system-design',
    label: 'System Design & Distributed Architecture',
    desc: 'Deep-dive into scalable microservices, low-latency socket multiplexing, and fault-tolerant topologies.',
    icon: Cpu,
  },
  {
    id: 'interview-prep',
    label: 'Mock Technical Interview & Concurrency',
    desc: 'Simulated senior engineering interview covering data structures, algorithmic complexity, and live debugging.',
    icon: Code2,
  },
  {
    id: 'code-review',
    label: 'Code Review & Production Quality Audit',
    desc: '1-to-1 code walkthrough of your project repository with emphasis on RAII, memory safety, and unit testing.',
    icon: Database,
  },
  {
    id: 'portfolio-critique',
    label: 'Resume, Portfolio & Evidence Dossier Critique',
    desc: 'Review of your verified telemetry dossier and positioning for top-tier hiring managers.',
    icon: FileText,
  },
  {
    id: 'career-strategy',
    label: 'Career Strategy & Engineering Transition',
    desc: 'Tailored advice on leveling up from junior to staff engineer and navigating corporate ladders.',
    icon: Briefcase,
  },
  {
    id: 'general-mentorship',
    label: 'General Technical Mentorship & Open Q&A',
    desc: 'Open conversation to discuss any technical bottlenecks, career doubts, or architecture questions.',
    icon: MessageSquare,
  },
];

/* ── Pre-populated Vetted Mentors Database ───────────────────────────────── */
const ALL_MENTORS: Mentor[] = [
  /* Backend Development */
  {
    id: 'mentor-1',
    name: 'Eng. Mariam Ashraf',
    initials: 'MA',
    title: 'Principal Software Architect',
    company: 'Microsoft',
    bio: '12+ years building high-throughput distributed systems and low-latency cloud infrastructure. Specializes in Go, modern C++20, and Azure scale.',
    track: 'Backend Development',
    specialties: ['Distributed Systems', 'High-Concurrency APIs', 'C++20 & Go', 'Azure Architecture'],
    rating: 4.9,
    reviewCount: 84,
    sessionsCompleted: 128,
    nextAvailable: 'Today, 4:00 PM',
    languages: ['Arabic', 'English'],
    availableDays: [
      {
        date: '2026-08-30',
        dayLabel: 'Sat, Aug 30',
        slots: ['10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM'],
      },
      {
        date: '2026-08-31',
        dayLabel: 'Sun, Aug 31',
        slots: ['11:00 AM - 12:00 PM', '03:00 PM - 04:00 PM', '05:00 PM - 06:00 PM'],
      },
      {
        date: '2026-09-01',
        dayLabel: 'Mon, Sep 01',
        slots: ['09:00 AM - 10:00 AM', '01:00 PM - 02:00 PM', '04:00 PM - 05:00 PM'],
      },
    ],
  },
  {
    id: 'mentor-2',
    name: 'Eng. Khaled Hamdy',
    initials: 'KH',
    title: 'Senior Engineering Lead',
    company: 'Amazon',
    bio: 'Leading payment gateway infrastructure and microservices resilience. Passionate about asynchronous message brokers, PostgreSQL, and mentoring engineers.',
    track: 'Backend Development',
    specialties: ['PostgreSQL & Redis', 'Kafka Pipelines', 'Microservices Architecture', 'System Design'],
    rating: 4.8,
    reviewCount: 106,
    sessionsCompleted: 142,
    nextAvailable: 'Tomorrow, 11:00 AM',
    languages: ['Arabic', 'English'],
    availableDays: [
      {
        date: '2026-08-31',
        dayLabel: 'Sun, Aug 31',
        slots: ['10:00 AM - 11:00 AM', '11:30 AM - 12:30 PM', '04:00 PM - 05:00 PM'],
      },
      {
        date: '2026-09-01',
        dayLabel: 'Mon, Sep 01',
        slots: ['02:00 PM - 03:00 PM', '05:00 PM - 06:00 PM'],
      },
    ],
  },
  {
    id: 'mentor-backend-3',
    name: 'Eng. Faisal Al-Otaibi',
    initials: 'FO',
    title: 'Senior Distributed Systems Engineer',
    company: 'Aramco Digital',
    bio: 'Expert in high-concurrency microservices, Linux epoll socket architectures, and multi-region database replication.',
    track: 'Backend Development',
    specialties: ['Go & C++20', 'Linux Sockets', 'Distributed Cache', 'gRPC'],
    rating: 4.9,
    reviewCount: 58,
    sessionsCompleted: 80,
    nextAvailable: 'Mon, Sep 01',
    languages: ['Arabic', 'English'],
    availableDays: [
      {
        date: '2026-09-01',
        dayLabel: 'Mon, Sep 01',
        slots: ['10:00 AM - 11:00 AM', '03:00 PM - 04:00 PM'],
      },
    ],
  },

  /* Frontend Development */
  {
    id: 'mentor-3',
    name: 'Eng. Yasmin Farouk',
    initials: 'YF',
    title: 'Staff Frontend Architect',
    company: 'Spotify',
    bio: 'Designing high-performance web applications, design systems with React 19, and accessible micro-frontends with ultra-fast Core Web Vitals.',
    track: 'Frontend Development',
    specialties: ['React 19 & Next.js', 'TypeScript', 'Design Systems', 'Web Performance Optimization'],
    rating: 4.9,
    reviewCount: 67,
    sessionsCompleted: 92,
    nextAvailable: 'Today, 7:00 PM',
    languages: ['Arabic', 'English'],
    availableDays: [
      {
        date: '2026-08-30',
        dayLabel: 'Sat, Aug 30',
        slots: ['07:00 PM - 08:00 PM', '08:30 PM - 09:30 PM'],
      },
      {
        date: '2026-09-01',
        dayLabel: 'Mon, Sep 01',
        slots: ['10:00 AM - 11:00 AM', '04:00 PM - 05:00 PM'],
      },
    ],
  },
  {
    id: 'mentor-frontend-2',
    name: 'Eng. Omar Al-Harbi',
    initials: 'OH',
    title: 'Lead Frontend Engineer',
    company: 'Noon E-Commerce',
    bio: 'Specializing in ultra-responsive checkout micro-frontends, state management, and modern CSS architecture.',
    track: 'Frontend Development',
    specialties: ['React', 'Next.js', 'TailwindCSS', 'Testing & CI/CD'],
    rating: 4.8,
    reviewCount: 43,
    sessionsCompleted: 61,
    nextAvailable: 'Tomorrow, 3:00 PM',
    languages: ['Arabic', 'English'],
    availableDays: [
      {
        date: '2026-08-31',
        dayLabel: 'Sun, Aug 31',
        slots: ['03:00 PM - 04:00 PM', '05:00 PM - 06:00 PM'],
      },
    ],
  },

  /* AI & Data Engineering */
  {
    id: 'mentor-4',
    name: 'Dr. Nour El-Din',
    initials: 'ND',
    title: 'Staff AI Research Engineer',
    company: 'Google DeepMind',
    bio: 'PhD in Deep Learning and LLM architecture. Experienced in PyTorch distributed training, RAG vector pipelines, and production inference optimization.',
    track: 'AI & Data Engineering',
    specialties: ['PyTorch & LLMs', 'Vector Databases', 'Data Pipelines', 'Model Quantization'],
    rating: 5.0,
    reviewCount: 52,
    sessionsCompleted: 74,
    nextAvailable: 'Mon, Sep 01',
    languages: ['Arabic', 'English', 'French'],
    availableDays: [
      {
        date: '2026-09-01',
        dayLabel: 'Mon, Sep 01',
        slots: ['11:00 AM - 12:00 PM', '03:00 PM - 04:00 PM'],
      },
      {
        date: '2026-09-02',
        dayLabel: 'Tue, Sep 02',
        slots: ['01:00 PM - 02:00 PM', '05:00 PM - 06:00 PM'],
      },
    ],
  },
  {
    id: 'mentor-ai-2',
    name: 'Eng. Laila Al-Zahrani',
    initials: 'LZ',
    title: 'Senior MLOps & Data Architect',
    company: 'SDAIA',
    bio: 'Building enterprise data pipelines with Apache Spark, Kafka streaming, and LLM inference deployment on Kubernetes.',
    track: 'AI & Data Engineering',
    specialties: ['Apache Spark', 'Python', 'MLOps', 'FastAPI'],
    rating: 4.9,
    reviewCount: 39,
    sessionsCompleted: 51,
    nextAvailable: 'Tue, Sep 02',
    languages: ['Arabic', 'English'],
    availableDays: [
      {
        date: '2026-09-02',
        dayLabel: 'Tue, Sep 02',
        slots: ['02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM'],
      },
    ],
  },

  /* Embedded Systems & Firmware */
  {
    id: 'mentor-5',
    name: 'Eng. Tariq Mansour',
    initials: 'TM',
    title: 'Lead Embedded Systems Specialist',
    company: 'Elm & STC Solutions',
    bio: 'Specializing in ARM Cortex microcontrollers, FreeRTOS deterministic kernels, and low-power IoT sensor telemetry in harsh environments.',
    track: 'Embedded Systems & Firmware',
    specialties: ['C / Modern C++', 'FreeRTOS & STM32', 'Hardware Protocols (I2C/SPI)', 'Memory Optimization'],
    rating: 4.9,
    reviewCount: 44,
    sessionsCompleted: 63,
    nextAvailable: 'Sun, Aug 31',
    languages: ['Arabic', 'English'],
    availableDays: [
      {
        date: '2026-08-31',
        dayLabel: 'Sun, Aug 31',
        slots: ['02:00 PM - 03:00 PM', '04:30 PM - 05:30 PM'],
      },
      {
        date: '2026-09-02',
        dayLabel: 'Tue, Sep 02',
        slots: ['10:00 AM - 11:00 AM', '03:00 PM - 04:00 PM'],
      },
    ],
  },

  /* Full-Stack Development */
  {
    id: 'mentor-6',
    name: 'Eng. Ahmed Mostafa',
    initials: 'AM',
    title: 'Senior Full-Stack & DevOps Specialist',
    company: 'Meta',
    bio: 'Full-stack architect specializing in GraphQL/REST federation, Kubernetes clustering, CI/CD observability, and Terraform cloud automation.',
    track: 'Full-Stack Development',
    specialties: ['Full-Stack Architecture', 'Kubernetes & Docker', 'GraphQL', 'CI/CD Pipelines'],
    rating: 4.8,
    reviewCount: 95,
    sessionsCompleted: 154,
    nextAvailable: 'Tomorrow, 2:00 PM',
    languages: ['Arabic', 'English'],
    availableDays: [
      {
        date: '2026-08-31',
        dayLabel: 'Sun, Aug 31',
        slots: ['02:00 PM - 03:00 PM', '06:00 PM - 07:00 PM'],
      },
      {
        date: '2026-09-01',
        dayLabel: 'Mon, Sep 01',
        slots: ['11:00 AM - 12:00 PM', '05:00 PM - 06:00 PM'],
      },
    ],
  },

  /* Cloud Infrastructure & DevOps */
  {
    id: 'mentor-devops-1',
    name: 'Eng. Zaid Al-Mutairi',
    initials: 'ZM',
    title: 'Principal Cloud Platform Architect',
    company: 'AWS Solutions',
    bio: 'Designing resilient cloud infrastructure, multi-region Kubernetes clusters, and automated Terraform infrastructure as code.',
    track: 'Cloud Infrastructure & DevOps',
    specialties: ['Kubernetes', 'Terraform', 'AWS Architecture', 'Prometheus & Grafana'],
    rating: 4.9,
    reviewCount: 71,
    sessionsCompleted: 110,
    nextAvailable: 'Tomorrow, 10:00 AM',
    languages: ['Arabic', 'English'],
    availableDays: [
      {
        date: '2026-08-31',
        dayLabel: 'Sun, Aug 31',
        slots: ['10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM'],
      },
    ],
  },

  /* Mobile Development */
  {
    id: 'mentor-mobile-1',
    name: 'Eng. Reem Al-Ghamdi',
    initials: 'RG',
    title: 'Lead Mobile Systems Engineer',
    company: 'Careem',
    bio: 'Crafting ultra-smooth cross-platform and native mobile apps. Specialist in offline-first caching, mobile security, and React Native bridges.',
    track: 'Mobile Development',
    specialties: ['React Native', 'Swift & iOS', 'Android', 'Offline Sync'],
    rating: 4.9,
    reviewCount: 38,
    sessionsCompleted: 55,
    nextAvailable: 'Sun, Aug 31',
    languages: ['Arabic', 'English'],
    availableDays: [
      {
        date: '2026-08-31',
        dayLabel: 'Sun, Aug 31',
        slots: ['01:00 PM - 02:00 PM', '04:00 PM - 05:00 PM'],
      },
    ],
  },
];

/* ── Default Initial Consultation Sessions ───────────────────────────────── */
const DEFAULT_SESSIONS: ConsultationSession[] = [
  {
    id: 'session-completed-1',
    mentorId: 'mentor-1',
    mentorName: 'Eng. Mariam Ashraf',
    mentorTitle: 'Principal Software Architect',
    mentorCompany: 'Microsoft',
    mentorInitials: 'MA',
    mentorTrack: 'Backend Development',
    topicId: 'system-design',
    topicTitle: 'System Design & Distributed Cache Architecture',
    date: '2026-08-24',
    dateDisplay: 'Mon, Aug 24, 2026',
    timeSlot: '04:00 PM - 05:00 PM (1 hr)',
    timezone: 'Asia/Riyadh (GMT+3)',
    status: 'completed',
    meetingLink: 'https://meet.jadeer.io/consultation/jad-8492-microsoft',
    candidateNotes: 'Discuss cache invalidation in microservices and review my C++ epoll server implementation under 10k connections.',
    createdAt: '2026-08-20T10:00:00Z',
    deliverables: {
      recordingUrl: 'https://recordings.jadeer.io/consultation-jad-8492-microsoft-arch',
      recordingDuration: '54 mins',
      recordingChapters: [
        { time: '00:00', title: 'Session Kickoff & Candidate Goals Alignment' },
        { time: '12:30', title: 'Cache-Aside vs. Write-Through Trade-offs in Microservices' },
        { time: '28:15', title: 'Linux epoll vs Non-blocking Sockets Benchmark Review' },
        { time: '42:10', title: 'Memory Profiling with Valgrind & RAII Best Practices' },
        { time: '50:40', title: '14-Day Roadmap & Key Action Items' },
      ],
      summaryNotes:
        'Candidate demonstrated exceptional depth in asynchronous I/O and modern C++20 memory management. We refined the cache invalidation strategy for multi-region Redis clusters, addressed cold-cache stampedes with probabilistic early expiration, and walked through production socket multiplexing benchmarks.',
      keyStrengths: [
        'Solid grasp of RAII and zero-cost abstraction principles in modern C++20.',
        'Clear understanding of network socket non-blocking models under high concurrency.',
        'Articulate technical communication during system whiteboard design scenarios.',
      ],
      actionItems: [
        'Implement fallback degraded modes for Redis timeout spikes in your project repository.',
        'Profile memory allocations using Valgrind Massif before submitting benchmark results.',
        'Practice explaining Paxos/Raft consensus trade-offs concisely in under 3 minutes.',
      ],
      resources: [
        {
          id: 'res-1',
          title: 'Jadeer Backend Systems Architecture Roadmap 2026',
          type: 'pdf',
          url: '/docs/jadeer-backend-roadmap.pdf',
          description: 'Comprehensive milestone guide covering concurrency, databases, and microservices resilience.',
        },
        {
          id: 'res-2',
          title: 'Distributed Caching Patterns & Invalidation Handbook',
          type: 'github',
          url: 'https://github.com/jadeer-mentorship/distributed-caching-patterns',
          description: 'Reference implementations with Go and Redis demonstrating probabilistic cache warming.',
        },
        {
          id: 'res-3',
          title: 'Modern C++ Concurrency & Memory Safety Cheatsheet',
          type: 'guide',
          url: 'https://resources.jadeer.io/cpp-concurrency-guide',
          description: 'Detailed guide on std::atomic, memory fences, and latch primitives for multi-threaded backends.',
        },
      ],
    },
  },
  {
    id: 'session-completed-2',
    mentorId: 'mentor-2',
    mentorName: 'Eng. Khaled Hamdy',
    mentorTitle: 'Senior Engineering Lead',
    mentorCompany: 'Amazon',
    mentorInitials: 'KH',
    mentorTrack: 'Backend Development',
    topicId: 'interview-prep',
    topicTitle: 'Mock Technical Interview & Concurrency Deep-Dive',
    date: '2026-08-18',
    dateDisplay: 'Tue, Aug 18, 2026',
    timeSlot: '10:00 AM - 11:00 AM (1 hr)',
    timezone: 'Asia/Riyadh (GMT+3)',
    status: 'completed',
    meetingLink: 'https://meet.jadeer.io/consultation/jad-8492-amazon',
    candidateNotes: 'Practice answering low-level distributed questions and database query execution plans.',
    createdAt: '2026-08-14T12:30:00Z',
    deliverables: {
      recordingUrl: 'https://recordings.jadeer.io/consultation-jad-8492-amazon-mock',
      recordingDuration: '58 mins',
      recordingChapters: [
        { time: '00:00', title: 'Warm-up & Behavioral Scenario (STAR Framework)' },
        { time: '15:20', title: 'Live Coding: Concurrent Rate Limiter in Go / C++' },
        { time: '34:40', title: 'Database Index Analysis (B-Tree vs Hash Index)' },
        { time: '49:15', title: 'Direct Mentor Feedback & Interview Scoring Breakdown' },
      ],
      summaryNotes:
        'Thorough mock interview evaluating low-level concurrency, thread synchronization, and database index optimization. Candidate excelled in algorithmic problem solving and writing clean, idiomatic code.',
      keyStrengths: [
        'Quick identification of optimal B-Tree index configurations for composite queries.',
        'Clean error propagation and panic recovery patterns.',
        'Strong edge-case analysis during multi-threaded race condition tests.',
      ],
      actionItems: [
        'Review distributed transactions (Saga pattern vs 2PC orchestration).',
        'Add unit test coverage for edge race conditions using the -race detector.',
      ],
      resources: [
        {
          id: 'res-4',
          title: 'High-Throughput Go Microservices Blueprint',
          type: 'github',
          url: 'https://github.com/jadeer-mentorship/go-microservices-blueprint',
          description: 'Production-ready template with gRPC, OpenTelemetry, and structured logging.',
        },
        {
          id: 'res-5',
          title: 'PostgreSQL Performance Tuning & Execution Plan Deep-Dive',
          type: 'guide',
          url: 'https://resources.jadeer.io/postgres-tuning',
          description: 'Understanding EXPLAIN ANALYZE, sequential scans, and partial indexing.',
        },
      ],
    },
  },
  {
    id: 'session-upcoming-1',
    mentorId: 'mentor-1',
    mentorName: 'Eng. Mariam Ashraf',
    mentorTitle: 'Principal Software Architect',
    mentorCompany: 'Microsoft',
    mentorInitials: 'MA',
    mentorTrack: 'Backend Development',
    topicId: 'code-review',
    topicTitle: 'Code Review & Production Quality Audit',
    date: '2026-08-31',
    dateDisplay: 'Sun, Aug 31, 2026',
    timeSlot: '03:00 PM - 04:00 PM (1 hr)',
    timezone: 'Asia/Riyadh (GMT+3)',
    status: 'upcoming',
    meetingLink: 'https://meet.jadeer.io/consultation/jad-8492-upcoming',
    candidateNotes: 'Review the final pull request for the distributed caching engine before submitting to the Evidence Dossier.',
    createdAt: '2026-08-28T14:00:00Z',
  },
];

function loadSessionsFromStorage(): ConsultationSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading consultation sessions from localStorage:', err);
  }
  return DEFAULT_SESSIONS;
}

function saveSessionsToStorage(sessions: ConsultationSession[]) {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving consultation sessions to localStorage:', err);
  }
}

export default function MentorConsultationPage() {
  const { profile } = useUserProfile();

  // Active track from candidate profile (default: Backend Development)
  const activeCandidateTrack = profile.track || 'Backend Development';

  /* ── Page View State ── */
  const [activeMainTab, setActiveMainTab] = useState<'directory' | 'sessions'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionFilter, setSessionFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  /* ── Sessions State ── */
  const [sessions, setSessions] = useState<ConsultationSession[]>(loadSessionsFromStorage);

  /* ── Booking Modal State ── */
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(SESSION_TOPICS[0].id);
  const [candidateNotes, setCandidateNotes] = useState('');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  /* ── Deliverables Viewer Modal State ── */
  const [viewingDeliverablesSession, setViewingDeliverablesSession] = useState<ConsultationSession | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [checkedActionItems, setCheckedActionItems] = useState<Record<string, boolean>>({});

  // Persist sessions whenever updated
  useEffect(() => {
    saveSessionsToStorage(sessions);
  }, [sessions]);

  /* ── Filter Mentors strictly by Candidate's Active Track ── */
  const trackMatchedMentors = useMemo(() => {
    const trackLower = activeCandidateTrack.toLowerCase();
    
    // First find mentors whose track directly matches
    const exactOrPartial = ALL_MENTORS.filter((m) => {
      const mTrackLower = m.track.toLowerCase();
      return (
        mTrackLower === trackLower ||
        mTrackLower.includes(trackLower) ||
        trackLower.includes(mTrackLower)
      );
    });

    if (exactOrPartial.length > 0) return exactOrPartial;
    
    // Fallback: search specialties or return backend mentors
    return ALL_MENTORS.filter((m) => m.track === 'Backend Development');
  }, [activeCandidateTrack]);

  /* ── Further apply Search Query within the track-matched mentors ── */
  const filteredMentors = useMemo(() => {
    if (!searchQuery.trim()) return trackMatchedMentors;
    const q = searchQuery.toLowerCase();
    return trackMatchedMentors.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.specialties.some((s) => s.toLowerCase().includes(q))
    );
  }, [trackMatchedMentors, searchQuery]);

  /* ── Filtered Sessions ── */
  const filteredSessions = useMemo(() => {
    if (sessionFilter === 'all') return sessions;
    return sessions.filter((s) => s.status === sessionFilter);
  }, [sessions, sessionFilter]);

  const upcomingCount = useMemo(() => sessions.filter((s) => s.status === 'upcoming').length, [sessions]);
  const completedCount = useMemo(() => sessions.filter((s) => s.status === 'completed').length, [sessions]);

  /* ── Open Booking Flow ── */
  const handleOpenBooking = (mentor: Mentor) => {
    setBookingMentor(mentor);
    setSelectedDayIndex(0);
    setSelectedSlot(mentor.availableDays[0]?.slots[0] || null);
    setSelectedTopicId(SESSION_TOPICS[0].id);
    setCandidateNotes('');
    setIsBookingSuccess(false);
  };

  /* ── Confirm 1-Hour Booking ── */
  const handleConfirmBooking = () => {
    if (!bookingMentor || !selectedSlot) return;

    const selectedDayObj = bookingMentor.availableDays[selectedDayIndex] || bookingMentor.availableDays[0];
    const selectedTopicObj = SESSION_TOPICS.find((t) => t.id === selectedTopicId) || SESSION_TOPICS[0];

    const newSessionId = `session-${Date.now()}`;
    const newSession: ConsultationSession = {
      id: newSessionId,
      mentorId: bookingMentor.id,
      mentorName: bookingMentor.name,
      mentorTitle: bookingMentor.title,
      mentorCompany: bookingMentor.company,
      mentorInitials: bookingMentor.initials,
      mentorTrack: bookingMentor.track,
      topicId: selectedTopicObj.id,
      topicTitle: selectedTopicObj.label,
      date: selectedDayObj.date,
      dateDisplay: `${selectedDayObj.dayLabel}, 2026`,
      timeSlot: `${selectedSlot} (1 hr)`,
      timezone: 'Asia/Riyadh (GMT+3)',
      status: 'upcoming',
      meetingLink: `https://meet.jadeer.io/consultation/jad-${bookingMentor.initials.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      candidateNotes: candidateNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);
    setIsBookingSuccess(true);
  };

  /* ── Simulate Complete Session (For testing deliverables) ── */
  const handleSimulateCompletion = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          status: 'completed',
          deliverables: {
            recordingUrl: `https://recordings.jadeer.io/consultation-${s.id}`,
            recordingDuration: '52 mins',
            recordingChapters: [
              { time: '00:00', title: 'Session Alignment & Architecture Overview' },
              { time: '14:20', title: 'Technical Problem Solving & Deep-Dive' },
              { time: '36:45', title: 'Code Review & System Bottleneck Analysis' },
              { time: '48:30', title: 'Mentor Takeaways & 14-Day Action Roadmap' },
            ],
            summaryNotes: `High-impact 1-to-1 session with ${s.mentorName} focused on ${s.topicTitle}. Key focus placed on production resilience, test coverage, and career milestones.`,
            keyStrengths: [
              'Clear technical explanation of code architecture decisions.',
              'Great responsiveness to architectural trade-off feedback.',
              'Demonstrated mastery of core domain principles.',
            ],
            actionItems: [
              'Implement recommended caching layer improvements.',
              'Review the provided study roadmap and complete the benchmark test.',
            ],
            resources: [
              {
                id: `res-${Date.now()}-1`,
                title: `${s.mentorTrack} Production Mastery Blueprint`,
                type: 'pdf',
                url: '/docs/jadeer-backend-roadmap.pdf',
                description: 'Step-by-step technical guide shared directly by your mentor.',
              },
              {
                id: `res-${Date.now()}-2`,
                title: 'Curated Mentorship Repository & Code Snippets',
                type: 'github',
                url: 'https://github.com/jadeer-mentorship/distributed-caching-patterns',
                description: 'Code examples and architecture reference implementations.',
              },
            ],
          },
        };
      })
    );
    setCopiedToast('Session marked as completed! Deliverables are now live.');
    setTimeout(() => setCopiedToast(null), 3000);
  };

  /* ── Copy Text Helper ── */
  const handleCopyNotes = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToast('Deliverable notes copied to clipboard!');
    setTimeout(() => setCopiedToast(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-[fade-in_0.4s_ease] pb-16 py-2 sm:py-4">

      {/* ── Live Toast Notification ── */}
      {copiedToast && (
        <div className="p-4 rounded-2xl bg-[#ecfdf5] border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-md fixed bottom-6 right-6 z-50 animate-[slide-up_0.2s_ease]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         HERO HEADER BANNER & STATS (Clean Light UI Theme)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] relative overflow-hidden">
        {/* Accent gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6E8F75] via-[#10B981] to-[#6E8F75]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>1-to-1 Senior Mentorship</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                <span>Matched Track:</span>
                <strong className="text-slate-900">{activeCandidateTrack}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              1-to-1 Consultations & Mentorship
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Book direct 1-hour sessions with vetted industry architects from Microsoft, Amazon, Google DeepMind, and Meta.
              Review your post-session deliverables, meeting recordings, and custom study roadmaps all in one unified place.
            </p>
          </div>

          {/* Clean Stats Counters (Only Upcoming & Completed) */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center min-w-[110px] space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/60 block">Upcoming</span>
              <span className="text-2xl font-black text-[#6E8F75]">{upcomingCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center min-w-[110px] space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/60 block">Completed</span>
              <span className="text-2xl font-black text-emerald-600">{completedCount}</span>
            </div>
          </div>
        </div>

        {/* ── Top Level View Switcher Tab Bar ── */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-200/80">
          <button
            id="tab-browse-mentors"
            onClick={() => setActiveMainTab('directory')}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer
              ${activeMainTab === 'directory'
                ? 'bg-[#6E8F75] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
              }
            `}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Browse Mentors Directory</span>
          </button>

          <button
            id="tab-my-consultations"
            onClick={() => setActiveMainTab('sessions')}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative
              ${activeMainTab === 'sessions'
                ? 'bg-[#6E8F75] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
              }
            `}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>My Consultations & Deliverables</span>
            <span className={`ml-1 px-2 py-0.2 rounded-full text-[10px] font-bold ${
              activeMainTab === 'sessions' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-800'
            }`}>
              {sessions.length}
            </span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         VIEW 1: BROWSE MENTORS DIRECTORY (Strictly Track Matched)
         ═══════════════════════════════════════════════════════════════ */}
      {activeMainTab === 'directory' && (
        <div className="space-y-6">

          {/* Track Context & Search Banner */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6E8F75]" />
                  <h2 className="text-sm font-extrabold text-[#0B0F19]">
                    Mentors Tailored to Your Track: <span className="text-[#6E8F75]">{activeCandidateTrack}</span>
                  </h2>
                </div>
                <p className="text-xs text-[#0B0F19]/50">
                  Directory filtered strictly to senior architects specializing in {activeCandidateTrack}.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/40" />
                <input
                  type="text"
                  placeholder="Search mentors by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] placeholder:text-[#0B0F19]/40 focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-5 transition-all hover:shadow-md hover:border-[#6E8F75]/30 relative overflow-hidden"
              >
                {/* Top Mentor Header */}
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-[#6E8F75] text-white font-extrabold text-base flex items-center justify-center shadow-xs shrink-0">
                        {mentor.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-extrabold text-[#0B0F19] truncate">{mentor.name}</h3>
                        <p className="text-xs text-[#0B0F19]/60 font-medium truncate">
                          {mentor.title} • <span className="text-[#0B0F19] font-bold">{mentor.company}</span>
                        </p>
                      </div>
                    </div>

                    {/* Track Match Pill Badge without cut-off borders */}
                    <span className="text-[10px] font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-1 rounded-full border border-[#6E8F75]/20 shrink-0 whitespace-nowrap">
                      🎯 Track Match
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-[#0B0F19]/70 leading-relaxed line-clamp-3">
                    {mentor.bio}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.specialties.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-[11px] font-semibold text-[#0B0F19]/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Stats & Book Action */}
                <div className="pt-4 border-t border-[#0B0F19]/[0.06] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#0B0F19]/60">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-[#0B0F19]">{mentor.rating}</span>
                      <span>({mentor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#6E8F75]" />
                      <span>{mentor.nextAvailable}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenBooking(mentor)}
                    className="w-full h-11 rounded-2xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book 1-to-1 Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         VIEW 2: MY CONSULTATIONS & DELIVERABLES DOSSIER
         ═══════════════════════════════════════════════════════════════ */}
      {activeMainTab === 'sessions' && (
        <div className="space-y-6">

          {/* Sub Filter Tabs */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSessionFilter('all')}
                className={`
                  px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
                  ${sessionFilter === 'all'
                    ? 'bg-[#6E8F75] text-white shadow-xs'
                    : 'bg-[#FAF9F6] text-[#0B0F19]/70 hover:bg-black/5'
                  }
                `}
              >
                All Sessions ({sessions.length})
              </button>
              <button
                onClick={() => setSessionFilter('upcoming')}
                className={`
                  px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
                  ${sessionFilter === 'upcoming'
                    ? 'bg-[#6E8F75] text-white shadow-xs'
                    : 'bg-[#FAF9F6] text-[#0B0F19]/70 hover:bg-black/5'
                  }
                `}
              >
                Upcoming ({upcomingCount})
              </button>
              <button
                onClick={() => setSessionFilter('completed')}
                className={`
                  px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
                  ${sessionFilter === 'completed'
                    ? 'bg-[#6E8F75] text-white shadow-xs'
                    : 'bg-[#FAF9F6] text-[#0B0F19]/70 hover:bg-black/5'
                  }
                `}
              >
                Completed & Deliverables ({completedCount})
              </button>
            </div>

            <button
              onClick={() => setActiveMainTab('directory')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6E8F75] hover:underline cursor-pointer"
            >
              <span>+ Book Another Session</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sessions List */}
          <div className="space-y-4">
            {filteredSessions.map((session) => {
              const isCompleted = session.status === 'completed';
              return (
                <div
                  key={session.id}
                  className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4 hover:border-[#6E8F75]/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#6E8F75] text-white font-extrabold text-base flex items-center justify-center shadow-xs shrink-0">
                        {session.mentorInitials}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-base font-extrabold text-[#0B0F19]">{session.topicTitle}</h3>
                          <span
                            className={`
                              px-2.5 py-0.5 rounded-full text-[11px] font-bold border
                              ${isCompleted
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
                                : 'bg-[#6E8F75]/10 text-[#6E8F75] border-[#6E8F75]/20'
                              }
                            `}
                          >
                            {isCompleted ? '✓ Completed & Deliverables Ready' : '• Confirmed & Scheduled'}
                          </span>
                        </div>

                        <p className="text-xs text-[#0B0F19]/60 font-medium">
                          with <strong className="text-[#0B0F19]">{session.mentorName}</strong> ({session.mentorTitle} at {session.mentorCompany})
                        </p>
                      </div>
                    </div>

                    {/* Date & Time Slot Badge */}
                    <div className="text-left sm:text-right space-y-0.5">
                      <p className="text-xs font-bold text-[#0B0F19] flex items-center sm:justify-end gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#6E8F75]" />
                        <span>{session.dateDisplay}</span>
                      </p>
                      <p className="text-xs text-[#0B0F19]/50 font-mono">
                        {session.timeSlot} • {session.timezone}
                      </p>
                    </div>
                  </div>

                  {/* Candidate Goals/Notes snippet if available */}
                  {session.candidateNotes && (
                    <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] text-xs text-[#0B0F19]/70 leading-relaxed">
                      <span className="font-bold text-[#0B0F19] block mb-0.5">Session Goals & Notes:</span>
                      {session.candidateNotes}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#0B0F19]/[0.05] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <button
                          type="button"
                          onClick={() => setViewingDeliverablesSession(session)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)] transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                          <span>View Deliverables (Recording & Notes)</span>
                        </button>
                      ) : (
                        <>
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join Video Meeting</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleSimulateCompletion(session.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19]/70 hover:text-[#0B0F19] transition-all cursor-pointer"
                            title="Simulate completed meeting to test live post-session deliverables view"
                          >
                            <Check className="w-3 h-3 text-[#6E8F75]" />
                            <span>Mark Completed (Test)</span>
                          </button>
                        </>
                      )}
                    </div>

                    <div className="text-xs text-[#0B0F19]/40 font-mono">
                      Meeting ID: {session.id}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredSessions.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#0B0F19]/[0.06] space-y-3">
                <p className="text-sm text-[#0B0F19]/60">No consultation sessions found in this view.</p>
                <button
                  onClick={() => setActiveMainTab('directory')}
                  className="px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60]"
                >
                  Browse Available Mentors
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MODAL 1: 1-HOUR BOOKING FLOW MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#0B0F19]/[0.08] shadow-2xl relative space-y-6 my-8">

            {/* Close Button */}
            <button
              onClick={() => setBookingMentor(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#0B0F19]/40 hover:text-[#0B0F19] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isBookingSuccess ? (
              <>
                {/* Mentor Summary Header */}
                <div className="flex items-start gap-4 border-b border-[#0B0F19]/[0.06] pb-5 pr-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#6E8F75] text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0">
                    {bookingMentor.initials}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2 py-0.5 rounded-md border border-[#6E8F75]/20">
                        1-to-1 Consultation
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        1-Hour Duration
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-[#0B0F19]">
                      Book 1-to-1 Mentorship Session with {bookingMentor.name}
                    </h2>
                    <p className="text-xs text-[#0B0F19]/60 font-medium">
                      {bookingMentor.title} at {bookingMentor.company} • Rating {bookingMentor.rating} ⭐
                    </p>
                  </div>
                </div>

                {/* Step 1: Select Date & Available 1-Hour Time Slot */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#0B0F19] uppercase tracking-wider">
                    Step 1: Choose Date & 1-Hour Time Slot
                  </label>

                  {/* Day Picker */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {bookingMentor.availableDays.map((day, idx) => {
                      const isSelected = selectedDayIndex === idx;
                      return (
                        <button
                          key={day.date}
                          type="button"
                          onClick={() => {
                            setSelectedDayIndex(idx);
                            setSelectedSlot(day.slots[0] || null);
                          }}
                          className={`
                            px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 border transition-all cursor-pointer
                            ${isSelected
                              ? 'bg-[#6E8F75] text-white border-[#6E8F75] shadow-xs'
                              : 'bg-[#FAF9F6] text-[#0B0F19]/70 border-[#0B0F19]/[0.08] hover:border-[#6E8F75]/40'
                            }
                          `}
                        >
                          {day.dayLabel}
                        </button>
                      );
                    })}
                  </div>

                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {bookingMentor.availableDays[selectedDayIndex]?.slots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`
                            flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer
                            ${isSelected
                              ? 'bg-[#6E8F75]/10 border-[#6E8F75] text-[#6E8F75] shadow-xs'
                              : 'bg-[#FAF9F6] border-[#0B0F19]/[0.06] text-[#0B0F19]/80 hover:border-[#6E8F75]/30'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{slot}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#6E8F75]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Select Consultation Topic */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#0B0F19] uppercase tracking-wider">
                    Step 2: Choose Consultation Topic
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {SESSION_TOPICS.map((topic) => {
                      const isSelected = selectedTopicId === topic.id;
                      const Icon = topic.icon;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => setSelectedTopicId(topic.id)}
                          className={`
                            text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5
                            ${isSelected
                              ? 'bg-[#6E8F75]/10 border-[#6E8F75] shadow-2xs'
                              : 'bg-[#FAF9F6] border-[#0B0F19]/[0.06] hover:border-[#6E8F75]/30'
                            }
                          `}
                        >
                          <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#6E8F75]' : 'text-[#0B0F19]/50'}`} />
                          <div className="space-y-0.5 min-w-0">
                            <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#6E8F75]' : 'text-[#0B0F19]'}`}>
                              {topic.label}
                            </p>
                            <p className="text-[11px] text-[#0B0F19]/50 line-clamp-2 leading-tight">
                              {topic.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Session Goals & Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0B0F19] uppercase tracking-wider">
                    Step 3: Preparation Notes for Mentor (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={candidateNotes}
                    onChange={(e) => setCandidateNotes(e.target.value)}
                    placeholder="Describe specific questions, architecture diagrams, or GitHub repositories you would like to review during the 1-hour call..."
                    className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                  />
                </div>

                {/* Booking Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0B0F19]/[0.06]">
                  <button
                    type="button"
                    onClick={() => setBookingMentor(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#0B0F19]/60 hover:text-[#0B0F19] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={!selectedSlot}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)] transition-all cursor-pointer active:scale-95 shadow-md disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm 1-to-1 Consultation</span>
                  </button>
                </div>
              </>
            ) : (
              /* Success Confirmation Card */
              <div className="text-center py-6 space-y-4 animate-[scale-in_0.2s_ease]">
                <div className="w-16 h-16 rounded-full bg-[#ecfdf5] border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#0B0F19]">
                    1-to-1 Consultation Confirmed!
                  </h3>
                  <p className="text-xs text-[#0B0F19]/60 max-w-md mx-auto">
                    Your session with <strong className="text-[#0B0F19]">{bookingMentor.name}</strong> has been scheduled and synced with your calendar.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-left max-w-md mx-auto space-y-1.5 text-xs">
                  <p className="font-bold text-[#0B0F19]">
                    Date & Time:{' '}
                    <span className="text-[#6E8F75]">
                      {bookingMentor.availableDays[selectedDayIndex]?.dayLabel}, 2026 at {selectedSlot}
                    </span>
                  </p>
                  <p className="text-[#0B0F19]/60 font-mono">
                    Direct Video Room: https://meet.jadeer.io/consultation/jad-mentor
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingMentor(null);
                      setActiveMainTab('sessions');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] shadow-md transition-all cursor-pointer"
                  >
                    View in My Consultations
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MODAL 2: POST-SESSION DELIVERABLES DOSSIER VIEWER
         ═══════════════════════════════════════════════════════════════ */}
      {viewingDeliverablesSession && viewingDeliverablesSession.deliverables && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-[#0B0F19]/[0.08] shadow-2xl relative space-y-6 my-8">

            {/* Close Modal Button */}
            <button
              onClick={() => setViewingDeliverablesSession(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#0B0F19]/40 hover:text-[#0B0F19] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dossier Header */}
            <div className="flex items-start gap-4 border-b border-[#0B0F19]/[0.06] pb-5 pr-8">
              <div className="w-14 h-14 rounded-2xl bg-[#6E8F75] text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0">
                {viewingDeliverablesSession.mentorInitials}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                    ✓ Verified Deliverables Dossier
                  </span>
                  <span className="text-[10px] font-bold text-[#0B0F19]/50">
                    Duration: {viewingDeliverablesSession.deliverables.recordingDuration}
                  </span>
                </div>

                <h2 className="text-xl font-black text-[#0B0F19]">
                  {viewingDeliverablesSession.topicTitle}
                </h2>
                <p className="text-xs text-[#0B0F19]/60 font-medium">
                  Conducted by <strong className="text-[#0B0F19]">{viewingDeliverablesSession.mentorName}</strong> ({viewingDeliverablesSession.mentorTitle} at {viewingDeliverablesSession.mentorCompany}) on {viewingDeliverablesSession.dateDisplay}
                </p>
              </div>
            </div>

            {/* 1. Meeting Recording Video Replay Interface */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19] flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#6E8F75]" />
                  <span>1. Full Session Recording & Timestamped Chapters</span>
                </h3>
                <span className="text-xs font-mono font-bold text-[#6E8F75]">
                  HD 1080p Cloud Replay
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0F19] text-white space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#6E8F75] text-white flex items-center justify-center shadow-xs">
                      <Play className="w-4 h-4 fill-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Interactive Session Video Replay</p>
                      <p className="text-[11px] text-white/50">{viewingDeliverablesSession.deliverables.recordingDuration} • Cloud Synced</p>
                    </div>
                  </div>

                  <a
                    href={viewingDeliverablesSession.deliverables.recordingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6E8F75] hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Recording</span>
                  </a>
                </div>

                {/* Timeline Chapters */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">
                    Jump to Timestamped Chapter:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {viewingDeliverablesSession.deliverables.recordingChapters.map((chap) => (
                      <button
                        key={chap.time}
                        type="button"
                        onClick={() => handleCopyNotes(`Chapter [${chap.time}] ${chap.title}`)}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-left text-xs transition-colors cursor-pointer"
                      >
                        <span className="text-white/80 font-medium truncate pr-2">{chap.title}</span>
                        <span className="font-mono text-[10px] font-bold text-[#6E8F75] shrink-0 bg-white/10 px-1.5 py-0.5 rounded">
                          {chap.time}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Mentor Notes & Qualitative Feedback */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#6E8F75]" />
                  <span>2. Mentor Session Takeaways & Action Plan</span>
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyNotes(
                      `Mentor Notes from ${viewingDeliverablesSession.mentorName}:\n${viewingDeliverablesSession.deliverables?.summaryNotes}\n\nStrengths:\n${viewingDeliverablesSession.deliverables?.keyStrengths.map((s) => `• ${s}`).join('\n')}\n\nAction Items:\n${viewingDeliverablesSession.deliverables?.actionItems.map((a) => `[ ] ${a}`).join('\n')}`
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#6E8F75] hover:underline cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Notes</span>
                </button>
              </div>

              {/* Summary Paragraph */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-xs text-[#0B0F19]/80 leading-relaxed">
                {viewingDeliverablesSession.deliverables.summaryNotes}
              </div>

              {/* Strengths & Action Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/50 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Key Strengths Identified</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-950/80">
                    {viewingDeliverablesSession.deliverables.keyStrengths.map((s) => (
                      <li key={s} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 14-Day Action Items */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] space-y-2">
                  <h4 className="text-xs font-bold text-[#0B0F19] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#6E8F75]" />
                    <span>14-Day Action Plan</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {viewingDeliverablesSession.deliverables.actionItems.map((item, idx) => {
                      const itemKey = `${viewingDeliverablesSession.id}-item-${idx}`;
                      const isDone = checkedActionItems[itemKey];
                      return (
                        <label
                          key={item}
                          className="flex items-start gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(isDone)}
                            onChange={() =>
                              setCheckedActionItems((prev) => ({
                                ...prev,
                                [itemKey]: !prev[itemKey],
                              }))
                            }
                            className="mt-0.5 rounded text-[#6E8F75] focus:ring-[#6E8F75]"
                          />
                          <span
                            className={`text-[#0B0F19]/80 transition-all ${isDone ? 'line-through text-[#0B0F19]/40' : ''}`}
                          >
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Study Resources & Recommended Roadmaps */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#6E8F75]" />
                <span>3. Recommended Study Resources & Roadmaps</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {viewingDeliverablesSession.deliverables.resources.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] flex items-start justify-between gap-3 hover:border-[#6E8F75]/40 transition-all"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#6E8F75]/10 text-[#6E8F75]">
                          {res.type}
                        </span>
                        <h4 className="text-xs font-bold text-[#0B0F19] truncate">{res.title}</h4>
                      </div>
                      <p className="text-[11px] text-[#0B0F19]/55 leading-tight">{res.description}</p>
                    </div>

                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white border border-[#0B0F19]/[0.08] hover:border-[#6E8F75] text-[#6E8F75] shrink-0 transition-all"
                      title="Open Resource"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#0B0F19]/[0.06]">
              <div className="text-xs text-[#0B0F19]/40">
                Deliverables stored persistently in your candidate dossier.
              </div>

              <button
                type="button"
                onClick={() => setViewingDeliverablesSession(null)}
                className="px-6 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] transition-all cursor-pointer"
              >
                Close Deliverables Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
