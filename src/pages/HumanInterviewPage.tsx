import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile, type HumanInterviewRubric } from '@/contexts/UserProfileContext';
import * as HumanInterviewService from '@/services/humanInterviewService';
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
  Mic,
  MessageSquare,
  CalendarPlus,
  Loader2,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   JADEER — HUMAN TECHNICAL CALIBRATION MODULE (/portal/human-interview)
   Stage 02B: Supabase-Backed Interviewer Assignment, Slot Selection,
   Atomic Booking, Reschedule, Cancellation, and Authoritative Evaluation.
   ═══════════════════════════════════════════════════════════════ */

/* ── Evaluation Rubric Dimensions ───────────────────────────────────────── */
const EVALUATION_WEIGHTS = [
  {
    key: 'systemThinking',
    label: '1. System Architecture & Concurrency',
    weight: '35%',
    desc: 'Distributed topologies, non-blocking socket I/O, cache invalidation & memory safety.',
    icon: Cpu,
  },
  {
    key: 'codeQuality',
    label: '2. Live Code Quality & RAII Safety',
    weight: '30%',
    desc: 'Idiomatic patterns, zero-cost abstractions in modern C++20 / Go, unit test resilience.',
    icon: Code2,
  },
  {
    key: 'technicalArticulation',
    label: '3. Technical Articulation & Defense',
    weight: '20%',
    desc: 'Clear justification of architectural trade-offs, space/time complexity, and system design.',
    icon: MessageSquare,
  },
  {
    key: 'problemSolving',
    label: '4. Edge-Case Problem Solving',
    weight: '15%',
    desc: 'Analytical debugging, handling network partitions, race conditions & timeout spikes.',
    icon: Brain,
  },
];

/* ── Default Completed Rubric Mock (Fallback) ───────────────────────────── */
const DEFAULT_COMPLETED_RUBRIC: HumanInterviewRubric = {
  overallScore: 94,
  grade: 'A+ (Exemplary Calibration)',
  systemThinking: 96,
  codeQuality: 94,
  problemSolving: 92,
  technicalArticulation: 95,
  summaryNotes:
    'Candidate demonstrated stellar depth in asynchronous socket multiplexing with Linux epoll and modern C++20 memory management. Architectural defense during live systems probing was outstanding.',
  strengths: [
    'Command of RAII, thread safety, and zero-cost abstraction principles in C++20 and Go.',
    'High-level clarity when defending cache-aside vs. write-through invalidation topologies.',
    'Structured analytical approach when identifying concurrency race conditions in multi-threaded benchmarks.',
  ],
  recommendations: [
    'Explore distributed consensus protocols (e.g. Raft leader election and log replication) for multi-region clusters.',
    'Add automated fuzz testing suites for socket edge-case malformed packet scenarios.',
  ],
  calibratedAt: '2026-08-29T15:00:00Z',
  interviewerName: 'Eng. Tariq Al-Mansour',
  interviewerTitle: 'Principal Systems Architect & Calibration Lead',
  interviewerCompany: 'Jadeer Calibration Panel',
  verifiedBadge: 'Jadeer Human-Calibrated Senior Engineer Badge',
};

/* ── 4 Lifecycle Progress States ────────────────────────────────────────── */
type CalibrationProgressState = 'awaiting_assignment' | 'choose_time' | 'confirmed' | 'completed';

/* ── Format Helpers ─────────────────────────────────────────────────────── */
function formatDateLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
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

/* ── Google Calendar URL Generator ─────────────────────────────────────── */
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
  if (/not belong to your assigned|unauthorized|forbidden/i.test(msg)) {
    return 'You can only schedule with your assigned interviewer.';
  }
  if (/network|fetch|econnrefused/i.test(msg)) {
    return 'Temporary connection interruption. Please verify your connection and retry.';
  }
  if (/postgres|p2002|p2025|sql|syntax/i.test(msg)) {
    return 'The scheduling service encountered an unexpected error. Please try again in a few moments.';
  }
  return msg;
}

export default function HumanInterviewPage() {
  const { profile, updateProfile } = useUserProfile();

  /* ── Core State ── */
  const [isLoading, setIsLoading] = useState(true);
  const [assignedExpert, setAssignedExpert] = useState<HumanInterviewService.AssignedExpertProfile | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Record<string, HumanInterviewService.AvailabilitySlotItem[]>>({});
  const [sessionData, setSessionData] = useState<HumanInterviewService.ConfirmedSessionSummary | null>(null);
  const [evaluationData, setEvaluationData] = useState<HumanInterviewService.CandidateEvaluationResult | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [candidateNotes, setCandidateNotes] = useState('');
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isAssigningLoading, setIsAssigningLoading] = useState(false);
  const [isReschedulingLoading, setIsReschedulingLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleSelectedSlotId, setRescheduleSelectedSlotId] = useState<string | null>(null);
  const [checkedActionItems, setCheckedActionItems] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* ── Candidate User ID ── */
  const candidateUserId = 'usr-cand-001';

  /* ── Toast Helper ── */
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /* ── Load Complete Authoritative Backend State ── */
  const loadInterviewBackendState = useCallback(async () => {
    try {
      setErrorMessage(null);
      const data = await HumanInterviewService.getHumanInterviewState(candidateUserId);

      if (data.state === 'completed') {
        if (data.session) setSessionData(data.session);
        if (data.expert) setAssignedExpert(data.expert);

        // Fetch candidate-visible evaluation result
        const evalResult = await HumanInterviewService.fetchCandidateVisibleInterviewResult(candidateUserId);
        if (evalResult && evalResult.hasEvaluation) {
          setEvaluationData(evalResult);
        }

        // Sync candidate journey stage completion
        updateProfile({
          humanInterview: {
            status: 'completed',
            isCompleted: true,
            overallScore: evalResult?.overallScore || 94,
            calibratedDate: evalResult?.submittedAt || new Date().toISOString(),
          },
        });

        return 'completed';
      }

      if (data.state === 'confirmed' && data.session) {
        setSessionData(data.session);
        if (data.expert) setAssignedExpert(data.expert);
        return 'confirmed';
      }

      if (data.state === 'choose_time' && data.expert) {
        setAssignedExpert(data.expert);
        setSessionData(null);
        // Load availability slots strictly for assigned expert
        const slots = await HumanInterviewService.getAssignedInterviewerAvailability(
          data.expert.id,
          candidateUserId
        );
        setAvailableSlots(slots);
        return 'choose_time';
      }

      // Default: Awaiting Assignment
      setAssignedExpert(null);
      setSessionData(null);
      setAvailableSlots({});
      return 'awaiting_assignment';
    } catch (err: any) {
      console.error('Error loading interview state:', err);
      setErrorMessage(sanitizeCandidateError(err, 'Unable to sync calibration state from server.'));
      return 'awaiting_assignment';
    }
  }, [candidateUserId]);

  /* ── Initialize Page on Mount ── */
  useEffect(() => {
    let active = true;

    async function init() {
      setIsLoading(true);
      await loadInterviewBackendState();
      if (active) {
        setIsLoading(false);
      }
    }

    init();
    return () => {
      active = false;
    };
  }, [loadInterviewBackendState]);

  /* ── Derived Active Progress State ── */
  const activeProgressState: CalibrationProgressState = useMemo(() => {
    if (evaluationData?.hasEvaluation || sessionData?.status === 'completed') {
      return 'completed';
    }
    if (sessionData && (sessionData.status === 'scheduled' || sessionData.status === 'in_progress')) {
      return 'confirmed';
    }
    if (assignedExpert && assignedExpert.id) {
      return 'choose_time';
    }
    return 'awaiting_assignment';
  }, [evaluationData, sessionData, assignedExpert]);

  /* ── Completed Scorecard Data ── */
  const rubric: HumanInterviewRubric = useMemo(() => {
    if (evaluationData && evaluationData.hasEvaluation) {
      return {
        overallScore: evaluationData.overallScore || 94,
        grade:
          evaluationData.recommendation === 'STRONG_HIRE'
            ? 'A+ (Exemplary Calibration)'
            : evaluationData.recommendation === 'HIRE'
            ? 'A (Calibrated Engineer)'
            : 'B+ (Needs Calibration Review)',
        systemThinking: evaluationData.technicalScore || 95,
        codeQuality: evaluationData.problemSolvingScore || 92,
        problemSolving: evaluationData.communicationScore || 90,
        technicalArticulation: evaluationData.reasoningScore || 94,
        summaryNotes:
          evaluationData.candidateVisibleFeedback ||
          'Candidate demonstrated stellar depth in asynchronous systems architecture.',
        strengths: evaluationData.strengths?.length
          ? evaluationData.strengths
          : DEFAULT_COMPLETED_RUBRIC.strengths,
        recommendations: evaluationData.recommendations?.length
          ? evaluationData.recommendations
          : DEFAULT_COMPLETED_RUBRIC.recommendations,
        calibratedAt: evaluationData.submittedAt || new Date().toISOString(),
        interviewerName: assignedExpert?.fullName || DEFAULT_COMPLETED_RUBRIC.interviewerName,
        interviewerTitle: assignedExpert?.title || DEFAULT_COMPLETED_RUBRIC.interviewerTitle,
        interviewerCompany: assignedExpert?.company || DEFAULT_COMPLETED_RUBRIC.interviewerCompany,
        verifiedBadge: evaluationData.verifiedBadge || 'Jadeer Human-Calibrated Senior Engineer Badge',
      };
    }
    return profile.humanInterview?.rubric || DEFAULT_COMPLETED_RUBRIC;
  }, [evaluationData, assignedExpert, profile.humanInterview?.rubric]);

  /* ── Handler: Confirm Booking (Atomic RPC via Service) ── */
  const handleConfirmBooking = async () => {
    if (!selectedSlotId || !assignedExpert) return;

    setIsBookingLoading(true);
    setErrorMessage(null);

    try {
      const result = await HumanInterviewService.bookHumanInterview({
        candidateUserId,
        slotId: selectedSlotId,
        softwareTrack: profile.track || 'Backend Development',
        candidateNotes: candidateNotes || undefined,
        timezone: 'Asia/Riyadh (GMT+3)',
      });

      const newSession: HumanInterviewService.ConfirmedSessionSummary = {
        sessionId: result.sessionId,
        slotId: selectedSlotId,
        status: 'scheduled',
        scheduledStartTime: result.scheduledStartTime,
        scheduledEndTime: result.scheduledEndTime,
        timezone: result.timezone,
        meetingUrl: result.meetingUrl,
        dateKey: result.dateKey,
        timeLabel: result.timeLabel,
        expert: assignedExpert,
      };

      setSessionData(newSession);

      // Sync with global candidate profile
      updateProfile({
        humanInterview: {
          status: 'upcoming',
          sessionId: result.sessionId,
          assignedExpertId: assignedExpert.id,
          scheduledDate: result.dateKey || formatDateLabel(result.scheduledStartTime),
          scheduledTime: result.timeLabel || formatTimeRange(result.scheduledStartTime, result.scheduledEndTime),
          timezone: result.timezone,
          meetingLink: result.meetingUrl,
          interviewerName: assignedExpert.fullName,
          interviewerTitle: assignedExpert.title,
          interviewerCompany: assignedExpert.company,
          interviewerInitials: assignedExpert.initials,
          topic: `Stage 02B: Human Technical Calibration (${profile.track || 'Backend Development'})`,
        },
      });

      triggerToast('Calibration session confirmed successfully!');
    } catch (err: any) {
      setErrorMessage(sanitizeCandidateError(err, 'Failed to book slot.'));
      // Refresh slots
      if (assignedExpert) {
        const slots = await HumanInterviewService.getAssignedInterviewerAvailability(
          assignedExpert.id,
          candidateUserId
        );
        setAvailableSlots(slots);
      }
    } finally {
      setIsBookingLoading(false);
    }
  };

  /* ── Handler: Reschedule Session (Atomic RPC via Service) ── */
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionData?.sessionId || !rescheduleSelectedSlotId) return;

    setIsReschedulingLoading(true);
    setErrorMessage(null);

    try {
      const res = await HumanInterviewService.rescheduleHumanInterview({
        sessionId: sessionData.sessionId,
        newSlotId: rescheduleSelectedSlotId,
        candidateUserId,
      });

      setSessionData((prev) =>
        prev
          ? {
              ...prev,
              slotId: res.slotId,
              scheduledStartTime: res.scheduledStartTime,
              scheduledEndTime: res.scheduledEndTime,
              timezone: res.timezone,
              dateKey: res.dateKey,
              timeLabel: res.timeLabel,
            }
          : null
      );

      updateProfile({
        humanInterview: {
          ...(profile.humanInterview || { status: 'upcoming' }),
          status: 'upcoming',
          scheduledDate: res.dateKey || formatDateLabel(res.scheduledStartTime),
          scheduledTime: res.timeLabel || formatTimeRange(res.scheduledStartTime, res.scheduledEndTime),
        },
      });

      setShowRescheduleModal(false);
      setRescheduleSelectedSlotId(null);
      triggerToast('Session rescheduled successfully with your assigned interviewer!');
    } catch (err: any) {
      setErrorMessage(sanitizeCandidateError(err, 'Rescheduling failed.'));
    } finally {
      setIsReschedulingLoading(false);
    }
  };

  /* ── Handler: Cancel Session ── */
  const handleCancelCurrentSession = async () => {
    if (!sessionData?.sessionId) return;

    try {
      await HumanInterviewService.cancelHumanInterview({
        sessionId: sessionData.sessionId,
        reason: 'Candidate cancelled via portal',
      });

      setSessionData(null);
      setSelectedSlotId(null);
      setShowRescheduleModal(false);

      updateProfile({
        humanInterview: {
          status: 'not_scheduled',
          assignedExpertId: assignedExpert?.id,
          interviewerName: assignedExpert?.fullName,
        },
      });

      // Reload slots
      if (assignedExpert) {
        const slots = await HumanInterviewService.getAssignedInterviewerAvailability(
          assignedExpert.id,
          candidateUserId
        );
        setAvailableSlots(slots);
      }

      triggerToast('Session cancelled. You may now pick a new available time slot.');
    } catch (err: any) {
      triggerToast(sanitizeCandidateError(err, 'Failed to cancel session.'));
    }
  };

  /* ── Handler: Admin Assign Interviewer (Simulated Action) ── */
  const handleSimulateAssignInterviewer = async () => {
    setIsAssigningLoading(true);
    try {
      const result = await HumanInterviewService.assignInterviewerByAdmin(candidateUserId);
      setAssignedExpert(result.expert);
      const slots = await HumanInterviewService.getAssignedInterviewerAvailability(
        result.expert.id,
        candidateUserId
      );
      setAvailableSlots(slots);
      triggerToast('Interviewer assigned by Jadeer! You can now choose your time.');
    } catch (err: any) {
      triggerToast(err.message || 'Unable to assign interviewer.');
    } finally {
      setIsAssigningLoading(false);
    }
  };

  /* ── Handler: Reset State (Testing Helper) ── */
  const handleResetFlow = async () => {
    try {
      await HumanInterviewService.resetCandidateAssignment(candidateUserId);
      setAssignedExpert(null);
      setSessionData(null);
      setEvaluationData(null);
      setSelectedSlotId(null);
      setAvailableSlots({});

      updateProfile({
        humanInterview: {
          status: 'awaiting_assignment',
        },
      });

      triggerToast('State reset to Awaiting Assignment.');
    } catch {
      triggerToast('Reset failed.');
    }
  };

  /* ── Handler: Authoritative Evaluation Submission (Interviewer/Admin Action) ── */
  const handleAuthoritativeEvaluationSubmit = async () => {
    if (!assignedExpert) return;

    try {
      const sessionId = sessionData?.sessionId || `ses-hc-${Date.now()}`;
      await HumanInterviewService.submitHumanInterviewEvaluation({
        sessionId,
        evaluatorId: assignedExpert.id,
        technicalScore: 96,
        problemSolvingScore: 92,
        communicationScore: 95,
        reasoningScore: 93,
        overallScore: 94,
        recommendation: 'STRONG_HIRE',
        candidateVisibleFeedback:
          'Ahmad demonstrated stellar depth in asynchronous socket multiplexing with Linux epoll and modern C++20 memory management. System design defense was exemplary.',
        internalNotes: 'Top 5% candidate in system architecture. Highly recommended for Level 2 verification.',
        strengths: DEFAULT_COMPLETED_RUBRIC.strengths,
        recommendations: DEFAULT_COMPLETED_RUBRIC.recommendations,
      });

      // Reload authoritative result from backend
      const result = await HumanInterviewService.fetchCandidateVisibleInterviewResult(candidateUserId);
      setEvaluationData(result);

      // Update candidate profile context so top journey navigation synchronizes immediately
      updateProfile({
        humanInterview: {
          status: 'completed',
          rubric: DEFAULT_COMPLETED_RUBRIC,
        },
      });

      triggerToast('Official evaluation submitted! Human Calibration stage completed.');
    } catch (err: any) {
      triggerToast(err.message || 'Evaluation submission failed.');
    }
  };

  /* ── Handler: Copy Meeting Link ── */
  const handleCopyLink = () => {
    const link = sessionData?.meetingUrl || 'https://meet.jadeer.io/interview/jad-tech-8492';
    navigator.clipboard.writeText(link);
    triggerToast('Meeting link copied to clipboard!');
  };

  /* ── Google Calendar URL ── */
  const googleCalendarUrl = useMemo(() => {
    if (!sessionData) return '';
    return generateGoogleCalendarUrl({
      title: `Jadeer Human Technical Calibration — ${profile.track || 'Backend Development'}`,
      startTime: sessionData.scheduledStartTime,
      endTime: sessionData.scheduledEndTime,
      description: `1-hour Human Technical Calibration with ${
        sessionData.expert?.fullName || assignedExpert?.fullName || 'Jadeer Interviewer Panel'
      }.\n\nMeeting Room: ${sessionData.meetingUrl || 'https://meet.jadeer.io/interview/jad-tech-8492'}\nTrack: ${
        profile.track || 'Backend Development'
      }\nStage: Stage 02B`,
      location: sessionData.meetingUrl || 'https://meet.jadeer.io/interview/jad-tech-8492',
    });
  }, [sessionData, profile.track, assignedExpert]);

  return (
    <div className="w-full space-y-8 animate-[fade-in_0.4s_ease] pb-16 py-2 sm:py-4">

      {/* ── Live Toast Notification ── */}
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
         1. STATE-DRIVEN HERO HEADER & ACCURATE 4-STAGE PROGRESS STEPPER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] relative overflow-hidden">
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#5E8174]/40" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {/* Dynamic Status Pill */}
              {activeProgressState === 'completed' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-semibold border border-[#5E8174]/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5E8174]" />
                  <span>Stage 02B: Calibrated & Verified ({rubric.overallScore}/100)</span>
                </span>
              )}
              {activeProgressState === 'confirmed' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-semibold border border-[#5E8174]/20">
                  <Clock className="w-3.5 h-3.5 text-[#5E8174]" />
                  <span>
                    Confirmed Calibration: {sessionData?.dateKey || formatDateLabel(sessionData?.scheduledStartTime || '')}
                  </span>
                </span>
              )}
              {activeProgressState === 'choose_time' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-semibold border border-[#5E8174]/20">
                  <Calendar className="w-3.5 h-3.5 text-[#5E8174]" />
                  <span>Interviewer Assigned — Choose Your Time</span>
                </span>
              )}
              {activeProgressState === 'awaiting_assignment' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F9FA] text-slate-600 text-xs font-medium border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-[#5E8174]" />
                  <span>Stage 02B: Awaiting Interviewer Assignment</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F8F9FA] text-slate-600 text-xs font-medium border border-slate-200">
                <span>Track:</span>
                <strong className="text-[#0F172A] font-semibold">{profile.track || 'Backend Development'}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              {activeProgressState === 'completed' && 'Human Technical Calibration: Scorecard & Feedback'}
              {activeProgressState === 'confirmed' && 'Upcoming Human Technical Calibration Session'}
              {activeProgressState === 'choose_time' && 'Schedule Human Technical Calibration'}
              {activeProgressState === 'awaiting_assignment' && 'Human Technical Calibration'}
            </h1>

            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
              {activeProgressState === 'completed' &&
                `Your 1-to-1 live technical interview with ${rubric.interviewerName} has been evaluated and officially certified on the Jadeer Verified Dossier.`}
              {activeProgressState === 'confirmed' &&
                `Your 1-hour live technical calibration with ${sessionData?.expert?.fullName || assignedExpert?.fullName || 'your assigned interviewer'} is scheduled. Review the meeting details and readiness guidelines below.`}
              {activeProgressState === 'choose_time' &&
                'Your calibration interviewer has been assigned by Jadeer. Select an available 1-hour slot below to schedule your session.'}
              {activeProgressState === 'awaiting_assignment' &&
                'Jadeer is assigning a calibration interviewer based on your technical track and assessment results. We’ll notify you once your interviewer is assigned.'}
            </p>
          </div>

          {/* Right Header: 4 Accurate Progress States Stepper */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="p-1.5 rounded-2xl bg-[#F8F9FA] border border-slate-200 flex items-center gap-1 select-none overflow-x-auto max-w-full">
              {/* Step 1: Awaiting Assignment */}
              <div
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeProgressState === 'awaiting_assignment'
                    ? 'bg-white border border-slate-200 text-[#0F172A] shadow-2xs font-semibold'
                    : 'text-[#5E8174] font-medium'
                }`}
              >
                {activeProgressState === 'awaiting_assignment' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5E8174] animate-pulse" />
                ) : (
                  <Check className="w-3 h-3 text-[#5E8174]" strokeWidth={2.5} />
                )}
                <span>Awaiting Assignment</span>
              </div>

              <div className="w-2 h-[1px] bg-slate-200 shrink-0" />

              {/* Step 2: Choose Time */}
              <div
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeProgressState === 'choose_time'
                    ? 'bg-[#5E8174] text-white shadow-2xs font-semibold'
                    : activeProgressState === 'confirmed' || activeProgressState === 'completed'
                    ? 'text-[#5E8174] font-medium'
                    : 'text-slate-400 font-medium'
                }`}
              >
                {activeProgressState === 'choose_time' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                ) : activeProgressState === 'confirmed' || activeProgressState === 'completed' ? (
                  <Check className="w-3 h-3 text-[#5E8174]" strokeWidth={2.5} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
                <span>Choose Time</span>
              </div>

              <div className="w-2 h-[1px] bg-slate-200 shrink-0" />

              {/* Step 3: Confirmed */}
              <div
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeProgressState === 'confirmed'
                    ? 'bg-[#5E8174] text-white shadow-2xs font-semibold'
                    : activeProgressState === 'completed'
                    ? 'text-[#5E8174] font-medium'
                    : 'text-slate-400 font-medium'
                }`}
              >
                {activeProgressState === 'confirmed' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                ) : activeProgressState === 'completed' ? (
                  <Check className="w-3 h-3 text-[#5E8174]" strokeWidth={2.5} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
                <span>Confirmed</span>
              </div>

              <div className="w-2 h-[1px] bg-slate-200 shrink-0" />

              {/* Step 4: Completed */}
              <div
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeProgressState === 'completed'
                    ? 'bg-slate-200 text-slate-800 shadow-2xs font-semibold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                {activeProgressState === 'completed' ? (
                  <Check className="w-3 h-3 text-slate-700" strokeWidth={2.5} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                )}
                <span>Completed</span>
              </div>
            </div>

            {/* Development Inspection Reset Control */}
            {import.meta.env.DEV && activeProgressState !== 'awaiting_assignment' && (
              <button
                type="button"
                onClick={handleResetFlow}
                className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset test environment back to Awaiting Assignment"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Assignment (Dev)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         2. SINGLE MAIN SCHEDULING CARD (UNIFIED STATE TRANSITIONS)
         ═══════════════════════════════════════════════════════════════ */}
      {activeProgressState !== 'completed' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6">

          {/* ───────────────────────────────────────────────────────────
             SUBSTATE 1: AWAITING ASSIGNMENT (Tightened & Compact)
             ─────────────────────────────────────────────────────────── */}
          {activeProgressState === 'awaiting_assignment' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 py-2">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#5E8174]/10 border border-[#5E8174]/20 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-[#5E8174]" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[#0F172A]">
                    Your Human Calibration Interviewer is Being Assigned
                  </h2>
                  <p className="text-xs sm:text-sm text-[#334155] leading-relaxed max-w-xl">
                    Jadeer is assigning a calibration interviewer based on your{' '}
                    <strong className="text-[#0F172A] font-semibold">
                      {profile.track || 'Backend Development'}
                    </strong>{' '}
                    track and assessment results.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 w-full sm:w-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#5E8174] animate-pulse" />
                  <span>We’ll notify you once your interviewer is assigned.</span>
                </div>

                {/* Admin Assignment Trigger (Guarded for development inspection) */}
                {import.meta.env.DEV && (
                  <button
                    type="button"
                    onClick={handleSimulateAssignInterviewer}
                    disabled={isAssigningLoading}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#5E8174] hover:bg-[#4D6D62] text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50 w-full sm:w-auto"
                    title="Simulate Admin assigning interviewer in Jadeer backend"
                  >
                    {isAssigningLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Assigning…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Assign Interviewer (Admin)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────
             SUBSTATE 2: CHOOSE TIME (INTERVIEWER ASSIGNED → SLOT PICKER)
             ─────────────────────────────────────────────────────────── */}
          {activeProgressState === 'choose_time' && assignedExpert && (
            <div className="space-y-6">
              {/* Assigned Interviewer Profile Section (Read-Only) */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Your Assigned Interviewer
                  </h2>
                  <span className="text-[10px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2.5 py-0.5 rounded-full border border-[#5E8174]/20">
                    Assigned by Jadeer
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-[#0F172A] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-2xs border border-slate-800">
                      {assignedExpert.initials || 'TM'}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#0F172A]">{assignedExpert.fullName}</h3>
                        <span className="inline-block text-[10px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2 py-0.5 rounded-md border border-[#5E8174]/20">
                          {assignedExpert.factualCredential || 'Verified Calibration Lead'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {assignedExpert.title} • {assignedExpert.company}
                      </p>
                      <p className="text-xs text-[#334155]">
                        <span className="text-slate-400">Specialization: </span>
                        <strong>{assignedExpert.specialties?.join(', ') || assignedExpert.track}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="sm:ml-auto flex items-center gap-4 text-xs text-slate-600 shrink-0">
                    <div className="text-left sm:text-right space-y-0.5">
                      <span className="text-[11px] text-slate-400 block">Experience</span>
                      <strong className="text-[#0F172A] font-semibold">{assignedExpert.sessionsCompleted}+ Calibrations</strong>
                    </div>
                    <div className="w-[1px] h-8 bg-slate-200" />
                    <div className="text-left sm:text-right space-y-0.5">
                      <span className="text-[11px] text-slate-400 block">Rating</span>
                      <div className="flex items-center gap-1 font-bold text-[#0F172A]">
                        <span>{assignedExpert.rating.toFixed(2)}</span>
                        <span className="text-[#5E8174] text-xs">★</span>
                      </div>
                    </div>
                  </div>
                </div>

                {assignedExpert.bio && (
                  <p className="text-xs text-[#334155] leading-relaxed pt-1">
                    {assignedExpert.bio}
                  </p>
                )}
              </div>

              {/* Slot Selection Experience */}
              <div className="border-t border-slate-100 pt-6 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#5E8174]" />
                    <span>Select Available Date & Time</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showing available 60-minute technical calibration slots for {assignedExpert.fullName}.
                  </p>
                </div>

                {/* Slots grouped by Date */}
                {Object.keys(availableSlots).length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 text-center space-y-2">
                    <Calendar className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-600 font-medium">
                      No availability slots open right now for this interviewer.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      New slots are refreshed regularly. Please check back shortly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(availableSlots).map(([dateKey, slots]) => (
                      <div key={dateKey} className="space-y-2">
                        <span className="text-xs font-semibold text-slate-600 block">
                          {dateKey}
                        </span>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {slots.map((slot) => {
                            const isSelected = selectedSlotId === slot.id;
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => setSelectedSlotId(slot.id)}
                                className={`
                                  px-4 py-2 rounded-xl text-xs transition-all cursor-pointer border flex items-center gap-2
                                  ${
                                    isSelected
                                      ? 'bg-[#5E8174] text-white border-[#5E8174] shadow-sm font-semibold'
                                      : 'bg-[#F8F9FA] hover:bg-white text-[#0F172A] border-slate-200 hover:border-[#5E8174]/40 font-medium'
                                  }
                                `}
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

                {/* Duration & Timezone */}
                <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#5E8174]" />
                    <span className="font-medium">60-minute Human Technical Calibration</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5E8174]" />
                    <span>Times shown in Asia/Riyadh (GMT+3)</span>
                  </div>
                </div>

                {/* Optional Preparation Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Preparation Notes for {assignedExpert.fullName} (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={candidateNotes}
                    onChange={(e) => setCandidateNotes(e.target.value)}
                    placeholder="e.g., Focus on distributed socket I/O, cache invalidation, and C++20 concurrency benchmarks..."
                    className="w-full p-3 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs text-[#0F172A] focus:bg-white focus:border-[#5E8174] focus:outline-none transition-colors"
                  />
                </div>

                {/* Confirm Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={!selectedSlotId || isBookingLoading}
                    className="w-full h-11 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4D6D62] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isBookingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming Calibration Session…</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>Confirm Interview</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────
             SUBSTATE 3: CONFIRMED (SESSION BOOKED SUMMARY)
             ─────────────────────────────────────────────────────────── */}
          {activeProgressState === 'confirmed' && sessionData && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#5E8174] animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#5E8174]">
                      Confirmed 1-to-1 Calibration
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#0F172A]">
                    Stage 02B: Human Technical Calibration ({profile.track || 'Backend Development'})
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-semibold border border-[#5E8174]/20 self-start sm:self-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Session Confirmed</span>
                </span>
              </div>

              {/* Confirmed Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Assigned Interviewer
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {sessionData.expert?.initials || assignedExpert?.initials || 'TM'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">
                        {sessionData.expert?.fullName || assignedExpert?.fullName || 'Eng. Tariq Al-Mansour'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {sessionData.expert?.title || assignedExpert?.title || 'Principal Systems Architect'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Scheduled Time
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#5E8174]" />
                      <span>{sessionData.dateKey || formatDateLabel(sessionData.scheduledStartTime)}</span>
                    </p>
                    <p className="text-xs font-semibold text-[#5E8174]">
                      {sessionData.timeLabel || formatTimeRange(sessionData.scheduledStartTime, sessionData.scheduledEndTime)}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {sessionData.timezone || 'Asia/Riyadh (GMT+3)'} • 60-minute session
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure Video Room Access */}
              <div className="p-5 rounded-2xl bg-[#5E8174]/[0.06] border border-[#5E8174]/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#5E8174] text-white flex items-center justify-center shadow-2xs shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172A]">Jadeer Secure Video Room</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate max-w-sm">
                        {sessionData.meetingUrl || 'https://meet.jadeer.io/interview/jad-tech-8492'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </button>

                    <a
                      href={sessionData.meetingUrl || 'https://meet.jadeer.io/interview/jad-tech-8492'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2 rounded-xl bg-[#5E8174] hover:bg-[#4D6D62] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Video Call</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Secondary Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8F9FA] hover:bg-white text-slate-700 hover:text-[#0F172A] border border-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-[#5E8174]" />
                    <span>Add to Google Calendar</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowRescheduleModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8F9FA] hover:bg-white text-slate-600 hover:text-[#0F172A] border border-slate-200 text-xs font-medium transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reschedule</span>
                  </button>
                </div>

                {/* Authoritative Evaluation Simulation (Guarded for development inspection) */}
                {import.meta.env.DEV && (
                  <button
                    type="button"
                    onClick={handleAuthoritativeEvaluationSubmit}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F8F9FA] hover:bg-white text-slate-600 hover:text-[#0F172A] border border-slate-200 text-xs font-medium transition-all cursor-pointer ml-auto"
                    title="Submit authoritative evaluation as interviewer to complete stage"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#5E8174]" />
                    <span>Submit Evaluation (Interviewer)</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         3. PRE-INTERVIEW TECHNICAL READINESS GUIDELINES
         (Placed directly below the main scheduling card in pre-completion states)
         ═══════════════════════════════════════════════════════════════ */}
      {activeProgressState !== 'completed' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5E8174]" />
              <span>Pre-Interview Technical Readiness Guidelines</span>
            </h2>
            <span className="text-[11px] font-medium text-slate-500 bg-[#F8F9FA] border border-slate-200/60 px-2.5 py-0.5 rounded-md">
              4 Steps to Prepare
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center font-bold text-xs">
                <Laptop className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#0F172A]">1. Environment Setup</h3>
              <p className="text-[11px] text-[#334155] leading-relaxed">
                Have your local IDE ready with chosen compiler / runtime (C++20, Go, Python, Node.js) and clean git working tree.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center font-bold text-xs">
                <Mic className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#0F172A]">2. Audio & Video Calibration</h3>
              <p className="text-[11px] text-[#334155] leading-relaxed">
                Ensure HD webcam is active, dedicated microphone / headset is connected, and background noise is minimized.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center font-bold text-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#0F172A]">3. Verbalized Problem Solving</h3>
              <p className="text-[11px] text-[#334155] leading-relaxed">
                Verbalize thought processes clearly, discuss space / time complexity trade-offs, and explain architectural decisions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#5E8174]" />
              </div>
              <h3 className="text-xs font-bold text-[#0F172A]">4. Telemetry & Repo Defense</h3>
              <p className="text-[11px] text-[#334155] leading-relaxed">
                Be ready to walk through your Stage 01 AI evaluation findings and your submitted Project Workspace repository.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         4. STATE 4: COMPLETED — VERIFIED SCORECARD & FEEDBACK RUBRIC
         (Authoritatively rendered once evaluation is certified in backend)
         ═══════════════════════════════════════════════════════════════ */}
      {activeProgressState === 'completed' && (
        <div className="space-y-8">
          {/* Verified Rubric Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2.5 py-0.5 rounded-full border border-[#5E8174]/20">
                    ✓ Official Verified Calibration Dossier
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Ref: JAD-HC-8492-VERIFIED
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  Human Assessment Rubric & Scorecard
                </h2>
                <p className="text-xs text-slate-500">
                  Calibrated by <strong className="text-[#0F172A]">{rubric.interviewerName}</strong> ({rubric.interviewerTitle})
                </p>
              </div>

              {/* Overall Score Badge */}
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200 text-center min-w-[160px] space-y-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Overall Score</span>
                <span className="text-3xl font-bold text-[#0F172A]">{rubric.overallScore} / 100</span>
                <span className="text-[10px] font-semibold text-[#5E8174] block">{rubric.grade}</span>
              </div>
            </div>

            {/* Competency Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Competency Breakdown & Evaluation Scores
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A]">System Thinking & Architecture</span>
                    <span className="text-xs font-mono font-bold text-[#5E8174]">{rubric.systemThinking}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                    <div className="h-full bg-[#5E8174] rounded-full transition-all" style={{ width: `${rubric.systemThinking}%` }} />
                  </div>
                  <p className="text-[11px] text-[#334155] leading-relaxed">
                    Exceptional cache invalidation patterns, socket non-blocking multiplexing, and fault-tolerance topology.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A]">Code Quality & RAII Memory Safety</span>
                    <span className="text-xs font-mono font-bold text-[#5E8174]">{rubric.codeQuality}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                    <div className="h-full bg-[#5E8174] rounded-full transition-all" style={{ width: `${rubric.codeQuality}%` }} />
                  </div>
                  <p className="text-[11px] text-[#334155] leading-relaxed">
                    Clean zero-cost abstractions, robust thread synchronization, and clean error propagation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A]">Problem Solving & Complexity</span>
                    <span className="text-xs font-mono font-bold text-[#5E8174]">{rubric.problemSolving}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                    <div className="h-full bg-[#5E8174] rounded-full transition-all" style={{ width: `${rubric.problemSolving}%` }} />
                  </div>
                  <p className="text-[11px] text-[#334155] leading-relaxed">
                    Swift analysis of multi-threaded race conditions and optimal database indexing strategies.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A]">Technical Articulation & Defense</span>
                    <span className="text-xs font-mono font-bold text-[#5E8174]">{rubric.technicalArticulation}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                    <div className="h-full bg-[#5E8174] rounded-full transition-all" style={{ width: `${rubric.technicalArticulation}%` }} />
                  </div>
                  <p className="text-[11px] text-[#334155] leading-relaxed">
                    Crisp, professional technical communication under deep architectural questioning.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Qualitative Notes & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#5E8174]" />
                    <span>Interviewer Notes & Actionable Feedback</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-[#5E8174] bg-[#5E8174]/10 px-2.5 py-0.5 rounded-full border border-[#5E8174]/20">
                    Executive Summary
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FA] border border-slate-200/70 text-xs text-[#334155] leading-relaxed">
                  "{rubric.summaryNotes}"
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#5E8174]/[0.06] border border-[#5E8174]/20 space-y-3">
                  <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5E8174]" />
                    <span>Key Engineering Strengths Demonstrated</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-[#334155]">
                    {rubric.strengths.map((strength) => (
                      <li key={strength} className="flex items-start gap-2">
                        <span className="text-[#5E8174] font-bold">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FA] border border-slate-200/70 space-y-3">
                  <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#5E8174]" />
                    <span>Recommended 30-Day Growth Actions</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {rubric.recommendations.map((rec, idx) => {
                      const itemKey = `rec-${idx}`;
                      const isDone = checkedActionItems[itemKey];
                      return (
                        <label key={rec} className="flex items-start gap-2.5 cursor-pointer group">
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
                          <span className={`text-[#334155] leading-relaxed ${isDone ? 'line-through text-slate-400' : ''}`}>
                            {rec}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Credential Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Verified Technical Credential
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-[#5E8174]/[0.06] border border-[#5E8174]/20 text-center space-y-3 relative overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl bg-[#5E8174] text-white flex items-center justify-center mx-auto shadow-2xs">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#0F172A]">{rubric.verifiedBadge}</h4>
                    <p className="text-[11px] text-slate-500">Calibration Score: {rubric.overallScore} / 100</p>
                  </div>
                  <div className="pt-2 border-t border-[#5E8174]/20 text-[10px] font-mono text-[#5E8174] font-semibold">
                    HASH: JAD-HC-9492-VERIFIED
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Link
                    to="/candidates/portfolio"
                    className="w-full h-11 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4D6D62] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <span>View Evidence Portfolio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/candidates/jobs"
                    className="w-full h-11 rounded-xl bg-[#F8F9FA] border border-slate-200 text-[#0F172A] text-xs font-semibold hover:bg-white hover:border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Calibrated Job Matches</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#5E8174]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         RESCHEDULE MODAL (Same Interviewer Guard & Atomic Reopen)
         ═══════════════════════════════════════════════════════════════ */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-xl relative space-y-5">
            <button
              onClick={() => {
                setShowRescheduleModal(false);
                setRescheduleSelectedSlotId(null);
              }}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0F172A]">Reschedule Technical Calibration</h3>
              <p className="text-xs text-slate-500">
                Choose a new available slot with{' '}
                <strong className="text-[#0F172A]">
                  {sessionData?.expert?.fullName || assignedExpert?.fullName || 'your assigned interviewer'}
                </strong>. Your previous slot will be atomically released.
              </p>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select New Available Slot
                </label>

                {Object.keys(availableSlots).length === 0 ? (
                  <p className="text-xs text-slate-500 p-4 rounded-xl bg-[#F8F9FA] border border-slate-200">
                    No alternate slots open at this time. You can cancel your session to return to the general scheduling queue.
                  </p>
                ) : (
                  <div className="max-h-56 overflow-y-auto space-y-3 p-1">
                    {Object.entries(availableSlots).map(([dateKey, slots]) => (
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
                                className={`
                                  px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5
                                  ${
                                    isSelected
                                      ? 'bg-[#5E8174] text-white border-[#5E8174]'
                                      : 'bg-[#F8F9FA] hover:bg-white text-slate-700 border-slate-200'
                                  }
                                `}
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

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCancelCurrentSession}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer self-start sm:self-center"
                >
                  Cancel Session
                </button>

                <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRescheduleModal(false);
                      setRescheduleSelectedSlotId(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#0F172A] transition-colors cursor-pointer"
                  >
                    Close
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
