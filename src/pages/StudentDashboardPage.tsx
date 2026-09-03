import { useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useCandidateJourney } from '@/contexts/CandidateJourneyContext';
import { AdminApiService } from '@/services/adminService';
import { useDashboardConsultations } from '@/hooks/useDashboardConsultations';
import { useDashboardHumanCalibration } from '@/hooks/useDashboardHumanCalibration';
import DashboardCalibrationCard from '@/components/dashboard/DashboardCalibrationCard';
import {
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle2,
  Video,
  ShieldCheck,
  Check,
  Zap,
  UserCheck,
  User,
  Briefcase,
  CalendarCheck2,
  Building2,
  ExternalLink,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — STUDENT UNIFIED DASHBOARD
   Unified Profile Architecture connecting:
   - 1-to-1 Mentor Consultations
   - Technical AI Assessments & Internship Validation Pipeline
   - Live Telemetry & Evidence Portfolio
   ═══════════════════════════════════════════════════════════════ */

/* ── 5-Phase Validation Pipeline ────────────────────────────────────────── */

interface JourneyPhase {
  id: string;
  step: string;
  name: string;
  desc: string;
  status: 'completed' | 'current' | 'upcoming';
}

export default function StudentDashboardPage() {
  const { userRole, lockedTrack } = useUserRole();
  const { isOnboarded } = useCandidateJourney();
  const { profile: userProfile } = useUserProfile();
  const navigate = useNavigate();

  // Extract full Clerk user data
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const clerkName = clerkUser?.fullName || clerkUser?.firstName || clerkUser?.username;
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress;
  const clerkImage = clerkUser?.imageUrl;

  const candidateUserId = clerkUser?.id || '';
  const { consultations, activeCount, totalCount } = useDashboardConsultations(candidateUserId);
  const calibration = useDashboardHumanCalibration(candidateUserId);

  // Load unified candidate profile from AdminApiService (bound to single User_ID)
  const unifiedData = useMemo(() => {
    return AdminApiService.getUnifiedCandidateProfile(candidateUserId);
  }, [candidateUserId]);

  const user = unifiedData.user;
  const profile = user.studentProfile;
  const activeTrack = userProfile.track || lockedTrack || (clerkUser?.publicMetadata?.track as string) || profile?.softwareTrack || 'Backend Development';
  const effectiveName = userProfile.fullName || clerkName || profile?.fullName || 'Ahmad';
  const effectiveEmail = userProfile.email || clerkEmail || user?.email || 'ahmad.student@example.com';
  const effectiveImage = userProfile.imageUrl || clerkImage;
  const effectiveUniversity = userProfile.university || (clerkUser?.publicMetadata?.university as string) || profile?.university || 'KFUPM';

  // Derived dynamic journey phases based on real Supabase calibration state
  const journeyPhases: JourneyPhase[] = useMemo(() => [
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
      desc: 'Adaptive Technical Interview',
      status: calibration.state === 'completed' || calibration.state === 'confirmed' || calibration.state === 'choose_time' ? 'completed' : 'current',
    },
    {
      id: 'human-calibration',
      step: '03',
      name: 'Human Calibration',
      desc: 'Mentor Verification Pod',
      status: calibration.state === 'completed' ? 'completed' : calibration.state === 'confirmed' || calibration.state === 'choose_time' ? 'current' : 'upcoming',
    },
    {
      id: 'evidence-dossier',
      step: '04',
      name: 'Evidence Dossier',
      desc: 'Verified Skills Portfolio',
      status: calibration.state === 'completed' ? 'current' : 'upcoming',
    },
    {
      id: 'job-matching',
      step: '05',
      name: 'Internship Matching',
      desc: 'Evidence-Backed Hiring',
      status: 'upcoming',
    },
  ], [calibration.state]);

  // Auto-redirect if user signed up via social login and lacks custom profile fields
  useEffect(() => {
    if (!isClerkLoaded) return;

    if (clerkUser) {
      const hasRole = Boolean(userProfile.role || userRole || clerkUser.publicMetadata?.role);
      const hasTrack = Boolean(userProfile.track || lockedTrack || clerkUser.publicMetadata?.track);
      const hasUniversity = Boolean(userProfile.university || clerkUser.publicMetadata?.university || profile?.university);
      const isComplete = isOnboarded || (hasRole && hasTrack && hasUniversity);

      if (!isComplete && !localStorage.getItem('jadeer-graduate-onboarded')) {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isClerkLoaded, clerkUser, userProfile, userRole, lockedTrack, isOnboarded, navigate]);

  return (
    <div className="w-full space-y-8 sm:space-y-10 animate-[fade-in_0.4s_ease] py-2 sm:py-6">
      {/* ═══════════════════════════════════════════════════════════════
         1. UNIFIED IDENTITY & ENTITY HEADER (SINGLE USER ENTITY)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5E8174]/10 border border-[#5E8174]/20 text-[#5E8174] font-semibold text-xs">
                {activeTrack}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-400 text-[11px]">User_ID: {clerkUser?.id || user.id}</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-400 text-[11px]">Student_ID: {profile?.id || (candidateUserId ? `stu-${candidateUserId.slice(-6)}` : 'stu-live')}</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-[#5E8174] bg-[#5E8174]/10 border border-[#5E8174]/20 px-2 py-0.5 rounded-full font-medium text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5E8174]" />
                Verified Candidate Profile
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              {effectiveImage ? (
                <img
                  src={effectiveImage}
                  alt={effectiveName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#5E8174]/20 shadow-2xs"
                />
              ) : null}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                  Welcome back, <span className="text-[#5E8174]">{effectiveName}</span>
                </h1>
                {effectiveEmail && (
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{effectiveEmail}</p>
                )}
              </div>
            </div>

            <p className="text-[14px] sm:text-[15px] text-[#334155] max-w-2xl leading-relaxed">
              Unified Portal: Manage your 1-on-1 mentor consultations, technical validation telemetry, and internship pipeline with zero data fragmentation.
            </p>
          </div>

          {/* Quick Profile Summary Badge (Warm Beige Surface) */}
          <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2.5 p-4 rounded-2xl bg-[#F4F0E8]/80 border border-[#E8E2D5] shrink-0">
            <div className="text-left sm:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Institution & Track</p>
              <p className="text-xs font-bold text-[#0F172A] truncate max-w-[200px]">
                {effectiveUniversity}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5E8174] bg-white border border-[#5E8174]/20 px-2.5 py-0.5 rounded-full shadow-2xs">
                Track Locked • Class of {profile?.graduationYear || 2025}
              </span>
            </div>
          </div>
        </div>

        {/* ── Top Metric Ribbon ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-[#F4F0E8]/80 border border-[#E8E2D5]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Validation Stage</p>
            <p className="text-base font-bold text-[#0F172A] mt-0.5">{calibration.validationStageLabel}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Consultations</p>
            <p className="text-base font-bold text-[#5E8174] mt-0.5">{activeCount} Active Bookings</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Telemetry Score</p>
            <p className="text-base font-bold text-[#5E8174] mt-0.5">{userProfile.assessmentScore || 94}% Live Rating</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Internship Pipeline</p>
            <p className="text-base font-bold text-[#0F172A] mt-0.5">{(userProfile.applications || []).length || 3} Active Applications</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         2. VALIDATION PIPELINE PROGRESS (5-PHASE STEPPER)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#5E8174]" />
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Internship & Engineering Validation Pipeline
              </h2>
              <p className="text-[13.5px] font-bold text-[#0F172A]">Continuous End-to-End Competence Tracking</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#5E8174] bg-[#5E8174]/10 border border-[#5E8174]/20 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E8174] animate-pulse" />
            <span>Phase {calibration.stepperPhaseNumber} of 5 • En Route to Internship Matching</span>
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-5 sm:gap-2 relative pt-2">
          {journeyPhases.map((phase, idx) => {
            const isCompleted = phase.status === 'completed';
            const isCurrent = phase.status === 'current';
            const isDestination = idx === journeyPhases.length - 1;
            const currentPhaseIndex = journeyPhases.findIndex((p) => p.status === 'current');
            const isNear = currentPhaseIndex >= 2;

            const displayName = isDestination ? 'Internship Matching' : phase.name;
            const displayDesc = isDestination ? 'Verified Internship Placement' : phase.desc;

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
                className="flex sm:flex-col items-start gap-3.5 sm:gap-2 relative group hover:opacity-95 transition-opacity"
              >
                {/* Horizontal connector line on desktop */}
                {idx < journeyPhases.length - 1 && (
                  <div
                    className={`
                      hidden sm:block absolute top-[36px] left-[28px] right-[-14px] h-[2px] z-0 transition-colors duration-500
                      ${isCompleted ? 'bg-[#5E8174]' : 'bg-slate-200'}
                    `}
                  />
                )}

                {/* Vertical connector line on mobile */}
                {idx < journeyPhases.length - 1 && (
                  <div
                    className={`
                      sm:hidden absolute top-8 bottom-[-16px] left-[15px] w-[2px] z-0 transition-colors duration-500
                      ${isCompleted ? 'bg-[#5E8174]' : 'bg-slate-200'}
                    `}
                  />
                )}

                {/* Top soft destination label (only on destination step) */}
                <div className="hidden sm:flex items-center h-4 mb-1">
                  {isDestination && (
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                        isCurrent || isCompleted ? 'text-[#5E8174]' : 'text-slate-400'
                      }`}
                    >
                      {isCurrent || isCompleted ? 'Destination Reached' : 'Your Destination'}
                    </span>
                  )}
                </div>

                {/* Node icon / circle container */}
                <div className="h-10 flex items-center justify-center relative shrink-0 z-10">
                  {isDestination ? (
                    /* Final Destination Node (Briefcase) */
                    <div
                      className={`
                        rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105
                        ${
                          isCurrent || isCompleted
                            ? 'w-10 h-10 bg-[#5E8174] text-white border-2 border-[#5E8174] shadow-[0_0_20px_rgba(94,129,116,0.35)] ring-4 ring-[#5E8174]/20 animate-[pulse_2.5s_ease-in-out_1]'
                            : isNear
                            ? 'w-8 h-8 bg-[#5E8174]/5 border border-[#5E8174]/30 text-[#5E8174] shadow-xs'
                            : 'w-8 h-8 bg-[#F8F9FA] border border-slate-200 text-slate-400 group-hover:border-[#5E8174]/40 group-hover:text-[#5E8174]'
                        }
                      `}
                    >
                      <Briefcase className={isCurrent || isCompleted ? 'w-4.5 h-4.5 text-white' : 'w-4 h-4'} />
                    </div>
                  ) : isCurrent ? (
                    /* Active Single Candidate Marker (Slightly larger with Muted Sage outline & soft halo) */
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-[#5E8174] text-[#5E8174] flex items-center justify-center shadow-[0_0_16px_rgba(94,129,116,0.22)] ring-4 ring-[#5E8174]/15 transition-all group-hover:scale-105">
                      <User className="w-4.5 h-4.5 text-[#5E8174]" />
                    </div>
                  ) : isCompleted ? (
                    /* Completed Stage (Clean Muted Sage Check State) */
                    <div className="w-8 h-8 rounded-full bg-[#5E8174] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                  ) : (
                    /* Upcoming Stage (Light Slate) */
                    <div className="w-8 h-8 rounded-full bg-[#F8F9FA] border border-slate-200 text-slate-400 flex items-center justify-center text-xs font-semibold group-hover:border-[#5E8174]/40 transition-colors">
                      {phase.step}
                    </div>
                  )}
                </div>

                {/* Step label info */}
                <div className="space-y-0.5 min-w-0">
                  <p
                    className={`
                      text-[13px] font-bold leading-tight group-hover:text-[#5E8174] transition-colors
                      ${isCurrent ? 'text-[#0F172A]' : isCompleted ? 'text-[#334155]' : 'text-slate-400'}
                    `}
                  >
                    {displayName}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {displayDesc}
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
      <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] p-7 sm:p-9 text-white shadow-[0_12px_36px_rgba(15,23,42,0.12)] border border-slate-800">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5E8174]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-[#84A98C] fill-[#84A98C]" />
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Seamless Bridge • 1-Click Transition
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to convert consultation insights into verified code proof?
            </h2>
            <p className="text-[14px] sm:text-[15px] text-slate-300 leading-relaxed">
              Transition directly from your mentor sessions into the AI Technical Assessment. Your profile, track, and telemetry are permanently unified—no separate registration required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Link
              to="/candidates/ai-interview"
              className="
                inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl
                bg-[#5E8174] text-white text-[15px] font-bold
                hover:bg-[#4D6D62] hover:shadow-[0_10px_28px_rgba(94,129,116,0.35)]
                transition-all duration-200 active:scale-[0.98] shadow-md
              "
            >
              <span>Start Internship Validation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/consultations"
              className="
                inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl
                bg-white/[0.08] text-white/90 text-xs font-semibold border border-white/[0.12]
                hover:bg-white/[0.14] hover:text-white transition-colors
              "
            >
              <Calendar className="w-3.5 h-3.5 text-slate-300" />
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
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5 flex flex-col justify-between h-full">
            <div className="space-y-5">
              {/* Widget Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">My Consultations</h3>
                    <p className="text-[11px] text-slate-400 font-medium">1-to-1 Industry Guidance Sessions</p>
                  </div>
                </div>

                <Link
                  to="/consultations"
                  className="text-xs font-semibold text-[#5E8174] hover:text-[#4D6D62] transition-colors"
                >
                  View All ({totalCount}) →
                </Link>
              </div>

              {/* Consultation Cards */}
              {consultations.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
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
                        className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 hover:border-[#5E8174]/30 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-[#5E8174] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                              {session.mentorName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13.5px] font-bold text-[#0F172A] truncate">{session.mentorName}</p>
                              <p className="text-[11px] text-[#334155] truncate">
                                {session.mentorTitle} • <span className="font-semibold text-[#5E8174]">{session.mentorCompany}</span>
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
                              isCompleted
                                ? 'bg-slate-100 text-[#334155] border border-slate-200'
                                : isConfirmed
                                ? 'bg-[#5E8174]/10 text-[#5E8174] border border-[#5E8174]/20'
                                : 'bg-slate-100 text-[#334155] border border-slate-200'
                            }`}
                          >
                            {session.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Topic & Timing (Warm Beige Surface) */}
                        <div className="px-3.5 py-2.5 rounded-xl bg-[#F4F0E8]/70 border border-[#E8E2D5] space-y-1">
                          <p className="text-[12px] font-semibold text-[#0F172A]">{session.topicTitle}</p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#334155]">
                            <span className="flex items-center gap-1 font-medium text-[#334155]">
                              <Clock className="w-3 h-3 text-[#5E8174]" />
                              {new Date(session.scheduledAt).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                              {session.timeLabel ? ` • ${session.timeLabel}` : ''}
                            </span>
                            {session.timezone && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-400 font-mono text-[10px]">{session.timezone}</span>
                              </>
                            )}
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-400">{session.durationMinutes} mins</span>
                            {session.meetingLink && (
                              <>
                                <span className="text-slate-300">•</span>
                                <a
                                  href={session.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-semibold text-[#5E8174] hover:text-[#4D6D62]"
                                >
                                  <Video className="w-3 h-3" />
                                  Join Room
                                </a>
                              </>
                            )}
                          </div>
                        </div>

                        {session.notes && (
                          <p className="text-[11px] text-slate-400 italic line-clamp-1">
                            <span className="font-semibold not-italic text-slate-500">Prep:</span> {session.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Book Session CTA */}
            <div className="pt-3 border-t border-slate-100">
              <Link
                to="/consultations"
                className="
                  flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl
                  bg-[#5E8174] text-white text-[13px] font-bold
                  hover:bg-[#4D6D62] hover:shadow-[0_6px_20px_rgba(94,129,116,0.25)]
                  transition-all active:scale-[0.99] shadow-xs
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
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5 flex flex-col justify-between h-full">
            <div className="space-y-5">
              {/* Widget Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Validation Pipeline & Telemetry</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Internship Assessment & Skills Evidence</p>
                  </div>
                </div>

                <Link
                  to="/candidates/portfolio"
                  className="text-xs font-semibold text-[#5E8174] hover:text-[#4D6D62] transition-colors"
                >
                  Evidence Portfolio →
                </Link>
              </div>

              {/* Human Calibration Status Card (Authoritative Supabase State) */}
              <DashboardCalibrationCard
                calibration={calibration}
                track={activeTrack}
                isStudent={true}
              />

              {/* Verified Badges & Proof Chips */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Verified Telemetry Badges:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(userProfile.verifiedBadges || ['Verified Backend Engineer', 'Jadeer AI Technical Badge']).map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-[11px] font-semibold text-[#0F172A] shadow-2xs"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#5E8174]" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Validation Actions */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Link
                to="/candidates/ai-interview"
                className="
                  flex items-center justify-center gap-2 px-4 py-3 rounded-2xl
                  bg-[#5E8174] text-white text-[13px] font-bold
                  hover:bg-[#4D6D62] hover:shadow-[0_6px_20px_rgba(94,129,116,0.25)]
                  transition-all active:scale-[0.99] shadow-xs
                "
              >
                <span>AI Interview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/candidates/human-interview"
                className="
                  flex items-center justify-center gap-2 px-4 py-3 rounded-2xl
                  bg-[#F8F9FA] text-[#0F172A] text-[13px] font-bold border border-slate-200
                  hover:bg-white hover:border-[#5E8174]/40 hover:text-[#5E8174]
                  transition-all active:scale-[0.99]
                "
              >
                <UserCheck className="w-4 h-4 text-[#5E8174]" />
                <span>Human Interview</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         5. UPCOMING INTERVIEWS & CALIBRATION (SYNCED FROM JADEER)
         ═══════════════════════════════════════════════════════════════ */}
      {calibration.state === 'confirmed' && calibration.confirmedDetails && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-[14px] font-bold text-[#0F172A]">Upcoming Calibration Session</h2>
                <p className="text-[11px] text-slate-400 font-medium">Synchronized directly through Jadeer</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5E8174] bg-[#5E8174]/10 border border-[#5E8174]/20 px-2.5 py-0.5 rounded-full">
              1 confirmed
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="px-6 sm:px-8 py-5 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#0F172A] flex items-center justify-center text-[13px] font-bold shrink-0 shadow-2xs">
                    <Building2 className="w-5 h-5 text-[#334155]" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-[14px] font-bold text-[#0F172A]">
                      {calibration.confirmedDetails.interviewerCompany}
                    </h3>
                    <p className="text-[13px] text-[#334155] font-medium">
                      Human Calibration • {calibration.confirmedDetails.interviewerName}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="flex items-center gap-1 text-[12px] font-semibold text-[#334155]">
                        <CalendarCheck2 className="w-3.5 h-3.5 text-[#5E8174]" />
                        {calibration.confirmedDetails.scheduledDate}
                      </span>
                      <span className="flex items-center gap-1 text-[12px] font-semibold text-[#334155]">
                        <Clock className="w-3.5 h-3.5 text-[#5E8174]" />
                        {calibration.confirmedDetails.scheduledTime}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {calibration.confirmedDetails.timezone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-slate-100 text-[#334155] border-slate-200">
                    <UserCheck className="w-3 h-3 text-[#5E8174]" />
                    Human Calibration
                  </span>
                  {calibration.confirmedDetails.meetingUrl && (
                    <a
                      href={calibration.confirmedDetails.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5E8174] hover:text-[#4D6D62] transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Join Meeting
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {calibration.confirmedDetails.googleCalendarSyncStatus === 'synced' && (
                    <a
                      href={calibration.confirmedDetails.googleCalendarHtmlLink || 'https://calendar.google.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#5E8174] hover:underline"
                    >
                      <CalendarCheck2 className="w-3 h-3 text-[#5E8174]" />
                      <span>Google Calendar</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

