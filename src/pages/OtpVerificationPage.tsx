import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent, type ClipboardEvent } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useCandidateJourney } from '@/contexts/CandidateJourneyContext';
import { AuthService } from '@/services/authService';
import { BrandLogo } from '@/components/common';
import {
  ShieldCheck,
  ArrowRight,
  RotateCw,
  Mail,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — SECURE EMAIL OTP VERIFICATION PAGE
   ─────────────────────────────────────────────────────────────────────────
   6-Digit Minimalist Input Boxes with Auto-Advance, Paste Recognition,
   Resend Countdown Timer, and RBAC Onboarding Synchronization.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { userRole, setUserRole, bindTrack } = useUserRole();
  const { completeOnboarding } = useCandidateJourney();

  // Extract query params or state passed from SignUp/SignIn
  const emailParam = searchParams.get('email') || (location.state as any)?.email || 'yourname@gmail.com';
  const roleParam = searchParams.get('role') || (location.state as any)?.role || 'graduate';
  const trackParam = searchParams.get('track') || (location.state as any)?.track || 'General Engineering';
  const mode = searchParams.get('mode') || (location.state as any)?.mode || 'signup'; // 'signup' | 'reset'

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isResending, setIsResending] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Trigger initial OTP dispatch on page load
  useEffect(() => {
    let isMounted = true;
    AuthService.sendOtp(emailParam, mode === 'signup' ? 'setup' : 'login').then((dispatch) => {
      if (isMounted && dispatch.success && dispatch.code) {
        setDemoCode(dispatch.code);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [emailParam, mode]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const fullCode = digits.join('');
  const isComplete = digits.every((d) => d.length === 1);

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    setError(null);
    const cleaned = value.replace(/\D/g, '');

    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    // Single digit input
    const char = cleaned[cleaned.length - 1];
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance to next input
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and keyboard navigation
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle full 6-digit paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pasted.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setDigits(newDigits);

      // Focus last populated or next available input
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  // Verification submission
  const handleVerify = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!isComplete || isVerifying) return;

    setError(null);
    setIsVerifying(true);

    const result = await AuthService.verifyOtp(emailParam, fullCode, mode === 'signup' ? 'setup' : 'login');

    if (!result.success) {
      setIsVerifying(false);
      setError(result.error || 'Invalid verification code. Please try again.');
      return;
    }

    // Success transition
    setSuccess(true);
    setIsVerifying(false);

    // Synchronize role and onboarding state
    if (mode === 'signup') {
      setUserRole(roleParam === 'student' ? 'student' : 'graduate');
      bindTrack(trackParam);
      completeOnboarding();
      setTimeout(() => {
        navigate('/candidates/wizard');
      }, 1200);
    } else {
      // Password reset or 2FA login mode
      setTimeout(() => {
        navigate(result.session ? '/dashboard' : '/signin');
      }, 1400);
    }
  };

  // Auto-verify when 6th digit is typed
  useEffect(() => {
    if (isComplete && !success && !error && !isVerifying) {
      handleVerify();
    }
  }, [fullCode, isComplete]);

  // Resend OTP action
  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setError(null);

    const result = await AuthService.resendOtp(emailParam, mode === 'signup' ? 'setup' : 'login');
    setIsResending(false);

    if (result.success) {
      setResendTimer(60);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      if (result.code) {
        setDemoCode(result.code);
      }
    } else {
      setError(result.error || 'Failed to resend code. Please try again.');
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
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <BrandLogo size="md" href="/" textColor="dark" />
        <Link
          to="/signup"
          className="text-xs font-semibold text-[#0B0F19]/50 hover:text-[#6E8F75] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Registration</span>
        </Link>
      </header>

      {/* ── Central Floating Verification Card ──────────────────────── */}
      <main className="relative z-10 w-full max-w-[500px] mx-auto px-5 py-6 my-auto animate-[fade-in_0.4s_ease]">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#0B0F19]/[0.05] shadow-[0_24px_70px_-20px_rgba(0,0,0,0.04)] space-y-6">

          {/* Top Demo Simulation Banner (For immediate testing) */}
          {demoCode && !success && (
            <div className="p-3 rounded-2xl bg-[#6E8F75]/10 border border-[#6E8F75]/25 text-[#2D5A3A] text-xs flex items-center justify-between animate-[fade-in_0.3s_ease]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6E8F75] shrink-0" />
                <span>
                  Simulated OTP code: <strong className="font-mono text-sm tracking-widest bg-white/70 px-2 py-0.5 rounded-lg border border-[#6E8F75]/20">{demoCode}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const demoDigits = demoCode.split('');
                  setDigits(demoDigits);
                }}
                className="text-[11px] font-bold text-[#2D5A3A] hover:underline uppercase tracking-wider cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>
          )}

          {/* Heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-[#6E8F75]/10 border-[#6E8F75]/20 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6E8F75]" />
              <span className="text-[11px] font-bold text-[#6E8F75] uppercase tracking-wider">
                Two-Factor Security
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
              {mode === 'reset' ? 'Verify Password Reset' : 'Verify your email'}
            </h1>

            <p className="text-xs sm:text-[13.5px] text-[#0B0F19]/60 leading-relaxed max-w-sm mx-auto">
              We've dispatched a 6-digit verification code to:
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-mono font-semibold text-[#0B0F19]">
              <Mail className="w-3.5 h-3.5 text-[#6E8F75]" />
              <span>{emailParam}</span>
              <Link
                to="/signup"
                className="text-[11px] font-sans font-bold text-[#6E8F75] hover:underline ml-1"
                title="Change email"
              >
                Edit
              </Link>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-[shake_0.4s_ease]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
                <p className="text-[11px] text-rose-600 mt-0.5">
                  You can also use the default sandbox code <code className="font-mono font-bold bg-white px-1 py-0.5 rounded border border-rose-200">123456</code>.
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2 animate-[scale-in_0.3s_ease]">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-950">Email Verified Successfully</h3>
              <p className="text-xs text-emerald-700">
                {mode === 'signup' ? 'Securing candidate workspace and launching calibration wizard...' : 'Authentication verified. Redirecting...'}
              </p>
            </div>
          )}

          {/* Verification Form */}
          {!success && (
            <form onSubmit={handleVerify} className="space-y-6 pt-2">
              {/* 6-Digit Minimalist Input Boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    disabled={isVerifying}
                    className={`
                      w-11 sm:w-13 h-14 sm:h-15 text-center text-xl sm:text-2xl font-mono font-extrabold
                      rounded-2xl bg-[#FAF9F6] border text-[#0B0F19] transition-all duration-200
                      focus:bg-white focus:outline-none focus:scale-105
                      ${digit
                        ? 'border-[#6E8F75] bg-white text-[#6E8F75] shadow-xs'
                        : 'border-[#0B0F19]/10'
                      }
                      ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : 'focus:border-[#6E8F75] focus:ring-4 focus:ring-[#6E8F75]/15'}
                    `}
                  />
                ))}
              </div>

              {/* Verify & Submit Button */}
              <button
                id="verify-otp-btn"
                type="submit"
                disabled={!isComplete || isVerifying}
                className={`
                  w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2
                  transition-all duration-300 shadow-md cursor-pointer
                  ${isComplete && !isVerifying
                    ? 'bg-[#6E8F75] text-white hover:bg-[#5d7d64] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] hover:shadow-[0_12px_28px_rgba(110,143,117,0.28)]'
                    : 'bg-[#6E8F75]/30 text-white/70 cursor-not-allowed'
                  }
                `}
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Validating Security Token...
                  </span>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend Code Section with Countdown Timer */}
              <div className="text-center space-y-1.5 pt-2">
                <div className="text-xs text-[#0B0F19]/55">
                  Didn't receive the verification email?
                </div>

                {resendTimer > 0 ? (
                  <div className="text-xs font-semibold text-[#0B0F19]/45 font-mono flex items-center justify-center gap-1.5">
                    <RotateCw className="w-3 h-3 animate-spin text-[#6E8F75]" />
                    <span>Resend code in <strong className="text-[#0B0F19]">{resendTimer}s</strong></span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-xs font-bold text-[#6E8F75] hover:text-[#5d7d64] hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Resend Code Now</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Security Footnote */}
          <div className="pt-2 border-t border-[#0B0F19]/[0.05] flex items-center justify-center gap-1.5 text-[10.5px] font-semibold text-[#0B0F19]/40">
            <Lock className="w-3 h-3 text-[#6E8F75]" />
            <span>256-bit Encrypted Token Verification • Expiring in 5 minutes</span>
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
