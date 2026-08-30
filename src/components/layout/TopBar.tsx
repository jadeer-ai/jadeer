import { useLocation, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { AuthService } from '@/services/authService';
import {
  Menu,
  Bell,
  Search,
  ChevronRight,
  Sparkles,
  GraduationCap,
  LogOut,
} from 'lucide-react';

/* ── Route → Breadcrumb label mapping ───────────────────────────────────── */
const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  'dashboard': 'Dashboard',
  'candidates': 'Candidate Portal',
  'wizard': 'My Profile Setup',
  'profiles': 'My Profile',
  'ai-interview': 'AI Interview',
  'human-interview': 'Human Interview',
  'workspace': 'Project Workspace',
  'projects': 'Projects',
  'portfolio': 'Evidence Portfolio',
  'jobs': 'Job Matches',
  'matching': 'Job Matches',
  'settings': 'Settings',
  'readiness': 'Readiness Report',
  /* Student route labels */
  'student': 'Student Portal',
  'mentors': 'Find Mentors',
  'book-session': 'Book Session',
};

export default function TopBar() {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const { profile: userProfile } = useUserProfile();
  const { toggleMobile, isCollapsed } = useSidebar();
  const { isStudent, isGraduate, userRole, clearUserRole } = useUserRole();
  const location = useLocation();

  const clerkName = clerkUser?.fullName || clerkUser?.firstName || clerkUser?.username;
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress;
  const clerkImage = clerkUser?.imageUrl;
  const displayName = userProfile.fullName || clerkName || (isStudent ? 'Ahmad Student' : 'Ahmad Al-Hassan');
  const displayEmail = userProfile.email || clerkEmail;
  const displayImage = userProfile.imageUrl || clerkImage;
  const displayRoleTitle = userProfile.title || (isStudent ? 'Computer Science Student' : 'Junior Software Engineer');
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'AH';

  /* Build breadcrumbs from path */
  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.length === 0
    ? [{ label: 'Dashboard', path: '/dashboard' }]
    : segments.map((seg, i) => ({
        label: routeLabels[seg] || seg.replace('-', ' '),
        path: '/' + segments.slice(0, i + 1).join('/'),
      }));

  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  /* Root breadcrumb label based on role */
  const rootLabel = isStudent ? 'Jadeer Student' : isGraduate ? 'Jadeer Graduate' : 'Jadeer Candidate';

  /* Role badge config */
  const roleBadge = isStudent
    ? { label: 'Student', color: 'bg-student-50 text-student-600' }
    : { label: 'Junior', color: 'bg-[#6E8F75]/10 text-[#6E8F75]' };

  return (
    <header
      id="topbar"
      className={`
        fixed top-0 right-0 z-30
        h-[var(--spacing-topbar)] 
        bg-white/85 backdrop-blur-xl border-b border-[#0B0F19]/[0.06]
        shadow-[0_1px_8px_rgba(0,0,0,0.02)]
        flex items-center justify-between px-4 lg:px-7
        transition-all duration-300
        ${isCollapsed
          ? 'left-0 lg:left-[var(--spacing-sidebar-collapsed)]'
          : 'left-0 lg:left-[var(--spacing-sidebar)]'
        }
      `}
    >
      {/* ── Left Section: Breadcrumbs & Title ─────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={toggleMobile}
          className="p-2 rounded-xl text-[#0B0F19]/60 hover:text-[#0B0F19] hover:bg-[#0B0F19]/[0.04] lg:hidden transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title / Breadcrumbs */}
        <div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#0B0F19]/40 mb-0.5 font-medium">
            <span className="hover:text-[#0B0F19]/70 transition-colors">{rootLabel}</span>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-[#0B0F19]/25" />
                <span
                  className={`transition-colors capitalize ${
                    i === breadcrumbs.length - 1
                      ? isStudent
                        ? 'text-student-500 font-semibold'
                        : 'text-[#6E8F75] font-semibold'
                      : 'hover:text-[#0B0F19]/70'
                  }`}
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </div>
          <h1 className="text-base font-bold text-[#0B0F19] leading-tight">{pageTitle}</h1>
        </div>
      </div>

      {/* ── Right Section: Candidate Profile & Actions ────────────────── */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          id="global-search"
          className="p-2.5 rounded-xl text-[#0B0F19]/45 hover:text-[#0B0F19] hover:bg-[#0B0F19]/[0.04] transition-colors"
          title="Search"
        >
          <Search className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <button
          id="notifications"
          className="relative p-2.5 rounded-xl text-[#0B0F19]/45 hover:text-[#0B0F19] hover:bg-[#0B0F19]/[0.04] transition-colors"
          title="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-white ${isStudent ? 'bg-student-500' : 'bg-[#6E8F75]'}`} />
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-[#0B0F19]/[0.08] mx-2 hidden sm:block" />

        {/* User Profile */}
        <div
          id="candidate-user-menu"
          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#0B0F19]/[0.03] transition-colors cursor-pointer"
        >
          {/* Avatar */}
          <div className="relative">
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#6E8F75]/20 shadow-sm"
              />
            ) : (
              <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center text-xs font-bold ring-2 ${
                isStudent
                  ? 'bg-student-500 ring-student-500/20 shadow-[0_2px_6px_rgba(0,86,214,0.25)]'
                  : 'bg-[#6E8F75] ring-[#6E8F75]/20 shadow-[0_2px_6px_rgba(110,143,117,0.25)]'
              }`}>
                {initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] ring-2 ring-white" />
          </div>

          {/* Info */}
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <p className="text-[13px] font-bold text-[#0B0F19] leading-tight">
                {displayName}
              </p>
              <span className={`px-1.5 py-0.2 text-[10px] font-semibold ${roleBadge.color} rounded-md`}>
                {roleBadge.label}
              </span>
            </div>
            <p className="text-[11px] text-[#0B0F19]/40 leading-tight mt-0.5">
              {displayEmail || displayRoleTitle}
            </p>
          </div>
        </div>

        {/* Quick Sign Out Action */}
        <button
          id="topbar-signout-btn"
          onClick={async () => {
            try {
              await signOut();
            } catch {
              // fallback
            }
            await AuthService.logout();
            clearUserRole();
            navigate('/signin');
          }}
          className="p-2.5 rounded-xl text-[#0B0F19]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
