import { useState, useEffect, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  FileCheck2,
  Database,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Shield,
  Activity,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Code2,
  CalendarCheck,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminLayoutProps {
  children?: ReactNode;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function AdminLayout({
  children,
  activeTab = 'overview',
  onTabChange,
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser, logout, isAuthenticated } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/signin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/signin');
  };

  const navItems = [
    { id: 'overview', label: 'Overview & Telemetry', icon: LayoutDashboard },
    { id: 'consultations', label: 'Consultations Desk', icon: CalendarCheck, badge: 'Bookings' },
    { id: 'assessments', label: 'Assessment Creator', icon: Code2, badge: 'Rubric Hub' },
    { id: 'users', label: 'User Directory', icon: Users, badge: '5 Candidates' },
    { id: 'jobs', label: 'Job Listings', icon: Briefcase, badge: '6 Jobs' },
    { id: 'employers', label: 'Company Verification', icon: Building2, badge: 'CR Check' },
    { id: 'applications', label: 'Applications & Scores', icon: FileCheck2 },
    { id: 'database', label: 'Prisma Models & Sync', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex text-[#0B0F19] selection:bg-[#6E8F75]/20 selection:text-[#0B0F19]">
      {/* ── Left Sidebar (Desktop) ──────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0B0F19] text-white border-r border-[#0B0F19]/10 shrink-0 sticky top-0 h-screen z-30 justify-between">
        <div className="p-6 space-y-6">
          {/* Top Logo & Admin Badge */}
          <div className="space-y-3">
            <div>
              <BrandLogo size="md" textColor="light" href="/" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Admin Console
              </span>
              <span className="ml-auto text-[10px] text-white/40 font-mono">v1.0-DB</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 pb-1">
              Platform Controls
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onTabChange) {
                      onTabChange(item.id);
                    } else {
                      navigate(`/admin/dashboard?tab=${item.id}`);
                    }
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-[13.5px] font-semibold transition-all duration-200 cursor-pointer text-left
                    ${
                      isActive
                        ? 'bg-[#6E8F75] text-white shadow-[0_4px_16px_rgba(110,143,117,0.3)]'
                        : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/60'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white/[0.08] text-white/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Logout Profile */}
        <div className="p-6 border-t border-white/[0.08] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6E8F75]/20 text-[#82a78a] border border-[#6E8F75]/30 flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-white truncate">{adminUser?.name}</p>
              <p className="text-[11px] text-white/50 truncate">{adminUser?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-[11.5px] font-semibold text-white/70 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Public View</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              title="Sign Out of Admin Console"
              className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Sidebar Drawer ──────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 bg-[#0B0F19] text-white flex flex-col justify-between p-6 z-10 shadow-2xl animate-[slide-in-right_0.2s_ease-out]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <BrandLogo size="md" textColor="light" href="/" />
                <button onClick={() => setMobileOpen(false)} className="p-2 text-white/70 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (onTabChange) onTabChange(item.id);
                        setMobileOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left
                        ${isActive ? 'bg-[#6E8F75] text-white' : 'text-white/70 hover:bg-white/[0.06]'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-white/[0.08] space-y-3">
              <div className="text-xs text-white/50">{adminUser?.email}</div>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-300 text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content Area ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#0B0F19]/[0.06] px-6 sm:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#0B0F19]/[0.08] text-[#0B0F19]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6E8F75]">
                  Platform Control Center
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B0F19]/20" />
                <span className="text-xs text-[#0B0F19]/50 font-medium">PostgreSQL Relational Schema</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#0B0F19] tracking-tight">
                {navItems.find((n) => n.id === activeTab)?.label || 'System Administration'}
              </h1>
            </div>
          </div>

          {/* Top Right Quick Status */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Database Active</span>
            </div>

            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#0B0F19]/[0.08] text-xs font-bold text-[#0B0F19]/70 hover:text-[#0B0F19] hover:border-[#6E8F75]/40 transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>Back to Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Dynamic Children / View */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
