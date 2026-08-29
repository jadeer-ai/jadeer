import React, { createContext, useContext, useState, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CANDIDATE JOURNEY CONTEXT
   Manages graduate onboarding status and progressive route unlocking.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CandidateJourneyContextType {
  isOnboarded: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  isRouteUnlocked: (path: string) => boolean;
  getRouteLockReason: (path: string) => string | undefined;
}

const ONBOARDING_STORAGE_KEY = 'jadeer-graduate-onboarded';

const CandidateJourneyContext = createContext<CandidateJourneyContextType | undefined>(undefined);

export function CandidateJourneyProvider({ children }: { children: React.ReactNode }) {
  const [isOnboarded, setIsOnboardedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const completeOnboarding = useCallback(() => {
    setIsOnboardedState(true);
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {
      // localStorage unavailable
    }
  }, []);

  const resetOnboarding = useCallback(() => {
    setIsOnboardedState(false);
    try {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const isRouteUnlocked = useCallback(
    (path: string): boolean => {
      // Always open routes
      if (
        path === '/wizard' ||
        path === '/candidates/wizard' ||
        path === '/settings' ||
        path === '/candidates/settings' ||
        path === '/' ||
        path === '/signin' ||
        path === '/signup' ||
        path === '/login' ||
        path.startsWith('/admin') ||
        path.startsWith('/employer') ||
        path.startsWith('/consultations')
      ) {
        return true;
      }

      // If graduate onboarding is not complete, lock advanced candidate routes
      if (!isOnboarded) {
        return false;
      }

      return true;
    },
    [isOnboarded],
  );

  const getRouteLockReason = useCallback(
    (path: string): string | undefined => {
      if (!isRouteUnlocked(path)) {
        return 'Complete initial candidate profile onboarding to unlock';
      }
      return undefined;
    },
    [isRouteUnlocked],
  );

  return (
    <CandidateJourneyContext.Provider
      value={{
        isOnboarded,
        completeOnboarding,
        resetOnboarding,
        isRouteUnlocked,
        getRouteLockReason,
      }}
    >
      {children}
    </CandidateJourneyContext.Provider>
  );
}

export function useCandidateJourney() {
  const context = useContext(CandidateJourneyContext);
  if (!context) {
    throw new Error('useCandidateJourney must be used within a CandidateJourneyProvider');
  }
  return context;
}
