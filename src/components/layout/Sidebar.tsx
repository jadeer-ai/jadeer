import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '@/contexts/SidebarContext';
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
  type LucideIcon,
} from 'lucide-react';

/* ── Candidate Navigation Items (All Fully Unlocked) ───────────────────── */

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

const candidateNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/candidates/profiles', icon: User },
  { label: 'AI Interview', path: '/candidates/ai-interview', icon: MessageSquareCode, badge: 'Step 1' },
  { label: 'Human Interview', path: '/candidates/human-interview', icon: UserCheck },
  { label: 'Project Workspace', path: '/projects/workspace', icon: GitBranch },
  { label: 'Evidence Portfolio', path: '/candidates/portfolio', icon: FileBarChart },
  { label: 'Job Matches', path: '/candidates/jobs', icon: Briefcase, badge: '3 Matches' },
  { label: 'Settings', path: '/settings', icon: Settings },
];

/* ── Deep Navy Candidate Sidebar Component ──────────────────────────────── */

export default function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();
  const location = useLocation();

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

        {/* ── Candidate Navigation (All Open & Clickable) ─────────────── */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
          {!isCollapsed && (
            <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-wider text-white/35">
              Candidate Portal
            </p>
          )}

          {candidateNavItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === '/dashboard' && location.pathname === '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
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
                    isActive ? 'text-[#82a78a]' : 'text-white/50 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`
                      text-[10px] font-semibold px-2 py-0.5 rounded-full
                      ${isActive ? 'bg-[#6E8F75] text-white' : 'bg-white/10 text-white/60'}
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Candidate Portal Status Card ────────────────────────────── */}
        {!isCollapsed && (
          <div className="p-3.5 mx-3 mb-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#82a78a]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#82a78a]">
                  Candidate Dossier
                </span>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-[#6E8F75] animate-[pulse-glow_2s_ease-in-out_infinite]" />
            </div>

            <p className="text-[12px] font-semibold text-white mb-1">
              Ahmad Al-Hassan
            </p>
            <p className="text-[11px] text-white/45 leading-relaxed">
              All validation modules, project workspace & portfolio tools are open for review.
            </p>
          </div>
        )}

        {/* ── Collapse Toggle ────────────────────────────────────────── */}
        <div className="shrink-0 p-3 border-t border-white/[0.08]">
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
