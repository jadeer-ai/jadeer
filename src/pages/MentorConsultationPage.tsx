import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import * as ConsultationService from '@/services/consultationService';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  FileText,
  X,
  Award,
  Cpu,
  Code2,
  Brain,
  ChevronRight,
  AlertCircle,
  Laptop,
  MessageSquare,
  CalendarPlus,
  Loader2,
  RefreshCw,
  Search,
  Briefcase,
  Layers,
  Star,
  Download,
  ExternalLink,
  Users,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — 1-TO-1 CONSULTATIONS MODULE (/consultations)
   ─────────────────────────────────────────────────────────────────────────
   Reuses shared scheduling & session infrastructure:
   1. Candidate selects topic & inputs optional goal
   2. Queries active consultants matching topic and candidate track
   3. Candidate selects one consultant
   4. Scopes available slots strictly to the selected consultant
   5. Displays slots grouped by date in local timezone
   6. Enables confirmation ONLY when both consultant and slot are selected
   7. Atomic booking via shared Supabase RPC (no double booking)
   8. Saves topic, goal, and message in consultation_details
   9. Replaces selection with confirmed summary (Calendar, Reschedule, Cancel)
   10. Multi-session history & post-session deliverables
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Topic Icon Mapping ─────────────────────────────────────────────────── */
const TOPIC_ICON_MAP: Record<string, any> = {
  'career-direction': Briefcase,
  'technical-gap': Cpu,
  'project-guidance': Code2,
  'interview-prep': Brain,
  'portfolio-review': FileText,
  'job-readiness': Sparkles,
};

/* ── Format Helpers ─────────────────────────────────────────────────────── */
function formatDateLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatTimeLabel(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoStr;
  }
}

function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTimeLabel(startIso)} – ${formatTimeLabel(endIso)}`;
}

function generateGoogleCalendarUrl(params: {
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
}): string {
  try {
    const start = new Date(params.startTime).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const end = new Date(params.endTime).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const qs = new URLSearchParams({
      action: 'TEMPLATE',
      text: params.title,
      dates: `${start}/${end}`,
      ctz: 'Asia/Riyadh',
      details: params.description,
      location: params.location,
    });
    return `https://calendar.google.com/calendar/render?${qs.toString()}`;
  } catch {
    return 'https://calendar.google.com';
  }
}

/* ── Sanitized Candidate-Friendly Error Helper ────────────────────────── */
function sanitizeCandidateError(error: any, fallback: string): string {
  const msg = typeof error === 'string' ? error : error?.message || '';
  if (!msg) return fallback;
  if (/unique constraint|duplicate key|already booked|no longer available/i.test(msg)) {
    return 'This time slot was just reserved by another candidate. Please choose another time.';
  }
  if (/not belong to your assigned|same consultant|unauthorized|forbidden/i.test(msg)) {
    return 'Rescheduling is only permitted with the same consultant.';
  }
  if (/network|fetch|econnrefused/i.test(msg)) {
    return 'Temporary connection interruption. Please verify your connection and retry.';
  }
  if (/postgres|p2002|p2025|sql|syntax/i.test(msg)) {
    return 'The scheduling service encountered an unexpected error. Please try again in a few moments.';
  }
  return msg;
}

export default function MentorConsultationPage() {
  const { profile } = useUserProfile();
  const candidateUserId = 'usr-cand-001';
  const candidateTrack = profile.track || 'Backend Development';

  /* ── Page Level Tabs ── */
  const [activeMainTab, setActiveMainTab] = useState<'book' | 'my-sessions'>('book');

  /* ── Core Data State ── */
  const [topics, setTopics] = useState<ConsultationService.ConsultationTopic[]>([]);
  const [consultants, setConsultants] = useState<ConsultationService.FactualConsultant[]>([]);
  const [myConsultations, setMyConsultations] = useState<ConsultationService.CandidateConsultationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultantsLoading, setIsConsultantsLoading] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isReschedulingLoading, setIsReschedulingLoading] = useState(false);

  /* ── Booking Wizard State ── */
  const [selectedTopicId, setSelectedTopicId] = useState<string>('career-direction');
  const [candidateGoal, setCandidateGoal] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState<ConsultationService.FactualConsultant | null>(null);
  const [consultantSlots, setConsultantSlots] = useState<Record<string, ConsultationService.ConsultationSlot[]>>({});
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /* ── View Modes for Booking Tab: Confirmed Summary vs Selection Wizard ── */
  const [isBookingNewSession, setIsBookingNewSession] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationService.BookConsultationResult | null>(null);

  /* ── Reschedule Modal State ── */
  const [rescheduleSession, setRescheduleSession] = useState<ConsultationService.CandidateConsultationItem | null>(null);
  const [rescheduleSlots, setRescheduleSlots] = useState<Record<string, ConsultationService.ConsultationSlot[]>>({});
  const [rescheduleSelectedSlotId, setRescheduleSelectedSlotId] = useState<string | null>(null);

  /* ── Deliverables Modal State ── */
  const [viewingOutcome, setViewingOutcome] = useState<ConsultationService.ConsultationOutcomeResult | null>(null);
  const [checkedActionItems, setCheckedActionItems] = useState<Record<string, boolean>>({});

  /* ── Toast & Error ── */
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /* ── 1. Initialize Topics & My Consultations ── */
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedTopics, fetchedConsultations] = await Promise.all([
        ConsultationService.getConsultationTopics(),
        ConsultationService.getMyConsultations(candidateUserId),
      ]);
      setTopics(fetchedTopics);
      setMyConsultations(fetchedConsultations);
      if (fetchedTopics.length > 0) {
        setSelectedTopicId(fetchedTopics[0].id);
      }
    } catch (err: any) {
      setErrorMessage(sanitizeCandidateError(err, 'Error loading consultation catalog.'));
    } finally {
      setIsLoading(false);
    }
  }, [candidateUserId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  /* ── 2. Derive Most Recent Upcoming Scheduled Session from Supabase ── */
  const activeUpcomingSession = useMemo(() => {
    return myConsultations.find((s) => s.status === 'scheduled') || null;
  }, [myConsultations]);

  /* ── 3. Load Consultants for Candidate's Technical Track ── */
  useEffect(() => {
    let active = true;
    async function fetchConsultants() {
      setIsConsultantsLoading(true);
      try {
        const list = await ConsultationService.getEligibleConsultants(candidateTrack);
        if (active) {
          setConsultants(list);
          if (selectedConsultant && !list.some((c) => c.id === selectedConsultant.id)) {
            setSelectedConsultant(null);
            setConsultantSlots({});
            setSelectedSlotId(null);
          }
        }
      } catch {
        // silent
      } finally {
        if (active) setIsConsultantsLoading(false);
      }
    }

    fetchConsultants();
    return () => {
      active = false;
    };
  }, [candidateTrack]);

  /* ── 4. Handle Consultant Selection (Load Scoped Availability) ── */
  const handleSelectConsultant = async (consultant: ConsultationService.FactualConsultant) => {
    setSelectedConsultant(consultant);
    setSelectedSlotId(null);

    try {
      const availability = await ConsultationService.getConsultantAvailability(consultant.id);
      setConsultantSlots(availability.slots);
    } catch (err: any) {
      triggerToast(sanitizeCandidateError(err, 'Unable to fetch consultant schedule.'));
    }
  };

  /* ── 5. Confirm Consultation Booking ── */
  const handleConfirmBooking = async () => {
    if (!selectedConsultant || !selectedSlotId || !selectedTopicId) return;

    setIsBookingLoading(true);
    setErrorMessage(null);

    const activeTopic = topics.find((t) => t.id === selectedTopicId);

    try {
      const result = await ConsultationService.bookConsultation({
        candidateUserId,
        consultantId: selectedConsultant.id,
        slotId: selectedSlotId,
        topic: selectedTopicId,
        topicTitle: activeTopic?.title || '1-to-1 Consultation',
        goal: candidateGoal || undefined,
        timezone: 'Asia/Riyadh (GMT+3)',
      });

      setConfirmedBooking({
        ...result,
        consultant: result.consultant || {
          id: selectedConsultant.id,
          fullName: selectedConsultant.fullName,
          initials: selectedConsultant.initials,
          title: selectedConsultant.title,
          company: selectedConsultant.company,
          factualCredential: selectedConsultant.factualCredential,
        },
      });
      setIsBookingNewSession(false);

      // Reload sessions list from backend
      const refreshedList = await ConsultationService.getMyConsultations(candidateUserId);
      setMyConsultations(refreshedList);

      triggerToast(`Consultation with ${selectedConsultant.fullName} confirmed!`);
    } catch (err: any) {
      setErrorMessage(sanitizeCandidateError(err, 'Booking failed.'));
    } finally {
      setIsBookingLoading(false);
    }
  };

  /* ── 6. Open Reschedule Modal ── */
  const handleOpenRescheduleModal = async (session: ConsultationService.CandidateConsultationItem) => {
    setRescheduleSession(session);
    setRescheduleSelectedSlotId(null);

    try {
      const availability = await ConsultationService.getConsultantAvailability(session.consultant.id);
      setRescheduleSlots(availability.slots);
    } catch {
      triggerToast('Unable to load reschedule slots.');
    }
  };

  /* ── 7. Submit Reschedule (Atomic Slot Swap - Same Consultant) ── */
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleSession || !rescheduleSelectedSlotId) return;

    setIsReschedulingLoading(true);
    try {
      await ConsultationService.rescheduleConsultation({
        sessionId: rescheduleSession.sessionId,
        candidateUserId,
        newSlotId: rescheduleSelectedSlotId,
      });

      setRescheduleSession(null);
      setRescheduleSelectedSlotId(null);

      // Reload sessions from backend
      const refreshedList = await ConsultationService.getMyConsultations(candidateUserId);
      setMyConsultations(refreshedList);

      // If viewing confirmed booking, update its details
      if (confirmedBooking && confirmedBooking.sessionId === rescheduleSession.sessionId) {
        const updated = refreshedList.find((s) => s.sessionId === rescheduleSession.sessionId);
        if (updated) {
          setConfirmedBooking({
            ...confirmedBooking,
            dateKey: updated.dateKey || formatDateLabel(updated.scheduledStartTime),
            timeLabel: updated.timeLabel || formatTimeRange(updated.scheduledStartTime, updated.scheduledEndTime),
            scheduledStartTime: updated.scheduledStartTime,
            scheduledEndTime: updated.scheduledEndTime,
          });
        }
      }

      triggerToast('Consultation rescheduled successfully with your consultant!');
    } catch (err: any) {
      triggerToast(sanitizeCandidateError(err, 'Failed to reschedule consultation.'));
    } finally {
      setIsReschedulingLoading(false);
    }
  };

  /* ── 8. Cancel Consultation Session (Releases Availability) ── */
  const handleCancelSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to cancel this consultation? The slot will be returned to the open schedule.')) {
      return;
    }

    try {
      await ConsultationService.cancelConsultation({
        sessionId,
        cancelledBy: 'candidate',
        reason: 'Candidate requested cancellation via portal',
      });

      const refreshedList = await ConsultationService.getMyConsultations(candidateUserId);
      setMyConsultations(refreshedList);

      if (confirmedBooking?.sessionId === sessionId) {
        setConfirmedBooking(null);
      }
      triggerToast('Consultation cancelled. Availability slot reopened.');
    } catch (err: any) {
      triggerToast(sanitizeCandidateError(err, 'Cancellation failed.'));
    }
  };

  /* ── 9. View Outcome Deliverables Modal ── */
  const handleViewOutcome = async (sessionId: string) => {
    try {
      const outcome = await ConsultationService.getConsultationOutcome(sessionId, candidateUserId);
      setViewingOutcome(outcome);
    } catch {
      triggerToast('Unable to load session outcome.');
    }
  };

  /* ── 10. Copy Meeting Link Helper ── */
  const handleCopyMeetingLink = (url: string) => {
    navigator.clipboard.writeText(url);
    triggerToast('Meeting URL copied to clipboard!');
  };

  /* ── Search Filter for Consultants ── */
  const filteredConsultants = useMemo(() => {
    if (!searchQuery.trim()) return consultants;
    const q = searchQuery.toLowerCase();
    return consultants.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.specialties.some((s) => s.toLowerCase().includes(q))
    );
  }, [consultants, searchQuery]);

  /* ── Session Counts ── */
  const upcomingCount = useMemo(
    () => myConsultations.filter((c) => c.status === 'scheduled').length,
    [myConsultations]
  );
  const completedCount = useMemo(
    () => myConsultations.filter((c) => c.status === 'completed').length,
    [myConsultations]
  );

  /* ── Active Session to Display in Confirmed View ── */
  const currentDisplaySession = useMemo(() => {
    if (confirmedBooking) return confirmedBooking;
    if (activeUpcomingSession) {
      return {
        sessionId: activeUpcomingSession.sessionId,
        consultant: activeUpcomingSession.consultant,
        topic: activeUpcomingSession.consultationDetails?.topic || 'career-direction',
        topicTitle: activeUpcomingSession.consultationDetails?.topicTitle || '1-to-1 Technical Consultation',
        dateKey: activeUpcomingSession.dateKey || formatDateLabel(activeUpcomingSession.scheduledStartTime),
        timeLabel: activeUpcomingSession.timeLabel || formatTimeRange(activeUpcomingSession.scheduledStartTime, activeUpcomingSession.scheduledEndTime),
        goal: activeUpcomingSession.consultationDetails?.goal || candidateGoal || undefined,
        scheduledStartTime: activeUpcomingSession.scheduledStartTime,
        scheduledEndTime: activeUpcomingSession.scheduledEndTime,
        timezone: activeUpcomingSession.timezone || 'Asia/Riyadh (GMT+3)',
        meetingUrl: activeUpcomingSession.meetingUrl,
        status: activeUpcomingSession.status,
      };
    }
    return null;
  }, [confirmedBooking, activeUpcomingSession, candidateGoal]);

  return (
    <div className="w-full space-y-8 animate-[fade-in_0.3s_ease] pb-16 py-2 sm:py-4">

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-[#0F172A] text-xs font-semibold flex items-center gap-2.5 shadow-lg fixed bottom-6 right-6 z-50 animate-[slide-up_0.2s_ease]">
          <CheckCircle2 className="w-4 h-4 text-[#5E8174] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Error Banner ── */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-auto cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         1. HERO HEADER WITH TRACK BADGE & CONSULTATION TAB NAVIGATION
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#5E8174]/40" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-semibold border border-[#5E8174]/20">
                <Users className="w-3.5 h-3.5 text-[#5E8174]" />
                <span>1-to-1 Technical Consultations</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F8F9FA] text-slate-600 text-xs font-medium border border-slate-200">
                <span>Candidate Track:</span>
                <strong className="text-[#0F172A] font-semibold">{candidateTrack}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              1-to-1 Engineering Consultations & Mentorship
            </h1>
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
              Connect directly with verified Jadeer technical mentors for 1-hour sessions focused on system architecture, technical gap closure, portfolio defense, or engineering career strategy.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#F8F9FA] border border-slate-200 shrink-0 self-start lg:self-center">
            <button
              type="button"
              onClick={() => {
                setActiveMainTab('book');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeMainTab === 'book'
                  ? 'bg-[#5E8174] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentDisplaySession && !isBookingNewSession ? 'Confirmed Consultation' : 'Book Consultation'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('my-sessions')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeMainTab === 'my-sessions'
                  ? 'bg-[#5E8174] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>My Consultations</span>
              {(upcomingCount > 0 || completedCount > 0) && (
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                  {upcomingCount + completedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         TAB A: BOOK A CONSULTATION (OR CONFIRMED SUMMARY)
         ═══════════════════════════════════════════════════════════════ */}
      {activeMainTab === 'book' && (
        <div className="space-y-8">

          {/* ─────────────────────────────────────────────────────────
             VIEW 1: CONFIRMED CONSULTATION SUMMARY (REPLACES SELECTION)
             Rendered when a confirmed session exists and candidate is not booking another session.
             ───────────────────────────────────────────────────────── */}
          {currentDisplaySession && !isBookingNewSession ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6 animate-[fade-in_0.3s_ease]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#5E8174] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5E8174]">
                      Confirmed 1-to-1 Consultation
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#0F172A]">{currentDisplaySession.topicTitle}</h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-semibold border border-[#5E8174]/20 self-start sm:self-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Session Confirmed</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Consultant Profile */}
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Selected Consultant
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {currentDisplaySession.consultant.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">{currentDisplaySession.consultant.fullName}</h4>
                      <p className="text-[11px] text-slate-500">{currentDisplaySession.consultant.title}</p>
                      <span className="inline-block text-[10px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2 py-0.5 rounded-md border border-[#5E8174]/20 mt-1">
                        {currentDisplaySession.consultant.factualCredential}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scheduled Time & Timezone */}
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Scheduled Time
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#5E8174]" />
                      <span>{currentDisplaySession.dateKey}</span>
                    </p>
                    <p className="text-xs font-semibold text-[#5E8174]">{currentDisplaySession.timeLabel}</p>
                    <p className="text-[11px] text-slate-400">{currentDisplaySession.timezone} • 60-minute duration</p>
                  </div>
                </div>
              </div>

              {/* Consultation Context Box for Consultant */}
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Session Focus Context (Shared with Consultant)
                  </span>
                  <span className="text-[10px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2 py-0.5 rounded-md">
                    {currentDisplaySession.topicTitle}
                  </span>
                </div>
                {(currentDisplaySession as any).goal && (
                  <p className="text-xs text-[#334155] leading-relaxed italic">
                    "{(currentDisplaySession as any).goal}"
                  </p>
                )}
              </div>

              {/* Secure Video Room Access */}
              <div className="p-5 rounded-2xl bg-[#5E8174]/[0.06] border border-[#5E8174]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#5E8174] text-white flex items-center justify-center shadow-2xs shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0F172A]">Jadeer Secure Video Room</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate max-w-sm">
                      {currentDisplaySession.meetingUrl}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyMeetingLink(currentDisplaySession.meetingUrl)}
                    className="px-3.5 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </button>
                  <a
                    href={currentDisplaySession.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4D6D62] transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Video Call</span>
                  </a>
                </div>
              </div>

              {/* Secondary Actions: Calendar, Reschedule, Cancel, and Book Another */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={generateGoogleCalendarUrl({
                      title: `1-to-1 Consultation: ${currentDisplaySession.topicTitle} — ${currentDisplaySession.consultant.fullName}`,
                      startTime: currentDisplaySession.scheduledStartTime,
                      endTime: currentDisplaySession.scheduledEndTime,
                      description: `1-to-1 Jadeer Consultation with ${currentDisplaySession.consultant.fullName}.\n\nMeeting URL: ${currentDisplaySession.meetingUrl}`,
                      location: currentDisplaySession.meetingUrl,
                    })}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8F9FA] hover:bg-white text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-[#5E8174]" />
                    <span>Add to Google Calendar</span>
                  </a>

                  {/* Reschedule Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const matched = myConsultations.find((s) => s.sessionId === currentDisplaySession.sessionId);
                      if (matched) handleOpenRescheduleModal(matched);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8F9FA] hover:bg-white text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#5E8174]" />
                    <span>Reschedule</span>
                  </button>

                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={() => handleCancelSession(currentDisplaySession.sessionId)}
                    className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer px-2"
                  >
                    Cancel Session
                  </button>
                </div>

                {/* Book Another Consultation */}
                <button
                  type="button"
                  onClick={() => setIsBookingNewSession(true)}
                  className="px-4 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer ml-auto"
                >
                  + Book Another Consultation
                </button>
              </div>
            </div>
          ) : (
            /* ─────────────────────────────────────────────────────────
               VIEW 2: SELECTION FLOW (TOPIC → CONSULTANT → SCOPED SLOTS)
               ───────────────────────────────────────────────────────── */
            <div className="space-y-8">

              {/* Navigation Back if returning to active session */}
              {currentDisplaySession && isBookingNewSession && (
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsBookingNewSession(false)}
                    className="text-xs font-semibold text-[#5E8174] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>← View My Confirmed Consultation</span>
                  </button>
                </div>
              )}

              {/* ── STEP 1: CHOOSE TOPIC & OPTIONAL GOAL ── */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#5E8174] text-white text-[11px] font-bold flex items-center justify-center">
                        1
                      </span>
                      <span>Consultation Focus & Session Context</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Select a topic and add optional questions to give your consultant context before the session.
                    </p>
                  </div>
                </div>

                {/* Standardized Topics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {topics.map((topic) => {
                    const IconComponent = TOPIC_ICON_MAP[topic.id] || Briefcase;
                    const isSelected = selectedTopicId === topic.id;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setSelectedTopicId(topic.id)}
                        className={`p-4 rounded-2xl text-left border transition-all cursor-pointer space-y-2 relative ${
                          isSelected
                            ? 'bg-[#5E8174]/[0.06] border-[#5E8174] shadow-xs'
                            : 'bg-[#F8F9FA] hover:bg-white border-slate-200/80 hover:border-[#5E8174]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              isSelected ? 'bg-[#5E8174] text-white' : 'bg-white text-[#5E8174] border border-slate-200'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200/60 px-2 py-0.5 rounded-md">
                            {topic.badge}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-[#0F172A]">{topic.title}</h3>
                          <p className="text-[11px] text-[#334155] leading-relaxed pt-1 line-clamp-2">
                            {topic.shortDesc}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className="w-4 h-4 text-[#5E8174]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Optional Candidate Goal */}
                <div className="pt-2 space-y-1.5 border-t border-slate-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Session Goal or Questions (Optional Context for Consultant)
                  </label>
                  <textarea
                    rows={2}
                    value={candidateGoal}
                    onChange={(e) => setCandidateGoal(e.target.value)}
                    placeholder="e.g., Focus on distributed socket I/O under 10k connections, cache invalidation, and C++20 memory safety..."
                    className="w-full p-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* ── STEP 2: CURATED CONSULTANT DIRECTORY (SUPABASE-BACKED) ── */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#5E8174] text-white text-[11px] font-bold flex items-center justify-center">
                        2
                      </span>
                      <span>Choose Your Consultant</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Showing active Jadeer consultants for the <strong className="text-[#0F172A] font-semibold">{candidateTrack}</strong> track.
                    </p>
                  </div>

                  {/* Search Filter */}
                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by name or specialty…"
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Consultants Cards Grid */}
                {isConsultantsLoading ? (
                  <div className="p-8 text-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#5E8174] mx-auto" />
                    <p className="text-xs text-slate-500">Querying eligible consultants from database…</p>
                  </div>
                ) : filteredConsultants.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
                    <Users className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">No consultants match this search filter.</p>
                    <p className="text-[11px] text-slate-400">Try adjusting your query or topic selection.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredConsultants.map((consultant) => {
                      const isSelected = selectedConsultant?.id === consultant.id;
                      return (
                        <div
                          key={consultant.id}
                          className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                            isSelected
                              ? 'bg-[#5E8174]/[0.05] border-[#5E8174] shadow-sm'
                              : 'bg-[#F8F9FA] hover:bg-white border-slate-200/80 hover:border-[#5E8174]/30'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-start gap-3">
                              <div className="w-11 h-11 rounded-xl bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center shrink-0 border border-slate-800">
                                {consultant.initials}
                              </div>
                              <div className="min-w-0 space-y-0.5">
                                <h3 className="text-xs font-bold text-[#0F172A] truncate">{consultant.fullName}</h3>
                                <p className="text-[11px] text-slate-500 truncate">{consultant.title}</p>
                                <span className="inline-block text-[10px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2 py-0.5 rounded-md border border-[#5E8174]/20">
                                  {consultant.factualCredential}
                                </span>
                              </div>
                            </div>

                            {/* Bio */}
                            <p className="text-[11px] text-[#334155] leading-relaxed line-clamp-2">
                              {consultant.bio}
                            </p>

                            {/* Specialties */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {consultant.specialties.slice(0, 3).map((spec) => (
                                <span
                                  key={spec}
                                  className="text-[10px] font-medium text-slate-600 bg-white border border-slate-200/70 px-2 py-0.5 rounded-md"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Footer & Select Action */}
                          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-slate-400 block">Next Available</span>
                              <span className="text-xs font-semibold text-[#0F172A]">{consultant.nextAvailable}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSelectConsultant(consultant)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#5E8174] text-white shadow-2xs'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── STEP 3: SCOPED SLOT SELECTION (ONLY SELECTED CONSULTANT) ── */}
              {selectedConsultant && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6 animate-[fade-in_0.2s_ease]">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#5E8174] text-white text-[11px] font-bold flex items-center justify-center">
                          3
                        </span>
                        <span>Select Available Slot with {selectedConsultant.fullName}</span>
                      </h2>
                      <p className="text-xs text-slate-500">
                        Times displayed in Asia/Riyadh (GMT+3) • 60-minute duration.
                      </p>
                    </div>
                  </div>

                  {Object.keys(consultantSlots).length === 0 ? (
                    <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 text-center space-y-2">
                      <Calendar className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-600 font-medium">
                        No open availability slots for {selectedConsultant.fullName} right now.
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Please select another consultant or check back shortly.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(consultantSlots).map(([dateKey, slots]) => (
                        <div key={dateKey} className="space-y-2">
                          <span className="text-xs font-semibold text-slate-600 block">{dateKey}</span>
                          <div className="flex flex-wrap items-center gap-2.5">
                            {slots.map((slot) => {
                              const isSelected = selectedSlotId === slot.id;
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={() => setSelectedSlotId(slot.id)}
                                  className={`px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border flex items-center gap-2 ${
                                    isSelected
                                      ? 'bg-[#5E8174] text-white border-[#5E8174] shadow-sm font-semibold'
                                      : 'bg-[#F8F9FA] hover:bg-white text-[#0F172A] border-slate-200 hover:border-[#5E8174]/40 font-medium'
                                  }`}
                                >
                                  <span>{slot.timeLabel}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Confirm Booking Action (Enabled ONLY when consultant AND slot are selected) */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                      {selectedSlotId && selectedConsultant ? (
                        <span className="text-[#5E8174] font-semibold">Consultant & slot selected • Ready to book</span>
                      ) : (
                        <span>Please choose an open slot above to confirm your session.</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      disabled={!selectedSlotId || !selectedConsultant || isBookingLoading}
                      className="px-6 py-2.5 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4D6D62] transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isBookingLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Confirming Consultation…</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Confirm 1-to-1 Consultation</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         TAB B: MY CONSULTATIONS & OUTCOME DELIVERABLES
         ═══════════════════════════════════════════════════════════════ */}
      {activeMainTab === 'my-sessions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">My Consultations & Deliverables History</h2>
              <p className="text-xs text-slate-500">
                Track your active bookings, reschedule upcoming sessions, and review mentor action items.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveMainTab('book');
                setIsBookingNewSession(true);
              }}
              className="text-xs font-bold text-[#5E8174] hover:underline cursor-pointer"
            >
              + Book New Session
            </button>
          </div>

          {myConsultations.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-3">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No consultation sessions booked yet.</p>
              <button
                type="button"
                onClick={() => {
                  setActiveMainTab('book');
                  setIsBookingNewSession(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#5E8174] text-white text-xs font-semibold hover:bg-[#4D6D62] transition-all cursor-pointer shadow-2xs"
              >
                Schedule Your First Consultation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myConsultations.map((session) => {
                const isCompleted = session.status === 'completed';
                const isScheduled = session.status === 'scheduled';
                return (
                  <div
                    key={session.sessionId}
                    className="p-5 rounded-2xl border border-slate-200/80 bg-[#F8F9FA] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isCompleted
                                ? 'bg-slate-200 text-slate-700'
                                : isScheduled
                                ? 'bg-[#5E8174]/10 text-[#5E8174]'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {session.status}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {session.consultationDetails?.topicTitle || '1-to-1 Technical Consultation'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#0F172A]">
                          With {session.consultant.fullName} ({session.consultant.title})
                        </h3>
                        {session.consultationDetails?.goal && (
                          <p className="text-xs text-slate-600 italic">
                            Goal: "{session.consultationDetails.goal}"
                          </p>
                        )}
                      </div>

                      {/* Scheduled Time */}
                      <div className="text-left sm:text-right space-y-0.5">
                        <span className="text-xs font-bold text-[#0F172A] block">
                          {session.dateKey || formatDateLabel(session.scheduledStartTime)}
                        </span>
                        <span className="text-[11px] text-[#5E8174] font-semibold">
                          {session.timeLabel || formatTimeRange(session.scheduledStartTime, session.scheduledEndTime)}
                        </span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {isCompleted && (
                          <button
                            type="button"
                            onClick={() => handleViewOutcome(session.sessionId)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#5E8174] text-white text-xs font-semibold hover:bg-[#4D6D62] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Deliverables & Action Items</span>
                          </button>
                        )}

                        {isScheduled && (
                          <>
                            <a
                              href={session.meetingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 rounded-xl bg-[#5E8174] text-white text-xs font-semibold hover:bg-[#4D6D62] transition-all shadow-2xs flex items-center gap-1.5"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Video</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleOpenRescheduleModal(session)}
                              className="px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-medium hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <RefreshCw className="w-3 h-3 text-[#5E8174]" />
                              <span>Reschedule</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCancelSession(session.sessionId)}
                              className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-red-600 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MODAL 1: RESCHEDULE CONSULTATION (SAME CONSULTANT GUARD)
         ═══════════════════════════════════════════════════════════════ */}
      {rescheduleSession && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-xl relative space-y-5">
            <button
              onClick={() => {
                setRescheduleSession(null);
                setRescheduleSelectedSlotId(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0F172A]">Reschedule Consultation</h3>
              <p className="text-xs text-slate-500">
                Choose a new available slot with{' '}
                <strong className="text-[#0F172A]">{rescheduleSession.consultant.fullName}</strong>.
                Your previous slot will be atomically released.
              </p>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select New Available Slot
                </label>

                {Object.keys(rescheduleSlots).length === 0 ? (
                  <p className="text-xs text-slate-500 p-4 rounded-xl bg-[#F8F9FA] border border-slate-200">
                    No alternate slots open at this time for this consultant.
                  </p>
                ) : (
                  <div className="max-h-56 overflow-y-auto space-y-3 p-1">
                    {Object.entries(rescheduleSlots).map(([dateKey, slots]) => (
                      <div key={dateKey} className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-500 block">{dateKey}</span>
                        <div className="flex flex-wrap gap-2">
                          {slots.map((slot) => {
                            const isSelected = rescheduleSelectedSlotId === slot.id;
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => setRescheduleSelectedSlotId(slot.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-[#5E8174] text-white border-[#5E8174]'
                                    : 'bg-[#F8F9FA] hover:bg-white text-slate-700 border-slate-200'
                                }`}
                              >
                                <span>{slot.timeLabel}</span>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setRescheduleSession(null);
                    setRescheduleSelectedSlotId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!rescheduleSelectedSlotId || isReschedulingLoading}
                  className="px-5 py-2 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4D6D62] transition-all shadow-2xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isReschedulingLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Reschedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MODAL 2: DELIVERABLES & OUTCOME SUMMARY VIEWER
         ═══════════════════════════════════════════════════════════════ */}
      {viewingOutcome && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingOutcome(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <span className="text-[10px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2.5 py-0.5 rounded-full border border-[#5E8174]/20">
                Post-Session Deliverables Dossier
              </span>
              <h3 className="text-lg font-bold text-[#0F172A]">
                {viewingOutcome.topicTitle || '1-to-1 Technical Consultation'}
              </h3>
              <p className="text-xs text-slate-500">
                Calibrated with {viewingOutcome.consultant?.fullName} ({viewingOutcome.consultant?.title})
              </p>
            </div>

            {/* Outcome Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#5E8174]" />
                <span>Consultant Executive Summary</span>
              </h4>
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/70 text-xs text-[#334155] leading-relaxed">
                "{viewingOutcome.outcomeSummary}"
              </div>
            </div>

            {/* 14-Day Action Items */}
            {viewingOutcome.actionItems && viewingOutcome.actionItems.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8174]" />
                  <span>Actionable Growth Items</span>
                </h4>
                <div className="p-4 rounded-2xl bg-[#5E8174]/[0.04] border border-[#5E8174]/20 space-y-2.5">
                  {viewingOutcome.actionItems.map((item, idx) => {
                    const itemKey = `action-${idx}`;
                    const isDone = checkedActionItems[itemKey];
                    return (
                      <label key={item} className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(isDone)}
                          onChange={() =>
                            setCheckedActionItems((prev) => ({
                              ...prev,
                              [itemKey]: !prev[itemKey],
                            }))
                          }
                          className="mt-0.5 rounded text-[#5E8174] focus:ring-[#5E8174]"
                        />
                        <span className={`text-xs text-[#334155] leading-relaxed ${isDone ? 'line-through text-slate-400' : ''}`}>
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resources & Deliverables */}
            {viewingOutcome.deliverables?.resources && viewingOutcome.deliverables.resources.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#5E8174]" />
                  <span>Shared Technical Resources</span>
                </h4>
                <div className="space-y-2">
                  {viewingOutcome.deliverables.resources.map((res: any, idx: number) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-[#F8F9FA] hover:bg-white border border-slate-200 flex items-center justify-between text-xs text-[#0F172A] font-semibold transition-all group"
                    >
                      <span>{res.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#5E8174]" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingOutcome(null)}
                className="px-5 py-2 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4D6D62] transition-all shadow-2xs cursor-pointer"
              >
                Close Deliverables
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
