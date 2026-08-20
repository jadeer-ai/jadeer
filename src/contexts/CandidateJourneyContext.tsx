import React, { createContext, useContext, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CANDIDATE JOURNEY CONTEXT (ALL ROUTES UNLOCKED FOR REVIEW)
   All sidebar routes are fully open, accessible, and functional.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CandidateJourneyContextType {
  isRouteUnlocked: (path: string) => boolean;
  getRouteLockReason: (path: string) => string | undefined;
}

const CandidateJourneyContext = createContext<CandidateJourneyContextType | undefined>(undefined);

export function CandidateJourneyProvider({ children }: { children: React.ReactNode }) {
  // All routes are 100% unlocked for design review and testing
  const isRouteUnlocked = (_path: string): boolean => true;
  const getRouteLockReason = (_path: string): string | undefined => undefined;

  return (
    <CandidateJourneyContext.Provider
      value={{
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
