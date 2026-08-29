import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Terminal,
  Database,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminSignInPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.error || 'Authentication failed. Please verify admin credentials.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-between text-white relative overflow-hidden selection:bg-[#6E8F75]/30 selection:text-white">
      {/* ── Background Subtle Tech Grid & Ambient Glows ────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[500px] rounded-full pointer-events-none blur-[120px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #6E8F75 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full pointer-events-none blur-[100px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #4A607A 0%, transparent 70%)',
        }}
      />

      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" textColor="light" href="/" />
          <span className="text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
            Admin Console
          </span>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Portal</span>
        </Link>
      </header>

      {/* ── Main Auth Card ────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px] animate-[scale-in_0.3s_ease-out]">
          {/* Card Container */}
          <div className="bg-[#121824]/90 backdrop-blur-xl border border-white/[0.1] rounded-3xl p-8 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.5)] space-y-7">
            
            {/* Header / Badge */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6E8F75]/20 to-[#6E8F75]/5 border border-[#6E8F75]/30 text-[#82a78a] shadow-[0_0_20px_rgba(110,143,117,0.2)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                System Administration
              </h1>
              <p className="text-[13px] text-white/50 max-w-xs mx-auto">
                Sign in with authorized platform credentials to manage users, job listings, and database telemetry.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs animate-[fade-in_0.2s_ease]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-white/70 block">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@jadeer.io"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-[14px] placeholder:text-white/25 focus:outline-none focus:border-[#6E8F75] focus:ring-2 focus:ring-[#6E8F75]/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-semibold text-white/70 block">
                    Security Key / Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-[14px] placeholder:text-white/25 focus:outline-none focus:border-[#6E8F75] focus:ring-2 focus:ring-[#6E8F75]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#6E8F75] hover:bg-[#5d7d64] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(110,143,117,0.3)] hover:shadow-[0_12px_28px_rgba(110,143,117,0.4)] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate to Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Database connection footer badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
            <Database className="w-3.5 h-3.5 text-[#6E8F75]" />
            <span>Prisma Schema v1.0 • Connected to PostgreSQL models</span>
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-white/30">
        Jadeer Engineering Intelligence Platform • Admin Access Restricted
      </footer>
    </div>
  );
}
