/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — DATABASE TYPE UTILITIES
   ─────────────────────────────────────────────────────────────────────────
   Re-exports Prisma-generated types and defines composite utility types
   for common query patterns across the application.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { Prisma } from '@prisma/client';

// ── Re-export all generated model types ──────────────────────────────────
export type {
  User,
  StudentProfile,
  CompanyProfile,
  JobListing,
  Application,
  TelemetrySnapshot,
  Expert,
  ExpertAvailabilitySlot,
  Session,
  HumanInterviewDetail,
  ConsultationDetail,
  HumanInterviewEvaluation,
  HumanInterviewInternalNote,
} from '@prisma/client';

// ── Re-export all enums ──────────────────────────────────────────────────
export {
  UserRole,
  AuthProvider,
  SoftwareTrack,
  SeniorityLevel,
  EmploymentType,
  LocationType,
  JobStatus,
  ApplicationStatus,
  EvaluatorType,
  ExpertRole,
  SlotStatus,
  SessionType,
  SessionStatus,
  EvaluationRecommendation,
} from '@prisma/client';

// ── Re-export Supabase Scheduling & Session Types ─────────────────────────
export type {
  ExpertRole as SupabaseExpertRole,
  SlotStatus as SupabaseSlotStatus,
  SessionType as SupabaseSessionType,
  SessionStatus as SupabaseSessionStatus,
  EvaluationRecommendation as SupabaseEvaluationRecommendation,
  ExpertRow,
  ExpertAvailabilitySlotRow,
  SessionRow,
  HumanInterviewDetailRow,
  ConsultationDetailRow,
  HumanInterviewEvaluationRow,
  HumanInterviewInternalNoteRow,
  SessionWithDetails,
  ExpertWithSlots,
  BookSessionAtomicParams,
  BookSessionAtomicResult,
  CancelSessionAtomicParams,
  CancelSessionAtomicResult,
  SubmitHumanInterviewEvaluationParams,
  SubmitHumanInterviewEvaluationResult,
  CandidateHumanInterviewStatusResult,
} from './supabase-scheduling-types';

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSITE UTILITY TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A User record with its associated StudentProfile (if role is STUDENT/GRADUATE).
 * Useful for candidate-facing API responses.
 */
export type UserWithStudentProfile = Prisma.UserGetPayload<{
  include: { studentProfile: true };
}>;

/**
 * A User record with its associated CompanyProfile (if role is EMPLOYER).
 * Useful for employer-facing API responses.
 */
export type UserWithCompanyProfile = Prisma.UserGetPayload<{
  include: { companyProfile: true };
}>;

/**
 * A User record with both possible profile types included.
 * Useful for admin views or auth middleware that needs to inspect any user.
 */
export type UserWithProfiles = Prisma.UserGetPayload<{
  include: {
    studentProfile: true;
    companyProfile: true;
  };
}>;

/**
 * A JobListing with the parent CompanyProfile eagerly loaded.
 * Useful for candidate-facing job search results.
 */
export type JobListingWithCompany = Prisma.JobListingGetPayload<{
  include: { company: true };
}>;

/**
 * A JobListing with its applications and the applicant profiles.
 * Useful for the employer's "View Applicants" panel.
 */
export type JobListingWithApplicants = Prisma.JobListingGetPayload<{
  include: {
    applications: {
      include: { candidate: true };
    };
  };
}>;

/**
 * An Application with the candidate's profile and detailed telemetry.
 * Useful for the employer's candidate review / Evidence Dossier view.
 */
export type ApplicationWithTelemetry = Prisma.ApplicationGetPayload<{
  include: {
    candidate: true;
    jobListing: true;
    telemetrySnapshots: true;
  };
}>;

/**
 * An Application with just the job listing details (no telemetry).
 * Useful for the candidate's "My Applications" dashboard.
 */
export type ApplicationWithJob = Prisma.ApplicationGetPayload<{
  include: { jobListing: { include: { company: true } } };
}>;

// ═══════════════════════════════════════════════════════════════════════════
// FORM / INPUT TYPES (for API request bodies)
// ═══════════════════════════════════════════════════════════════════════════

/** Input shape for creating a new student/graduate user. */
export type CreateStudentInput = {
  email: string;
  password: string;
  fullName: string;
  university?: string;
  graduationYear?: number;
  softwareTrack?: Prisma.NullableEnumSoftwareTrackFieldUpdateOperationsInput['set'];
};

/** Input shape for creating a new employer user + company. */
export type CreateEmployerInput = {
  email: string;
  password: string;
  companyName: string;
  contactName: string;
  contactRole: string;
  industry?: string;
  companySize?: string;
  location?: string;
  website?: string;
  commercialRegistrationNumber?: string;
};

/** Input shape for creating a new job listing. */
export type CreateJobListingInput = Omit<
  Prisma.JobListingCreateInput,
  'company' | 'applications' | 'id' | 'createdAt' | 'updatedAt'
> & {
  companyId: string;
};

/** Input shape for submitting a job application. */
export type CreateApplicationInput = {
  candidateId: string;
  jobListingId: string;
  coverNote?: string;
};
