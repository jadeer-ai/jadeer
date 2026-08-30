import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — USER PROFILE CONTEXT (CLERK + LOCALSTORAGE HYBRID SYNC)
   ─────────────────────────────────────────────────────────────────────────
   Merges Clerk identity (Name, Email, Avatar) with custom platform
   attributes (University, Major, Tech Stack, Bio, Role, Track) stored in
   localStorage for real-time, persistent, instant UI reactivity.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CustomUserProfile {
  fullName: string;
  email: string;
  imageUrl: string;
  title: string;
  university: string;
  major: string;
  graduationYear: string;
  role: 'student' | 'graduate';
  track: string;
  location: string;
  bio: string;
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  phone?: string;
  resumeFileName?: string;
}

const STORAGE_KEY = 'jadeer-custom-profile';

const DEFAULT_PROFILE: CustomUserProfile = {
  fullName: 'Ahmad Al-Hassan',
  email: 'ahmad.hassan@kfupm.edu.sa',
  imageUrl: '',
  title: 'Full-Stack Software Engineer',
  university: 'King Fahd University of Petroleum & Minerals (KFUPM)',
  major: 'Computer Science & Engineering',
  graduationYear: '2025',
  role: 'graduate',
  track: 'Backend Development',
  location: 'Riyadh, Saudi Arabia',
  bio: 'Passionate software engineer building resilient, high-throughput microservices and cloud infrastructure. Specialized in distributed systems and type-safe architectures.',
  skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Go', 'Docker', 'AWS'],
  githubUrl: 'https://github.com/ahmad-dev-engineer',
  linkedinUrl: 'https://linkedin.com/in/ahmad-alhassan',
  portfolioUrl: 'https://ahmadhassan.dev',
  phone: '+966 50 123 4567',
  resumeFileName: 'Ahmad_AlHassan_Software_Engineer.pdf',
};

export interface UserProfileContextType {
  profile: CustomUserProfile;
  isLoaded: boolean;
  isProfileComplete: boolean;
  updateProfile: (patch: Partial<CustomUserProfile>) => void;
  resetProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();

  const [profile, setProfile] = useState<CustomUserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
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

      setProfile((prev) => {
        const merged: CustomUserProfile = {
          ...prev,
          fullName: clerkName || prev.fullName,
          email: clerkEmail || prev.email,
          imageUrl: clerkImage || prev.imageUrl,
          // Sync any public metadata if set on Clerk
          university: (clerkUser.publicMetadata?.university as string) || prev.university,
          major: (clerkUser.publicMetadata?.major as string) || prev.major,
          role: (clerkUser.publicMetadata?.role as 'student' | 'graduate') || prev.role,
          track: (clerkUser.publicMetadata?.track as string) || prev.track,
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
      const next = { ...prev, ...patch };
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
