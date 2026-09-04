import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserProfile, type ProfileLink } from '@/contexts/UserProfileContext';
import { useInterviewSchedule } from '@/contexts/InterviewScheduleContext';
import { useCompanyProfile } from '@/contexts/CompanyProfileContext';
import { CVAnalysisService } from '@/services/cvAnalysisService';
import type { CurrentCVSnapshot } from '@/lib/cv-types';
import {
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
  Code2,
  Download,
  Lock,
  Layers,
  FileCheck,
  FileSearch,
  ArrowRight,
  Briefcase,
  ChevronRight,
  Link as LinkIcon,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CANDIDATE PROFILE (/profile)
   Polished candidate overview, verified credentials, dynamic social links,
   and interactive edit flow.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Inline Brand & Social Icons ────────────────────────────────────────── */
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

function LeetCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.642 5.88 5.88 0 0 0 2.808-.418 5.602 5.602 0 0 0 1.944-1.39l3.874-4.148 4.795-5.143a1.375 1.375 0 0 0-.022-1.928 1.375 1.375 0 0 0-1.928.022L13.9 12.08a2.808 2.808 0 0 1-2.079.919 2.825 2.825 0 0 1-2.062-.93l-3.874-4.148 5.405-5.787A1.374 1.374 0 0 0 13.483 0zm4.27 18.064l-11.472.001a1.375 1.375 0 0 0 0 2.75l11.472-.001a1.375 1.375 0 0 0 0-2.75z" />
    </svg>
  );
}

function CodeforcesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 7.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-3 0v-9a1.5 1.5 0 0 1 1.5-1.5zM12 3a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-3 0V4.5A1.5 1.5 0 0 1 12 3zm7.5 7.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-3 0v-6a1.5 1.5 0 0 1 1.5-1.5z" />
    </svg>
  );
}

/* ── Available Tracks ─────────────────────────────────────────────────── */
export const AVAILABLE_TRACKS = [
  {
    id: 'Backend Development',
    label: 'Backend Development',
    desc: 'Distributed systems, Go, Node.js, C++20, high-concurrency APIs & PostgreSQL',
  },
  {
    id: 'Frontend Development',
    label: 'Frontend Development',
    desc: 'React 19, Next.js, TypeScript, micro-frontends, responsive UI/UX & TailwindCSS',
  },
  {
    id: 'Full-Stack Development',
    label: 'Full-Stack Development',
    desc: 'End-to-end architecture, client state, GraphQL/REST, auth & database design',
  },
  {
    id: 'Embedded Systems & Firmware',
    label: 'Embedded Systems & Firmware',
    desc: 'ARM Cortex, C/C++, FreeRTOS, serial protocols (I2C/SPI) & microcontrollers',
  },
  {
    id: 'AI & Data Engineering',
    label: 'AI & Data Engineering',
    desc: 'Python, PyTorch, ETL pipelines, Spark, vector databases & LLM agent pipelines',
  },
  {
    id: 'Cloud Infrastructure & DevOps',
    label: 'Cloud Infrastructure & DevOps',
    desc: 'Kubernetes, Docker, Terraform, CI/CD pipelines, AWS/GCP & Linux systems',
  },
  {
    id: 'Mobile Development',
    label: 'Mobile Development',
    desc: 'React Native, Flutter, Swift/iOS, Kotlin/Android & native device bridges',
  },
];

/* ── Platform Metadata ────────────────────────────────────────────────── */
const PLATFORM_OPTIONS = [
  { value: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { value: 'portfolio', label: 'Portfolio Website', placeholder: 'https://yourportfolio.dev' },
  { value: 'leetcode', label: 'LeetCode', placeholder: 'https://leetcode.com/u/username' },
  { value: 'codeforces', label: 'Codeforces', placeholder: 'https://codeforces.com/profile/username' },
  { value: 'custom', label: 'Custom Link', placeholder: 'https://...' },
];

/* ── Track Suggested Skills ───────────────────────────────────────────── */
const SUGGESTED_SKILLS_BY_TRACK: Record<string, string[]> = {
  'Backend Development': ['C++20', 'Go', 'Node.js', 'PostgreSQL', 'Docker', 'Redis', 'Linux epoll', 'gRPC', 'Kafka', 'SQL'],
  'Frontend Development': ['TypeScript', 'React 19', 'Next.js', 'TailwindCSS', 'JavaScript', 'HTML5/CSS3', 'Vite', 'GraphQL', 'Playwright'],
  'Full-Stack Development': ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Next.js', 'Docker', 'TailwindCSS', 'REST APIs', 'AWS'],
  'Embedded Systems & Firmware': ['C', 'C++', 'ARM Assembly', 'FreeRTOS', 'STM32', 'I2C / SPI', 'ESP32', 'PlatformIO', 'GDB'],
  'AI & Data Engineering': ['Python', 'PyTorch', 'SQL', 'FastAPI', 'Apache Spark', 'PostgreSQL', 'LangChain', 'Docker', 'Pandas'],
  'Cloud Infrastructure & DevOps': ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Linux', 'GitHub Actions', 'Prometheus', 'Bash', 'Go'],
  'Mobile Development': ['React Native', 'Flutter', 'TypeScript', 'Swift', 'Kotlin', 'iOS', 'Android', 'REST APIs'],
};

export interface CandidateData {
  id: string;
  candidateCode: string;
  fullName: string;
  initials: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  role: 'student' | 'grad';
  track: string;
  matchScore: number;
  aiScore: number;
  socialLinks: ProfileLink[];
  resumeFileName: string;
  resumeUploadDate?: string;
  resumeFileSize?: string;
  resumeDataUrl?: string;
  skills: string[];
  education: {
    degree: string;
    faculty?: string;
    specialization?: string;
    gpa?: string;
    institution: string;
    graduationYear: string;
    startDate?: string;
    endDate?: string;
  };
}

export const candidateDatabase: Record<string, CandidateData> = {
  'JAD-8492': {
    id: 'app-1',
    candidateCode: 'JAD-8492',
    fullName: 'Candidate',
    initials: 'AH',
    title: 'Junior Backend & Systems Engineer',
    location: 'Riyadh, Saudi Arabia',
    email: 'candidate@example.com',
    role: 'grad',
    track: 'Backend Development',
    bio: 'Junior Software Engineer specialized in low-latency backend systems, asynchronous socket multiplexing with Linux epoll, and modern C++20 object-oriented architecture. Passionate about high-throughput distributed architectures, zero-cost abstractions, and rigorous memory safety with RAII.',
    matchScore: 96,
    aiScore: 95,
    socialLinks: [
      { id: 'link-1', platform: 'github', label: 'GitHub', url: 'https://github.com/ahmad-dev-engineer' },
      { id: 'link-2', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/ahmad-alhassan' },
      { id: 'link-3', platform: 'portfolio', label: 'Portfolio Website', url: 'https://ahmadhassan.dev' },
      { id: 'link-4', platform: 'leetcode', label: 'LeetCode Profile', url: 'https://leetcode.com/u/ahmad_hassan_dev' },
      { id: 'link-5', platform: 'codeforces', label: 'Codeforces Profile', url: 'https://codeforces.com/profile/ahmad_dev' },
    ],
    resumeFileName: 'Candidate_Al-Hassan_Resume.pdf',
    resumeUploadDate: '2026-08-28',
    resumeFileSize: '1.4 MB',
    skills: ['C++20', 'Go', 'Linux epoll', 'POSIX Sockets', 'gRPC', 'Redis', 'PostgreSQL', 'Docker', 'CMake', 'Valgrind'],
    education: {
      degree: 'B.S. in Computer Science & Software Engineering',
      institution: 'King Fahd University of Petroleum & Minerals (KFUPM)',
      graduationYear: '2025',
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
    role: 'grad',
    track: 'Full-Stack Development',
    bio: 'Full-Stack Engineer with strong production experience designing React client applications, Node.js GraphQL backends, and robust TypeScript microservices. Proficient with distributed state and cloud caching.',
    matchScore: 92,
    aiScore: 94,
    socialLinks: [
      { id: 'link-1', platform: 'github', label: 'GitHub', url: 'https://github.com/sarafahad-dev' },
      { id: 'link-2', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/sara-fahad' },
      { id: 'link-3', platform: 'portfolio', label: 'Portfolio Website', url: 'https://sarafahad.io' },
      { id: 'link-4', platform: 'leetcode', label: 'LeetCode Profile', url: 'https://leetcode.com/u/sara_fahad' },
    ],
    resumeFileName: 'Sara_Fahad_Senior_Resume.pdf',
    resumeUploadDate: '2026-08-25',
    resumeFileSize: '1.8 MB',
    skills: ['TypeScript', 'React 19', 'Next.js', 'Node.js', 'GraphQL', 'PostgreSQL', 'TailwindCSS', 'AWS Lambda', 'Docker'],
    education: {
      degree: 'B.S. in Computer Science',
      institution: 'Princess Nourah University (PNU)',
      graduationYear: '2024',
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

  const { user: clerkUser } = useUser();
  const { profile: userProfile, updateProfile } = useUserProfile();
  const clerkName = clerkUser?.fullName || clerkUser?.firstName || clerkUser?.username;
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress;

  /* ── Real Persisted CV State ── */
  const [currentCv, setCurrentCv] = useState<CurrentCVSnapshot | null>(null);
  const [isUploadingCv, setIsUploadingCv] = useState(false);

  useEffect(() => {
    let active = true;
    if (!clerkUser?.id) return;
    CVAnalysisService.getCurrentCV(clerkUser.id).then((snap) => {
      if (active) setCurrentCv(snap);
    });
    return () => { active = false; };
  }, [clerkUser?.id]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Build initial dynamic links from either socialLinks or legacy fields
  const resolvedInitialLinks = useMemo((): ProfileLink[] => {
    if (userProfile.socialLinks && userProfile.socialLinks.length > 0) {
      return userProfile.socialLinks.filter((l) => Boolean(l.url && l.url.trim()));
    }
    const links: ProfileLink[] = [];
    if (userProfile.githubUrl?.trim()) {
      links.push({ id: 'gh', platform: 'github', label: 'GitHub', url: userProfile.githubUrl.trim() });
    }
    if (userProfile.linkedinUrl?.trim()) {
      links.push({ id: 'li', platform: 'linkedin', label: 'LinkedIn', url: userProfile.linkedinUrl.trim() });
    }
    if (userProfile.portfolioUrl?.trim()) {
      links.push({ id: 'port', platform: 'portfolio', label: 'Portfolio Website', url: userProfile.portfolioUrl.trim() });
    }
    if (userProfile.leetcodeUrl?.trim()) {
      links.push({ id: 'lc', platform: 'leetcode', label: 'LeetCode Profile', url: userProfile.leetcodeUrl.trim() });
    }
    if (userProfile.codeforcesUrl?.trim()) {
      links.push({ id: 'cf', platform: 'codeforces', label: 'Codeforces Profile', url: userProfile.codeforcesUrl.trim() });
    }
    return links;
  }, [userProfile]);

  // Resolve Candidate from database or fallback to dynamic userProfile
  const matchedCandidate: CandidateData = useMemo(() => {
    if (queryId && candidateDatabase[queryId]) return candidateDatabase[queryId];
    if (queryName) {
      const foundByName = Object.values(candidateDatabase).find((c) =>
        c.fullName.toLowerCase().includes(queryName.toLowerCase()) ||
        queryName.toLowerCase().includes(c.fullName.toLowerCase())
      );
      if (foundByName) return foundByName;
    }

    const base = candidateDatabase['JAD-8492'];
    const name = userProfile.fullName || clerkName || base.fullName;
    const currentRole = userProfile.role === 'student' ? 'student' : 'grad';
    const currentTrack = userProfile.track || base.track;

    return {
      ...base,
      fullName: name,
      email: userProfile.email || clerkEmail || base.email,
      title: userProfile.title || (currentRole === 'student' ? 'University Student (Engineering)' : base.title),
      location: userProfile.location || base.location,
      bio: userProfile.bio ?? '',
      role: currentRole,
      track: currentTrack,
      socialLinks: resolvedInitialLinks.length > 0 ? resolvedInitialLinks : base.socialLinks,
      resumeFileName: userProfile.resumeFileName || base.resumeFileName,
      resumeUploadDate: userProfile.resumeUploadDate || base.resumeUploadDate,
      resumeFileSize: userProfile.resumeFileSize || base.resumeFileSize,
      resumeDataUrl: userProfile.resumeDataUrl,
      skills: userProfile.skills && userProfile.skills.length > 0 ? userProfile.skills : base.skills,
      education: {
        institution: userProfile.university || base.education.institution,
        degree: userProfile.degree || base.education.degree,
        faculty: userProfile.faculty,
        specialization: userProfile.specialization,
        gpa: userProfile.gpa,
        startDate: userProfile.startDate,
        endDate: userProfile.endDate,
        graduationYear: userProfile.graduationYear ? userProfile.graduationYear.replace(/[^0-9]/g, '') : '2025',
      },
      initials: name
        .split(' ')
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'AH',
    };
  }, [queryId, queryName, clerkName, clerkEmail, userProfile, resolvedInitialLinks]);

  const [profile, setProfile] = useState<CandidateData>(matchedCandidate);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<CandidateData>(matchedCandidate);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // Sync state when matched candidate updates
  useEffect(() => {
    setProfile(matchedCandidate);
    if (!isEditing) {
      setDraft(matchedCandidate);
    }
  }, [matchedCandidate, isEditing]);

  const handleStartEdit = () => {
    setDraft(JSON.parse(JSON.stringify(profile)));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraft(JSON.parse(JSON.stringify(profile)));
    setIsEditing(false);
  };

  /* 📌 Save Changes Flow 📌 */
  const handleSaveEdit = () => {
    // Validate Dates
    if (draft.education.startDate && draft.education.endDate) {
      const start = new Date(draft.education.startDate);
      const end = new Date(draft.education.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffInYears = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
        if (diffInYears < 1) {
          alert("End date can't be before start date or less than a year.");
          return;
        }
      }
    } else if (draft.education.startDate || draft.education.endDate) {
      alert("Please provide both valid start and end dates.");
      return;
    }

    // Filter out any link with empty URL
    const cleanedLinks = draft.socialLinks.filter((link) => Boolean(link.url && link.url.trim()));

    // Synchronize primary named link fields for backward compatibility
    const githubLink = cleanedLinks.find((l) => l.platform === 'github')?.url || '';
    const linkedinLink = cleanedLinks.find((l) => l.platform === 'linkedin')?.url || '';
    const portfolioLink = cleanedLinks.find((l) => l.platform === 'portfolio')?.url || '';
    const leetcodeLink = cleanedLinks.find((l) => l.platform === 'leetcode')?.url || '';
    const codeforcesLink = cleanedLinks.find((l) => l.platform === 'codeforces')?.url || '';

    const nextProfile: CandidateData = {
      ...draft,
      socialLinks: cleanedLinks,
    };

    setProfile(nextProfile);

    // Persist changes to custom platform state and localStorage
    updateProfile({
      fullName: draft.fullName,
      email: draft.email,
      title: draft.title,
      location: draft.location,
      bio: draft.bio,
      track: draft.track,
      university: draft.education.institution,
      degree: draft.education.degree,
      faculty: draft.education.faculty,
      specialization: draft.education.specialization,
      gpa: draft.education.gpa,
      startDate: draft.education.startDate,
      endDate: draft.education.endDate,
      graduationYear: draft.education.graduationYear.replace(/[^0-9]/g, '') || draft.education.graduationYear,
      socialLinks: cleanedLinks,
      githubUrl: githubLink,
      linkedinUrl: linkedinLink,
      portfolioUrl: portfolioLink,
      leetcodeUrl: leetcodeLink,
      codeforcesUrl: codeforcesLink,
      skills: draft.skills,
      resumeFileName: draft.resumeFileName,
      resumeUploadDate: draft.resumeUploadDate,
      resumeFileSize: draft.resumeFileSize,
      resumeDataUrl: draft.resumeDataUrl,
    });

    setIsEditing(false);
    setSavedToast('Profile information saved and synced across all evaluation modules!');
    setTimeout(() => setSavedToast(null), 3500);
  };

  /* ── Dynamic Links Management ── */
  const handleAddLink = (platform: string = 'custom') => {
    const defaultLabels: Record<string, string> = {
      github: 'GitHub',
      linkedin: 'LinkedIn',
      portfolio: 'Portfolio Website',
      leetcode: 'LeetCode Profile',
      codeforces: 'Codeforces Profile',
      custom: 'Custom Profile Link',
    };

    const newLink: ProfileLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      platform: platform as any,
      label: defaultLabels[platform] || 'Public Profile Link',
      url: '',
    };

    setDraft((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink],
    }));
  };

  const handleUpdateLink = (id: string, field: 'platform' | 'label' | 'url', value: string) => {
    setDraft((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, [field]: value };
        // If platform changed, update label automatically if user hasn't customized it
        if (field === 'platform') {
          const autoLabel = PLATFORM_OPTIONS.find((p) => p.value === value)?.label;
          if (autoLabel) updated.label = autoLabel;
        }
        return updated;
      }),
    }));
  };

  const handleDeleteLink = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((l) => l.id !== id),
    }));
  };

  /* ── Add & Remove Skill Tags ── */
  const handleAddSkill = (skillToAdd?: string) => {
    const raw = skillToAdd || newSkillInput;
    const skill = raw.trim();
    if (!skill) return;

    if (isEditing) {
      if (!draft.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
        setDraft((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
      }
    } else {
      if (!profile.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
        const updatedSkills = [...profile.skills, skill];
        setProfile((prev) => ({ ...prev, skills: updatedSkills }));
        setDraft((prev) => ({ ...prev, skills: updatedSkills }));
        updateProfile({ skills: updatedSkills });
        setSavedToast(`Added "${skill}" to your verified skills!`);
        setTimeout(() => setSavedToast(null), 2500);
      }
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (isEditing) {
      setDraft((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s !== skillToRemove),
      }));
    } else {
      const updatedSkills = profile.skills.filter((s) => s !== skillToRemove);
      setProfile((prev) => ({ ...prev, skills: updatedSkills }));
      setDraft((prev) => ({ ...prev, skills: updatedSkills }));
      updateProfile({ skills: updatedSkills });
      setSavedToast(`Removed "${skillToRemove}" from your profile.`);
      setTimeout(() => setSavedToast(null), 2500);
    }
  };

  /* 📌 Resume Document Upload Handler 📌 */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const isValidType =
      validTypes.includes(file.type) ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx');
    if (!isValidType) {
      alert('Please upload a valid PDF or Word document');
      return;
    }

    const candidateId = clerkUser?.id;
    if (!candidateId) {
      alert('Please sign in to upload your CV document.');
      return;
    }

    setIsUploadingCv(true);
    setSavedToast(`Uploading "${file.name}" to secure storage...`);

    try {
      const res = await CVAnalysisService.uploadCandidateCV(file, candidateId);
      if (res.success) {
        const snap = await CVAnalysisService.getCurrentCV(candidateId);
        setCurrentCv(snap);

        const patch = {
          resumeFileName: file.name,
          resumeFileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          resumeUploadDate: new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        };

        if (isEditing) {
          setDraft((prev) => ({ ...prev, ...patch }));
        } else {
          setProfile((prev) => ({ ...prev, ...patch }));
          setDraft((prev) => ({ ...prev, ...patch }));
          updateProfile(patch);
        }

        setSavedToast(`CV "${file.name}" uploaded successfully!`);
      } else {
        setSavedToast(`Upload failed: ${res.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setSavedToast(`Upload error: ${err.message}`);
    } finally {
      setIsUploadingCv(false);
      setTimeout(() => setSavedToast(null), 3500);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /* ── Real Resume Download Handler ── */
  const handleDownloadResume = async () => {
    if (currentCv?.download_url) {
      window.open(currentCv.download_url, '_blank');
      setSavedToast(`Opening ${currentCv.original_filename}...`);
      setTimeout(() => setSavedToast(null), 2500);
      return;
    }

    if (currentCv?.storage_path) {
      const url = await CVAnalysisService.getCVDownloadUrl(currentCv.storage_path);
      if (url) {
        window.open(url, '_blank');
        return;
      }
    }

    setSavedToast('No uploaded CV document available for download.');
    setTimeout(() => setSavedToast(null), 2500);
  };

  /* ── Employer Schedule Interview Action ── */
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
    setTimeout(() => setScheduledDone(false), 3500);
  };

  const currentDisplayTrack = isEditing ? draft.track : profile.track;
  const suggestedSkills = SUGGESTED_SKILLS_BY_TRACK[currentDisplayTrack] || SUGGESTED_SKILLS_BY_TRACK['Backend Development'];

  // Helper to render proper icon based on platform string
  const renderPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <GitHubIcon className="w-4 h-4 text-[#0F172A]" />;
      case 'linkedin':
        return <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />;
      case 'leetcode':
        return <LeetCodeIcon className="w-4 h-4 text-amber-600" />;
      case 'codeforces':
        return <CodeforcesIcon className="w-4 h-4 text-[#318CE7]" />;
      case 'portfolio':
        return <Globe className="w-4 h-4 text-[#5E8174]" />;
      default:
        return <LinkIcon className="w-4 h-4 text-[#5E8174]" />;
    }
  };

  return (
    <div className="w-full space-y-8 animate-[fade-in_0.4s_ease] pb-16 py-2 sm:py-4">

      {/* ── Employer Cross-Portal Navigation & Telemetry Banner ────────── */}
      {isFromEmployer && (
        <div className="bg-[#0F172A] text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                to={jobId ? '/employer/listings' : '/employer/dashboard'}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#84A98C] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {jobId ? 'Back to Job Applicants' : 'Back to Employer Dashboard'}
              </Link>
              <span className="text-white/20">•</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#84A98C]">
                Verified Candidate Dossier
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white">
              Live Evaluation Telemetry for <span className="text-[#84A98C]">{profile.fullName}</span>
            </h2>
            <p className="text-xs text-slate-300">
              Evaluated across Adaptive AI Assessment, Systems Telemetry, and Tamper-Proof Evidence.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Evaluation</p>
              <p className="text-lg font-black text-[#84A98C]">{profile.aiScore}%</p>
            </div>

            <button
              onClick={handleEmployerSchedule}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4d6d62] shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>
      )}

      {/* Schedule success toast */}
      {scheduledDone && (
        <div className="p-4 rounded-2xl bg-white border border-[#5E8174]/30 text-[#0F172A] text-xs font-semibold flex items-center gap-2 animate-[slide-up_0.2s_ease] shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#5E8174] shrink-0" />
          <span>Interview invitation dispatched and synced with {profile.fullName}'s candidate calendar!</span>
        </div>
      )}

      {/* Live Saved Toast Notification */}
      {savedToast && (
        <div className="p-4 rounded-2xl bg-white border border-[#5E8174]/30 text-[#0F172A] text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-[slide-up_0.2s_ease]">
          <CheckCircle2 className="w-4 h-4 text-[#5E8174] shrink-0" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         PROFILE HERO HEADER CARD WITH EDIT CONTROLS
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] relative overflow-hidden">
        {/* Restrained Muted Sage top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#5E8174]/40" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pt-2">

          {/* Left: Avatar & Candidate Overview */}
          <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#0F172A] text-white flex items-center justify-center text-2xl sm:text-3xl font-extrabold ring-4 ring-[#5E8174]/15 shadow-sm shrink-0">
                {profile.initials}
              </div>
              <span
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#5E8174] ring-2 ring-white"
                title="Active & Verified Candidate"
              />
            </div>

            <div className="space-y-2 flex-1 w-full">
              {!isEditing ? (
                <>
                  {/* Status Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Read-Only Locked Role Badge */}
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F9FA] border border-slate-200 text-xs font-semibold text-slate-600 shadow-2xs"
                      title="Role locked at registration. Elevation managed by institution administration."
                    >
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>{profile.role === 'student' ? 'Student Candidate' : 'Graduate Candidate'}</span>
                    </span>

                    {/* Candidate Track Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-semibold border border-[#5E8174]/20">
                      <Layers className="w-3 h-3" />
                      <span>{profile.track}</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                    {profile.fullName}
                  </h1>

                  <p className="text-[15px] text-[#334155] font-medium">
                    {profile.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#5E8174]" />
                      <span>{profile.location}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#5E8174]" />
                      <span className="font-mono">{profile.email}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#5E8174]" />
                      <span>{profile.education.institution}</span>
                    </span>
                  </div>
                </>
              ) : (
                /* ── Header Edit Inputs ── */
                <div className="space-y-4 w-full">
                  {/* Strictly Locked Role Card */}
                  <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-[#0F172A]">
                        Role:{' '}
                        <span className="text-[#5E8174] font-bold">
                          {draft.role === 'student' ? 'University Student (Internships & Co-ops)' : 'Graduate Engineer (Full-Time Roles)'}
                        </span>
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-slate-200">
                      Locked & Read-Only
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={draft.fullName}
                        onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-sm font-bold text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Headline / Professional Title
                      </label>
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs font-semibold text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                        placeholder="e.g. Junior Backend & Systems Engineer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Location / City
                      </label>
                      <input
                        type="text"
                        value={draft.location}
                        onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs font-semibold text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                        placeholder="e.g. Riyadh, Saudi Arabia"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Select Software Track (Changeable)
                      </label>
                      <select
                        value={draft.track}
                        onChange={(e) => setDraft({ ...draft, track: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs font-semibold text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                      >
                        {AVAILABLE_TRACKS.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Edit Mode Trigger Actions (Hidden in Employer View) */}
          {!isFromEmployer && (
            <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
              {!isEditing ? (
                <button
                  id="edit-profile-btn"
                  onClick={handleStartEdit}
                  className="
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                    bg-[#5E8174] text-white text-xs font-bold
                    hover:bg-[#4d6d62] hover:shadow-[0_4px_16px_rgba(94,129,116,0.25)]
                    transition-all duration-200 shadow-2xs cursor-pointer active:scale-95
                  "
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs font-semibold text-slate-600 hover:text-[#0F172A] hover:bg-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4d6d62] hover:shadow-[0_4px_16px_rgba(94,129,116,0.25)] transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         MAIN PROFILE GRID: LEFT (8 COLS) & RIGHT (4 COLS)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

        {/* ─────────────────────────────────────────────────────────────
           LEFT COLUMN (8 cols): BIO, TRACK, SKILLS, EDUCATION
           ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-7">

          {/* 1. Professional Bio & Summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#5E8174]" />
                <span>Professional Bio & Summary</span>
              </h2>
              <span className="text-[11px] font-medium text-slate-500 bg-[#F8F9FA] px-2.5 py-0.5 rounded-md border border-slate-200/60">
                Verified Candidate Bio
              </span>
            </div>

            {!isEditing ? (
              <p className="text-[14px] text-[#334155] leading-relaxed">
                {profile.bio}
              </p>
            ) : (
              <div className="space-y-1.5">
                <textarea
                  rows={4}
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  placeholder="Write a concise overview of your technical focus, systems passion, and engineering background..."
                  className="w-full p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200 text-xs leading-relaxed text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                />
                <p className="text-[11px] text-slate-400 text-right">
                  Displayed directly to hiring managers on your dossier.
                </p>
              </div>
            )}
          </div>

          {/* 2. Technical Track & Domain Focus */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5E8174]" />
                <h2 className="text-base font-bold text-[#0F172A]">
                  Technical Track & Domain Focus
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#5E8174] bg-[#5E8174]/10 px-3 py-0.5 rounded-full border border-[#5E8174]/20">
                {currentDisplayTrack}
              </span>
            </div>

            {!isEditing ? (
              <div className="p-4 rounded-2xl bg-[#F4F0E8]/80 border border-[#E8E2D5] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center font-bold shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#0F172A]">
                    Active Track: <span className="text-[#5E8174]">{profile.track}</span>
                  </p>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    {AVAILABLE_TRACKS.find((t) => t.id === profile.track)?.desc ||
                      'Focused on scalable systems design, automated testing, and reliable cloud deployments.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Select your primary technical domain. This calibrates your Job Matches, AI assessment modules, and project workspace:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_TRACKS.map((t) => {
                    const isSelected = draft.track === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setDraft({ ...draft, track: t.id })}
                        className={`
                          text-left p-3.5 rounded-2xl border transition-all cursor-pointer
                          ${isSelected
                            ? 'bg-[#5E8174]/10 border-[#5E8174] shadow-2xs'
                            : 'bg-[#F8F9FA] border-slate-200/70 hover:border-[#5E8174]/40 hover:bg-white'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold ${isSelected ? 'text-[#5E8174]' : 'text-[#0F172A]'}`}>
                            {t.label}
                          </p>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#5E8174]" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {t.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. Tech Stack & Verified Skills Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#5E8174]" />
                  <span>Tech Stack & Competencies</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage your technical skills and tooling expertise
                </p>
              </div>
              <span className="text-xs font-semibold text-[#5E8174] bg-[#5E8174]/10 px-3 py-1 rounded-full border border-[#5E8174]/20">
                {(isEditing ? draft.skills : profile.skills).length} Active Skills
              </span>
            </div>

            {/* Current Skills List */}
            <div className="flex flex-wrap gap-2">
              {(isEditing ? draft.skills : profile.skills).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-[#0F172A] shadow-2xs group hover:border-[#5E8174]/40 transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5E8174]" />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Input Form */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a skill (e.g., PostgreSQL, Docker, Go, C++20)..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 h-9 px-3 rounded-lg bg-[#F8F9FA] border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill()}
                  disabled={!newSkillInput.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F8F9FA] border border-slate-200 hover:border-[#5E8174]/40 hover:bg-white text-xs font-semibold text-[#0F172A] hover:text-[#5E8174] disabled:opacity-40 transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Suggested Skills for Active Track */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Suggested for {currentDisplayTrack}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedSkills
                    .filter((s) => !(isEditing ? draft.skills : profile.skills).includes(s))
                    .slice(0, 8)
                    .map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleAddSkill(suggestion)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F8F9FA] hover:bg-white border border-slate-200/70 hover:border-[#5E8174]/40 text-[11px] font-medium text-slate-600 hover:text-[#5E8174] transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Education & Academic Background */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#5E8174]" />
                <span>Education & Academic Credentials</span>
              </h2>
              <span className="text-[11px] font-medium text-[#5E8174] bg-[#5E8174]/10 px-2.5 py-0.5 rounded-md border border-[#5E8174]/20">
                Degree Verified
              </span>
            </div>

            {!isEditing ? (
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#F4F0E8]/80 border border-[#E8E2D5]">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      {profile.education.degree || 'Degree Not Specified'} {profile.education.specialization ? `in ${profile.education.specialization}` : ''}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {profile.education.institution || 'Institution Not Specified'} {profile.education.faculty ? `— ${profile.education.faculty}` : ''} • Class of {profile.education.graduationYear || '2025'}
                    </p>
                  </div>
                  {profile.education.graduationYear && (
                    <span className="text-xs font-mono font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                      {profile.education.graduationYear}
                    </span>
                  )}
                </div>
                {(profile.education.gpa || (profile.education.startDate && profile.education.endDate)) && (
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium">
                    {profile.education.gpa && (
                      <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md">GPA: {profile.education.gpa}</span>
                    )}
                    {(profile.education.startDate && profile.education.endDate) && (
                      <span>{profile.education.startDate} to {profile.education.endDate}</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    University / Institution
                  </label>
                  <input
                    type="text"
                    value={draft.education.institution}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        education: { ...draft.education, institution: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs font-semibold text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                    placeholder="e.g. King Fahd University of Petroleum & Minerals (KFUPM)"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={draft.education.graduationYear}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        education: { ...draft.education, graduationYear: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs font-semibold text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                    placeholder="2025"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Degree / Major
                  </label>
                  <input
                    type="text"
                    value={draft.education.degree}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        education: { ...draft.education, degree: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs font-semibold text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                    placeholder="e.g. B.S. in Computer Science & Software Engineering"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/50 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={draft.education.startDate || ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        education: { ...draft.education, startDate: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/50 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={draft.education.endDate || ''}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        education: { ...draft.education, endDate: e.target.value },
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           RIGHT COLUMN (4 cols): DYNAMIC LINKS, RESUME, BADGES
           ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-7">

          {/* 1. Dynamic Connected Social & Public Links */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#5E8174]" />
                <span>Connected Profiles</span>
              </h2>
              <span className="text-[10px] font-semibold text-slate-500 bg-[#F8F9FA] px-2.5 py-0.5 rounded-full border border-slate-200">
                {(isEditing ? draft.socialLinks : profile.socialLinks).filter((l) => Boolean(l.url && l.url.trim())).length} Active
              </span>
            </div>

            {!isEditing ? (
              /* View Mode: Dynamic clickable links list */
              <div className="space-y-2.5 text-xs">
                {profile.socialLinks && profile.socialLinks.filter((l) => Boolean(l.url && l.url.trim())).length > 0 ? (
                  profile.socialLinks
                    .filter((l) => Boolean(l.url && l.url.trim()))
                    .map((link) => (
                      <a
                        key={link.id}
                        href={link.url.trim().startsWith('http') ? link.url.trim() : `https://${link.url.trim()}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 hover:border-[#5E8174]/40 hover:bg-white transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {renderPlatformIcon(link.platform)}
                          <span className="font-bold text-[#0F172A] truncate">{link.label || link.platform}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#5E8174] shrink-0 transition-colors" />
                      </a>
                    ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-2 text-center">
                    No public links connected yet. Click Edit Profile to add your links.
                  </p>
                )}
              </div>
            ) : (
              /* Edit Mode: Dynamic Link Editor (Add, Edit, Delete on the fly) */
              <div className="space-y-3.5 text-xs">
                {draft.socialLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-3 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 space-y-2.5 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1">
                        {renderPlatformIcon(link.platform)}
                        <select
                          value={link.platform}
                          onChange={(e) => handleUpdateLink(link.id, 'platform', e.target.value)}
                          className="h-7 px-2 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-[#0F172A] focus:outline-none focus:border-[#5E8174]"
                        >
                          {PLATFORM_OPTIONS.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {link.platform === 'custom' && (
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleUpdateLink(link.id, 'label', e.target.value)}
                        placeholder="Link Label (e.g. Substack, Medium, Kaggle)"
                        className="w-full h-8 px-2.5 rounded-lg bg-white border border-slate-200 text-xs text-[#0F172A] focus:border-[#5E8174] focus:outline-none"
                      />
                    )}

                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                      placeholder={
                        PLATFORM_OPTIONS.find((p) => p.value === link.platform)?.placeholder ||
                        'https://...'
                      }
                      className="w-full h-8 px-2.5 rounded-lg bg-white border border-slate-200 text-xs text-[#0F172A] font-mono focus:border-[#5E8174] focus:outline-none"
                    />
                  </div>
                ))}

                {/* Quick Add Preset Links */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Quick Add Link:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PLATFORM_OPTIONS.map((opt) => {
                      const alreadyAdded = draft.socialLinks.some((l) => l.platform === opt.value);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleAddLink(opt.value)}
                          className={`
                            inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer
                            ${alreadyAdded
                              ? 'bg-white border-slate-200 text-slate-500 hover:text-[#0F172A]'
                              : 'bg-[#5E8174]/10 border-[#5E8174]/20 text-[#5E8174] hover:bg-[#5E8174]/20'
                            }
                          `}
                        >
                          <Plus className="w-3 h-3" />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Dedicated Resume / CV Document Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#5E8174]" />
                <span>Resume / CV Document</span>
              </h2>
              <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${
                currentCv?.has_cv
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-slate-500 bg-[#F8F9FA] border-slate-200'
              }`}>
                {currentCv?.has_cv ? 'Persisted Document' : 'No CV Uploaded'}
              </span>
            </div>

            {/* Resume Info Card */}
            {currentCv?.has_cv ? (
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center shrink-0">
                    <FileCheck className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#0F172A] truncate" title={currentCv.original_filename}>
                      {currentCv.original_filename}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {(currentCv.file_size ? (currentCv.file_size / (1024 * 1024)).toFixed(1) + ' MB' : 'PDF')} • Uploaded {currentCv.uploaded_at ? new Date(currentCv.uploaded_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  {/* Download Button */}
                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:text-[#0F172A] transition-all cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download</span>
                  </button>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Replace Resume Button */}
                  <button
                    type="button"
                    disabled={isUploadingCv}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4d6d62] transition-all cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingCv ? 'Uploading...' : 'Replace'}</span>
                  </button>
                </div>

                {/* Review CV Analysis Entry Point */}
                <Link
                  to="/candidates/cv-analysis"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#5E8174]/10 hover:bg-[#5E8174]/20 border border-[#5E8174]/25 text-xs font-bold text-[#5E8174] transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <FileSearch className="w-3.5 h-3.5" />
                  <span>
                    {currentCv.analysis_status === 'confirmed'
                      ? 'View Confirmed CV Context'
                      : currentCv.analysis_status === 'review_required'
                      ? 'Review CV Analysis & Context'
                      : 'Analyze CV (Pending)'}
                  </span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            ) : (
              /* Clean empty state when no real CV has been uploaded yet */
              <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-dashed border-slate-300 text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">No CV Document Uploaded</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto">
                    Upload your technical CV in PDF format to initiate automated skills analysis.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={isUploadingCv}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4d6d62] transition-all cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingCv ? 'Uploading...' : 'Upload CV Document'}</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Visual Verified Badges Section (Project evidence kept in Portfolio tab) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5E8174]" />
                <span>Verified Badges</span>
              </h2>
            </div>

            <div className="space-y-2.5">
              {(userProfile.verifiedBadges || ['Verified Backend Engineer', 'Jadeer AI Technical Badge', 'System Design Verified']).map((badge) => (
                <div
                  key={badge}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-[#5E8174]" />
                    </div>
                    <span className="text-xs font-bold text-[#0F172A] truncate">{badge}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2 py-0.5 rounded-md shrink-0 border border-[#5E8174]/20">
                    Verified
                  </span>
                </div>
              ))}
            </div>

            {/* Subtle Link pointing to the dedicated Evidence Portfolio */}
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/candidates/portfolio"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#5E8174] hover:bg-[#5E8174]/10 transition-colors"
              >
                <span>View Full Evidence Portfolio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
