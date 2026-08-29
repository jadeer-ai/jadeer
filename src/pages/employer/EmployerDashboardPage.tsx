import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import {
  ClipboardList,
  Users,
  User,
  CalendarCheck2,
  FilePlus2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Activity,
  Eye,
  Briefcase,
  CheckCircle2,
  Clock,
  X,
  Video,
  Bot,
  UserCheck,
  Calendar,
  ExternalLink,
  XCircle,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useInterviewSchedule, type InterviewType } from '@/contexts/InterviewScheduleContext';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — EMPLOYER DASHBOARD
   Signature Brand Identity: Clean Cream, Sage Green (#6E8F75), and Navy (#0B0F19)
   ═══════════════════════════════════════════════════════════════════════════ */

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: typeof ClipboardList;
  color: string;
  bgColor: string;
}

const metrics: MetricCard[] = [
  {
    title: 'Active Listings',
    value: '3',
    change: '+1 this week',
    trend: 'up',
    icon: ClipboardList,
    color: 'text-[#6E8F75]',
    bgColor: 'bg-[#6E8F75]/10',
  },
  {
    title: 'Candidates in Pipeline',
    value: '47',
    change: '+12 new applicants',
    trend: 'up',
    icon: Users,
    color: 'text-[#0056D6]',
    bgColor: 'bg-[#E6EEFB]',
  },
  {
    title: 'Interviews Scheduled',
    value: '8',
    change: '3 this week',
    trend: 'neutral',
    icon: CalendarCheck2,
    color: 'text-success-600',
    bgColor: 'bg-success-50',
  },
  {
    title: 'Avg. Time to Fill',
    value: '14d',
    change: '-3 days vs. avg',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-[#7c3aed]',
    bgColor: 'bg-[#f3e8ff]',
  },
];

interface RecentListing {
  id: string;
  title: string;
  department: string;
  status: 'Active' | 'Draft' | 'Paused';
  applicants: number;
  daysAgo: number;
}

const recentListings: RecentListing[] = [
  { id: '1', title: 'Senior Backend Engineer', department: 'Engineering', status: 'Active', applicants: 23, daysAgo: 2 },
  { id: '2', title: 'Product Designer', department: 'Design', status: 'Active', applicants: 18, daysAgo: 5 },
  { id: '3', title: 'Data Analyst', department: 'Analytics', status: 'Draft', applicants: 0, daysAgo: 0 },
];

interface RecentCandidate {
  candidateId: string;
  initials: string;
  name: string;
  role: string;
  matchScore: number;
  stage: string;
}

const recentCandidates: RecentCandidate[] = [
  { candidateId: 'JAD-8492', initials: 'AH', name: 'Ahmed Hassan', role: 'Senior Backend Engineer', matchScore: 96, stage: 'AI Interview' },
  { candidateId: 'JAD-3017', initials: 'SF', name: 'Sara Fahad', role: 'Product Designer', matchScore: 92, stage: 'Portfolio Review' },
  { candidateId: 'JAD-5541', initials: 'MK', name: 'Mohammed Khalid', role: 'Senior Backend Engineer', matchScore: 89, stage: 'Applied' },
  { candidateId: 'JAD-7728', initials: 'NR', name: 'Nora Rashid', role: 'Data Analyst', matchScore: 88, stage: 'Shortlisted' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-success-50 text-success-700 border-success-200',
  Draft: 'bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]',
  Paused: 'bg-warning-50 text-warning-700 border-warning-200',
};

/* ── Schedule Interview Modal Data ─────────────────────────────────────── */

const availableDates = [
  { date: '2026-09-01', label: 'Mon, Sep 1' },
  { date: '2026-09-02', label: 'Tue, Sep 2' },
  { date: '2026-09-03', label: 'Wed, Sep 3' },
  { date: '2026-09-04', label: 'Thu, Sep 4' },
  { date: '2026-09-07', label: 'Mon, Sep 7' },
  { date: '2026-09-08', label: 'Tue, Sep 8' },
  { date: '2026-09-09', label: 'Wed, Sep 9' },
  { date: '2026-09-10', label: 'Thu, Sep 10' },
];

const availableTimeSlots = [
  '09:00 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:00 PM', '03:30 PM', '05:00 PM',
];

const interviewTypes: { value: InterviewType; label: string; icon: typeof Bot }[] = [
  { value: 'ai', label: 'AI Interview', icon: Bot },
  { value: 'human', label: 'Human Interview', icon: UserCheck },
  { value: 'panel', label: 'Panel Review', icon: Users },
];

const interviewTypeLabels: Record<InterviewType, string> = {
  ai: 'AI Interview',
  human: 'Human Interview',
  panel: 'Panel Review',
};

const interviewTypeColors: Record<InterviewType, string> = {
  ai: 'bg-[#f3e8ff] text-[#7c3aed] border-[#e9d5ff]',
  human: 'bg-success-50 text-success-700 border-success-200',
  panel: 'bg-[#E6EEFB] text-[#0056D6] border-[#BFCFF2]',
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function EmployerDashboardPage() {
  const { companyProfile } = useCompanyProfile();
  const { scheduleInterview, getUpcomingInterviews, cancelInterview } = useInterviewSchedule();

  /* ── Schedule Modal State ─────────────────────────────────────────── */
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<RecentCandidate | null>(null);
  const [scheduleDate, setScheduleDate] = useState(availableDates[0].date);
  const [scheduleTime, setScheduleTime] = useState(availableTimeSlots[2]);
  const [scheduleType, setScheduleType] = useState<InterviewType>('human');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [justScheduled, setJustScheduled] = useState(false);

  const upcomingInterviews = getUpcomingInterviews();

  const openScheduleModal = (candidate: RecentCandidate) => {
    setScheduleTarget(candidate);
    setScheduleDate(availableDates[0].date);
    setScheduleTime(availableTimeSlots[2]);
    setScheduleType('human');
    setScheduleNotes('');
    setJustScheduled(false);
    setShowScheduleModal(true);
  };

  const handleConfirmSchedule = () => {
    if (!scheduleTarget) return;

    scheduleInterview({
      candidateId: scheduleTarget.candidateId,
      candidateName: scheduleTarget.name,
      candidateInitials: scheduleTarget.initials,
      role: scheduleTarget.role,
      company: companyProfile.companyName || 'Jadeer Inc.',
      date: scheduleDate,
      timeSlot: scheduleTime,
      timezone: 'Asia/Riyadh (GMT+3)',
      meetingLink: `https://meet.jadeer.io/${scheduleTarget.candidateId.toLowerCase()}-${Date.now().toString(36)}`,
      type: scheduleType,
      scheduledBy: 'employer',
      notes: scheduleNotes || undefined,
    });

    setJustScheduled(true);
  };

  return (
    <div className="space-y-8 pb-8 animate-[fade-in_0.3s_ease]">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#6E8F75] text-white flex items-center justify-center shadow-lg shadow-[#6E8F75]/25">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E8F75] bg-[#6E8F75]/10 border border-[#6E8F75]/20 px-2.5 py-0.5 rounded-full">
              Employer Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
            Welcome back, <span className="text-[#6E8F75]">{companyProfile.companyName}</span>
          </h1>
          <p className="mt-1 text-[14px] text-[#0B0F19]/50 font-medium max-w-xl">
            {companyProfile.location} · {companyProfile.industry} · {companyProfile.companySize}
          </p>
        </div>

        <Link
          to="/employer/post-job"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-[13px] font-bold shadow-[0_4px_16px_rgba(110,143,117,0.25)] hover:bg-[#5d7d64] hover:shadow-[0_6px_24px_rgba(110,143,117,0.35)] hover:translate-y-[-1px] transition-all duration-200"
        >
          <FilePlus2 className="w-4 h-4" />
          Post a New Job
          <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ── Metrics Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.title}
              className="group relative bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-5 hover:border-[#6E8F75]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-250 cursor-default"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${m.bgColor} ${m.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-success-600 bg-success-50 px-2 py-0.5 rounded-full">
                  {m.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-extrabold text-[#0B0F19] tracking-tight">
                {m.value}
              </p>
              <p className="mt-1 text-[13px] text-[#0B0F19]/45 font-medium">{m.title}</p>
            </div>
          );
        })}
      </div>

      {/* ── Main Grid: Listings + Top Candidates ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Listings (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#0B0F19]/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#0B0F19]/[0.04]">
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4.5 h-4.5 text-[#6E8F75]" />
              <h2 className="text-[15px] font-bold text-[#0B0F19]">Recent Job Listings</h2>
            </div>
            <Link
              to="/employer/listings"
              className="text-[12px] font-semibold text-[#6E8F75] hover:text-[#587a60] flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[#0B0F19]/[0.04]">
            {recentListings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#0B0F19]/[0.01] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center shrink-0">
                    <ClipboardList className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-bold text-[#0B0F19] truncate">{listing.title}</h3>
                    <p className="text-[12px] text-[#0B0F19]/40 font-medium">{listing.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-[#0B0F19]/50 font-medium">
                    <Eye className="w-3.5 h-3.5" />
                    {listing.applicants} applicants
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusColors[listing.status]}`}>
                    {listing.status}
                  </span>
                  {listing.daysAgo > 0 && (
                    <span className="hidden md:inline text-[11px] text-[#0B0F19]/30 font-medium">
                      {listing.daysAgo}d ago
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Candidates (1/3 width) — with Schedule Interview action */}
        <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#0B0F19]/[0.04]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4.5 h-4.5 text-[#6E8F75]" />
              <h2 className="text-[15px] font-bold text-[#0B0F19]">Top Verified Candidates</h2>
            </div>
          </div>

          <div className="divide-y divide-[#0B0F19]/[0.04]">
            {recentCandidates.map((c) => (
              <div
                key={c.candidateId}
                className="group px-6 py-3.5 hover:bg-[#FAF9F6] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Link
                    to={`/candidates/profiles?id=${c.candidateId}&name=${encodeURIComponent(c.name)}&from=employer`}
                    className="w-9 h-9 rounded-full bg-[#6E8F75]/15 text-[#6E8F75] flex items-center justify-center text-[12px] font-bold shrink-0 hover:scale-105 transition-transform"
                    title="View Evidence Dossier"
                  >
                    {c.initials}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/candidates/profiles?id=${c.candidateId}&name=${encodeURIComponent(c.name)}&from=employer`}
                      className="text-[13px] font-bold text-[#0B0F19] hover:text-[#6E8F75] transition-colors truncate block"
                    >
                      {c.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-[#0B0F19]/40 font-medium truncate">{c.role}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[13px] font-extrabold text-[#6E8F75]">{c.matchScore}%</span>
                    <span className="flex items-center gap-1 text-[10px] text-[#0B0F19]/40 font-medium">
                      {c.stage === 'Applied' ? <Clock className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                      {c.stage}
                    </span>
                  </div>
                </div>

                {/* Quick Actions (View Profile Dossier & Schedule Interview) */}
                <div className="mt-2.5 flex items-center gap-2">
                  <Link
                    to={`/candidates/profiles?id=${c.candidateId}&name=${encodeURIComponent(c.name)}&from=employer`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#0B0F19]/[0.08] text-[#0B0F19]/70 text-[11px] font-bold hover:bg-[#FAF9F6] hover:text-[#0B0F19] transition-all"
                  >
                    <User className="w-3 h-3 text-[#6E8F75]" />
                    View Profile Dossier
                  </Link>
                  <button
                    onClick={() => openScheduleModal(c)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6E8F75] text-white text-[11px] font-bold hover:bg-[#5d7d64] transition-all shadow-xs"
                  >
                    <Calendar className="w-3 h-3" />
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scheduled Interviews (from shared context) ────────────────── */}
      {upcomingInterviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#0B0F19]/[0.04]">
            <div className="flex items-center gap-2.5">
              <CalendarCheck2 className="w-4.5 h-4.5 text-success-600" />
              <h2 className="text-[15px] font-bold text-[#0B0F19]">Scheduled Interviews</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-success-600 bg-success-50 border border-success-200 px-2 py-0.5 rounded-full">
                {upcomingInterviews.length} upcoming
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#0B0F19]/35">
              Synced with candidate portals
            </span>
          </div>

          <div className="divide-y divide-[#0B0F19]/[0.04]">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#0B0F19]/[0.01] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#6E8F75]/15 text-[#6E8F75] flex items-center justify-center text-[12px] font-bold shrink-0">
                    {interview.candidateInitials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-bold text-[#0B0F19] truncate">{interview.candidateName}</h3>
                    <p className="text-[12px] text-[#0B0F19]/40 font-medium">{interview.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex flex-col items-end gap-0.5">
                    <span className="text-[12px] font-bold text-[#0B0F19]/70">{interview.date}</span>
                    <span className="text-[11px] text-[#0B0F19]/40 font-medium">{interview.timeSlot}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${interviewTypeColors[interview.type]}`}>
                    {interviewTypeLabels[interview.type]}
                  </span>
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-[#6E8F75] hover:text-[#587a60] transition-colors"
                  >
                    <Video className="w-3 h-3" /> Link
                  </a>
                  <button
                    onClick={() => cancelInterview(interview.id)}
                    className="p-1.5 rounded-lg text-[#0B0F19]/20 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                    title="Cancel interview"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         SCHEDULE INTERVIEW MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {showScheduleModal && scheduleTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowScheduleModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.15)] border border-[#0B0F19]/[0.08] w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[fade-in_0.2s_ease]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#0B0F19]/[0.06]">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#0B0F19]">Schedule Interview</h2>
                <p className="text-[13px] text-[#0B0F19]/45 font-medium mt-0.5">
                  with <span className="font-bold text-[#0B0F19]">{scheduleTarget.name}</span> for {scheduleTarget.role}
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 rounded-xl hover:bg-[#0B0F19]/[0.04] text-[#0B0F19]/30 hover:text-[#0B0F19] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success State */}
            {justScheduled ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#6E8F75]/15 text-[#6E8F75] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-[18px] font-extrabold text-[#0B0F19]">Interview Scheduled!</h3>
                <p className="text-[14px] text-[#0B0F19]/50 font-medium max-w-xs mx-auto">
                  <span className="font-bold text-[#0B0F19]">{scheduleTarget.name}</span> will see this appointment in their Jadeer dashboard automatically.
                </p>
                <div className="bg-[#f9fafb] rounded-xl border border-[#0B0F19]/[0.04] p-4 text-left space-y-2">
                  <div className="flex items-center gap-2 text-[13px]">
                    <Calendar className="w-4 h-4 text-[#6E8F75]" />
                    <span className="font-bold text-[#0B0F19]">
                      {availableDates.find((d) => d.date === scheduleDate)?.label} at {scheduleTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <Video className="w-4 h-4 text-[#6E8F75]" />
                    <span className="text-[#0B0F19]/60 font-medium">Meeting link generated & shared</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#0B0F19] text-white text-[13px] font-bold hover:bg-[#1a2440] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Scheduling Form */
              <div className="p-6 space-y-5">
                {/* Candidate Info Card */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#6E8F75]/10 border border-[#6E8F75]/20">
                  <div className="w-11 h-11 rounded-full bg-[#6E8F75] text-white flex items-center justify-center text-[13px] font-bold shrink-0">
                    {scheduleTarget.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#0B0F19]">{scheduleTarget.name}</p>
                    <p className="text-[12px] text-[#0B0F19]/45 font-medium">{scheduleTarget.role} · Match: {scheduleTarget.matchScore}%</p>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-[13px] font-bold text-[#0B0F19]/70 mb-2">Date</label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableDates.map((d) => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setScheduleDate(d.date)}
                        className={`
                          px-2 py-2.5 rounded-xl text-center text-[11px] font-bold border transition-all duration-200
                          ${scheduleDate === d.date
                            ? 'bg-[#6E8F75] text-white border-[#6E8F75] shadow-[0_2px_12px_rgba(110,143,117,0.25)]'
                            : 'bg-white text-[#0B0F19]/60 border-[#0B0F19]/[0.08] hover:border-[#6E8F75]/40'}
                        `}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div>
                  <label className="block text-[13px] font-bold text-[#0B0F19]/70 mb-2">Time Slot</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTimeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setScheduleTime(slot)}
                        className={`
                          px-3.5 py-2 rounded-xl text-[12px] font-bold border transition-all duration-200
                          ${scheduleTime === slot
                            ? 'bg-[#6E8F75] text-white border-[#6E8F75] shadow-[0_2px_12px_rgba(110,143,117,0.25)]'
                            : 'bg-white text-[#0B0F19]/60 border-[#0B0F19]/[0.08] hover:border-[#6E8F75]/40'}
                        `}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interview Type */}
                <div>
                  <label className="block text-[13px] font-bold text-[#0B0F19]/70 mb-2">Interview Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {interviewTypes.map(({ value, label, icon: TypeIcon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setScheduleType(value)}
                        className={`
                          flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-[11px] font-bold border transition-all duration-200
                          ${scheduleType === value
                            ? 'bg-[#6E8F75] text-white border-[#6E8F75] shadow-[0_2px_12px_rgba(110,143,117,0.25)]'
                            : 'bg-white text-[#0B0F19]/60 border-[#0B0F19]/[0.08] hover:border-[#6E8F75]/40'}
                        `}
                      >
                        <TypeIcon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes (optional) */}
                <div>
                  <label className="block text-[13px] font-bold text-[#0B0F19]/70 mb-1.5">Notes (optional)</label>
                  <textarea
                    value={scheduleNotes}
                    onChange={(e) => setScheduleNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g., Focus on system design skills…"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-[13px] text-[#0B0F19] font-medium placeholder:text-[#0B0F19]/25 focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] resize-none transition-all"
                  />
                </div>

                {/* Auto-sync notice */}
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#6E8F75]/10 border border-[#6E8F75]/20">
                  <ExternalLink className="w-4 h-4 text-[#6E8F75] shrink-0 mt-0.5" />
                  <p className="text-[12px] text-[#0B0F19]/55 font-medium">
                    This interview will <span className="font-bold text-[#0B0F19]">automatically appear</span> in{' '}
                    <span className="font-bold text-[#0B0F19]">{scheduleTarget.name}'s</span> candidate portal dashboard and schedule.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-white text-[#0B0F19]/60 text-[13px] font-bold border border-[#0B0F19]/[0.08] hover:bg-[#f9fafb] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSchedule}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6E8F75] text-white text-[13px] font-bold shadow-[0_4px_16px_rgba(110,143,117,0.25)] hover:bg-[#5d7d64] hover:shadow-[0_6px_24px_rgba(110,143,117,0.35)] hover:translate-y-[-1px] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm & Schedule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
