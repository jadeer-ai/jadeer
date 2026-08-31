import { useState } from 'react';
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

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER LANDING PAGE — "DIGITAL HAVEN" (STEEL BLUE & WARM TERRACOTTA)
   - Exact Color Tokens:
     • Canvas Background: Soft Porcelain Off-White (#F0F2F4 / #F8FAFC)
     • Card & Interactive Surfaces: Crisp White (#FFFFFF) with border-slate-200/80
     • Primary Typography / Heavy Anchors: Deep Charcoal Navy (#172132)
     • Secondary Typography / Sub-headings: Steel Denim Blue (#53789B)
     • Accent / High-Intent Action CTAs: Warm Terracotta (#C4846C, hover #B37357)
     • Muted Copy / Borders / Icons: Slate Gray (#64748B)
   - Layout:
     • Floating centered capsule navbar (fixed top-6 left-1/2 -translate-x-1/2)
     • Centered 3-line headline with exact palette tokens
     • Lightweight vector isometric wireframe grid (opacity 25%-35%)
     • Zero photo skyline layers — clean, airy daylight architecture
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Navigation Links ───────────────────────────────────────────────────── */
const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Validation Pipeline', href: '#pipeline' },
  { label: 'Evidence Dossier', href: '#evidence' },
];

/* ── Lightweight Vector Isometric Wireframe Background ───────────────────── */
function IsometricWireframeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Underlying Perspective Wireframe Grid (opacity-25 to opacity-35) */}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(83, 120, 155, 0.09) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(83, 120, 155, 0.09) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, #000 30%, transparent 80%)',
        }}
      />

      {/* 2. Vector Isometric Wireframe Cubes & Neural Telemetry Lines */}
      <svg
        className="absolute top-8 left-1/2 -translate-x-1/2 w-[1500px] h-[850px] opacity-[0.3]"
        viewBox="0 0 1500 850"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#53789B" strokeWidth="1">
          {/* ── Cube 1: Far Left High (Terracotta Accent) ── */}
          <polygon points="180,180 230,150 280,180 230,210" fill="#FFFFFF" fillOpacity="0.8" stroke="#C4846C" strokeWidth="1.2" />
          <polygon points="180,180 230,210 230,265 180,235" fill="#C4846C" fillOpacity="0.08" stroke="#C4846C" strokeWidth="1.2" />
          <polygon points="230,210 280,180 280,235 230,265" fill="#172132" fillOpacity="0.04" stroke="#C4846C" strokeWidth="1.2" />

          {/* ── Cube 2: Mid-Left Floating Cubelet ── */}
          <polygon points="380,280 420,255 460,280 420,305" fill="#FFFFFF" fillOpacity="0.75" stroke="#64748B" strokeWidth="0.9" />
          <polygon points="380,280 420,305 420,350 380,325" fill="#64748B" fillOpacity="0.06" stroke="#64748B" strokeWidth="0.9" />
          <polygon points="420,305 460,280 460,325 420,350" fill="#172132" fillOpacity="0.04" stroke="#64748B" strokeWidth="0.9" />

          {/* ── Cube 3: Top Center Subtly Hovering Wireframe ── */}
          <polygon points="700,95 755,60 810,95 755,130" fill="#FFFFFF" fillOpacity="0.85" stroke="#53789B" strokeWidth="1.2" strokeDasharray="3 3" />
          <polygon points="700,95 755,130 755,190 700,155" fill="#53789B" fillOpacity="0.06" stroke="#53789B" strokeWidth="1.2" strokeDasharray="3 3" />
          <polygon points="755,130 810,95 810,155 755,190" fill="#172132" fillOpacity="0.03" stroke="#53789B" strokeWidth="1.2" strokeDasharray="3 3" />

          {/* ── Cube 4: Mid-Right Floating Isometric Block ── */}
          <polygon points="1060,260 1105,235 1150,260 1105,285" fill="#FFFFFF" fillOpacity="0.75" stroke="#64748B" strokeWidth="0.9" />
          <polygon points="1060,260 1105,285 1105,335 1060,310" fill="#64748B" fillOpacity="0.06" stroke="#64748B" strokeWidth="0.9" />
          <polygon points="1105,285 1150,260 1150,310 1105,335" fill="#172132" fillOpacity="0.04" stroke="#64748B" strokeWidth="0.9" />

          {/* ── Cube 5: Far Right High (Terracotta Accent) ── */}
          <polygon points="1240,160 1290,130 1340,160 1290,190" fill="#FFFFFF" fillOpacity="0.8" stroke="#C4846C" strokeWidth="1.2" />
          <polygon points="1240,160 1290,190 1290,245 1240,215" fill="#C4846C" fillOpacity="0.08" stroke="#C4846C" strokeWidth="1.2" />
          <polygon points="1290,190 1340,160 1340,215 1290,245" fill="#172132" fillOpacity="0.04" stroke="#C4846C" strokeWidth="1.2" />

          {/* ── Connecting Vector Telemetry Grid & Data Nodes ── */}
          <line x1="230" y1="265" x2="420" y2="255" stroke="#C4846C" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.45" />
          <line x1="420" y1="305" x2="755" y2="190" stroke="#64748B" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.4" />
          <line x1="755" y1="190" x2="1105" y2="235" stroke="#64748B" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.4" />
          <line x1="1105" y1="285" x2="1290" y2="245" stroke="#C4846C" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.45" />

          {/* Neural Vertex Markers */}
          <circle cx="230" cy="210" r="3" fill="#C4846C" />
          <circle cx="420" cy="280" r="2.5" fill="#64748B" />
          <circle cx="755" cy="130" r="3.5" fill="#53789B" />
          <circle cx="1105" cy="260" r="2.5" fill="#64748B" />
          <circle cx="1290" cy="190" r="3" fill="#C4846C" />
        </g>
      </svg>

      {/* 3. Soft Radial Glow Halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 55% at 50% 25%, rgba(196, 132, 108, 0.06) 0%, rgba(83, 120, 155, 0.04) 40%, transparent 75%),
            linear-gradient(to bottom, rgba(240, 242, 244, 0) 0%, rgba(240, 242, 244, 0.5) 50%, #F0F2F4 90%, #F0F2F4 100%)
          `,
        }}
      />
    </div>
  );
}

/* ── Smooth Floating Capsule Navbar Component ────────────────────────────── */
function FloatingCapsuleNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm px-6 py-3 flex items-center justify-between gap-8 max-w-5xl w-[92%] transition-all">
        {/* ── Brand Logo (Left): "Jadeer" in Deep Charcoal Navy with Terracotta Dot ── */}
        <Link to="/" className="inline-flex items-center gap-2 select-none group shrink-0">
          <svg
            width="22"
            height="28"
            viewBox="0 0 60 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 transition-transform duration-200 group-hover:scale-105"
          >
            <path
              d="M38 12C38 12 48 8 52 16C56 24 48 36 38 48C28 60 16 72 8 68C0 64 2 48 12 36C22 24 38 12 38 12Z"
              fill="url(#jadeer-terracotta-grad)"
            />
            <circle cx="48" cy="14" r="5.5" fill="#C4846C" />
            <defs>
              <linearGradient id="jadeer-terracotta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D7ACA4" />
                <stop offset="50%" stopColor="#C4846C" />
                <stop offset="100%" stopColor="#B37357" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-[19px] font-extrabold tracking-tight text-[#172132]">
            Jadeer<span className="text-[#C4846C]">.</span>
          </span>
        </Link>

        {/* ── Center Nav Links: Slate Gray (#64748B) hover to Deep Charcoal Navy (#172132) ── */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#64748B] hover:text-[#172132] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Right Actions: For Companies, Sign In & Primary Terracotta Pill CTA ── */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          <Link
            to="/employer"
            id="nav-for-companies"
            className="text-sm font-medium text-[#64748B] hover:text-[#172132] transition-colors"
          >
            For Companies
          </Link>

          <SignedOut>
            <Link
              to="/signin"
              id="nav-signin"
              className="text-sm font-medium text-[#64748B] hover:text-[#172132] transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              id="nav-join-talent"
              className="inline-flex items-center gap-1.5 bg-[#C4846C] hover:bg-[#B37357] text-white text-sm font-medium rounded-full px-5 py-2 transition-all shadow-sm active:scale-95"
            >
              <span>Join as Talent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              to="/dashboard"
              id="nav-dashboard"
              className="text-sm font-medium text-[#172132] hover:text-[#C4846C] transition-colors"
            >
              Dashboard
            </Link>
            <div className="flex items-center pl-1">
              <UserButton />
            </div>
          </SignedIn>
        </div>

        {/* ── Mobile Menu Toggle ── */}
        <button
          id="mobile-nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-1.5 rounded-full text-[#172132] hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Mobile Dropdown Panel ── */}
      {mobileOpen && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/80 p-5 shadow-xl space-y-4 md:hidden animate-[fade-in_0.2s_ease]">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium text-[#64748B] hover:text-[#172132] rounded-xl hover:bg-slate-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200/80 flex flex-col gap-2.5">
            <Link
              to="/employer"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-sm font-medium text-[#172132] rounded-full bg-slate-100 hover:bg-slate-200"
            >
              For Companies
            </Link>

            <SignedOut>
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-[#172132] rounded-full bg-slate-100 hover:bg-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-white rounded-full bg-[#C4846C] hover:bg-[#B37357]"
              >
                Join as Talent →
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center justify-between py-2 px-3 rounded-2xl bg-slate-100">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-[#172132] hover:text-[#C4846C]"
                >
                  Dashboard →
                </Link>
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SECTION: CENTERED 3-LINE HEADLINE & CURATED PALETTE HIERARCHY
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-44 sm:pt-52 pb-20 sm:pb-28">
      {/* Lightweight Vector Isometric Wireframe Background */}
      <IsometricWireframeBackground />

      <div className="relative mx-auto max-w-5xl px-6 sm:px-10 lg:px-12 text-center z-10 space-y-8 sm:space-y-10">

        {/* ── Pre-headline Badge: • DIGITAL HAVEN • TECHNICAL VALIDATION MATRIX ── */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-[0_2px_8px_rgba(23,33,50,0.02)] backdrop-blur-sm animate-[fade-in_0.5s_ease]">
          <span className="w-2 h-2 rounded-full bg-[#C4846C] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-extrabold text-[#64748B] uppercase tracking-widest">
            DIGITAL HAVEN • TECHNICAL VALIDATION MATRIX
          </span>
        </div>

        {/* ── Core Headline (Centered, Clean & Impactful) ── */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="leading-[1.12] tracking-tight select-none">
            {/* Line 1: Deep Charcoal Navy (#172132) */}
            <span className="block text-[#172132] font-bold text-4xl sm:text-6xl tracking-tight">
              Your Mentality.
            </span>

            {/* Line 2: Steel Denim Blue (#53789B) */}
            <span className="block text-[#53789B] font-bold text-4xl sm:text-6xl tracking-tight">
              Our Matrix.
            </span>

            {/* Line 3: Warm Terracotta (#C4846C) */}
            <span className="block text-[#C4846C] font-bold text-4xl sm:text-6xl tracking-tight">
              Their Peace of Mind.
            </span>
          </h1>
        </div>

        {/* ── Supporting Narrative in Slate Gray (#64748B) ── */}
        <p className="text-[#64748B] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mt-4 font-normal">
          A unified engineering validation platform designed to certify true technical depth through adaptive AI code probing, 1-to-1 Principal Architect defense, and verifiable evidence dossiers.
        </p>

        {/* ── Dual Action Buttons (Centered) ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/signup"
            id="hero-join-talent-btn"
            className="w-full sm:w-auto bg-[#C4846C] hover:bg-[#B37357] text-white font-medium rounded-full px-7 py-3.5 shadow-sm transition-all inline-flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Launch Assessment</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>

          <Link
            to="/signin"
            id="hero-signin-btn"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#172132] border border-slate-300 font-medium rounded-full px-7 py-3.5 shadow-sm transition-all inline-flex items-center justify-center active:scale-95"
          >
            <span>Access Candidate Portal</span>
          </Link>
        </div>

        {/* ── Bottom Trust Badges (Horizontal, Centered) ── */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[#64748B] text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#53789B]" />
            <span>Verified by Architects at Microsoft, Amazon & Meta</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C4846C]" />
            <span>Zero Resume Guesswork</span>
          </div>
          <span className="text-slate-300 hidden md:inline">•</span>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#53789B]" />
            <span>Real-Time Concurrency Calibration</span>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOWER FEATURE GRID: 3-COLUMN PORCELAIN CARDS
   ═══════════════════════════════════════════════════════════════════════════ */

function LowerFeatureGridSection() {
  return (
    <section className="relative pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* Clean 3-Column Split Card in Porcelain White */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_-15px_rgba(23,33,50,0.04)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">

            {/* ── COLUMN 1: Metric Overview & Guarantee Statement ── */}
            <div className="p-8 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D7ACA4]/20 text-[#C4846C] text-[11px] font-bold border border-[#D7ACA4]/40">
                  <Award className="w-3.5 h-3.5" />
                  <span>100% Code-Verified Candidates</span>
                </span>

                <h3 className="text-2xl font-extrabold text-[#172132] tracking-tight">
                  Zero Resume Guesswork. Direct Code Proof.
                </h3>

                <p className="text-sm text-[#64748B] leading-relaxed">
                  Every candidate dossier is backed by live AST execution logs, memory safety verification, and socket multiplexing benchmarks under 10k connections.
                </p>
              </div>

              {/* Sub-Metrics Counter Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/60">
                  <span className="text-xl font-black text-[#172132]">94%</span>
                  <span className="text-[10px] font-bold text-[#64748B] block">Accuracy</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/60">
                  <span className="text-xl font-black text-[#53789B]">4.95</span>
                  <span className="text-[10px] font-bold text-[#64748B] block">Rating</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/60">
                  <span className="text-xl font-black text-[#C4846C]">&lt;48h</span>
                  <span className="text-[10px] font-bold text-[#64748B] block">Fast-Track</span>
                </div>
              </div>
            </div>

            {/* ── COLUMN 2: Soft Embossed Card with Stage Indicator ── */}
            <div className="p-8 sm:p-10 space-y-5 bg-[#F8FAFC]/70 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#53789B]/15 text-[#53789B] text-[11px] font-bold border border-[#53789B]/30">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Stage 02B: Human Calibration Pod</span>
                </span>

                <h3 className="text-xl font-extrabold text-[#172132] tracking-tight">
                  1-to-1 Technical Defense with Senior Architects
                </h3>

                <p className="text-sm text-[#64748B] leading-relaxed">
                  Candidates defend architectural trade-offs, space/time complexity, and cold-cache stampede strategies directly with Principal Engineers.
                </p>
              </div>

              {/* Embossed Cardlet */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#172132] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#53789B]" />
                    Interactive Live Evaluation
                  </span>
                  <span className="text-[11px] font-mono text-[#C4846C] font-bold">STAGE 02B</span>
                </div>
                <p className="text-xs text-[#64748B]">
                  Live socket I/O review, thread race detection, and distributed query optimization.
                </p>
              </div>
            </div>

            {/* ── COLUMN 3: Stacked Dual-Action Buttons in Terracotta Tones ── */}
            <div className="p-8 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                  Actionable Next Steps
                </span>
                <h3 className="text-xl font-extrabold text-[#172132] tracking-tight">
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
                    w-full py-3.5 px-5 rounded-full bg-[#C4846C] text-white text-sm font-medium
                    hover:bg-[#B37357] transition-all flex items-center justify-between
                    shadow-[0_10px_24px_rgba(196,132,108,0.28)] active:scale-[0.99] group
                  "
                >
                  <span>Launch Candidate Assessment</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/employer"
                  className="
                    w-full py-3.5 px-5 rounded-full bg-white text-[#172132]
                    border border-slate-200 text-sm font-medium hover:bg-slate-50
                    transition-all flex items-center justify-between active:scale-[0.99] group shadow-2xs
                  "
                >
                  <span>Hire Verified Talent</span>
                  <ArrowUpRight className="w-4 h-4 text-[#53789B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
    <section id="how-it-works" className="py-24 sm:py-32 relative bg-[#F8FAFC]/70 border-t border-slate-200/70">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#C4846C]">
            The Validation Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172132] tracking-tight">
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
                  shadow-[0_10px_35px_-10px_rgba(23,33,50,0.04)]
                  flex flex-col justify-between space-y-6
                  hover:border-[#53789B]/40 hover:-translate-y-1
                  hover:shadow-[0_20px_40px_-15px_rgba(83,120,155,0.12)]
                  transition-all duration-300 group
                "
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#F0F2F4] border border-slate-200/80 text-[#53789B] flex items-center justify-center font-extrabold group-hover:bg-[#53789B] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-extrabold text-slate-300">
                      {pillar.num}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#C4846C] bg-[#D7ACA4]/20 px-2.5 py-0.5 rounded-md border border-[#D7ACA4]/40">
                    {pillar.badge}
                  </span>

                  <h3 className="text-xl font-bold text-[#172132] leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-[14px] text-[#64748B] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <Link
                  to="/signup"
                  className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#53789B] group-hover:text-[#172132] transition-colors"
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
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#C4846C]">
            Built for Students & Junior Engineers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172132] tracking-tight">
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
                className="p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 space-y-4 hover:border-[#53789B]/40 transition-colors shadow-2xs"
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/80 text-[#53789B] flex items-center justify-center font-bold shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#172132]">
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
    <section id="evidence" className="py-24 sm:py-32 relative bg-[#F0F2F4]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(23,33,50,0.04)] text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172132] tracking-tight">
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
                bg-[#C4846C] hover:bg-[#B37357] text-white text-sm font-medium
                hover:-translate-y-0.5
                hover:shadow-[0_12px_28px_rgba(196,132,108,0.32)]
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
                bg-[#F8FAFC] text-[#172132] text-sm font-medium
                border border-slate-300
                hover:bg-white hover:border-[#53789B]/50 hover:-translate-y-0.5
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
    <footer className="py-12 border-t border-slate-200/70 text-xs text-[#64748B] bg-[#F0F2F4]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="inline-flex items-center gap-2 select-none group">
          <span className="text-[17px] font-extrabold tracking-tight text-[#172132]">
            Jadeer<span className="text-[#C4846C]">.</span>
          </span>
        </Link>
        <p>© {new Date().getFullYear()} Jadeer Talent Validation Platform. All rights reserved.</p>
        <div className="flex items-center gap-6 font-semibold">
          <Link to="/signin" className="hover:text-[#172132] transition-colors">Sign In</Link>
          <Link to="/signup" className="hover:text-[#172132] transition-colors">Join as Talent</Link>
          <Link to="/employer" className="hover:text-[#C4846C] transition-colors">For Employers</Link>
          <Link to="/admin/signin" className="hover:text-[#53789B] transition-colors flex items-center gap-1 text-[11px] text-[#64748B]">
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LANDING PAGE — DIGITAL HAVEN ROOT
   ══════════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F0F2F4] text-[#172132] selection:bg-[#D7ACA4]/30 selection:text-[#172132] relative overflow-hidden">
      <FloatingCapsuleNavbar />
      <HeroSection />
      <LowerFeatureGridSection />
      <ValidationArchitectureSection />
      <TalentAdvantageSection />
      <UnifiedFinalCtaSection />
      <Footer />
    </div>
  );
}
