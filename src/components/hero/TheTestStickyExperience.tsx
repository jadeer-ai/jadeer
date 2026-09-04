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
 * 1. Initial Load & Phase 1 — Initial Hero (P = 0.00 – 0.18):
 *    Scattered evidence cards orbit the hero.
 *    Prominent slogan “Where Potential Becomes Proof.”, supporting copy & CTAs are 100% visible.
 *    Validation Matrix, central circle, pulse aura, and reveal logo are completely hidden.
 *
 * 2. Phase 2 — Hero to Validation Handoff (P = 0.18 – 0.32):
 *    Controlled crossfade: hero slogan & copy fade out (1 -> 0) with slight upward float.
 *    Validation Matrix crossfades in (0 -> 1) with subtle scale (0.92 -> 1.0).
 *    Evidence cards begin moving toward convergence trajectories.
 *
 * 3. Phase 3 — Validation / Convergence (P = 0.32 – 0.62):
 *    Hero is fully hidden. Validation Matrix is fully visible.
 *    All 6 evidence cards converge into the central target and compress.
 *    Confirmation pulse & aura activate during peak convergence (P = 0.50 – 0.62).
 *
 * 4. Phase 4 — Compression / Logo Reveal (P = 0.62 – 0.76):
 *    Evidence cards dissolve into the center core.
 *    Validation Matrix resolves toward center (1 -> 0) as Jadeer reveal logo emerges (0 -> 1).
 *
 * 5. Phase 5 — Logo Moment (P = 0.76 – 0.86):
 *    Official Jadeer brand mark held clean and steady at center (scale 1.0, opacity 1.0).
 *    Zero hero slogan behind it; zero competing validation matrix.
 *
 * 6. Phase 6 — Logo Exit / Normal Landing Continuation (P = 0.86 – 0.96):
 *    Jadeer logo smoothly exits (1 -> 0, translateY 0 -> -22px).
 *    Normal landing page content seamlessly continues. Zero repeated slogan.
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
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const cardCvRef = useRef<HTMLDivElement | null>(null);
  const cardGithubRef = useRef<HTMLDivElement | null>(null);
  const cardPortfolioRef = useRef<HTMLDivElement | null>(null);
  const cardCodeRef = useRef<HTMLDivElement | null>(null);
  const cardAssessmentRef = useRef<HTMLDivElement | null>(null);
  const cardInterviewRef = useRef<HTMLDivElement | null>(null);

  // Real Jadeer Logo & Proof Celebration Banner
  const logoContainerRef = useRef<HTMLDivElement | null>(null);
  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  const celebrationBannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport) return;

    // Preload & decode the Jadeer brand logo to prevent decoding hitch at P = 0.72
    const preloadImg = new Image();
    preloadImg.src = '/images/jadeer-logo-tight.png';
    if (preloadImg.decode) {
      preloadImg.decode().catch(() => {});
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // For reduced motion: skip animations, show normal hero statically
      if (cardsContainerRef.current) cardsContainerRef.current.style.display = 'none';
      if (validationCircleRef.current) validationCircleRef.current.style.display = 'none';
      if (logoContainerRef.current) logoContainerRef.current.style.display = 'none';
      if (celebrationBannerRef.current) celebrationBannerRef.current.style.display = 'none';
      if (heroContentRef.current) {
        heroContentRef.current.style.opacity = '1';
        heroContentRef.current.style.transform = 'translate3d(0, 0, 0)';
        heroContentRef.current.style.visibility = 'visible';
        heroContentRef.current.style.pointerEvents = 'auto';
      }
      return;
    }

    interface CardVector {
      originX: number;
      originY: number;
      dx: number;
      dy: number;
    }

    interface GeometryCache {
      matrixCenterX: number;
      matrixCenterY: number;
      v1: CardVector;
      v2: CardVector;
      v3: CardVector;
      v4: CardVector;
      v5: CardVector;
      v6: CardVector;
    }

    let rafId: number | null = null;
    let isVisible = true;
    let isIntroActive = true;

    // Geometry cache to avoid layout thrashing (no getBoundingClientRect during scroll)
    let containerTop = 0;
    let totalScrollable = 1;

    let geometry: GeometryCache = {
      matrixCenterX: 0,
      matrixCenterY: 0,
      v1: { originX: 0, originY: 0, dx: 0, dy: 0 },
      v2: { originX: 0, originY: 0, dx: 0, dy: 0 },
      v3: { originX: 0, originY: 0, dx: 0, dy: 0 },
      v4: { originX: 0, originY: 0, dx: 0, dy: 0 },
      v5: { originX: 0, originY: 0, dx: 0, dy: 0 },
      v6: { originX: 0, originY: 0, dx: 0, dy: 0 },
    };

    // Robust measurement of geometry: container coordinates, un-transformed origins, and exact matrix center
    const measureGeometry = () => {
      if (!container || !viewport) return;

      const rect = container.getBoundingClientRect();
      containerTop = rect.top + window.scrollY;
      const windowHeight = window.innerHeight || 800;
      totalScrollable = Math.max(1, container.offsetHeight - windowHeight);

      // Temporarily ensure elements are displayable and untransformed for measurement
      const cardsContainer = cardsContainerRef.current;
      const prevContainerDisplay = cardsContainer ? cardsContainer.style.display : '';
      if (cardsContainer && prevContainerDisplay === 'none') {
        cardsContainer.style.display = '';
      }

      const valCircle = validationCircleRef.current;
      const prevCircleDisplay = valCircle ? valCircle.style.display : '';
      const prevCircleTransform = valCircle ? valCircle.style.transform : '';
      if (valCircle) {
        valCircle.style.display = '';
        valCircle.style.transform = 'none';
      }

      const vRect = viewport.getBoundingClientRect();

      // Shared destination: exact center of Validation Matrix
      let matrixCenterX = vRect.width / 2;
      let matrixCenterY = vRect.height / 2;
      if (pulseRingRef.current) {
        const prRect = pulseRingRef.current.getBoundingClientRect();
        if (prRect.width > 0 && prRect.height > 0) {
          matrixCenterX = prRect.left + prRect.width / 2 - vRect.left;
          matrixCenterY = prRect.top + prRect.height / 2 - vRect.top;
        }
      }

      const fbW = vRect.width || window.innerWidth || 1200;
      const fbH = vRect.height || window.innerHeight || 800;

      const measureCard = (
        el: HTMLElement | null,
        fallbackOriginX: number,
        fallbackOriginY: number
      ): CardVector => {
        if (!el) {
          return {
            originX: fallbackOriginX,
            originY: fallbackOriginY,
            dx: matrixCenterX - fallbackOriginX,
            dy: matrixCenterY - fallbackOriginY,
          };
        }

        const prevTransform = el.style.transform;
        const prevVisibility = el.style.visibility;
        el.style.transform = 'none';
        el.style.visibility = 'visible';

        const cRect = el.getBoundingClientRect();

        el.style.transform = prevTransform;
        el.style.visibility = prevVisibility;

        // If card has width 0 (e.g., hidden md:block on mobile or not rendered)
        if (cRect.width === 0 || cRect.height === 0) {
          return {
            originX: fallbackOriginX,
            originY: fallbackOriginY,
            dx: matrixCenterX - fallbackOriginX,
            dy: matrixCenterY - fallbackOriginY,
          };
        }

        const originX = cRect.left + cRect.width / 2 - vRect.left;
        const originY = cRect.top + cRect.height / 2 - vRect.top;

        return {
          originX,
          originY,
          dx: matrixCenterX - originX,
          dy: matrixCenterY - originY,
        };
      };

      geometry = {
        matrixCenterX,
        matrixCenterY,
        v1: measureCard(cardCvRef.current, Math.max(0.03 * fbW, fbW / 2 - 485), 0.08 * fbH + 55),
        v2: measureCard(cardGithubRef.current, fbW - Math.max(0.03 * fbW, fbW / 2 - 485), 0.09 * fbH + 60),
        v3: measureCard(cardPortfolioRef.current, Math.max(0.02 * fbW, fbW / 2 - 515), 0.44 * fbH + 50),
        v4: measureCard(cardCodeRef.current, fbW - Math.max(0.02 * fbW, fbW / 2 - 515), 0.42 * fbH + 55),
        v5: measureCard(cardAssessmentRef.current, Math.max(0.03 * fbW, fbW / 2 - 490), fbH - 0.08 * fbH - 50),
        v6: measureCard(cardInterviewRef.current, fbW - Math.max(0.03 * fbW, fbW / 2 - 490), fbH - 0.08 * fbH - 45),
      };

      // Restore container & circle states
      if (cardsContainer && prevContainerDisplay === 'none') {
        cardsContainer.style.display = 'none';
      }
      if (valCircle) {
        valCircle.style.display = prevCircleDisplay;
        valCircle.style.transform = prevCircleTransform;
      }
    };

    // Initial measurement
    measureGeometry();

    // Double requestAnimationFrame to ensure layout has stabilized and CSS media queries are applied
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        measureGeometry();
        updateSequence();
      });
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        measureGeometry();
        updateSequence();
      }).catch(() => {});
    }

    const handleResize = () => {
      measureGeometry();
      updateSequence();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const updateSequence = () => {
      if (!container) return;

      const scrollTop = window.scrollY;
      const rawP = totalScrollable > 0 ? (scrollTop - containerTop) / totalScrollable : 0;
      const P = clamp(rawP, 0, 1);

      // ───────────────────────────────────────────────────────────────────────
      // HYSTERESIS BOUNDARY (hide intro layers past 0.95, restore below 0.92)
      // ───────────────────────────────────────────────────────────────────────
      if (P >= 0.95 && isIntroActive) {
        isIntroActive = false;
        if (cardsContainerRef.current) cardsContainerRef.current.style.display = 'none';
        if (validationCircleRef.current) validationCircleRef.current.style.display = 'none';
        if (logoContainerRef.current) {
          logoContainerRef.current.style.display = 'none';
          if (logoWrapperRef.current) {
            logoWrapperRef.current.style.opacity = '0';
            logoWrapperRef.current.style.visibility = 'hidden';
            logoWrapperRef.current.style.pointerEvents = 'none';
          }
        }
        if (celebrationBannerRef.current) {
          celebrationBannerRef.current.style.display = 'none';
          celebrationBannerRef.current.style.opacity = '0';
          celebrationBannerRef.current.style.visibility = 'hidden';
        }
        if (heroContentRef.current) {
          heroContentRef.current.style.display = 'none';
          heroContentRef.current.style.opacity = '0';
          heroContentRef.current.style.visibility = 'hidden';
          heroContentRef.current.style.pointerEvents = 'none';
        }
      } else if (P < 0.92 && !isIntroActive) {
        isIntroActive = true;
        if (cardsContainerRef.current) cardsContainerRef.current.style.display = '';
        if (validationCircleRef.current) validationCircleRef.current.style.display = '';
        if (logoContainerRef.current) logoContainerRef.current.style.display = '';
        if (celebrationBannerRef.current) celebrationBannerRef.current.style.display = '';
        if (heroContentRef.current) heroContentRef.current.style.display = '';
      }

      // If safely past the intro and layers are hidden, exit early to avoid redundant work
      if (!isIntroActive && P >= 0.95) {
        return;
      }

      // ───────────────────────────────────────────────────────────────────────
      // LAYER 1: INITIAL HERO CONTENT & CROSSFADE HANDOFF
      // Phase 1 (0.00 – 0.18): Fully visible, interactive, centered
      // Phase 2 (0.18 – 0.30): Crossfades out (1 -> 0) with slight upward float
      // Phase 3+ (>= 0.30): Completely hidden, never reappears
      // ───────────────────────────────────────────────────────────────────────
      if (heroContentRef.current) {
        if (P <= 0.18) {
          heroContentRef.current.style.visibility = 'visible';
          heroContentRef.current.style.opacity = '1';
          heroContentRef.current.style.transform = 'translate3d(0, 0, 0)';
          heroContentRef.current.style.pointerEvents = 'auto';
        } else if (P < 0.30) {
          const handoffT = easeInOutCubic((P - 0.18) / 0.12);
          const heroOpacity = 1 - handoffT;
          const heroTranslateY = lerp(0, -24, handoffT);
          heroContentRef.current.style.visibility = heroOpacity > 0.01 ? 'visible' : 'hidden';
          heroContentRef.current.style.opacity = heroOpacity.toFixed(3);
          heroContentRef.current.style.transform = `translate3d(0, ${heroTranslateY.toFixed(1)}px, 0)`;
          heroContentRef.current.style.pointerEvents = heroOpacity > 0.5 ? 'auto' : 'none';
        } else {
          heroContentRef.current.style.opacity = '0';
          heroContentRef.current.style.visibility = 'hidden';
          heroContentRef.current.style.pointerEvents = 'none';
          heroContentRef.current.style.transform = 'translate3d(0, -24px, 0)';
        }
      }

      // ───────────────────────────────────────────────────────────────────────
      // LAYER 2: CENTRAL VALIDATION CIRCLE CHAMBER (VALIDATION MATRIX)
      // Phase 1 (0.00 – 0.18): Completely hidden, zero pulse
      // Phase 2 (0.18 – 0.30): Crossfades in (0 -> 1), scales (0.88 -> 1.0)
      // Phase 3 (0.30 – 0.64): Fully visible, active convergence target & pulse
      // Phase 4 (0.64 – 0.74): Resolves toward center (1 -> 0) as logo emerges
      // Phase 5+ (> 0.74): Completely hidden
      // ───────────────────────────────────────────────────────────────────────
      if (validationCircleRef.current && pulseRingRef.current && pulseAuraRef.current) {
        if (P <= 0.18) {
          validationCircleRef.current.style.opacity = '0';
          validationCircleRef.current.style.visibility = 'hidden';
          validationCircleRef.current.style.transform = 'translate3d(0, 0, 0) scale(0.88)';

          pulseRingRef.current.style.transform = 'scale(1)';
          pulseRingRef.current.style.borderColor = 'rgba(94, 129, 116, 0.35)';
          pulseAuraRef.current.style.opacity = '0';
        } else if (P < 0.30) {
          const matrixInT = easeInOutCubic((P - 0.18) / 0.12);
          const matrixScale = lerp(0.88, 1.0, matrixInT);
          validationCircleRef.current.style.visibility = matrixInT > 0.01 ? 'visible' : 'hidden';
          validationCircleRef.current.style.opacity = matrixInT.toFixed(3);
          validationCircleRef.current.style.transform = `translate3d(0, 0, 0) scale(${matrixScale.toFixed(3)})`;

          pulseRingRef.current.style.transform = 'scale(1)';
          pulseRingRef.current.style.borderColor = 'rgba(94, 129, 116, 0.35)';
          pulseAuraRef.current.style.opacity = '0';
        } else if (P <= 0.64) {
          validationCircleRef.current.style.visibility = 'visible';
          validationCircleRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
          validationCircleRef.current.style.opacity = '1';

          // Active confirmation pulse peaks during peak convergence & compression (P = 0.52 -> 0.64)
          if (P >= 0.52) {
            const pulseP = Math.sin(clamp((P - 0.52) / 0.12, 0, 1) * Math.PI);
            pulseRingRef.current.style.transform = `scale(${(1 + pulseP * 0.45).toFixed(3)})`;
            pulseRingRef.current.style.borderColor = pulseP > 0.3 ? 'rgba(196, 132, 108, 0.85)' : 'rgba(94, 129, 116, 0.4)';
            pulseAuraRef.current.style.opacity = (pulseP * 0.9).toFixed(3);
          } else {
            pulseRingRef.current.style.transform = 'scale(1)';
            pulseRingRef.current.style.borderColor = 'rgba(94, 129, 116, 0.35)';
            pulseAuraRef.current.style.opacity = '0';
          }
        } else if (P <= 0.74) {
          // Circle resolves as official logo reveals from center
          const circleExitT = easeInOutCubic((P - 0.64) / 0.10);
          const circleScale = lerp(1.0, 0.85, circleExitT);
          const circleOpacity = 1 - circleExitT;

          validationCircleRef.current.style.visibility = circleOpacity > 0.01 ? 'visible' : 'hidden';
          validationCircleRef.current.style.transform = `translate3d(0, 0, 0) scale(${circleScale.toFixed(3)})`;
          validationCircleRef.current.style.opacity = circleOpacity.toFixed(3);
          pulseAuraRef.current.style.opacity = '0';
        } else {
          validationCircleRef.current.style.opacity = '0';
          validationCircleRef.current.style.visibility = 'hidden';
          pulseAuraRef.current.style.opacity = '0';
        }
      }

      // ───────────────────────────────────────────────────────────────────────
      // LAYER 3: THE 6 EVIDENCE CARDS (INDEPENDENT CONVERGENCE CHOREOGRAPHY)
      // Phase 1 (0.00 – 0.18): Peripheral scattered placement, rest position
      // Phase 2 (0.18 – 0.28): Rest near origins while matrix fades in
      // Phase 3 (0.28 – 0.60): Independent inward convergence trajectories into matrix
      // Phase 4 (0.58 – 0.68): Visibly stack, overlap, compress & dissolve in matrix
      // Phase 5 (>= 0.68): Completely dissolved into center core
      // ───────────────────────────────────────────────────────────────────────
      const animateCard = (
        el: HTMLElement | null,
        vec: CardVector,
        startP: number,
        endP: number,
        baseRot: number,
        targetRot: number,
        baseScale: number,
        targetScale: number,
        baseOpacity: number
      ) => {
        if (!el) return;

        if (P <= startP) {
          // Peripheral orbit / scattered rest state
          el.style.visibility = 'visible';
          el.style.transform = `translate3d(0, 0, 0) rotate(${baseRot}deg) scale(${baseScale})`;
          el.style.opacity = baseOpacity.toFixed(3);
        } else if (P < 0.68) {
          // Inward convergence along independent trajectory vector (startP -> endP)
          const t = easeInOutCubic(clamp((P - startP) / (endP - startP), 0, 1));
          const x = lerp(0, vec.dx, t);
          const y = lerp(0, vec.dy, t);
          const rot = lerp(baseRot, targetRot, t);

          // Gradual scale down as card approaches and enters the Validation Matrix chamber
          let s = lerp(baseScale, targetScale, t);

          // Opacity: high while approaching and visibly stacking inside matrix (P <= 0.58)
          // Final compression and dissolve inside matrix core (P = 0.58 -> 0.68)
          let op = baseOpacity;
          if (P >= 0.58) {
            const compressT = easeInOutCubic(clamp((P - 0.58) / 0.10, 0, 1));
            // Compresses tightly toward ~0.26 - 0.28
            s = lerp(s, targetScale * 0.72, compressT);
            op = baseOpacity * (1 - compressT);
          }

          el.style.visibility = op > 0.01 ? 'visible' : 'hidden';
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${s.toFixed(3)})`;
          el.style.opacity = op.toFixed(3);
        } else {
          // P >= 0.68: fully compressed & dissolved into validation core
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
        }
      };

      // Card 1: CV / Resume (Upper-Left Flank)
      animateCard(cardCvRef.current, geometry.v1, 0.28, 0.58, -3, 8, 1.0, 0.38, 0.96);

      // Card 2: GitHub / Repositories (Upper-Right Flank)
      animateCard(cardGithubRef.current, geometry.v2, 0.29, 0.59, 3, -8, 1.0, 0.38, 0.96);

      // Card 3: Projects / Portfolio (Mid-Left Flank)
      animateCard(cardPortfolioRef.current, geometry.v3, 0.30, 0.60, -2.5, 6, 0.92, 0.36, 0.92);

      // Card 4: Code / Engineering Evidence (Mid-Right Flank)
      animateCard(cardCodeRef.current, geometry.v4, 0.31, 0.61, 2.5, -6, 0.92, 0.36, 0.92);

      // Card 5: Technical Assessment (Lower-Left Flank)
      animateCard(cardAssessmentRef.current, geometry.v5, 0.32, 0.62, 2.5, -5, 0.92, 0.36, 0.92);

      // Card 6: Interview / Human Validation (Lower-Right Flank)
      animateCard(cardInterviewRef.current, geometry.v6, 0.33, 0.63, -2.5, 5, 0.92, 0.36, 0.92);

      // ───────────────────────────────────────────────────────────────────────
      // LAYER 4: JADEER REVEAL LOGO
      // Phase 1-3 (< 0.66): Completely hidden
      // Phase 4 (0.66 – 0.76): Emergence from exact matrix center (scale 0.86 -> 1.0, op 0 -> 1)
      // Phase 5 (0.76 – 0.86): Logo moment held clean, steady, scale 1.0, op 1.0
      // Phase 6 (0.86 – 0.95): Smooth logo exit (op 1 -> 0, translateY 0 -> -22px, scale 1.0 -> 0.96)
      // Normal landing (>= 0.95): Completely hidden
      // ───────────────────────────────────────────────────────────────────────
      if (logoWrapperRef.current) {
        if (P < 0.66) {
          logoWrapperRef.current.style.opacity = '0';
          logoWrapperRef.current.style.visibility = 'hidden';
          logoWrapperRef.current.style.pointerEvents = 'none';
        } else if (P < 0.76) {
          const logoInT = easeInOutCubic((P - 0.66) / 0.10);
          const logoScale = lerp(0.86, 1.0, logoInT);
          logoWrapperRef.current.style.visibility = 'visible';
          logoWrapperRef.current.style.opacity = logoInT.toFixed(3);
          logoWrapperRef.current.style.transform = `translate3d(0, 0, 0) scale(${logoScale.toFixed(3)})`;
          logoWrapperRef.current.style.pointerEvents = 'none';
        } else if (P <= 0.86) {
          logoWrapperRef.current.style.visibility = 'visible';
          logoWrapperRef.current.style.opacity = '1';
          logoWrapperRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
          logoWrapperRef.current.style.pointerEvents = 'none';
        } else if (P <= 0.95) {
          const exitT = easeInOutCubic((P - 0.86) / 0.09);
          const logoExitOpacity = 1 - exitT;
          const logoExitScale = lerp(1.0, 0.96, exitT);
          const logoExitTranslateY = lerp(0, -22, exitT);

          logoWrapperRef.current.style.visibility = logoExitOpacity > 0.01 ? 'visible' : 'hidden';
          logoWrapperRef.current.style.opacity = logoExitOpacity.toFixed(3);
          logoWrapperRef.current.style.transform = `translate3d(0, ${logoExitTranslateY.toFixed(1)}px, 0) scale(${logoExitScale.toFixed(3)})`;
          logoWrapperRef.current.style.pointerEvents = 'none';
        } else {
          logoWrapperRef.current.style.opacity = '0';
          logoWrapperRef.current.style.visibility = 'hidden';
          logoWrapperRef.current.style.pointerEvents = 'none';
        }
      }

      // ───────────────────────────────────────────────────────────────────────
      // LAYER 5: POST-VALIDATION BANNER (P = 0.78 -> 0.84 in, 0.86 -> 0.94 exit)
      // Does not render any duplicate hero slogan; complements logo moment
      // ───────────────────────────────────────────────────────────────────────
      if (celebrationBannerRef.current) {
        if (P < 0.78 || P >= 0.95) {
          celebrationBannerRef.current.style.opacity = '0';
          celebrationBannerRef.current.style.visibility = 'hidden';
          celebrationBannerRef.current.style.pointerEvents = 'none';
        } else if (P < 0.84) {
          const bannerInT = easeInOutCubic((P - 0.78) / 0.06);
          celebrationBannerRef.current.style.visibility = 'visible';
          celebrationBannerRef.current.style.opacity = bannerInT.toFixed(3);
          celebrationBannerRef.current.style.transform = `translate3d(0, ${(12 * (1 - bannerInT)).toFixed(1)}px, 0)`;
        } else if (P <= 0.86) {
          celebrationBannerRef.current.style.visibility = 'visible';
          celebrationBannerRef.current.style.opacity = '1';
          celebrationBannerRef.current.style.transform = 'translate3d(0, 0, 0)';
        } else {
          const bannerOutT = easeInOutCubic((P - 0.86) / 0.08);
          const bannerExitOpacity = 1 - bannerOutT;
          celebrationBannerRef.current.style.visibility = bannerExitOpacity > 0.01 ? 'visible' : 'hidden';
          celebrationBannerRef.current.style.opacity = bannerExitOpacity.toFixed(3);
          celebrationBannerRef.current.style.transform = `translate3d(0, ${(-10 * bannerOutT).toFixed(1)}px, 0)`;
        }
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
      className="relative w-full h-[290vh] bg-[#F8F9FA]"
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
          style={{ visibility: 'hidden', opacity: 0 }}
        >
          <div className="relative flex items-center justify-center w-[160px] sm:w-[180px] aspect-square">
            {/* Ambient Confirmation Aura (Semantic Muted Sage) - NO CSS transition during scroll */}
            <div
              ref={pulseAuraRef}
              className="absolute inset-0 rounded-full bg-[#5E8174]/25 blur-xl opacity-0"
            />

            {/* Validation Circle Frame - NO CSS transition during scroll */}
            <div
              ref={pulseRingRef}
              className="w-full h-full rounded-full border-2 border-[#5E8174]/40 bg-white/70 backdrop-blur-xs flex items-center justify-center shadow-lg"
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
           LAYER 1: CENTERED HERO CONTENT (Initial Hero at P = 0.00 – 0.18)
           ═══════════════════════════════════════════════════════════════════ */}
        <div
          ref={heroContentRef}
          className="relative mx-auto max-w-3xl px-6 sm:px-8 text-center space-y-8 sm:space-y-10 z-20 will-change-transform pointer-events-auto opacity-100"
          style={{ opacity: 1, visibility: 'visible', transform: 'translate3d(0, 0, 0)' }}
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
        <div ref={cardsContainerRef} className="absolute inset-0 pointer-events-none select-none z-15">

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
        <div ref={logoContainerRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div
            ref={logoWrapperRef}
            className="relative will-change-transform flex items-center justify-center opacity-0"
            style={{
              width: 'min(270px, 65vw)',
              height: 'min(360px, 42vh)',
              visibility: 'hidden',
              opacity: 0,
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
          style={{ visibility: 'hidden', opacity: 0 }}
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
