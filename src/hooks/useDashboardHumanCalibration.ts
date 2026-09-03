/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — useDashboardHumanCalibration Hook
   ─────────────────────────────────────────────────────────────────────────
   Single source of truth for the Candidate Dashboard Human Calibration &
   Human Interview state.
   Directly queries hosted Supabase via canonical getHumanInterviewState().

   Approved Lifecycle:
     1. awaiting_assignment: Calm waiting state. No invented interviewer, no fake appointment.
     2. choose_time: Real Jadeer-assigned interviewer. Indicates scheduling required.
     3. confirmed: Real persisted Human Calibration session with date, time, timezone, meeting link.
     4. completed: Real completed calibration with candidate-visible evaluation score & verified badge.
     5. cancelled: Session cleared; reverts to choose_time (if assigned) or awaiting_assignment.

   Stale Prevention:
     - Fetches on mount and candidateUserId changes
     - Re-syncs on window focus & document visibilitychange
     - Listens to 'jadeer:human-calibration-changed' domain event
   ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import {
  getHumanInterviewState,
  type HumanInterviewLifecycleState,
  type AssignedExpertProfile,
  type ConfirmedSessionSummary,
  type CandidateEvaluationResult,
} from '@/services/humanInterviewService';

export interface ConfirmedCalibrationDetails {
  sessionId: string;
  interviewerName: string;
  interviewerTitle: string;
  interviewerCompany: string;
  interviewerInitials: string;
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
  meetingUrl?: string;
  status: string;
  googleCalendarEventId?: string | null;
  googleCalendarSyncStatus?: 'not_connected' | 'pending' | 'synced' | 'failed';
  googleCalendarSyncedAt?: string | null;
  googleCalendarLastError?: string | null;
  googleCalendarHtmlLink?: string | null;
}

export interface UseDashboardHumanCalibrationResult {
  /** Authoritative state from Supabase */
  state: 'awaiting_assignment' | 'choose_time' | 'confirmed' | 'completed';
  isCompleted: boolean;
  expert: AssignedExpertProfile | null;
  session: ConfirmedSessionSummary | null;
  evaluation: CandidateEvaluationResult | null;
  assignedBy?: string;
  isLoading: boolean;
  error: string | null;
  /** Normalized details for the confirmed session card/preview */
  confirmedDetails: ConfirmedCalibrationDetails | null;
  /** Stepper & ribbon label helpers */
  validationStageLabel: string;
  stepperPhaseNumber: number;
  refetch: () => Promise<void>;
}

export function useDashboardHumanCalibration(
  candidateUserId: string | undefined
): UseDashboardHumanCalibrationResult {
  const [data, setData] = useState<HumanInterviewLifecycleState>({
    state: 'awaiting_assignment',
    isCompleted: false,
    status: 'awaiting_assignment',
    expert: null,
    session: null,
    evaluation: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    if (!candidateUserId) {
      setData({
        state: 'awaiting_assignment',
        isCompleted: false,
        status: 'awaiting_assignment',
        expert: null,
        session: null,
        evaluation: null,
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const stateData = await getHumanInterviewState(candidateUserId);
      setData(stateData);
    } catch (err: any) {
      console.error('[useDashboardHumanCalibration] Error fetching calibration state:', err);
      setError(err?.message || 'Failed to sync Human Calibration state');
    } finally {
      setIsLoading(false);
    }
  }, [candidateUserId]);

  useEffect(() => {
    fetchState();

    const handleFocus = () => {
      fetchState();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchState();
      }
    };

    const handleCalibrationChanged = () => {
      fetchState();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('jadeer:human-calibration-changed', handleCalibrationChanged);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('jadeer:human-calibration-changed', handleCalibrationChanged);
    };
  }, [fetchState]);

  // Derive confirmed details when state === 'confirmed' and session exists
  const confirmedDetails: ConfirmedCalibrationDetails | null =
    data.state === 'confirmed' && data.session
      ? {
          sessionId: data.session.sessionId,
          interviewerName: data.expert?.fullName || 'Assigned Interviewer',
          interviewerTitle: data.expert?.title || 'Principal Systems Lead',
          interviewerCompany: data.expert?.company || 'Jadeer Calibration Panel',
          interviewerInitials: data.expert?.initials || 'JP',
          scheduledDate:
            data.session.dateKey ||
            new Date(data.session.scheduledStartTime).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }),
          scheduledTime:
            data.session.timeLabel ||
            new Date(data.session.scheduledStartTime).toLocaleTimeString(undefined, {
              hour: 'numeric',
              minute: '2-digit',
            }),
          timezone: data.session.timezone || 'Asia/Riyadh',
          meetingUrl: data.session.meetingUrl || undefined,
          status: data.session.status,
          googleCalendarEventId: data.session.googleCalendarEventId || null,
          googleCalendarSyncStatus: data.session.googleCalendarSyncStatus || 'not_connected',
          googleCalendarSyncedAt: data.session.googleCalendarSyncedAt || null,
          googleCalendarLastError: data.session.googleCalendarLastError || null,
          googleCalendarHtmlLink: data.session.googleCalendarHtmlLink || null,
        }
      : null;

  // Validation stage metric ribbon label
  const validationStageLabel =
    data.state === 'completed'
      ? data.evaluation?.overallScore
        ? `Calibrated: ${data.evaluation.overallScore}%`
        : 'Phase 3: Calibrated'
      : data.state === 'confirmed'
      ? 'Phase 3: Confirmed'
      : data.state === 'choose_time'
      ? 'Phase 3: Scheduling'
      : 'Phase 2: AI Assessment';

  // Stepper phase number
  const stepperPhaseNumber = data.state === 'completed' ? 4 : data.state === 'confirmed' || data.state === 'choose_time' ? 3 : 2;

  return {
    state: data.state,
    isCompleted: data.isCompleted,
    expert: data.expert || null,
    session: data.session || null,
    evaluation: data.evaluation || null,
    assignedBy: data.assignedBy,
    isLoading,
    error,
    confirmedDetails,
    validationStageLabel,
    stepperPhaseNumber,
    refetch: fetchState,
  };
}
