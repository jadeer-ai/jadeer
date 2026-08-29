import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/common';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Code2,
  BrainCircuit,
  Users,
  FolderGit2,
  Video,
  ChevronRight,
  TrendingUp,
  Clock,
  Menu,
  X,
  FileCheck2,
  Terminal,
  Activity,
  Check,
  Lock,
  Globe,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — DEDICATED PUBLIC EMPLOYER LANDING PAGE
   Signature Brand Identity: Clean Cream (#FAF9F6), Sage Green (#6E8F75),
   and Deep Navy (#0B0F19)
   ═══════════════════════════════════════════════════════════════════════════ */

export default function EmployerLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0B0F19] relative overflow-hidden selection:bg-[#6E8F75]/20 selection:text-[#0B0F19]">

      {/* ── 1. Navbar ─────────────────────────────────────────────────── */}
      <nav
        id="employer-navbar"
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          bg-[#0B0F19] text-white border-b border-white/[0.08]
          ${scrolled ? 'shadow-[0_12px_32px_rgba(0,0,0,0.35)]' : ''}
        `}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="flex h-[76px] items-center justify-between">
            <BrandLogo size="md" href="/" textColor="light" />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 text-[14px] font-medium text-white/80">
              <a href="#validation-engine" className="hover:text-white transition-colors">
                Validation Engine
              </a>
              <a href="#evidence-dossier" className="hover:text-white transition-colors">
                Evidence Dossier
              </a>
              <a href="#roi-metrics" className="hover:text-white transition-colors">
                Hiring ROI
              </a>
              <Link to="/employer/post-job" className="hover:text-white transition-colors">
                Post a Role
              </Link>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/employer/signin"
                className="px-4 py-2 text-[14px] font-semibold text-white/85 hover:text-white transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/employer/signup"
                className="
                  inline-flex items-center gap-2 px-5 py-2.5
                  bg-[#6E8F75] text-white text-[14px] font-bold
                  rounded-full transition-all duration-300
                  hover:bg-[#5d7d64] hover:-translate-y-0.5
                  hover:shadow-[0_8px_20px_rgba(110,143,117,0.35)]
                  active:translate-y-0 active:scale-[0.98] shadow-sm
                "
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0B0F19] border-t border-white/[0.08] px-6 py-6 space-y-4">
            <a
              href="#validation-engine"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-white/80 py-2"
            >
              Validation Engine
            </a>
            <a
              href="#evidence-dossier"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-white/80 py-2"
            >
              Evidence Dossier
            </a>
            <a
              href="#roi-metrics"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-white/80 py-2"
            >
              Hiring ROI
            </a>
            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
              <Link
                to="/employer/signin"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 text-sm font-semibold text-white bg-white/10 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/employer/signup"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 text-sm font-bold text-white bg-[#6E8F75] rounded-xl shadow-sm"
              >
                Get Started as Employer
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── 2. Hero Section ───────────────────────────────────────────── */}
      <section className="relative pt-36 sm:pt-48 pb-24 sm:pb-32 lg:pb-36 overflow-hidden">
        {/* Subtle Background Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(11, 15, 25, 0.035) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(11, 15, 25, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 80%)',
          }}
        />

        {/* Diffused Sage Glow */}
        <div
          className="absolute top-24 left-1/2 -translate-x-1/2 w-[850px] h-[520px] rounded-full pointer-events-none blur-3xl opacity-35"
          style={{
            background: 'radial-gradient(circle at center, rgba(110,143,117,0.28) 0%, rgba(11,15,25,0.04) 50%, transparent 75%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-7 lg:space-y-8 text-center lg:text-left flex flex-col justify-center">
              {/* Eyebrow badge */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6E8F75]/10 border border-[#6E8F75]/25 text-[#6E8F75] text-xs font-extrabold uppercase tracking-wider shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-[#6E8F75]" />
                  <span>Jadeer for Employers • Talent Validation Platform</span>
                </div>
              </div>

              {/* Main Hook */}
              <h1 className="text-[clamp(2.5rem,5.2vw,4.25rem)] font-extrabold text-[#0B0F19] leading-[1.16] sm:leading-[1.18] tracking-tight">
                Hire Verified Engineering Talent with{' '}
                <span className="relative inline-block text-[#6E8F75]">
                  Evidence-Backed
                  <span className="absolute bottom-1.5 left-0 right-0 h-[3.5px] bg-[#6E8F75]/35 rounded-full" />
                </span>{' '}
                Proof.
              </h1>

              {/* Subtitle */}
              <p className="text-[16px] sm:text-[18px] text-[#0B0F19]/65 leading-[1.7] sm:leading-[1.75] max-w-2xl mx-auto lg:mx-0 font-normal">
                Eliminate unverified resumes and candidate noise. Jadeer evaluates software engineers through adaptive AI assessments, mentor calibration, and production pod sprints—so you hire proven performers with 100% confidence.
              </p>

              {/* CTAs with Enhanced Contrast */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/employer/signup"
                  className="
                    w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4
                    bg-[#0B0F19] text-white text-[15px] font-extrabold rounded-2xl
                    shadow-[0_12px_28px_rgba(11,15,25,0.22)]
                    hover:bg-[#1A2433] hover:shadow-[0_16px_36px_rgba(11,15,25,0.3)]
                    hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                    transition-all duration-200 group cursor-pointer
                  "
                >
                  <Building2 className="w-5 h-5 text-[#6E8F75]" />
                  <span>Start Hiring Talent</span>
                  <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/employer/signin"
                  className="
                    w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4
                    bg-white border-2 border-[#0B0F19]/[0.12] text-[#0B0F19]
                    text-[15px] font-bold rounded-2xl
                    hover:bg-[#FAF9F6] hover:border-[#0B0F19]/30 hover:text-[#0B0F19]
                    shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200 cursor-pointer
                  "
                >
                  Sign In to Portal
                </Link>
              </div>

              {/* Streamlined Micro-Badges Feature Bar */}
              <div className="pt-2">
                <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center lg:justify-start gap-3 sm:gap-4.5 px-5 py-3 rounded-2xl bg-white/90 border border-[#0B0F19]/[0.07] shadow-xs backdrop-blur-xs text-xs font-semibold text-[#0B0F19]/70">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#6E8F75] shrink-0" />
                    <span>Pre-Calibrated Code Radar</span>
                  </span>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-[#0B0F19]/25 shrink-0" />
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#6E8F75] shrink-0" />
                    <span>1-Click Sync Scheduling</span>
                  </span>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-[#0B0F19]/25 shrink-0" />
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#6E8F75] shrink-0" />
                    <span className="font-bold text-[#0B0F19]">85%+ Capability Gate</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Interactive Candidate Evidence Preview (5 cols) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end items-center animate-[fade-in_0.5s_ease]">
              <div className="w-full max-w-md lg:max-w-none bg-white rounded-3xl p-6 sm:p-7.5 border border-[#0B0F19]/[0.08] shadow-[0_24px_64px_-16px_rgba(11,15,25,0.12)] space-y-6 relative overflow-hidden">
                {/* Top Subtle Brand Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6E8F75] via-[#82a78a] to-[#6E8F75]" />

                {/* Header Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-[#0B0F19]/[0.05]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6E8F75] animate-pulse" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B0F19]/70">
                      Live Candidate Evidence Dossier
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-0.5 rounded-full">
                    96% Match
                  </span>
                </div>

                {/* Candidate Info */}
                <div className="flex items-start gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-[#6E8F75] text-white flex items-center justify-center text-base font-extrabold shadow-md shadow-[#6E8F75]/30">
                    AH
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-[#0B0F19]">Ahmed Hassan</h3>
                      <ShieldCheck className="w-4 h-4 text-[#6E8F75]" />
                    </div>
                    <p className="text-xs text-[#0B0F19]/55 font-medium mt-0.5">
                      Junior Backend & Systems Track • Riyadh
                    </p>
                    <p className="text-[11px] text-[#6E8F75] font-bold mt-1">
                      Verified Candidate ID: JAD-8492
                    </p>
                  </div>
                </div>

                {/* Validation Milestones Completed */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/40">
                    Verified Competencies & Telemetry
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] text-xs">
                      <span className="font-semibold text-[#0B0F19]/70 flex items-center gap-1.5">
                        <BrainCircuit className="w-3.5 h-3.5 text-[#6E8F75]" />
                        Adaptive AI Interview (OOP & Memory)
                      </span>
                      <span className="font-extrabold text-[#6E8F75]">95/100</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] text-xs">
                      <span className="font-semibold text-[#0B0F19]/70 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#6E8F75]" />
                        Mentor Calibration (System Design)
                      </span>
                      <span className="font-bold text-success-600">Passed</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] text-xs">
                      <span className="font-semibold text-[#0B0F19]/70 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-[#6E8F75]" />
                        Production Pod PRs & Telemetry
                      </span>
                      <span className="font-bold text-[#0B0F19]/80">42 Commits</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Mock */}
                <div className="pt-2 border-t border-[#0B0F19]/[0.05] flex items-center justify-between gap-3">
                  <div className="text-[11px] text-[#0B0F19]/45 font-medium">
                    Ready for immediate interview
                  </div>
                  <Link
                    to="/employer/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] transition-colors shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Schedule Interview</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. The 4-Stage Validation Engine ─────────────────────────── */}
      <section id="validation-engine" className="py-20 sm:py-28 bg-white border-y border-[#0B0F19]/[0.05]">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#6E8F75] bg-[#6E8F75]/10 px-3.5 py-1 rounded-full border border-[#6E8F75]/20">
              The Jadeer Validation Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
              How We Turn Candidate Potential into Verified Evidence
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#0B0F19]/55 leading-relaxed">
              Every candidate on the Jadeer platform passes through a strict 4-phase verification process before they can be matched with your engineering openings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Adaptive AI Assessment',
                desc: 'Deep conversational evaluation probing C++, memory layout, vtables, and RAII guarantees with real-time audio & text.',
                icon: BrainCircuit,
              },
              {
                step: '02',
                title: 'Senior Mentor Calibration',
                desc: '1-to-1 human calibration with industry veterans validating problem decomposition, architectural trade-offs, and communication.',
                icon: Users,
              },
              {
                step: '03',
                title: 'Production Pod Execution',
                desc: 'Hands-on project development in simulated industry pods with code reviews, branch telemetry, and microsecond latency requirements.',
                icon: FolderGit2,
              },
              {
                step: '04',
                title: 'Tamper-Proof Dossier',
                desc: 'Direct access to verified code replay, git commit histories, and benchmarked competence scores ready for immediate interview.',
                icon: FileCheck2,
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.step}
                  className="bg-[#FAF9F6] rounded-3xl p-7 border border-[#0B0F19]/[0.05] hover:border-[#6E8F75]/40 hover:shadow-[0_12px_32px_rgba(110,143,117,0.12)] transition-all duration-300 space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#0B0F19]/[0.06] text-[#6E8F75] flex items-center justify-center group-hover:bg-[#6E8F75] group-hover:text-white transition-colors duration-300 shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-[#0B0F19]/15 group-hover:text-[#6E8F75]/30 transition-colors">
                      {pillar.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0B0F19] group-hover:text-[#6E8F75] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#0B0F19]/55 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Hiring ROI & Key Metrics ───────────────────────────────── */}
      <section id="roi-metrics" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="bg-[#0B0F19] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#6E8F75]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#6E8F75] bg-white/[0.08] px-3.5 py-1 rounded-full border border-white/[0.1]">
                  Measurable Impact
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Cut Engineering Hiring Overhead by over 80%.
                </h2>
                <p className="text-[15px] text-white/60 leading-relaxed font-normal">
                  Stop wasting your engineering leadership’s billable hours on initial screening calls. Review pre-calibrated skill profiles and hire with conviction.
                </p>
                <div className="pt-2">
                  <Link
                    to="/employer/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#6E8F75] text-white text-sm font-bold rounded-xl hover:bg-[#5d7d64] transition-colors shadow-lg"
                  >
                    <span>Register Your Company</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 text-center space-y-2">
                  <p className="text-3xl sm:text-4xl font-black text-[#6E8F75]">85%</p>
                  <p className="text-xs font-semibold text-white/70">Reduction in Time-to-Hire</p>
                </div>
                <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 text-center space-y-2">
                  <p className="text-3xl sm:text-4xl font-black text-white">94%</p>
                  <p className="text-xs font-semibold text-white/70">First-Year Retention Rate</p>
                </div>
                <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 text-center space-y-2">
                  <p className="text-3xl sm:text-4xl font-black text-[#6E8F75]">100%</p>
                  <p className="text-xs font-semibold text-white/70">Code-Verified Proof</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Bottom CTA ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white border-t border-[#0B0F19]/[0.05] text-center">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
            Ready to Build Your High-Velocity Team?
          </h2>
          <p className="text-[16px] text-[#0B0F19]/55 leading-relaxed font-normal">
            Create your employer account today, configure your job requirements, and get immediate access to validated Saudi software talent.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/employer/signup"
              className="
                w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4
                bg-[#6E8F75] text-white text-[15px] font-bold rounded-2xl
                shadow-[0_8px_24px_rgba(110,143,117,0.3)]
                hover:bg-[#5d7d64] hover:shadow-[0_12px_32px_rgba(110,143,117,0.4)]
                hover:-translate-y-0.5 transition-all duration-200
              "
            >
              <Building2 className="w-5 h-5" />
              <span>Register as Employer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/employer/dashboard"
              className="
                w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4
                bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-[#0B0F19]/80
                text-[15px] font-bold rounded-2xl hover:bg-white transition-all
              "
            >
              Explore Employer Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-[#0B0F19]/[0.05] bg-[#FAF9F6] py-10">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#0B0F19]/45">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" href="/" />
            <span>• Verified Talent Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-[#0B0F19] transition-colors">Home</Link>
            <Link to="/employer/signin" className="hover:text-[#0B0F19] transition-colors">Employer Sign In</Link>
            <Link to="/employer/signup" className="hover:text-[#6E8F75] font-bold transition-colors">Employer Registration</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
