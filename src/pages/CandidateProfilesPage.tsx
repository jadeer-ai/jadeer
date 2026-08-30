import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useInterviewSchedule } from '@/contexts/InterviewScheduleContext';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import {
  User,
  MapPin,
  Mail,
  Globe,
  Edit3,
  Check,
  X,
  FileText,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  GraduationCap,
  Award,
  Save,
  CheckCircle2,
  Upload,
  Calendar,
  ArrowLeft,
  Bot,
  Code2,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — COMPREHENSIVE CANDIDATE PROFILE
   Static overview with quick inline editing mode and dynamic cross-portal
   candidate evidence dossier loading.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Inline Brand Icons ─────────────────────────────────────────────────── */
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export interface CandidateData {
  id: string;
  candidateCode: string;
  fullName: string;
  initials: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  matchScore: number;
  aiScore: number;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  website?: string;
  resumeFileName: string;
  skills: {
    languages: string[];
    systems: string[];
    tools: string[];
  };
  education: {
    degree: string;
    institution: string;
    graduationYear: string;
  };
}

export const candidateDatabase: Record<string, CandidateData> = {
  'JAD-8492': {
    id: 'app-1',
    candidateCode: 'JAD-8492',
    fullName: 'Ahmad Al-Hassan',
    initials: 'AH',
    title: 'Junior Backend & Systems Engineer',
    location: 'Riyadh, Saudi Arabia',
    email: 'ahmad.hassan@example.com',
    bio: 'Junior Software Engineer specialized in low-latency backend systems, asynchronous socket multiplexing with Linux epoll, and modern C++20 object-oriented architecture. Passionate about high-throughput distributed architectures, zero-cost abstractions, and rigorous memory safety with RAII.',
    matchScore: 96,
    aiScore: 95,
    githubUrl: 'https://github.com/ahmad-alhassan-dev',
    linkedinUrl: 'https://linkedin.com/in/ahmad-al-hassan',
    portfolioUrl: 'https://ahmadhassan.dev',
    resumeFileName: 'Ahmad_Al-Hassan_Resume.pdf',
    skills: {
      languages: ['C++20', 'C', 'Python', 'SQL', 'Bash'],
      systems: ['Linux epoll', 'POSIX Sockets', 'gRPC', 'Redis Sentinel', 'RAII & Smart Pointers', 'vtable / CRTP'],
      tools: ['CMake', 'Valgrind / Memcheck', 'Docker', 'Git', 'GitHub Actions', 'GDB'],
    },
    education: {
      degree: 'B.S. in Software Engineering (Honors)',
      institution: 'King Saud University (KSU)',
      graduationYear: 'Class of 2025',
    },
  },
  'JAD-9204': {
    id: 'app-4',
    candidateCode: 'JAD-9204',
    fullName: 'Sara Fahad',
    initials: 'SF',
    title: 'Mid-Level Full-Stack Engineer',
    location: 'Riyadh, Saudi Arabia',
    email: 'sara.fahad@example.com',
    bio: 'Full-Stack Engineer with strong production experience designing React client applications, Node.js GraphQL backends, and robust TypeScript microservices. Proficient with distributed state and cloud caching.',
    matchScore: 92,
    aiScore: 94,
    githubUrl: 'https://github.com/sarafahad-dev',
    linkedinUrl: 'https://linkedin.com/in/sara-fahad',
    portfolioUrl: 'https://sarafahad.io',
    resumeFileName: 'Sara_Fahad_Senior_Resume.pdf',
    skills: {
      languages: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML5/CSS3'],
      systems: ['React 19', 'Next.js App Router', 'Node.js', 'GraphQL', 'PostgreSQL', 'TailwindCSS'],
      tools: ['AWS Lambda', 'Docker', 'Playwright', 'Git', 'Vite / Turbopack'],
    },
    education: {
      degree: 'B.S. in Computer Science',
      institution: 'Princess Nourah University (PNU)',
      graduationYear: 'Class of 2024',
    },
  },
  'JAD-7731': {
    id: 'app-6',
    candidateCode: 'JAD-7731',
    fullName: 'Rayan Al-Ghamdi',
    initials: 'RG',
    title: 'Embedded Systems & IoT Firmware Intern',
    location: 'Dammam, Saudi Arabia',
    email: 'rayan.ghamdi@example.com',
    bio: 'Embedded software engineer focused on low-level firmware, ARM Cortex microcontrollers, FreeRTOS task scheduling, and serial bus protocols (I2C, SPI, UART).',
    matchScore: 93,
    aiScore: 90,
    githubUrl: 'https://github.com/rayan-embedded',
    linkedinUrl: 'https://linkedin.com/in/rayan-al-ghamdi',
    portfolioUrl: 'https://rayanghamdi.tech',
    resumeFileName: 'Rayan_AlGhamdi_Firmware_CV.pdf',
    skills: {
      languages: ['C', 'C++', 'ARM Assembly', 'Python'],
      systems: ['FreeRTOS', 'STM32', 'ESP32', 'I2C / SPI / UART', 'Low-Power Sleep Modes'],
      tools: ['Keil µVision', 'Logic Analyzers', 'Git', 'PlatformIO', 'JTAG / OpenOCD'],
    },
    education: {
      degree: 'B.S. in Computer Engineering',
      institution: 'King Fahd University of Petroleum & Minerals (KFUPM)',
      graduationYear: 'Class of 2026',
    },
  },
  'JAD-6382': {
    id: 'app-2',
    candidateCode: 'JAD-6382',
    fullName: 'Mohammed Khalid',
    initials: 'MK',
    title: 'Junior Backend Engineer (Go & Cloud)',
    location: 'Jeddah, Saudi Arabia',
    email: 'mohammed.khalid@example.com',
    bio: 'Backend developer focused on concurrency in Go, distributed message brokers with Kafka, and REST/gRPC API gateways.',
    matchScore: 89,
    aiScore: 88,
    githubUrl: 'https://github.com/mkhalid-backend',
    linkedinUrl: 'https://linkedin.com/in/mohammed-khalid',
    portfolioUrl: 'https://mkhalid.dev',
    resumeFileName: 'Mohammed_Khalid_Backend.pdf',
    skills: {
      languages: ['Go (Golang)', 'SQL', 'Python', 'Bash'],
      systems: ['gRPC', 'PostgreSQL', 'Apache Kafka', 'Redis Caching', 'Docker'],
      tools: ['Git', 'Prometheus', 'Grafana', 'Linux Systems', 'GitHub Actions'],
    },
    education: {
      degree: 'B.S. in Information Technology',
      institution: 'King Abdulaziz University (KAU)',
      graduationYear: 'Class of 2025',
    },
  },
  'JAD-5129': {
    id: 'app-7',
    candidateCode: 'JAD-5129',
    fullName: 'Nora Rashid',
    initials: 'NR',
    title: 'Mid-Level Data Engineer (Spark & Snowflake)',
    location: 'Riyadh, Saudi Arabia',
    email: 'nora.rashid@example.com',
    bio: 'Data Engineer experienced with building high-throughput ETL data pipelines, distributed Spark transformations, and dimensional modeling.',
    matchScore: 88,
    aiScore: 87,
    githubUrl: 'https://github.com/nora-data-eng',
    linkedinUrl: 'https://linkedin.com/in/nora-rashid',
    portfolioUrl: 'https://norarashid.data',
    resumeFileName: 'Nora_Rashid_Data_Engineer.pdf',
    skills: {
      languages: ['Python', 'SQL', 'Scala', 'Bash'],
      systems: ['Apache Spark', 'Snowflake', 'Apache Kafka', 'Airflow', 'PostgreSQL'],
      tools: ['dbt', 'AWS S3', 'Docker', 'Git', 'Terraform'],
    },
    education: {
      degree: 'B.S. in Computer Science',
      institution: 'King Saud University (KSU)',
      graduationYear: 'Class of 2024',
    },
  },
};

export default function CandidateProfilesPage() {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  const queryName = searchParams.get('name');
  const isFromEmployer = searchParams.get('from') === 'employer';
  const jobId = searchParams.get('jobId');

  const { scheduleInterview } = useInterviewSchedule();
  const { companyProfile } = useCompanyProfile();
  const [scheduledDone, setScheduledDone] = useState(false);

  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { profile: userProfile, updateProfile } = useUserProfile();
  const clerkName = clerkUser?.fullName || clerkUser?.firstName || clerkUser?.username;
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress;

  // Resolve Candidate from database or fallback to JAD-8492
  const matchedCandidate = useMemo(() => {
    if (queryId && candidateDatabase[queryId]) return candidateDatabase[queryId];
    // Match by app-id or by name
    const foundById = Object.values(candidateDatabase).find((c) => c.id === queryId || c.candidateCode === queryId);
    if (foundById) return foundById;
    if (queryName) {
      const foundByName = Object.values(candidateDatabase).find((c) =>
        c.fullName.toLowerCase().includes(queryName.toLowerCase()) ||
        queryName.toLowerCase().includes(c.fullName.toLowerCase())
      );
      if (foundByName) return foundByName;
    }

    const base = candidateDatabase['JAD-8492'];
    if (!queryId && !queryName) {
      const name = userProfile.fullName || clerkName || base.fullName;
      return {
        ...base,
        fullName: name,
        email: userProfile.email || clerkEmail || base.email,
        title: userProfile.title || base.title,
        location: userProfile.location || base.location,
        bio: userProfile.bio || base.bio,
        githubUrl: userProfile.githubUrl || base.githubUrl,
        linkedinUrl: userProfile.linkedinUrl || base.linkedinUrl,
        portfolioUrl: userProfile.portfolioUrl || base.portfolioUrl,
        education: {
          ...base.education,
          institution: userProfile.university || base.education.institution,
          degree: userProfile.major || base.education.degree,
          graduationYear: userProfile.graduationYear ? `Class of ${userProfile.graduationYear}` : base.education.graduationYear,
        },
        initials: name
          .split(' ')
          .map((w) => w[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase() || base.initials,
      };
    }

    return base;
  }, [queryId, queryName, clerkUser, clerkName, clerkEmail, userProfile]);

  const [profile, setProfile] = useState<CandidateData>(matchedCandidate);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<CandidateData>(matchedCandidate);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'languages' | 'systems' | 'tools'>('languages');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Update profile when matchedCandidate changes
  useMemo(() => {
    setProfile(matchedCandidate);
    setDraft(matchedCandidate);
  }, [matchedCandidate]);

  const handleStartEdit = () => {
    setDraft(JSON.parse(JSON.stringify(profile)));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setProfile(draft);
    // Persist changes to custom platform state and localStorage
    updateProfile({
      fullName: draft.fullName,
      email: draft.email,
      title: draft.title,
      location: draft.location,
      bio: draft.bio,
      university: draft.education.institution,
      major: draft.education.degree,
      graduationYear: draft.education.graduationYear.replace(/[^0-9]/g, '') || draft.education.graduationYear,
      githubUrl: draft.githubUrl,
      linkedinUrl: draft.linkedinUrl,
      portfolioUrl: draft.portfolioUrl,
      skills: [
        ...draft.skills.languages,
        ...draft.skills.systems,
        ...draft.skills.tools,
      ],
    });
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    setDraft((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [newSkillCategory]: [...prev.skills[newSkillCategory], newSkillInput.trim()],
      },
    }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (category: 'languages' | 'systems' | 'tools', skillToRemove: string) => {
    setDraft((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((s) => s !== skillToRemove),
      },
    }));
  };

  const handleEmployerSchedule = () => {
    scheduleInterview({
      candidateId: profile.candidateCode,
      candidateName: profile.fullName,
      candidateInitials: profile.initials,
      role: profile.title,
      company: companyProfile.companyName || 'Jadeer Verified Employer',
      date: '2026-09-03',
      timeSlot: '11:00 AM',
      timezone: 'Asia/Riyadh (GMT+3)',
      meetingLink: `https://meet.jadeer.io/interview-${profile.candidateCode.toLowerCase()}`,
      type: 'human',
      scheduledBy: 'employer',
      notes: `Direct interview scheduled from Candidate Live Dossier (${profile.fullName})`,
    });
    setScheduledDone(true);
    setTimeout(() => setScheduledDone(false), 3000);
  };

  return (
    <div className="space-y-7 animate-[fade-in_0.4s_ease] pb-14">

      {/* ── Employer Cross-Portal Navigation & Telemetry Banner ────────── */}
      {isFromEmployer && (
        <div className="bg-[#0B0F19] text-white rounded-3xl p-5 sm:p-6 border border-white/[0.08] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                to={jobId ? '/employer/listings' : '/employer/dashboard'}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#6E8F75] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {jobId ? 'Back to Job Applicants' : 'Back to Employer Dashboard'}
              </Link>
              <span className="text-white/20">•</span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                Verified Candidate Dossier
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white">
              Live Evaluation Telemetry for <span className="text-[#6E8F75]">{profile.fullName}</span>
            </h2>
            <p className="text-xs text-white/50">
              Evaluated across Adaptive AI Assessment, Systems Telemetry, and Tamper-Proof Evidence.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">AI Evaluation</p>
              <p className="text-lg font-black text-[#6E8F75]">{profile.aiScore}%</p>
            </div>

            <button
              onClick={handleEmployerSchedule}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] shadow-md transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>
      )}

      {/* Schedule success toast */}
      {scheduledDone && (
        <div className="p-3.5 rounded-2xl bg-success-50 border border-success-200 text-success-700 text-xs font-bold flex items-center gap-2 animate-[fade-in_0.2s_ease]">
          <CheckCircle2 className="w-4 h-4 text-success-600" />
          <span>Interview scheduled and instantly synced with {profile.fullName}'s candidate dashboard!</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         PROFILE HEADER CARD WITH INLINE EDIT TRIGGER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          {/* Left: Avatar & Candidate Info */}
          <div className="flex items-start gap-4 sm:gap-5 flex-1">
            <div className="relative">
              <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-3xl bg-[#6E8F75] text-white flex items-center justify-center text-xl sm:text-2xl font-bold ring-4 ring-[#6E8F75]/15 shadow-md shrink-0">
                {profile.initials}
              </div>
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#10b981] ring-2 ring-white" />
            </div>

            <div className="space-y-1 flex-1">
              {!isEditing ? (
                <>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-xs font-bold border border-[#6E8F75]/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Profile
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#0B0F19]/[0.04] text-[#0B0F19]/60">
                      ID: {profile.candidateCode}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {profile.matchScore}% Match Telemetry
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
                    {profile.fullName}
                  </h1>

                  <p className="text-[14.5px] text-[#0B0F19]/65 font-medium">
                    {profile.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#0B0F19]/45 pt-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#6E8F75]" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#6E8F75]" />
                      {profile.email}
                    </span>
                  </div>
                </>
              ) : (
                /* Inline Edit Mode Fields for Header */
                <div className="space-y-3 w-full max-w-lg">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0B0F19]/40 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={draft.fullName}
                      onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-[#0B0F19]/[0.1] text-sm font-bold text-[#0B0F19] focus:border-[#6E8F75] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0B0F19]/40 mb-1">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19] focus:border-[#6E8F75] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0B0F19]/40 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={draft.location}
                        onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19] focus:border-[#6E8F75] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Right: Edit Mode Controls (Hidden when in employer view) */}
          {!isFromEmployer && (
            <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
              {!isEditing ? (
                <button
                  id="edit-profile-btn"
                  onClick={handleStartEdit}
                  className="
                    inline-flex items-center gap-2 px-5 py-3 rounded-2xl
                    bg-[#6E8F75] text-white text-xs font-bold
                    hover:bg-[#5d7d64] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)]
                    transition-all duration-200 shadow-sm cursor-pointer active:scale-95
                  "
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19]/60 hover:text-[#0B0F19] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] transition-all shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Saved Confirmation Notification */}
        {showSavedToast && (
          <div className="mt-4 p-3 rounded-2xl bg-[#ecfdf5] border border-emerald-200 text-xs text-[#065f46] font-semibold flex items-center gap-2 animate-[slide-up_0.2s_ease]">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>Profile information updated and synced across all evaluation modules.</span>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         MAIN PROFILE DETAILS (GRID SECTIONS)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─────────────────────────────────────────────────────────────
           LEFT COLUMN (8 cols): BIO, TECHNICAL SKILLS, EDUCATION
           ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. Professional Bio & Summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <h2 className="text-base font-extrabold text-[#0B0F19]">
                Professional Summary & Focus
              </h2>
              <span className="text-[11px] font-semibold text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-0.5 rounded-md">
                Verified Dossier
              </span>
            </div>

            {!isEditing ? (
              <p className="text-[14px] text-[#0B0F19]/70 leading-relaxed">
                {profile.bio}
              </p>
            ) : (
              <textarea
                rows={4}
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                className="w-full p-3.5 rounded-2xl border border-[#0B0F19]/[0.1] text-xs leading-relaxed text-[#0B0F19] focus:border-[#6E8F75] focus:outline-none"
              />
            )}
          </div>

          {/* 2. Verified Technical Skills Taxonomy */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <div>
                <h2 className="text-base font-extrabold text-[#0B0F19]">
                  Verified Technical Competencies
                </h2>
                <p className="text-xs text-[#0B0F19]/40 mt-0.5">
                  Core competencies evaluated through AI interviews and production PRs
                </p>
              </div>
              <span className="text-xs font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-1 rounded-full">
                {profile.skills.languages.length + profile.skills.systems.length + profile.skills.tools.length} Skills
              </span>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/40 block">
                Programming Languages
              </span>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? draft.skills.languages : profile.skills.languages).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-xs font-semibold text-[#0B0F19]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6E8F75]" />
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill('languages', skill)}
                        className="ml-1 text-rose-500 hover:text-rose-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Systems & Architecture */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/40 block">
                Systems, Concurrency & Networking
              </span>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? draft.skills.systems : profile.skills.systems).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6E8F75]/10 border border-[#6E8F75]/20 text-xs font-semibold text-[#6E8F75]"
                  >
                    <Check className="w-3 h-3 text-[#6E8F75]" />
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill('systems', skill)}
                        className="ml-1 text-rose-500 hover:text-rose-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools & DevOps */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/40 block">
                Engineering Tools & Diagnostics
              </span>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? draft.skills.tools : profile.skills.tools).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-xs font-semibold text-[#0B0F19]/70"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill('tools', skill)}
                        className="ml-1 text-rose-500 hover:text-rose-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Inline Add Skill Tool (Only in Edit Mode) */}
            {isEditing && (
              <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-dashed border-[#0B0F19]/15 flex flex-wrap items-center gap-2 pt-3">
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="h-9 px-2 rounded-xl bg-white border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] font-medium"
                >
                  <option value="languages">Languages</option>
                  <option value="systems">Systems & Networking</option>
                  <option value="tools">Tools & Diagnostics</option>
                </select>
                <input
                  type="text"
                  placeholder="e.g. Memory Profiling, Asio..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddSkill();
                  }}
                  className="flex-1 h-9 px-3 rounded-xl bg-white border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3.5 py-2 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64]"
                >
                  Add Skill
                </button>
              </div>
            )}
          </div>

          {/* 3. Education & Academic Background */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <h2 className="text-base font-extrabold text-[#0B0F19] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#6E8F75]" />
                Education & Verification
              </h2>
            </div>

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#0B0F19]">
                  {profile.education.degree}
                </h3>
                <p className="text-xs text-[#0B0F19]/55">
                  {profile.education.institution} • {profile.education.graduationYear}
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                Degree Verified
              </span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           RIGHT COLUMN (4 cols): PROFILES, RESUME ATTACHMENT, STATUS
           ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. Connected Profiles & External Links */}
          <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
            <h2 className="text-sm font-extrabold text-[#0B0F19] border-b border-[#0B0F19]/[0.05] pb-2.5">
              Connected Profiles
            </h2>

            {!isEditing ? (
              <div className="space-y-2.5 text-xs">
                {Boolean(profile.githubUrl?.trim()) && (
                  <a
                    href={profile.githubUrl!.trim()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] hover:border-[#6E8F75]/30 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <GitHubIcon className="w-4 h-4 text-[#0B0F19]" />
                      <span className="font-bold text-[#0B0F19]">GitHub</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#0B0F19]/30 group-hover:text-[#6E8F75]" />
                  </a>
                )}

                {Boolean(profile.linkedinUrl?.trim()) && (
                  <a
                    href={profile.linkedinUrl!.trim()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] hover:border-[#6E8F75]/30 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <LinkedInIcon className="w-4 h-4 text-[#0077b5]" />
                      <span className="font-bold text-[#0B0F19]">LinkedIn</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#0B0F19]/30 group-hover:text-[#6E8F75]" />
                  </a>
                )}

                {/* Personal Website / Portfolio Link: Conditionally verified and completely hidden if missing/empty */}
                {Boolean((profile.website || profile.portfolioUrl)?.trim()) && (
                  <a
                    href={(profile.website || profile.portfolioUrl)!.trim()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] hover:border-[#6E8F75]/30 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-[#6E8F75]" />
                      <span className="font-bold text-[#0B0F19]">Personal Website</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#0B0F19]/30 group-hover:text-[#6E8F75]" />
                  </a>
                )}

                {/* Fallback if no external profiles are connected */}
                {!profile.githubUrl?.trim() && !profile.linkedinUrl?.trim() && !(profile.website || profile.portfolioUrl)?.trim() && (
                  <p className="text-xs text-[#0B0F19]/40 italic py-2 text-center">
                    No external profiles connected yet.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#0B0F19]/40 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={draft.githubUrl || ''}
                    onChange={(e) => setDraft({ ...draft, githubUrl: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-[#0B0F19]/10 text-xs"
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#0B0F19]/40 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={draft.linkedinUrl || ''}
                    onChange={(e) => setDraft({ ...draft, linkedinUrl: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-[#0B0F19]/10 text-xs"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#0B0F19]/40 mb-1">Personal Website / Portfolio</label>
                  <input
                    type="text"
                    value={draft.website || draft.portfolioUrl || ''}
                    onChange={(e) => setDraft({ ...draft, website: e.target.value, portfolioUrl: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-[#0B0F19]/10 text-xs"
                    placeholder="https://yourwebsite.dev"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Uploaded Resume Artifact */}
          <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-3">
            <h2 className="text-sm font-extrabold text-[#0B0F19] border-b border-[#0B0F19]/[0.05] pb-2.5">
              Verified Resume
            </h2>

            <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-2">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#6E8F75] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold text-[#0B0F19] truncate">
                    Ahmad_Al-Hassan_Resume.pdf
                  </p>
                  <p className="text-[10px] text-[#0B0F19]/40">
                    1.4 MB • Analyzed by Jadeer AI
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#0B0F19]/[0.04] text-[11px]">
                <span className="text-[#6E8F75] font-semibold">Active Document</span>
                <span className="text-[#0B0F19]/40 font-mono">PDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
