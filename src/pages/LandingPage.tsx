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
   JADEER LANDING PAGE — "DIGITAL HAVEN / THE BLANK CANVAS" DESIGN LANGUAGE
   - Soft Cloud Canvas: #F0F2F4 / #F8FAFC with crisp #FFFFFF card surfaces
   - Primary / Tech: Steel Denim Blue (#53789B) & Deep Charcoal Navy (#172132)
   - Secondary / Warm Accent: Warm Terracotta (#C4846C) & Blush Peach (#D7ACA4)
   - Muted / Text: Slate Gray (#5A6472 / #64748B)
   - 3D Architectural Cityscape Background with Soft Fog & Ambient Lighting
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Navigation Links ───────────────────────────────────────────────────── */
const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Validation Pipeline', href: '#pipeline' },
  { label: 'Evidence Dossier', href: '#evidence' },
];

/* ── Atmospheric 3D Architectural Cityscape Background ───────────────────── */
function ArchitecturalCityscapeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Subtle Architectural Grid Plane */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(83, 120, 155, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(83, 120, 155, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 35%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 35%, transparent 80%)',
        }}
      />

      {/* 2. Stylized 3D Monochromatic Isometric Buildings SVG */}
      <svg
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[1400px] h-[780px] opacity-[0.22] mix-blend-multiply"
        viewBox="0 0 1400 780"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#53789B" strokeWidth="1.2">
          {/* Background Hub 1 (Left Far) */}
          <polygon points="120,440 220,380 320,440 220,500" fill="#F8FAFC" fillOpacity="0.8" />
          <polygon points="120,440 220,500 220,680 120,620" fill="#53789B" fillOpacity="0.12" />
          <polygon points="220,500 320,440 320,620 220,680" fill="#172132" fillOpacity="0.08" />
          <line x1="170" y1="410" x2="170" y2="590" strokeDasharray="3 3" strokeOpacity="0.5" />
          <line x1="270" y1="470" x2="270" y2="650" strokeDasharray="3 3" strokeOpacity="0.5" />

          {/* Tower 2 (Mid-Left Tall) */}
          <polygon points="280,320 380,260 480,320 380,380" fill="#FFFFFF" fillOpacity="0.9" />
          <polygon points="280,320 380,380 380,680 280,620" fill="#53789B" fillOpacity="0.16" />
          <polygon points="380,380 480,320 480,620 380,680" fill="#172132" fillOpacity="0.1" />
          {/* Spire */}
          <line x1="380" y1="260" x2="380" y2="180" stroke="#C4846C" strokeWidth="2" strokeOpacity="0.7" />
          <circle cx="380" cy="180" r="3" fill="#C4846C" />

          {/* Center Enterprise Headquarters (Deep Isometric Block) */}
          <polygon points="560,280 700,200 840,280 700,360" fill="#FFFFFF" fillOpacity="0.95" />
          <polygon points="560,280 700,360 700,680 560,600" fill="#53789B" fillOpacity="0.2" />
          <polygon points="700,360 840,280 840,600 700,680" fill="#172132" fillOpacity="0.14" />
          {/* Floor bands */}
          <line x1="560" y1="360" x2="700" y2="440" strokeOpacity="0.4" />
          <line x1="700" y1="440" x2="840" y2="360" strokeOpacity="0.4" />
          <line x1="560" y1="440" x2="700" y2="520" strokeOpacity="0.4" />
          <line x1="700" y1="520" x2="840" y2="440" strokeOpacity="0.4" />
          <line x1="560" y1="520" x2="700" y2="600" strokeOpacity="0.4" />
          <line x1="700" y1="600" x2="840" y2="520" strokeOpacity="0.4" />

          {/* Stepped Terraced Tower (Mid-Right) */}
          <polygon points="860,340 960,280 1060,340 960,400" fill="#FFFFFF" fillOpacity="0.9" />
          <polygon points="860,340 960,400 960,660 860,600" fill="#53789B" fillOpacity="0.14" />
          <polygon points="960,400 1060,340 1060,600 960,660" fill="#172132" fillOpacity="0.09" />
          {/* Top Step */}
          <polygon points="890,300 960,260 1030,300 960,340" fill="#D7ACA4" fillOpacity="0.25" stroke="#D7ACA4" />
          <polygon points="890,300 960,340 960,370 890,330" fill="#C4846C" fillOpacity="0.2" />
          <polygon points="960,340 1030,300 1030,330 960,370" fill="#C4846C" fillOpacity="0.15" />

          {/* Far Right Tech Campus */}
          <polygon points="1080,420 1180,360 1280,420 1180,480" fill="#F8FAFC" fillOpacity="0.85" />
          <polygon points="1080,420 1180,480 1180,660 1080,600" fill="#53789B" fillOpacity="0.1" />
          <polygon points="1180,480 1280,420 1280,600 1180,660" fill="#172132" fillOpacity="0.06" />

          {/* Floating Data Isometric Panels */}
          <polygon points="460,190 520,155 580,190 520,225" fill="#FFFFFF" fillOpacity="0.7" stroke="#53789B" strokeWidth="0.8" />
          <polygon points="820,170 870,140 920,170 870,200" fill="#FFFFFF" fillOpacity="0.7" stroke="#C4846C" strokeWidth="0.8" />
        </g>
      </svg>

      {/* 3. Soft Atmospheric Fog & Frosted Gradient Mask */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 25%, rgba(215, 172, 164, 0.12) 0%, rgba(83, 120, 155, 0.08) 35%, transparent 70%),
            linear-gradient(to bottom, rgba(240, 242, 244, 0) 0%, rgba(240, 242, 244, 0.65) 50%, #F0F2F4 100%)
          `,
        }}
      />

      {/* 4. Subtle Top Horizon Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-[#53789B]/10 via-[#D7ACA4]/10 to-transparent blur-3xl opacity-60 pointer-events-none" />
    </div>
  );
}

/* ── Navbar Component ───────────────────────────────────────────────────── */
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
          ? 'bg-[#F0F2F4]/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_rgba(23,33,50,0.04)]'
          : 'bg-transparent border-b border-slate-200/50'
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="flex h-[76px] items-center justify-between">

          {/* ── Brand Logo ──────────────────────────────────────────── */}
          <BrandLogo size="md" href="/" textColor="dark" />

          {/* ── Desktop Nav Links ──────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/70 shadow-2xs">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  px-3.5 py-1.5 text-[13.5px] font-semibold text-[#5A6472]
                  transition-colors duration-200 hover:text-[#172132] rounded-full hover:bg-slate-100/80
                "
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Desktop Actions ────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/employer"
              id="nav-for-companies"
              className="
                px-3.5 py-2 text-[14px] font-semibold text-[#5A6472]
                transition-colors duration-200 hover:text-[#172132]
                hover:bg-white/80 rounded-xl
              "
            >
              For Companies
            </Link>

            <div className="h-4 w-px bg-slate-300 mx-0.5" />

            <SignedOut>
              <Link
                to="/signin"
                id="nav-signin"
                className="
                  px-3.5 py-2 text-[14px] font-semibold text-[#172132]
                  transition-colors duration-200 hover:text-[#53789B]
                "
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                id="nav-join-talent"
                className="
                  inline-flex items-center gap-2 px-5 py-2.5
                  bg-[#C4846C] text-white text-[13.5px] font-bold
                  rounded-full transition-all duration-300
                  hover:bg-[#b3755e] hover:-translate-y-0.5
                  hover:shadow-[0_8px_20px_rgba(196,132,108,0.35)]
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
                  px-3.5 py-2 text-[14px] font-semibold text-[#172132]
                  transition-colors duration-200 hover:text-[#53789B]
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
            className="md:hidden p-2 rounded-xl text-[#172132] hover:bg-white/80 transition-colors"
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
                className="px-3 py-2.5 text-[15px] font-semibold text-[#5A6472] hover:text-[#172132] rounded-xl hover:bg-slate-100 transition-colors"
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
              className="w-full text-center py-3 text-sm font-bold text-[#172132] rounded-2xl bg-slate-100 hover:bg-slate-200"
            >
              For Companies
            </Link>

            <SignedOut>
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-[#172132] rounded-2xl bg-slate-100 hover:bg-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-white rounded-2xl bg-[#C4846C] hover:bg-[#b3755e]"
              >
                Join as Talent →
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center justify-between py-2.5 px-3 rounded-2xl bg-slate-100">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-[#172132] hover:text-[#C4846C]"
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
   HERO SECTION: EDITORIAL TYPOGRAPHY + SIGNATURE METRIC CARD
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 sm:pt-44 pb-20 sm:pb-28">
      {/* 3D Atmospheric Background */}
      <ArchitecturalCityscapeBackground />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* ── LEFT COLUMN: Editorial Hero Content (7 cols) ───────── */}
          <div className="lg:col-span-7 space-y-7 sm:space-y-8 text-left">

            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <span className="w-2 h-2 rounded-full bg-[#C4846C] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-extrabold text-[#5A6472] uppercase tracking-wider">
                Digital Haven • Technical Validation Matrix
              </span>
            </div>

            {/* Editorial Heading in Deep Charcoal Navy */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.12] tracking-tight text-[#172132]">
                Your Mentality.{' '}
                <span className="text-[#53789B]">Our Matrix.</span>
                <br />
                <span className="text-[#C4846C] underline decoration-[#D7ACA4]/40 decoration-4 underline-offset-8">
                  Their Peace of Mind.
                </span>
              </h1>
            </div>

            {/* Editorial Subtitle */}
            <p className="text-base sm:text-lg text-[#5A6472] leading-relaxed max-w-xl font-normal">
              A unified engineering validation platform designed to certify true technical depth through adaptive AI code probing, 1-to-1 Principal Architect defense, and verifiable evidence dossiers.
            </p>

            {/* Pillowy Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <Link
                to="/signup"
                id="hero-join-talent-btn"
                className="
                  inline-flex items-center justify-center gap-3 px-8 py-4
                  bg-[#C4846C] text-white text-[15px] font-bold rounded-2xl
                  transition-all duration-300 hover:bg-[#b3755e] hover:-translate-y-0.5
                  hover:shadow-[0_14px_30px_rgba(196,132,108,0.32)] active:scale-[0.98] shadow-md
                "
              >
                <span>Launch Assessment</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              <Link
                to="/signin"
                id="hero-signin-btn"
                className="
                  inline-flex items-center justify-center gap-2 px-7 py-4
                  bg-white text-[#172132] border border-slate-200/90
                  text-[15px] font-bold rounded-2xl transition-all duration-300
                  hover:border-[#53789B]/40 hover:bg-[#F8FAFC] hover:-translate-y-0.5
                  active:scale-[0.98] shadow-2xs
                "
              >
                <span>Access Candidate Portal</span>
              </Link>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5A6472]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#53789B]" />
                <span>Verified by Architects at Microsoft, Amazon & Meta</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C4846C]" />
                <span>Zero Resume Guesswork</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Signature Metric Card (5 cols) ───────── */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#53789B]/20 via-[#D7ACA4]/25 to-transparent rounded-[2.5rem] blur-2xl pointer-events-none" />

            {/* Deep Navy Signature Card */}
            <div className="relative bg-[#172132] text-white rounded-3xl p-7 sm:p-8 border border-white/10 shadow-[0_25px_60px_-15px_rgba(23,33,50,0.35)] space-y-6 overflow-hidden">
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#53789B] via-[#C4846C] to-[#D7ACA4]" />

              {/* Card Header & Live Status */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-[#D7ACA4] uppercase block">
                    Verified Calibration Dossier
                  </span>
                  <p className="text-xs font-mono text-white/50">HASH: JAD-HC-9492</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4846C]/20 border border-[#C4846C]/40 text-[#D7ACA4] text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4846C] animate-pulse" />
                  <span>Stage 02B Certified</span>
                </span>
              </div>

              {/* Overall Metric Score Counter */}
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
                    Comprehensive Calibration Index
                  </span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">94</span>
                    <span className="text-lg font-bold text-white/40">/ 100</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-xl bg-[#53789B]/30 border border-[#53789B]/50 text-white text-xs font-black">
                    Grade A+ (Exemplary)
                  </span>
                  <p className="text-[10px] text-white/40 pt-1">Top 3% Talent Matrix</p>
                </div>
              </div>

              {/* Evaluated Competencies Progress Bars */}
              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white/80 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#53789B]" />
                      System Architecture & Concurrency
                    </span>
                    <span className="text-[#D7ACA4] font-mono font-bold">96%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#53789B]" style={{ width: '96%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white/80 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#C4846C]" />
                      RAII Memory Safety & Code Quality
                    </span>
                    <span className="text-[#D7ACA4] font-mono font-bold">94%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#C4846C]" style={{ width: '94%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white/80 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-[#D7ACA4]" />
                      Technical Defense & Articulation
                    </span>
                    <span className="text-[#D7ACA4] font-mono font-bold">95%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#D7ACA4]" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>

              {/* Lead Evaluator Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#53789B] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    TM
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-white leading-none">Eng. Tariq Al-Mansour</p>
                    <p className="text-[11px] text-white/50">Lead Architect • Microsoft</p>
                  </div>
                </div>

                <Link
                  to="/candidates/portfolio"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D7ACA4] hover:text-white transition-colors"
                >
                  <span>View Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
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
   LOWER FEATURE GRID: 3-COLUMN SPLIT WITH PILLOWY EMBOSSED CARDS
   ═══════════════════════════════════════════════════════════════════════════ */

function LowerFeatureGridSection() {
  return (
    <section className="relative pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* Clean 3-Column Split Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(23,33,50,0.03)] overflow-hidden">
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

                <p className="text-sm text-[#5A6472] leading-relaxed">
                  Every candidate profile is backed by live AST execution logs, memory safety verification, and socket multiplexing benchmarks under 10k connections.
                </p>
              </div>

              {/* Sub-Metrics Counter Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/60">
                  <span className="text-xl font-black text-[#172132]">94%</span>
                  <span className="text-[10px] font-bold text-[#5A6472] block">Accuracy</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/60">
                  <span className="text-xl font-black text-[#53789B]">4.95</span>
                  <span className="text-[10px] font-bold text-[#5A6472] block">Rating</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/60">
                  <span className="text-xl font-black text-[#C4846C]">&lt;48h</span>
                  <span className="text-[10px] font-bold text-[#5A6472] block">Fast-Track</span>
                </div>
              </div>
            </div>

            {/* ── COLUMN 2: Soft Embossed Card with Stage Indicator ── */}
            <div className="p-8 sm:p-10 space-y-5 bg-[#F8FAFC]/60 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#53789B]/15 text-[#53789B] text-[11px] font-bold border border-[#53789B]/30">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Stage 02B: Human Calibration Pod</span>
                </span>

                <h3 className="text-xl font-extrabold text-[#172132] tracking-tight">
                  1-to-1 Technical Defense with Senior Architects
                </h3>

                <p className="text-sm text-[#5A6472] leading-relaxed">
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
                <p className="text-xs text-[#5A6472]">
                  Live socket I/O review, thread race detection, and distributed query optimization.
                </p>
              </div>
            </div>

            {/* ── COLUMN 3: Stacked Dual-Action Buttons in Terracotta Tones ── */}
            <div className="p-8 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6472] block">
                  Actionable Next Steps
                </span>
                <h3 className="text-xl font-extrabold text-[#172132] tracking-tight">
                  Fast-Track Your Journey
                </h3>
                <p className="text-sm text-[#5A6472] leading-relaxed">
                  Start your candidate certification or discover calibrated senior engineering talent immediately.
                </p>
              </div>

              {/* Stacked Terracotta Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/signup"
                  className="
                    w-full py-4 px-5 rounded-2xl bg-[#C4846C] text-white text-sm font-bold
                    hover:bg-[#b3755e] transition-all flex items-center justify-between
                    shadow-[0_10px_24px_rgba(196,132,108,0.28)] active:scale-[0.99] group
                  "
                >
                  <span>Launch Candidate Assessment</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/employer"
                  className="
                    w-full py-3.5 px-5 rounded-2xl bg-[#D7ACA4]/20 text-[#172132]
                    border border-[#D7ACA4]/60 text-sm font-bold hover:bg-[#D7ACA4]/35
                    transition-all flex items-center justify-between active:scale-[0.99] group
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
    <section id="how-it-works" className="py-24 sm:py-32 relative bg-[#F8FAFC]/50 border-t border-slate-200/70">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#C4846C]">
            The Validation Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172132] tracking-tight">
            How Jadeer certifies competence
          </h2>
          <p className="text-sm sm:text-base text-[#5A6472] leading-relaxed">
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
                  shadow-[0_4px_24px_rgba(23,33,50,0.03)]
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

                  <p className="text-[14px] text-[#5A6472] leading-relaxed">
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
          <p className="text-[15px] sm:text-base text-[#5A6472] leading-relaxed">
            Transition smoothly from university projects into production-grade software engineering with calibrated proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((adv) => {
            const Icon = adv.icon;
            return (
              <div
                key={adv.title}
                className="p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 space-y-4 hover:border-[#53789B]/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/80 text-[#53789B] flex items-center justify-center font-bold shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#172132]">
                  {adv.title}
                </h3>
                <p className="text-[13.5px] text-[#5A6472] leading-relaxed">
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
    <section id="evidence" className="py-24 sm:py-32 relative bg-[#F0F2F4]/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(23,33,50,0.04)] text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172132] tracking-tight">
              Ready to validate your engineering capabilities?
            </h2>
            <p className="text-sm sm:text-base text-[#5A6472] max-w-xl mx-auto leading-relaxed">
              Create your unified talent account, take your adaptive AI assessment, and build verifiable proof of your technical depth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              id="final-join-talent-btn"
              className="
                w-full sm:w-auto px-8 py-4 rounded-full
                bg-[#C4846C] text-white text-sm font-bold
                hover:bg-[#b3755e] hover:-translate-y-0.5
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
                bg-[#F8FAFC] text-[#172132] text-sm font-bold
                border border-slate-200/80
                hover:bg-white hover:border-[#53789B]/40 hover:-translate-y-0.5
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
    <footer className="py-12 border-t border-slate-200/70 text-xs text-[#5A6472] bg-[#F0F2F4]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <BrandLogo size="sm" href="/" textColor="dark" />
        <p>© {new Date().getFullYear()} Jadeer Talent Validation Platform. All rights reserved.</p>
        <div className="flex items-center gap-6 font-semibold">
          <Link to="/signin" className="hover:text-[#172132] transition-colors">Sign In</Link>
          <Link to="/signup" className="hover:text-[#172132] transition-colors">Join as Talent</Link>
          <Link to="/employer" className="hover:text-[#C4846C] transition-colors">For Employers</Link>
          <Link to="/admin/signin" className="hover:text-[#53789B] transition-colors flex items-center gap-1 text-[11px] text-[#5A6472]">
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
      <Navbar />
      <HeroSection />
      <LowerFeatureGridSection />
      <ValidationArchitectureSection />
      <TalentAdvantageSection />
      <UnifiedFinalCtaSection />
      <Footer />
    </div>
  );
}
