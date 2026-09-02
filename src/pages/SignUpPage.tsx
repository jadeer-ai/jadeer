import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { AuthService } from '@/services/authService';
import { BrandLogo } from '@/components/common';
import { useSignUp } from '@clerk/clerk-react';
import {
  Eye,
  EyeOff,
  Check,
  Circle,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  GraduationCap,
  Briefcase,
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

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.1-1.92.98-3.04-.95.04-2.11.64-2.79 1.44-.59.69-1.12 1.83-.98 2.92 1.06.08 2.14-.54 2.79-1.32z" />
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

const softwareTracks = [
  'Backend Development',
  'Frontend Development',
  'Full-Stack Engineering',
  'Embedded Systems & IoT',
  'Mobile Development',
  'DevOps & Cloud Infrastructure',
  'Data Engineering & Analytics',
  'AI / Machine Learning',
  'Cybersecurity & Systems',
  'Add Custom Track...',
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const { userRole, setUserRole, bindTrack } = useUserRole();
  const { updateProfile } = useUserProfile();
  const [candidateType, setCandidateType] = useState<'student' | 'grad'>(
    userRole === 'student' ? 'student' : 'grad'
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(softwareTracks[0]);
  const [customTrack, setCustomTrack] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'linkedin' | 'github' | 'apple' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signUp } = useSignUp();

  const handleRoleToggle = (type: 'student' | 'grad') => {
    setCandidateType(type);
    setUserRole(type);
    updateProfile({ role: type });
    try {
      localStorage.setItem('jadeer-user-role', type);
    } catch {
      // ignore
    }
  };

  const isCustomTrack = selectedTrack === 'Add Custom Track...';
  const effectiveTrack = isCustomTrack ? customTrack.trim() : selectedTrack;

  const handleSocialSignUp = async (provider: 'google' | 'linkedin' | 'github' | 'apple') => {
    setError(null);
    setSocialLoading(provider);

    const strategyMap: Record<string, string> = {
      google: 'oauth_google',
      github: 'oauth_github',
      linkedin: 'oauth_linkedin_oidc',
      apple: 'oauth_apple',
    };

    try {
      setUserRole(candidateType);
      updateProfile({ role: candidateType, track: effectiveTrack || 'General Engineering' });
      try {
        localStorage.setItem('jadeer-user-role', candidateType);
      } catch {
        // ignore
      }

      if (signUp) {
        await signUp.authenticateWithRedirect({
          strategy: (strategyMap[provider] || `oauth_${provider}`) as any,
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/dashboard',
          unsafeMetadata: {
            role: candidateType,
            track: effectiveTrack || 'General Engineering',
          },
        });
        return;
      }

      // Direct fallback if Clerk is still mounting
      const res = await AuthService.initiateSocialAuth(provider, {
        role: candidateType,
        track: effectiveTrack || 'General Engineering',
        mode: 'direct',
      });
      setSocialLoading(null);
      if (!res.success) {
        setError(res.error || `Failed to sign up with ${provider}.`);
      }
    } catch (err: any) {
      setSocialLoading(null);
      setError(err?.errors?.[0]?.longMessage || err?.message || `Failed to sign up with ${provider}.`);
    }
  };

  const ruleResults = useMemo(
    () => passwordRules.map((r) => ({ ...r, passed: r.test(password) })),
    [password],
  );

  const allRulesPassed = ruleResults.every((r) => r.passed);
  const isTrackValid = !isCustomTrack || customTrack.trim().length > 0;
  const isFormValid = fullName.trim() !== '' && email.trim() !== '' && allRulesPassed && isTrackValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setError(null);
    setIsLoading(true);

    // If Clerk signUp is available, attempt Clerk signup with unsafeMetadata
    if (signUp) {
      try {
        await signUp.create({
          emailAddress: email,
          password,
          firstName: fullName.split(' ')[0] || fullName,
          lastName: fullName.split(' ').slice(1).join(' ') || '',
          unsafeMetadata: {
            role: candidateType,
            track: effectiveTrack || 'General Engineering',
          },
        });
      } catch (clerkErr) {
        console.warn('Clerk background registration note:', clerkErr);
      }
    }

    const res = await AuthService.register({
      name: fullName,
      email,
      password,
      role: candidateType,
      track: effectiveTrack || 'General Engineering',
    });

    setIsLoading(false);

    if (res.success) {
      setUserRole(candidateType);
      updateProfile({
        fullName,
        email,
        role: candidateType,
        track: effectiveTrack || 'General Engineering',
      });
      bindTrack(effectiveTrack || 'General Engineering');
      try {
        localStorage.setItem('jadeer-user-role', candidateType);
      } catch {
        // ignore
      }
      navigate(res.redirectUrl || '/candidates/wizard');
    } else {
      setError(res.error || 'Registration failed. Please check your information and try again.');
    }
  };

  const primaryColorClass = 'text-[#5E8174]';
  const primaryBgClass = 'bg-[#5E8174] hover:bg-[#4D6D62]';
  const focusRingClass = 'focus:border-[#5E8174] focus:ring-2 focus:ring-[#5E8174]/15';
  const headerLinkColorClass = 'text-[#5E8174] hover:text-[#4D6D62]';
  const badgeBgBorderClass = 'bg-[#5E8174]/10 border-[#5E8174]/20';
  const shadowClass = 'hover:shadow-[0_8px_20px_rgba(94,129,116,0.25)]';

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between text-[#0F172A] relative overflow-hidden selection:bg-[#5E8174]/20 selection:text-[#0F172A]">

      {/* ── 1. Subtle Engineering Technical Grid ────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* ── 2. Diffused Radial Glow behind Central Card ─────────────── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle at center, rgba(94,129,116,0.12) 0%, rgba(15,23,42,0.02) 55%, transparent 75%)',
        }}
      />

      {/* ── Top Header with Centered Brand Logo ─────────────────────── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col items-center justify-center">
        <BrandLogo size="md" href="/" textColor="dark" />
      </header>

      {/* ── Central Floating Card Container ─────────────────────────── */}
      <main className="relative z-10 w-full max-w-[540px] mx-auto px-5 py-4 my-auto animate-[fade-in_0.4s_ease]">
        <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.04)] space-y-6">

          {/* Heading */}
          <div className="text-center space-y-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${badgeBgBorderClass} mb-1`}>
              <ShieldCheck className={`w-3.5 h-3.5 ${primaryColorClass}`} />
              <span className={`text-[11px] font-bold ${primaryColorClass} uppercase tracking-wider`}>
                Talent Registration
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Create your talent account
            </h1>
            <p className="text-xs sm:text-[13px] text-[#334155] leading-relaxed max-w-sm mx-auto">
              Join Jadeer's talent network to validate skills, book mentor calibration sessions, and unlock direct hiring pipelines.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-[fade-in_0.2s_ease]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
              </div>
            </div>
          )}

          {/* ── REQUIRED ROLE SELECTOR STEP: "I am a: [Student...] | [Graduate...]" ── */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#334155]">
              I am a: <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                id="toggle-candidate-student"
                onClick={() => handleRoleToggle('student')}
                className={`
                  flex flex-col items-start text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative
                  ${candidateType === 'student'
                    ? 'bg-[#5E8174]/5 border-[#5E8174] text-[#0F172A] shadow-sm ring-1 ring-[#5E8174]/20'
                    : 'bg-white border-slate-200/90 text-[#334155] hover:border-slate-300 hover:bg-slate-50/50'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1 w-full justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <GraduationCap className={`w-4 h-4 ${candidateType === 'student' ? 'text-[#5E8174]' : 'text-[#334155]'}`} />
                    <span>Student</span>
                  </div>
                  {candidateType === 'student' && (
                    <span className="w-2 h-2 rounded-full bg-[#5E8174]" />
                  )}
                </div>
                <span className="text-[11px] text-[#334155]/80 font-medium leading-snug">
                  Seeking Internships & Co-ops
                </span>
              </button>

              <button
                type="button"
                id="toggle-candidate-graduate"
                onClick={() => handleRoleToggle('grad')}
                className={`
                  flex flex-col items-start text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative
                  ${candidateType === 'grad'
                    ? 'bg-[#5E8174]/5 border-[#5E8174] text-[#0F172A] shadow-sm ring-1 ring-[#5E8174]/20'
                    : 'bg-white border-slate-200/90 text-[#334155] hover:border-slate-300 hover:bg-slate-50/50'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1 w-full justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Briefcase className={`w-4 h-4 ${candidateType === 'grad' ? 'text-[#5E8174]' : 'text-[#334155]'}`} />
                    <span>Graduate</span>
                  </div>
                  {candidateType === 'grad' && (
                    <span className="w-2 h-2 rounded-full bg-[#5E8174]" />
                  )}
                </div>
                <span className="text-[11px] text-[#334155]/80 font-medium leading-snug">
                  Seeking Full-Time Roles
                </span>
              </button>
            </div>

            <p className="text-[11px] text-[#334155]/70 italic pt-0.5">
              {candidateType === 'student'
                ? '• Tailors AI assessments and matching feeds for university internship and co-op benchmarks.'
                : '• Calibrates AI assessments and matching feeds for junior & full-time engineering hiring gates.'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="full-name"
                className="block text-xs font-bold uppercase tracking-wider text-[#334155]"
              >
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Ahmad Al-Hassan"
                className={`w-full h-11 px-4 rounded-2xl bg-white border border-slate-200 text-sm text-[#0F172A] font-medium focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 ${focusRingClass}`}
              />
            </div>

            {/* Technical Domain / Track (With Custom Input Option) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="tech-track"
                  className="block text-xs font-bold uppercase tracking-wider text-[#334155]"
                >
                  Technical Track <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2.5 py-0.5 rounded-full border border-[#5E8174]/20">
                  Locked upon signup
                </span>
              </div>
              <select
                id="tech-track"
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className={`w-full h-11 px-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-[#0F172A] font-medium focus:bg-white focus:outline-none transition-all ${focusRingClass}`}
              >
                {softwareTracks.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Custom Track Input Field */}
              {isCustomTrack && (
                <div className="pt-1 animate-[fade-in_0.3s_ease]">
                  <input
                    id="custom-tech-track"
                    type="text"
                    value={customTrack}
                    onChange={(e) => setCustomTrack(e.target.value)}
                    required
                    placeholder="Enter your custom engineering track (e.g. Distributed Systems)"
                    className={`w-full h-11 px-4 rounded-2xl bg-white border border-slate-200 text-sm text-[#0F172A] font-medium focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 ${focusRingClass}`}
                  />
                </div>
              )}

              <p className="text-[10.5px] text-[#334155]/70 leading-tight">
                Your technical track anchors your AI assessment algorithms and live evidence dossier.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-[#334155]"
              >
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="yourname@gmail.com"
                className={`w-full h-11 px-4 rounded-2xl bg-white border border-slate-200 text-sm text-[#0F172A] font-medium focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 ${focusRingClass}`}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[#334155]"
              >
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a secure password"
                  className={`w-full h-11 px-4 pr-11 rounded-2xl bg-white border border-slate-200 text-sm text-[#0F172A] font-medium focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 ${focusRingClass}`}
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F172A] transition-colors cursor-pointer"
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
                          ? 'bg-[#5E8174] border-[#5E8174]'
                          : 'bg-transparent border-slate-300'
                        }
                      `}
                    >
                      {rule.passed ? (
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      ) : (
                        <Circle className="w-1.5 h-1.5 text-slate-300" fill="currentColor" />
                      )}
                    </div>
                    <span className={rule.passed ? `${primaryColorClass} font-semibold` : 'text-[#334155]'}>
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
              disabled={!isFormValid || isLoading}
              className={`
                w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2
                transition-all duration-200 shadow-sm mt-4
                ${isFormValid && !isLoading
                  ? `${primaryBgClass} ${shadowClass} text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer`
                  : 'bg-[#5E8174]/40 text-white/70 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span>Creating Candidate Account...</span>
                </span>
              ) : (
                <>
                  <span>Create Talent Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-1">
            <div className="w-full border-t border-slate-200/80" />
            <span className="absolute bg-white px-3 text-[11px] font-semibold text-[#334155] uppercase tracking-wider">
              Or sign up with
            </span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-4 gap-2.5">
            <button
              type="button"
              id="signup-google-btn"
              disabled={socialLoading !== null}
              onClick={() => handleSocialSignUp('google')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50 shadow-2xs"
              title="Sign up with Google"
              aria-label="Sign up with Google"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="w-4 h-4 text-[#4285F4] animate-spin" />
              ) : (
                <GoogleIcon className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              id="signup-linkedin-btn"
              disabled={socialLoading !== null}
              onClick={() => handleSocialSignUp('linkedin')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50 shadow-2xs"
              title="Sign up with LinkedIn"
              aria-label="Sign up with LinkedIn"
            >
              {socialLoading === 'linkedin' ? (
                <Loader2 className="w-4 h-4 text-[#0A66C2] animate-spin" />
              ) : (
                <LinkedInIcon className="w-4 h-4 text-[#0077b5]" />
              )}
            </button>

            <button
              type="button"
              id="signup-github-btn"
              disabled={socialLoading !== null}
              onClick={() => handleSocialSignUp('github')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50 shadow-2xs"
              title="Sign up with GitHub"
              aria-label="Sign up with GitHub"
            >
              {socialLoading === 'github' ? (
                <Loader2 className="w-4 h-4 text-[#0F172A] animate-spin" />
              ) : (
                <GitHubIcon className="w-4 h-4 text-[#0F172A]" />
              )}
            </button>

            <button
              type="button"
              id="signup-apple-btn"
              disabled={socialLoading !== null}
              onClick={() => handleSocialSignUp('apple')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50 shadow-2xs"
              title="Sign up with Apple"
              aria-label="Sign up with Apple"
            >
              {socialLoading === 'apple' ? (
                <Loader2 className="w-4 h-4 text-[#0F172A] animate-spin" />
              ) : (
                <AppleIcon className="w-4 h-4 text-[#0F172A]" />
              )}
            </button>
          </div>

          {/* Footer Link inside card */}
          <div className="pt-2 text-center text-xs text-[#334155]">
            Already have an account?{' '}
            <Link
              to="/signin"
              id="signin-link"
              className={`font-bold ${headerLinkColorClass} transition-colors ml-1`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* ── Page Footer ────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-[#334155]/70">
        © {new Date().getFullYear()} Jadeer Talent Validation Platform. Cairo, EG.
      </footer>
    </div>
  );
}
