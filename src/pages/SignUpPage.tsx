import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/common';
import {
  Eye,
  EyeOff,
  Check,
  Circle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CANDIDATE SIGN-UP PAGE (CENTERED FLOATING CARD EDITION)
   Clean, hyper-focused, elegant centered card layout with technical grid depth.
   ═══════════════════════════════════════════════════════════════════════════ */

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

/* ── Password validation rules ──────────────────────────────────────────── */

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One number or special character', test: (pw) => /[\d!@#$%^&*(),.?":{}|<>]/.test(pw) },
  { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const ruleResults = useMemo(
    () => passwordRules.map((r) => ({ ...r, passed: r.test(password) })),
    [password],
  );

  const allRulesPassed = ruleResults.every((r) => r.passed);
  const isFormValid = fullName.trim() !== '' && email.trim() !== '' && allRulesPassed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      navigate('/candidates/wizard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between text-[#0B0F19] relative overflow-hidden selection:bg-[#6E8F75]/20 selection:text-[#0B0F19]">

      {/* ── 1. Subtle Engineering Technical Grid ────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(11, 15, 25, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(11, 15, 25, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* ── 2. Diffused Radial Glow behind Central Card ─────────────── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle at center, rgba(110,143,117,0.2) 0%, rgba(11,15,25,0.05) 55%, transparent 75%)',
        }}
      />

      {/* ── Top Header with Centered Brand Logo ─────────────────────── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col items-center justify-center">
        <BrandLogo size="md" href="/" textColor="dark" />
      </header>

      {/* ── Central Floating Card Container ─────────────────────────── */}
      <main className="relative z-10 w-full max-w-[500px] mx-auto px-5 py-4 my-auto animate-[fade-in_0.4s_ease]">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#0B0F19]/[0.05] shadow-[0_24px_70px_-20px_rgba(0,0,0,0.04)] space-y-6">

          {/* Heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6E8F75]/10 border border-[#6E8F75]/20 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6E8F75]" />
              <span className="text-[11px] font-bold text-[#6E8F75] uppercase tracking-wider">
                Candidate Registration
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
              Create your account
            </h1>
            <p className="text-xs sm:text-[13.5px] text-[#0B0F19]/55 leading-relaxed max-w-sm mx-auto">
              Join Jadeer to take AI assessments, build real-world software modules, and earn verified skill proof.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="full-name"
                className="block text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60"
              >
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Ahmad Al-Hassan"
                className="w-full h-11 px-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-sm text-[#0B0F19] font-medium focus:bg-white focus:border-[#6E8F75] focus:ring-2 focus:ring-[#6E8F75]/15 focus:outline-none transition-all placeholder:text-[#0B0F19]/30"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="engineer@domain.com"
                className="w-full h-11 px-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-sm text-[#0B0F19] font-medium focus:bg-white focus:border-[#6E8F75] focus:ring-2 focus:ring-[#6E8F75]/15 focus:outline-none transition-all placeholder:text-[#0B0F19]/30"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a secure password"
                  className="w-full h-11 px-4 pr-11 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-sm text-[#0B0F19] font-medium focus:bg-white focus:border-[#6E8F75] focus:ring-2 focus:ring-[#6E8F75]/15 focus:outline-none transition-all placeholder:text-[#0B0F19]/30"
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0B0F19]/40 hover:text-[#0B0F19] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength checklist */}
              <div className="pt-2 space-y-1.5">
                {ruleResults.map((rule) => (
                  <div
                    key={rule.label}
                    className="flex items-center gap-2 text-[12px] transition-colors duration-200"
                  >
                    <div
                      className={`
                        flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200
                        ${rule.passed
                          ? 'bg-[#6E8F75] border-[#6E8F75]'
                          : 'bg-transparent border-[#0B0F19]/20'
                        }
                      `}
                    >
                      {rule.passed ? (
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      ) : (
                        <Circle className="w-1.5 h-1.5 text-[#0B0F19]/20" fill="currentColor" />
                      )}
                    </div>
                    <span className={rule.passed ? 'text-[#6E8F75] font-semibold' : 'text-[#0B0F19]/45'}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button with Hover-Lift */}
            <button
              id="create-account-btn"
              type="submit"
              disabled={!isFormValid}
              className={`
                w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2
                transition-all duration-300 shadow-md mt-4
                ${isFormValid
                  ? 'bg-[#6E8F75] text-white hover:bg-[#5d7d64] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(110,143,117,0.28)] active:translate-y-0 active:scale-[0.98] cursor-pointer'
                  : 'bg-[#6E8F75]/40 text-white/70 cursor-not-allowed'
                }
              `}
            >
              <span>Continue to Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-1">
            <div className="w-full border-t border-[#0B0F19]/[0.06]" />
            <span className="absolute bg-white px-3 text-[11px] font-semibold text-[#0B0F19]/40 uppercase tracking-wider">
              Or sign up with
            </span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/candidates/wizard')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6] hover:border-[#0B0F19]/20 transition-all text-xs font-semibold"
              title="Sign up with Google"
            >
              <GoogleIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/candidates/wizard')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6] hover:border-[#0B0F19]/20 transition-all text-xs font-semibold"
              title="Sign up with LinkedIn"
            >
              <LinkedInIcon className="w-4 h-4 text-[#0077b5]" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/candidates/wizard')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6] hover:border-[#0B0F19]/20 transition-all text-xs font-semibold"
              title="Sign up with GitHub"
            >
              <GitHubIcon className="w-4 h-4 text-[#0B0F19]" />
            </button>
          </div>

          {/* Footer Link inside card */}
          <div className="pt-2 text-center text-xs text-[#0B0F19]/50">
            Already have an account?{' '}
            <Link
              to="/signin"
              id="signin-link"
              className="font-bold text-[#6E8F75] hover:text-[#5d7d64] transition-colors ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* ── Page Footer ────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-[#0B0F19]/40">
        © {new Date().getFullYear()} Jadeer Talent Validation Platform. Cairo, EG.
      </footer>
    </div>
  );
}
