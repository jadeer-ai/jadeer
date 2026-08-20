import { useState } from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Mail,
  ExternalLink,
  ShieldCheck,
  Check,
  Eye,
  Filter,
  DollarSign,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — JOB MATCHES & APPLICATIONS
   Merit-Based Matching & Real-World Application Tracking
   ═══════════════════════════════════════════════════════════════════════════ */

interface JobMatch {
  id: string;
  role: string;
  company: string;
  companyInitials: string;
  companyBg: string;
  location: string;
  type: string;
  salaryRange: string;
  matchScore: number;
  tags: string[];
  description: string;
  isApplied: boolean;
}

interface ApplicationItem {
  id: string;
  role: string;
  company: string;
  companyInitials: string;
  companyBg: string;
  location: string;
  appliedDate: string;
  status: 'Interview Requested' | 'Shortlisted' | 'Under Review' | 'Applied';
  emailNote?: string;
  lastUpdateNote: string;
}

const initialJobMatches: JobMatch[] = [
  {
    id: 'job-1',
    role: 'Junior C++ Systems Engineer',
    company: 'STC Pay',
    companyInitials: 'SP',
    companyBg: 'bg-[#4f008c]',
    location: 'Riyadh, Saudi Arabia (Hybrid)',
    type: 'Full-time',
    salaryRange: '16,000 – 20,000 SAR / mo',
    matchScore: 96,
    tags: ['C++20', 'Linux epoll', 'gRPC', 'Low Latency'],
    description:
      'Join our core transaction processing team to build ultra-low-latency asynchronous payment switches and microsecond message queues.',
    isApplied: false,
  },
  {
    id: 'job-2',
    role: 'Junior Telemetry & Cloud Platform Engineer',
    company: 'ELM',
    companyInitials: 'EL',
    companyBg: 'bg-[#005a9c]',
    location: 'Riyadh, Saudi Arabia (On-site)',
    type: 'Full-time',
    salaryRange: '15,000 – 18,500 SAR / mo',
    matchScore: 92,
    tags: ['Distributed Systems', 'POSIX Sockets', 'Redis', 'Docker'],
    description:
      'Build scalable real-time telemetry pipelines and automated socket health monitors for nation-scale digital identity platforms.',
    isApplied: false,
  },
  {
    id: 'job-3',
    role: 'Junior Backend Engineer (Distributed Services)',
    company: 'Jahez',
    companyInitials: 'JH',
    companyBg: 'bg-[#d8232a]',
    location: 'Riyadh, Saudi Arabia (Hybrid)',
    type: 'Full-time',
    salaryRange: '14,500 – 18,000 SAR / mo',
    matchScore: 89,
    tags: ['C++', 'Python', 'Redis Sentinel', 'Concurrency'],
    description:
      'Develop high-throughput dispatch algorithms and order tracking stream buffers handling 200,000 requests per minute.',
    isApplied: false,
  },
];

const initialApplications: ApplicationItem[] = [
  {
    id: 'app-1',
    role: 'Junior Systems & Infrastructure Engineer',
    company: 'STC Pay',
    companyInitials: 'SP',
    companyBg: 'bg-[#4f008c]',
    location: 'Riyadh, Saudi Arabia',
    appliedDate: 'Applied 3 days ago',
    status: 'Interview Requested',
    emailNote: 'Details sent to your email',
    lastUpdateNote: 'Hiring Manager Tariq Al-Mansoor requested a 30-min Final Team Alignment.',
  },
  {
    id: 'app-2',
    role: 'Junior High-Throughput Backend Engineer',
    company: 'Tamara',
    companyInitials: 'TM',
    companyBg: 'bg-[#f7941d]',
    location: 'Riyadh, Saudi Arabia',
    appliedDate: 'Applied 5 days ago',
    status: 'Shortlisted',
    lastUpdateNote: 'Lead Systems Architect reviewed Evidence Portfolio & PR #42 benchmarks.',
  },
  {
    id: 'app-3',
    role: 'Junior Infrastructure Engineer',
    company: 'Lean Technologies',
    companyInitials: 'LN',
    companyBg: 'bg-[#121212]',
    location: 'Riyadh, Saudi Arabia (Remote)',
    appliedDate: 'Applied 1 week ago',
    status: 'Under Review',
    lastUpdateNote: 'AI Interview verification score (95%) and Valgrind test suites under evaluation.',
  },
  {
    id: 'app-4',
    role: 'Junior Platform Engineer',
    company: 'Lucid Motors (Saudi Hub)',
    companyInitials: 'LM',
    companyBg: 'bg-[#2d3748]',
    location: 'KAEC, Saudi Arabia',
    appliedDate: 'Applied 2 weeks ago',
    status: 'Applied',
    lastUpdateNote: 'Application submitted with certified Jadeer Evidence Dossier JAD-8492.',
  },
];

export default function JobMatchesPage() {
  const [jobMatches, setJobMatches] = useState<JobMatch[]>(initialJobMatches);
  const [applications, setApplications] = useState<ApplicationItem[]>(initialApplications);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  const handleApply = (job: JobMatch) => {
    setApplyingJobId(job.id);
    setTimeout(() => {
      // Mark as applied in matches
      setJobMatches((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isApplied: true } : j))
      );

      // Add to Applications list
      const newApp: ApplicationItem = {
        id: `app-${Date.now()}`,
        role: job.role,
        company: job.company,
        companyInitials: job.companyInitials,
        companyBg: job.companyBg,
        location: job.location,
        appliedDate: 'Applied Just now',
        status: 'Applied',
        lastUpdateNote: 'Application and verified Evidence Portfolio delivered to hiring portal.',
      };
      setApplications((prev) => [newApp, ...prev]);

      setApplyingJobId(null);
      setAppliedToast(`Applied to ${job.role} at ${job.company} with your verified portfolio!`);
      setTimeout(() => setAppliedToast(null), 4000);
    }, 900);
  };

  const getStatusBadge = (status: ApplicationItem['status']) => {
    switch (status) {
      case 'Interview Requested':
        return 'bg-[#6E8F75] text-white font-bold shadow-[0_2px_8px_rgba(110,143,117,0.25)]';
      case 'Shortlisted':
        return 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 font-semibold border border-amber-200';
      case 'Applied':
      default:
        return 'bg-[#FAF9F6] text-[#0B0F19]/60 font-semibold border border-[#0B0F19]/[0.08]';
    }
  };

  return (
    <div className="space-y-10 animate-[fade-in_0.4s_ease] pb-14">

      {/* ═══════════════════════════════════════════════════════════════
         PAGE HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-xs font-bold border border-[#6E8F75]/20">
                <Sparkles className="w-3.5 h-3.5" />
                Merit-Based Matching
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#0B0F19]/[0.04] text-[#0B0F19]/60">
                Verified Candidate ID: JAD-8492
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
              Job Matches & Applications
            </h1>
            <p className="text-[14.5px] text-[#0B0F19]/55 max-w-3xl leading-relaxed">
              Explore job opportunities matched specifically to your verified C++ systems competencies, mentor feedback, and PR deliverables. Apply directly with your tamper-proof Evidence Portfolio.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] text-center min-w-[110px]">
              <p className="text-2xl font-extrabold text-[#6E8F75]">
                {jobMatches.filter((j) => !j.isApplied).length}
              </p>
              <p className="text-[11px] font-semibold text-[#0B0F19]/40 uppercase tracking-wider">
                New Matches
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] text-center min-w-[110px]">
              <p className="text-2xl font-extrabold text-[#0B0F19]">
                {applications.length}
              </p>
              <p className="text-[11px] font-semibold text-[#0B0F19]/40 uppercase tracking-wider">
                Active Apps
              </p>
            </div>
          </div>
        </div>

        {/* Instant Applied Notification Toast */}
        {appliedToast && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#ecfdf5] border border-emerald-200 text-xs text-[#065f46] font-semibold flex items-center justify-between animate-[slide-up_0.3s_var(--ease-spring)]">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              {appliedToast}
            </span>
            <span className="text-[11px] text-[#059669] font-mono">Dossier Attached</span>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         SECTION 1: RECOMMENDED MATCHES
         ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0B0F19] tracking-tight">
                Recommended Matches
              </h2>
              <p className="text-xs text-[#0B0F19]/45">
                Roles tailored to your demonstrated C++ OOP and concurrency benchmarks
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-3 py-1 rounded-full">
            Ranked by Skill Match
          </span>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {jobMatches.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4 hover:border-[#6E8F75]/30 hover:shadow-md transition-all group"
            >
              <div className="space-y-3.5">
                {/* Header: Company Logo & Match Score Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl ${job.companyBg} text-white flex items-center justify-center font-extrabold text-sm shadow-sm`}
                    >
                      {job.companyInitials}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0B0F19]">{job.company}</h3>
                      <span className="text-[11px] text-[#0B0F19]/40">{job.location}</span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] border border-[#6E8F75]/20">
                    {job.matchScore}% Match
                  </span>
                </div>

                {/* Role Title & Description */}
                <div>
                  <h4 className="text-[16px] font-bold text-[#0B0F19] group-hover:text-[#6E8F75] transition-colors leading-snug">
                    {job.role}
                  </h4>
                  <p className="text-[12.5px] text-[#0B0F19]/60 leading-relaxed mt-1 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                {/* Salary & Type */}
                <div className="flex items-center justify-between text-xs text-[#0B0F19]/70 pt-2 border-t border-[#0B0F19]/[0.04]">
                  <span className="font-semibold">{job.salaryRange}</span>
                  <span className="text-[#0B0F19]/40 font-medium">{job.type}</span>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-[#0B0F19]/60 bg-[#FAF9F6] border border-[#0B0F19]/[0.04] px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action: Prominent Sage Green Apply Button */}
              <div className="pt-3 border-t border-[#0B0F19]/[0.04]">
                {!job.isApplied ? (
                  <button
                    onClick={() => handleApply(job)}
                    disabled={applyingJobId === job.id}
                    className="
                      w-full py-3 rounded-2xl bg-[#6E8F75] text-white text-xs font-bold
                      hover:bg-[#5d7d64] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)]
                      transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm
                    "
                  >
                    {applyingJobId === job.id ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Submitting Portfolio...
                      </span>
                    ) : (
                      <>
                        <span>Apply with Portfolio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-2xl bg-[#ecfdf5] text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Applied & Dossier Sent</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         SECTION 2: APPLICATION TRACKER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#0B0F19]/[0.05] text-[#0B0F19] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-[#6E8F75]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0B0F19] tracking-tight">
                Application Tracker
              </h2>
              <p className="text-xs text-[#0B0F19]/45">
                Real-time tracking of employer reviews, portfolio views, and interview invites
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-[#0B0F19]/60 bg-white border border-[#0B0F19]/[0.08] px-3 py-1 rounded-full">
            {applications.length} Active Applications
          </span>
        </div>

        {/* Applications List */}
        <div className="space-y-3.5">
          {applications.map((app) => {
            const isInterviewRequested = app.status === 'Interview Requested';

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:border-[#6E8F75]/30 transition-all"
              >
                {/* Left: Role, Company & Last Update */}
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-2xl ${app.companyBg} text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0`}
                  >
                    {app.companyInitials}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15.5px] font-bold text-[#0B0F19]">
                        {app.role}
                      </h3>
                      <span className="text-xs font-semibold text-[#0B0F19]/40">•</span>
                      <span className="text-xs font-bold text-[#0B0F19]/70">{app.company}</span>
                    </div>

                    <p className="text-xs text-[#0B0F19]/50">
                      {app.location} • {app.appliedDate}
                    </p>

                    <p className="text-[13px] text-[#0B0F19]/75 pt-1 leading-snug">
                      <strong className="text-[#0B0F19]/90 font-semibold">Latest Update:</strong> {app.lastUpdateNote}
                    </p>
                  </div>
                </div>

                {/* Right: Status Badge & Smart Email Note */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#0B0F19]/[0.05]">
                  {/* Status Badge */}
                  <span
                    className={`
                      inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs
                      ${getStatusBadge(app.status)}
                    `}
                  >
                    {isInterviewRequested && <Sparkles className="w-3.5 h-3.5" />}
                    <span>{app.status}</span>
                  </span>

                  {/* Smart UI Note: Details Sent to Email (For Interview Requested) */}
                  {isInterviewRequested && app.emailNote && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#6E8F75]/10 border border-[#6E8F75]/20 text-[11.5px] font-bold text-[#6E8F75] animate-[slide-up_0.2s_ease]">
                      <Mail className="w-3.5 h-3.5 text-[#6E8F75]" />
                      <span>{app.emailNote}</span>
                    </div>
                  )}

                  {!isInterviewRequested && (
                    <span className="text-[11px] text-[#0B0F19]/40 flex items-center gap-1">
                      <FileCheck2 className="w-3 h-3 text-[#6E8F75]" />
                      Portfolio Attached
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
