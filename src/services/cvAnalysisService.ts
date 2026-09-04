/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CANDIDATE CV ANALYSIS DOMAIN SERVICE (FRONTEND CONTRACT)
   ─────────────────────────────────────────────────────────────────────────
   Frontend domain service abstraction for Candidate CV Analysis & Review.
   Maintains clean contract boundaries without coupling the frontend PR to
   production Supabase migrations, storage buckets, or database RPCs.

   Features:
   - Preserves complete TypeScript contracts (CandidateCV, SelfStudyItem, etc.)
   - Client-side persistence via localStorage for review, editing, & confirmation
   - Seamless development-fixture support for visual review
   - Exposes pure domain helpers for section updates and validation
   ═══════════════════════════════════════════════════════════════════════════ */

import type {
  CandidateCV,
  CVAnalysisEnvelope,
  CurrentCVSnapshot,
  CVPrerequisiteResult,
} from '@/lib/cv-types';
import { getDevelopmentCVFixture } from '@/lib/cv-fixture.dev';

const STORAGE_PREFIX = 'jadeer_cv_snapshot_';

function getStorageKey(candidateUserId: string): string {
  return `${STORAGE_PREFIX}${candidateUserId || 'anonymous'}`;
}

function readStoredSnapshot(candidateUserId: string): CurrentCVSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getStorageKey(candidateUserId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStoredSnapshot(candidateUserId: string, snapshot: CurrentCVSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(candidateUserId), JSON.stringify(snapshot));
  } catch (err) {
    console.warn('[CVAnalysisService] Failed to persist snapshot to localStorage', err);
  }
}

export const CVAnalysisService = {
  /**
   * Register an uploaded CV file in frontend candidate state.
   */
  async uploadCandidateCV(
    file: File,
    candidateUserId: string
  ): Promise<{ success: boolean; documentId?: string; storagePath?: string; error?: string }> {
    if (!candidateUserId) {
      return { success: false, error: 'Candidate identity is required' };
    }

    const documentId = 'doc_' + Date.now().toString(36);
    const storagePath = `candidate/${candidateUserId}/${documentId}/${file.name}`;
    const fixtureCV = getDevelopmentCVFixture();

    const snapshot: CurrentCVSnapshot = {
      has_cv: true,
      document_id: documentId,
      candidate_user_id: candidateUserId,
      original_filename: file.name,
      mime_type: file.type || 'application/pdf',
      file_size: file.size,
      uploaded_at: new Date().toISOString(),
      is_current: true,
      storage_path: storagePath,
      analysis_id: 'ana_' + Date.now().toString(36),
      analysis_status: 'review_required',
      raw_extraction: fixtureCV,
      reviewed_cv: fixtureCV,
      analyzed_at: new Date().toISOString(),
    };

    writeStoredSnapshot(candidateUserId, snapshot);

    return {
      success: true,
      documentId,
      storagePath,
    };
  },

  /**
   * Retrieve current candidate CV snapshot and analysis state.
   * If a candidate already uploaded a document, returns their persisted review state;
   * otherwise defaults to an initial dev snapshot or empty state.
   */
  async getCurrentCV(candidateUserId: string): Promise<CurrentCVSnapshot> {
    if (!candidateUserId) {
      return { has_cv: false };
    }

    const stored = readStoredSnapshot(candidateUserId);
    if (stored) {
      return stored;
    }

    // Default development preview snapshot so UI can be reviewed immediately
    const fixtureCV = getDevelopmentCVFixture();
    const defaultSnapshot: CurrentCVSnapshot = {
      has_cv: true,
      document_id: 'doc_demo_preview',
      candidate_user_id: candidateUserId,
      original_filename: 'Khalid_AlRashidi_AI_Engineer.pdf',
      mime_type: 'application/pdf',
      file_size: 1468006, // ~1.4 MB
      uploaded_at: new Date(Date.now() - 3600000).toISOString(),
      is_current: true,
      analysis_id: 'ana_demo_preview',
      analysis_status: 'review_required',
      raw_extraction: fixtureCV,
      reviewed_cv: fixtureCV,
      analyzed_at: new Date(Date.now() - 3000000).toISOString(),
    };

    writeStoredSnapshot(candidateUserId, defaultSnapshot);
    return defaultSnapshot;
  },

  /**
   * Conceptually retrieve the candidate's CV analysis state.
   */
  async getCVAnalysisState(candidateUserId: string): Promise<CurrentCVSnapshot> {
    return this.getCurrentCV(candidateUserId);
  },

  /**
   * Conceptually retrieve the structured CandidateCV.
   */
  async getStructuredCV(candidateUserId: string): Promise<CandidateCV | null> {
    const snap = await this.getCurrentCV(candidateUserId);
    return snap.reviewed_cv ?? snap.raw_extraction ?? null;
  },

  /**
   * Get download URL for CV document (data URL or blob fallback in frontend).
   */
  async getCVDownloadUrl(storagePath: string): Promise<string | null> {
    if (!storagePath) return null;
    return '#';
  },

  /**
   * Save candidate corrections to the working reviewed CV.
   */
  async updateCVReview(
    candidateUserId: string,
    documentId: string,
    reviewedCV: CandidateCV
  ): Promise<{ success: boolean; error?: string }> {
    const snapshot = readStoredSnapshot(candidateUserId);
    if (!snapshot) return { success: false, error: 'No active CV found' };

    snapshot.reviewed_cv = reviewedCV;
    writeStoredSnapshot(candidateUserId, snapshot);
    return { success: true };
  },

  /**
   * Freeze and confirm the reviewed CV snapshot.
   * Authoritative source for AI Technical Assessment prerequisite.
   */
  async confirmCV(
    candidateUserId: string,
    documentId: string,
    confirmedCV: CandidateCV
  ): Promise<CVAnalysisEnvelope> {
    const snapshot = readStoredSnapshot(candidateUserId) || {
      has_cv: true,
      document_id: documentId,
      candidate_user_id: candidateUserId,
    };

    const confirmedAt = new Date().toISOString();
    snapshot.analysis_status = 'confirmed';
    snapshot.confirmed_cv = confirmedCV;
    snapshot.reviewed_cv = confirmedCV;
    snapshot.confirmed_at = confirmedAt;

    writeStoredSnapshot(candidateUserId, snapshot);

    return {
      documentId,
      status: 'confirmed',
      confirmedCV,
      reviewedCV: confirmedCV,
      confirmedAt,
    };
  },

  /**
   * Conceptually confirm the CV analysis.
   */
  async confirmCVAnalysis(
    candidateUserId: string,
    documentId: string,
    confirmedCV: CandidateCV
  ): Promise<CVAnalysisEnvelope> {
    return this.confirmCV(candidateUserId, documentId, confirmedCV);
  },

  /**
   * Evaluate AI Technical Assessment prerequisite status.
   */
  async getPrerequisite(candidateUserId: string): Promise<CVPrerequisiteResult> {
    if (!candidateUserId) {
      return {
        is_ready: false,
        reason: 'no_cv',
        message: 'Please sign in to verify your CV analysis.',
      };
    }

    const snapshot = readStoredSnapshot(candidateUserId);
    if (!snapshot || !snapshot.has_cv) {
      return {
        is_ready: false,
        reason: 'no_cv',
        message: 'No technical CV has been uploaded yet. Please upload your CV from your Profile.',
      };
    }

    if (snapshot.analysis_status === 'confirmed' && snapshot.confirmed_cv) {
      return {
        is_ready: true,
        document_id: snapshot.document_id,
        analysis_id: snapshot.analysis_id,
        original_filename: snapshot.original_filename,
        status: 'confirmed',
        confirmed_at: snapshot.confirmed_at,
        confirmed_cv: snapshot.confirmed_cv,
        message: 'CV context successfully confirmed for AI Technical Assessment.',
      };
    }

    return {
      is_ready: false,
      reason: 'review_required',
      document_id: snapshot.document_id,
      analysis_id: snapshot.analysis_id,
      original_filename: snapshot.original_filename,
      status: snapshot.analysis_status || 'review_required',
      message: 'Please review and confirm your CV analysis before proceeding to AI Technical Assessment.',
    };
  },

  /**
   * Developer / Demo utility: Injects realistic structured analysis for testing.
   */
  async injectTestAnalysis(
    candidateUserId: string,
    documentId: string,
    customCV?: CandidateCV
  ): Promise<{ success: boolean; analysisId?: string; error?: string }> {
    const fixture = customCV || getDevelopmentCVFixture();
    const snapshot = readStoredSnapshot(candidateUserId) || {
      has_cv: true,
      document_id: documentId,
      candidate_user_id: candidateUserId,
      original_filename: 'Candidate_Resume.pdf',
    };

    snapshot.analysis_status = 'review_required';
    snapshot.raw_extraction = fixture;
    snapshot.reviewed_cv = fixture;
    snapshot.analyzed_at = new Date().toISOString();

    writeStoredSnapshot(candidateUserId, snapshot);
    return { success: true, analysisId: snapshot.analysis_id || 'ana_test' };
  },

  /**
   * Pure functional section update helper.
   */
  updateSection<K extends keyof CandidateCV>(
    cv: CandidateCV,
    sectionKey: K,
    data: CandidateCV[K]
  ): CandidateCV {
    return { ...cv, [sectionKey]: data };
  },

  /**
   * Pure functional multi-field update helper.
   */
  updateStructuredCV(cv: CandidateCV, patch: Partial<CandidateCV>): CandidateCV {
    return { ...cv, ...patch };
  },
};

export default CVAnalysisService;
