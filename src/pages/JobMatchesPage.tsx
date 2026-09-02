import { useState } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Mail,
  Check,
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
  targetAudience: 'student' | 'grad' | 'all';
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
    targetAudience: 'grad',
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
    targetAudience: 'grad',
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
    targetAudience: 'grad',
    tags: ['C++', 'Python', 'Redis Sentinel', 'Concurrency'],
    description:
      'Develop high-throughput dispatch algorithms and order tracking stream buffers handling 200,000 requests per minute.',
    isApplied: false,
  },
  {
    id: 'job-4',
    role: 'Software Engineering Co-op / Intern',
    company: 'Tamara',
    companyInitials: 'TM',
    companyBg: 'bg-[#f7941d]',
    location: 'Riyadh, Saudi Arabia (Hybrid)',
    type: 'Internship / Co-op',
    salaryRange: '8,000 – 10,000 SAR / mo',
    matchScore: 98,
    targetAudience: 'student',
    tags: ['TypeScript', 'Node.js', 'PostgreSQL', 'Microservices'],
    description:
      'Hands-on university co-op engineering placement building merchant settlement services alongside senior staff architects.',
    isApplied: false,
  },
  {
    id: 'job-5',
    role: 'Cloud Infrastructure & DevOps Intern',
    company: 'Thiqah',
    companyInitials: 'TH',
    companyBg: 'bg-[#0e7490]',
    location: 'Riyadh, Saudi Arabia (On-site)',
    type: 'Summer Internship',
    salaryRange: '7,500 – 9,500 SAR / mo',
    matchScore: 94,
    targetAudience: 'student',
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD Pipelines'],
    description:
      'Collaborate with the platform team on infrastructure as code, automated container rollouts, and multi-region deployment monitoring.',
    isApplied: false,
  },
  {
    id: 'job-6',
    role: 'Frontend Developer — Design Systems',
    company: 'Lucidya',
    companyInitials: 'LC',
    companyBg: 'bg-[#0f172a]',
    location: 'Remote (Saudi Arabia)',
    type: 'Full-time / Co-op',
    salaryRange: '14,000 – 18,000 SAR / mo',
    matchScore: 91,
    targetAudience: 'all',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
    description:
      'Build reusable UI primitives, accessibility audits, and performant analytics data visualization dashboards.',
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
    lastUpdateNote: 'Hiring Lead Tariq Al-Mansoor requested a 30-min Final Team Alignment.',
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
  const { profile: userProfile, addJobApplication } = useUserProfile();
  const { isStudent } = useUserRole();
  const [jobMatches, setJobMatches] = useState<JobMatch[]>(initialJobMatches);
  const [localApplications, setLocalApplications] = useState<ApplicationItem[]>(initialApplications);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  const normalizedRole: 'student' | 'grad' = isStudent || userProfile.role === 'student' ? 'student' : 'grad';
  const isStudentRole = normalizedRole === 'student';

  // Filter job matches based on targetAudience ('all' or matching candidate role)
  const displayedJobMatches = jobMatches.filter(
    (job) => job.targetAudience === 'all' || job.targetAudience === normalizedRole
  );

  // Merge userProfile.applications with initialApplications
  const combinedApplications: ApplicationItem[] = [
    ...(userProfile.applications || []).map((app) => ({
      id: app.id,
      role: app.jobTitle,
      company: app.companyName,
      companyInitials: app.companyName
        .split(' ')
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'JP',
      companyBg: 'bg-[#5E8174]',
      location: 'Riyadh, Saudi Arabia (Hybrid)',
      appliedDate: `Applied ${app.appliedDate}`,
      status: (app.status === 'Interview Scheduled' ? 'Interview Requested' : app.status === 'Technical Screening' ? 'Shortlisted' : 'Under Review') as ApplicationItem['status'],
      emailNote: app.status === 'Interview Scheduled' ? 'Details sent to your email' : undefined,
      lastUpdateNote: `Match Rating ${app.matchScore}% • Verified dossier JAD-8492 submitted to hiring portal.`,
    })),
    ...localApplications,
  ];

  const handleApply = (job: JobMatch) => {
    setApplyingJobId(job.id);
    setTimeout(() => {
      // Mark as applied in matches
      setJobMatches((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isApplied: true } : j))
      );

      // Persist to userProfile context and localStorage
      addJobApplication({
        jobId: job.id,
        jobTitle: job.role,
        companyName: job.company,
        status: 'Under Review',
        matchScore: job.matchScore,
      });

      // Add to local state
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
      setLocalApplications((prev) => [newApp, ...prev]);

      setApplyingJobId(null);
      setAppliedToast(`Applied to ${job.role} at ${job.company} with your verified portfolio!`);
      setTimeout(() => setAppliedToast(null), 4000);
    }, 900);
  };

  const getStatusBadge = (status: ApplicationItem['status']) => {
    switch (status) {
      case 'Interview Requested':
        return 'bg-[#5E8174] text-white font-bold shadow-2xs';
      case 'Shortlisted':
        return 'bg-[#5E8174]/10 text-[#5E8174] font-bold border border-[#5E8174]/20';
      case 'Under Review':
        return 'bg-[#F4F0E8] text-[#334155] font-semibold border border-[#E8E2D5]';
      case 'Applied':
      default:
        return 'bg-[#F8F9FA] text-slate-500 font-semibold border border-slate-200';
    }
  };

  const getAudiencePill = (targetAudience: JobMatch['targetAudience']) => {
    switch (targetAudience) {
      case 'student':
        return { label: '🎓 Student / Co-op', color: 'bg-[#5E8174]/10 text-[#5E8174] border-[#5E8174]/30' };
      case 'grad':
        return { label: '⚡ Graduate / Full-time', color: 'bg-[#0F172A]/5 text-[#0F172A] border-slate-300' };
      default:
        return { label: 'Open to All', color: 'bg-[#F8F9FA] text-[#334155] border-slate-200' };
    }
  };

  return (
    <div className="space-y-10 animate-[fade-in_0.4s_ease] pb-14 text-[#0F172A]">

      {/* ═══════════════════════════════════════════════════════════════
         PAGE HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-semibold border border-[#5E8174]/20">
                <Sparkles className="w-3.5 h-3.5" />
                Merit-Based Matching
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#F8F9FA] text-[#334155] border border-slate-200/60">
                Verified Candidate ID: JAD-8492
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F4F0E8]/80 border border-[#E8E2D5] text-[#334155]">
                Audience: {isStudentRole ? '🎓 Students (Internships & Co-ops)' : '⚡ Graduates (Full-Time)'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              {isStudentRole ? 'Internship Matches & Applications' : 'Job Matches & Applications'}
            </h1>
            <p className="text-[14.5px] text-[#334155] max-w-3xl leading-relaxed">
              {isStudentRole
                ? 'Explore top-tier university internships, research fellowships, and co-op placements tailored to your verified technical benchmarks.'
                : 'Explore full-time engineering roles matched specifically to your verified backend systems competencies, mentor feedback, and PR deliverables.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-[#F4F0E8]/80 border border-[#E8E2D5] text-center min-w-[110px] shadow-2xs">
              <p className="text-2xl font-bold text-[#5E8174]">
                {displayedJobMatches.filter((j) => !j.isApplied).length}
              </p>
              <p className="text-[11px] font-semibold text-[#334155]/70 uppercase tracking-wider">
                {isStudentRole ? 'Matching Internships' : 'Matching Roles'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 text-center min-w-[110px] shadow-2xs">
              <p className="text-2xl font-bold text-[#0F172A]">
                {combinedApplications.length}
              </p>
              <p className="text-[11px] font-semibold text-[#334155]/70 uppercase tracking-wider">
                Active Apps
              </p>
            </div>
          </div>
        </div>

        {/* Instant Applied Notification Toast */}
        {appliedToast && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#5E8174]/10 border border-[#5E8174]/30 text-xs text-[#5E8174] font-semibold flex items-center justify-between animate-[slide-up_0.3s_ease]">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5E8174]" />
              {appliedToast}
            </span>
            <span className="text-[11px] text-[#5E8174] font-mono">Dossier Attached</span>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         SECTION 1: RECOMMENDED MATCHES
         ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
                {isStudentRole ? 'Recommended Internships' : 'Recommended Matches'} ({displayedJobMatches.length})
              </h2>
              <p className="text-xs text-[#334155]">
                {isStudentRole
                  ? 'Showing student internships and university co-op opportunities'
                  : 'Showing graduate full-time engineering hiring tracks'}
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#5E8174] bg-[#5E8174]/10 border border-[#5E8174]/20 px-3 py-1 rounded-full">
            Ranked by Skill Match
          </span>
        </div>

        {/* Empty State Guard */}
        {displayedJobMatches.length === 0 && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              {isStudentRole ? 'No Active Internships Found' : 'No Active Job Matches Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isStudentRole
                ? 'We are continuously syncing new cooperative training positions from verified Saudi partner companies. Check back soon or calibrate your profile.'
                : 'We are expanding full-time technology tracks. Complete remaining evidence stages to unlock more verified hiring manager pipelines.'}
            </p>
          </div>
        )}

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayedJobMatches.map((job) => {
            const audienceInfo = getAudiencePill(job.targetAudience);

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-4 hover:border-[#5E8174]/40 hover:shadow-md transition-all group"
              >
                <div className="space-y-3.5">
                  {/* Header: Company Logo & Match Score Pill */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl ${job.companyBg} text-white flex items-center justify-center font-bold text-sm shadow-2xs`}
                      >
                        {job.companyInitials}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0F172A]">{job.company}</h3>
                        <span className="text-[11px] text-slate-500">{job.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] border border-[#5E8174]/20">
                        {job.matchScore}% Match
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${audienceInfo.color}`}>
                        {audienceInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Role Title & Description */}
                  <div>
                    <h4 className="text-[16px] font-bold text-[#0F172A] group-hover:text-[#5E8174] transition-colors leading-snug">
                      {job.role}
                    </h4>
                    <p className="text-[12.5px] text-[#334155] leading-relaxed mt-1 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  {/* Salary & Type */}
                  <div className="flex items-center justify-between text-xs text-[#334155] font-medium pt-2 border-t border-slate-100">
                    <span className="font-semibold text-[#0F172A]">{job.salaryRange}</span>
                    <span className="text-slate-500">{job.type}</span>
                  </div>

                  {/* Skill Tags (Warm Beige Surface) */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-[#334155] bg-[#F4F0E8]/70 border border-[#E8E2D5] px-2.5 py-1 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action: Prominent Sage Green Apply Button */}
                <div className="pt-3 border-t border-slate-100">
                  {!job.isApplied ? (
                    <button
                      onClick={() => handleApply(job)}
                      disabled={applyingJobId === job.id}
                      className="
                        w-full py-3 rounded-2xl bg-[#5E8174] text-white text-xs font-bold
                        hover:bg-[#4D6D62]
                        transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-2xs
                      "
                    >
                      {applyingJobId === job.id ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Submitting Portfolio...
                        </span>
                      ) : (
                        <>
                          <span>{isStudentRole ? 'Apply for Internship' : 'Apply with Portfolio'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="w-full py-2.5 rounded-2xl bg-[#5E8174]/10 text-[#5E8174] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#5E8174]/20">
                      <Check className="w-3.5 h-3.5 text-[#5E8174]" />
                      <span>{isStudentRole ? 'Application Submitted' : 'Applied & Dossier Sent'}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         SECTION 2: APPLICATION TRACKER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-[#5E8174]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
                Application Tracker
              </h2>
              <p className="text-xs text-[#334155]">
                Real-time tracking of employer reviews, portfolio views, and interview invites
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#334155] bg-[#F8F9FA] border border-slate-200/80 px-3 py-1 rounded-full">
            {combinedApplications.length} Active Applications
          </span>
        </div>

        {/* Empty Applications Guard */}
        {combinedApplications.length === 0 && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileCheck2 className="w-6 h-6 text-[#5E8174]" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">No Applications Submitted Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              When you apply to recommended roles or cooperative internships, your verified Evidence Portfolio and status updates will appear here.
            </p>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-3.5">
          {combinedApplications.map((app) => {
            const isInterviewRequested = app.status === 'Interview Requested';

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:border-[#5E8174]/40 transition-all"
              >
                {/* Left: Role, Company & Last Update */}
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-2xl ${app.companyBg} text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0`}
                  >
                    {app.companyInitials}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15.5px] font-bold text-[#0F172A]">
                        {app.role}
                      </h3>
                      <span className="text-xs font-semibold text-slate-300">•</span>
                      <span className="text-xs font-semibold text-[#334155]">{app.company}</span>
                    </div>

                    <p className="text-xs text-slate-500">
                      {app.location} • {app.appliedDate}
                    </p>

                    <p className="text-[13px] text-[#334155] pt-1 leading-snug">
                      <strong className="text-[#0F172A] font-semibold">Latest Update:</strong> {app.lastUpdateNote}
                    </p>
                  </div>
                </div>

                {/* Right: Status Badge & Smart Email Note */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
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
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#5E8174]/10 border border-[#5E8174]/20 text-[11.5px] font-semibold text-[#5E8174] animate-[slide-up_0.2s_ease]">
                      <Mail className="w-3.5 h-3.5 text-[#5E8174]" />
                      <span>{app.emailNote}</span>
                    </div>
                  )}

                  {!isInterviewRequested && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <FileCheck2 className="w-3 h-3 text-[#5E8174]" />
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
