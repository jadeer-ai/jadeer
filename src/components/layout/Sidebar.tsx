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
  CalendarCheck,
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
  const { isStudent, clearUserRole } = useUserRole();
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
    if (itemPath === '/candidates/ai-interview' && (p === '/ai-interview' || p === '/graduate/ai-interview' || p === '/student/ai-interview')) return true;
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

      {/* Sidebar with Deep Slate Navy Background and Subtle Depth */}
      <aside
        id="candidate-sidebar"
        className={`
          fixed top-0 left-0 z-50 h-screen flex flex-col
          bg-[#0F172A] text-slate-200
          border-r border-slate-800/70
          shadow-[1px_0_0_rgba(255,255,255,0.02),4px_0_24px_rgba(15,23,42,0.12)]
          transition-all duration-300 ease-[var(--ease-smooth)]
          ${isCollapsed ? 'w-[var(--spacing-sidebar-collapsed)]' : 'w-[var(--spacing-sidebar)]'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* ── Official Brand Logo Area (Spacious & Clean) ─────────────── */}
        <div className={`flex items-center h-[var(--spacing-topbar)] border-b border-slate-800/60 shrink-0 ${isCollapsed ? 'justify-center px-0' : 'px-5'}`}>
          <BrandLogo
            size="md"
            href="/"
            inverted={true}
            showText={!isCollapsed}
          />
        </div>

        {/* ── Navigation (Role-Aware & Visually Refined) ───────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {!isCollapsed && (
            <p className="px-3 pt-1 pb-2 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400/60">
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
                    flex items-center gap-3 px-3 py-2 rounded-xl
                    text-[13.5px] font-medium text-slate-600 cursor-not-allowed select-none
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0 text-slate-600" />
                  {!isCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!isCollapsed && (
                    <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
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
                  group flex items-center gap-3 px-3 py-2 rounded-xl
                  text-[13.5px] font-medium transition-all duration-150
                  ${
                    isActive
                      ? 'bg-[#5E8174]/12 text-[#84A98C] font-semibold border border-[#5E8174]/20 shadow-2xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 transition-colors duration-150 ${
                    isActive
                      ? 'text-[#84A98C]'
                      : 'text-slate-400/80 group-hover:text-slate-200'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`
                      text-[10px] font-medium tracking-tight px-1.5 py-0.5 rounded-md
                      ${isActive
                        ? 'bg-[#5E8174]/20 text-[#84A98C] border border-[#5E8174]/30'
                        : 'bg-slate-800/60 text-slate-400 border border-slate-700/40'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Role Status Card (Soft Floating Card) ────────────────────── */}
        {!isCollapsed && (
          <div className="px-3 mb-2">
            {/* Candidate Dossier Floating Card */}
            <div className="p-4 rounded-2xl bg-[#141F32] border border-slate-800/80 shadow-[0_4px_16px_rgba(0,0,0,0.14)] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#84A98C]" />
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#84A98C]">
                    Candidate Dossier
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9.5px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/30">
                    {profile.role === 'student' ? 'Student' : 'Graduate'}
                  </span>
                  <span className="flex h-1.5 w-1.5 rounded-full bg-[#5E8174] ring-2 ring-[#5E8174]/20" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <p className="text-[13.5px] font-bold text-white truncate">
                  {profile.fullName || 'Ahmad Al-Hassan'}
                </p>
                {profile.verifiedBadges && profile.verifiedBadges.length > 0 && (
                  <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#5E8174]/15 text-[#84A98C] border border-[#5E8174]/25 shrink-0">
                    Verified
                  </span>
                )}
              </div>

              <p className="text-[11.5px] font-medium text-[#84A98C] truncate">
                {profile.track || 'Backend Development'}
              </p>

              <p className="text-[11px] text-slate-400/90 leading-relaxed pt-0.5 border-t border-slate-800/60">
                Score: {profile.assessmentScore || 94}% • {profile.verifiedBadges?.length || 3} Verified Badges
              </p>
            </div>
          </div>
        )}

        {/* ── Footer Actions (Restrained Sign Out & Collapse) ──────────── */}
        <div className="shrink-0 p-3 border-t border-slate-800/60 space-y-1">
          <button
            id="sidebar-signout-btn"
            onClick={handleSignOut}
            className={`
              group flex items-center w-full py-2 px-3 rounded-xl
              text-slate-400 hover:text-rose-300 hover:bg-rose-500/[0.08]
              transition-all duration-150 cursor-pointer
              ${isCollapsed ? 'justify-center px-0' : 'gap-2.5'}
            `}
            title="Sign Out of Candidate Portal"
          >
            <LogOut className="w-4 h-4 shrink-0 text-slate-400/80 group-hover:text-rose-300 transition-colors" />
            {!isCollapsed && <span className="text-xs font-medium">Sign Out</span>}
          </button>

          <button
            id="sidebar-toggle"
            onClick={toggleCollapse}
            className={`
              hidden lg:flex items-center justify-center w-full py-2 px-3 rounded-xl
              text-slate-400 hover:text-slate-200 hover:bg-slate-800/40
              transition-all duration-150 cursor-pointer
              ${isCollapsed ? 'px-0' : 'gap-2'}
            `}
          >
            <ChevronLeft
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
            {!isCollapsed && <span className="text-xs font-medium">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

