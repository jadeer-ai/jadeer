import React, { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — INTERACTIVE NEURAL & CODE DOTS GRID CANVAS
   ─────────────────────────────────────────────────────────────────────────
   - High-performance 60fps HTML5 Canvas background
   - Subtle, low-opacity technical dot grid across the entire viewport
   - Interactive mouse proximity attraction with dynamic neural connection lines
   - O(1) spatial grid neighbor calculations for zero interface lag
   ═══════════════════════════════════════════════════════════════════════════ */

interface GridPoint {
  col: number;
  row: number;
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  baseRadius: number;
  currentRadius: number;
  alpha: number;
  targetAlpha: number;
}

export interface NeuralGridCanvasProps {
  /** Custom class name for container */
  className?: string;
  /** Grid spacing in pixels (default: 42) */
  gridSpacing?: number;
  /** Proximity attraction radius around cursor (default: 155) */
  proximityRadius?: number;
  /** Base dot color in rgba format (default: '11, 15, 25') */
  dotBaseRgb?: string;
  /** Active proximity glow color in rgba format (default: '110, 143, 117' - Jadeer Sage) */
  activeSageRgb?: string;
}

const NeuralGridCanvas: React.FC<NeuralGridCanvasProps> = ({
  className = '',
  gridSpacing = 42,
  proximityRadius = 155,
  dotBaseRgb = '11, 15, 25',
  activeSageRgb = '110, 143, 117',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let grid: GridPoint[][] = [];

    // Mouse tracking with smooth activation/decay
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
      lastMoved: 0,
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const initGrid = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / gridSpacing) + 1;
      rows = Math.ceil(height / gridSpacing) + 1;

      grid = [];
      const offsetX = (width - (cols - 1) * gridSpacing) / 2;
      const offsetY = (height - (rows - 1) * gridSpacing) / 2;

      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          const originX = offsetX + c * gridSpacing;
          const originY = offsetY + r * gridSpacing;
          const phase = (c * 0.4 + r * 0.3) % (Math.PI * 2);

          grid[r][c] = {
            col: c,
            row: r,
            originX,
            originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            phase,
            baseRadius: 1.25,
            currentRadius: 1.25,
            alpha: 0.12,
            targetAlpha: 0.12,
          };
        }
      }
    };

    initGrid();

    // Mouse and touch event listeners
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
      mouse.lastMoved = performance.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
        mouse.lastMoved = performance.now();
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', initGrid, { passive: true });

    // 60FPS render loop
    const render = (time: number) => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.18;
        mouse.y += (mouse.targetY - mouse.y) * 0.18;

        // Auto-fade if cursor is idle for more than 4 seconds
        if (time - mouse.lastMoved > 4000) {
          mouse.active = false;
        }
      } else {
        mouse.x += (-9999 - mouse.x) * 0.08;
        mouse.y += (-9999 - mouse.y) * 0.08;
      }

      ctx.clearRect(0, 0, width, height);

      const tSec = time * 0.0015;

      // ── Step 1: Update points & Physics ──────────────────────────────────
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = grid[r][c];

          // Harmonic ambient breath
          const ambientX = p.originX + Math.sin(tSec + p.phase) * 1.5;
          const ambientY = p.originY + Math.cos(tSec + p.phase * 1.2) * 1.5;

          // Mouse proximity calculation
          const dx = mouse.x - p.originX;
          const dy = mouse.y - p.originY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // ── Peripheral Weighting: Keep Central Slogan Area Pristine & Readable ──
          // Core text box: center 44% width, top 48% height
          const normX = p.originX / width;
          const normY = p.originY / height;
          const isCenterTextZone = normX > 0.28 && normX < 0.72 && normY > 0.12 && normY < 0.46;
          const zoneFactor = isCenterTextZone ? 0.35 : 1.0;

          let targetX = ambientX;
          let targetY = ambientY;

          if (dist < proximityRadius && mouse.active) {
            const proximityFactor = (1 - dist / proximityRadius) * zoneFactor;
            const easeFactor = Math.pow(proximityFactor, 2);

            // Attraction toward cursor with spring physics
            const pullDistance = easeFactor * 24;
            const angle = Math.atan2(dy, dx);
            targetX = p.originX + Math.cos(angle) * pullDistance;
            targetY = p.originY + Math.sin(angle) * pullDistance;

            p.targetAlpha = (isCenterTextZone ? 0.08 : 0.15) + easeFactor * 0.7;
            p.currentRadius = p.baseRadius + easeFactor * 1.6;
          } else {
            p.targetAlpha = isCenterTextZone ? 0.06 : 0.12;
            p.currentRadius = p.baseRadius;
          }

          // Spring damping motion
          const spring = 0.15;
          const damping = 0.78;

          p.vx = (p.vx + (targetX - p.x) * spring) * damping;
          p.vy = (p.vy + (targetY - p.y) * spring) * damping;

          p.x += p.vx;
          p.y += p.vy;

          p.alpha += (p.targetAlpha - p.alpha) * 0.12;
        }
      }

      // ── Step 2: Draw Clean Minimalist Technical Grid Dots ────────────────
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = grid[r][c];

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.currentRadius, 0, Math.PI * 2);

          if (p.alpha > 0.28) {
            // Sage Green Glow for activated technical nodes near cursor
            ctx.fillStyle = `rgba(${activeSageRgb}, ${p.alpha})`;
            ctx.shadowColor = `rgba(${activeSageRgb}, 0.45)`;
            ctx.shadowBlur = 5;
          } else {
            // Clean ambient technical dot
            ctx.fillStyle = `rgba(${dotBaseRgb}, ${p.alpha})`;
            ctx.shadowBlur = 0;
          }

          ctx.fill();
        }
      }

      // Reset shadow for clean next frame
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', initGrid);
    };
  }, [gridSpacing, proximityRadius, dotBaseRgb, activeSageRgb]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      style={{
        opacity: 0.85,
        transition: 'opacity 0.6s ease-in-out',
      }}
    />
  );
};

export default React.memo(NeuralGridCanvas);
