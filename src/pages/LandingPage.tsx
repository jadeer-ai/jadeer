import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Video,
  Building2,
  Zap,
  Check,
} from 'lucide-react';
import { BrandLogo } from '@/components/common';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER LANDING PAGE — UNIFIED TALENT CERTIFICATION PLATFORM
   Single 'Join as Talent' entry point uniting students & graduates:
   Adaptive AI Assessments • 1-on-1 Mentor Calibration • Evidence Dossiers
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Navigation Links ───────────────────────────────────────────────────── */

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Validation Pipeline', href: '#pipeline' },
  { label: 'Evidence Dossier', href: '#evidence' },
  { label: 'Mentorship', href: '#mentorship' },
];

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
        bg-[#0B0F19] text-white border-b border-white/[0.08]
        ${scrolled ? 'shadow-[0_12px_32px_rgba(0,0,0,0.35)]' : ''}
      `}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="flex h-[76px] items-center justify-between">

          {/* ── Brand Logo in Light Theme ──────────────────────────── */}
          <BrandLogo size="md" href="/" textColor="light" />

          {/* ── Desktop Nav Links ──────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  relative px-4 py-2 text-[14.5px] font-medium text-white/80
                  transition-colors duration-200 hover:text-white
                  group
                "
              >
                {link.label}
                <span
                  className="
                    absolute bottom-0.5 left-4 right-4 h-[2px] bg-[#6E8F75]
                    origin-left scale-x-0 transition-transform duration-300 ease-out
                    group-hover:scale-x-100 rounded-full
                  "
                />
              </a>
            ))}
          </div>

          {/* ── Desktop Actions ────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/signin"
              id="nav-signin"
              className="
                px-3.5 py-2 text-[14.5px] font-semibold text-white/85
                transition-colors duration-200 hover:text-white
              "
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              id="nav-join-talent"
              className="
                inline-flex items-center gap-2 px-5 py-2.5
                bg-[#6E8F75] text-white text-[14px] font-bold
                rounded-full transition-all duration-300
                hover:bg-[#5d7d64] hover:-translate-y-0.5
                hover:shadow-[0_8px_20px_rgba(110,143,117,0.35)]
                active:translate-y-0 active:scale-[0.98] shadow-sm
              "
            >
              <span>Join as Talent</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ── Mobile Menu Toggle ─────────────────────────────────── */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
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
        <div className="bg-[#0B0F19] border-t border-white/[0.08] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-[15px] font-semibold text-white/80 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2.5">
            <Link
              to="/employer"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-3 text-sm font-bold text-white rounded-2xl bg-white/[0.06] hover:bg-white/10"
            >
              For Employers
            </Link>
            <Link
              to="/signin"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-3 text-sm font-bold text-white rounded-2xl bg-white/[0.06] hover:bg-white/10"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-3 text-sm font-bold text-white bg-[#6E8F75] rounded-2xl shadow-sm"
            >
              Join as Talent →
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. UNIFIED HERO SECTION (SINGLE ENTRY POINT)
   ═══════════════════════════════════════════════════════════════════════════ */

function UnifiedHeroSection() {
  return (
    <section className="relative overflow-hidden pt-40 sm:pt-48 pb-24 sm:pb-32 lg:pb-36">
      {/* Subtle Engineering Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(11, 15, 25, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(11, 15, 25, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, #000 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, #000 30%, transparent 80%)',
        }}
      />

      {/* Diffused Dual Glow */}
      <div
        className="absolute top-24 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full pointer-events-none blur-3xl opacity-35"
        style={{
          background: 'radial-gradient(circle at center, rgba(110,143,117,0.25) 0%, rgba(0,86,214,0.08) 45%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* Left Column: Headline & Unified Actions */}
          <div className="lg:col-span-7 space-y-7 sm:space-y-8 text-center lg:text-left">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#0B0F19]/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-[fade-in_0.5s_ease]">
              <span className="w-2 h-2 rounded-full bg-[#6E8F75] animate-pulse" />
              <span className="text-xs font-extrabold text-[#0B0F19]/75 uppercase tracking-wider">
                Single Talent Portal • Engineering Certification
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className="
                text-[clamp(2.5rem,5vw,4.15rem)] font-extrabold text-[#0B0F19]
                leading-[1.14] tracking-tight
                animate-[slide-up_0.6s_var(--ease-spring)_0.1s_both]
              "
            >
              Certify your engineering depth with{' '}
              <span className="relative inline-block text-[#6E8F75]">
                verifiable proof.
                <span className="absolute bottom-1 left-0 right-0 h-[3px] bg-[#6E8F75]/30 rounded-full" />
              </span>
            </h1>

            {/* Sub-headline */}
            <p
              className="
                text-[16px] sm:text-[18px] text-[#0B0F19]/65
                leading-[1.7] max-w-2xl mx-auto lg:mx-0 font-normal
                animate-[slide-up_0.6s_var(--ease-spring)_0.2s_both]
              "
            >
              Whether you are a university student seeking industry mentorship or a graduate targeting full-time engineering roles, Jadeer evaluates your code depth through adaptive AI assessments, mentor calibration, and live evidence dossiers.
            </p>

            {/* ── Single Unified CTAs ── */}
            <div
              className="
                flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2
                animate-[slide-up_0.6s_var(--ease-spring)_0.3s_both]
              "
            >
              <Link
                to="/signup"
                id="hero-join-talent-btn"
                className="
                  w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4
                  bg-[#0B0F19] text-white text-[15px] font-bold rounded-2xl
                  transition-all duration-300 hover:bg-[#1A2433] hover:-translate-y-0.5
                  hover:shadow-[0_12px_28px_rgba(11,15,25,0.22)] active:scale-[0.98] shadow-md
                "
              >
                <span>Join as Talent</span>
                <ArrowRight className="w-4.5 h-4.5 text-[#6E8F75]" />
              </Link>

              <Link
                to="/signin"
                id="hero-signin-btn"
                className="
                  w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4
                  border-2 border-[#0B0F19]/[0.12] bg-white text-[#0B0F19]
                  text-[15px] font-bold rounded-2xl transition-all duration-300
                  hover:border-[#0B0F19]/30 hover:bg-[#FAF9F6] hover:-translate-y-0.5
                  active:scale-[0.98] shadow-xs
                "
              >
                <span>Sign In to Portal</span>
              </Link>
            </div>

            {/* Unified Micro-Badges Bar */}
            <div className="pt-3 flex justify-center lg:justify-start">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-5 py-3 rounded-2xl bg-white/90 border border-[#0B0F19]/[0.07] shadow-xs text-xs font-semibold text-[#0B0F19]/70">
                <span className="flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-[#6E8F75]" />
                  Adaptive AI Code Radar
                </span>
                <span className="text-[#0B0F19]/20 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  1-on-1 Mentor Calibration
                </span>
                <span className="text-[#0B0F19]/20 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Single User Architecture
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Candidate Dossier Preview */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
            <div className="w-full max-w-[440px] bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.08] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] space-y-5 relative overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-[#6E8F75] via-blue-500 to-[#6E8F75] absolute top-0 left-0" />

              {/* Dossier Header */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B0F19] to-[#1E2C42] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    AH
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0B0F19]">Ahmad Al-Hassan</h3>
                    <p className="text-xs text-[#0B0F19]/50 font-medium">Backend & Systems Track • KFUPM</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold">
                  92% Verified
                </span>
              </div>

              {/* Competency Telemetry Bars */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#0B0F19]/45 block">
                  Synchronized Telemetry:
                </span>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#0B0F19]/80 mb-1">
                      <span>C++20 & Memory Layout (RAII)</span>
                      <span className="text-[#6E8F75] font-extrabold">95%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white border border-[#0B0F19]/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-[#6E8F75]" style={{ width: '95%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#0B0F19]/80 mb-1">
                      <span>System Design & Distributed Queues</span>
                      <span className="text-blue-500 font-extrabold">88%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white border border-[#0B0F19]/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: '88%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mentor Calibration Pill */}
              <div className="p-3.5 rounded-2xl bg-[#0B0F19]/[0.02] border border-[#0B0F19]/[0.05] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  <span className="text-[#0B0F19]/70 font-medium">1-to-1 Mentor Calibrated</span>
                </div>
                <span className="font-bold text-[#0B0F19]">Eng. Sara @ Instabug</span>
              </div>

              {/* Direct CTA */}
              <Link
                to="/signup"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] transition-all"
              >
                <span>Create Your Verified Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. THREE-STAGE VALIDATION ARCHITECTURE
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
    <section id="how-it-works" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#6E8F75]">
            The Validation Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
            How Jadeer certifies competence
          </h2>
          <p className="text-sm sm:text-base text-[#0B0F19]/55 leading-relaxed">
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
                  border border-[#0B0F19]/[0.05]
                  shadow-[0_20px_50px_-20px_rgba(0,0,0,0.03)]
                  flex flex-col justify-between space-y-6
                  hover:border-[#6E8F75]/30 hover:-translate-y-1
                  hover:shadow-[0_25px_60px_-15px_rgba(110,143,117,0.12)]
                  transition-all duration-300 group
                "
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-[#6E8F75] flex items-center justify-center font-extrabold group-hover:bg-[#6E8F75] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-extrabold text-[#0B0F19]/25">
                      {pillar.num}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-0.5 rounded-md">
                    {pillar.badge}
                  </span>

                  <h3 className="text-xl font-bold text-[#0B0F19] leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-[14px] text-[#0B0F19]/60 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <Link
                  to="/signup"
                  className="pt-4 border-t border-[#0B0F19]/[0.04] flex items-center text-xs font-bold text-[#6E8F75] group-hover:text-[#5d7d64] transition-colors"
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
   3. VALUE PROPOSITION & ADVANTAGE SECTION
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
    <section id="pipeline" className="py-24 sm:py-32 bg-white border-y border-[#0B0F19]/[0.04]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#6E8F75]">
            Built for Students & Junior Engineers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
            Get hired on proven merit, not pedigree.
          </h2>
          <p className="text-[15px] sm:text-base text-[#0B0F19]/60 leading-relaxed">
            Transition smoothly from university projects into production-grade software engineering with calibrated proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((adv) => {
            const Icon = adv.icon;
            return (
              <div
                key={adv.title}
                className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] space-y-4 hover:border-[#6E8F75]/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-[#0B0F19]/[0.06] text-[#6E8F75] flex items-center justify-center font-bold shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0B0F19]">
                  {adv.title}
                </h3>
                <p className="text-[13.5px] text-[#0B0F19]/60 leading-relaxed">
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
   4. EMPLOYER CALLOUT SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function EmployerCalloutSection() {
  return (
    <section className="py-16 sm:py-20 relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0B0F19] text-white border border-white/[0.08] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#6E8F75]">
              <Building2 className="w-3.5 h-3.5" />
              <span>For Companies & Hiring Managers</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              Looking to hire pre-calibrated engineering talent?
            </h3>
            <p className="text-sm text-white/65 leading-relaxed">
              Explore verified candidate evidence dossiers, inspect automated code quality telemetry, and schedule 1-click interviews.
            </p>
          </div>

          <Link
            to="/employer"
            className="
              inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl
              bg-[#6E8F75] text-white text-sm font-bold shrink-0
              hover:bg-[#5d7d64] hover:shadow-[0_8px_20px_rgba(110,143,117,0.35)]
              transition-all
            "
          >
            <span>Explore Employer Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. UNIFIED FINAL CTA SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function UnifiedFinalCtaSection() {
  return (
    <section id="evidence" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-[#0B0F19]/[0.05] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
              Ready to validate your engineering capabilities?
            </h2>
            <p className="text-sm sm:text-base text-[#0B0F19]/55 max-w-xl mx-auto leading-relaxed">
              Create your unified talent account, take your adaptive AI assessment, and build verifiable proof of your technical depth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              id="final-join-talent-btn"
              className="
                w-full sm:w-auto px-8 py-4 rounded-full
                bg-[#6E8F75] text-white text-sm font-bold
                hover:bg-[#5d7d64] hover:-translate-y-0.5
                hover:shadow-[0_12px_28px_rgba(110,143,117,0.28)]
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
                bg-[#FAF9F6] text-[#0B0F19] text-sm font-bold
                border border-[#0B0F19]/[0.08]
                hover:bg-white hover:border-[#0B0F19]/20 hover:-translate-y-0.5
                transition-all duration-300
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
    <footer className="py-12 border-t border-[#0B0F19]/[0.05] text-xs text-[#0B0F19]/45">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <BrandLogo size="sm" href="/" textColor="dark" />
        <p>© {new Date().getFullYear()} Jadeer Talent Validation Platform. Cairo, EG. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/signin" className="hover:text-[#0B0F19] transition-colors">Sign In</Link>
          <Link to="/signup" className="hover:text-[#0B0F19] transition-colors">Join as Talent</Link>
          <Link to="/employer" className="hover:text-[#6E8F75] transition-colors">For Employers</Link>
          <Link to="/admin/signin" className="hover:text-[#6E8F75] font-semibold transition-colors flex items-center gap-1 text-[11px] text-[#0B0F19]/60">
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LANDING PAGE — UNIFIED TALENT ENTRY
   ══════════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0B0F19] selection:bg-[#6E8F75]/20 selection:text-[#0B0F19]">
      <Navbar />
      <UnifiedHeroSection />
      <ValidationArchitectureSection />
      <TalentAdvantageSection />
      <EmployerCalloutSection />
      <UnifiedFinalCtaSection />
      <Footer />
    </div>
  );
}
