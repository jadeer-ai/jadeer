/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CV ANALYSIS TYPE DEFINITIONS (FRONTEND CONTRACTS)
   ─────────────────────────────────────────────────────────────────────────
   Data contracts for candidate CV parser output, review workflow, and
   confirmed snapshot architecture. All sections are optional/nullable to
   support real-world partial parser output defensively.

   Key defensive behaviors:
   - Every section may be completely absent (undefined)
   - String fields may be null
   - Arrays default to [] via nullish coalescing at the rendering layer
   - Free-form date strings are never parsed into JS Date objects
   - URL fields may contain non-URL text (e.g. "GitHub" instead of a URL)
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Represents advanced independent technical study relevant to the
 * candidate's professional development: books, structured tracks,
 * advanced courses without formal certification, research papers, etc.
 *
 * Explicitly optional and candidate-entered. Never mandatory parser output.
 */
export interface SelfStudyItem {
  id?: string;
  title?: string;
  author_or_provider?: string;
  category?: string;
  description?: string;
  topics?: string[];
  started_at?: string;
  completed_at?: string;
  status?: 'planned' | 'in_progress' | 'completed';
  source_url?: string;
}

/* ── CV Section Contracts ──────────────────────────────────────────────── */

export interface PersonalInfo {
  name?: string | null;
  job_title?: string | null;
  email?: string | null;
  phone?: string | null;
  locations?: string[];
  github?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  website?: string | null;
}
export type CVPersonalInfo = PersonalInfo;

export interface SkillCategory {
  category: string;
  skills: string[];
}
export type CVSkillCategory = SkillCategory;

export interface Experience {
  title?: string | null;
  organization?: string | null;
  employment_type?: string | null;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  summary?: string | null;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
}
export type CVExperience = Experience;

export interface Project {
  name?: string | null;
  category?: string | null;
  description?: string | null;
  summary?: string | null;
  technologies?: string[];
  responsibilities?: string[];
  achievements?: string[];
  competition?: string | null;
  github_url?: string | null;
  project_url?: string | null;
}
export type CVProject = Project;

export interface Education {
  degree?: string | null;
  institution?: string | null;
  field_of_study?: string | null;
  specialization?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  grade?: string | null;
  description?: string | null;
}
export type CVEducation = Education;

export interface Certification {
  name?: string | null;
  issuer?: string | null;
  date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
}
export type CVCertification = Certification;

export interface Language {
  language?: string | null;
  proficiency?: string | null;
}
export type CVLanguage = Language;

/**
 * Top-level CandidateCV parsed output.
 * Every section is optional — the parser may omit entire sections.
 * Extra fields from future parser versions are naturally handled by
 * TypeScript's structural typing.
 */
export interface CandidateCV {
  personal_info?: PersonalInfo | null;
  summary?: string | null;
  technical_skills?: SkillCategory[];
  experience?: Experience[];
  projects?: Project[];
  education?: Education[];
  certifications?: Certification[];
  languages?: Language[];
  advanced_self_study?: SelfStudyItem[];
}

/* ── Analysis Lifecycle Contracts ──────────────────────────────────────── */

export type CVAnalysisStatus =
  | 'uploaded'
  | 'analysis_pending'
  | 'analyzing'
  | 'review_required'
  | 'confirmed'
  | 'failed';

/**
 * Candidate CV document record metadata.
 */
export interface CVDocumentRecord {
  id: string;
  candidate_user_id: string;
  storage_bucket: string;
  storage_path: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  uploaded_at: string;
  is_current: boolean;
}

/**
 * Candidate CV analysis lifecycle record.
 */
export interface CVAnalysisRecord {
  id: string;
  source_cv_document_id: string;
  candidate_user_id: string;
  analysis_status: CVAnalysisStatus;
  raw_extraction?: CandidateCV | null;
  reviewed_cv?: CandidateCV | null;
  confirmed_cv?: CandidateCV | null;
  parser_version?: string | null;
  analyzed_at?: string | null;
  confirmed_at?: string | null;
}

/**
 * Combined current CV snapshot for candidate frontend workflows.
 */
export interface CurrentCVSnapshot {
  has_cv: boolean;
  document_id?: string;
  candidate_user_id?: string;
  storage_bucket?: string;
  storage_path?: string;
  original_filename?: string;
  mime_type?: string;
  file_size?: number;
  uploaded_at?: string;
  is_current?: boolean;
  analysis_id?: string;
  analysis_status?: CVAnalysisStatus;
  raw_extraction?: CandidateCV | null;
  reviewed_cv?: CandidateCV | null;
  confirmed_cv?: CandidateCV | null;
  parser_version?: string | null;
  analyzed_at?: string | null;
  confirmed_at?: string | null;
  download_url?: string | null;
}

/**
 * Prerequisite evaluation result for AI Technical Assessment.
 */
export interface CVPrerequisiteResult {
  is_ready: boolean;
  reason?: 'no_cv' | 'analysis_pending' | 'review_required' | null;
  document_id?: string | null;
  analysis_id?: string | null;
  original_filename?: string | null;
  status?: CVAnalysisStatus | null;
  message?: string | null;
  confirmed_at?: string | null;
  confirmed_cv?: CandidateCV | null;
}

/**
 * Full CV analysis lifecycle envelope.
 */
export interface CVAnalysisEnvelope {
  documentId?: string;
  originalFilename?: string;
  uploadedAt?: string;
  rawExtraction?: CandidateCV | null;
  reviewedCV?: CandidateCV | null;
  confirmedCV?: CandidateCV | null;
  confirmedAt?: string | null;
  parserVersion?: string | null;
  status: CVAnalysisStatus;
}
