import React, { createContext, useContext, useState, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — USER ROLE CONTEXT & ONE-TIME TRACK BINDING
   ─────────────────────────────────────────────────────────────────────────
   Manages user type (student | graduate) and enforces one-time immutable
   technical track binding upon initial account registration.
   ═══════════════════════════════════════════════════════════════════════════ */

export type UserRole = 'student' | 'graduate';

export interface UserRoleContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole) => void;
  clearUserRole: () => void;
  isStudent: boolean;
  isGraduate: boolean;
  // One-Time Track Binding
  lockedTrack: string | null;
  isTrackLocked: boolean;
  bindTrack: (track: string) => void;
}

const STORAGE_KEY = 'jadeer-user-role';
const TRACK_LOCK_KEY = 'jadeer-locked-track';

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'student' || stored === 'graduate') return stored;
    } catch {
      // localStorage unavailable
    }
    return null;
  });

  const [lockedTrack, setLockedTrackState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TRACK_LOCK_KEY) || null;
    } catch {
      return null;
    }
  });

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
    try {
      localStorage.setItem(STORAGE_KEY, role);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const clearUserRole = useCallback(() => {
    setUserRoleState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const bindTrack = useCallback((track: string) => {
    const trimmed = track.trim();
    if (!trimmed) return;
    setLockedTrackState(trimmed);
    try {
      localStorage.setItem(TRACK_LOCK_KEY, trimmed);
    } catch {
      // localStorage unavailable
    }
  }, []);

  return (
    <UserRoleContext.Provider
      value={{
        userRole,
        setUserRole,
        clearUserRole,
        isStudent: userRole === 'student',
        isGraduate: userRole === 'graduate',
        lockedTrack,
        isTrackLocked: Boolean(lockedTrack),
        bindTrack,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
