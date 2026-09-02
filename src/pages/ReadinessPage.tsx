/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CANDIDATE CAREER READINESS & COMPETENCY INTELLIGENCE
   ─────────────────────────────────────────────────────────────────────────
   Comprehensive breakdown of candidate verified competencies, system design
   readiness, target market compensation tiers, and personalized roadmap.
   Styled with the canonical Jadeer design system.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import {
  ClipboardCheck,
  TrendingUp,
  Cpu,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  BarChart3,
  BookOpen,
  Award,
  Sparkles,
  Download,
} from 'lucide-react';

interface SkillCompetency {
  name: string;
  category: 'Distributed Systems' | 'Core Engineering' | 'Infrastructure & Cloud' | 'Communication & Defense';
  level: number; // 0 - 100
  status: 'Verified' | 'Calibrating' | 'Needs Practice';
  benchmark: number;
}

export default function ReadinessPage() {
  const { profile } = useUserProfile();
  const { isStudent } = useUserRole();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  const candidateTrack = profile?.track || 'Backend Development';
  const overallReadinessScore = profile?.humanInterview?.overallScore || 92;
  const isCalibrationDone = profile?.humanInterview?.status === 'completed';

  const competencies: SkillCompetency[] = useMemo(
    () => [
      { name: 'Distributed Consensus & Raft Topology', category: 'Distributed Systems', level: 94, status: 'Verified', benchmark: 80 },
      { name: 'Asynchronous Event Streaming (Kafka/RabbitMQ)', category: 'Distributed Systems', level: 90, status: 'Verified', benchmark: 75 },
      { name: 'Linux Socket Multiplexing (epoll)', category: 'Core Engineering', level: 88, status: 'Verified', benchmark: 70 },
      { name: 'Modern C++20 & Go Memory Management', category: 'Core Engineering', level: 92, status: 'Verified', benchmark: 78 },
      { name: 'Database Sharding & Index Strategy', category: 'Infrastructure & Cloud', level: 86, status: 'Verified', benchmark: 72 },
      { name: 'Container Orchestration & Observability', category: 'Infrastructure & Cloud', level: 82, status: 'Calibrating', benchmark: 70 },
      { name: 'Live Architectural Trade-off Defense', category: 'Communication & Defense', level: 95, status: 'Verified', benchmark: 85 },
      { name: 'Structured Code Review & Synthesis', category: 'Communication & Defense', level: 89, status: 'Verified', benchmark: 80 },
    ],
    []
  );

  const filteredCompetencies = useMemo(() => {
    if (filterCategory === 'all') return competencies;
    return competencies.filter((c) => c.category === filterCategory);
  }, [competencies, filterCategory]);

  const handleExportSummary = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 400);
  };

  return (
    <div className="w-full space-y-8 animate-[fade-in_0.3s_ease] pb-16 py-2 sm:py-4">
      {/* ═══════════════════════════════════════════════════════════════
         1. HERO READINESS HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#5E8174]/40" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-semibold border border-[#5E8174]/20">
                <ClipboardCheck className="w-3.5 h-3.5 text-[#5E8174]" />
                <span>Career Intelligence & Readiness</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F8F9FA] text-slate-600 text-xs font-medium border border-slate-200">
                <span>Track:</span>
                <strong className="text-[#0F172A] font-semibold">{candidateTrack}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Engineering Readiness Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
              Synthesizing data from AI challenges, Human Calibration panels, and repository code reviews into verified employer-ready competency telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExportSummary}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8F9FA] hover:bg-white text-slate-700 hover:text-[#0F172A] border border-slate-200 text-xs font-semibold transition-all shadow-2xs cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5 text-[#5E8174]" />
              <span>{isExporting ? 'Generating...' : 'Export Readiness Report'}</span>
            </button>

            <Link
              to="/consultations"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5E8174] hover:bg-[#4d6d62] text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Review with Mentor</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         2. TELEMETRY SCORECARD TILES
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Overall Score */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Readiness Score
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              {overallReadinessScore}%
            </span>
            <span className="text-xs font-semibold text-[#5E8174]">Top 8% Tier</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {isCalibrationDone ? 'Verified through Human Technical Calibration' : 'Preliminary AI evaluation'}
          </p>
        </div>

        {/* Target Seniority */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Target Level
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#0F172A]/5 text-[#0F172A] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-lg font-bold text-[#0F172A]">
              {isStudent ? 'High-Impact Intern' : 'L3 / Junior Software Engineer'}
            </div>
            <p className="text-xs text-[#5E8174] font-medium">Fast-track candidate profile</p>
          </div>
          <p className="text-[11px] text-slate-500">Autonomous distributed systems readiness</p>
        </div>

        {/* Target Market Tier */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Compensation Benchmark
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-lg font-bold text-[#0F172A]">
              {isStudent ? 'SAR 7,000 – 10,000 / mo' : 'SAR 16,000 – 22,000 / mo'}
            </div>
            <p className="text-xs text-slate-500">Saudi & GCC Tech Market Tier-1</p>
          </div>
          <p className="text-[11px] text-slate-500">Based on calibrated telemetry benchmarks</p>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Proof Status
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5E8174]" />
            <span className="text-base font-bold text-[#0F172A]">
              {isCalibrationDone ? 'Calibration Passed' : 'Assessment In-Progress'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {isCalibrationDone ? 'Full rubric available in portfolio' : 'Complete remaining stages to unlock matching'}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         3. COMPETENCY MATRIX WITH CATEGORY FILTERS
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Verified Competency Breakdown</h2>
            <p className="text-xs text-[#334155]">
              Demonstrated proficiency measured against industry hiring manager requirements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8F9FA] rounded-2xl border border-slate-200 self-start">
            {[
              { id: 'all', label: 'All Competencies' },
              { id: 'Distributed Systems', label: 'Distributed Systems' },
              { id: 'Core Engineering', label: 'Core Engineering' },
              { id: 'Infrastructure & Cloud', label: 'Cloud' },
              { id: 'Communication & Defense', label: 'Defense' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-[#5E8174] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Progress List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredCompetencies.map((c) => (
            <div
              key={c.name}
              className="p-5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#0F172A]">{c.name}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5E8174]/10 text-[#5E8174] border border-[#5E8174]/20 shrink-0">
                  {c.status}
                </span>
              </div>

              {/* Progress Track */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Candidate Score: <strong className="text-[#0F172A]">{c.level}%</strong></span>
                  <span>Industry Benchmark: {c.benchmark}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-[#5E8174] transition-all duration-500"
                    style={{ width: `${c.level}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#0F172A]/40"
                    style={{ left: `${c.benchmark}%` }}
                    title={`Benchmark: ${c.benchmark}%`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         4. RECOMMENDED NEXT STEPS ROADMAP
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Actionable 30-Day Growth Roadmap</h3>
            <p className="text-xs text-[#334155]">
              Targeted focus areas to elevate your profile for Tier-1 technology hiring pipelines.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                step: '01',
                title: 'Review System Design Capstone Architecture',
                description: 'Address asynchronous event queue durability trade-offs noted during calibration.',
                status: 'Recommended Focus',
              },
              {
                step: '02',
                title: 'Practice Concurrency & Thread-Pool Defense',
                description: 'Refine articulation of deadlock prevention and epoll non-blocking I/O.',
                status: 'Self-Study Module',
              },
              {
                step: '03',
                title: 'Book a 1-to-1 Technical Consultation',
                description: 'Review portfolio artifacts and career positioning with an active Jadeer mentor.',
                status: 'Mentorship Available',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {item.step}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#0F172A]">{item.title}</h4>
                    <span className="text-[10px] font-semibold text-[#5E8174]">{item.status}</span>
                  </div>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Route Actions */}
        <div className="bg-[#F4F0E8]/60 rounded-3xl p-6 sm:p-8 border border-[#E8E2D5] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5E8174] text-white flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Matching Pipeline Ready</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your verified score is compatible with top engineering employers currently sourcing active talent.
            </p>
          </div>

          <div className="space-y-2">
            <Link
              to={isStudent ? '/student/jobs' : '/candidates/jobs'}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <span>{isStudent ? 'View Internship Matches' : 'View Job Matches'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/candidates/portfolio"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all"
            >
              <span>Inspect Evidence Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
