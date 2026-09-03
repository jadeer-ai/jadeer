import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  FileText,
  GitBranch,
  FolderGit2,
  Terminal,
  BrainCircuit,
  Award,
} from 'lucide-react';

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * JADEER PERSISTENT STICKY VALIDATION STAGE — "THE TEST"
 * "Where Potential Becomes Proof"
 *
 * Story Arc:
 * 1. Scattered Potential (P = 0.00 – 0.25):
 *    A candidate's real potential is scattered across 6 distinct places:
 *    • CV / Resume (Experience & Education)
 *    • GitHub / Repositories (Commits & Contributions)
 *    • Projects / Portfolio (Projects Shipped)
 *    • Code / Engineering Evidence (Code Quality & Architecture)
 *    • Technical Assessment (Assessment Score)
 *    • Interview / Human Validation (Principal Interview Verified)
 *
 * 2. Subtle Suspended Idle Motion (P = 0.00 – 0.25):
 *    Gentle 6–12px vertical/diagonal drift with slightly varied slow durations
 *    so cards never move in sync and feel suspended in space.
 *
 * 3. Unified Inward Convergence to Center Target (P = 0.25 – 0.72):
 *    All 6 cards travel into the exact same central validation circle,
 *    overlapping, compressing, and distilling separate signals into one core.
 *
 * 4. Distillation & Confirmation Pulse (P = 0.70 – 0.80):
 *    Evidence completely dissolves into the center circle with a Warm Terracotta pulse.
 *
 * 5. Official Jadeer Logo Reveal (P = 0.76 – 0.90):
 *    The official Jadeer logo emerges cleanly from the exact same center point (scale 0.85 -> 1.0).
 *
 * 6. Proof State & Prominent Slogan (P = 0.88 – 1.00):
 *    “Where Potential Becomes Proof.” + Verified Merit Badge.
 * ═════════════════════════════════════════════════════════════════════════════
 */

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function TheTestStickyExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Hero centered content ref
  const heroContentRef = useRef<HTMLDivElement | null>(null);

  // Central Validation Circle Chamber
  const validationCircleRef = useRef<HTMLDivElement | null>(null);
  const pulseRingRef = useRef<HTMLDivElement | null>(null);
  const pulseAuraRef = useRef<HTMLDivElement | null>(null);

  // The 6 Primary Evidence Cards (Outer scroll containers)
  const cardCvRef = useRef<HTMLDivElement | null>(null);
  const cardGithubRef = useRef<HTMLDivElement | null>(null);
  const cardPortfolioRef = useRef<HTMLDivElement | null>(null);
  const cardCodeRef = useRef<HTMLDivElement | null>(null);
  const cardAssessmentRef = useRef<HTMLDivElement | null>(null);
  const cardInterviewRef = useRef<HTMLDivElement | null>(null);

  // Real Jadeer Logo & Proof Celebration Banner
  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  const celebrationBannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport) return;

    let rafId: number | null = null;
    let isVisible = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Compute exact trajectory vectors from each card's fixed starting position to viewport center (0, 0)
    const getCardVectors = () => {
      const vRect = viewport.getBoundingClientRect();
      const centerX = vRect.width / 2;
      const centerY = vRect.height / 2;

      const getVector = (el: HTMLElement | null) => {
        if (!el) return { dx: 0, dy: 0 };
        const prevTransform = el.style.transform;
        el.style.transform = 'none';
        const rect = el.getBoundingClientRect();
        el.style.transform = prevTransform;

        const elCenterX = rect.left + rect.width / 2 - vRect.left;
        const elCenterY = rect.top + rect.height / 2 - vRect.top;

        return {
          dx: centerX - elCenterX,
          dy: centerY - elCenterY,
        };
      };

      return {
        v1: getVector(cardCvRef.current),
        v2: getVector(cardGithubRef.current),
        v3: getVector(cardPortfolioRef.current),
        v4: getVector(cardCodeRef.current),
        v5: getVector(cardAssessmentRef.current),
        v6: getVector(cardInterviewRef.current),
      };
    };

    let vectors = getCardVectors();

    const handleResize = () => {
      vectors = getCardVectors();
      updateSequence();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const updateSequence = () => {
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;
      const totalScrollable = rect.height - windowHeight;

      const rawP = totalScrollable > 0 ? -rect.top / totalScrollable : 0;
      const P = prefersReducedMotion ? 1 : clamp(rawP, 0, 1);

      // ───────────────────────────────────────────────────────────────────────
      // 1. HERO CONTENT RECESSION (P = 0.0 -> 0.32)
      // ───────────────────────────────────────────────────────────────────────
      if (heroContentRef.current) {
        if (prefersReducedMotion) {
          heroContentRef.current.style.opacity = '1';
          heroContentRef.current.style.transform = 'translate3d(0, 0, 0)';
          heroContentRef.current.style.pointerEvents = 'auto';
        } else {
          // Text remains 100% visible until P = 0.12, then gently fades
          const textFadeP = clamp((P - 0.10) / 0.20, 0, 1);
          const textOpacity = 1 - easeInOutCubic(textFadeP);
          const textTranslateY = -35 * easeInOutCubic(textFadeP);

          heroContentRef.current.style.opacity = textOpacity.toFixed(3);
          heroContentRef.current.style.transform = `translate3d(0, ${textTranslateY.toFixed(1)}px, 0)`;
          heroContentRef.current.style.pointerEvents = textOpacity > 0.2 ? 'auto' : 'none';
        }
      }

      // ───────────────────────────────────────────────────────────────────────
      // 2. CENTRAL VALIDATION CIRCLE CHAMBER (Awakens P = 0.20 -> 0.82)
      // ───────────────────────────────────────────────────────────────────────
      if (validationCircleRef.current && pulseRingRef.current && pulseAuraRef.current) {
        const circleInP = clamp((P - 0.20) / 0.16, 0, 1);
        const circleOutP = clamp((P - 0.78) / 0.10, 0, 1);

        const circleScale = lerp(0.75, 1.0, easeInOutCubic(circleInP)) * (1 - 0.2 * easeInOutCubic(circleOutP));
        const circleOpacity = easeInOutCubic(circleInP) * (1 - easeInOutCubic(circleOutP));

        validationCircleRef.current.style.transform = `translate3d(0, 0, 0) scale(${circleScale.toFixed(3)})`;
        validationCircleRef.current.style.opacity = circleOpacity.toFixed(3);

        // Confirmation pulse during peak convergence (P = 0.70 -> 0.80)
        const pulseP = Math.sin(clamp((P - 0.70) / 0.10, 0, 1) * Math.PI);
        pulseRingRef.current.style.transform = `scale(${(1 + pulseP * 0.45).toFixed(3)})`;
        pulseRingRef.current.style.borderColor = pulseP > 0.3 ? 'rgba(196, 132, 108, 0.85)' : 'rgba(83, 120, 155, 0.4)';
        pulseAuraRef.current.style.opacity = (pulseP * 0.9).toFixed(3);
      }

      // ───────────────────────────────────────────────────────────────────────
      // 3. THE 6 PRIMARY EVIDENCE CARDS: FIXED STARTING POSITIONS -> INWARD CONVERGENCE
      // (NO convergence before P = 0.25; convergence occurs between P = 0.25 and P = 0.72)
      // All cards travel into the exact same center target (vectors.vN.dx, vectors.vN.dy)
      // ───────────────────────────────────────────────────────────────────────

      // ── CARD 1: CV / Resume (Upper-Left Flank) ──
      if (cardCvRef.current) {
        const baseRot = -3;
        if (P <= 0.25) {
          cardCvRef.current.style.transform = `translate3d(0, 0, 0) rotate(${baseRot}deg) scale(1)`;
          cardCvRef.current.style.opacity = '0.96';
        } else {
          const t = easeInOutCubic(clamp((P - 0.25) / 0.38, 0, 1));
          const x = lerp(0, vectors.v1.dx, t);
          const y = lerp(0, vectors.v1.dy, t);
          const rot = lerp(baseRot, 8, t);
          const s = lerp(1.0, 0.38, t);
          const op = 0.96 * (1 - easeInOutCubic(clamp((P - 0.48) / 0.16, 0, 1)));
          cardCvRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${s.toFixed(3)})`;
          cardCvRef.current.style.opacity = op.toFixed(3);
        }
      }

      // ── CARD 2: GitHub / Repositories (Upper-Right Flank) ──
      if (cardGithubRef.current) {
        const baseRot = 3;
        if (P <= 0.25) {
          cardGithubRef.current.style.transform = `translate3d(0, 0, 0) rotate(${baseRot}deg) scale(1)`;
          cardGithubRef.current.style.opacity = '0.96';
        } else {
          const t = easeInOutCubic(clamp((P - 0.27) / 0.38, 0, 1));
          const x = lerp(0, vectors.v2.dx, t);
          const y = lerp(0, vectors.v2.dy, t);
          const rot = lerp(baseRot, -8, t);
          const s = lerp(1.0, 0.38, t);
          const op = 0.96 * (1 - easeInOutCubic(clamp((P - 0.50) / 0.16, 0, 1)));
          cardGithubRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${s.toFixed(3)})`;
          cardGithubRef.current.style.opacity = op.toFixed(3);
        }
      }

      // ── CARD 3: Projects / Portfolio (Mid-Left Flank) ──
      if (cardPortfolioRef.current) {
        const baseRot = -2.5;
        if (P <= 0.25) {
          cardPortfolioRef.current.style.transform = `translate3d(0, 0, 0) rotate(${baseRot}deg) scale(0.92)`;
          cardPortfolioRef.current.style.opacity = '0.92';
        } else {
          const t = easeInOutCubic(clamp((P - 0.30) / 0.38, 0, 1));
          const x = lerp(0, vectors.v3.dx, t);
          const y = lerp(0, vectors.v3.dy, t);
          const rot = lerp(baseRot, 6, t);
          const s = lerp(0.92, 0.36, t);
          const op = 0.92 * (1 - easeInOutCubic(clamp((P - 0.54) / 0.16, 0, 1)));
          cardPortfolioRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${s.toFixed(3)})`;
          cardPortfolioRef.current.style.opacity = op.toFixed(3);
        }
      }

      // ── CARD 4: Code / Engineering Evidence (Mid-Right Flank) ──
      if (cardCodeRef.current) {
        const baseRot = 2.5;
        if (P <= 0.25) {
          cardCodeRef.current.style.transform = `translate3d(0, 0, 0) rotate(${baseRot}deg) scale(0.92)`;
          cardCodeRef.current.style.opacity = '0.92';
        } else {
          const t = easeInOutCubic(clamp((P - 0.32) / 0.38, 0, 1));
          const x = lerp(0, vectors.v4.dx, t);
          const y = lerp(0, vectors.v4.dy, t);
          const rot = lerp(baseRot, -6, t);
          const s = lerp(0.92, 0.36, t);
          const op = 0.92 * (1 - easeInOutCubic(clamp((P - 0.56) / 0.16, 0, 1)));
          cardCodeRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${s.toFixed(3)})`;
          cardCodeRef.current.style.opacity = op.toFixed(3);
        }
      }

      // ── CARD 5: Technical Assessment (Lower-Left Flank) ──
      if (cardAssessmentRef.current) {
        const baseRot = 2.5;
        if (P <= 0.25) {
          cardAssessmentRef.current.style.transform = `translate3d(0, 0, 0) rotate(${baseRot}deg) scale(0.92)`;
          cardAssessmentRef.current.style.opacity = '0.92';
        } else {
          const t = easeInOutCubic(clamp((P - 0.35) / 0.38, 0, 1));
          const x = lerp(0, vectors.v5.dx, t);
          const y = lerp(0, vectors.v5.dy, t);
          const rot = lerp(baseRot, -5, t);
          const s = lerp(0.92, 0.36, t);
          const op = 0.92 * (1 - easeInOutCubic(clamp((P - 0.58) / 0.16, 0, 1)));
          cardAssessmentRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${s.toFixed(3)})`;
          cardAssessmentRef.current.style.opacity = op.toFixed(3);
        }
      }

      // ── CARD 6: Interview / Human Validation (Lower-Right Flank) ──
      if (cardInterviewRef.current) {
        const baseRot = -2.5;
        if (P <= 0.25) {
          cardInterviewRef.current.style.transform = `translate3d(0, 0, 0) rotate(${baseRot}deg) scale(0.92)`;
          cardInterviewRef.current.style.opacity = '0.92';
        } else {
          const t = easeInOutCubic(clamp((P - 0.37) / 0.38, 0, 1));
          const x = lerp(0, vectors.v6.dx, t);
          const y = lerp(0, vectors.v6.dy, t);
          const rot = lerp(baseRot, 5, t);
          const s = lerp(0.92, 0.36, t);
          const op = 0.92 * (1 - easeInOutCubic(clamp((P - 0.60) / 0.16, 0, 1)));
          cardInterviewRef.current.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${s.toFixed(3)})`;
          cardInterviewRef.current.style.opacity = op.toFixed(3);
        }
      }

      // ───────────────────────────────────────────────────────────────────────
      // 4. REAL OFFICIAL JADEER LOGO REVELATION (P = 0.76 -> 0.90)
      // ───────────────────────────────────────────────────────────────────────
      if (logoWrapperRef.current) {
        const logoInP = clamp((P - 0.76) / 0.14, 0, 1);
        const logoEase = easeInOutCubic(logoInP);
        // Clean scale from 0.88 to 1.0, opacity from 0 to 1
        const logoScale = lerp(0.88, 1.0, logoEase);
        const logoOpacity = logoEase;

        logoWrapperRef.current.style.transform = `translate3d(0, -18px, 0) scale(${logoScale.toFixed(3)})`;
        logoWrapperRef.current.style.opacity = logoOpacity.toFixed(3);
      }

      // ───────────────────────────────────────────────────────────────────────
      // 5. POST-VALIDATION VISUAL PAYOFF (P = 0.86 -> 1.0)
      // ───────────────────────────────────────────────────────────────────────
      if (celebrationBannerRef.current) {
        const bannerP = clamp((P - 0.86) / 0.12, 0, 1);
        const bannerOpacity = easeInOutCubic(bannerP);
        celebrationBannerRef.current.style.opacity = bannerOpacity.toFixed(3);
        celebrationBannerRef.current.style.transform = `translate3d(0, ${(14 * (1 - bannerOpacity)).toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!isVisible) return;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateSequence();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) updateSequence();
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    updateSequence();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320vh] bg-[#F8F9FA]"
    >
      {/* ── PERSISTENT 100VH STICKY VIEWPORT STAGE ── */}
      <div
        ref={viewportRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
      >

        {/* ═══════════════════════════════════════════════════════════════════
           ATMOSPHERIC BACKGROUND: SOFT OVERSIZED VALIDATION HALO (SUBTLE ATMOSPHERE)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] sm:w-[880px] lg:w-[1040px] aspect-square pointer-events-none opacity-10">
          <div className="w-full h-full rounded-full border border-dashed border-[#5E8174]/15 flex items-center justify-center animate-[spin_160s_linear_infinite]">
            <div className="w-[78%] h-[78%] rounded-full border border-slate-200/50 flex items-center justify-center">
              <div className="w-[62%] h-[62%] rounded-full border border-[#84A98C]/20 bg-radial from-white/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
           CENTRAL VALIDATION CIRCLE CHAMBER (Where all 6 evidence cards converge)
           ═══════════════════════════════════════════════════════════════════ */}
        <div
          ref={validationCircleRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 will-change-transform opacity-0"
        >
          <div className="relative flex items-center justify-center w-[160px] sm:w-[180px] aspect-square">
            {/* Ambient Confirmation Aura (Semantic Muted Sage) */}
            <div
              ref={pulseAuraRef}
              className="absolute inset-0 rounded-full bg-[#5E8174]/25 blur-xl transition-opacity duration-300 opacity-0"
            />

            {/* Validation Circle Frame */}
            <div
              ref={pulseRingRef}
              className="w-full h-full rounded-full border-2 border-[#5E8174]/40 bg-white/70 backdrop-blur-xs flex items-center justify-center shadow-lg transition-all duration-300"
            >
              <div className="w-[72%] h-[72%] rounded-full border border-dashed border-[#5E8174]/30 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5E8174] animate-pulse" />
              </div>
            </div>

            {/* Stage Indicator Pill */}
            <div className="absolute -bottom-8 px-3.5 py-1 rounded-full bg-white/95 border border-slate-200/90 text-[9.5px] font-extrabold uppercase tracking-widest text-[#5E8174] shadow-2xs">
              VALIDATION MATRIX
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
           LAYER 1: CENTERED HERO CONTENT (Protected by strict Safe Zone)
           ═══════════════════════════════════════════════════════════════════ */}
        <div
          ref={heroContentRef}
          className="relative mx-auto max-w-3xl px-6 sm:px-8 text-center space-y-8 sm:space-y-10 z-20 will-change-transform transition-opacity duration-200 pointer-events-auto"
        >
          {/* Pre-headline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-slate-200/90 shadow-2xs backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#5E8174] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-extrabold text-[#334155] uppercase tracking-widest">
              TECHNICAL VALIDATION MATRIX • MERIT-BASED CERTIFICATION
            </span>
          </div>

          {/* ── Centered Main Slogan ── */}
          <div className="space-y-1 sm:space-y-2">
            <h1 className="leading-[1.12] tracking-tight select-none text-center">
              <span className="text-[#0F172A] font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight">
                Where Potential{' '}
              </span>
              <span className="text-[#5E8174] font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight">
                Becomes Proof.
              </span>
            </h1>
          </div>

          {/* ── Supporting Sentence directly beneath headline ── */}
          <p className="text-[#334155] max-w-2xl mx-auto text-base sm:text-lg md:text-[19px] leading-relaxed mt-4 font-normal">
            Turn early-career potential into market-ready proof through capability assessment, targeted development, and real industry work.
          </p>

          {/* ── Centered Dual Action Buttons ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/signup"
              id="hero-join-talent-btn"
              className="w-full sm:w-auto bg-[#5E8174] hover:bg-[#4D6D62] text-white font-medium rounded-full px-8 py-3.5 shadow-[0_8px_20px_rgba(94,129,116,0.25)] hover:shadow-[0_12px_28px_rgba(94,129,116,0.35)] transition-all inline-flex items-center justify-center gap-2 active:scale-95 text-[15px]"
            >
              <span>Launch Assessment</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            <Link
              to="/signin"
              id="hero-signin-btn"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-300 hover:border-[#5E8174]/50 font-medium rounded-full px-7 py-3.5 shadow-2xs transition-all inline-flex items-center justify-center active:scale-95 text-[15px]"
            >
              <span>Access Candidate Portal</span>
            </Link>
          </div>

          {/* ── Centered Trust & Value Indicators (Sage for verified, Slate for collaboration) ── */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[#334155] text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5E8174]" />
              <span>Zero-Resume Guesswork</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#334155]" />
              <span>Real-Time Collaboration</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
           LAYER 2: THE 6 PRIMARY EVIDENCE SOURCES (EXPLICIT LABELS + SUBTLE DRIFT)
           Anchored in peripheral orbits; each with its own organic floating motion
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 pointer-events-none select-none z-15">

          {/* ── CARD 1: CV / RESUME (Upper-Left Flank — Prominent) ── */}
          <div
            ref={cardCvRef}
            className="absolute will-change-transform"
            style={{
              top: '8%',
              left: 'max(3%, calc(50% - 590px))',
            }}
          >
            <div className="animate-card-drift-1">
              <div className="w-[195px] sm:w-[210px] bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-[0_12px_24px_-4px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-[#334155] flex items-center justify-center">
                      <FileText className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#0F172A]">CV / Resume</div>
                      <div className="text-[7.5px] text-[#334155]">Experience & Education</div>
                    </div>
                  </div>
                  <span className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#334155]">
                    Source
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[8px] font-semibold text-[#0F172A]">Alex Chen • B.S. CS 3.9 GPA</div>
                  <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="w-4/5 h-full bg-slate-300 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-[7px] text-[#334155] pt-0.5">
                    <span>Honors Thesis & Lab</span>
                    <span className="text-[#334155] font-semibold">Self-Reported</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD 2: GITHUB / REPOSITORIES (Upper-Right Flank — Prominent) ── */}
          <div
            ref={cardGithubRef}
            className="absolute will-change-transform"
            style={{
              top: '9%',
              right: 'max(3%, calc(50% - 590px))',
            }}
          >
            <div className="animate-card-drift-2">
              <div className="w-[200px] sm:w-[220px] bg-[#0F172A] text-white rounded-2xl p-3.5 border border-slate-700/70 shadow-[0_14px_28px_-4px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-700/60">
                  <div className="flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-[#84A98C]" />
                    <div>
                      <div className="text-[9.5px] font-bold text-slate-100">GitHub / Repositories</div>
                      <div className="text-[7px] text-slate-400 font-mono">Commits • Contributions</div>
                    </div>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5E8174] animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[7.5px] text-slate-400 font-mono">
                    <span className="text-slate-200 font-medium">async-raft-core</span>
                    <span className="text-[#84A98C] font-semibold">99.4% pass</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-xs bg-slate-600" />
                    <span className="w-1.5 h-1.5 rounded-xs bg-[#5E8174]/70" />
                    <span className="w-1.5 h-1.5 rounded-xs bg-[#5E8174]" />
                    <span className="w-1.5 h-1.5 rounded-xs bg-slate-700" />
                    <span className="w-1.5 h-1.5 rounded-xs bg-[#6E9385]" />
                    <span className="w-1.5 h-1.5 rounded-xs bg-[#84A98C]" />
                  </div>
                  <div className="text-[7px] text-slate-400 font-mono">312 commits • Open Source</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD 3: PROJECTS / PORTFOLIO (Mid-Left Flank) ── */}
          <div
            ref={cardPortfolioRef}
            className="hidden md:block absolute will-change-transform"
            style={{
              top: '44%',
              left: 'max(2%, calc(50% - 610px))',
            }}
          >
            <div className="animate-card-drift-3">
              <div className="w-[180px] sm:w-[190px] bg-white rounded-2xl p-3 border border-slate-200/90 shadow-[0_10px_20px_-4px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-[#334155]" />
                    <div>
                      <div className="text-[9px] font-bold text-[#0F172A]">Projects / Portfolio</div>
                      <div className="text-[7px] text-[#334155]">Projects Shipped</div>
                    </div>
                  </div>
                  <span className="text-[6.5px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-1 py-0.5 rounded">
                    Live Demo
                  </span>
                </div>
                <div className="py-1 px-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between my-1">
                  <span className="text-[7.5px] font-medium text-[#0F172A]">Distributed KV-Store</span>
                  <div className="w-2 h-2 rounded-full bg-[#5E8174]" />
                </div>
                <div className="flex items-center justify-between text-[7px] text-[#334155] pt-0.5">
                  <span>10k RPS Benchmarked</span>
                  <span className="text-[#5E8174] font-semibold">Validated</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD 4: CODE / ENGINEERING EVIDENCE (Mid-Right Flank) ── */}
          <div
            ref={cardCodeRef}
            className="hidden md:block absolute will-change-transform"
            style={{
              top: '42%',
              right: 'max(2%, calc(50% - 610px))',
            }}
          >
            <div className="animate-card-drift-4">
              <div className="w-[185px] sm:w-[195px] bg-[#0F172A] text-white rounded-2xl p-3 border border-slate-700/80 shadow-[0_12px_24px_-4px_rgba(15,23,42,0.16)]">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-700/70">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#84A98C]" />
                    <div>
                      <div className="text-[9px] font-bold text-slate-100">Code / Engineering</div>
                      <div className="text-[7px] text-slate-400 font-mono">Quality • Architecture</div>
                    </div>
                  </div>
                  <span className="text-[7px] font-mono text-[#84A98C] font-semibold bg-[#5E8174]/20 px-1 py-0.2 rounded">Verified</span>
                </div>
                <div className="space-y-0.5 font-mono text-[7.5px] text-slate-300">
                  <div className="text-[#84A98C]">pub async fn acquire()</div>
                  <div className="text-slate-400 pl-2">0 data races • Lock-free</div>
                </div>
                <div className="mt-1 pt-1 border-t border-slate-700/50 flex items-center justify-between text-[7px] text-slate-400">
                  <span>AST Code Signature</span>
                  <span className="text-slate-200 font-semibold">Ready for Pod</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD 5: TECHNICAL ASSESSMENT (Lower-Left Flank) ── */}
          <div
            ref={cardAssessmentRef}
            className="absolute will-change-transform"
            style={{
              bottom: '8%',
              left: 'max(3%, calc(50% - 580px))',
            }}
          >
            <div className="animate-card-drift-5">
              <div className="w-[175px] sm:w-[185px] bg-white rounded-2xl p-3 border border-slate-200/90 shadow-[0_10px_20px_-4px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-[#334155]" />
                    <div>
                      <div className="text-[9px] font-bold text-[#0F172A]">Technical Assessment</div>
                      <div className="text-[7px] text-[#334155]">Assessment Score</div>
                    </div>
                  </div>
                  <span className="text-[6.5px] font-extrabold text-[#334155] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    Stage 01
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[7px]">
                    <span className="text-[#334155]">Space-Time Depth</span>
                    <span className="font-bold text-[#0F172A]">94% Score</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="w-[94%] h-full bg-[#5E8174] rounded-full" />
                  </div>
                  <div className="text-[6.5px] text-[#334155]">Algorithmic Mastery Calibrated</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD 6: INTERVIEW / HUMAN VALIDATION (Lower-Right Flank) ── */}
          <div
            ref={cardInterviewRef}
            className="absolute will-change-transform"
            style={{
              bottom: '8%',
              right: 'max(3%, calc(50% - 580px))',
            }}
          >
            <div className="animate-card-drift-6">
              <div className="w-[180px] sm:w-[190px] bg-white rounded-2xl p-3 border border-slate-200/90 shadow-[0_10px_20px_-4px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#5E8174]" />
                    <div>
                      <div className="text-[9px] font-bold text-[#0F172A]">Interview / Validation</div>
                      <div className="text-[7px] text-[#334155]">Principal Interview</div>
                    </div>
                  </div>
                  <span className="text-[6.5px] font-extrabold text-[#5E8174] bg-[#5E8174]/10 px-1.5 py-0.5 rounded border border-[#5E8174]/20">
                    Stage 02B
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[7px] text-[#0F172A] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5E8174]" />
                    <span>Principal Interview Verified</span>
                  </div>
                  <div className="text-[6.5px] text-[#334155] leading-tight pl-2.5">Live 1-to-1 Technical Defense</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════════════
           LAYER 3: THE REAL JADEER LOGO REVELATION (Clean final proven result)
           Tightly cropped transparent official logo asset with object-fit: contain
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div
            ref={logoWrapperRef}
            className="relative will-change-transform flex items-center justify-center opacity-0"
            style={{
              width: 'min(270px, 65vw)',
              height: 'min(360px, 42vh)',
            }}
          >
            <img
              src="/images/jadeer-logo-tight.png"
              alt="Jadeer Verified Brand Mark"
              className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_16px_36px_rgba(15,23,42,0.14)]"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
           LAYER 4: POST-VALIDATION VISUAL PAYOFF (Gently reveals beneath settled logo)
           ═══════════════════════════════════════════════════════════════════ */}
        <div
          ref={celebrationBannerRef}
          className="absolute bottom-8 sm:bottom-12 md:bottom-14 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none flex flex-col items-center gap-2 sm:gap-2.5 z-25 text-center px-4 max-w-xl w-full"
        >
          {/* Main Post-Validation Headline */}
          <h3 className="text-xl sm:text-2xl md:text-[26px] font-bold text-[#0F172A] tracking-tight leading-snug">
            <span>From scattered signals to </span>
            <span className="text-[#5E8174]">credible proof.</span>
          </h3>

          {/* Small Supporting Line */}
          <p className="text-xs sm:text-sm text-[#334155] font-normal leading-relaxed -mt-0.5 sm:-mt-1">
            Your capabilities, validated and made visible.
          </p>

          {/* Small Tertiary Certification Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-slate-200/90 shadow-2xs backdrop-blur-xs mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E8174] animate-pulse" />
            <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-widest text-[#0F172A]">
              MERIT CERTIFIED • JADEER PROVEN
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
