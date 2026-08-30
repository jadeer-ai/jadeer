import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useCandidateJourney } from '@/contexts/CandidateJourneyContext';
import { useInterviewSchedule, type InterviewType } from '@/contexts/InterviewScheduleContext';
import { AdminApiService, type AdminConsultationRecord } from '@/services/adminService';
import {
  Check,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  Clock,
  Mic,
  ShieldCheck,
  FileText,
  UserCheck,
  CalendarCheck2,
  Video,
  Bot,
  Users,
  Building2,
  ExternalLink,
  Calendar,
  Star,
  Zap,
  Briefcase,
  ChevronRight,
  Code2,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

/* ── Interview type display helpers ────────────────────────────────────── */

const interviewTypeLabels: Record<InterviewType, string> = {
  ai: 'AI Interview',
  human: 'Human Interview',
  panel: 'Panel Review',
};

const interviewTypeIcons: Record<InterviewType, typeof Bot> = {
  ai: Bot,
  human: UserCheck,
  panel: Users,
};

const interviewTypeColors: Record<InterviewType, string> = {
  ai: 'bg-[#f3e8ff] text-[#7c3aed] border-[#e9d5ff]',
  human: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  panel: 'bg-[#E6EEFB] text-[#0056D6] border-[#BFCFF2]',
};

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CENTRALIZED UNIFIED PROFILE DASHBOARD
   Single User Entity connecting:
   - 1-to-1 Mentor Consultations
   - Technical AI Assessments & Internship Validation Pipeline
   - Live Telemetry & Evidence Portfolio
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── 5-Phase Validation Pipeline ────────────────────────────────────────── */

interface JourneyPhase {
  id: string;
  step: string;
  name: string;
  desc: string;
  status: 'completed' | 'current' | 'upcoming';
}

const journeyPhases: JourneyPhase[] = [
  {
    id: 'onboarding',
    step: '01',
    name: 'Profile Onboarding',
    desc: 'Identity & Track Binding',
    status: 'completed',
  },
  {
    id: 'ai-assessment',
    step: '02',
    name: 'AI Assessment',
    desc: 'Adaptive Technical Evaluation',
    status: 'current',
  },
  {
    id: 'human-calibration',
    step: '03',
    name: 'Human Calibration',
    desc: 'Mentor Verification Pod',
    status: 'upcoming',
  },
  {
    id: 'evidence-dossier',
    step: '04',
    name: 'Evidence Dossier',
    desc: 'Verified Skills Portfolio',
    status: 'upcoming',
  },
  {
    id: 'job-matching',
    step: '05',
    name: 'Internship Matching',
    desc: 'Evidence-Backed Hiring',
    status: 'upcoming',
  },
];

export default function DashboardPage() {
  const { isStudent, userRole, lockedTrack } = useUserRole();
  const { isOnboarded } = useCandidateJourney();
  const { profile: userProfile } = useUserProfile();
  const navigate = useNavigate();
  const { getInterviewsForCandidate } = useInterviewSchedule();

  // Extract full Clerk user data
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const clerkName = clerkUser?.fullName || clerkUser?.firstName || clerkUser?.username;
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress;
  const clerkImage = clerkUser?.imageUrl;

  // Load unified user data from AdminApiService
  const unifiedData = useMemo(() => {
    return AdminApiService.getUnifiedCandidateProfile('usr-cnd-001');
  }, []);

  // Candidate interviews scheduled by employers
  const candidateInterviews = getInterviewsForCandidate('JAD-8492')
    .filter((i) => i.status === 'scheduled')
    .sort((a, b) => a.date.localeCompare(b.date));

  const consultations = unifiedData.consultations;
  const user = unifiedData.user;
  const profile = user.studentProfile;
  const activeTrack = userProfile.track || lockedTrack || (clerkUser?.publicMetadata?.track as string) || profile?.softwareTrack || 'Backend Development';
  const effectiveName = userProfile.fullName || clerkName || profile?.fullName || 'Ahmad Al-Hassan';
  const effectiveEmail = userProfile.email || clerkEmail || user?.email || 'ahmad.hassan@example.com';
  const effectiveImage = userProfile.imageUrl || clerkImage;
  const effectiveUniversity = userProfile.university || (clerkUser?.publicMetadata?.university as string) || profile?.university || 'KFUPM';

  // Auto-redirect if user signed up via social login and lacks required profile fields
  useEffect(() => {
    if (!isClerkLoaded) return;

    if (clerkUser) {
      const hasRole = Boolean(userProfile.role || userRole || clerkUser.publicMetadata?.role);
      const hasTrack = Boolean(userProfile.track || lockedTrack || clerkUser.publicMetadata?.track);
      const hasUniversity = Boolean(userProfile.university || localStorage.getItem('jadeer-user-university') || clerkUser.publicMetadata?.university);
      const isComplete = isOnboarded || (hasRole && hasTrack && hasUniversity);

      if (!isComplete && !localStorage.getItem('jadeer-graduate-onboarded')) {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isClerkLoaded, clerkUser, userProfile, userRole, lockedTrack, isOnboarded, navigate]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10 animate-[fade-in_0.4s_ease] py-2 sm:py-6">

      {/* ═══════════════════════════════════════════════════════════════
         1. UNIFIED IDENTITY & ENTITY HEADER (SINGLE USER ENTITY)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#0B0F19]/50">
              <span className="px-2.5 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] font-bold">
                {activeTrack}
              </span>
              <span>•</span>
              <span className="font-mono text-[#0B0F19]/60">User_ID: {clerkUser?.id || user.id}</span>
              <span>•</span>
              <span className="font-mono text-[#0B0F19]/60">Candidate_ID: {profile?.id || 'stu-001'}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Single Unified Entity Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              {effectiveImage ? (
                <img
                  src={effectiveImage}
                  alt={effectiveName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#6E8F75]/20 shadow-sm"
                />
              ) : null}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
                  Welcome back, <span className="text-[#6E8F75]">{effectiveName}</span>
                </h1>
                {effectiveEmail && (
                  <p className="text-xs text-[#0B0F19]/40 font-mono mt-0.5">{effectiveEmail}</p>
                )}
              </div>
            </div>

            <p className="text-[14px] sm:text-[15px] text-[#0B0F19]/60 max-w-2xl leading-relaxed">
              Unified Portal: Seamlessly manage your 1-on-1 mentor consultations, technical validation telemetry, and internship matching pipeline without data fragmentation.
            </p>
          </div>

          {/* Quick Profile Summary Badge */}
          <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] shrink-0">
            <div className="text-left sm:text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45">Academic Institution</p>
              <p className="text-xs font-bold text-[#0B0F19] truncate max-w-[200px]">
                {effectiveUniversity}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-student-600 bg-student-500/10 px-2.5 py-0.5 rounded-full">
                Track Locked • Class of {profile?.graduationYear || 2025}
              </span>
            </div>
          </div>
        </div>

        {/* ── Top Metric Ribbon ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#0B0F19]/[0.05]">
          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45">Validation Stage</p>
            <p className="text-base font-extrabold text-[#0B0F19] mt-0.5">Phase 2: AI Interview</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45">Consultations</p>
            <p className="text-base font-extrabold text-student-600 mt-0.5">{consultations.length} Active Bookings</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45">Telemetry Score</p>
            <p className="text-base font-extrabold text-emerald-600 mt-0.5">88% Live Rating</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45">Internship Pipeline</p>
            <p className="text-base font-extrabold text-employer-600 mt-0.5">3 Matches Ready</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         2. VALIDATION PIPELINE PROGRESS (5-PHASE STEPPER)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.05] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#6E8F75]" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">
                Internship & Engineering Validation Pipeline
              </h2>
              <p className="text-[13px] font-bold text-[#0B0F19]">Continuous End-to-End Competence Tracking</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-3 py-1 rounded-full">
            Phase 2 of 5 Active
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2 relative">
          {journeyPhases.map((phase, idx) => {
            const isCompleted = phase.status === 'completed';
            const isCurrent = phase.status === 'current';

            const phaseRouteMap: Record<string, string> = {
              'profile-onboarding': '/profile',
              'ai-assessment': '/candidates/ai-interview',
              'human-calibration': '/candidates/human-interview',
              'evidence-dossier': '/candidates/portfolio',
              'job-matching': '/candidates/jobs',
            };
            const targetRoute = phaseRouteMap[phase.id] || '/candidates/human-interview';

            return (
              <Link
                key={phase.id}
                to={targetRoute}
                className="flex sm:flex-col items-start gap-4 sm:gap-3 relative group hover:opacity-90 transition-opacity"
              >
                {/* Horizontal connector line on desktop */}
                {idx < journeyPhases.length - 1 && (
                  <div
                    className={`
                      hidden sm:block absolute top-4 left-[28px] right-[-14px] h-[2px] z-0
                      ${isCompleted ? 'bg-[#6E8F75]' : 'bg-[#0B0F19]/[0.06]'}
                    `}
                  />
                )}

                {/* Step indicator icon/circle */}
                <div className="relative z-10 shrink-0">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-[#6E8F75] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(110,143,117,0.3)] group-hover:scale-105 transition-transform">
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#6E8F75] flex items-center justify-center shadow-[0_0_12px_rgba(110,143,117,0.25)] group-hover:scale-105 transition-transform">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#6E8F75] animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-[#0B0F19]/30 flex items-center justify-center text-xs font-bold group-hover:border-[#6E8F75]/40 transition-colors">
                      {phase.step}
                    </div>
                  )}
                </div>

                {/* Step label info */}
                <div className="space-y-0.5 min-w-0">
                  <p
                    className={`
                      text-[13px] font-bold leading-tight group-hover:text-[#6E8F75] transition-colors
                      ${isCurrent ? 'text-[#0B0F19]' : isCompleted ? 'text-[#0B0F19]/80' : 'text-[#0B0F19]/35'}
                    `}
                  >
                    {phase.name}
                  </p>
                  <p className="text-[11px] text-[#0B0F19]/45 leading-snug">
                    {phase.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         3. SEAMLESS BRIDGE FLOW: DIRECT 'START INTERNSHIP VALIDATION' CTA
         ═══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B0F19] via-[#141C2C] to-[#1E2C42] p-7 sm:p-9 text-white shadow-[0_8px_32px_rgba(11,15,25,0.18)] border border-white/[0.08]">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#6E8F75]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-student-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Seamless Bridge • 1-Click Transition
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to convert consultation insights into verified code proof?
            </h2>
            <p className="text-[14px] sm:text-[15px] text-white/70 leading-relaxed">
              Transition seamlessly from your mentor session into the AI Technical Assessment. Your candidate profile and track are permanently synchronized—no re-registration or redundant forms required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Link
              to="/candidates/ai-interview"
              className="
                inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl
                bg-[#6E8F75] text-white text-[15px] font-bold
                hover:bg-[#5d7d64] hover:shadow-[0_10px_28px_rgba(110,143,117,0.45)]
                transition-all duration-200 active:scale-[0.98] shadow-lg
              "
            >
              <span>Start Internship Validation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/consultations/book"
              className="
                inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl
                bg-white/10 text-white/90 text-xs font-bold border border-white/15
                hover:bg-white/15 hover:text-white transition-colors
              "
            >
              <Calendar className="w-3.5 h-3.5 text-student-400" />
              <span>Book Follow-up Consultation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         4. TWO DISTINCT WIDGET AREAS ON THE SAME SCREEN
         - Left: 'My Consultations & Mentorship Desk'
         - Right: 'Validation Pipeline & Internship Telemetry'
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── LEFT WIDGET: MY CONSULTATIONS DESK (lg:col-span-6) ── */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5 flex flex-col justify-between h-full">
            <div className="space-y-5">
              {/* Widget Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#0B0F19]/[0.05]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-student-500/10 text-student-500 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B0F19]">My Consultations</h3>
                    <p className="text-[11px] text-[#0B0F19]/45 font-medium">1-to-1 Industry Guidance Sessions</p>
                  </div>
                </div>

                <Link
                  to="/consultations"
                  className="text-xs font-bold text-student-500 hover:text-student-600 transition-colors"
                >
                  View All ({consultations.length}) →
                </Link>
              </div>

              {/* Consultation Cards */}
              {consultations.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#0B0F19]/40">
                  No consultation sessions booked. Connect with a mentor to get started.
                </div>
              ) : (
                <div className="space-y-3">
                  {consultations.slice(0, 3).map((session) => {
                    const isConfirmed = session.status === 'SCHEDULED' || session.status === 'IN_PROGRESS';
                    const isCompleted = session.status === 'COMPLETED';

                    return (
                      <div
                        key={session.id}
                        className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] hover:border-[#6E8F75]/20 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-[#6E8F75] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-[0_2px_8px_rgba(110,143,117,0.25)]">
                              {session.mentorName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13.5px] font-bold text-[#0B0F19] truncate">{session.mentorName}</p>
                              <p className="text-[11px] text-[#0B0F19]/50 truncate">
                                {session.mentorTitle} • <span className="font-semibold text-[#6E8F75]">{session.mentorCompany}</span>
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : isConfirmed
                                ? 'bg-[#6E8F75]/10 text-[#6E8F75] border border-[#6E8F75]/20'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {session.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Topic & Timing */}
                        <div className="px-3 py-2 rounded-xl bg-white border border-[#0B0F19]/[0.04] space-y-1">
                          <p className="text-[12px] font-semibold text-[#0B0F19]">{session.topicTitle}</p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#0B0F19]/50">
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3 text-[#6E8F75]" />
                              {new Date(session.scheduledAt).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            <span>•</span>
                            <span>{session.durationMinutes} mins</span>
                            {session.meetingLink && (
                              <>
                                <span>•</span>
                                <a
                                  href={session.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-bold text-[#6E8F75] hover:text-[#587a60]"
                                >
                                  <Video className="w-3 h-3" />
                                  Join Room
                                </a>
                              </>
                            )}
                          </div>
                        </div>

                        {session.notes && (
                          <p className="text-[11px] text-[#0B0F19]/45 italic line-clamp-1">
                            <span className="font-bold not-italic text-[#0B0F19]/55">Prep:</span> {session.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Book Session CTA */}
            <div className="pt-3 border-t border-[#0B0F19]/[0.05]">
              <Link
                to="/consultations"
                className="
                  flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl
                  bg-[#6E8F75] text-white text-[13px] font-bold
                  hover:bg-[#587a60] hover:shadow-[0_6px_20px_rgba(110,143,117,0.25)]
                  transition-all active:scale-[0.99]
                "
              >
                <Calendar className="w-4 h-4" />
                <span>+ Book New Mentor Consultation</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT WIDGET: VALIDATION PIPELINE & TELEMETRY (lg:col-span-6) ── */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5 flex flex-col justify-between h-full">
            <div className="space-y-5">
              {/* Widget Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#0B0F19]/[0.05]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#6E8F75]/15 text-[#6E8F75] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B0F19]">Validation Pipeline & Telemetry</h3>
                    <p className="text-[11px] text-[#0B0F19]/45 font-medium">Internship Assessment & Skills Evidence</p>
                  </div>
                </div>

                <Link
                  to="/candidates/portfolio"
                  className="text-xs font-bold text-[#6E8F75] hover:text-[#5d7d64] transition-colors"
                >
                  Evidence Portfolio →
                </Link>
              </div>

              {/* Assessment Readiness Card */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45">
                    Target Technical Assessment
                  </span>
                  <span className="text-[11px] font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-0.5 rounded-full">
                    Adaptive C++ & Systems
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[14px] font-bold text-[#0B0F19]">
                    C++20 Object-Oriented Design & Memory Layout
                  </h4>
                  <p className="text-[12px] text-[#0B0F19]/55 leading-relaxed">
                    Evaluates polymorphic dispatch, RAII, exception safety, and cache-friendly data structures to unlock verified internship badges.
                  </p>
                </div>

                {/* Capability Dimensions Bar */}
                <div className="space-y-2 pt-2 border-t border-[#0B0F19]/[0.05]">
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="text-[#0B0F19]/60">System Design & Memory Guarantees</span>
                    <span className="font-bold text-[#0B0F19]">92%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAF9F6] border border-[#0B0F19]/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-[#6E8F75]" style={{ width: '92%' }} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-medium pt-1">
                    <span className="text-[#0B0F19]/60">Algorithmic Efficiency & Concurrency</span>
                    <span className="font-bold text-[#0B0F19]">85%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAF9F6] border border-[#0B0F19]/[0.06] overflow-hidden">
                    <div className="h-full rounded-full bg-student-500" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              {/* Verified Badges & Proof Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45 block">
                  Synchronized Telemetry Badges:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['RAII Memory Safe', 'vtable Layout Verified', 'Async IO Ready', 'PostgreSQL Sharding'].map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#0B0F19]/[0.06] text-[11px] font-bold text-[#0B0F19]/70 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#6E8F75]" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Validation Actions */}
            <div className="pt-3 border-t border-[#0B0F19]/[0.05] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                to="/candidates/ai-interview"
                className="
                  flex items-center justify-center gap-2 px-4 py-3 rounded-2xl
                  bg-[#6E8F75] text-white text-[13px] font-bold
                  hover:bg-[#587a60] hover:shadow-[0_6px_20px_rgba(110,143,117,0.3)]
                  transition-all active:scale-[0.99]
                "
              >
                <span>AI Interview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/candidates/human-interview"
                className="
                  flex items-center justify-center gap-2 px-4 py-3 rounded-2xl
                  bg-[#FAF9F6] text-[#0B0F19] text-[13px] font-bold border border-[#0B0F19]/[0.08]
                  hover:bg-[#6E8F75]/10 hover:border-[#6E8F75]/30 hover:text-[#6E8F75]
                  transition-all active:scale-[0.99]
                "
              >
                <UserCheck className="w-4 h-4 text-[#6E8F75]" />
                <span>Human Interview</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         5. UPCOMING INTERVIEWS (SYNCED FROM EMPLOYER PORTAL)
         ═══════════════════════════════════════════════════════════════ */}
      {candidateInterviews.length > 0 && (
        <div className="bg-white rounded-3xl border border-employer-200/40 shadow-[0_2px_16px_rgba(217,119,6,0.04)] overflow-hidden">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#0B0F19]/[0.04]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-employer-50 text-employer-500 flex items-center justify-center">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-[14px] font-bold text-[#0B0F19]">Employer & Internship Interviews</h2>
                <p className="text-[11px] text-[#0B0F19]/40 font-medium">Synchronized directly through Jadeer</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-employer-600 bg-employer-50 border border-employer-200/60 px-2.5 py-0.5 rounded-full">
              {candidateInterviews.length} upcoming
            </span>
          </div>

          <div className="divide-y divide-[#0B0F19]/[0.04]">
            {candidateInterviews.map((interview) => {
              const TypeIcon = interviewTypeIcons[interview.type];
              return (
                <div
                  key={interview.id}
                  className="px-6 sm:px-8 py-5 hover:bg-employer-50/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-employer-500 text-white flex items-center justify-center text-[13px] font-bold shrink-0 shadow-[0_2px_8px_rgba(217,119,6,0.2)]">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h3 className="text-[14px] font-bold text-[#0B0F19]">{interview.company}</h3>
                        <p className="text-[13px] text-[#0B0F19]/55 font-medium">{interview.role}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="flex items-center gap-1 text-[12px] font-bold text-[#0B0F19]/70">
                            <CalendarCheck2 className="w-3.5 h-3.5 text-employer-500" />
                            {interview.date}
                          </span>
                          <span className="flex items-center gap-1 text-[12px] font-bold text-[#0B0F19]/70">
                            <Clock className="w-3.5 h-3.5 text-employer-500" />
                            {interview.timeSlot}
                          </span>
                          <span className="text-[11px] text-[#0B0F19]/35 font-medium">
                            {interview.timezone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${interviewTypeColors[interview.type]}`}>
                        <TypeIcon className="w-3 h-3" />
                        {interviewTypeLabels[interview.type]}
                      </span>
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] font-bold text-employer-500 hover:text-employer-600 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Meeting
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
