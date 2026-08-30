import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import {
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  BrainCircuit,
  FileCheck2,
  ShieldCheck,
  Terminal,
  GraduationCap,
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  Cpu,
  Code2,
  Database,
  Award,
  Layers,
  Zap,
  ArrowUpRight,
  Sliders,
  Check,
} from 'lucide-react';
import { BrandLogo } from '@/components/common';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER LANDING PAGE — SIGNATURE BRAND IDENTITY (EMERALD & DEEP NAVY)
   - Palette:
     • Canvas & Surfaces: Crisp Off-White (#F8FAFC) & Pure White (#FFFFFF)
     • Primary Brand: Deep Charcoal Navy (#0A192F / #0F172A / #1E293B)
     • Accent Brand: Jadeer Signature Emerald Green (#10B981 / #059669 / #6E8F75)
     • Muted / Body Text: Slate Gray (#64748B / #475569)
   - Layout:
     • Floating pill capsule navbar
     • Centered 3-line headline with exact Jadeer Brand color tokens
     • Subtle vector isometric grid with floating geometric wireframe cubes
     • Zero skyline photos / textures — clean, daylight, software architecture focus
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Navigation Links ───────────────────────────────────────────────────── */
const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Validation Pipeline', href: '#pipeline' },
  { label: 'Evidence Dossier', href: '#evidence' },
];

/* ── Subtle Vector Isometric Wireframe Grid Canvas ───────────────────────── */
function SubtleIsometricWireframeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Underlying Architectural Perspective Grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, #000 30%, transparent 80%)',
        }}
      />

      {/* 2. Vector Isometric Wireframe Cubes & Neural Data Nodes */}
      <svg
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[1500px] h-[850px] opacity-[0.32]"
        viewBox="0 0 1500 850"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#0F172A" strokeWidth="1">
          {/* ── Cube 1: Far Left High (Emerald Accent) ── */}
          <polygon points="180,180 230,150 280,180 230,210" fill="#FFFFFF" fillOpacity="0.8" stroke="#10B981" strokeWidth="1.2" />
          <polygon points="180,180 230,210 230,265 180,235" fill="#10B981" fillOpacity="0.08" stroke="#10B981" strokeWidth="1.2" />
          <polygon points="230,210 280,180 280,235 230,265" fill="#0F172A" fillOpacity="0.04" stroke="#10B981" strokeWidth="1.2" />

          {/* ── Cube 2: Mid-Left Floating Cubelet ── */}
          <polygon points="380,280 420,255 460,280 420,305" fill="#FFFFFF" fillOpacity="0.75" stroke="#64748B" strokeWidth="0.9" />
          <polygon points="380,280 420,305 420,350 380,325" fill="#64748B" fillOpacity="0.06" stroke="#64748B" strokeWidth="0.9" />
          <polygon points="420,305 460,280 460,325 420,350" fill="#0F172A" fillOpacity="0.04" stroke="#64748B" strokeWidth="0.9" />

          {/* ── Cube 3: Top Center Subtly Hovering Wireframe ── */}
          <polygon points="700,100 755,65 810,100 755,135" fill="#FFFFFF" fillOpacity="0.85" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3 3" />
          <polygon points="700,100 755,135 755,195 700,160" fill="#10B981" fillOpacity="0.05" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3 3" />
          <polygon points="755,135 810,100 810,160 755,195" fill="#0F172A" fillOpacity="0.03" stroke="#10B981" strokeWidth="1.2" strokeDasharray="3 3" />

          {/* ── Cube 4: Mid-Right Floating Isometric Block ── */}
          <polygon points="1060,260 1105,235 1150,260 1105,285" fill="#FFFFFF" fillOpacity="0.75" stroke="#64748B" strokeWidth="0.9" />
          <polygon points="1060,260 1105,285 1105,335 1060,310" fill="#64748B" fillOpacity="0.06" stroke="#64748B" strokeWidth="0.9" />
          <polygon points="1105,285 1150,260 1150,310 1105,335" fill="#0F172A" fillOpacity="0.04" stroke="#64748B" strokeWidth="0.9" />

          {/* ── Cube 5: Far Right High (Emerald Accent) ── */}
          <polygon points="1240,160 1290,130 1340,160 1290,190" fill="#FFFFFF" fillOpacity="0.8" stroke="#10B981" strokeWidth="1.2" />
          <polygon points="1240,160 1290,190 1290,245 1240,215" fill="#10B981" fillOpacity="0.08" stroke="#10B981" strokeWidth="1.2" />
          <polygon points="1290,190 1340,160 1340,215 1290,245" fill="#0F172A" fillOpacity="0.04" stroke="#10B981" strokeWidth="1.2" />

          {/* ── Connecting Vector Telemetry Grid & Data Nodes ── */}
          <line x1="230" y1="265" x2="420" y2="255" stroke="#10B981" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.45" />
          <line x1="420" y1="305" x2="755" y2="195" stroke="#64748B" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.35" />
          <line x1="755" y1="195" x2="1105" y2="235" stroke="#64748B" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.35" />
          <line x1="1105" y1="285" x2="1290" y2="245" stroke="#10B981" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.45" />

          {/* Glowing Neural Vertex Markers */}
          <circle cx="230" cy="210" r="3" fill="#10B981" />
          <circle cx="420" cy="280" r="2.5" fill="#64748B" />
          <circle cx="755" cy="135" r="3.5" fill="#10B981" />
          <circle cx="1105" cy="260" r="2.5" fill="#64748B" />
          <circle cx="1290" cy="190" r="3" fill="#10B981" />
        </g>
      </svg>

      {/* 3. Soft Radial Glow Halo in Jadeer Emerald */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 55% at 50% 25%, rgba(16, 185, 129, 0.07) 0%, rgba(15, 23, 42, 0.03) 40%, transparent 75%),
            linear-gradient(to bottom, rgba(248, 250, 252, 0) 0%, rgba(248, 250, 252, 0.6) 50%, #F8FAFC 90%, #F8FAFC 100%)
          `,
        }}
      />
    </div>
  );
}

/* ── Floating Capsule Navbar Component ───────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)]'
          : 'bg-transparent border-b border-slate-200/50'
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="flex h-[76px] items-center justify-between">

          {/* ── Brand Logo with signature green mark ────────────────── */}
          <BrandLogo size="md" href="/" textColor="dark" />

          {/* ── Center Frosted Pill Navigation Capsule ──────────────── */}
          <div className="hidden md:flex items-center gap-6 bg-white/90 backdrop-blur-md px-8 py-2.5 rounded-full border border-slate-200/70 shadow-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  text-[13.5px] font-semibold text-[#64748B]
                  transition-colors duration-200 hover:text-[#0F172A]
                "
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Desktop Actions (Green & Navy Accent) ───────────────── */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/employer"
              id="nav-for-companies"
              className="
                px-3 py-2 text-[14px] font-semibold text-[#64748B]
                transition-colors duration-200 hover:text-[#0F172A]
              "
            >
              For Companies
            </Link>

            <SignedOut>
              <Link
                to="/signin"
                id="nav-signin"
                className="
                  px-3 py-2 text-[14px] font-semibold text-[#0F172A]
                  transition-colors duration-200 hover:text-emerald-600
                "
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                id="nav-join-talent"
                className="
                  inline-flex items-center gap-1.5 px-5 py-2.5
                  bg-[#10B981] text-white text-[13.5px] font-bold
                  rounded-full transition-all duration-300
                  hover:bg-[#059669] hover:-translate-y-0.5
                  hover:shadow-[0_8px_20px_rgba(16,185,129,0.35)]
                  active:translate-y-0 active:scale-[0.98] shadow-sm
                "
              >
                <span>Join as Talent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                to="/dashboard"
                id="nav-dashboard"
                className="
                  px-3 py-2 text-[14px] font-semibold text-[#0F172A]
                  transition-colors duration-200 hover:text-emerald-600
                "
              >
                Dashboard
              </Link>
              <div className="flex items-center pl-1">
                <UserButton />
              </div>
            </SignedIn>
          </div>

          {/* ── Mobile Menu Toggle ─────────────────────────────────── */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-[#0F172A] hover:bg-white/80 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Panel ──────────────────────────────────────── */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-out
          ${mobileOpen ? 'max-h-[380px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="bg-white border-t border-slate-200/80 px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-[15px] font-semibold text-[#64748B] hover:text-[#0F172A] rounded-xl hover:bg-slate-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200/80 flex flex-col gap-2.5">
            <Link
              to="/employer"
              id="mobile-nav-for-companies"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-3 text-sm font-bold text-[#0F172A] rounded-2xl bg-slate-100 hover:bg-slate-200"
            >
              For Companies
            </Link>

            <SignedOut>
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-[#0F172A] rounded-2xl bg-slate-100 hover:bg-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-white rounded-2xl bg-[#10B981] hover:bg-[#059669]"
              >
                Join as Talent →
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center justify-between py-2.5 px-3 rounded-2xl bg-slate-100">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-[#0F172A] hover:text-emerald-600"
                >
                  Dashboard →
                </Link>
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CENTERED HERO SECTION: JADEER SIGNATURE GREEN & NAVY PALETTE
   ═══════════════════════════════════════════════════════════════════════════ */

function CenteredHeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 sm:pt-48 pb-20 sm:pb-32">
      {/* Subtle Vector Isometric Wireframe Background */}
      <SubtleIsometricWireframeBackground />

      <div className="relative mx-auto max-w-5xl px-6 sm:px-10 lg:px-12 text-center z-10 space-y-8 sm:space-y-10">

        {/* ── Pre-headline Eyebrow Badge with Green Dot ── */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] backdrop-blur-sm animate-[fade-in_0.5s_ease]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-extrabold text-[#64748B] uppercase tracking-widest">
            JADEER • TECHNICAL VALIDATION MATRIX
          </span>
        </div>

        {/* ── Centered Main Headline Split into 3 Lines with Jadeer Colors ── */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.14] tracking-tight">
            {/* Line 1: Deep Navy (#0F172A) */}
            <span className="block text-[#0F172A]">
              Your Mentality.
            </span>

            {/* Line 2: Deep Navy with Subtle Slate (#1E293B) */}
            <span className="block text-[#1E293B]">
              Our Matrix.
            </span>

            {/* Line 3: Jadeer Signature Emerald Green (#10B981 / #059669) */}
            <span className="block text-[#10B981]">
              Their Peace of Mind.
            </span>
          </h1>
        </div>

        {/* ── Refined Editorial Subtitle ── */}
        <p className="text-base sm:text-lg lg:text-[18.5px] text-[#64748B] leading-[1.7] max-w-2xl mx-auto font-normal">
          A unified engineering validation platform designed to certify true technical depth through adaptive AI code probing, 1-to-1 Principal Architect defense, and verifiable evidence dossiers.
        </p>

        {/* ── Centered Smooth Pill Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/signup"
            id="hero-join-talent-btn"
            className="
              w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5
              bg-[#10B981] text-white text-[15px] font-bold rounded-full
              transition-all duration-300 hover:bg-[#059669] hover:-translate-y-0.5
              hover:shadow-[0_12px_28px_rgba(16,185,129,0.32)] active:scale-[0.98] shadow-md
            "
          >
            <span>Launch Assessment</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>

          <Link
            to="/signin"
            id="hero-signin-btn"
            className="
              w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5
              bg-white text-[#0F172A] border border-slate-200/90
              text-[15px] font-bold rounded-full transition-all duration-300
              hover:border-emerald-300 hover:bg-slate-50 hover:-translate-y-0.5
              active:scale-[0.98] shadow-2xs
            "
          >
            <span>Access Candidate Portal</span>
          </Link>
        </div>

        {/* ── Centered Trust & Calibration Indicators ── */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-[#64748B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Verified by Architects at Microsoft, Amazon & Meta</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Zero Resume Guesswork</span>
          </div>
          <span className="text-slate-300 hidden md:inline">•</span>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#10B981]" />
            <span>Real-Time Concurrency Calibration</span>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOWER FEATURE GRID: 3-COLUMN PORCELAIN CARDS (JADEER EMERALD ACCENTS)
   ═══════════════════════════════════════════════════════════════════════════ */

function LowerFeatureGridSection() {
  return (
    <section className="relative pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* Clean 3-Column Split Card in Porcelain White */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_-15px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">

            {/* ── COLUMN 1: Metric Overview & Guarantee Statement ── */}
            <div className="p-8 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#10B981] text-[11px] font-bold border border-emerald-200/80">
                  <Award className="w-3.5 h-3.5" />
                  <span>100% Code-Verified Candidates</span>
                </span>

                <h3 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  Zero Resume Guesswork. Direct Code Proof.
                </h3>

                <p className="text-sm text-[#64748B] leading-relaxed">
                  Every candidate dossier is backed by live AST execution logs, memory safety verification, and socket multiplexing benchmarks under 10k connections.
                </p>
              </div>

              {/* Sub-Metrics Counter Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/60">
                  <span className="text-xl font-black text-[#0F172A]">94%</span>
                  <span className="text-[10px] font-bold text-[#64748B] block">Accuracy</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/60">
                  <span className="text-xl font-black text-[#10B981]">4.95</span>
                  <span className="text-[10px] font-bold text-[#64748B] block">Rating</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/60">
                  <span className="text-xl font-black text-[#059669]">&lt;48h</span>
                  <span className="text-[10px] font-bold text-[#64748B] block">Fast-Track</span>
                </div>
              </div>
            </div>

            {/* ── COLUMN 2: Soft Embossed Card with Stage Indicator ── */}
            <div className="p-8 sm:p-10 space-y-5 bg-[#F8FAFC]/60 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#0F172A] text-[11px] font-bold border border-slate-200">
                  <Layers className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Stage 02B: Human Calibration Pod</span>
                </span>

                <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                  1-to-1 Technical Defense with Senior Architects
                </h3>

                <p className="text-sm text-[#64748B] leading-relaxed">
                  Candidates defend architectural trade-offs, space/time complexity, and cold-cache stampede strategies directly with Principal Engineers.
                </p>
              </div>

              {/* Embossed Cardlet */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    Interactive Live Evaluation
                  </span>
                  <span className="text-[11px] font-mono text-[#10B981] font-bold">STAGE 02B</span>
                </div>
                <p className="text-xs text-[#64748B]">
                  Live socket I/O review, thread race detection, and distributed query optimization.
                </p>
              </div>
            </div>

            {/* ── COLUMN 3: Stacked Dual-Action Buttons in Jadeer Green/Navy ── */}
            <div className="p-8 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                  Actionable Next Steps
                </span>
                <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                  Fast-Track Your Journey
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Start your candidate certification or discover calibrated senior engineering talent immediately.
                </p>
              </div>

              {/* Stacked Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/signup"
                  className="
                    w-full py-3.5 px-5 rounded-full bg-[#10B981] text-white text-sm font-bold
                    hover:bg-[#059669] transition-all flex items-center justify-between
                    shadow-[0_10px_24px_rgba(16,185,129,0.28)] active:scale-[0.99] group
                  "
                >
                  <span>Launch Candidate Assessment</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/employer"
                  className="
                    w-full py-3.5 px-5 rounded-full bg-white text-[#0F172A]
                    border border-slate-200 text-sm font-bold hover:bg-slate-50
                    transition-all flex items-center justify-between active:scale-[0.99] group shadow-2xs
                  "
                >
                  <span>Hire Verified Talent</span>
                  <ArrowUpRight className="w-4 h-4 text-[#10B981] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THREE-STAGE VALIDATION ARCHITECTURE
   ═══════════════════════════════════════════════════════════════════════════ */

function ValidationArchitectureSection() {
  const pillars = [
    {
      num: '01',
      title: 'Adaptive AI Technical Assessment',
      desc: 'Conversational voice and code evaluation tailored dynamically for your stage—evaluating memory safety, OOP polymorphism, and systems problem solving.',
      icon: BrainCircuit,
      badge: 'Cognitive Calibration',
    },
    {
      num: '02',
      title: '1-to-1 Mentor Calibration & Pods',
      desc: 'Book personalized guidance and receive code reviews from Senior Engineers at Microsoft, Amazon, Google, Instabug, and Valeo.',
      icon: Users,
      badge: 'Expert Review',
    },
    {
      num: '03',
      title: 'Verified Evidence Dossier',
      desc: 'Generate undeniable skill proof containing real code commits, telemetry breakdowns, and verified statements to unlock direct hiring.',
      icon: FileCheck2,
      badge: 'Direct Inbound',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative bg-[#F8FAFC]/60 border-t border-slate-200/70">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#10B981]">
            The Validation Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            How Jadeer certifies competence
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            A unified pipeline designed to transition developers from theoretical knowledge to verifiable industry performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="
                  bg-white rounded-3xl p-8 sm:p-10
                  border border-slate-200/80
                  shadow-[0_10px_35px_-10px_rgba(15,23,42,0.04)]
                  flex flex-col justify-between space-y-6
                  hover:border-emerald-300 hover:-translate-y-1
                  hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.12)]
                  transition-all duration-300 group
                "
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#10B981] flex items-center justify-center font-extrabold group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-extrabold text-slate-300">
                      {pillar.num}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#10B981] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/80">
                    {pillar.badge}
                  </span>

                  <h3 className="text-xl font-bold text-[#0F172A] leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-[14px] text-[#64748B] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <Link
                  to="/signup"
                  className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#10B981] group-hover:text-[#059669] transition-colors"
                >
                  <span>Start Validation</span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VALUE PROPOSITION & ADVANTAGE SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function TalentAdvantageSection() {
  const advantages = [
    {
      title: 'Evidence Beats Guesswork',
      desc: 'Never struggle with "years of experience" filters. Your Jadeer dossier proves you have solved real systems problems with benchmarked metrics.',
      icon: ShieldCheck,
    },
    {
      title: '1-to-1 Senior Mentorship',
      desc: 'Receive architectural guidance and mock interview feedback from Principal Engineers at top tech enterprises.',
      icon: GraduationCap,
    },
    {
      title: 'Direct Inbound Interviews',
      desc: 'Vetted partner employers skip superficial CV screening rounds and send interview invitations directly to your inbox.',
      icon: Terminal,
    },
  ];

  return (
    <section id="pipeline" className="py-24 sm:py-32 bg-white border-y border-slate-200/70">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#10B981]">
            Built for Students & Junior Engineers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Get hired on proven merit, not pedigree.
          </h2>
          <p className="text-[15px] sm:text-base text-[#64748B] leading-relaxed">
            Transition smoothly from university projects into production-grade software engineering with calibrated proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((adv) => {
            const Icon = adv.icon;
            return (
              <div
                key={adv.title}
                className="p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 space-y-4 hover:border-emerald-300 transition-colors shadow-2xs"
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/80 text-[#10B981] flex items-center justify-center font-bold shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  {adv.title}
                </h3>
                <p className="text-[13.5px] text-[#64748B] leading-relaxed">
                  {adv.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   UNIFIED FINAL CTA SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function UnifiedFinalCtaSection() {
  return (
    <section id="evidence" className="py-24 sm:py-32 relative bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.05)] text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Ready to validate your engineering capabilities?
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
              Create your unified talent account, take your adaptive AI assessment, and build verifiable proof of your technical depth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              id="final-join-talent-btn"
              className="
                w-full sm:w-auto px-8 py-4 rounded-full
                bg-[#10B981] text-white text-sm font-bold
                hover:bg-[#059669] hover:-translate-y-0.5
                hover:shadow-[0_12px_28px_rgba(16,185,129,0.32)]
                active:translate-y-0 active:scale-[0.98]
                transition-all duration-300 shadow-md
              "
            >
              Join as Talent
            </Link>

            <Link
              to="/signin"
              className="
                w-full sm:w-auto px-8 py-4 rounded-full
                bg-[#F8FAFC] text-[#0F172A] text-sm font-bold
                border border-slate-200/80
                hover:bg-white hover:border-emerald-300 hover:-translate-y-0.5
                transition-all duration-300 shadow-2xs
              "
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-12 border-t border-slate-200/70 text-xs text-[#64748B] bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <BrandLogo size="sm" href="/" textColor="dark" />
        <p>© {new Date().getFullYear()} Jadeer Talent Validation Platform. All rights reserved.</p>
        <div className="flex items-center gap-6 font-semibold">
          <Link to="/signin" className="hover:text-[#0F172A] transition-colors">Sign In</Link>
          <Link to="/signup" className="hover:text-[#0F172A] transition-colors">Join as Talent</Link>
          <Link to="/employer" className="hover:text-[#10B981] transition-colors">For Employers</Link>
          <Link to="/admin/signin" className="hover:text-[#10B981] transition-colors flex items-center gap-1 text-[11px] text-[#64748B]">
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LANDING PAGE — JADEER BRAND ROOT
   ══════════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-emerald-500/20 selection:text-[#0F172A] relative overflow-hidden">
      <Navbar />
      <CenteredHeroSection />
      <LowerFeatureGridSection />
      <ValidationArchitectureSection />
      <TalentAdvantageSection />
      <UnifiedFinalCtaSection />
      <Footer />
    </div>
  );
}
