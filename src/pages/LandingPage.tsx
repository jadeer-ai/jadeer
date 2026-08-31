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
import spiderMatrixImg from '@/assets/spider-matrix-emblem.jpg';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER LANDING PAGE — "DIGITAL HAVEN" (STEEL BLUE & WARM TERRACOTTA)
   - Left Column: Crisp Editorial Typography, Subtext, CTAs & Trust Markers
   - Right Column: High-Fidelity, Opaque 3D Hexagonal Spider Matrix Emblem
   - 3 Detached Floating Feature Cards Below Hero
   - Dynamic Scroll-Reactive Floating Capsule Navbar
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Navigation Links ───────────────────────────────────────────────────── */
const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Validation Pipeline', href: '#pipeline' },
  { label: 'Evidence Dossier', href: '#evidence' },
];

/* ── 3D Hexagonal Spider Matrix Emblem (Right Hero Visual Anchor) ────────── */
function SpiderMatrixEmblemHeroGraphic() {
  return (
    <div className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[510px] aspect-square flex items-center justify-center select-none">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#53789B]/20 via-[#C4846C]/15 to-transparent blur-3xl opacity-60 pointer-events-none" />

      {/* High-Fidelity 3D Textured Spider Matrix Emblem Image */}
      <div className="relative w-full h-full rounded-[32px] overflow-hidden p-2 flex items-center justify-center">
        <img
          src={spiderMatrixImg}
          alt="Jadeer 3D Hexagonal Spider Matrix Emblem"
          className="w-full h-full object-contain drop-shadow-[0_20px_45px_rgba(23,33,50,0.18)] transition-transform duration-500 hover:scale-[1.03]"
          loading="eager"
        />
      </div>
    </div>
  );
}

/* ── Dynamic Scroll-Reactive Capsule Navbar Component ────────────────────── */
function ScrollReactiveNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`
          z-50 transition-all duration-500 ease-out
          ${scrolled
            ? 'fixed top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] px-6 py-2.5 max-w-5xl w-[92%]'
            : 'fixed top-0 left-0 right-0 bg-transparent border-b border-transparent max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-5'
          }
        `}
      >
        <div className="flex items-center justify-between gap-6 sm:gap-8">
          {/* ── Brand Logo (Left): "Jadeer" with Terracotta Accent Dot ── */}
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
        </div>
      </header>

      {/* ── Mobile Dropdown Panel ── */}
      {mobileOpen && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/80 p-5 shadow-xl space-y-4 md:hidden animate-[fade-in_0.2s_ease]">
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
   HERO SECTION: 2-COLUMN BALANCED EDITORIAL & 3D SPIDER EMBLEM
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 sm:pt-44 pb-16 sm:pb-24">
      {/* Background Isometric Perspective Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.25]"
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

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ── Left Column: Editorial Headline & Actions (lg:col-span-7) ── */}
          <div className="lg:col-span-7 space-y-7 sm:space-y-8 text-left">

            {/* Pre-headline Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#C4846C] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-extrabold text-[#64748B] uppercase tracking-widest">
                DIGITAL HAVEN • TECHNICAL VALIDATION MATRIX
              </span>
            </div>

            {/* Core Editorial Headline */}
            <div className="space-y-1">
              <h1 className="leading-[1.12] tracking-tight select-none">
                <span className="block text-[#172132] font-bold text-4xl sm:text-5xl lg:text-[3.85rem]">
                  Your Mentality.
                </span>
                <span className="block text-[#53789B] font-bold text-4xl sm:text-5xl lg:text-[3.85rem]">
                  Our Matrix.
                </span>
                <span className="block text-[#C4846C] font-bold text-4xl sm:text-5xl lg:text-[3.85rem]">
                  Their Peace of Mind.
                </span>
              </h1>
            </div>

            {/* Supporting Narrative */}
            <p className="text-[#64748B] text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              A unified engineering validation platform designed to certify true technical depth through adaptive AI code probing, 1-to-1 Principal Architect defense, and verifiable evidence dossiers.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <Link
                to="/signup"
                id="hero-join-talent-btn"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#C4846C] hover:bg-[#B37357] text-white font-medium rounded-full shadow-[0_8px_20px_rgba(196,132,108,0.28)] hover:shadow-[0_12px_28px_rgba(196,132,108,0.38)] transition-all active:scale-95 text-[15px]"
              >
                <span>Launch Assessment</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              <Link
                to="/signin"
                id="hero-signin-btn"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white hover:bg-slate-50 text-[#172132] border border-slate-300 font-medium rounded-full shadow-2xs transition-all active:scale-95 text-[15px]"
              >
                <span>Access Candidate Portal</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-3 flex flex-wrap items-center gap-5 text-xs sm:text-sm font-medium text-[#64748B]">
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

          {/* ── Right Column: High-Fidelity 3D Hexagonal Spider Emblem (lg:col-span-5) ── */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <SpiderMatrixEmblemHeroGraphic />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3 INDIVIDUAL DETACHED FLOATING FEATURE CARDS (BELOW HERO)
   ═══════════════════════════════════════════════════════════════════════════ */

function DetachedFeatureGridSection() {
  return (
    <section className="py-16 sm:py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── CARD 1: Validation Proof (Zero Resume Guesswork) ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200/70 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              {/* Tag Pill */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D7ACA4]/20 text-[#C4846C] text-xs font-semibold border border-[#D7ACA4]/40">
                <Award className="w-3.5 h-3.5" />
                <span>100% Code-Verified Candidates</span>
              </span>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-[#172132] tracking-tight">
                Zero Resume Guesswork
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Every candidate dossier is backed by live AST execution logs, memory safety verification, and socket multiplexing benchmarks under 10k connections.
              </p>
            </div>

            {/* Bottom Metrics Pill Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="bg-[#F8FAFC] border border-slate-200/80 text-xs font-semibold px-3 py-1 rounded-full text-[#172132]">
                94% Accuracy
              </span>
              <span className="bg-[#F8FAFC] border border-slate-200/80 text-xs font-semibold px-3 py-1 rounded-full text-[#53789B]">
                4.95 Rating
              </span>
              <span className="bg-[#F8FAFC] border border-slate-200/80 text-xs font-semibold px-3 py-1 rounded-full text-[#C4846C]">
                &lt;48h Fast-Track
              </span>
            </div>
          </div>

          {/* ── CARD 2: 1-to-1 Technical Defense ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200/70 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              {/* Tag Pill */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#53789B]/15 text-[#53789B] text-xs font-semibold border border-[#53789B]/30">
                <Layers className="w-3.5 h-3.5" />
                <span>Stage 02B: Human Calibration Pod</span>
              </span>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-[#172132] tracking-tight">
                1-to-1 Technical Defense with Senior Architects
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Candidates defend architectural trade-offs, space/time complexity, and cold-cache stampede strategies directly with Principal Engineers.
              </p>
            </div>

            {/* Bottom Feature Indicator */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#53789B]">
              <span className="w-2 h-2 rounded-full bg-[#53789B] animate-pulse" />
              <span>Interactive Live Evaluation</span>
            </div>
          </div>

          {/* ── CARD 3: Action & Direct Path ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200/70 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#172132] tracking-tight">
                Fast-Track Your Journey
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Start your candidate certification or discover calibrated senior engineering talent immediately.
              </p>
            </div>

            {/* Stacked Full-Width Action Buttons */}
            <div className="space-y-2.5">
              <Link
                to="/signup"
                className="w-full bg-[#C4846C] hover:bg-[#B37357] text-white py-3 rounded-full font-medium shadow-sm text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Launch Candidate Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/employer"
                className="w-full border border-slate-200 text-[#172132] hover:bg-slate-50 py-3 rounded-full font-medium text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <span>Hire Verified Talent</span>
                <ArrowUpRight className="w-4 h-4 text-[#53789B]" />
              </Link>
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
      <ScrollReactiveNavbar />
      <HeroSection />
      <DetachedFeatureGridSection />
      <ValidationArchitectureSection />
      <TalentAdvantageSection />
      <UnifiedFinalCtaSection />
      <Footer />
    </div>
  );
}
