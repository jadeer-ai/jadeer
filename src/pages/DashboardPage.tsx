import { Link } from 'react-router-dom';
import {
  Check,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  Clock,
  Mic,
  ShieldCheck,
  FileText,
  UserCheck,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — MAIN CANDIDATE DASHBOARD (HOME SCREEN)
   Ultra-minimalist, calm, and focused interface reflecting trust and competence.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Validation Journey Phases ──────────────────────────────────────────── */

interface JourneyPhase {
  id: string;
  step: string;
  name: string;
  desc: string;
  status: 'completed' | 'current' | 'upcoming';
}

const journeyPhases: JourneyPhase[] = [
  {
    id: 'onboarding',
    step: '01',
    name: 'Onboarding',
    desc: 'Profile & Skills Setup',
    status: 'completed',
  },
  {
    id: 'ai-assessment',
    step: '02',
    name: 'AI Assessment',
    desc: 'Adaptive Technical Interview',
    status: 'current',
  },
  {
    id: 'project-execution',
    step: '03',
    name: 'Project Execution',
    desc: 'Production Industry Pod',
    status: 'upcoming',
  },
  {
    id: 'job-matching',
    step: '04',
    name: 'Job Matching',
    desc: 'Evidence-Backed Hiring',
    status: 'upcoming',
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 animate-[fade-in_0.4s_ease] py-2 sm:py-6">

      {/* ═══════════════════════════════════════════════════════════════
         CALM & BREATHABLE GREETING HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#0B0F19]/45">
          <span>Junior Backend & Systems Track</span>
          <span>•</span>
          <span>Candidate ID: JAD-8492</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
          Welcome back, <span className="text-[#6E8F75]">Ahmad</span>
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[#0B0F19]/55 max-w-xl leading-relaxed">
          Your path to verified engineering competence. Complete your validation milestones to unlock industry-sponsored projects.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         VALIDATION JOURNEY TRACKER (MINIMALIST VISUAL STEPPER)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.05] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6E8F75]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">
              Validation Journey Progress
            </h2>
          </div>
          <span className="text-xs font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-3 py-1 rounded-full">
            Phase 2 of 4 Active
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
          {journeyPhases.map((phase, idx) => {
            const isCompleted = phase.status === 'completed';
            const isCurrent = phase.status === 'current';
            const isUpcoming = phase.status === 'upcoming';

            return (
              <div key={phase.id} className="flex sm:flex-col items-start gap-4 sm:gap-3 relative">
                {/* Horizontal connector line on desktop */}
                {idx < journeyPhases.length - 1 && (
                  <div
                    className={`
                      hidden sm:block absolute top-4 left-[28px] right-[-14px] h-[2px] z-0
                      ${isCompleted ? 'bg-[#6E8F75]' : 'bg-[#0B0F19]/[0.06]'}
                    `}
                  />
                )}

                {/* Step indicator icon/circle */}
                <div className="relative z-10 shrink-0">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-[#6E8F75] text-white flex items-center justify-center shadow-[0_2px_8px_rgba(110,143,117,0.3)]">
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#6E8F75] flex items-center justify-center shadow-[0_0_12px_rgba(110,143,117,0.25)]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#6E8F75] animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-[#0B0F19]/30 flex items-center justify-center text-xs font-bold">
                      {phase.step}
                    </div>
                  )}
                </div>

                {/* Step label info */}
                <div className="space-y-0.5 min-w-0">
                  <p
                    className={`
                      text-[13.5px] font-bold leading-tight
                      ${isCurrent ? 'text-[#0B0F19]' : isCompleted ? 'text-[#0B0F19]/80' : 'text-[#0B0F19]/35'}
                    `}
                  >
                    {phase.name}
                  </p>
                  <p className="text-[11px] text-[#0B0F19]/45 leading-snug">
                    {phase.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         SINGLE PROMINENT 'NEXT ACTION' CARD
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-7 sm:p-10 lg:p-12 border border-[#0B0F19]/[0.06] shadow-[0_4px_32px_rgba(0,0,0,0.03)] space-y-6 sm:space-y-8">

        {/* Top Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6E8F75]/10 border border-[#6E8F75]/20">
            <span className="w-2 h-2 rounded-full bg-[#6E8F75] animate-ping" />
            <span className="text-xs font-bold text-[#6E8F75] uppercase tracking-wider">
              Immediate Next Step
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#0B0F19]/45">
            <Clock className="w-3.5 h-3.5 text-[#6E8F75]" />
            <span>Estimated Duration: ~30 mins</span>
          </div>
        </div>

        {/* Main Directive & Context */}
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
            Start your AI Technical Interview
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#0B0F19]/60 leading-relaxed">
            Your candidate profile is complete. Participate in an adaptive conversational evaluation in C++ Object-Oriented Design and memory management to generate your initial Skill Graph and qualify for mentor calibration.
          </p>
        </div>

        {/* Assessment Highlights Chips */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/40 block">
            Assessment Focus & Capabilities Evaluated:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'C++20 OOP & Polymorphism',
              'Virtual Tables (vtable) & Memory Layout',
              'RAII & Exception Safety Guarantees',
              'Voice & Text Modes Supported',
            ].map((chip) => (
              <span
                key={chip}
                className="px-3 py-1 rounded-xl bg-white border border-[#0B0F19]/[0.06] text-xs font-semibold text-[#0B0F19]/70 shadow-2xs"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#0B0F19]/[0.05]">
          <Link
            to="/candidates/ai-interview"
            className="
              inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl
              bg-[#6E8F75] text-white text-[15px] font-bold
              hover:bg-[#5d7d64] hover:shadow-[0_8px_24px_rgba(110,143,117,0.3)]
              transition-all duration-200 active:scale-[0.98] shadow-md
            "
          >
            <span>Begin AI Technical Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-xs text-[#0B0F19]/40 leading-tight">
            You can take the assessment whenever you are ready in a quiet room.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         CALM SECONDARY UTILITY (PROFILE CHECK)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="p-5 rounded-3xl bg-white border border-[#0B0F19]/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#0B0F19]/55">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#FAF9F6] flex items-center justify-center text-[#6E8F75]">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>
            Candidate profile 100% complete with 8 verified technical competencies.
          </span>
        </div>

        <Link
          to="/candidates/wizard"
          className="font-bold text-[#6E8F75] hover:text-[#5d7d64] transition-colors"
        >
          Review Profile Details →
        </Link>
      </div>
    </div>
  );
}
