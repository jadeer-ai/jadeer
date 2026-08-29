import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/common';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — EMPLOYER SIGN IN PAGE
   Dedicated authentication portal for verified employers & hiring managers.
   Signature Brand Identity: Clean Cream (#FAF9F6), Sage Green (#6E8F75),
   and Deep Navy (#0B0F19)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Inline Enterprise SSO Provider Icons ──────────────────────────────── */

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path fill="#f25022" d="M1 1h10v10H1z"/>
      <path fill="#00a4ef" d="M1 13h10v10H1z"/>
      <path fill="#7fba00" d="M13 1h10v10H13z"/>
      <path fill="#ffb900" d="M13 13h10v10H13z"/>
    </svg>
  );
}

import { AuthService } from '@/services/authService';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function EmployerSignInPage() {
  const navigate = useNavigate();
  const { companyProfile } = useCompanyProfile();
  const { login: adminLogin } = useAdminAuth();

  const [workEmail, setWorkEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!workEmail.includes('@')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    setIsLoading(true);

    const result = await AuthService.login(workEmail, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Authentication failed. Please check your credentials.');
      return;
    }

    if (result.role === 'ADMIN') {
      adminLogin(workEmail, password);
      navigate('/admin/dashboard');
    } else {
      navigate('/employer/dashboard');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.includes('@')) return;
    setResetSent(true);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setResetSent(false);
      setResetEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between text-[#0B0F19] relative overflow-hidden selection:bg-[#6E8F75]/20 selection:text-[#0B0F19]">

      {/* ── Background Technical Grid ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(11, 15, 25, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(11, 15, 25, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 80%)',
        }}
      />

      {/* Diffused Sage Glow */}
      <div
        className="absolute top-0 right-1/3 w-[600px] h-[400px] rounded-full pointer-events-none blur-3xl opacity-35"
        style={{
          background: 'radial-gradient(circle at center, rgba(110,143,117,0.22) 0%, rgba(11,15,25,0.04) 50%, transparent 75%)',
        }}
      />

      {/* ── Top Navigation Header ───────────────────────────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
        <BrandLogo size="md" href="/" textColor="dark" />
        <div className="flex items-center gap-4 text-xs font-semibold text-[#0B0F19]/60">
          <Link to="/employer" className="hover:text-[#0B0F19] transition-colors hidden sm:inline">
            Employer Overview
          </Link>
          <span className="hidden sm:inline text-[#0B0F19]/20">•</span>
          <span>
            New company?{' '}
            <Link
              to="/employer/signup"
              className="text-[#6E8F75] font-bold hover:text-[#5d7d64] transition-colors ml-1"
            >
              Start Hiring Talent →
            </Link>
          </span>
        </div>
      </header>

      {/* ── Main Centered Card Container ────────────────────────────── */}
      <main className="relative z-10 w-full max-w-md mx-auto px-5 py-6 sm:py-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#0B0F19]/[0.06] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.04)] space-y-7 animate-[fade-in_0.4s_ease]">

          {/* Heading */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6E8F75]/10 border border-[#6E8F75]/20 text-[#6E8F75] text-xs font-extrabold uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5" />
              Employer Portal Sign In
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
              Sign In to Your Workspace
            </h1>

            <p className="text-xs sm:text-[13.5px] text-[#0B0F19]/55 font-medium leading-relaxed">
              Access verified engineering candidates, interview scorecards, and hiring pipelines.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 text-danger-700 text-xs font-bold border border-danger-200 animate-[shake_0.3s_ease]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Work Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="employer-email"
                className="block text-xs font-bold text-[#0B0F19]/70"
              >
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B0F19]/30">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="employer-email"
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="talent@company.com"
                  required
                  className="
                    w-full pl-10 pr-4 py-3 rounded-xl border border-[#0B0F19]/[0.08]
                    bg-white text-sm font-medium text-[#0B0F19] placeholder:text-[#0B0F19]/25
                    focus:outline-none focus:border-[#6E8F75] focus:ring-2 focus:ring-[#6E8F75]/20
                    transition-all duration-200
                  "
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="employer-password"
                  className="block text-xs font-bold text-[#0B0F19]/70"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(workEmail);
                    setShowForgotPasswordModal(true);
                  }}
                  className="text-xs font-bold text-[#6E8F75] hover:text-[#5d7d64] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0B0F19]/30">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="employer-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="
                    w-full pl-10 pr-11 py-3 rounded-xl border border-[#0B0F19]/[0.08]
                    bg-white text-sm font-medium text-[#0B0F19] placeholder:text-[#0B0F19]/25
                    focus:outline-none focus:border-[#6E8F75] focus:ring-2 focus:ring-[#6E8F75]/20
                    transition-all duration-200
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#0B0F19]/35 hover:text-[#0B0F19]/70 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#0B0F19]/60 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#6E8F75] focus:ring-[#6E8F75] accent-[#6E8F75] cursor-pointer"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-xl
                bg-[#6E8F75] text-white text-sm font-bold shadow-[0_4px_16px_rgba(110,143,117,0.25)]
                hover:bg-[#5d7d64] hover:shadow-[0_8px_24px_rgba(110,143,117,0.35)] hover:-translate-y-0.5
                active:translate-y-0 active:scale-[0.99]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Employer Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* SSO / Alternative divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#0B0F19]/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#0B0F19]/40 font-semibold uppercase tracking-wider text-[10px]">
                or enterprise sso
              </span>
            </div>
          </div>

          {/* SSO Options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  navigate('/employer/dashboard');
                }, 600);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6] text-xs font-bold text-[#0B0F19]/75 transition-colors"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Google SSO</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  navigate('/employer/dashboard');
                }, 600);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6] text-xs font-bold text-[#0B0F19]/75 transition-colors"
            >
              <MicrosoftIcon className="w-4 h-4" />
              <span>Microsoft 365</span>
            </button>
          </div>

          {/* Security badge footer */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#0B0F19]/40">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6E8F75]" />
            <span>256-bit TLS Encrypted Enterprise Authentication</span>
          </div>

        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 text-center text-xs text-[#0B0F19]/40 border-t border-[#0B0F19]/[0.05]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Jadeer. Merit-Based Talent Validation Platform.</p>
          <div className="flex items-center gap-4">
            <Link to="/employer" className="hover:text-[#0B0F19] transition-colors">Employer Overview</Link>
            <Link to="/employer/signup" className="hover:text-[#6E8F75] font-bold transition-colors">Register Company</Link>
            <Link to="/signin" className="hover:text-[#0B0F19] transition-colors">Candidate Sign In</Link>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════
         FORGOT PASSWORD MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowForgotPasswordModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#0B0F19]/[0.08] space-y-5 animate-[fade-in_0.2s_ease]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-[#0B0F19]">Reset Password</h3>
              </div>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="p-1.5 rounded-lg text-[#0B0F19]/30 hover:text-[#0B0F19] hover:bg-[#0B0F19]/[0.04]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSent ? (
              <div className="p-6 text-center space-y-3 bg-[#6E8F75]/10 rounded-2xl border border-[#6E8F75]/20">
                <CheckCircle2 className="w-8 h-8 text-[#6E8F75] mx-auto" />
                <h4 className="text-sm font-bold text-[#0B0F19]">Password Reset Link Dispatched</h4>
                <p className="text-xs text-[#0B0F19]/60 leading-relaxed">
                  We have sent instructions to <strong className="text-[#0B0F19]">{resetEmail}</strong>. Please check your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-[#0B0F19]/55 leading-relaxed">
                  Enter your registered company work email address. We'll send you a secure link to reset your employer portal credentials.
                </p>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0B0F19]/70">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="talent@company.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#0B0F19]/60 hover:bg-[#0B0F19]/[0.04]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] transition-colors shadow-sm"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
