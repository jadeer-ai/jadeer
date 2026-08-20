import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  BrainCircuit,
  FolderGit2,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Code2,
  Terminal,
  Cpu,
  GraduationCap,
} from 'lucide-react';
import { BrandLogo } from '@/components/common';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER LANDING PAGE — CANDIDATE & STUDENT EDITION
   Deep Navy top navbar, subtle technical grid hero with diffused radial glow,
   and candidate-centric validation pipeline.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Navigation Links (Candidate Centric) ───────────────────────────────── */

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Validation Pipeline', href: '#pipeline' },
  { label: 'Evidence Dossier', href: '#evidence' },
];

/* ── Navbar Component (Solid Deep Navy with Light Contrast) ─────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

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

          {/* ── Official Brand Logo in Light Theme ──────────────────── */}
          <BrandLogo size="md" href="/" textColor="light" />

          {/* ── Desktop Nav Links (Pure White / Light Cream) ────────── */}
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
                {/* Subtle animated green underline */}
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
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/signin"
              id="nav-signin"
              className="
                px-4 py-2 text-[14.5px] font-semibold text-white/85
                transition-colors duration-200 hover:text-white
              "
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              id="nav-get-verified"
              className="
                inline-flex items-center gap-2 px-6 py-2.5
                bg-[#6E8F75] text-white text-[14px] font-bold
                rounded-full transition-all duration-300
                hover:bg-[#5d7d64] hover:-translate-y-0.5
                hover:shadow-[0_8px_20px_rgba(110,143,117,0.35)]
                active:translate-y-0 active:scale-[0.98] shadow-sm
              "
            >
              Get Verified
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
              Get Verified
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero Section (Technical Grid + Diffused Glow) ───────────────────────── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-44 sm:pt-52 pb-28 sm:pb-36">
      {/* ── 1. Subtle Engineering Technical Grid ────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
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

      {/* ── 2. Diffused Radial Glow sitting behind the headline ─────── */}
      <div
        className="absolute top-28 left-1/2 -translate-x-1/2 w-[760px] h-[520px] rounded-full pointer-events-none blur-3xl opacity-40"
        style={{
          background: 'radial-gradient(circle at center, rgba(110,143,117,0.22) 0%, rgba(11,15,25,0.06) 50%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-3.5xl text-center space-y-8">

          {/* Eyebrow Pill Badge (Cairo, EG) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#0B0F19]/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-[fade-in_0.5s_ease]">
            <span className="w-2 h-2 rounded-full bg-[#6E8F75] animate-pulse" />
            <span className="text-xs font-extrabold text-[#0B0F19]/75 uppercase tracking-wider">
              Talent Validation Standard • Cairo, EG
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className="
              text-[clamp(2.5rem,5.5vw,4.25rem)] font-extrabold text-[#0B0F19]
              leading-[1.12] tracking-tight
              animate-[slide-up_0.6s_var(--ease-spring)_0.1s_both]
            "
          >
            Transforming candidate potential into{' '}
            <span className="relative inline-block text-[#6E8F75]">
              verified performance.
              <span className="absolute bottom-1 left-0 right-0 h-[3px] bg-[#6E8F75]/30 rounded-full" />
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="
              mx-auto max-w-2xl text-[16.5px] sm:text-[19px] text-[#0B0F19]/55
              leading-relaxed font-normal
              animate-[slide-up_0.6s_var(--ease-spring)_0.2s_both]
            "
          >
            Jadeer replaces subjective resumes and generic coding quizzes with supervised industry projects, AI-powered conversational assessments, and cryptographically verified evidence.
          </p>

          {/* Dual Action CTAs with Luxurious Hover-Lift */}
          <div
            className="
              pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5
              animate-[slide-up_0.6s_var(--ease-spring)_0.3s_both]
            "
          >
            <Link
              to="/signup"
              id="hero-cta-candidate"
              className="
                inline-flex items-center gap-2.5 px-8 py-4
                bg-[#6E8F75] text-white text-[15px] font-bold
                rounded-full transition-all duration-300
                hover:bg-[#5d7d64] hover:-translate-y-0.5
                hover:shadow-[0_14px_32px_rgba(110,143,117,0.3)]
                active:translate-y-0 active:scale-[0.98]
                w-full sm:w-auto justify-center shadow-md
              "
            >
              Start Validation Journey
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/signin"
              id="hero-cta-signin"
              className="
                inline-flex items-center gap-2 px-8 py-4
                bg-white text-[#0B0F19] text-[15px] font-bold
                rounded-full border border-[#0B0F19]/[0.08]
                transition-all duration-300
                hover:bg-[#FAF9F6] hover:border-[#0B0F19]/20 hover:-translate-y-0.5
                hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]
                active:translate-y-0 active:scale-[0.98]
                w-full sm:w-auto justify-center shadow-sm
              "
            >
              Sign In to Portal
            </Link>
          </div>

          {/* Trust Pillars */}
          <div
            className="
              pt-12 sm:pt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14
              border-t border-[#0B0F19]/[0.05]
              animate-[fade-in_0.7s_ease_0.4s_both]
            "
          >
            {[
              { value: 'AI Adaptive', label: 'Architecture & OOP Evaluation' },
              { value: 'Supervised', label: 'Production Industry Pods' },
              { value: '100% Certified', label: 'Cryptographic Evidence Dossier' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3.5 text-left">
                <div className="h-10 w-[3px] rounded-full bg-[#6E8F75]/30" />
                <div>
                  <p className="text-[15px] font-extrabold text-[#0B0F19]">
                    {item.value}
                  </p>
                  <p className="text-xs text-[#0B0F19]/45">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 3-Tier Validation Standard Section ─────────────────────────────────── */

function StandardSection() {
  const pillars = [
    {
      num: '01',
      title: 'Adaptive AI Technical Interview',
      desc: 'Deep conversational text and voice assessment evaluating internal memory layout, OOP design patterns, vtable overhead, and exception safety in real time.',
      icon: BrainCircuit,
      badge: 'Cognitive Calibration',
    },
    {
      num: '02',
      title: 'Supervised Project Execution',
      desc: 'Candidates are assigned to real-world software modules (e.g. Distributed Task Queues), building production pull requests reviewed by Senior Tech Mentors.',
      icon: FolderGit2,
      badge: 'Production Pods',
    },
    {
      num: '03',
      title: 'Verified Evidence Dossier',
      desc: 'Companies receive verifiable code commits, Valgrind leak reports, and rubric-backed mentor statements rather than unverified resumes.',
      icon: FileCheck2,
      badge: 'PDF Export Ready',
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
            A three-stage pipeline designed to transition engineers from theoretical knowledge to verifiable industry performance.
          </p>
        </div>

        {/* 3 Pure White Cards with Diffused Ambient Shadows */}
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

                <div className="pt-4 border-t border-[#0B0F19]/[0.04] flex items-center text-xs font-bold text-[#6E8F75] group-hover:text-[#5d7d64] transition-colors">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Candidate-Centric Value Section ────────────────────────────────────── */

function CandidateAdvantageSection() {
  const advantages = [
    {
      title: 'Evidence Beats Guesswork',
      desc: 'Never struggle with "years of experience" requirements again. Your Jadeer dossier proves you have solved real systems problems.',
      icon: ShieldCheck,
    },
    {
      title: 'Live Senior Mentorship',
      desc: 'Receive code reviews from Principal Engineers at top tech companies, sharpening your architectural decision-making.',
      icon: GraduationCap,
    },
    {
      title: 'Direct Interview Inbound',
      desc: 'Companies skip preliminary screening rounds and send 1-on-1 technical interview requests directly to your email.',
      icon: Terminal,
    },
  ];

  return (
    <section id="pipeline" className="py-24 sm:py-32 bg-white border-y border-[#0B0F19]/[0.04]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#6E8F75]">
            Built for Junior Engineers & Students
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
            Get hired on proven merit, not pedigree.
          </h2>
          <p className="text-[15px] sm:text-base text-[#0B0F19]/60 leading-relaxed">
            Transition smoothly from university projects to production-grade engineering with verified code contributions and mentor calibration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((adv) => {
            const Icon = adv.icon;
            return (
              <div
                key={adv.title}
                className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] space-y-4"
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-[#0B0F19]/[0.06] text-[#6E8F75] flex items-center justify-center font-bold">
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

/* ── Call to Action Banner ──────────────────────────────────────────────── */

function FinalCtaSection() {
  return (
    <section id="evidence" className="py-24 sm:py-32 relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-[#0B0F19]/[0.05] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
              Ready to validate your engineering capabilities?
            </h2>
            <p className="text-sm sm:text-base text-[#0B0F19]/55 max-w-xl mx-auto leading-relaxed">
              Create your candidate profile, take your adaptive AI assessment, and build verifiable proof of your technical depth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="
                w-full sm:w-auto px-8 py-4 rounded-full
                bg-[#6E8F75] text-white text-sm font-bold
                hover:bg-[#5d7d64] hover:-translate-y-0.5
                hover:shadow-[0_12px_28px_rgba(110,143,117,0.28)]
                active:translate-y-0 active:scale-[0.98]
                transition-all duration-300 shadow-md
              "
            >
              Create Candidate Account
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
          <Link to="/signin" className="hover:text-[#0B0F19] transition-colors">Candidate Sign In</Link>
          <Link to="/signup" className="hover:text-[#0B0F19] transition-colors">Sign Up</Link>
        </div>
      </div>
    </footer>
  );
}

/* ── Landing Page (Composed) ────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0B0F19] selection:bg-[#6E8F75]/20 selection:text-[#0B0F19]">
      <Navbar />
      <HeroSection />
      <StandardSection />
      <CandidateAdvantageSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}
