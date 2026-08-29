import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { useInterviewSchedule } from '@/contexts/InterviewScheduleContext';
import {
  ClipboardList,
  FilePlus2,
  Users,
  User,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  PauseCircle,
  PlayCircle,
  XCircle,
  Edit3,
  Eye,
  MoreVertical,
  Code2,
  MapPin,
  Laptop,
  Building2,
  Home,
  Sparkles,
  ArrowRight,
  ChevronDown,
  X,
  Share2,
  Copy,
  Check,
  Bot,
  UserCheck,
  Calendar,
  Video,
  ShieldCheck,
  AlertCircle,
  Trash2,
  ExternalLink,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — EMPLOYER ACTIVE LISTINGS PAGE
   Comprehensive management for software engineering job postings,
   applicant telemetry, and instant pipeline actions.
   Signature Brand Identity: Clean Cream (#FAF9F6), Sage Green (#6E8F75),
   and Deep Navy (#0B0F19)
   ═══════════════════════════════════════════════════════════════════════════ */

export type ListingStatus = 'Active' | 'Draft' | 'Paused' | 'Closed';
export type SeniorityLevel = 'Intern' | 'Junior' | 'Mid-Level';

export interface Applicant {
  id: string;
  name: string;
  initials: string;
  role: string;
  matchScore: number;
  stage: 'AI Interview' | 'Mentor Calibration' | 'Applied' | 'Shortlisted' | 'Interview Scheduled';
  aiScore: number;
  appliedDate: string;
  avatarBg?: string;
}

export interface JobListing {
  id: string;
  title: string;
  track: string;
  seniority: SeniorityLevel;
  employmentType: string;
  locationType: 'on-site' | 'hybrid' | 'remote';
  location: string;
  status: ListingStatus;
  applicantsCount: number;
  avgMatchScore: number;
  aiScreenedCount: number;
  postedDate: string;
  daysActive: number;
  skills: string[];
  description: string;
  applicants: Applicant[];
}

/* ── Initial Mock Job Postings Data ────────────────────────────────────── */

const initialListings: JobListing[] = [
  {
    id: 'job-101',
    title: 'Junior Backend Engineer (Go / PostgreSQL)',
    track: 'Backend Development',
    seniority: 'Junior',
    employmentType: 'Full-time',
    locationType: 'hybrid',
    location: 'Riyadh, Saudi Arabia',
    status: 'Active',
    applicantsCount: 23,
    avgMatchScore: 94,
    aiScreenedCount: 19,
    postedDate: '2026-08-22',
    daysActive: 5,
    skills: ['Go', 'PostgreSQL', 'Docker', 'REST API', 'Redis'],
    description: 'Build high-performance microservices, optimize SQL queries, and implement resilient event-driven pipelines.',
    applicants: [
      { id: 'app-1', name: 'Ahmed Hassan', initials: 'AH', role: 'Junior Backend Engineer', matchScore: 96, stage: 'AI Interview', aiScore: 95, appliedDate: '2026-08-23' },
      { id: 'app-2', name: 'Mohammed Khalid', initials: 'MK', role: 'Junior Backend Engineer', matchScore: 89, stage: 'Applied', aiScore: 88, appliedDate: '2026-08-24' },
      { id: 'app-3', name: 'Fahad Al-Subaie', initials: 'FS', role: 'Junior Backend Engineer', matchScore: 87, stage: 'Shortlisted', aiScore: 91, appliedDate: '2026-08-25' },
    ],
  },
  {
    id: 'job-102',
    title: 'Mid-Level Full-Stack Engineer (React & Node.js)',
    track: 'Full-Stack Engineering',
    seniority: 'Mid-Level',
    employmentType: 'Full-time',
    locationType: 'remote',
    location: 'Remote (Saudi Arabia)',
    status: 'Active',
    applicantsCount: 18,
    avgMatchScore: 91,
    aiScreenedCount: 15,
    postedDate: '2026-08-19',
    daysActive: 8,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    description: 'Lead feature delivery across React client components, Node.js GraphQL services, and AWS serverless infrastructure.',
    applicants: [
      { id: 'app-4', name: 'Sara Fahad', initials: 'SF', role: 'Full-Stack Engineer', matchScore: 92, stage: 'Mentor Calibration', aiScore: 94, appliedDate: '2026-08-20' },
      { id: 'app-5', name: 'Yousef Mansoor', initials: 'YM', role: 'Full-Stack Engineer', matchScore: 88, stage: 'Shortlisted', aiScore: 86, appliedDate: '2026-08-21' },
    ],
  },
  {
    id: 'job-103',
    title: 'Embedded Systems & IoT Firmware Intern',
    track: 'Embedded Systems & IoT',
    seniority: 'Intern',
    employmentType: 'Internship',
    locationType: 'on-site',
    location: 'Dammam, Saudi Arabia',
    status: 'Active',
    applicantsCount: 14,
    avgMatchScore: 92,
    aiScreenedCount: 12,
    postedDate: '2026-08-24',
    daysActive: 3,
    skills: ['C++', 'C', 'RTOS', 'Microcontrollers', 'Git'],
    description: 'Work closely with senior firmware engineers on low-latency microcontrollers, serial communication protocols, and hardware debugging.',
    applicants: [
      { id: 'app-6', name: 'Rayan Al-Ghamdi', initials: 'RG', role: 'Embedded Systems Intern', matchScore: 93, stage: 'AI Interview', aiScore: 90, appliedDate: '2026-08-25' },
    ],
  },
  {
    id: 'job-104',
    title: 'Junior DevOps & Cloud Infrastructure Specialist',
    track: 'DevOps & Cloud Infrastructure',
    seniority: 'Junior',
    employmentType: 'Full-time',
    locationType: 'hybrid',
    location: 'Riyadh, Saudi Arabia',
    status: 'Draft',
    applicantsCount: 0,
    avgMatchScore: 0,
    aiScreenedCount: 0,
    postedDate: '2026-08-27',
    daysActive: 0,
    skills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux'],
    description: 'Automate build/release pipelines, manage Kubernetes clusters on AWS/GCP, and enhance system observability.',
    applicants: [],
  },
  {
    id: 'job-105',
    title: 'Mid-Level Data Engineer (Spark & Kafka)',
    track: 'Data Engineering & Analytics',
    seniority: 'Mid-Level',
    employmentType: 'Full-time',
    locationType: 'remote',
    location: 'Remote',
    status: 'Paused',
    applicantsCount: 9,
    avgMatchScore: 88,
    aiScreenedCount: 8,
    postedDate: '2026-08-10',
    daysActive: 17,
    skills: ['Python', 'Apache Spark', 'Kafka', 'SQL', 'Snowflake'],
    description: 'Construct real-time streaming architectures, batch ETL pipelines, and high-throughput data warehouse models.',
    applicants: [
      { id: 'app-7', name: 'Nora Rashid', initials: 'NR', role: 'Data Engineer', matchScore: 88, stage: 'Shortlisted', aiScore: 87, appliedDate: '2026-08-12' },
    ],
  },
];

const availableTracks = [
  'All Tracks',
  'Backend Development',
  'Frontend Development',
  'Full-Stack Engineering',
  'Embedded Systems & IoT',
  'Mobile Development (iOS / Android / Flutter)',
  'DevOps & Cloud Infrastructure',
  'Data Engineering & Analytics',
  'AI / Machine Learning Engineering',
  'Cybersecurity & Systems',
];

const seniorityList: SeniorityLevel[] = ['Intern', 'Junior', 'Mid-Level'];

export default function EmployerListingsPage() {
  const { companyProfile } = useCompanyProfile();
  const { scheduleInterview } = useInterviewSchedule();

  const [listings, setListings] = useState<JobListing[]>(initialListings);
  const [selectedStatusTab, setSelectedStatusTab] = useState<'All' | 'Active' | 'Draft' | 'Paused'>('All');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState('All Tracks');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [viewingApplicantsJob, setViewingApplicantsJob] = useState<JobListing | null>(null);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [copiedLinkJobId, setCopiedLinkJobId] = useState<string | null>(null);
  const [scheduledCandidateId, setScheduledCandidateId] = useState<string | null>(null);

  /* ── Filter Logic ──────────────────────────────────────────────────── */

  const filteredListings = listings.filter((job) => {
    // Status Tab Filter
    if (selectedStatusTab === 'Active' && job.status !== 'Active') return false;
    if (selectedStatusTab === 'Draft' && job.status !== 'Draft') return false;
    if (selectedStatusTab === 'Paused' && (job.status !== 'Paused' && job.status !== 'Closed')) return false;

    // Track Filter
    if (selectedTrackFilter !== 'All Tracks' && job.track !== selectedTrackFilter) return false;

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchTrack = job.track.toLowerCase().includes(q);
      const matchSkill = job.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchTrack && !matchSkill) return false;
    }

    return true;
  });

  /* ── Actions ───────────────────────────────────────────────────────── */

  const toggleListingStatus = (jobId: string) => {
    setListings((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const nextStatus: ListingStatus = j.status === 'Active' ? 'Paused' : 'Active';
          return { ...j, status: nextStatus };
        }
        return j;
      })
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    setListings((prev) =>
      prev.map((j) => (j.id === editingJob.id ? editingJob : j))
    );
    setEditingJob(null);
  };

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to remove this job listing?')) {
      setListings((prev) => prev.filter((j) => j.id !== jobId));
      if (viewingApplicantsJob?.id === jobId) setViewingApplicantsJob(null);
      if (editingJob?.id === jobId) setEditingJob(null);
    }
  };

  const handleCopyJobLink = (job: JobListing) => {
    navigator.clipboard.writeText(`https://jadeer.io/jobs/${job.id}`);
    setCopiedLinkJobId(job.id);
    setTimeout(() => setCopiedLinkJobId(null), 2000);
  };

  const handleQuickScheduleApplicant = (applicant: Applicant, job: JobListing) => {
    scheduleInterview({
      candidateId: 'JAD-8492',
      candidateName: applicant.name,
      candidateInitials: applicant.initials,
      role: job.title,
      company: companyProfile.companyName || 'Jadeer Inc.',
      date: '2026-09-02',
      timeSlot: '02:00 PM',
      timezone: 'Asia/Riyadh (GMT+3)',
      meetingLink: `https://meet.jadeer.io/interview-${applicant.id}`,
      type: 'human',
      scheduledBy: 'employer',
      notes: `Scheduled via Active Listings pipeline for ${job.title}`,
    });

    setScheduledCandidateId(applicant.id);
    setTimeout(() => setScheduledCandidateId(null), 2500);
  };

  // KPIs
  const activeCount = listings.filter((j) => j.status === 'Active').length;
  const totalApplicants = listings.reduce((sum, j) => sum + j.applicantsCount, 0);
  const avgQualityScore = Math.round(
    listings.filter((j) => j.avgMatchScore > 0).reduce((sum, j) => sum + j.avgMatchScore, 0) /
      (listings.filter((j) => j.avgMatchScore > 0).length || 1)
  );

  return (
    <div className="space-y-8 pb-10 animate-[fade-in_0.3s_ease]">

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#6E8F75] text-white flex items-center justify-center shadow-lg shadow-[#6E8F75]/25">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E8F75] bg-[#6E8F75]/10 border border-[#6E8F75]/20 px-2.5 py-0.5 rounded-full">
              Hiring Pipeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
            Active Job <span className="text-[#6E8F75]">Listings</span>
          </h1>
          <p className="mt-1 text-[14px] text-[#0B0F19]/50 font-medium max-w-xl">
            Manage your engineering openings, view pre-screened candidate telemetry, and coordinate interview calendars.
          </p>
        </div>

        <Link
          to="/employer/post-job"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-[13px] font-bold shadow-[0_4px_16px_rgba(110,143,117,0.25)] hover:bg-[#5d7d64] hover:shadow-[0_6px_24px_rgba(110,143,117,0.35)] hover:translate-y-[-1px] transition-all duration-200"
        >
          <FilePlus2 className="w-4 h-4" />
          Post a New Job
          <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ── KPI Overview Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0B0F19]/50">Active Openings</span>
            <span className="w-8 h-8 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#0B0F19] tracking-tight">{activeCount}</p>
          <p className="mt-1 text-xs text-[#6E8F75] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Ready for matching
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0B0F19]/50">Total Applicants</span>
            <span className="w-8 h-8 rounded-xl bg-student-50 text-student-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#0B0F19] tracking-tight">{totalApplicants}</p>
          <p className="mt-1 text-xs text-student-600 font-semibold">
            Across {listings.length} total listings
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0B0F19]/50">Avg Match Telemetry</span>
            <span className="w-8 h-8 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-[#0B0F19] tracking-tight">{avgQualityScore}%</p>
          <p className="mt-1 text-xs text-[#6E8F75] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> High capability threshold
          </p>
        </div>
      </div>

      {/* ── Filters & Search Bar ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#0B0F19]/[0.04]">
          {(['All', 'Active', 'Draft', 'Paused'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatusTab(tab)}
              className={`
                px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                ${selectedStatusTab === tab
                  ? 'bg-white text-[#0B0F19] shadow-xs border border-[#0B0F19]/[0.06]'
                  : 'text-[#0B0F19]/50 hover:text-[#0B0F19]'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Track Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Track Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedTrackFilter}
              onChange={(e) => setSelectedTrackFilter(e.target.value)}
              className="w-full sm:w-56 px-3.5 py-2 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-xs font-semibold text-[#0B0F19] focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all"
            >
              {availableTracks.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, skill…"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all placeholder:text-[#0B0F19]/30"
            />
          </div>
        </div>
      </div>

      {/* ── Listings Feed ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#0B0F19]/[0.06] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center mx-auto">
              <ClipboardList className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#0B0F19]">No Job Listings Found</h3>
            <p className="text-xs sm:text-sm text-[#0B0F19]/50 max-w-sm mx-auto">
              No postings match your current filter criteria. Try adjusting your search query or post a new job.
            </p>
            <Link
              to="/employer/post-job"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold shadow-md hover:bg-[#5d7d64] transition-all"
            >
              <FilePlus2 className="w-4 h-4" /> Post a New Role
            </Link>
          </div>
        ) : (
          filteredListings.map((job) => {
            const isStatusActive = job.status === 'Active';
            const isStatusDraft = job.status === 'Draft';
            const isStatusPaused = job.status === 'Paused' || job.status === 'Closed';

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-6 hover:border-[#6E8F75]/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-200 space-y-5"
              >
                {/* Top Row: Title, Badges, Status, and Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Live Status Badge */}
                      <span
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border
                          ${isStatusActive ? 'bg-success-50 text-success-700 border-success-200' : ''}
                          ${isStatusDraft ? 'bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]' : ''}
                          ${isStatusPaused ? 'bg-warning-50 text-warning-700 border-warning-200' : ''}
                        `}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isStatusActive ? 'bg-success-600 animate-pulse' : isStatusPaused ? 'bg-warning-600' : 'bg-gray-400'
                          }`}
                        />
                        {job.status}
                      </span>

                      {/* Track Tag */}
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-xs font-bold border border-[#6E8F75]/20">
                        <Code2 className="w-3.5 h-3.5" />
                        {job.track}
                      </span>

                      {/* Seniority Level */}
                      <span className="px-2.5 py-1 rounded-full bg-[#0B0F19]/[0.04] text-[#0B0F19]/70 text-xs font-bold">
                        {job.seniority}
                      </span>

                      {/* Workplace Model */}
                      <span className="capitalize px-2.5 py-1 rounded-full bg-[#0B0F19]/[0.04] text-[#0B0F19]/60 text-xs font-medium">
                        {job.locationType}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-extrabold text-[#0B0F19] tracking-tight">
                      {job.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#0B0F19]/50 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#6E8F75]" /> {job.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Posted {job.postedDate} ({job.daysActive}d active)
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Metrics Pill Box */}
                  <div className="flex items-center gap-3 bg-[#FAF9F6] p-3 rounded-2xl border border-[#0B0F19]/[0.04] shrink-0">
                    {/* Applicants Counter */}
                    <button
                      onClick={() => setViewingApplicantsJob(job)}
                      className="px-3.5 py-2 text-left hover:bg-white rounded-xl transition-colors"
                    >
                      <p className="text-[11px] font-bold text-[#0B0F19]/40 uppercase tracking-wider">Applicants</p>
                      <p className="text-xl font-extrabold text-[#0B0F19] flex items-center gap-1.5 mt-0.5">
                        <Users className="w-4 h-4 text-[#6E8F75]" />
                        {job.applicantsCount}
                      </p>
                    </button>

                    <div className="h-8 w-px bg-[#0B0F19]/[0.08]" />

                    {/* Avg Match Telemetry Score */}
                    <div className="px-3.5 py-2 text-left">
                      <p className="text-[11px] font-bold text-[#0B0F19]/40 uppercase tracking-wider">Avg Match</p>
                      <p className="text-xl font-extrabold text-[#6E8F75] flex items-center gap-1 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                        {job.avgMatchScore ? `${job.avgMatchScore}%` : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills tags preview */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-lg bg-[#f0f5f1] text-[11px] font-semibold text-[#6E8F75] border border-[#dce8de]/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Bottom Actions Toolbar */}
                <div className="pt-4 border-t border-[#0B0F19]/[0.05] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* View Applicants Action */}
                    <button
                      onClick={() => setViewingApplicantsJob(job)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] transition-all shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Applicants ({job.applicantsCount})
                    </button>

                    {/* Edit Job Action */}
                    <button
                      onClick={() => setEditingJob(job)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#0B0F19]/[0.08] text-[#0B0F19]/75 text-xs font-bold hover:bg-[#FAF9F6] hover:text-[#0B0F19] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#6E8F75]" />
                      Edit Job
                    </button>

                    {/* Close / Pause Toggle Action */}
                    <button
                      onClick={() => toggleListingStatus(job.id)}
                      className={`
                        flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors
                        ${job.status === 'Active'
                          ? 'bg-warning-50 text-warning-700 border-warning-200 hover:bg-warning-100'
                          : 'bg-success-50 text-success-700 border-success-200 hover:bg-success-100'}
                      `}
                      title={job.status === 'Active' ? 'Pause Listing' : 'Activate Listing'}
                    >
                      {job.status === 'Active' ? (
                        <>
                          <PauseCircle className="w-3.5 h-3.5" />
                          Pause Listing
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-3.5 h-3.5" />
                          Activate Listing
                        </>
                      )}
                    </button>
                  </div>

                  {/* Share & Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyJobLink(job)}
                      className="p-2 rounded-xl text-[#0B0F19]/40 hover:text-[#0B0F19] hover:bg-[#0B0F19]/[0.04] transition-colors flex items-center gap-1 text-xs font-bold"
                      title="Share job link"
                    >
                      {copiedLinkJobId === job.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-success-600" />
                          <span className="text-success-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 rounded-xl text-[#0B0F19]/25 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         VIEW APPLICANTS DRAWER / MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {viewingApplicantsJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setViewingApplicantsJob(null)}
          />

          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#0B0F19]/[0.08] space-y-6 animate-[fade-in_0.2s_ease]">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#0B0F19]/[0.06]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-xs font-bold mb-1">
                  {viewingApplicantsJob.track} • {viewingApplicantsJob.seniority}
                </div>
                <h3 className="text-lg font-extrabold text-[#0B0F19]">
                  Applicants for {viewingApplicantsJob.title}
                </h3>
                <p className="text-xs text-[#0B0F19]/50 mt-0.5">
                  Showing {viewingApplicantsJob.applicants.length} pre-screened candidate profiles
                </p>
              </div>
              <button
                onClick={() => setViewingApplicantsJob(null)}
                className="p-2 rounded-xl hover:bg-[#0B0F19]/[0.04] text-[#0B0F19]/40 hover:text-[#0B0F19]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification */}
            {scheduledCandidateId && (
              <div className="p-3.5 rounded-xl bg-success-50 border border-success-200 text-success-700 text-xs font-bold flex items-center gap-2 animate-[fade-in_0.2s_ease]">
                <CheckCircle2 className="w-4 h-4" />
                Interview confirmed & synced directly to candidate schedule!
              </div>
            )}

            {/* Applicants List */}
            {viewingApplicantsJob.applicants.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Users className="w-8 h-8 text-[#0B0F19]/30 mx-auto" />
                <p className="text-sm font-bold text-[#0B0F19]/70">No candidates in pipeline yet</p>
                <p className="text-xs text-[#0B0F19]/40">Jadeer AI matching engine evaluates candidates continuously.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#0B0F19]/[0.04] space-y-3">
                {viewingApplicantsJob.applicants.map((cand) => (
                  <div
                    key={cand.id}
                    className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl hover:bg-[#FAF9F6] transition-colors border border-transparent hover:border-[#0B0F19]/[0.04]"
                  >
                    <div className="flex items-center gap-3.5">
                      <Link
                        to={`/candidates/profiles?id=${cand.id}&name=${encodeURIComponent(cand.name)}&from=employer&jobId=${viewingApplicantsJob.id}`}
                        className="w-11 h-11 rounded-2xl bg-[#6E8F75] text-white flex items-center justify-center text-sm font-extrabold shadow-sm shadow-[#6E8F75]/30 hover:scale-105 transition-transform shrink-0"
                        title="View Full Live Dossier"
                      >
                        {cand.initials}
                      </Link>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/candidates/profiles?id=${cand.id}&name=${encodeURIComponent(cand.name)}&from=employer&jobId=${viewingApplicantsJob.id}`}
                            className="text-sm font-extrabold text-[#0B0F19] hover:text-[#6E8F75] transition-colors flex items-center gap-1.5"
                          >
                            <span>{cand.name}</span>
                            <ExternalLink className="w-3 h-3 text-[#6E8F75] opacity-60" />
                          </Link>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#6E8F75]" />
                        </div>
                        <p className="text-xs text-[#0B0F19]/50 font-medium">{cand.role}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-[#0B0F19]/40">
                          <span>AI Assessment: <strong className="text-[#6E8F75]">{cand.aiScore}%</strong></span>
                          <span>•</span>
                          <span>Applied {cand.appliedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right mr-1">
                        <span className="text-base font-black text-[#6E8F75]">{cand.matchScore}%</span>
                        <p className="text-[10px] font-bold text-[#0B0F19]/40 uppercase tracking-wider">{cand.stage}</p>
                      </div>

                      <Link
                        to={`/candidates/profiles?id=${cand.id}&name=${encodeURIComponent(cand.name)}&from=employer&jobId=${viewingApplicantsJob.id}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#0B0F19]/[0.08] text-[#0B0F19]/70 text-xs font-bold hover:bg-[#FAF9F6] hover:text-[#0B0F19] transition-all"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#6E8F75]" />
                        <span>Dossier</span>
                      </Link>

                      <button
                        onClick={() => handleQuickScheduleApplicant(cand, viewingApplicantsJob)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] transition-all shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[#0B0F19]/[0.04] flex items-center justify-end">
              <button
                onClick={() => setViewingApplicantsJob(null)}
                className="px-5 py-2.5 rounded-xl bg-[#0B0F19] text-white text-xs font-bold hover:bg-[#1a2440] transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         EDIT JOB MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingJob(null)}
          />

          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#0B0F19]/[0.08] space-y-5 animate-[fade-in_0.2s_ease]">
            <div className="flex items-center justify-between pb-3 border-b border-[#0B0F19]/[0.06]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#6E8F75]" />
                <h3 className="text-base font-extrabold text-[#0B0F19]">Edit Job Listing</h3>
              </div>
              <button
                onClick={() => setEditingJob(null)}
                className="p-1.5 rounded-lg text-[#0B0F19]/30 hover:text-[#0B0F19]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-[#0B0F19]/[0.08] text-xs font-medium focus:outline-none focus:border-[#6E8F75] focus:ring-2 focus:ring-[#6E8F75]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1">
                    Engineering Track
                  </label>
                  <select
                    value={editingJob.track}
                    onChange={(e) => setEditingJob({ ...editingJob, track: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#0B0F19]/[0.08] text-xs font-medium focus:outline-none focus:border-[#6E8F75]"
                  >
                    {availableTracks.filter((t) => t !== 'All Tracks').map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1">
                    Seniority Level
                  </label>
                  <select
                    value={editingJob.seniority}
                    onChange={(e) => setEditingJob({ ...editingJob, seniority: e.target.value as SeniorityLevel })}
                    className="w-full px-3 py-2 rounded-xl border border-[#0B0F19]/[0.08] text-xs font-medium focus:outline-none focus:border-[#6E8F75]"
                  >
                    {seniorityList.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1">
                  Status
                </label>
                <select
                  value={editingJob.status}
                  onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as ListingStatus })}
                  className="w-full px-3 py-2 rounded-xl border border-[#0B0F19]/[0.08] text-xs font-medium focus:outline-none focus:border-[#6E8F75]"
                >
                  <option value="Active">Active (Open for Applicants)</option>
                  <option value="Draft">Draft</option>
                  <option value="Paused">Paused</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0F19]/70 mb-1">
                  Location & Workplace
                </label>
                <input
                  type="text"
                  value={editingJob.location}
                  onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#0B0F19]/[0.08] text-xs font-medium focus:outline-none focus:border-[#6E8F75]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#0B0F19]/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#0B0F19]/60 hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
