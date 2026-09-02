import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useUserRole } from '@/contexts/UserRoleContext';

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
  status: 'not_scheduled' | 'upcoming' | 'completed';
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
  degree?: string;
  gpa?: string;
  startDate?: string;
  endDate?: string;
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
  fullName: '',
  email: '',
  imageUrl: '',
  title: '',
  university: '',
  major: '',
  graduationYear: '',
  role: 'grad',
  track: '',
  location: '',
  bio: '',
  skills: [],
  githubUrl: '',
  linkedinUrl: '',
  portfolioUrl: '',
  socialLinks: [],
  phone: '',
  assessmentScore: 0,
  completedAssessmentsCount: 0,
  verifiedBadges: [],
  assessmentsHistory: [],
  applications: [],
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
  const { userRole } = useUserRole();

  const [profile, setProfile] = useState<CustomUserProfile>(DEFAULT_PROFILE);

  // Fetch real profile from backend API when auth state changes
  useEffect(() => {
    if (!userRole) {
      setProfile(DEFAULT_PROFILE);
      return;
    }
    
    // Only fetch for candidate roles
    if (userRole === 'student' || userRole === 'grad' || userRole === 'candidate') {
      fetch('/api/candidate/profile')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.profile) {
            setProfile(prev => ({
              ...prev,
              fullName: data.profile.fullName || prev.fullName,
              email: data.profile.email || prev.email,
              university: data.profile.university || prev.university,
              degree: data.profile.degree || prev.degree,
              gpa: data.profile.gpa || prev.gpa,
              startDate: data.profile.startDate || prev.startDate,
              endDate: data.profile.endDate || prev.endDate,
              graduationYear: data.profile.graduationYear ? String(data.profile.graduationYear) : prev.graduationYear,
              bio: data.profile.bio || prev.bio,
              githubUrl: data.profile.githubUrl || prev.githubUrl,
              linkedinUrl: data.profile.linkedinUrl || prev.linkedinUrl,
              portfolioUrl: data.profile.portfolioUrl || prev.portfolioUrl,
              location: data.profile.city || prev.location,
              title: data.profile.title || prev.title,
              skills: data.profile.skills || prev.skills,
              resumeFileName: data.profile.resumeUrl ? data.profile.resumeUrl.split('/').pop() : prev.resumeFileName,
              track: data.profile.softwareTrack ? data.profile.softwareTrack.replace(/_/g, ' ') : prev.track,
              role: userRole,
            }));
          }
        })
        .catch(console.error);
    }
  }, [userRole]);

  const updateProfile = useCallback((patch: Partial<CustomUserProfile>) => {
    setProfile((prev) => {
      const normalizedPatch = { ...patch };
      if (normalizedPatch.role) {
        normalizedPatch.role = normalizeCandidateRole(normalizedPatch.role);
      }
      const next = { ...prev, ...normalizedPatch };
      
      // Removed local storage sync

      // Sync to backend asynchronously
      fetch('/api/candidate/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      }).catch(console.error);

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

      // Removed local storage sync
      return next;
    });
  }, []);

  const updateApplicationStatus = useCallback((id: string, status: JobApplicationRecord['status']) => {
    setProfile((prev) => {
      const updatedApps = (prev.applications || []).map((app) =>
        app.id === id ? { ...app, status } : app
      );
      const next = { ...prev, applications: updatedApps };
      // Removed local storage sync
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
      // Removed local storage sync
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    // Removed local storage sync
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
        isLoaded: true,
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
