import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BrandLogo } from '@/components/common';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  Users,
  Settings,
  ChevronLeft,
  Menu,
  X,
  Building2,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — EMPLOYER PORTAL LAYOUT
   Signature Brand Identity: Sleek Dark Navy (#0B0F19), Sage Green (#6E8F75),
   and Clean Cream Surface (#FAF9F6)
   ═══════════════════════════════════════════════════════════════════════════ */

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

const employerNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/employer/dashboard', icon: LayoutDashboard },
  { label: 'Post a Job', path: '/employer/post-job', icon: FilePlus2, badge: 'New' },
  { label: 'Active Listings', path: '/employer/listings', icon: ClipboardList, badge: '3' },
  { label: 'Candidates', path: '/employer/candidates', icon: Users },
  { label: 'Settings', path: '/employer/settings', icon: Settings },
];

/* ── Employer Sidebar ──────────────────────────────────────────────────── */

function EmployerSidebar({
  isCollapsed,
  isMobileOpen,
  toggleCollapse,
  closeMobile,
}: {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
  closeMobile: () => void;
}) {
  const location = useLocation();
  const { companyProfile } = useCompanyProfile();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        id="employer-sidebar"
        className={`
          fixed top-0 left-0 z-50 h-screen flex flex-col
          bg-[#0B0F19] text-white border-r border-white/[0.08]
          shadow-[4px_0_24px_rgba(0,0,0,0.15)]
          transition-all duration-300 ease-[var(--ease-smooth)]
          ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Brand Logo Area */}
        <div className="flex items-center justify-between px-4.5 h-[var(--spacing-topbar)] border-b border-white/[0.08] shrink-0">
          <BrandLogo
            size="md"
            href="/"
            textColor="light"
            showText={!isCollapsed}
          />
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Company Badge */}
        {!isCollapsed && (
          <div className="px-4 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <div className="w-9 h-9 rounded-xl bg-[#6E8F75] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm shadow-[#6E8F75]/30">
                {companyProfile.companyInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-bold text-white truncate">{companyProfile.companyName}</p>
                  {companyProfile.isCRVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6E8F75] shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-white/45 truncate capitalize">
                  {companyProfile.workModel} · {companyProfile.location.split(',')[0]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
          {!isCollapsed && (
            <p className="px-3 mb-3 text-[11px] font-bold uppercase tracking-wider text-white/35">
              Employer Portal
            </p>
          )}

          {employerNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

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
                      ? 'bg-[#6E8F75]/15 text-[#6E8F75] font-semibold border border-[#6E8F75]/30 shadow-[0_2px_12px_rgba(110,143,117,0.15)]'
                      : 'text-white/75 hover:text-white hover:bg-white/[0.06]'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'text-[#6E8F75]'
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

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/[0.06] shrink-0">
          {!isCollapsed ? (
            <Link
              to="/employer"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Employer Overview
            </Link>
          ) : (
            <Link
              to="/employer"
              title="Employer Overview"
              className="flex items-center justify-center py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

/* ── Employer TopBar ───────────────────────────────────────────────────── */

function EmployerTopBar({
  isCollapsed,
  openMobile,
}: {
  isCollapsed: boolean;
  openMobile: () => void;
}) {
  const { companyProfile } = useCompanyProfile();

  return (
    <header
      id="employer-topbar"
      className={`
        fixed top-0 right-0 z-30 h-[var(--spacing-topbar)]
        bg-[#FAF9F6]/80 backdrop-blur-xl border-b border-[#0B0F19]/[0.05]
        flex items-center justify-between px-4 sm:px-6 lg:px-8
        transition-all duration-300 ease-[var(--ease-smooth)]
        ${isCollapsed ? 'lg:left-[72px]' : 'lg:left-[260px]'}
        left-0
      `}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={openMobile}
        className="lg:hidden p-2 rounded-xl hover:bg-[#0B0F19]/[0.04] text-[#0B0F19]/50"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page context */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E8F75] bg-[#6E8F75]/10 px-3 py-1 rounded-full border border-[#6E8F75]/20 flex items-center gap-1.5">
          <Building2 className="w-3 h-3 text-[#6E8F75]" />
          {companyProfile.companyName}
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-[#0B0F19]/[0.06] shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-[#6E8F75] text-white flex items-center justify-center text-[11px] font-black shadow-xs">
            {companyProfile.companyInitials}
          </div>
          <div className="hidden sm:block">
            <p className="text-[12px] font-bold text-[#0B0F19] truncate max-w-[140px]">{companyProfile.contactName}</p>
            <p className="text-[10px] text-[#0B0F19]/40">{companyProfile.contactRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EMPLOYER LAYOUT — MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function EmployerLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div id="employer-app-layout" className="min-h-screen bg-[#FAF9F6] text-[#0B0F19]">
      <EmployerSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        toggleCollapse={() => setIsCollapsed((c) => !c)}
        closeMobile={() => setIsMobileOpen(false)}
      />
      <EmployerTopBar
        isCollapsed={isCollapsed}
        openMobile={() => setIsMobileOpen(true)}
      />

      <main
        id="employer-main-content"
        className={`
          pt-[var(--spacing-topbar)] min-h-screen
          transition-all duration-300 ease-[var(--ease-smooth)]
          ${isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}
        `}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-[fade-in_0.3s_ease]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
