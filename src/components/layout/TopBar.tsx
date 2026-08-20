import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  Menu,
  Bell,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

/* ── Route → Breadcrumb label mapping ───────────────────────────────────── */
const routeLabels: Record<string, string> = {
  '': 'Candidate Dashboard',
  'dashboard': 'Candidate Dashboard',
  'candidates': 'Candidate Portal',
  'wizard': 'My Profile Setup',
  'profiles': 'My Profile',
  'ai-interview': 'AI Interview',
  'workspace': 'Project Workspace',
  'projects': 'Projects',
  'portfolio': 'Evidence Portfolio',
};

export default function TopBar() {
  const { toggleMobile, isCollapsed } = useSidebar();
  const location = useLocation();

  /* Build breadcrumbs from path */
  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.length === 0
    ? [{ label: 'Candidate Dashboard', path: '/dashboard' }]
    : segments.map((seg, i) => ({
        label: routeLabels[seg] || seg.replace('-', ' '),
        path: '/' + segments.slice(0, i + 1).join('/'),
      }));

  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || 'Candidate Dashboard';

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
            <span className="hover:text-[#0B0F19]/70 transition-colors">Jadeer Candidate</span>
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-[#0B0F19]/25" />
                <span
                  className={`transition-colors capitalize ${
                    i === breadcrumbs.length - 1
                      ? 'text-[#6E8F75] font-semibold'
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
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#6E8F75] ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-[#0B0F19]/[0.08] mx-2 hidden sm:block" />

        {/* Junior Engineer Candidate Profile */}
        <div
          id="candidate-user-menu"
          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#0B0F19]/[0.03] transition-colors cursor-pointer"
        >
          {/* Candidate Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#6E8F75] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#6E8F75]/20 shadow-[0_2px_6px_rgba(110,143,117,0.25)]">
              AH
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] ring-2 ring-white" />
          </div>

          {/* Candidate Info */}
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <p className="text-[13px] font-bold text-[#0B0F19] leading-tight">
                Ahmad Al-Hassan
              </p>
              <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-[#6E8F75]/10 text-[#6E8F75] rounded-md">
                Junior
              </span>
            </div>
            <p className="text-[11px] text-[#0B0F19]/40 leading-tight mt-0.5">
              Junior Software Engineer
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
