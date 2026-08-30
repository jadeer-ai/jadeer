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
   JADEER LANDING PAGE — "DIGITAL HAVEN / THE BLANK CANVAS"
   - Centered 3-line Editorial Headline:
     • Line 1: "Your Mentality." in Deep Charcoal Navy (#172132)
     • Line 2: "Our Matrix." in Steel Denim Blue (#53789B)
     • Line 3: "Their Peace of Mind." in Warm Terracotta (#C4846C)
   - Deep Atmospheric Background: 3D enterprise skyline with subtle 3D wireframe
     holographic logos of Google, Microsoft, Amazon, and Meta in the clouds
   - Clean, centered pillowy dual CTAs & trust indicators
   - 100% Porcelain White daylight design system (#F0F2F4 / #FFFFFF)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Navigation Links ───────────────────────────────────────────────────── */
const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Validation Pipeline', href: '#pipeline' },
  { label: 'Evidence Dossier', href: '#evidence' },
];

/* ── 3D Enterprise Skyline with Subtly Integrated Tech Logos in Clouds ───── */
function EnterpriseSkylineBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Underlying Perspective Wireframe Grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(83, 120, 155, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(83, 120, 155, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, #000 30%, transparent 80%)',
        }}
      />

      {/* 2. Full-Width 3D Monochromatic Tech Cityscape & Holographic Logos SVG */}
      <svg
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[1650px] h-[860px] opacity-[0.32] mix-blend-multiply"
        viewBox="0 0 1650 860"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#53789B" strokeWidth="1">
          {/* ═══════════════════════════════════════════════════════════════
             3D WIREFRAME TECH LOGOS INTEGRATED IN HORIZON CLOUDS
             (Low opacity, ambient, atmospheric part of the mental grid)
             ═══════════════════════════════════════════════════════════════ */}

          {/* ── 1. Google 'G' 3D Wireframe Silhouette (Left Sky: x: 300, y: 110) ── */}
          <g opacity="0.38" stroke="#53789B" strokeWidth="1.2">
            <path
              d="M 360,110 A 55,55 0 1 0 360,190 L 360,150 L 315,150"
              fill="none"
              strokeDasharray="3 3"
            />
            <path
              d="M 370,100 A 65,65 0 1 0 370,200 L 370,140 L 310,140"
              fill="none"
              strokeOpacity="0.5"
            />
            <line x1="360" y1="110" x2="370" y2="100" strokeOpacity="0.4" />
            <line x1="360" y1="190" x2="370" y2="200" strokeOpacity="0.4" />
            <line x1="315" y1="150" x2="310" y2="140" strokeOpacity="0.4" />
          </g>

          {/* ── 2. Microsoft 4-Quadrant 3D Perspective Cube (Mid-Left Sky: x: 590, y: 95) ── */}
          <g opacity="0.42" stroke="#53789B" strokeWidth="1.1">
            {/* Top-Left Quadrant */}
            <polygon points="570,100 610,85 610,125 570,140" fill="#FFFFFF" fillOpacity="0.6" strokeDasharray="3 3" />
            {/* Top-Right Quadrant */}
            <polygon points="620,80 660,65 660,105 620,120" fill="#FFFFFF" fillOpacity="0.6" strokeDasharray="3 3" />
            {/* Bottom-Left Quadrant */}
            <polygon points="570,150 610,135 610,175 570,190" fill="#FFFFFF" fillOpacity="0.6" strokeDasharray="3 3" />
            {/* Bottom-Right Quadrant */}
            <polygon points="620,130 660,115 660,155 620,170" fill="#FFFFFF" fillOpacity="0.6" strokeDasharray="3 3" />
          </g>

          {/* ── 3. Amazon Horizon Curve & Arrow (Mid-Right Sky: x: 980, y: 120) ── */}
          <g opacity="0.4" stroke="#C4846C" strokeWidth="1.3">
            <path
              d="M 900,145 Q 980,185 1060,145"
              fill="none"
              strokeDasharray="4 2"
            />
            {/* Perspective Arrow Head */}
            <path
              d="M 1045,135 L 1065,145 L 1050,158"
              fill="none"
              strokeWidth="1.5"
            />
            <path
              d="M 895,140 Q 980,178 1065,140"
              fill="none"
              stroke="#D7ACA4"
              strokeOpacity="0.6"
            />
          </g>

          {/* ── 4. Meta 3D Infinity Loop Silhouette (Right Sky: x: 1280, y: 110) ── */}
          <g opacity="0.38" stroke="#53789B" strokeWidth="1.2">
            <path
              d="M 1240,150 C 1210,110 1170,110 1170,150 C 1170,190 1230,190 1270,150 C 1310,110 1370,110 1370,150 C 1370,190 1330,190 1300,150 Z"
              fill="none"
              strokeDasharray="4 3"
            />
            <path
              d="M 1245,145 C 1215,105 1175,105 1175,145 C 1175,185 1235,185 1275,145 C 1315,105 1375,105 1375,145 C 1375,185 1335,185 1305,145 Z"
              fill="none"
              strokeOpacity="0.45"
            />
          </g>

          {/* ═══════════════════════════════════════════════════════════════
             3D MONOCHROMATIC SKYSCRAPERS & ENTERPRISE ARCHITECTURE
             ═══════════════════════════════════════════════════════════════ */}

          {/* ── Left Far Hub (Deep Silhouette) ── */}
          <polygon points="120,490 200,440 280,490 200,540" fill="#FFFFFF" fillOpacity="0.75" />
          <polygon points="120,490 200,540 200,720 120,670" fill="#53789B" fillOpacity="0.08" />
          <polygon points="200,540 280,490 280,670 200,720" fill="#172132" fillOpacity="0.05" />

          {/* ── Mid-Left Skyscraper Tower ── */}
          <polygon points="320,380 440,300 560,380 440,460" fill="#FFFFFF" fillOpacity="0.9" />
          <polygon points="320,380 440,460 440,770 320,690" fill="#53789B" fillOpacity="0.14" />
          <polygon points="440,460 560,380 560,690 440,770" fill="#172132" fillOpacity="0.08" />
          {/* Spire */}
          <line x1="440" y1="300" x2="440" y2="200" stroke="#C4846C" strokeWidth="1.8" strokeOpacity="0.75" />
          <circle cx="440" cy="200" r="3.5" fill="#C4846C" />

          {/* ── Central Grand Enterprise Monolith ── */}
          <polygon points="680,260 820,170 960,260 820,350" fill="#FFFFFF" fillOpacity="0.95" />
          <polygon points="680,260 820,350 820,800 680,710" fill="#53789B" fillOpacity="0.18" />
          <polygon points="820,350 960,260 960,710 820,800" fill="#172132" fillOpacity="0.12" />
          {/* Floor bands */}
          <line x1="680" y1="350" x2="820" y2="440" strokeOpacity="0.35" />
          <line x1="820" y1="440" x2="960" y2="350" strokeOpacity="0.35" />
          <line x1="680" y1="440" x2="820" y2="530" strokeOpacity="0.35" />
          <line x1="820" y1="530" x2="960" y2="440" strokeOpacity="0.35" />
          <line x1="680" y1="530" x2="820" y2="620" strokeOpacity="0.35" />
          <line x1="820" y1="620" x2="960" y2="530" strokeOpacity="0.35" />
          {/* Glass Atrium */}
          <polygon points="750,215 820,170 890,215 820,260" fill="#D7ACA4" fillOpacity="0.25" stroke="#D7ACA4" />

          {/* ── Mid-Right Stepped Terraced Tower ── */}
          <polygon points="1020,320 1140,240 1260,320 1140,400" fill="#FFFFFF" fillOpacity="0.9" />
          <polygon points="1020,320 1140,400 1140,760 1020,680" fill="#53789B" fillOpacity="0.15" />
          <polygon points="1140,400 1260,320 1260,680 1140,760" fill="#172132" fillOpacity="0.09" />
          {/* Terraced Roof */}
          <polygon points="1060,290 1140,235 1220,290 1140,345" fill="#C4846C" fillOpacity="0.2" stroke="#C4846C" />

          {/* ── Far Right Secondary Hub ── */}
          <polygon points="1280,430 1380,370 1480,430 1380,490" fill="#FFFFFF" fillOpacity="0.85" />
          <polygon points="1280,430 1380,490 1380,720 1280,660" fill="#53789B" fillOpacity="0.1" />
          <polygon points="1380,490 1480,430 1480,660 1380,720" fill="#172132" fillOpacity="0.06" />

          {/* ── Perspective Floating Wireframe Data Nodes ── */}
          <polygon points="490,190 535,165 580,190 535,215" fill="#FFFFFF" fillOpacity="0.75" stroke="#53789B" strokeWidth="0.9" />
          <polygon points="900,180 945,155 990,180 945,205" fill="#FFFFFF" fillOpacity="0.75" stroke="#C4846C" strokeWidth="0.9" />
          <line x1="535" y1="215" x2="680" y2="260" stroke="#53789B" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.4" />
          <line x1="945" y1="205" x2="820" y2="170" stroke="#C4846C" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.5" />
        </g>
      </svg>

      {/* 3. Volumetric Daylight Clouds & Atmospheric Fog Blending */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% 25%, rgba(215, 172, 164, 0.1) 0%, rgba(83, 120, 155, 0.08) 35%, transparent 75%),
            linear-gradient(to bottom, rgba(240, 242, 244, 0) 0%, rgba(240, 242, 244, 0.5) 45%, #F0F2F4 85%, #F0F2F4 100%)
          `,
        }}
      />

      {/* 4. Ambient Top Horizon Halo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[380px] bg-gradient-to-b from-[#53789B]/10 via-[#D7ACA4]/10 to-transparent blur-3xl opacity-60 pointer-events-none" />
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
          ? 'bg-[#F0F2F4]/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_rgba(23,33,50,0.03)]'
          : 'bg-transparent border-b border-slate-200/40'
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="flex h-[76px] items-center justify-between">

          {/* ── Brand Logo ──────────────────────────────────────────── */}
          <BrandLogo size="md" href="/" textColor="dark" />

          {/* ── Center Frosted Pill Navigation Capsule ──────────────── */}
          <div className="hidden md:flex items-center gap-6 bg-white/80 backdrop-blur-md px-8 py-2.5 rounded-full border border-slate-200/60 shadow-2xs">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  text-[13.5px] font-medium text-[#5A6472]
                  transition-colors duration-200 hover:text-[#172132]
                "
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Desktop Actions ────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/employer"
              id="nav-for-companies"
              className="
                px-3 py-2 text-[14px] font-semibold text-[#5A6472]
                transition-colors duration-200 hover:text-[#172132]
              "
            >
              For Companies
            </Link>

            <SignedOut>
              <Link
                to="/signin"
                id="nav-signin"
                className="
                  px-3 py-2 text-[14px] font-semibold text-[#172132]
                  transition-colors duration-200 hover:text-[#53789B]
                "
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                id="nav-join-talent"
                className="
                  inline-flex items-center gap-1.5 px-5 py-2.5
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
                  px-3 py-2 text-[14px] font-semibold text-[#172132]
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
   EXPANSIVE HERO SECTION: CENTERED 3-LINE HEADLINE & DAYLIGHT SKYLINE
   (Single Centered Block over Landscape with Specific 3-Color Hierarchy)
   ═══════════════════════════════════════════════════════════════════════════ */

function ExpansiveHeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 sm:pt-48 pb-20 sm:pb-32">
      {/* 3D Atmospheric Tech Skyline & Clouds Background */}
      <EnterpriseSkylineBackground />

      <div className="relative mx-auto max-w-5xl px-6 sm:px-10 lg:px-12 text-center z-10 space-y-8 sm:space-y-10">

        {/* ── Pre-headline Eyebrow Badge ── */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-sm animate-[fade-in_0.5s_ease]">
          <span className="w-2 h-2 rounded-full bg-[#C4846C]" />
          <span className="text-[11px] sm:text-xs font-extrabold text-[#64748B] uppercase tracking-widest">
            DIGITAL HAVEN • TECHNICAL VALIDATION MATRIX
          </span>
        </div>

        {/* ── Centered Main Headline Split into 3 Lines with Exact Colors ── */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.14] tracking-tight">
            {/* Line 1: Deep Charcoal Navy (#172132) */}
            <span className="block text-[#172132]">
              Your Mentality.
            </span>

            {/* Line 2: Steel Denim Blue (#53789B) */}
            <span className="block text-[#53789B]">
              Our Matrix.
            </span>

            {/* Line 3: Warm Terracotta (#C4846C) */}
            <span className="block text-[#C4846C]">
              Their Peace of Mind.
            </span>
          </h1>
        </div>

        {/* ── Refined Editorial Subtitle ── */}
        <p className="text-base sm:text-lg lg:text-[18.5px] text-[#5A6472] leading-[1.7] max-w-2xl mx-auto font-normal">
          A unified engineering validation platform designed to certify true technical depth through adaptive AI code probing, 1-to-1 Principal Architect defense, and verifiable evidence dossiers.
        </p>

        {/* ── Centered Pillowy Dual Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/signup"
            id="hero-join-talent-btn"
            className="
              w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5
              bg-[#C4846C] text-white text-[15px] font-bold rounded-2xl
              transition-all duration-300 hover:bg-[#b3755e] hover:-translate-y-0.5
              hover:shadow-[0_14px_32px_rgba(196,132,108,0.32)] active:scale-[0.98] shadow-md
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
              bg-white text-[#172132] border border-slate-200/90
              text-[15px] font-bold rounded-2xl transition-all duration-300
              hover:border-[#53789B]/40 hover:bg-[#F8FAFC] hover:-translate-y-0.5
              active:scale-[0.98] shadow-2xs
            "
          >
            <span>Access Candidate Portal</span>
          </Link>
        </div>

        {/* ── Centered Trust & Calibration Indicators ── */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-[#64748B]">
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
   LOWER FEATURE GRID: 3-COLUMN PORCELAIN CLAY CARDS
   ═══════════════════════════════════════════════════════════════════════════ */

function LowerFeatureGridSection() {
  return (
    <section className="relative pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* Clean 3-Column Split Card in Porcelain White */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_-15px_rgba(23,33,50,0.05)] overflow-hidden">
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
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
    <section id="how-it-works" className="py-24 sm:py-32 relative bg-[#F8FAFC]/60 border-t border-slate-200/70">
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
                className="p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 space-y-4 hover:border-[#53789B]/40 transition-colors shadow-2xs"
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
    <section id="evidence" className="py-24 sm:py-32 relative bg-[#F0F2F4]/70">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(23,33,50,0.05)] text-center max-w-4xl mx-auto space-y-8">
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
    <footer className="py-12 border-t border-slate-200/70 text-xs text-[#64748B] bg-[#F0F2F4]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <BrandLogo size="sm" href="/" textColor="dark" />
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
      <Navbar />
      <ExpansiveHeroSection />
      <LowerFeatureGridSection />
      <ValidationArchitectureSection />
      <TalentAdvantageSection />
      <UnifiedFinalCtaSection />
      <Footer />
    </div>
  );
}
