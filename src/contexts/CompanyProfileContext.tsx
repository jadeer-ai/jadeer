import React, { createContext, useContext, useState, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — COMPANY PROFILE CONTEXT (Employer Onboarding & Profile Store)
   ─────────────────────────────────────────────────────────────────────────
   Manages employer company registration details, working model, legal CR info,
   and onboarding status with localStorage persistence.
   ═══════════════════════════════════════════════════════════════════════════ */

export type WorkModel = 'remote' | 'hybrid' | 'on-site';

export interface CompanyProfile {
  companyName: string;
  companyInitials: string;
  workEmail: string;
  contactName: string;
  contactRole: string;
  industry: string;
  companySize: string;
  location: string;
  workModel: WorkModel;
  website: string;
  commercialRegistrationNumber: string;
  isCRVerified: boolean;
  onboardedAt: string;
}

export interface CompanyProfileContextType {
  companyProfile: CompanyProfile;
  isEmployerOnboarded: boolean;
  signupCompany: (profileData: Omit<CompanyProfile, 'companyInitials' | 'isCRVerified' | 'onboardedAt'>) => void;
  resetCompanyProfile: () => void;
}

const STORAGE_KEY = 'jadeer-company-profile';
const ONBOARDED_KEY = 'jadeer-employer-onboarded';

const defaultProfile: CompanyProfile = {
  companyName: 'Jadeer Technologies Inc.',
  companyInitials: 'JI',
  workEmail: 'talent@jadeer.io',
  contactName: 'Sultan Al-Otaibi',
  contactRole: 'Head of Engineering Talent',
  industry: 'FinTech & Cloud Infrastructure',
  companySize: '51-200 employees',
  location: 'Riyadh, Saudi Arabia',
  workModel: 'hybrid',
  website: 'https://jadeer.io',
  commercialRegistrationNumber: '1010894231',
  isCRVerified: true,
  onboardedAt: new Date().toISOString(),
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function loadInitialProfile(): CompanyProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CompanyProfile;
  } catch {
    // fallback to default
  }
  return defaultProfile;
}

function loadInitialOnboardedState(): boolean {
  try {
    return localStorage.getItem(ONBOARDED_KEY) === 'true';
  } catch {
    return false;
  }
}

const CompanyProfileContext = createContext<CompanyProfileContextType | undefined>(undefined);

export function CompanyProfileProvider({ children }: { children: React.ReactNode }) {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(loadInitialProfile);
  const [isEmployerOnboarded, setIsEmployerOnboarded] = useState<boolean>(loadInitialOnboardedState);

  // Fetch from backend API on mount
  React.useEffect(() => {
    fetch('/api/employer/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          setCompanyProfile(prev => ({
            ...prev,
            companyName: data.profile.companyName || prev.companyName,
            companyInitials: data.profile.companyInitials || prev.companyInitials,
            industry: data.profile.industry || prev.industry,
            companySize: data.profile.companySize || prev.companySize,
            location: data.profile.location || prev.location,
            website: data.profile.website || prev.website,
            commercialRegistrationNumber: data.profile.commercialRegistrationNumber || prev.commercialRegistrationNumber,
            isCRVerified: data.profile.isCRVerified !== undefined ? data.profile.isCRVerified : prev.isCRVerified,
            contactName: data.profile.contactName || prev.contactName,
            contactRole: data.profile.contactRole || prev.contactRole,
            workModel: data.profile.workModel ? data.profile.workModel.toLowerCase() as WorkModel : prev.workModel,
          }));
          setIsEmployerOnboarded(true);
        }
      })
      .catch(console.error);
  }, []);

  const signupCompany = useCallback(
    (profileData: Omit<CompanyProfile, 'companyInitials' | 'isCRVerified' | 'onboardedAt'>) => {
      const initials = getInitials(profileData.companyName || 'Jadeer');
      const newProfile: CompanyProfile = {
        ...profileData,
        companyInitials: initials,
        isCRVerified: Boolean(profileData.commercialRegistrationNumber?.trim()),
        onboardedAt: new Date().toISOString(),
      };

      setCompanyProfile(newProfile);
      setIsEmployerOnboarded(true);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
        localStorage.setItem(ONBOARDED_KEY, 'true');
      } catch {
        // localStorage unavailable
      }

      fetch('/api/employer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile)
      }).catch(console.error);
    },
    [],
  );

  const resetCompanyProfile = useCallback(() => {
    setCompanyProfile(defaultProfile);
    setIsEmployerOnboarded(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ONBOARDED_KEY);
    } catch {
      // localStorage unavailable
    }
  }, []);

  return (
    <CompanyProfileContext.Provider
      value={{
        companyProfile,
        isEmployerOnboarded,
        signupCompany,
        resetCompanyProfile,
      }}
    >
      {children}
    </CompanyProfileContext.Provider>
  );
}

export function useCompanyProfile() {
  const context = useContext(CompanyProfileContext);
  if (!context) {
    throw new Error('useCompanyProfile must be used within a CompanyProfileProvider');
  }
  return context;
}
