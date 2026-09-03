import React from 'react';
import { Link } from 'react-router-dom';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — OFFICIAL GLOBAL BRAND LOGO COMPONENT
   Renders the official Jadeer emblem mark paired with crisp brand typography.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface BrandLogoProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show the 'Jadeer' brand name text */
  showText?: boolean;
  /** Text color: 'dark' (#0F172A), 'light' (white), or 'inherit' */
  textColor?: 'dark' | 'light' | 'inherit';
  /** Optional link destination */
  href?: string;
  /** Extra container classes */
  className?: string;
  /** Extra image classes */
  imgClassName?: string;
  /** Inverted dark navigation variant specifically for dark surfaces like candidate sidebar */
  inverted?: boolean;
}

const sizeConfig = {
  sm: {
    imgSize: 'w-6 h-6',
    textClass: 'text-[17px]',
    gap: 'gap-2',
  },
  md: {
    imgSize: 'w-7 h-7 sm:w-8 sm:h-8',
    textClass: 'text-[19px] sm:text-[20px]',
    gap: 'gap-2.5',
  },
  lg: {
    imgSize: 'w-9 h-9 sm:w-10 sm:h-10',
    textClass: 'text-[24px]',
    gap: 'gap-3',
  },
  xl: {
    imgSize: 'w-12 h-12 sm:w-14 sm:h-14',
    textClass: 'text-[28px]',
    gap: 'gap-3.5',
  },
};

export default function BrandLogo({
  size = 'md',
  showText = true,
  textColor = 'dark',
  href = '/',
  className = '',
  imgClassName = '',
  inverted = false,
}: BrandLogoProps) {
  const config = sizeConfig[size] || sizeConfig.md;

  const textColorClass = inverted
    ? 'text-white'
    : textColor === 'light'
      ? 'text-white'
      : textColor === 'dark'
        ? 'text-[#0F172A]'
        : 'text-current';

  const logoSrc = inverted ? '/images/jadeer-logo-white.png' : '/Jadeer-logo.png';
  const imgSizeClass = inverted && size === 'md' ? 'w-8 h-8 sm:w-[34px] sm:h-[34px]' : config.imgSize;
  const dotColorClass = inverted ? 'text-[#6E9385]' : 'text-[#5E8174]';

  const logoNode = (
    <div className={`inline-flex items-center ${config.gap} ${className}`}>
      {/* ── Official Jadeer Emblem Mark ──────────────────────────────── */}
      <img
        src={logoSrc}
        alt="Jadeer Logo"
        className={`${imgSizeClass} object-contain shrink-0 transition-transform duration-200 group-hover:scale-105 select-none ${imgClassName}`}
      />

      {/* ── Brand Name Typography ────────────────────────────────────── */}
      {showText && (
        <span
          className={`font-extrabold tracking-tight select-none leading-none ${config.textClass} ${textColorClass}`}
        >
          Jadeer<span className={dotColorClass}>.</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="group inline-flex items-center focus:outline-none select-none">
        {logoNode}
      </Link>
    );
  }

  return logoNode;
}
