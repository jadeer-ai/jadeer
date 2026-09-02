import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  Loader2,
} from 'lucide-react';
import { BrandLogo } from '@/components/common';

import { useSignIn } from '@clerk/clerk-react';

/* ── Social Provider Icons ──────────────────────────────────────────────── */

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.1-1.92.98-3.04-.95.04-2.11.64-2.79 1.44-.59.69-1.12 1.83-.98 2.92 1.06.08 2.14-.54 2.79-1.32z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — UNIFIED SIGN IN PAGE WITH ROLE-BASED ROUTING
   ─────────────────────────────────────────────────────────────────────────
   Single entry authentication with automatic role detection (Admin,
   Employer, Graduate, Student) and security rate limiting.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function SignInPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isStudent, setUserRole } = useUserRole();
  const { isOnboarded, completeOnboarding } = useCandidateJourney();
  const { login: adminLogin } = useAdminAuth();
  const { isLoaded: isClerkLoaded, signIn } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'linkedin' | 'github' | 'apple' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitSeconds, setRateLimitSeconds] = useState<number | null>(null);

  // Dynamic rate limit countdown timer
  useEffect(() => {
    if (!rateLimitSeconds || rateLimitSeconds <= 0) return;
    const timer = setInterval(() => {
      setRateLimitSeconds((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitSeconds]);

  // Check URL search parameters for OAuth callback error messages
  useEffect(() => {
    const errParam = searchParams.get('error');
    if (errParam) {
      if (errParam.includes('cancelled') || errParam.includes('access_denied')) {
        setError('Social authentication was cancelled or access was denied.');
      } else {
        setError(`Social authentication error (${errParam.replace(/_/g, ' ')}). Please try again.`);
      }
    }
  }, [searchParams]);

  const handleSocialSignIn = async (provider: 'google' | 'linkedin' | 'github' | 'apple') => {
    setError(null);
    setSocialLoading(provider);

    const strategyMap: Record<string, string> = {
      google: 'oauth_google',
      github: 'oauth_github',
      linkedin: 'oauth_linkedin_oidc',
      apple: 'oauth_apple',
    };

    try {
      if (signIn) {
        await signIn.authenticateWithRedirect({
          strategy: (strategyMap[provider] || `oauth_${provider}`) as any,
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/dashboard',
        });
        return;
      }
    } catch (err: any) {
      console.warn('Clerk OAuth configuration not found. Falling back to local mock authentication...');
    }

    // Direct fallback if Clerk is missing or failed (local dev mock)
    try {
      const res = await AuthService.initiateSocialAuth(provider, {
        role: isStudent ? 'student' : 'graduate',
        mode: 'direct',
      });
      setSocialLoading(null);
      if (res.success) {
        navigate(res.redirectUrl || '/dashboard');
      } else {
        setError(res.error || `Failed to authenticate with ${provider}.`);
      }
    } catch (fallbackErr: any) {
      setSocialLoading(null);
      setError(fallbackErr?.message || `Failed to authenticate with ${provider}.`);
    }
  };

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setRateLimitSeconds(null);
    setIsLoading(true);

    // Call unified authentication service (POST /api/auth/login)
    const result = await AuthService.login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Authentication failed. Please verify credentials.');
      if (result.statusCode === 429 && result.remainingCooldownSeconds) {
        setRateLimitSeconds(result.remainingCooldownSeconds);
      }
      return;
    }

    // Two-Factor Authentication checkpoint
    if (result.requires2fa) {
      navigate(result.redirectUrl || `/verify-otp?email=${encodeURIComponent(email)}&mode=2fa`, {
        state: { email, mode: '2fa' },
      });
      return;
    }

    setIsSuccess(true);

    setTimeout(() => {
      // Automatic Role-Based Redirection: Read user role directly from backend response/token
      const userRole = result.role || result.session?.user?.role;
      const targetUrl = result.redirectUrl;

      if (userRole === 'ADMIN') {
        adminLogin(email, password);
        navigate(targetUrl || '/admin/dashboard');
      } else if (userRole === 'EMPLOYER') {
        navigate(targetUrl || '/employer/dashboard');
      } else if (userRole === 'STUDENT') {
        setUserRole('student');
        navigate(targetUrl || '/student/dashboard');
      } else {
        // Graduate Candidate
        setUserRole('graduate');
        completeOnboarding();
        navigate(targetUrl || '/dashboard');
      }
    }, 400);
  };

  const primaryColorClass = 'text-[#6E8F75]';
  const primaryBgClass = 'bg-[#6E8F75] hover:bg-[#5d7d64]';
  const focusRingClass = 'focus:border-[#6E8F75] focus:ring-[#6E8F75]/15';
  const headerLinkColorClass = 'text-[#6E8F75] hover:text-[#5d7d64]';
  const badgeBgBorderClass = 'bg-[#6E8F75]/10 border-[#6E8F75]/20';
  const checkboxAccentClass = 'text-[#6E8F75] focus:ring-[#6E8F75]';
  const shadowClass = 'hover:shadow-[0_12px_28px_rgba(110,143,117,0.28)]';

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between text-[#0B0F19] relative overflow-hidden selection:bg-[#6E8F75]/20 selection:text-[#0B0F19]">
      {/* ── Background Subtle Tech Pattern & Ambient Glows ───────────── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#0B0F19 1px, transparent 1px), linear-gradient(to right, #0B0F19 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="fixed top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#6E8F75]/10 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0056D6]/8 blur-[130px] pointer-events-none" />

      {/* ── Top Navigation Header ───────────────────────────────────── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
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
      <main className="relative z-10 w-full max-w-md mx-auto px-5 py-8 sm:py-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#0B0F19]/[0.05] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] space-y-6 animate-[fade-in_0.4s_ease]">

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

          {/* Success State Notification */}
          {isSuccess && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs animate-[fade-in_0.2s_ease]">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <p className="font-semibold">Authentication verified. Loading designated workspace...</p>
            </div>
          )}

          {/* Error Alert */}
          {error && !isSuccess && (
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
                  id="signin-email-input"
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
                <label htmlFor="signin-password-input" className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const targetEmail = email.trim() || 'yourname@gmail.com';
                    AuthService.sendOtp(targetEmail);
                    navigate(`/verify-otp?email=${encodeURIComponent(targetEmail)}&mode=reset`, {
                      state: { email: targetEmail, mode: 'reset' },
                    });
                  }}
                  className={`text-[11px] font-semibold ${primaryColorClass} hover:underline cursor-pointer`}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="signin-password-input"
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
              <label htmlFor="signin-remember-me" className="flex items-center gap-2 text-xs text-[#0B0F19]/65 cursor-pointer">
                <input
                  id="signin-remember-me"
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
              id="signin-submit-btn"
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

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-2">
            <div className="w-full border-t border-[#0B0F19]/[0.06]" />
            <span className="absolute bg-white px-3 text-[11px] font-semibold text-[#0B0F19]/40 uppercase tracking-wider">
              Or sign in with
            </span>
          </div>

          {/* Social Logins (Google, LinkedIn, GitHub, Apple) */}
          <div className="grid grid-cols-4 gap-2.5">
            <button
              type="button"
              id="signin-google-btn"
              disabled={socialLoading !== null || isLoading}
              onClick={() => handleSocialSignIn('google')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6] hover:border-[#0B0F19]/20 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50"
              title="Sign in with Google"
              aria-label="Sign in with Google"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="w-4 h-4 text-[#4285F4] animate-spin" />
              ) : (
                <GoogleIcon className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              id="signin-linkedin-btn"
              disabled={socialLoading !== null || isLoading}
              onClick={() => handleSocialSignIn('linkedin')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6] hover:border-[#0B0F19]/20 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50"
              title="Sign in with LinkedIn"
              aria-label="Sign in with LinkedIn"
            >
              {socialLoading === 'linkedin' ? (
                <Loader2 className="w-4 h-4 text-[#0A66C2] animate-spin" />
              ) : (
                <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
              )}
            </button>

            <button
              type="button"
              id="signin-github-btn"
              disabled={socialLoading !== null || isLoading}
              onClick={() => handleSocialSignIn('github')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6] hover:border-[#0B0F19]/20 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50"
              title="Sign in with GitHub"
              aria-label="Sign in with GitHub"
            >
              {socialLoading === 'github' ? (
                <Loader2 className="w-4 h-4 text-[#0B0F19] animate-spin" />
              ) : (
                <GitHubIcon className="w-4 h-4 text-[#0B0F19]" />
              )}
            </button>

            <button
              type="button"
              id="signin-apple-btn"
              disabled={socialLoading !== null || isLoading}
              onClick={() => handleSocialSignIn('apple')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6] hover:border-[#0B0F19]/20 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50"
              title="Sign in with Apple"
              aria-label="Sign in with Apple"
            >
              {socialLoading === 'apple' ? (
                <Loader2 className="w-4 h-4 text-[#0B0F19] animate-spin" />
              ) : (
                <AppleIcon className="w-4 h-4 text-[#0B0F19]" />
              )}
            </button>
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-[#0B0F19]/40">
        © {new Date().getFullYear()} Jadeer Talent Validation Platform. Cryptographically Secured & RBAC Protected.
      </footer>
    </div>
  );
}
