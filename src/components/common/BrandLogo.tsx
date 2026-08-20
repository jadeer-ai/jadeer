import React from 'react';
import { Link } from 'react-router-dom';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — GLOBAL BRAND LOGO (CLEAN INLINE SVG EDITION)
   Zero external asset dependencies: sleek, beautifully curved letter 'J'
   vector mark in signature Sage Green (#8B9D83 / #6E8F75) paired with crisp
   'Jadeer' brand typography. Renders instantly and 100% error-free everywhere.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface BrandLogoProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show the 'Jadeer' brand name text */
  showText?: boolean;
  /** Text color: 'dark' (#0B0F19), 'light' (white), or 'inherit' */
  textColor?: 'dark' | 'light' | 'inherit';
  /** Optional link destination */
  href?: string;
  /** Extra container classes */
  className?: string;
  /** Extra SVG classes */
  imgClassName?: string;
}

const sizeConfig = {
  sm: {
    svgWidth: 20,
    svgHeight: 28,
    textClass: 'text-[17px]',
    gap: 'gap-2',
  },
  md: {
    svgWidth: 24,
    svgHeight: 34,
    textClass: 'text-[20px]',
    gap: 'gap-2.5',
  },
  lg: {
    svgWidth: 30,
    svgHeight: 42,
    textClass: 'text-[24px]',
    gap: 'gap-3',
  },
  xl: {
    svgWidth: 38,
    svgHeight: 52,
    textClass: 'text-[28px]',
    gap: 'gap-3.5',
  },
};

export default function BrandLogo({
  size = 'md',
  showText = true,
  textColor = 'dark',
  href,
  className = '',
  imgClassName = '',
}: BrandLogoProps) {
  const config = sizeConfig[size] || sizeConfig.md;

  const textColorClass =
    textColor === 'light'
      ? 'text-white'
      : textColor === 'dark'
        ? 'text-[#0B0F19]'
        : 'text-current';

  const logoNode = (
    <div className={`inline-flex items-center ${config.gap} ${className}`}>
      {/* ── Sleek Curved Letter 'J' Inline SVG Mark ──────────────────── */}
      <svg
        width={config.svgWidth}
        height={config.svgHeight}
        viewBox="0 0 60 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 transition-transform duration-200 group-hover:scale-105 select-none ${imgClassName}`}
      >
        <defs>
          {/* Signature Sage Green Gradient */}
          <linearGradient id="jadeer-sage-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A2B69B" />
            <stop offset="50%" stopColor="#8B9D83" />
            <stop offset="100%" stopColor="#64826B" />
          </linearGradient>

          {/* Accent Leaf/Ribbon Gradient */}
          <linearGradient id="jadeer-leaf-grad" x1="30%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B5C9AF" />
            <stop offset="100%" stopColor="#8B9D83" />
          </linearGradient>

          {/* Soft Depth Shadow */}
          <filter id="jadeer-subtle-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0B0F19" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Top Floating Leaf/Ribbon Flourish */}
        <path
          d="M38 4C41.5 13 49 22 56 26C51 28 44 26 39 21C34.5 16.5 35 7.5 38 4Z"
          fill="url(#jadeer-leaf-grad)"
        />

        {/* Main Curved 'J' Stem & Hook Body */}
        <path
          d="M35 15C35 15 35 48 35 56C35 68 25.5 76 14.5 76C7 76 2 71.5 2 64.5C2 57.5 7 53 13.5 53C17.5 53 20.5 55 22 57.5C22 51.5 22 24 22 15C22 15 28 15 35 15Z"
          fill="url(#jadeer-sage-grad)"
          filter="url(#jadeer-subtle-glow)"
        />

        {/* Inner Curved Fold Highlight */}
        <path
          d="M35 24C35 34 33 46 29 55C26 61.5 20.5 66 14.5 66C10.5 66 7 63.5 7 60C7 57 9 55 12 55C17 55 22 58.5 24 64C26 60 26 42 26 24L35 24Z"
          fill="#B5C9AF"
          opacity="0.35"
        />
      </svg>

      {/* ── Brand Name Typography (Crisp & Vertically Aligned) ──────── */}
      {showText && (
        <span
          className={`font-extrabold tracking-tight select-none leading-none ${config.textClass} ${textColorClass}`}
        >
          Jadeer
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="group inline-flex items-center focus:outline-none">
        {logoNode}
      </Link>
    );
  }

  return logoNode;
}
