import { useState } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import {
  ShieldCheck,
  CheckCircle2,
  GitPullRequest,
  Check,
  FileDown,
  Share2,
  MapPin,
  Mail,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — EVIDENCE PORTFOLIO & TECHNICAL CV SHEET
   Clean, professional, readable portfolio sheet structured for quick scanning
   by hiring managers, without jargon or cluttered widgets.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Inline GitHub Icon ─────────────────────────────────────────────────── */
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function PortfolioPage() {
  const { profile } = useUserProfile();
  const { isStudent } = useUserRole();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const defaultRoleTitle = isStudent || profile.role === 'student' ? 'Software Engineering Student' : 'Junior Software Engineer';

  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AH';

  const handleShareLink = () => {
    navigator.clipboard.writeText(`https://jadeer.io/candidates/${(profile.fullName || 'ahmad-al-hassan').toLowerCase().replace(/\s+/g, '-')}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadCV = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      window.print();
    }, 700);
  };

  return (
    <div className="w-full space-y-8 animate-[fade-in_0.4s_ease] pb-16 text-[#0F172A]">

      {/* ═══════════════════════════════════════════════════════════════
         1. TOP HEADER & DIRECT ACTION BUTTONS
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          {/* Candidate Profile Summary */}
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-2xl shadow-2xs shrink-0 overflow-hidden border border-slate-800">
              {profile.imageUrl ? (
                <img src={profile.imageUrl} alt={profile.fullName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                  {profile.fullName || 'Ahmad Al-Hassan'}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2.5 py-0.5 rounded-full border border-[#5E8174]/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5E8174]" />
                  Verified by Jadeer
                </span>
              </div>
              <p className="text-sm font-semibold text-[#334155]">
                {profile.title || defaultRoleTitle} • {profile.track || 'C++ & Backend Systems'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#5E8174]" />
                  {profile.location || 'Riyadh, Saudi Arabia'}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#5E8174]" />
                  {profile.email || 'ahmad.hassan@example.com'}
                </span>
                <span className="flex items-center gap-1">
                  <GitHubIcon className="w-3.5 h-3.5 text-[#0F172A]" />
                  {profile.githubUrl ? profile.githubUrl.replace('https://', '') : 'github.com/ahmad-hassan'}
                </span>
              </div>
            </div>
          </div>

          {/* Simple, Clean Button Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleShareLink}
              className="
                px-5 py-3 rounded-2xl bg-[#F8F9FA] text-[#334155] text-xs sm:text-sm font-bold
                border border-slate-200/80 hover:bg-white hover:text-[#0F172A]
                transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-2xs
              "
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#5E8174]" /> : <Share2 className="w-4 h-4 text-[#5E8174]" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCV}
              disabled={isDownloading}
              className="
                px-6 py-3 rounded-2xl bg-[#5E8174] text-white text-xs sm:text-sm font-bold
                hover:bg-[#4D6D62]
                active:scale-95
                transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-2xs
              "
            >
              {isDownloading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Preparing CV...
                </span>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Download CV (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Executive Summary (Warm Beige Secondary Surface) */}
        <div className="p-4 rounded-2xl bg-[#F4F0E8]/80 border border-[#E8E2D5] text-xs sm:text-[13.5px] text-[#334155] leading-relaxed">
          Junior software engineer with verified practical competence in modern C++ (C++20), lock-free multi-threaded architectures, and Linux asynchronous I/O with epoll. Evaluated and calibrated through supervised production project execution with zero memory leaks in automated Valgrind audits.
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         2. VERIFIED SKILLS TAXONOMY
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
        <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
          Verified Technical Skills
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
            <span className="font-bold text-[#334155]/70 uppercase tracking-wider text-[11px]">
              Core Languages
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['C++20 / C++17', 'C', 'Python 3', 'SQL'].map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 font-semibold text-[#0F172A] shadow-2xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
            <span className="font-bold text-[#334155]/70 uppercase tracking-wider text-[11px]">
              Systems & Concurrency
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['epoll Event Loops', 'Lock-Free RingBuffers', 'RAII Memory Safety', 'POSIX Threads'].map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 font-semibold text-[#0F172A] shadow-2xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
            <span className="font-bold text-[#334155]/70 uppercase tracking-wider text-[11px]">
              Testing & Tools
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Valgrind Memcheck', 'AddressSanitizer (ASan)', 'CMake', 'Git / GitHub', 'Docker'].map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 font-semibold text-[#0F172A] shadow-2xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         3. CHRONOLOGICAL PROJECT EVIDENCE
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">
              Verified Project Experience
            </h2>
            <p className="text-xs text-slate-500">
              Supervised production sprint deliverables • Oct 2026
            </p>
          </div>
          <span className="text-xs font-semibold text-[#5E8174] bg-[#5E8174]/10 border border-[#5E8174]/20 px-3 py-1 rounded-full">
            Completed & Calibrated
          </span>
        </div>

        {/* Project 1: Distributed Worker Engine */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Distributed Task Queue & Worker Engine
              </h3>
              <p className="text-xs text-[#334155]">
                Multi-threaded background task processing engine built in modern C++20 and Linux epoll
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 shrink-0">
              PR Delta: <span className="text-[#5E8174] font-bold">+617 / -65 lines</span>
            </span>
          </div>

          {/* Key Achievements Bullets */}
          <ul className="space-y-2 text-xs sm:text-[13px] text-[#334155] list-disc list-inside">
            <li>
              <span className="font-semibold text-[#0F172A]">Lock-Free Concurrency:</span> Implemented an atomic, lock-free ring buffer for thread dispatch (<span className="font-mono text-[#5E8174] font-semibold">+340 lines</span>) with <span className="font-mono text-[#0F172A]">alignas(64)</span> padding, eliminating mutex contention under high loads.
            </li>
            <li>
              <span className="font-semibold text-[#0F172A]">Asynchronous Network Loop:</span> Integrated Linux <span className="font-mono text-[#0F172A]">epoll</span> edge-triggered socket notifications, sustaining 100k requests/sec with 0.42ms p99 latency.
            </li>
            <li>
              <span className="font-semibold text-[#0F172A]">Zero Memory Leaks:</span> Achieved 100% leak-free execution verified by automated Valgrind Memcheck runs (<span className="font-mono text-[#0F172A]">48,290 allocs / 48,290 frees • 0 errors</span>).
            </li>
          </ul>

          {/* Pull Request Links */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-slate-500">Merged Pull Requests:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8F9FA] border border-slate-200/70 text-xs font-mono font-medium text-[#334155]">
              <GitPullRequest className="w-3.5 h-3.5 text-[#5E8174]" />
              PR #42: Lock-free ring buffer dispatch
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8F9FA] border border-slate-200/70 text-xs font-mono font-medium text-[#334155]">
              <GitPullRequest className="w-3.5 h-3.5 text-[#5E8174]" />
              PR #45: RAII smart deleters & epoll handler
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         4. SENIOR MENTOR REVIEW & BEHAVIORAL COMPETENCIES (SIDE-BY-SIDE)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Mentor Calibration Statement */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-slate-800">
              TM
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                Eng. Tariq Al-Mansoor
              </h3>
              <p className="text-xs text-[#334155]">
                Principal Systems Architect & Jadeer Mentor
              </p>
            </div>
          </div>

          {/* Warm Beige Quote Surface */}
          <div className="p-4 rounded-2xl bg-[#F4F0E8]/80 border border-[#E8E2D5] text-xs sm:text-[12.5px] text-[#334155] leading-relaxed italic space-y-2">
            <p>
              "Ahmad demonstrated exceptional command over low-level C++ mechanics during our technical calibration session. His code structure reflects a solid grasp of RAII, thread safety, and cache alignment that is rare for a junior engineer."
            </p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#5E8174] not-italic">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8174]" />
              <span>Calibrated & Endorsed for Junior Systems Role</span>
            </div>
          </div>
        </div>

        {/* Workplace Competencies */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
          <h3 className="text-base font-bold text-[#0F172A]">
            Workplace Competencies
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-0.5">
              <p className="font-bold text-[#0F172A]">Technical Communication</p>
              <p className="text-[#334155]/80">
                Structured PR #42 documentation with clear architectural rationale and benchmarking graphs.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-0.5">
              <p className="font-bold text-[#0F172A]">Ownership & Initiative</p>
              <p className="text-[#334155]/80">
                Proactively resolved a blocking worker thread race condition before Sprint 2 deadline.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-0.5">
              <p className="font-bold text-[#0F172A]">Team Collaboration</p>
              <p className="text-[#334155]/80">
                Provided clear code reviews and comprehensive benchmark documentation for pod peers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
