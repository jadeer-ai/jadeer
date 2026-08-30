import { useState, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useUserProfile, type ProfileLink } from '@/contexts/UserProfileContext';
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
  Code2,
  Download,
  Lock,
  Layers,
  FileCheck,
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
    resumeFileName: 'Ahmad_Al-Hassan_Resume.pdf',
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
      bio: userProfile.bio || base.bio,
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
        degree: userProfile.major || base.education.degree,
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
  useMemo(() => {
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

  /* ── Save Changes Flow ── */
  const handleSaveEdit = () => {
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
      major: draft.education.degree,
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

  /* ── Resume Upload Handler ── */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const uploadDate = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const patch = {
        resumeFileName: fileName,
        resumeFileSize: sizeInMB,
        resumeUploadDate: uploadDate,
        resumeDataUrl: dataUrl,
      };

      if (isEditing) {
        setDraft((prev) => ({ ...prev, ...patch }));
      } else {
        setProfile((prev) => ({ ...prev, ...patch }));
        setDraft((prev) => ({ ...prev, ...patch }));
        updateProfile(patch);
      }

      setSavedToast(`Resume "${fileName}" uploaded successfully!`);
      setTimeout(() => setSavedToast(null), 3500);
    };
    reader.readAsDataURL(file);
  };

  /* ── Resume Download Handler ── */
  const handleDownloadResume = () => {
    const dataUrl = profile.resumeDataUrl;
    const fileName = profile.resumeFileName || 'Ahmad_Al-Hassan_Resume.pdf';

    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const blob = new Blob(
        [
          `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF`,
        ],
        { type: 'application/pdf' }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setSavedToast(`Downloading ${fileName}...`);
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
        return <GitHubIcon className="w-4 h-4 text-[#0B0F19]" />;
      case 'linkedin':
        return <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />;
      case 'leetcode':
        return <LeetCodeIcon className="w-4 h-4 text-amber-500" />;
      case 'codeforces':
        return <CodeforcesIcon className="w-4 h-4 text-[#318CE7]" />;
      case 'portfolio':
        return <Globe className="w-4 h-4 text-[#6E8F75]" />;
      default:
        return <LinkIcon className="w-4 h-4 text-[#6E8F75]" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-[fade-in_0.4s_ease] pb-16 py-2 sm:py-4">

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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>
      )}

      {/* Schedule success toast */}
      {scheduledDone && (
        <div className="p-4 rounded-2xl bg-[#ecfdf5] border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-[slide-up_0.2s_ease]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Interview invitation dispatched and synced with {profile.fullName}'s candidate calendar!</span>
        </div>
      )}

      {/* Live Saved Toast Notification */}
      {savedToast && (
        <div className="p-4 rounded-2xl bg-[#ecfdf5] border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-[slide-up_0.2s_ease]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         PROFILE HERO HEADER CARD WITH EDIT CONTROLS
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] relative overflow-hidden">
        {/* Accent bar on top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6E8F75] via-[#10B981] to-[#6E8F75]" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pt-2">

          {/* Left: Avatar & Candidate Overview */}
          <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#6E8F75] text-white flex items-center justify-center text-2xl sm:text-3xl font-extrabold ring-4 ring-[#6E8F75]/15 shadow-md shrink-0">
                {profile.initials}
              </div>
              <span
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#10b981] ring-2 ring-white"
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-bold text-[#0B0F19]/80 shadow-2xs"
                      title="Role locked at registration. Elevation managed by institution administration."
                    >
                      <Lock className="w-3 h-3 text-[#6E8F75]" />
                      <span>{profile.role === 'student' ? 'University Student' : 'Graduate Engineer'}</span>
                    </span>

                    {/* Candidate Track Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-xs font-bold border border-[#6E8F75]/20">
                      <Layers className="w-3 h-3" />
                      <span>{profile.track}</span>
                    </span>

                    {/* Telemetry Match Score */}
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{profile.matchScore}% Telemetry Rating</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
                    {profile.fullName}
                  </h1>

                  <p className="text-[15px] text-[#0B0F19]/70 font-medium">
                    {profile.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#0B0F19]/50 pt-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#6E8F75]" />
                      <span>{profile.location}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#6E8F75]" />
                      <span className="font-mono">{profile.email}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#6E8F75]" />
                      <span>{profile.education.institution}</span>
                    </span>
                  </div>
                </>
              ) : (
                /* ── Header Edit Inputs ── */
                <div className="space-y-4 w-full">
                  {/* Strictly Locked Role Card */}
                  <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#6E8F75]" />
                      <span className="font-bold text-[#0B0F19]">
                        Role:{' '}
                        <span className="text-[#6E8F75]">
                          {draft.role === 'student' ? 'University Student (Internships & Co-ops)' : 'Graduate Engineer (Full-Time Roles)'}
                        </span>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#45624c] bg-[#dce8de] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#b9d1bf]">
                      Locked & Read-Only
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/50 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={draft.fullName}
                        onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-sm font-bold text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/50 mb-1">
                        Headline / Professional Title
                      </label>
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                        placeholder="e.g. Junior Backend & Systems Engineer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/50 mb-1">
                        Location / City
                      </label>
                      <input
                        type="text"
                        value={draft.location}
                        onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                        placeholder="e.g. Riyadh, Saudi Arabia"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/50 mb-1">
                        Select Software Track (Changeable)
                      </label>
                      <select
                        value={draft.track}
                        onChange={(e) => setDraft({ ...draft, track: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs font-bold text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
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
                    inline-flex items-center gap-2 px-5 py-3 rounded-2xl
                    bg-[#6E8F75] text-white text-xs font-bold
                    hover:bg-[#587a60] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)]
                    transition-all duration-200 shadow-sm cursor-pointer active:scale-95
                  "
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19]/60 hover:text-[#0B0F19] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)] transition-all shadow-md cursor-pointer active:scale-95"
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
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <h2 className="text-base font-extrabold text-[#0B0F19] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#6E8F75]" />
                <span>Professional Bio & Summary</span>
              </h2>
              <span className="text-[11px] font-semibold text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-0.5 rounded-md border border-[#6E8F75]/20">
                Verified Candidate Bio
              </span>
            </div>

            {!isEditing ? (
              <p className="text-[14px] text-[#0B0F19]/75 leading-relaxed">
                {profile.bio}
              </p>
            ) : (
              <div className="space-y-1.5">
                <textarea
                  rows={4}
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  placeholder="Write a concise overview of your technical focus, systems passion, and engineering background..."
                  className="w-full p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs leading-relaxed text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                />
                <p className="text-[11px] text-[#0B0F19]/40 text-right">
                  Displayed directly to hiring managers on your dossier.
                </p>
              </div>
            )}
          </div>

          {/* 2. Technical Track & Domain Focus */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#6E8F75]" />
                <h2 className="text-base font-extrabold text-[#0B0F19]">
                  Technical Track & Domain Focus
                </h2>
              </div>
              <span className="text-xs font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-3 py-0.5 rounded-full border border-[#6E8F75]/20">
                {currentDisplayTrack}
              </span>
            </div>

            {!isEditing ? (
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center font-bold shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#0B0F19]">
                    Active Track: <span className="text-[#6E8F75]">{profile.track}</span>
                  </p>
                  <p className="text-[12px] text-[#0B0F19]/55 leading-relaxed">
                    {AVAILABLE_TRACKS.find((t) => t.id === profile.track)?.desc ||
                      'Focused on scalable systems design, automated testing, and reliable cloud deployments.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[#0B0F19]/60">
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
                            ? 'bg-[#6E8F75]/10 border-[#6E8F75] shadow-xs'
                            : 'bg-[#FAF9F6] border-[#0B0F19]/[0.06] hover:border-[#6E8F75]/40'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold ${isSelected ? 'text-[#6E8F75]' : 'text-[#0B0F19]'}`}>
                            {t.label}
                          </p>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#6E8F75]" />}
                        </div>
                        <p className="text-[11px] text-[#0B0F19]/50 mt-1 line-clamp-2">
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
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <div>
                <h2 className="text-base font-extrabold text-[#0B0F19] flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#6E8F75]" />
                  <span>Tech Stack & Competencies</span>
                </h2>
                <p className="text-xs text-[#0B0F19]/45 mt-0.5">
                  Manage your technical skills and tooling expertise
                </p>
              </div>
              <span className="text-xs font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-3 py-1 rounded-full border border-[#6E8F75]/20">
                {(isEditing ? draft.skills : profile.skills).length} Active Skills
              </span>
            </div>

            {/* Current Skills List */}
            <div className="flex flex-wrap gap-2">
              {(isEditing ? draft.skills : profile.skills).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.07] text-xs font-bold text-[#0B0F19] shadow-2xs group hover:border-[#6E8F75]/40 transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6E8F75]" />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 text-[#0B0F19]/35 hover:text-rose-600 transition-colors cursor-pointer"
                    title={`Remove ${skill}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Input Form */}
            <div className="pt-2 border-t border-[#0B0F19]/[0.05] space-y-3">
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
                  className="flex-1 h-10 px-3.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill()}
                  disabled={!newSkillInput.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] disabled:opacity-40 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Suggested Skills for Active Track */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B0F19]/40 block">
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF9F6] hover:bg-[#6E8F75]/10 border border-[#0B0F19]/[0.06] hover:border-[#6E8F75]/30 text-[11px] font-medium text-[#0B0F19]/70 hover:text-[#6E8F75] transition-all cursor-pointer"
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
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <h2 className="text-base font-extrabold text-[#0B0F19] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#6E8F75]" />
                <span>Education & Academic Credentials</span>
              </h2>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                Degree Verified
              </span>
            </div>

            {!isEditing ? (
              <div className="flex items-start justify-between p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05]">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#0B0F19]">
                    {profile.education.degree}
                  </h3>
                  <p className="text-xs text-[#0B0F19]/60">
                    {profile.education.institution} • Class of {profile.education.graduationYear}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-0.5 rounded-full">
                  {profile.education.graduationYear}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/50 mb-1">
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
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                    placeholder="e.g. King Fahd University of Petroleum & Minerals (KFUPM)"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/50 mb-1">
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
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                    placeholder="2025"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/50 mb-1">
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
                    className="w-full h-10 px-3 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                    placeholder="e.g. B.S. in Computer Science & Software Engineering"
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
          <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <h2 className="text-sm font-extrabold text-[#0B0F19] flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#6E8F75]" />
                <span>Connected Profiles</span>
              </h2>
              <span className="text-[10px] font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-0.5 rounded-full border border-[#6E8F75]/20">
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
                        className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] hover:border-[#6E8F75]/40 hover:bg-white transition-all group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {renderPlatformIcon(link.platform)}
                          <span className="font-bold text-[#0B0F19] truncate">{link.label || link.platform}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#0B0F19]/30 group-hover:text-[#6E8F75] shrink-0" />
                      </a>
                    ))
                ) : (
                  <p className="text-xs text-[#0B0F19]/40 italic py-2 text-center">
                    No public links connected yet. Click Edit Profile to add your links.
                  </p>
                )}
              </div>
            ) : (
              /* Edit Mode: Dynamic Link Editor (Add, Edit, Delete on the fly) */
              <div className="space-y-3.5 text-xs">
                {draft.socialLinks.map((link, idx) => (
                  <div
                    key={link.id}
                    className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] space-y-2.5 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1">
                        {renderPlatformIcon(link.platform)}
                        <select
                          value={link.platform}
                          onChange={(e) => handleUpdateLink(link.id, 'platform', e.target.value)}
                          className="h-7 px-2 rounded-lg bg-white border border-[#0B0F19]/[0.1] text-[11px] font-bold text-[#0B0F19] focus:outline-none focus:border-[#6E8F75]"
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
                        className="p-1 rounded-lg text-[#0B0F19]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
                        className="w-full h-8 px-2.5 rounded-lg bg-white border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] focus:border-[#6E8F75] focus:outline-none"
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
                      className="w-full h-8 px-2.5 rounded-lg bg-white border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] font-mono focus:border-[#6E8F75] focus:outline-none"
                    />
                  </div>
                ))}

                {/* Quick Add Preset Links */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B0F19]/40 block">
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
                              ? 'bg-white border-[#0B0F19]/[0.08] text-[#0B0F19]/60 hover:text-[#0B0F19]'
                              : 'bg-[#6E8F75]/10 border-[#6E8F75]/20 text-[#6E8F75] hover:bg-[#6E8F75]/20'
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
          <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <h2 className="text-sm font-extrabold text-[#0B0F19] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#6E8F75]" />
                <span>Resume / CV Document</span>
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                PDF Document
              </span>
            </div>

            {/* Resume Info Card */}
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#0B0F19] truncate" title={profile.resumeFileName}>
                    {profile.resumeFileName || 'Ahmad_Al-Hassan_Resume.pdf'}
                  </p>
                  <p className="text-[11px] text-[#0B0F19]/45 mt-0.5">
                    {profile.resumeFileSize || '1.4 MB'} • Uploaded {profile.resumeUploadDate || 'Aug 28, 2026'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#0B0F19]/[0.05]">
                {/* Download Button */}
                <button
                  type="button"
                  onClick={handleDownloadResume}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-[#0B0F19]/[0.08] hover:border-[#6E8F75]/40 text-xs font-bold text-[#0B0F19] transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#6E8F75]" />
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
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Visual Verified Badges Section (Project evidence kept in Portfolio tab) */}
          <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <h2 className="text-sm font-extrabold text-[#0B0F19] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#6E8F75]" />
                <span>Verified Badges</span>
              </h2>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {userProfile.assessmentScore || 94}% Telemetry
              </span>
            </div>

            <div className="space-y-2.5">
              {(userProfile.verifiedBadges || ['Verified Backend Engineer', 'Jadeer AI Technical Badge', 'System Design Verified']).map((badge) => (
                <div
                  key={badge}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] hover:border-[#6E8F75]/30 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-extrabold text-[#0B0F19] truncate">{badge}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0 border border-emerald-200/50">
                    Verified
                  </span>
                </div>
              ))}
            </div>

            {/* Subtle Link pointing to the dedicated Evidence Portfolio */}
            <div className="pt-2 border-t border-[#0B0F19]/[0.05]">
              <Link
                to="/candidates/portfolio"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#6E8F75] hover:bg-[#6E8F75]/10 transition-colors"
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
