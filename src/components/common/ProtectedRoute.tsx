import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound, Lock } from 'lucide-react';
import { AuthService } from '@/services/authService';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import BrandLogo from '@/components/common/BrandLogo';

interface RouteGuardProps {
  children: React.ReactNode;
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. ADMIN ROUTE GUARD (/admin/*)
   ─────────────────────────────────────────────────────────────────────────
   Strictly gates platform administrator tools & telemetry controls.
   ═══════════════════════════════════════════════════════════════════════════ */
export function AdminRouteGuard({ children }: RouteGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAdminAuth();
  const session = AuthService.getCurrentSession();

  const isAdmin = isAuthenticated || (session && session.user.role === 'ADMIN');

  useEffect(() => {
    if (!isAdmin) {
      if (session) {
        // If logged in as another role, seamlessly route to that portal
        if (session.user.role === 'EMPLOYER') navigate('/employer/dashboard', { replace: true });
        else if (session.user.role === 'STUDENT') navigate('/student/dashboard', { replace: true });
        else navigate('/dashboard', { replace: true });
      } else {
        const timer = setTimeout(() => {
          navigate(`/admin/signin?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAdmin, session, navigate, location.pathname]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-between p-6">
        <header className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <BrandLogo size="md" textColor="light" href="/" />
          <Link
            to="/"
            className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </header>

        <main className="max-w-md mx-auto w-full text-center space-y-6 animate-[scale-in_0.3s_ease-out]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              403 • Administrator Access Restricted
            </h1>
            <p className="text-xs text-white/60 max-w-sm mx-auto leading-relaxed">
              This route is protected by Jadeer Platform RBAC security middleware. Only verified administrators with active console permissions may access this area.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/admin/signin"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#6E8F75] hover:bg-[#5d7d64] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In with Admin Account</span>
            </Link>

            <Link
              to="/signin"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] transition-all"
            >
              Standard Sign In
            </Link>
          </div>
        </main>

        <footer className="text-center text-xs text-white/30">
          Jadeer Security Middleware • RBAC Rule Gated
        </footer>
      </div>
    );
  }

  return <>{children}</>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. EMPLOYER ROUTE GUARD (/employer/*)
   ─────────────────────────────────────────────────────────────────────────
   Ensures only authenticated company accounts access employer dashboards.
   ═══════════════════════════════════════════════════════════════════════════ */
export function EmployerRouteGuard({ children }: RouteGuardProps) {
  const session = AuthService.getCurrentSession();

  if (session && session.user.role !== 'EMPLOYER' && session.user.role !== 'ADMIN') {
    // Redirect students/graduates to candidate portal
    return <Navigate to={session.user.role === 'STUDENT' ? '/student/dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. GUEST ONLY ROUTE GUARD (Login & Registration Pages)
   ─────────────────────────────────────────────────────────────────────────
   If a user already has an active secure session, automatically redirects
   them straight to their dedicated portal dashboard.
   ═══════════════════════════════════════════════════════════════════════════ */
export function GuestOnlyRouteGuard({ children }: RouteGuardProps) {
  const session = AuthService.getCurrentSession();
  const { isAuthenticated } = useAdminAuth();

  if (isAuthenticated || (session && session.user.role === 'ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (session) {
    if (session.user.role === 'EMPLOYER') {
      return <Navigate to="/employer/dashboard" replace />;
    }
    if (session.user.role === 'STUDENT') {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. AUTHENTICATED CANDIDATE & STUDENT ROUTE GUARD
   ─────────────────────────────────────────────────────────────────────────
   Guarantees that candidate portal workspaces, AI assessments, and profiles
   are strictly inaccessible when a user is logged out.
   ═══════════════════════════════════════════════════════════════════════════ */
export function AuthenticatedRouteGuard({ children }: RouteGuardProps) {
  const session = AuthService.getCurrentSession();
  const location = useLocation();

  if (!session || !AuthService.isAuthenticated()) {
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}

