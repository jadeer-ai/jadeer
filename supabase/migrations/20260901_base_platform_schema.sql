-- ═══════════════════════════════════════════════════════════════════════════
-- JADEER PLATFORM — BASE PLATFORM SCHEMA MIGRATION (PREREQUISITE)
-- ─────────────────────────────────────────────────────────────────────────
-- Establishes canonical users, profiles, tracks, and platform enum entities
-- required prior to scheduling, calibration, and consultation migrations.
-- Safe and idempotent: Uses DO blocks and IF NOT EXISTS.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE SCHEMA IF NOT EXISTS "public";

-- ── 1. Platform Enums ────────────────────────────────────────────────────

DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'GRADUATE', 'EMPLOYER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'GITHUB');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "SoftwareTrack" AS ENUM (
        'SOFTWARE_ENGINEERING',
        'BACKEND',
        'FRONTEND',
        'FULLSTACK',
        'EMBEDDED_SYSTEMS',
        'MOBILE',
        'DEVOPS',
        'DATA_ENGINEERING',
        'AI_ML',
        'CYBERSECURITY'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "SeniorityLevel" AS ENUM ('INTERN', 'JUNIOR', 'MID_LEVEL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "LocationType" AS ENUM ('ON_SITE', 'HYBRID', 'REMOTE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ApplicationStatus" AS ENUM (
        'SUBMITTED',
        'UNDER_REVIEW',
        'AI_INTERVIEW',
        'HUMAN_INTERVIEW',
        'PROJECT_ASSESSMENT',
        'SHORTLISTED',
        'HIRED',
        'REJECTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "EvaluatorType" AS ENUM ('AI', 'HUMAN', 'SYSTEM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ── 2. Core Users Table ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL,
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");

-- ── 3. Student & Candidate Profiles ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS "student_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "university" TEXT,
    "graduationYear" INTEGER,
    "softwareTrack" "SoftwareTrack",
    "bio" TEXT,
    "resumeUrl" TEXT,
    "githubUrl" TEXT,
    "linkedinUrl" TEXT,
    "portfolioUrl" TEXT,
    "avatarUrl" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'Saudi Arabia',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "student_profiles_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "student_profiles_userId_key" ON "student_profiles"("userId");
CREATE INDEX IF NOT EXISTS "student_profiles_softwareTrack_idx" ON "student_profiles"("softwareTrack");
CREATE INDEX IF NOT EXISTS "student_profiles_userId_idx" ON "student_profiles"("userId");

-- ── 4. Company Profiles ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "company_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyInitials" TEXT,
    "industry" TEXT,
    "companySize" TEXT,
    "location" TEXT,
    "workModel" "LocationType" NOT NULL DEFAULT 'ON_SITE',
    "website" TEXT,
    "commercialRegistrationNumber" TEXT,
    "isCRVerified" BOOLEAN NOT NULL DEFAULT false,
    "contactName" TEXT,
    "contactRole" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "company_profiles_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "company_profiles_userId_key" ON "company_profiles"("userId");
CREATE INDEX IF NOT EXISTS "company_profiles_companyName_idx" ON "company_profiles"("companyName");
CREATE INDEX IF NOT EXISTS "company_profiles_userId_idx" ON "company_profiles"("userId");

-- ── 5. Job Listings & Applications ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS "job_listings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "softwareTrack" "SoftwareTrack" NOT NULL,
    "seniorityLevel" "SeniorityLevel" NOT NULL,
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
    "locationType" "LocationType" NOT NULL DEFAULT 'ON_SITE',
    "location" TEXT,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT,
    "requirements" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "minimumMatchScore" INTEGER NOT NULL DEFAULT 70,
    "deadline" TIMESTAMP(3),
    "enableAIInterview" BOOLEAN NOT NULL DEFAULT true,
    "enableProjectAssessment" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_listings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "job_listings_companyId_fkey"
        FOREIGN KEY ("companyId") REFERENCES "company_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "job_listings_companyId_idx" ON "job_listings"("companyId");
CREATE INDEX IF NOT EXISTS "job_listings_softwareTrack_idx" ON "job_listings"("softwareTrack");
CREATE INDEX IF NOT EXISTS "job_listings_status_idx" ON "job_listings"("status");
CREATE INDEX IF NOT EXISTS "job_listings_seniorityLevel_idx" ON "job_listings"("seniorityLevel");

CREATE TABLE IF NOT EXISTS "applications" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "jobListingId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "coverNote" TEXT,
    "matchScore" DOUBLE PRECISION,
    "aiInterviewScore" DOUBLE PRECISION,
    "projectScore" DOUBLE PRECISION,
    "humanInterviewScore" DOUBLE PRECISION,
    "overallTelemetryScore" DOUBLE PRECISION,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "applications_candidateId_fkey"
        FOREIGN KEY ("candidateId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "applications_jobListingId_fkey"
        FOREIGN KEY ("jobListingId") REFERENCES "job_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "applications_candidateId_idx" ON "applications"("candidateId");
CREATE INDEX IF NOT EXISTS "applications_jobListingId_idx" ON "applications"("jobListingId");
CREATE INDEX IF NOT EXISTS "applications_status_idx" ON "applications"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "applications_candidateId_jobListingId_key" ON "applications"("candidateId", "jobListingId");

CREATE TABLE IF NOT EXISTS "telemetry_snapshots" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "evaluatorType" "EvaluatorType" NOT NULL DEFAULT 'AI',
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telemetry_snapshots_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "telemetry_snapshots_applicationId_fkey"
        FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "telemetry_snapshots_applicationId_idx" ON "telemetry_snapshots"("applicationId");
CREATE INDEX IF NOT EXISTS "telemetry_snapshots_dimension_idx" ON "telemetry_snapshots"("dimension");

-- ── 6. Base Row Level Security (RLS) ────────────────────────────────────

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "student_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "company_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_listings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "applications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "telemetry_snapshots" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own" ON "users";
CREATE POLICY "users_read_own" ON "users"
    FOR SELECT USING ("id" = auth.uid()::text OR (auth.jwt() ->> 'role') = 'ADMIN');

DROP POLICY IF EXISTS "student_profiles_read_own" ON "student_profiles";
CREATE POLICY "student_profiles_read_own" ON "student_profiles"
    FOR SELECT USING ("userId" = auth.uid()::text OR (auth.jwt() ->> 'role') = 'ADMIN');

DROP POLICY IF EXISTS "student_profiles_update_own" ON "student_profiles";
CREATE POLICY "student_profiles_update_own" ON "student_profiles"
    FOR UPDATE USING ("userId" = auth.uid()::text OR (auth.jwt() ->> 'role') = 'ADMIN');

DROP POLICY IF EXISTS "job_listings_public_read_active" ON "job_listings";
CREATE POLICY "job_listings_public_read_active" ON "job_listings"
    FOR SELECT USING ("status" = 'ACTIVE');
