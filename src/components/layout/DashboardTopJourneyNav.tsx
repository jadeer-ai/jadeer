import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useCandidateJourney } from '@/contexts/CandidateJourneyContext';
import { AuthService } from '@/services/authService';
import { BrandLogo } from '@/components/common';
import {
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  CalendarCheck,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Home,
  Compass,
  X,
  FileBarChart,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — DASHBOARD TOP JOURNEY NAVIGATION (EXPERIMENTAL)
   Replaces the left sidebar on Dashboard views with a candidate-centric,
   horizontal journey navigator while preserving all routes, data, and access.
   ═══════════════════════════════════════════════════════════════════════════ */

interface JourneyStage {
  id: string;
  name: string;
  shortName: string;
  path: string;
  status: 'completed' | 'current' | 'upcoming';
  desc: string;
}

export default function DashboardTopJourneyNav() {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const { profile: userProfile } = useUserProfile();
  const { isStudent, clearUserRole } = useUserRole();
  const { resetOnboarding } = useCandidateJourney();

  // Interactive menu states
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileJourneyOpen, setMobileJourneyOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileJourneyRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (mobileJourneyRef.current && !mobileJourneyRef.current.contains(event.target as Node)) {
        setMobileJourneyOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRole: 'student' | 'grad' = isStudent || userProfile.role === 'student' ? 'student' : 'grad';
  const clerkName = clerkUser?.fullName || clerkUser?.firstName || clerkUser?.username;
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress;
  const clerkImage = clerkUser?.imageUrl;
  const displayName = userProfile.fullName || clerkName || (currentRole === 'student' ? 'Ahmad Student' : 'Ahmad Al-Hassan');
  const displayEmail = userProfile.email || clerkEmail || 'candidate@jadeer.io';
  const displayImage = userProfile.imageUrl || clerkImage;
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AH';

  const dashboardPath = isStudent ? '/student/dashboard' : '/dashboard';

  /* ── 6-Stage Candidate Journey Sequence (Dynamically derived from backend state) ── */
  const isCalibrationCompleted = userProfile.humanInterview?.status === 'completed';
  const isCalibrationActive = userProfile.humanInterview?.status === 'upcoming';

  const journeyStages: JourneyStage[] = [
    {
      id: 'profile',
      name: 'Profile',
      shortName: 'Profile',
      path: '/profile',
      status: 'completed',
      desc: 'Track & Competency Binding',
    },
    {
      id: 'ai-assessment',
      name: 'AI Assessment',
      shortName: 'AI Interview',
      path: '/candidates/ai-interview',
      status: 'completed',
      desc: 'Adaptive Technical Telemetry',
    },
    {
      id: 'human-calibration',
      name: 'Human Calibration',
      shortName: 'Calibration',
      path: '/candidates/human-interview',
      status: isCalibrationCompleted ? 'completed' : isCalibrationActive ? 'current' : 'current',
      desc: 'Direct Mentor Technical Review',
    },
    {
      id: 'project',
      name: 'Project',
      shortName: 'Workspace',
      path: '/projects/workspace',
      status: isCalibrationCompleted ? 'current' : 'upcoming',
      desc: 'Sprint & System Collaboration',
    },
    {
      id: 'evidence',
      name: 'Evidence',
      shortName: 'Portfolio',
      path: '/candidates/portfolio',
      status: 'upcoming',
      desc: 'Verified Skills Portfolio',
    },
    {
      id: 'matching',
      name: currentRole === 'student' ? 'Internship Match' : 'Job Match',
      shortName: currentRole === 'student' ? 'Internship' : 'Job Match',
      path: '/candidates/jobs',
      status: 'upcoming',
      desc: currentRole === 'student' ? 'Curated Technical Internships' : 'Direct Full-Time Matching',
    },
  ];

  const currentActiveStage = journeyStages.find((s) => s.status === 'current') || journeyStages[isCalibrationCompleted ? 3 : 2];

  const handleSignOut = async () => {
    try {
      if (signOut) {
        await signOut();
      }
    } catch (err) {
      console.error('Clerk sign out error:', err);
    }
    await AuthService.logout();
    clearUserRole();
    resetOnboarding();
    navigate('/signin');
  };

  return (
    <header
      id="dashboard-top-journey-header"
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ── Left: Jadeer Emblem Logo & Dashboard Indicator ────────────── */}
        <div className="flex items-center gap-3 shrink-0">
          <BrandLogo
            size="md"
            href={dashboardPath}
            inverted={false}
            showText={true}
          />

          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-200">
            <Link
              to={dashboardPath}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#0F172A] bg-[#F4F0E8]/90 border border-[#E8E2D5] hover:bg-[#F4F0E8] transition-colors"
              title="Talent Portal Dashboard Home"
            >
              <Home className="w-3.5 h-3.5 text-[#5E8174]" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* ── Center: Full Candidate Journey Navigator (Desktop) ────────── */}
        <nav
          aria-label="Candidate Journey Navigator"
          className="hidden xl:flex items-center gap-1.5 py-1 px-2.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 shadow-2xs"
        >
          {journeyStages.map((stage, idx) => {
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';

            return (
              <div key={stage.id} className="flex items-center">
                <Link
                  to={stage.path}
                  title={`${stage.name} • ${stage.desc}`}
                  className={`
                    group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-150 select-none
                    ${
                      isCurrent
                        ? 'bg-[#5E8174]/12 text-[#0F172A] font-bold border border-[#5E8174]/25 shadow-2xs'
                        : isCompleted
                        ? 'text-[#0F172A] font-semibold hover:bg-white hover:shadow-2xs'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-white/60 font-medium'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8174] shrink-0" />
                  ) : isCurrent ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5E8174] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5E8174]" />
                    </span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-slate-400 shrink-0 transition-colors" />
                  )}

                  <span>{stage.name}</span>

                  {isCurrent && (
                    <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#5E8174] bg-white px-1.5 py-0.5 rounded shadow-2xs border border-[#5E8174]/20 ml-0.5">
                      Active
                    </span>
                  )}
                </Link>

                {idx < journeyStages.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 mx-0.5" />
                )}
              </div>
            );
          })}
        </nav>

        {/* ── Center Medium Screen Journey Navigator (md -> xl) ──────────── */}
        <div
          ref={mobileJourneyRef}
          className="xl:hidden relative flex items-center"
        >
          <button
            type="button"
            onClick={() => setMobileJourneyOpen(!mobileJourneyOpen)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8F9FA] border border-slate-200/80 text-xs font-semibold text-[#0F172A] hover:bg-white hover:border-slate-300 transition-all shadow-2xs cursor-pointer"
            title="View candidate journey progression"
          >
            <Compass className="w-3.5 h-3.5 text-[#5E8174]" />
            <span className="text-slate-500 hidden sm:inline">Journey:</span>
            <span className="text-[#0F172A] font-bold">{currentActiveStage.name}</span>
            <span className="text-[10px] font-bold text-[#5E8174] bg-[#5E8174]/10 border border-[#5E8174]/20 px-1.5 py-0.5 rounded-md">
              Current
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                mobileJourneyOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Compact Journey Dropdown Sheet */}
          {mobileJourneyOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-80 p-3 rounded-2xl bg-white border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.08)] z-50 animate-[scale-in_0.15s_ease] space-y-1.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Candidate Progression
                </span>
                <span className="text-[10px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2 py-0.5 rounded-md border border-[#5E8174]/20">
                  {currentRole === 'student' ? 'Student Track' : 'Graduate Track'}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                {journeyStages.map((stage, idx) => {
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';

                  return (
                    <Link
                      key={stage.id}
                      to={stage.path}
                      onClick={() => setMobileJourneyOpen(false)}
                      className={`
                        flex items-start gap-3 p-2 rounded-xl transition-all
                        ${
                          isCurrent
                            ? 'bg-[#5E8174]/10 border border-[#5E8174]/20 text-[#0F172A]'
                            : 'hover:bg-slate-50 text-slate-600'
                        }
                      `}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-[#5E8174]/15 text-[#5E8174] flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full bg-[#5E8174] text-white flex items-center justify-center font-bold text-[10px]">
                            {idx + 1}
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-medium border border-slate-200">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs font-bold ${isCurrent ? 'text-[#0F172A]' : 'text-slate-700'}`}>
                            {stage.name}
                          </p>
                          {isCurrent && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white text-[#5E8174] border border-[#5E8174]/20">
                              Active
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-[9px] font-semibold text-[#5E8174]">Done</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{stage.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Secondary Utilities & Candidate Profile Dropdown ────── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* 1-to-1 Consultations Secondary Top Utility */}
          <Link
            to="/consultations"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#334155] hover:text-[#0F172A] hover:bg-slate-100/70 border border-slate-200/80 bg-white transition-all shadow-2xs cursor-pointer"
            title="Book & manage 1-on-1 expert mentor consultations"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#5E8174]" />
            <span className="hidden sm:inline">1-to-1 Consultations</span>
            <span className="sm:hidden">Consult</span>
          </Link>

          {/* Search Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Search dashboard modules"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-white rounded-2xl border border-slate-200 shadow-lg z-50 animate-[scale-in_0.15s_ease]">
                <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-[#F8F9FA] border border-slate-200">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search modules, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full text-xs bg-transparent text-[#0F172A] focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
              title="View notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5E8174] ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 animate-[scale-in_0.15s_ease] space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <p className="text-xs font-bold text-[#0F172A]">Notifications</p>
                  <span className="text-[10px] text-[#5E8174] font-semibold">1 Unread</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-[#F4F0E8]/70 border border-[#E8E2D5] space-y-0.5">
                    <p className="font-bold text-[#0F172A]">Phase 2 AI Evaluation Ready</p>
                    <p className="text-[11px] text-slate-500">
                      Your technical assessment module is calibrated for {userProfile.track || 'Backend Development'}.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200" />

          {/* Candidate Avatar & Comprehensive Profile Dropdown */}
          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Candidate Profile Menu"
              aria-expanded={profileMenuOpen}
            >
              <div className="relative">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#5E8174]/20 shadow-2xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold bg-[#5E8174] ring-2 ring-[#5E8174]/20 shadow-2xs">
                    {initials}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#5E8174] ring-2 ring-white" />
              </div>

              <span className="hidden lg:block text-xs font-bold text-[#0F172A] max-w-[120px] truncate">
                {displayName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
            </button>

            {/* Avatar Dropdown Menu (Includes Settings, Dossier, Dashboard, Sign Out) */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.08)] z-50 animate-[scale-in_0.15s_ease] space-y-3">
                {/* User Summary Header */}
                <div className="p-3 rounded-xl bg-[#F8F9FA] border border-slate-200/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold text-[#0F172A] truncate">{displayName}</p>
                    <span className="text-[9.5px] font-semibold text-[#5E8174] bg-[#5E8174]/10 border border-[#5E8174]/20 px-1.5 py-0.2 rounded">
                      {currentRole === 'student' ? 'Student' : 'Graduate'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5E8174] font-medium truncate">
                    {userProfile.track || 'Backend Development'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
                </div>

                {/* Primary Destination Links */}
                <div className="space-y-0.5 text-xs font-medium text-slate-700">
                  <Link
                    to={dashboardPath}
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-[#0F172A] transition-colors"
                  >
                    <Home className="w-4 h-4 text-[#5E8174]" />
                    <span>Dashboard (Home)</span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-[#0F172A] transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/candidates/portfolio"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-[#0F172A] transition-colors"
                  >
                    <FileBarChart className="w-4 h-4 text-slate-400" />
                    <span>Evidence Portfolio</span>
                  </Link>

                  <Link
                    to="/consultations"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-[#0F172A] transition-colors"
                  >
                    <CalendarCheck className="w-4 h-4 text-slate-400" />
                    <span>1-to-1 Consultations</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-[#0F172A] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings & Security</span>
                  </Link>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
