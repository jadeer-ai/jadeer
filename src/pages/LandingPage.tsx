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
  Users,
  CheckCircle2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { TheTestStickyExperience } from '@/components/hero/TheTestStickyExperience';
import BrandLogo from '@/components/common/BrandLogo';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER LANDING PAGE — CLEAN, ULTRA-LIGHTWEIGHT & HIGH PERFORMANCE
   - Clean, minimal, soft porcelain canvas (#F0F2F4 / #F8FAFC)
   - Dynamic Scroll-Reactive Floating Capsule Navbar
   - Centered Editorial Typography & High-Contrast Dual CTAs
   - 3 Detached Floating Feature Cards Below Hero
   - 3-Stage Validation Architecture & Talent Advantage Modules
   - Zero heavy background graphics, zero canvas loops, zero heavy blur overlays
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Navigation Links ───────────────────────────────────────────────────── */
/* ── Navigation Links ───────────────────────────────────────────────────── */
const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Validation Pipeline', href: '#pipeline' },
  { label: 'Evidence Dossier', href: '#evidence' },
];

/* ── Dynamic Scroll-Reactive Capsule Navbar Component ────────────────────── */
function ScrollReactiveNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let lastScrolled = false;
    const onScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`
          z-50 transition-all duration-300 ease-out
          ${scrolled
            ? 'fixed top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] px-6 py-2.5 max-w-5xl w-[92%]'
            : 'fixed top-0 left-0 right-0 bg-transparent border-b border-transparent max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-5'
          }
        `}
      >
        <div className="flex items-center justify-between gap-6 sm:gap-8">
          {/* ── Official Brand Logo ── */}
          <BrandLogo size="md" href="/" textColor="dark" />

          {/* ── Center Nav Links: Charcoal Grey (#334155) hover to Deep Slate Navy (#0F172A) ── */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#334155] hover:text-[#0F172A] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── Right Actions: For Companies, Sign In & Primary Muted Sage Pill CTA ── */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            <Link
              to="/employer"
              id="nav-for-companies"
              className="text-sm font-medium text-[#334155] hover:text-[#0F172A] transition-colors"
            >
              For Companies
            </Link>

            <SignedOut>
              <Link
                to="/signin"
                id="nav-signin"
                className="text-sm font-medium text-[#334155] hover:text-[#0F172A] transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                id="nav-join-talent"
                className="inline-flex items-center gap-1.5 bg-[#5E8174] hover:bg-[#4D6D62] text-white text-sm font-medium rounded-full px-5 py-2 transition-all shadow-sm active:scale-95"
              >
                <span>Join as Talent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                to="/dashboard"
                id="nav-dashboard"
                className="text-sm font-medium text-[#0F172A] hover:text-[#5E8174] transition-colors"
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
            className="md:hidden p-1.5 rounded-full text-[#0F172A] hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile Dropdown Panel ── */}
      {mobileOpen && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/80 p-5 shadow-xl space-y-4 md:hidden">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm font-medium text-[#334155] hover:text-[#0F172A] rounded-xl hover:bg-slate-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200/80 flex flex-col gap-2.5">
            <Link
              to="/employer"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-sm font-medium text-[#0F172A] rounded-full bg-slate-100 hover:bg-slate-200"
            >
              For Companies
            </Link>

            <SignedOut>
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-[#0F172A] rounded-full bg-slate-100 hover:bg-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium text-white rounded-full bg-[#5E8174] hover:bg-[#4D6D62]"
              >
                Join as Talent →
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center justify-between py-2 px-3 rounded-2xl bg-slate-100">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-[#0F172A] hover:text-[#5E8174]"
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
   EXPLANATORY MISSION NARRATIVE (BELOW HERO)
   ═══════════════════════════════════════════════════════════════════════════ */

function ExplanatoryMissionSection() {
  return (
    <section className="pt-10 sm:pt-14 pb-8 relative bg-[#F8F9FA]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#5E8174] block mb-3">
            THE JADEER MISSION
          </span>
          <p className="text-lg sm:text-xl md:text-2xl font-normal text-[#0F172A] leading-relaxed sm:leading-relaxed">
            For juniors and emerging talent with potential but limited experience or proof, Jadeer is a talent validation and development platform that assesses capabilities, closes skill gaps, and puts talent to work on real industry projects — turning potential into credible, market-ready proof.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PREMIUM ASYMMETRICAL VALUE & BENEFIT COMPOSITION (BELOW HERO)
   ═══════════════════════════════════════════════════════════════════════════ */

function DetachedFeatureGridSection() {
  return (
    <section className="py-14 sm:py-20 relative bg-[#F8F9FA]">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section Eyebrow & Title ── */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="inline-block text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#5E8174] bg-[#5E8174]/10 px-3.5 py-1 rounded-full border border-[#5E8174]/20">
            CAPABILITY VALIDATION • DIRECT PROOF
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
            How Jadeer Turns Potential Into Proof
          </h2>
        </div>

        {/* ── Asymmetrical Grid: Dominant Left (~58%) + Stacked Right (~42%) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* ── DOMINANT LEFT CARD: Zero-Resume Guesswork (~58% Width) ── */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.04)] flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              {/* Compact Top Validation Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-bold border border-[#5E8174]/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8174]" />
                <span>100% Code-Verified Candidates</span>
              </div>

              {/* Title & Typography */}
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                Zero-Resume Guesswork
              </h3>

              {/* Clean Body Copy Width */}
              <p className="text-base text-[#334155] leading-relaxed max-w-xl">
                Every candidate dossier is backed by live AST execution logs, memory safety verification, and socket multiplexing benchmarks under 10k connections.
              </p>
            </div>

            {/* Structured Stats Area: 3 Aligned Mini Metrics */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  94%
                </div>
                <div className="text-xs font-semibold text-[#334155]">
                  Accuracy Calibration
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#5E8174] tracking-tight">
                  4.95<span className="text-sm text-[#334155] font-normal"> /5</span>
                </div>
                <div className="text-xs font-semibold text-[#334155]">
                  Candidate Rating
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#5E8174] tracking-tight">
                  &lt;48h
                </div>
                <div className="text-xs font-semibold text-[#334155]">
                  Fast-Track Placement
                </div>
              </div>
            </div>
          </div>

          {/* ── STACKED RIGHT COLUMN (~42% Width) ── */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">

            {/* ── UPPER-RIGHT: Real Industry Work Supporting Card ── */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#334155] text-xs font-semibold border border-slate-200">
                  <Layers className="w-3.5 h-3.5 text-[#5E8174]" />
                  <span>Applied Engineering</span>
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight leading-snug">
                  Real Industry Project Work
                </h4>

                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  Bridge the experience gap by shipping production-grade software on realistic industry systems, closing skill gaps through active implementation.
                </p>
              </div>

              {/* Small Technical Validation Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#334155]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5E8174] animate-pulse" />
                  <span>Production-Grade Delivery</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">Applied Proof</span>
              </div>
            </div>

            {/* ── LOWER-RIGHT: Fast-Track Your Journey CTA Panel ── */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight">
                  Fast-Track Your Journey
                </h4>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  Start your candidate certification or discover calibrated senior engineering talent immediately.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <Link
                  to="/signup"
                  className="w-full bg-[#5E8174] hover:bg-[#4D6D62] text-white py-3 px-5 rounded-full font-medium shadow-[0_4px_16px_rgba(94,129,116,0.25)] text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <span>Launch Candidate Assessment</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>

                <Link
                  to="/employer"
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#5E8174]/50 text-[#0F172A] py-2.5 px-5 rounded-full font-medium text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <span>Hire Verified Talent</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#334155]" />
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
   HOW JADEER VALIDATES TALENT (SINGLE DEFINITIVE PROCESS SECTION)
   ═══════════════════════════════════════════════════════════════════════════ */

function ValidationArchitectureSection() {
  const pillars = [
    {
      num: '01',
      title: 'Adaptive AI Technical Assessment',
      desc: 'Conversational voice and code evaluation tailored dynamically for your stage—evaluating memory safety, OOP polymorphism, and systems problem solving.',
      icon: BrainCircuit,
      badge: 'Cognitive Calibration',
      badgeStyle: 'bg-slate-100 text-[#334155] border-slate-200',
    },
    {
      num: '02',
      title: '1-to-1 Principal Technical Defense',
      desc: 'Candidates defend architectural decisions, space/time complexity, and cold-cache stampede strategies directly with Principal Engineers.',
      icon: Users,
      badge: 'Human Pod Defense',
      badgeStyle: 'bg-slate-100 text-[#334155] border-slate-200',
    },
    {
      num: '03',
      title: 'Verified Evidence Dossier',
      desc: 'Generate undeniable skill proof containing real code commits, telemetry breakdowns, and verified statements to unlock direct hiring.',
      icon: FileCheck2,
      badge: 'Direct Inbound',
      badgeStyle: 'bg-[#5E8174]/10 text-[#5E8174] border-[#5E8174]/20',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative bg-[#F1F5F9] border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#5E8174]">
            THE VALIDATION PIPELINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            How Jadeer Validates Talent
          </h2>
          <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
            A three-step technical verification pipeline certifying true engineering depth.
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
                  border border-slate-200/90
                  shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)]
                  flex flex-col justify-between space-y-6
                  hover:border-[#5E8174]/40 hover:-translate-y-0.5
                  hover:shadow-[0_12px_28px_-8px_rgba(94,129,116,0.08)]
                  transition-all duration-200 group
                "
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] border border-slate-200 text-[#334155] flex items-center justify-center font-extrabold group-hover:bg-[#5E8174] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-extrabold text-slate-300">
                      {pillar.num}
                    </span>
                  </div>

                  <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${pillar.badgeStyle}`}>
                    {pillar.badge}
                  </span>

                  <h3 className="text-xl font-bold text-[#0F172A] leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-[14px] text-[#334155] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <Link
                  to="/signup"
                  className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#334155] group-hover:text-[#5E8174] transition-colors"
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
   UNIFIED FINAL CTA SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function UnifiedFinalCtaSection() {
  return (
    <section id="evidence" className="py-24 sm:py-32 relative bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-200/90 shadow-[0_12px_40px_-10px_rgba(15,23,42,0.03)] text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Ready to validate your engineering capabilities?
            </h2>
            <p className="text-sm sm:text-base text-[#334155] max-w-xl mx-auto leading-relaxed">
              Create your unified talent account, take your adaptive AI assessment, and build verifiable proof of your technical depth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              id="final-join-talent-btn"
              className="
                w-full sm:w-auto px-8 py-4 rounded-full
                bg-[#5E8174] hover:bg-[#4D6D62] text-white text-sm font-medium
                hover:-translate-y-0.5
                hover:shadow-[0_12px_28px_rgba(94,129,116,0.25)]
                active:translate-y-0 active:scale-[0.98]
                transition-all duration-200 shadow-sm
              "
            >
              Join as Talent
            </Link>

            <Link
              to="/signin"
              className="
                w-full sm:w-auto px-8 py-4 rounded-full
                bg-white text-[#0F172A] text-sm font-medium
                border border-slate-300
                hover:bg-slate-50 hover:border-[#5E8174]/50 hover:-translate-y-0.5
                transition-all duration-200 shadow-2xs
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
    <footer className="py-12 border-t border-slate-200 text-xs text-[#334155] bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <BrandLogo size="sm" href="/" textColor="dark" />
        <p>© {new Date().getFullYear()} Jadeer Talent Validation Platform. All rights reserved.</p>
        <div className="flex items-center gap-6 font-semibold">
          <Link to="/signin" className="hover:text-[#0F172A] transition-colors">Sign In</Link>
          <Link to="/signup" className="hover:text-[#0F172A] transition-colors">Join as Talent</Link>
          <Link to="/employer" className="hover:text-[#5E8174] transition-colors">For Employers</Link>
          <Link to="/admin/signin" className="hover:text-[#5E8174] transition-colors flex items-center gap-1 text-[11px] text-[#334155]">
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LANDING PAGE — DIGITAL HAVEN ROOT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] selection:bg-[#5E8174]/20 selection:text-[#0F172A] relative">
      <ScrollReactiveNavbar />
      <TheTestStickyExperience />
      <ExplanatoryMissionSection />
      <DetachedFeatureGridSection />
      <ValidationArchitectureSection />
      <UnifiedFinalCtaSection />
      <Footer />
    </div>
  );
}
