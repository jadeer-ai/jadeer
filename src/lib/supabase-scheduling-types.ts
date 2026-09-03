/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — SHARED SCHEDULING & SESSIONS BACKEND TYPES
   ─────────────────────────────────────────────────────────────────────────
   Type definitions, database row shapes, RPC payload contracts,
   and query builders for Stage 02B Human Technical Calibration
   and 1-to-1 Mentorship Consultations.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { SoftwareTrack } from './db-types';

// ── Enums ────────────────────────────────────────────────────────────────

export type ExpertRole = 'INTERVIEWER' | 'CONSULTANT' | 'BOTH';

export type SlotStatus = 'available' | 'held' | 'booked' | 'blocked';

export type SessionType = 'human_interview' | 'consultation';

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled' | 'in_progress' | 'no_show';

export type EvaluationRecommendation =
  | 'STRONG_HIRE'
  | 'HIRE'
  | 'CALIBRATED_JUNIOR'
  | 'NEEDS_PRACTICE';

// ── Database Row Models ──────────────────────────────────────────────────

export interface ExpertRow {
  id: string;
  user_id: string | null;
  role: ExpertRole;
  full_name: string;
  initials: string | null;
  title: string;
  company: string;
  bio: string | null;
  track: SoftwareTrack;
  specialties: string[];
  rating: number;
  review_count: number;
  sessions_completed: number;
  avatar_url: string | null;
  languages: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpertAvailabilitySlotRow {
  id: string;
  expert_id: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: SlotStatus;
  held_until: string | null;
  held_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionRow {
  id: string;
  candidate_id: string;
  candidate_user_id: string;
  expert_id: string;
  slot_id: string | null;
  session_type: SessionType;
  status: SessionStatus;
  scheduled_start_time: string;
  scheduled_end_time: string;
  timezone: string;
  meeting_provider: string | null;
  meeting_url: string | null;
  cancellation_reason: string | null;
  cancelled_by: string | null;
  cancelled_at: string | null;
  rescheduled_from_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface HumanInterviewDetailRow {
  id: string;
  session_id: string;
  software_track: SoftwareTrack;
  calibration_stage: string;
  candidate_notes: string | null;
  target_role: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsultationDetailRow {
  id: string;
  session_id: string;
  topic: string;
  topic_title: string;
  goal: string | null;
  candidate_message: string | null;
  outcome_summary: string | null;
  action_items: string[] | null;
  deliverables: Record<string, unknown> | null;
  candidate_rating: number | null;
  candidate_feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface HumanInterviewEvaluationRow {
  id: string;
  session_id: string;
  evaluator_id: string;
  technical_score: number;
  problem_solving_score: number;
  communication_score: number;
  reasoning_score: number;
  overall_score: number;
  recommendation: EvaluationRecommendation | string;
  candidate_visible_feedback: string;
  strengths: string[];
  recommendations: string[];
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface HumanInterviewInternalNoteRow {
  id: string;
  evaluation_id: string;
  evaluator_id: string;
  internal_notes: string;
  private_flags: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ── Composite / Joined Models (For API & UI Consumption) ─────────────────

export interface SessionWithDetails extends SessionRow {
  expert?: ExpertRow;
  slot?: ExpertAvailabilitySlotRow;
  human_interview_details?: HumanInterviewDetailRow | null;
  consultation_details?: ConsultationDetailRow | null;
  evaluation?: HumanInterviewEvaluationRow | null;
}

export interface ExpertWithSlots extends ExpertRow {
  availability_slots?: ExpertAvailabilitySlotRow[];
}

// ── Atomic RPC Contracts ─────────────────────────────────────────────────

/** Parameters for atomic session booking via PostgreSQL RPC `book_session_atomic` */
export interface BookSessionAtomicParams {
  p_candidate_user_id: string;
  p_slot_id: string;
  p_session_type: SessionType;
  p_timezone?: string;
  p_meeting_url?: string | null;
  // Human Interview specific
  p_software_track?: SoftwareTrack;
  p_candidate_notes?: string | null;
  p_calibration_stage?: string;
  // Consultation specific
  p_consultation_topic?: string | null;
  p_consultation_topic_title?: string | null;
  p_consultation_goal?: string | null;
  p_consultation_message?: string | null;
}

/** Return payload from `book_session_atomic` */
export interface BookSessionAtomicResult {
  success: boolean;
  session_id: string;
  expert_id: string;
  expert_name: string;
  expert_title: string;
  expert_company: string;
  slot_id: string;
  session_type: SessionType;
  scheduled_start_time: string;
  scheduled_end_time: string;
  meeting_url: string;
  status: 'scheduled';
}

/** Parameters for cancellation via PostgreSQL RPC `cancel_session_atomic` */
export interface CancelSessionAtomicParams {
  p_session_id: string;
  p_cancelled_by: 'candidate' | 'expert' | 'admin';
  p_cancellation_reason?: string | null;
}

/** Return payload from `cancel_session_atomic` */
export interface CancelSessionAtomicResult {
  success: boolean;
  session_id: string;
  status: 'cancelled';
  message?: string;
}

/** Parameters for submitting interview evaluation via RPC `submit_human_interview_evaluation_atomic` */
export interface SubmitHumanInterviewEvaluationParams {
  p_session_id: string;
  p_evaluator_id: string;
  p_technical_score: number;
  p_problem_solving_score: number;
  p_communication_score: number;
  p_reasoning_score: number;
  p_overall_score: number;
  p_recommendation: EvaluationRecommendation | string;
  p_candidate_visible_feedback: string;
  p_internal_notes?: string | null;
  p_strengths?: string[];
  p_recommendations?: string[];
}

/** Return payload from `submit_human_interview_evaluation_atomic` */
export interface SubmitHumanInterviewEvaluationResult {
  success: boolean;
  evaluation_id: string;
  session_id: string;
  overall_score: number;
  status: 'completed';
}

/** Return payload from helper RPC `get_candidate_human_interview_status` */
export interface CandidateHumanInterviewStatusResult {
  has_interview: boolean;
  is_completed: boolean;
  session_id?: string;
  status: SessionStatus | 'not_scheduled';
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  timezone?: string;
  meeting_url?: string;
  expert_name?: string;
  expert_title?: string;
  expert_company?: string;
  overall_score?: number;
  recommendation?: string;
  candidate_feedback?: string;
  strengths?: string[];
  recommendations?: string[];
}
