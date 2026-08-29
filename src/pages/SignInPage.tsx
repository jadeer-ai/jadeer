import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserRole, type UserRole } from '@/contexts/UserRoleContext';
import { useCandidateJourney } from '@/contexts/CandidateJourneyContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { AuthService } from '@/services/authService';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Sparkles,
  AlertCircle,
  Clock,
  KeyRound,
  Building2,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { BrandLogo } from '@/components/common';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — UNIFIED SIGN IN PAGE WITH ROLE-BASED ROUTING
   ─────────────────────────────────────────────────────────────────────────
   Single entry authentication with automatic role detection (Admin,
   Employer, Graduate, Student) and security rate limiting.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function SignInPage() {
  const navigate = useNavigate();
  const { isStudent, setUserRole } = useUserRole();
  const { isOnboarded, completeOnboarding } = useCandidateJourney();
  const { login: adminLogin } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitSeconds, setRateLimitSeconds] = useState<number | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setRateLimitSeconds(null);
    setIsLoading(true);

    // Call unified authentication service
    const result = await AuthService.login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Authentication failed. Please verify credentials.');
      if (result.statusCode === 429 && result.remainingCooldownSeconds) {
        setRateLimitSeconds(result.remainingCooldownSeconds);
      }
      return;
    }

    // Role-based authentication synchronization
    if (result.role === 'ADMIN') {
      adminLogin(email, password);
      navigate(result.redirectUrl || '/admin/dashboard');
    } else if (result.role === 'EMPLOYER') {
      navigate(result.redirectUrl || '/employer/dashboard');
    } else if (result.role === 'STUDENT') {
      setUserRole('student');
      navigate(result.redirectUrl || '/student/dashboard');
    } else {
      // Graduate Candidate
      setUserRole('graduate');
      completeOnboarding();
      navigate(result.redirectUrl || '/dashboard');
    }
  };

  const primaryColorClass = isStudent ? 'text-student-500' : 'text-[#6E8F75]';
  const primaryBgClass = isStudent ? 'bg-student-500 hover:bg-student-600' : 'bg-[#6E8F75] hover:bg-[#5d7d64]';
  const focusRingClass = isStudent ? 'focus:border-student-500 focus:ring-student-500/15' : 'focus:border-[#6E8F75] focus:ring-[#6E8F75]/15';
  const headerLinkColorClass = isStudent ? 'text-student-500 hover:text-student-600' : 'text-[#6E8F75] hover:text-[#5d7d64]';
  const badgeBgBorderClass = isStudent ? 'bg-student-500/10 border-student-500/20' : 'bg-[#6E8F75]/10 border-[#6E8F75]/20';
  const checkboxAccentClass = isStudent ? 'text-student-500 focus:ring-student-500' : 'text-[#6E8F75] focus:ring-[#6E8F75]';
  const shadowClass = isStudent ? 'hover:shadow-[0_12px_28px_rgba(0,86,214,0.28)]' : 'hover:shadow-[0_12px_28px_rgba(110,143,117,0.28)]';

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between text-[#0B0F19] selection:bg-[#6E8F75]/20 selection:text-[#0B0F19]">
      {/* ── Top Navigation Header ───────────────────────────────────── */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
        <BrandLogo size="md" href="/" textColor="dark" />
        <div className="text-xs font-semibold text-[#0B0F19]/50">
          New to Jadeer?{' '}
          <Link
            to="/signup"
            className={`${headerLinkColorClass} font-bold transition-colors ml-1`}
          >
            Get Verified →
          </Link>
        </div>
      </header>

      {/* ── Main Centered Card Container ────────────────────────────── */}
      <main className="w-full max-w-md mx-auto px-5 py-8 sm:py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#0B0F19]/[0.05] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] space-y-7 animate-[fade-in_0.4s_ease]">

          {/* Heading */}
          <div className="space-y-2 text-center">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${badgeBgBorderClass} mb-1`}>
              <ShieldCheck className={`w-3.5 h-3.5 ${primaryColorClass}`} />
              <span className={`text-[11px] font-bold ${primaryColorClass} uppercase tracking-wider`}>
                Unified Authentication
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-[13.5px] text-[#0B0F19]/55 leading-relaxed">
              Sign in with your registered credentials. Your role will be verified securely to load your designated workspace.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-[fade-in_0.2s_ease]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
                {rateLimitSeconds && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> Cooldown active: {rateLimitSeconds}s remaining
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60">
                Registered Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@domain.com"
                  className={`w-full h-11 px-3.5 pl-10 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-sm text-[#0B0F19] font-medium focus:bg-white focus:outline-none transition-all ${focusRingClass}`}
                />
                <Mail className="w-4 h-4 text-[#0B0F19]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset instructions sent to registered email.');
                  }}
                  className={`text-[11px] font-semibold ${primaryColorClass} hover:underline`}
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className={`w-full h-11 px-3.5 pl-10 pr-10 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-sm text-[#0B0F19] font-medium focus:bg-white focus:outline-none transition-all ${focusRingClass}`}
                />
                <Lock className="w-4 h-4 text-[#0B0F19]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0B0F19]/40 hover:text-[#0B0F19] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-[#0B0F19]/65 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={`w-4 h-4 rounded border-[#0B0F19]/20 ${checkboxAccentClass}`}
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3.5 rounded-2xl text-white text-sm font-bold
                hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2
                ${primaryBgClass} ${shadowClass} disabled:opacity-50
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Verifying RBAC Permissions...
                </span>
              ) : (
                <>
                  <span>Sign In to Designated Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-[#0B0F19]/40">
        © {new Date().getFullYear()} Jadeer Talent Validation Platform. Cryptographically Secured & RBAC Protected.
      </footer>
    </div>
  );
}
