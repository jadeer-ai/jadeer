import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — USER ROLE CONTEXT
   Manages the selected user type (student | graduate) with localStorage
   persistence. Provides role state and methods to all components.
   ═══════════════════════════════════════════════════════════════════════════ */

export type UserRole = 'student' | 'graduate';

export interface UserRoleContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole) => void;
  clearUserRole: () => void;
  isStudent: boolean;
  isGraduate: boolean;
}

const STORAGE_KEY = 'jadeer-user-role';

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

  return (
    <UserRoleContext.Provider
      value={{
        userRole,
        setUserRole,
        clearUserRole,
        isStudent: userRole === 'student',
        isGraduate: userRole === 'graduate',
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
