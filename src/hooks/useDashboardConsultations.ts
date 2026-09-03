/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — useDashboardConsultations Hook
   ─────────────────────────────────────────────────────────────────────────
   Canonical data hook for the Candidate Dashboard "My Consultations" preview.
   Consumes the same single source of truth as the full consultations page:
   getMyConsultations(candidateUserId).

   Rules enforced:
     1. Prioritizes upcoming confirmed consultations (status: 'SCHEDULED' | 'IN_PROGRESS')
     2. Sorts upcoming sessions by scheduled start time ascending (nearest first)
     3. If no upcoming consultations exist, returns empty array so Dashboard
        renders the clean empty state rather than fake or stale data
     4. Persisted session fields used for consultant name, topic, scheduled date/time,
        timezone, status, and meeting link
     5. Refetches automatically on mount, on candidateUserId change, on window focus,
        and when 'jadeer:consultations-changed' event is dispatched (booking/reschedule/cancel).
   ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import { getMyConsultations, type CandidateConsultationItem } from '@/services/consultationService';

/* ── Dashboard consultation record shape ─────────────────────────────────── */
export interface DashboardConsultationItem {
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorCompany: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  topicTitle: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  notes?: string;
  timezone?: string;
  timeLabel?: string;
}

/* ── Map CandidateConsultationItem → DashboardConsultationItem ───────────── */
function mapToDashboardItem(s: CandidateConsultationItem): DashboardConsultationItem {
  const startMs = new Date(s.scheduledStartTime).getTime();
  const endMs = new Date(s.scheduledEndTime).getTime();
  const durationMinutes =
    isNaN(startMs) || isNaN(endMs)
      ? 60
      : Math.max(15, Math.round((endMs - startMs) / 60000));

  const statusMap: Record<CandidateConsultationItem['status'], DashboardConsultationItem['status']> = {
    scheduled: 'SCHEDULED',
    in_progress: 'IN_PROGRESS',
    completed: 'COMPLETED',
    cancelled: 'CANCELLED',
  };

  const cd = s.consultationDetails;

  return {
    id: s.sessionId,
    mentorName: s.consultant.fullName,
    mentorTitle: s.consultant.title,
    mentorCompany: s.consultant.company,
    status: statusMap[s.status] ?? 'SCHEDULED',
    topicTitle: cd?.topicTitle || cd?.topic || 'Technical Consultation',
    scheduledAt: s.scheduledStartTime,
    durationMinutes,
    meetingLink: s.meetingUrl || undefined,
    notes: cd?.goal || cd?.candidateMessage || undefined,
    timezone: s.timezone || 'Asia/Riyadh',
    timeLabel: s.timeLabel,
  };
}

export interface UseDashboardConsultationsResult {
  /**
   * Upcoming confirmed consultations only (status: 'SCHEDULED' | 'IN_PROGRESS'),
   * sorted ascending by scheduled start time (nearest upcoming first).
   * Empty if candidate has no upcoming consultations.
   */
  consultations: DashboardConsultationItem[];
  /**
   * All non-cancelled candidate consultations (including completed).
   */
  allConsultations: DashboardConsultationItem[];
  isLoading: boolean;
  error: string | null;
  /** Count of active upcoming bookings */
  activeCount: number;
  /** Total count of all non-cancelled sessions */
  totalCount: number;
  /** Trigger manual refetch */
  refetch: () => Promise<void>;
}

export function useDashboardConsultations(
  candidateUserId: string | undefined
): UseDashboardConsultationsResult {
  const [upcomingConsultations, setUpcomingConsultations] = useState<DashboardConsultationItem[]>([]);
  const [allConsultations, setAllConsultations] = useState<DashboardConsultationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = useCallback(async () => {
    if (!candidateUserId) {
      setUpcomingConsultations([]);
      setAllConsultations([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const raw = await getMyConsultations(candidateUserId);
      const mapped = (raw || [])
        .filter((s) => s.status !== 'cancelled')
        .map(mapToDashboardItem);

      // Filter for upcoming confirmed sessions only (SCHEDULED | IN_PROGRESS)
      const upcoming = mapped
        .filter((s) => s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS')
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

      setUpcomingConsultations(upcoming);
      setAllConsultations(mapped);
    } catch (err: any) {
      console.error('[useDashboardConsultations] Error fetching consultations:', err);
      setError(err?.message || 'Failed to load consultations');
      setUpcomingConsultations([]);
      setAllConsultations([]);
    } finally {
      setIsLoading(false);
    }
  }, [candidateUserId]);

  useEffect(() => {
    fetchConsultations();

    // Refetch when window regains focus or document becomes visible
    const handleFocus = () => {
      fetchConsultations();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchConsultations();
      }
    };

    // Refetch when consultation is booked, rescheduled, or cancelled
    const handleConsultationChanged = () => {
      fetchConsultations();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('jadeer:consultations-changed', handleConsultationChanged);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('jadeer:consultations-changed', handleConsultationChanged);
    };
  }, [fetchConsultations]);

  return {
    consultations: upcomingConsultations,
    allConsultations,
    isLoading,
    error,
    activeCount: upcomingConsultations.length,
    totalCount: allConsultations.length,
    refetch: fetchConsultations,
  };
}
