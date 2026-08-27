import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  ArrowRight,
  Clock,
  Star,
  MessageCircle,
  Target,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Video,
  TrendingUp,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — STUDENT DASHBOARD
   Consultation & mentor-focused dashboard for students seeking career
   guidance and industry mentorship.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Upcoming Session Data ──────────────────────────────────────────────── */

interface MentorSession {
  id: string;
  mentorName: string;
  mentorInitials: string;
  mentorTitle: string;
  topic: string;
  date: string;
  time: string;
  type: 'video' | 'chat';
  status: 'confirmed' | 'pending';
}

const upcomingSessions: MentorSession[] = [
  {
    id: 'sess-1',
    mentorName: 'Eng. Sara El-Kady',
    mentorInitials: 'SE',
    mentorTitle: 'Senior Backend Engineer @ Instabug',
    topic: 'System Design Fundamentals & API Architecture',
    date: 'Thu, Aug 28',
    time: '4:00 PM — 4:45 PM',
    type: 'video',
    status: 'confirmed',
  },
  {
    id: 'sess-2',
    mentorName: 'Dr. Omar Nabil',
    mentorInitials: 'ON',
    mentorTitle: 'Tech Lead @ Valeo Egypt',
    topic: 'Career Path Planning: Embedded vs. Backend',
    date: 'Sat, Aug 30',
    time: '11:00 AM — 11:45 AM',
    type: 'video',
    status: 'pending',
  },
];

/* ── Featured Mentors ───────────────────────────────────────────────────── */

interface FeaturedMentor {
  id: string;
  name: string;
  initials: string;
  title: string;
  company: string;
  specialties: string[];
  rating: number;
  sessionsCompleted: number;
  available: boolean;
}

const featuredMentors: FeaturedMentor[] = [
  {
    id: 'mentor-1',
    name: 'Eng. Mariam Ashraf',
    initials: 'MA',
    title: 'Principal Software Engineer',
    company: 'Microsoft',
    specialties: ['Cloud Architecture', 'Distributed Systems'],
    rating: 4.9,
    sessionsCompleted: 87,
    available: true,
  },
  {
    id: 'mentor-2',
    name: 'Eng. Khaled Hamdy',
    initials: 'KH',
    title: 'Engineering Manager',
    company: 'Amazon',
    specialties: ['Backend Development', 'Team Leadership'],
    rating: 4.8,
    sessionsCompleted: 124,
    available: true,
  },
  {
    id: 'mentor-3',
    name: 'Dr. Nour El-Din',
    initials: 'ND',
    title: 'ML Research Engineer',
    company: 'Google DeepMind',
    specialties: ['Machine Learning', 'Python Engineering'],
    rating: 5.0,
    sessionsCompleted: 56,
    available: false,
  },
];

/* ── Guidance Progress ──────────────────────────────────────────────────── */

interface GuidanceMilestone {
  label: string;
  completed: boolean;
}

const guidanceMilestones: GuidanceMilestone[] = [
  { label: 'Initial Career Assessment', completed: true },
  { label: 'Technical Skills Roadmap', completed: true },
  { label: 'First Mentor Consultation', completed: false },
];

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function StudentDashboardPage() {
  const completedCount = guidanceMilestones.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / guidanceMilestones.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 animate-[fade-in_0.4s_ease] py-2 sm:py-6">

      {/* ═══════════════════════════════════════════════════════════════
         GREETING HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#0B0F19]/45">
          <span>Student Mentorship Track</span>
          <span>•</span>
          <span>Student ID: JAD-STU-2847</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
          Welcome back, <span className="text-student-500">Ahmad</span>
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[#0B0F19]/55 max-w-xl leading-relaxed">
          Connect with industry mentors, book consultation sessions, and accelerate your career preparation.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         UPCOMING CONSULTATION SESSIONS
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.05] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-student-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">
              Upcoming Sessions
            </h2>
          </div>
          <Link
            to="/student/mentors"
            className="text-xs font-bold text-student-500 hover:text-student-600 transition-colors"
          >
            View All →
          </Link>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#0B0F19]/40">
            No upcoming sessions. Book a consultation with a mentor to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] hover:border-student-500/20 transition-colors group"
              >
                {/* Mentor Avatar */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-student-500 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-[0_2px_8px_rgba(0,86,214,0.25)]">
                    {session.mentorInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#0B0F19] truncate">
                      {session.mentorName}
                    </p>
                    <p className="text-[12px] text-[#0B0F19]/45 truncate">
                      {session.topic}
                    </p>
                  </div>
                </div>

                {/* Session Details */}
                <div className="flex items-center gap-3 sm:gap-5 text-[12px] text-[#0B0F19]/50 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-student-500" />
                    <span className="font-semibold">{session.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-student-500" />
                    <span>{session.time}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      session.status === 'confirmed'
                        ? 'bg-student-500/10 text-student-500'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Book New Session CTA */}
        <Link
          to="/student/book-session"
          className="
            inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 rounded-2xl
            bg-student-500 text-white text-[14px] font-bold
            hover:bg-student-600 hover:shadow-[0_8px_20px_rgba(0,86,214,0.3)]
            transition-all duration-200 active:scale-[0.98] shadow-md
          "
        >
          <Calendar className="w-4 h-4" />
          <span>Book a New Session</span>
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         CAREER GUIDANCE PROGRESS
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.05] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-student-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">
              Career Guidance Progress
            </h2>
          </div>
          <span className="text-xs font-bold text-student-500 bg-student-500/10 px-3 py-1 rounded-full">
            {completedCount} of {guidanceMilestones.length} Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2.5 rounded-full bg-[#FAF9F6] border border-[#0B0F19]/[0.04] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-student-500 to-student-400 transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[12px] text-[#0B0F19]/45 font-medium">
            {progressPercent}% of your guidance milestones completed
          </p>
        </div>

        {/* Milestone Checklist */}
        <div className="flex flex-col gap-2.5 max-w-xl">
          {guidanceMilestones.map((milestone) => (
            <div
              key={milestone.label}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                milestone.completed
                  ? 'text-[#0B0F19]/70 bg-student-500/[0.06]'
                  : 'text-[#0B0F19]/40 bg-[#FAF9F6]'
              }`}
            >
              {milestone.completed ? (
                <CheckCircle2 className="w-4 h-4 text-student-500 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-[#0B0F19]/15 shrink-0" />
              )}
              <span className={milestone.completed ? 'line-through decoration-student-500/30' : ''}>
                {milestone.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         FEATURED MENTORS
         ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-student-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">
              Featured Mentors
            </h2>
          </div>
          <Link
            to="/student/mentors"
            className="text-xs font-bold text-student-500 hover:text-student-600 transition-colors"
          >
            Browse All Mentors →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="
                bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.05]
                shadow-[0_2px_16px_rgba(0,0,0,0.02)]
                hover:border-student-500/25 hover:-translate-y-0.5
                hover:shadow-[0_12px_32px_rgba(0,86,214,0.1)]
                transition-all duration-300 group space-y-4
              "
            >
              {/* Mentor Header */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-student-500 text-white flex items-center justify-center text-sm font-bold shadow-[0_2px_8px_rgba(0,86,214,0.25)]">
                    {mentor.initials}
                  </div>
                  {mentor.available && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10b981] ring-2 ring-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[#0B0F19] truncate">{mentor.name}</p>
                  <p className="text-[11px] text-[#0B0F19]/45 truncate">{mentor.title}</p>
                  <p className="text-[11px] text-student-500 font-semibold">{mentor.company}</p>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5">
                {mentor.specialties.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-0.5 rounded-lg bg-[#FAF9F6] border border-[#0B0F19]/[0.04] text-[11px] font-semibold text-[#0B0F19]/60"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between text-[11px] text-[#0B0F19]/50 pt-2 border-t border-[#0B0F19]/[0.04]">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-[#0B0F19]/70">{mentor.rating}</span>
                </div>
                <span>{mentor.sessionsCompleted} sessions</span>
                <span
                  className={`font-bold ${mentor.available ? 'text-[#10b981]' : 'text-[#0B0F19]/30'}`}
                >
                  {mentor.available ? 'Available' : 'Busy'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         RECOMMENDED RESOURCES
         ═══════════════════════════════════════════════════════════════ */}
      <div className="p-5 rounded-3xl bg-white border border-[#0B0F19]/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#0B0F19]/55">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-student-500/10 flex items-center justify-center text-student-500">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span>
            3 new career resources added based on your mentorship goals and consultation history.
          </span>
        </div>

        <Link
          to="/student/mentors"
          className="font-bold text-student-500 hover:text-student-600 transition-colors whitespace-nowrap"
        >
          Explore Resources →
        </Link>
      </div>
    </div>
  );
}
