import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — USER PROFILE CONTEXT (CLERK + LOCALSTORAGE HYBRID SYNC)
   ─────────────────────────────────────────────────────────────────────────
   Merges Clerk identity (Name, Email, Avatar) with custom platform
   attributes (University, Major, Tech Stack, Bio, Role, Track) stored in
   localStorage for real-time, persistent, instant UI reactivity.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface AssessmentRecord {
  id: string;
  title: string;
  category: string;
  score: number;
  maxScore: number;
  passed: boolean;
  completedAt: string;
  badgeEarned?: string;
  challengesCompleted: number;
  totalChallenges: number;
}

export interface JobApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  logoUrl?: string;
  appliedDate: string;
  status: 'Under Review' | 'Technical Screening' | 'Interview Scheduled' | 'Offer Extended' | 'Rejected';
  matchScore: number;
}

export type CandidateRole = 'student' | 'grad';

export function normalizeCandidateRole(role?: string | null): CandidateRole {
  if (!role) return 'grad';
  const lower = role.toLowerCase().trim();
  if (lower === 'student') return 'student';
  return 'grad';
}

export interface ProfileLink {
  id: string;
  platform: 'github' | 'linkedin' | 'portfolio' | 'leetcode' | 'codeforces' | 'custom' | string;
  label: string;
  url: string;
}

export interface HumanInterviewRubric {
  overallScore: number;
  grade: string;
  systemThinking: number;
  codeQuality: number;
  problemSolving: number;
  technicalArticulation: number;
  summaryNotes: string;
  strengths: string[];
  recommendations: string[];
  calibratedAt: string;
  interviewerName: string;
  interviewerTitle: string;
  interviewerCompany: string;
  verifiedBadge: string;
}

export interface HumanInterviewState {
  status: 'awaiting_assignment' | 'not_scheduled' | 'upcoming' | 'completed';
  isCompleted?: boolean;
  overallScore?: number;
  calibratedDate?: string;
  assignedExpertId?: string;
  sessionId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  timezone?: string;
  meetingLink?: string;
  interviewerName?: string;
  interviewerTitle?: string;
  interviewerCompany?: string;
  interviewerInitials?: string;
  topic?: string;
  rubric?: HumanInterviewRubric;
}

export interface CustomUserProfile {
  fullName: string;
  email: string;
  imageUrl: string;
  title: string;
  university: string;
  major: string;
  graduationYear: string;
  role: CandidateRole;
  track: string;
  location: string;
  bio: string;
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  leetcodeUrl?: string;
  codeforcesUrl?: string;
  socialLinks?: ProfileLink[];
  phone?: string;
  resumeFileName?: string;
  resumeUploadDate?: string;
  resumeFileSize?: string;
  resumeDataUrl?: string;
  /* Assessment & Badge Telemetry */
  assessmentScore?: number;
  completedAssessmentsCount?: number;
  verifiedBadges?: string[];
  assessmentsHistory?: AssessmentRecord[];
  /* Human Interview State */
  humanInterview?: HumanInterviewState;
  /* Job Applications */
  applications?: JobApplicationRecord[];
}

const STORAGE_KEY = 'jadeer-custom-profile';

const DEFAULT_PROFILE: CustomUserProfile = {
  fullName: 'Ahmad Al-Hassan',
  email: 'ahmad.hassan@kfupm.edu.sa',
  imageUrl: '',
  title: 'Junior Backend & Systems Engineer',
  university: 'King Fahd University of Petroleum & Minerals (KFUPM)',
  major: 'Computer Science & Software Engineering',
  graduationYear: '2025',
  role: 'grad',
  track: 'Backend Development',
  location: 'Riyadh, Saudi Arabia',
  bio: 'Passionate software engineer building resilient, high-throughput microservices and cloud infrastructure. Specialized in distributed systems, low-latency socket multiplexing, and modern C++20 / Go type-safe architectures.',
  skills: ['C++20', 'Go', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Redis', 'Linux epoll', 'gRPC'],
  githubUrl: 'https://github.com/ahmad-dev-engineer',
  linkedinUrl: 'https://linkedin.com/in/ahmad-alhassan',
  portfolioUrl: 'https://ahmadhassan.dev',
  leetcodeUrl: 'https://leetcode.com/u/ahmad_hassan_dev',
  codeforcesUrl: 'https://codeforces.com/profile/ahmad_dev',
  socialLinks: [
    { id: 'link-gh', platform: 'github', label: 'GitHub', url: 'https://github.com/ahmad-dev-engineer' },
    { id: 'link-li', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/ahmad-alhassan' },
    { id: 'link-port', platform: 'portfolio', label: 'Portfolio Website', url: 'https://ahmadhassan.dev' },
    { id: 'link-lc', platform: 'leetcode', label: 'LeetCode Profile', url: 'https://leetcode.com/u/ahmad_hassan_dev' },
    { id: 'link-cf', platform: 'codeforces', label: 'Codeforces Profile', url: 'https://codeforces.com/profile/ahmad_dev' },
  ],
  phone: '+966 50 123 4567',
  resumeFileName: 'Ahmad_AlHassan_Software_Engineer.pdf',
  resumeUploadDate: '2026-08-28',
  resumeFileSize: '1.4 MB',
  assessmentScore: 94,
  completedAssessmentsCount: 2,
  verifiedBadges: ['Verified Backend Engineer', 'Jadeer AI Technical Badge', 'System Design Verified'],
  assessmentsHistory: [
    {
      id: 'eval-001',
      title: 'C++ Systems & Memory Safety Assessment',
      category: 'Backend & Low-Level Systems',
      score: 94,
      maxScore: 100,
      passed: true,
      completedAt: '2026-08-28',
      badgeEarned: 'Verified Backend Engineer',
      challengesCompleted: 5,
      totalChallenges: 5,
    },
    {
      id: 'eval-002',
      title: 'Distributed Microservices & PostgreSQL Assessment',
      category: 'Database & Architecture',
      score: 92,
      maxScore: 100,
      passed: true,
      completedAt: '2026-08-29',
      badgeEarned: 'Jadeer AI Technical Badge',
      challengesCompleted: 4,
      totalChallenges: 4,
    },
  ],
  humanInterview: {
    status: 'completed',
    scheduledDate: '2026-08-29',
    scheduledTime: '02:00 PM - 03:00 PM (1 hr)',
    timezone: 'Asia/Riyadh (GMT+3)',
    meetingLink: 'https://meet.jadeer.io/interview/jad-tech-8492',
    interviewerName: 'Eng. Tariq Al-Mansour',
    interviewerTitle: 'Principal Systems Architect & Calibration Lead',
    interviewerCompany: 'Jadeer Calibration Panel',
    interviewerInitials: 'TM',
    topic: 'Stage 02B: Human Technical Calibration (Backend Distributed Systems)',
    rubric: {
      overallScore: 94,
      grade: 'A+ (Exemplary Calibration)',
      systemThinking: 96,
      codeQuality: 94,
      problemSolving: 92,
      technicalArticulation: 95,
      summaryNotes:
        'Ahmad demonstrated stellar depth in asynchronous socket multiplexing, Linux epoll primitives, and modern C++20 memory management. His ability to articulate architectural trade-offs during live systems probing was outstanding.',
      strengths: [
        'Command of RAII, thread safety, and zero-cost abstraction principles in C++20 and Go.',
        'High-level clarity when defending cache-aside vs. write-through invalidation topologies.',
        'Structured analytical approach when identifying concurrency race conditions.',
      ],
      recommendations: [
        'Explore distributed consensus protocols (e.g. Raft leader election and log replication) for geo-distributed clusters.',
        'Add automated fuzz testing suites for socket edge-case malformed packet scenarios.',
      ],
      calibratedAt: '2026-08-29T15:00:00Z',
      interviewerName: 'Eng. Tariq Al-Mansour',
      interviewerTitle: 'Principal Systems Architect & Calibration Lead',
      interviewerCompany: 'Jadeer Calibration Panel',
      verifiedBadge: 'Jadeer Human-Calibrated Senior Engineer Badge',
    },
  },
  applications: [
    {
      id: 'app-001',
      jobId: 'job-101',
      jobTitle: 'Junior Systems Software Engineer',
      companyName: 'Lucidya Systems',
      appliedDate: '2026-08-25',
      status: 'Interview Scheduled',
      matchScore: 96,
    },
    {
      id: 'app-002',
      jobId: 'job-102',
      jobTitle: 'Backend Development Engineer (Go/Node)',
      companyName: 'Lean Technologies',
      appliedDate: '2026-08-20',
      status: 'Technical Screening',
      matchScore: 92,
    },
    {
      id: 'app-003',
      jobId: 'job-103',
      jobTitle: 'Cloud Infrastructure & DevOps Intern',
      companyName: 'Thiqah',
      appliedDate: '2026-08-15',
      status: 'Offer Extended',
      matchScore: 98,
    },
  ],
};

export interface UserProfileContextType {
  profile: CustomUserProfile;
  isLoaded: boolean;
  isProfileComplete: boolean;
  updateProfile: (patch: Partial<CustomUserProfile>) => void;
  resetProfile: () => void;
  addAssessmentResult: (result: Omit<AssessmentRecord, 'id' | 'completedAt'>) => void;
  updateApplicationStatus: (id: string, status: JobApplicationRecord['status']) => void;
  addJobApplication: (application: Omit<JobApplicationRecord, 'id' | 'appliedDate'>) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();

  const [profile, setProfile] = useState<CustomUserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedRole = localStorage.getItem('jadeer-user-role');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          role: normalizeCandidateRole(storedRole || parsed.role),
        };
      }
      if (storedRole) {
        return {
          ...DEFAULT_PROFILE,
          role: normalizeCandidateRole(storedRole),
        };
      }
    } catch {
      // localStorage unavailable
    }
    return DEFAULT_PROFILE;
  });

  // Sync Clerk identity changes with state and localStorage
  useEffect(() => {
    if (!isClerkLoaded) return;

    if (clerkUser) {
      const clerkName = clerkUser.fullName || clerkUser.firstName || clerkUser.username || '';
      const clerkEmail = clerkUser.primaryEmailAddress?.emailAddress || '';
      const clerkImage = clerkUser.imageUrl || '';
      const rawRole = (clerkUser.publicMetadata?.role || clerkUser.unsafeMetadata?.role) as string | undefined;

      setProfile((prev) => {
        const role = rawRole ? normalizeCandidateRole(rawRole) : prev.role;
        const merged: CustomUserProfile = {
          ...prev,
          fullName: clerkName || prev.fullName,
          email: clerkEmail || prev.email,
          imageUrl: clerkImage || prev.imageUrl,
          // Sync any public metadata if set on Clerk
          university: (clerkUser.publicMetadata?.university as string) || (clerkUser.unsafeMetadata?.university as string) || prev.university,
          major: (clerkUser.publicMetadata?.major as string) || (clerkUser.unsafeMetadata?.major as string) || prev.major,
          role,
          track: (clerkUser.publicMetadata?.track as string) || (clerkUser.unsafeMetadata?.track as string) || prev.track,
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          if (merged.role) localStorage.setItem('jadeer-user-role', merged.role);
          if (merged.track) localStorage.setItem('jadeer-locked-track', merged.track);
          if (merged.university) localStorage.setItem('jadeer-user-university', merged.university);
        } catch {
          // ignore
        }

        return merged;
      });
    }
  }, [isClerkLoaded, clerkUser]);

  const updateProfile = useCallback((patch: Partial<CustomUserProfile>) => {
    setProfile((prev) => {
      const normalizedPatch = { ...patch };
      if (normalizedPatch.role) {
        normalizedPatch.role = normalizeCandidateRole(normalizedPatch.role);
      }
      const next = { ...prev, ...normalizedPatch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        if (next.role) localStorage.setItem('jadeer-user-role', next.role);
        if (next.track) localStorage.setItem('jadeer-locked-track', next.track);
        if (next.university) localStorage.setItem('jadeer-user-university', next.university);
        localStorage.setItem('jadeer-graduate-onboarded', 'true');
      } catch {
        // localStorage unavailable
      }
      return next;
    });
  }, []);

  const addAssessmentResult = useCallback((result: Omit<AssessmentRecord, 'id' | 'completedAt'>) => {
    setProfile((prev) => {
      const id = `eval-${Date.now()}`;
      const completedAt = new Date().toISOString().split('T')[0];
      const newRecord: AssessmentRecord = { ...result, id, completedAt };

      const updatedHistory = [newRecord, ...(prev.assessmentsHistory || [])];
      const updatedBadges = new Set(prev.verifiedBadges || []);
      if (result.badgeEarned) updatedBadges.add(result.badgeEarned);

      // Compute average assessment score
      const totalScores = updatedHistory.reduce((acc, curr) => acc + curr.score, 0);
      const avgScore = Math.round(totalScores / updatedHistory.length);

      const next: CustomUserProfile = {
        ...prev,
        assessmentScore: avgScore,
        completedAssessmentsCount: updatedHistory.length,
        verifiedBadges: Array.from(updatedBadges),
        assessmentsHistory: updatedHistory,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const updateApplicationStatus = useCallback((id: string, status: JobApplicationRecord['status']) => {
    setProfile((prev) => {
      const updatedApps = (prev.applications || []).map((app) =>
        app.id === id ? { ...app, status } : app
      );
      const next = { ...prev, applications: updatedApps };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const addJobApplication = useCallback((application: Omit<JobApplicationRecord, 'id' | 'appliedDate'>) => {
    setProfile((prev) => {
      const newApp: JobApplicationRecord = {
        ...application,
        id: `app-${Date.now()}`,
        appliedDate: new Date().toISOString().split('T')[0],
      };
      const updatedApps = [newApp, ...(prev.applications || [])];
      const next = { ...prev, applications: updatedApps };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const isProfileComplete = useMemo(() => {
    return Boolean(
      profile.fullName &&
      profile.university &&
      profile.track &&
      profile.role &&
      profile.title
    );
  }, [profile]);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        isLoaded: isClerkLoaded,
        isProfileComplete,
        updateProfile,
        resetProfile,
        addAssessmentResult,
        updateApplicationStatus,
        addJobApplication,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
