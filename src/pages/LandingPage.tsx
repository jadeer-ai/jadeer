import { useState, useEffect, useCallback } from 'react';
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
  Video,
  Building2,
  Zap,
  Check,
} from 'lucide-react';
import { BrandLogo, NeuralGridCanvas } from '@/components/common';

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
              to="/employer"
              id="nav-for-companies"
              className="
                px-3.5 py-2 text-[14.5px] font-semibold text-white/80
                transition-colors duration-200 hover:text-white
                hover:bg-white/[0.06] rounded-xl
              "
            >
              For Companies
            </Link>

            <div className="h-4 w-px bg-white/20 mx-0.5" />

            <SignedOut>
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
            </SignedOut>

            <SignedIn>
              <Link
                to="/dashboard"
                id="nav-dashboard"
                className="
                  px-3.5 py-2 text-[14.5px] font-semibold text-white/85
                  transition-colors duration-200 hover:text-white
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
              id="mobile-nav-for-companies"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-3 text-sm font-bold text-white rounded-2xl bg-white/[0.06] hover:bg-white/10"
            >
              For Companies
            </Link>

            <SignedOut>
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
                className="w-full text-center py-3 text-sm font-bold text-white rounded-2xl bg-[#6E8F75] hover:bg-[#5d7d64]"
              >
                Join as Talent →
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center justify-between py-2.5 px-3 rounded-2xl bg-white/[0.06]">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-white hover:text-[#6E8F75]"
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
   1. CODE ASSEMBLER ENTRANCE ANIMATION & UNIFIED HERO SECTION
   - 0.0s - 0.8s: High-frequency alphanumeric Matrix rain / telemetry stream
   - 0.8s - 1.2s: Accelerating left-to-right snap-to-lock decryption
   - >= 1.2s: Assembly lock complete & element staggered fade-in triggered
   ═══════════════════════════════════════════════════════════════════════════ */

const TARGET_WORDS = [
  { text: 'Your', isGreen: false },
  { text: 'Mentality.', isGreen: false },
  { text: 'Our', isGreen: false },
  { text: 'Matrix.', isGreen: false },
  { text: 'Their', isGreen: true },
  { text: 'Peace', isGreen: true },
  { text: 'of', isGreen: true },
  { text: 'Mind.', isGreen: true },
];

const FULL_TARGET = TARGET_WORDS.map((w) => w.text).join(' ');
const GLYPH_CHARS = '01ABCDEFXYZ#$@%&*+-/<>[]{}~=!?|_0x4A0x7F';

function CodeAssemblerSlogan({ onAssembled }: { onAssembled: () => void }) {
  const totalLength = FULL_TARGET.length;
  const [lockedCount, setLockedCount] = useState<number>(0);
  const [randomGlitchStr, setRandomGlitchStr] = useState<string>(() =>
    Array.from({ length: totalLength }, () => GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)]).join('')
  );
  const [isFullyAssembled, setIsFullyAssembled] = useState(false);

  useEffect(() => {
    let animFrame: number;
    const startTime = performance.now();
    const SCRAMBLE_MS = 800; // 0.8s pure stream
    const TOTAL_MS = 1200;   // 1.2s full slogan assembly
    const ASSEMBLY_WINDOW = TOTAL_MS - SCRAMBLE_MS; // 400ms decrypt sweep

    const loop = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      if (elapsed < SCRAMBLE_MS) {
        // Phase 1: Pure rapid-fire Matrix stream
        setRandomGlitchStr(
          Array.from({ length: totalLength }, () => GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)]).join('')
        );
        setLockedCount(0);
        animFrame = requestAnimationFrame(loop);
      } else if (elapsed < TOTAL_MS) {
        // Phase 2: Decrypt left-to-right (accelerating ease curve)
        const progress = (elapsed - SCRAMBLE_MS) / ASSEMBLY_WINDOW;
        const eased = Math.min(1, Math.pow(progress, 1.25));
        const currentLocked = Math.floor(eased * totalLength);

        setLockedCount(currentLocked);
        setRandomGlitchStr(
          Array.from({ length: totalLength }, () => GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)]).join('')
        );
        animFrame = requestAnimationFrame(loop);
      } else {
        // Phase 3: Slogan fully assembled & locked
        setLockedCount(totalLength);
        setIsFullyAssembled(true);
        onAssembled();
      }
    };

    animFrame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animFrame);
  }, [totalLength, onAssembled]);

  // Compute character mapping per word to prevent awkward line breaks
  let globalCharIndex = 0;

  return (
    <h1
      className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[1.14] tracking-tight select-none text-[#0B0F19] min-h-[2.4em] sm:min-h-[2.3em] flex flex-wrap items-center justify-center"
      aria-label={FULL_TARGET}
    >
      {TARGET_WORDS.map((wordObj, wordIdx) => {
        const wordStartIndex = globalCharIndex;
        const wordChars = Array.from(wordObj.text);
        globalCharIndex += wordChars.length + 1; // +1 for trailing space

        const isGreenWord = wordObj.isGreen;

        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.26em] last:mr-0 relative">
            {wordChars.map((char, charIdx) => {
              const thisIndex = wordStartIndex + charIdx;
              const isLocked = thisIndex < lockedCount || isFullyAssembled;
              const displayChar = isLocked ? char : randomGlitchStr[thisIndex] || '0';

              let charColor = isGreenWord ? 'text-[#6E8F75]' : 'text-[#0B0F19]';
              if (!isLocked) {
                charColor = isGreenWord ? 'text-[#6E8F75]/70 font-mono' : 'text-[#0B0F19]/45 font-mono';
              }

              return (
                <span
                  key={charIdx}
                  className={`inline-block transition-colors duration-100 ${charColor} ${
                    isLocked && thisIndex === lockedCount - 1 && !isFullyAssembled
                      ? 'scale-110 drop-shadow-[0_0_10px_rgba(110,143,117,0.8)] text-emerald-400 font-bold'
                      : ''
                  }`}
                >
                  {displayChar}
                </span>
              );
            })}
            {/* Green underline under "Their Peace of Mind." once fully assembled */}
            {isGreenWord && isFullyAssembled && wordIdx === 4 && (
              <span className="absolute bottom-1 left-0 right-[-3.5em] sm:right-[-4em] h-[3px] bg-[#6E8F75]/30 rounded-full animate-[fade-in_0.4s_ease] pointer-events-none" />
            )}
          </span>
        );
      })}
    </h1>
  );
}

function UnifiedHeroSection() {
  const [isAssembled, setIsAssembled] = useState(false);

  const handleAssemblyComplete = useCallback(() => {
    setIsAssembled(true);
  }, []);

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
        <div className="mx-auto max-w-4xl text-center space-y-7 sm:space-y-8">

          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#0B0F19]/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-[fade-in_0.5s_ease]">
            <span className="w-2 h-2 rounded-full bg-[#6E8F75] animate-pulse" />
            <span className="text-xs font-extrabold text-[#0B0F19]/75 uppercase tracking-wider">
              Single Talent Portal • Engineering Certification
            </span>
          </div>

          {/* Code Assembler Slogan */}
          <CodeAssemblerSlogan onAssembled={handleAssemblyComplete} />

          {/* Sub-headline (Staggered Fade-in) */}
          <p
            className={`
              text-[16px] sm:text-[18.5px] text-[#0B0F19]/65
              leading-[1.7] max-w-2xl mx-auto font-normal
              transition-all duration-700 ease-out
              ${isAssembled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}
            style={{ transitionDelay: isAssembled ? '100ms' : '0ms' }}
          >
            Whether you are a university student seeking industry mentorship or a graduate targeting full-time engineering roles, Jadeer evaluates your code depth through adaptive AI assessments, mentor calibration, and live evidence dossiers.
          </p>

          {/* ── Directly beneath slogan: Two Primary CTAs (Staggered Fade-in) ── */}
          <div
            className={`
              flex flex-col sm:flex-row items-center justify-center gap-4 pt-2
              transition-all duration-700 ease-out
              ${isAssembled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}
            style={{ transitionDelay: isAssembled ? '250ms' : '0ms' }}
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

          {/* Centered Micro-Badges Bar (Staggered Fade-in) */}
          <div
            className={`
              pt-2 flex justify-center
              transition-all duration-700 ease-out
              ${isAssembled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}
            style={{ transitionDelay: isAssembled ? '400ms' : '0ms' }}
          >
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
   4. UNIFIED FINAL CTA SECTION
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#0B0F19] selection:bg-[#6E8F75]/20 selection:text-[#0B0F19] relative overflow-hidden">
      {/* Clean Minimalist Background Grid Canvas */}
      <NeuralGridCanvas />

      <div className="relative z-10">
        <Navbar />
        <UnifiedHeroSection />
        <ValidationArchitectureSection />
        <TalentAdvantageSection />
        <UnifiedFinalCtaSection />
        <Footer />
      </div>
    </div>
  );
}
