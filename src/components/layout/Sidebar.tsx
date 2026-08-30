import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useCandidateJourney } from '@/contexts/CandidateJourneyContext';
import { AuthService } from '@/services/authService';
import { BrandLogo } from '@/components/common';
import {
  LayoutDashboard,
  User,
  MessageSquareCode,
  UserCheck,
  GitBranch,
  FileBarChart,
  Briefcase,
  Settings,
  ChevronLeft,
  Sparkles,
  Users,
  Calendar,
  CalendarCheck,
  BookOpen,
  ArrowLeftRight,
  GraduationCap,
  Lock,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

/* ── Navigation Items ──────────────────────────────────────────────────── */

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

/* Unified Candidate Navigation — identical structure for both students & graduates */
const candidateNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/profile', icon: User },
  { label: 'AI Interview', path: '/candidates/ai-interview', icon: MessageSquareCode, badge: 'Step 1' },
  { label: 'Human Interview', path: '/candidates/human-interview', icon: UserCheck },
  { label: 'Project Workspace', path: '/projects/workspace', icon: GitBranch },
  { label: 'Evidence Portfolio', path: '/candidates/portfolio', icon: FileBarChart },
  { label: '1-to-1 Consultations', path: '/consultations', icon: CalendarCheck },
  { label: 'Job Matches', path: '/candidates/jobs', icon: Briefcase, badge: 'Matches' },
  { label: 'Settings', path: '/settings', icon: Settings },
];

/* Un-onboarded Candidate Navigation */
const candidateUnonboardedNavItems: NavItem[] = [
  { label: 'Profile Setup', path: '/candidates/wizard', icon: Sparkles, badge: 'Required' },
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/profile', icon: User },
  { label: 'AI Interview', path: '/candidates/ai-interview', icon: MessageSquareCode },
  { label: 'Human Interview', path: '/candidates/human-interview', icon: UserCheck },
  { label: 'Project Workspace', path: '/projects/workspace', icon: GitBranch },
  { label: 'Evidence Portfolio', path: '/candidates/portfolio', icon: FileBarChart },
  { label: '1-to-1 Consultations', path: '/consultations', icon: CalendarCheck },
  { label: 'Job Matches', path: '/candidates/jobs', icon: Briefcase },
  { label: 'Settings', path: '/settings', icon: Settings },
];

/* ── Deep Navy Sidebar Component ───────────────────────────────────────── */

export default function Sidebar() {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();
  const { userRole, isStudent, clearUserRole } = useUserRole();
  const { isOnboarded, isRouteUnlocked, getRouteLockReason, resetOnboarding } = useCandidateJourney();
  const { profile } = useUserProfile();
  const location = useLocation();

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

  const checkIsActive = (itemPath: string) => {
    const p = location.pathname;
    if (p === itemPath) return true;
    if (itemPath === '/dashboard' && (p === '/' || p === '/graduate/dashboard' || p === '/candidates/dashboard' || p === '/student/dashboard')) return true;
    if (itemPath === '/candidates/wizard' && p === '/wizard') return true;
    if (itemPath === '/profile' && (p === '/profile' || p === '/candidates/profiles' || p === '/candidates/profile' || p === '/graduate/profiles' || p === '/student/profile')) return true;
    if (itemPath === '/candidates/profiles' && (p === '/profile' || p === '/candidates/profiles' || p === '/candidates/profile' || p === '/graduate/profiles' || p === '/student/profile')) return true;
    if (itemPath === '/candidates/ai-interview' && (p === '/graduate/ai-interview' || p === '/student/ai-interview')) return true;
    if (itemPath === '/candidates/human-interview' && (p === '/candidates/human-interview' || p === '/portal/human-interview' || p === '/human-interview' || p === '/graduate/human-interview' || p === '/student/human-interview' || p === '/student/interview' || p === '/student/calibration' || p === '/schedule')) return true;
    if (itemPath === '/projects/workspace' && (p === '/graduate/workspace' || p === '/student/workspace')) return true;
    if (itemPath === '/candidates/portfolio' && (p === '/graduate/portfolio' || p === '/student/portfolio')) return true;
    if (itemPath === '/consultations' && (p === '/consultations' || p === '/consultations/book' || p === '/graduate/consultations' || p === '/graduate/book-consultation' || p === '/student/mentors' || p === '/student/book-session')) return true;
    if (itemPath === '/candidates/jobs' && (p === '/graduate/jobs' || p === '/student/jobs' || p === '/candidates/matching')) return true;
    if (itemPath === '/settings' && (p === '/graduate/settings' || p === '/student/settings' || p === '/candidates/settings')) return true;
    return false;
  };

  const navItems = isOnboarded
    ? candidateNavItems
    : candidateUnonboardedNavItems;

  const portalLabel = 'Talent Portal';

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar with Deep Navy Background */}
      <aside
        id="candidate-sidebar"
        className={`
          fixed top-0 left-0 z-50 h-screen flex flex-col
          bg-[#0B0F19] text-white border-r border-white/[0.08]
          shadow-[4px_0_24px_rgba(0,0,0,0.15)]
          transition-all duration-300 ease-[var(--ease-smooth)]
          ${isCollapsed ? 'w-[var(--spacing-sidebar-collapsed)]' : 'w-[var(--spacing-sidebar)]'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* ── Official Brand Logo Area ────────────────────────────────── */}
        <div className="flex items-center px-4.5 h-[var(--spacing-topbar)] border-b border-white/[0.08] shrink-0">
          <BrandLogo
            size="md"
            href="/"
            textColor="light"
            showText={!isCollapsed}
          />
        </div>

        {/* ── Navigation (Role-Aware) ─────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
          {!isCollapsed && (
            <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-wider text-white/35">
              {portalLabel}
            </p>
          )}

          {navItems.map((item) => {
            const isUnlocked = isStudent || isRouteUnlocked(item.path);
            const lockReason = isStudent ? undefined : getRouteLockReason(item.path);

            const isActive = checkIsActive(item.path);
            const Icon = item.icon;

            if (!isUnlocked) {
              return (
                <div
                  key={item.label}
                  title={isCollapsed ? `${item.label} (Locked - Complete onboarding)` : lockReason}
                  className={`
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                    text-[14px] font-medium text-white/30 cursor-not-allowed select-none
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0 text-white/20" />
                  {!isCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!isCollapsed && (
                    <Lock className="w-3.5 h-3.5 text-white/30 shrink-0" />
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={closeMobile}
                title={isCollapsed ? item.label : undefined}
                className={`
                  group flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                  text-[14px] font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-[#6E8F75]/20 text-[#82a78a] font-semibold border border-[#6E8F75]/30 shadow-[0_2px_12px_rgba(110,143,117,0.15)]'
                      : 'text-white/75 hover:text-white hover:bg-white/[0.06]'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'text-[#82a78a]'
                      : 'text-white/50 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`
                      text-[10px] font-semibold px-2 py-0.5 rounded-full
                      ${isActive
                        ? 'bg-[#6E8F75] text-white'
                        : 'bg-white/10 text-white/60'}
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Role Status Card ────────────────────────────────── */}
        {!isCollapsed && (
          <div className="px-3 mb-2 space-y-2">
            {/* Candidate Dossier Card */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#82a78a]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#82a78a]">
                    Candidate Dossier
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/80">
                    {profile.role === 'student' ? 'Student' : 'Graduate'}
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-[#6E8F75] animate-[pulse-glow_2s_ease-in-out_infinite]" />
                </div>
              </div>

              <div className="flex items-center justify-between mb-1 text-white">
                <p className="text-[13px] font-bold truncate">
                  {profile.fullName || 'Ahmad Al-Hassan'}
                </p>
                {profile.verifiedBadges && profile.verifiedBadges.length > 0 && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#6E8F75]/30 text-[#82a78a] border border-[#6E8F75]/40 shrink-0">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-[#82a78a] mb-1 truncate">
                {profile.track || 'Backend Development'}
              </p>
              <p className="text-[11px] text-white/45 leading-relaxed">
                Score: {profile.assessmentScore || 94}% • {profile.verifiedBadges?.length || 3} Verified Badges
              </p>
            </div>
          </div>
        )}

        {/* ── Footer Actions (Sign Out & Collapse) ─────────────────── */}
        <div className="shrink-0 p-3 border-t border-white/[0.08] space-y-1.5">
          <button
            id="sidebar-signout-btn"
            onClick={handleSignOut}
            className={`
              flex items-center w-full py-2.5 px-3 rounded-xl
              text-rose-300 hover:text-white hover:bg-rose-500/20
              transition-all duration-200 cursor-pointer
              ${isCollapsed ? 'justify-center' : 'gap-2.5'}
            `}
            title="Sign Out of Candidate Portal"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
            {!isCollapsed && <span className="text-xs font-bold">Sign Out</span>}
          </button>

          <button
            id="sidebar-toggle"
            onClick={toggleCollapse}
            className={`
              hidden lg:flex items-center justify-center w-full py-2.5 rounded-xl
              text-white/40 hover:text-white hover:bg-white/[0.06]
              transition-all duration-200
              ${isCollapsed ? '' : 'gap-2'}
            `}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
            {!isCollapsed && <span className="text-xs font-semibold">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

