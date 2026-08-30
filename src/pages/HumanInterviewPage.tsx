import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile, type HumanInterviewState, type HumanInterviewRubric } from '@/contexts/UserProfileContext';
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
  RotateCcw,
  FileText,
  X,
  ExternalLink,
  Award,
  Sliders,
  Cpu,
  Code2,
  Database,
  Brain,
  Layers,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Laptop,
  Mic,
  MessageSquare,
  Share2,
  Download,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   JADEER — HUMAN TECHNICAL CALIBRATION MODULE (/portal/human-interview)
   Stage 02B: State-Driven Technical Interview, Panel Booking,
   Readiness Guidelines, and Post-Interview Scorecard & Feedback Rubric.
   ═══════════════════════════════════════════════════════════════ */

/* ── Available Booking Slots ────────────────────────────────────────────── */
const AVAILABLE_CALENDAR_DAYS = [
  { date: '2026-08-30', dayLabel: 'Sat, Aug 30', available: true },
  { date: '2026-08-31', dayLabel: 'Sun, Aug 31', available: true },
  { date: '2026-09-01', dayLabel: 'Mon, Sep 01', available: true },
  { date: '2026-09-02', dayLabel: 'Tue, Sep 02', available: true },
  { date: '2026-09-03', dayLabel: 'Wed, Sep 03', available: true },
];

const AVAILABLE_TIME_SLOTS = [
  { id: 'slot-1', time: '10:00 AM - 11:00 AM (1 hr)', period: 'morning', available: true },
  { id: 'slot-2', time: '11:30 AM - 12:30 PM (1 hr)', period: 'morning', available: true },
  { id: 'slot-3', time: '02:00 PM - 03:00 PM (1 hr)', period: 'afternoon', available: true },
  { id: 'slot-4', time: '03:30 PM - 04:30 PM (1 hr)', period: 'afternoon', available: true },
  { id: 'slot-5', time: '05:00 PM - 06:00 PM (1 hr)', period: 'afternoon', available: true },
  { id: 'slot-6', time: '06:30 PM - 07:30 PM (1 hr)', period: 'evening', available: false },
];

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

/* ── Default Completed Rubric Mock ──────────────────────────────────────── */
const DEFAULT_COMPLETED_RUBRIC: HumanInterviewRubric = {
  overallScore: 94,
  grade: 'A+ (Exemplary Calibration)',
  systemThinking: 96,
  codeQuality: 94,
  problemSolving: 92,
  technicalArticulation: 95,
  summaryNotes:
    'Ahmad demonstrated stellar depth in asynchronous socket multiplexing with Linux epoll and modern C++20 memory management. His ability to articulate architectural trade-offs during live systems probing was outstanding.',
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
  interviewerCompany: 'Microsoft',
  verifiedBadge: 'Jadeer Human-Calibrated Senior Engineer Badge',
};

export default function HumanInterviewPage() {
  const { profile, updateProfile } = useUserProfile();

  /* ── Resolve active Human Interview state from UserProfileContext ── */
  const interviewState: HumanInterviewState = useMemo(() => {
    if (profile.humanInterview) {
      return profile.humanInterview;
    }
    return {
      status: 'not_scheduled',
      scheduledDate: '2026-08-30',
      scheduledTime: '02:00 PM - 03:00 PM (1 hr)',
      timezone: 'Asia/Riyadh (GMT+3)',
      meetingLink: 'https://meet.jadeer.io/interview/jad-tech-8492',
      interviewerName: 'Eng. Tariq Al-Mansour',
      interviewerTitle: 'Principal Systems Architect & Calibration Lead',
      interviewerCompany: 'Microsoft',
      interviewerInitials: 'TM',
      topic: `Stage 02B: Human Technical Calibration (${profile.track || 'Backend Distributed Systems'})`,
      rubric: DEFAULT_COMPLETED_RUBRIC,
    };
  }, [profile.humanInterview, profile.track]);

  /* ── State is driven purely by candidate interviewStatus ── */
  const activeStatus = profile.humanInterview?.status || interviewState.status || 'not_scheduled';

  /* ── Booking Form State ── */
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-3');
  const [candidateNotes, setCandidateNotes] = useState(
    'Focus on Linux epoll socket architecture, distributed caching invalidation, and C++20 concurrency benchmark review.'
  );
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [checkedActionItems, setCheckedActionItems] = useState<Record<string, boolean>>({});

  const activeDay = AVAILABLE_CALENDAR_DAYS[selectedDayIndex];
  const activeSlot = AVAILABLE_TIME_SLOTS.find((s) => s.id === selectedSlotId);

  /* ── Helper Toast ── */
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /* ── Save State & Transition Handler ── */
  const handleUpdateInterviewState = (newState: Partial<HumanInterviewState>) => {
    const updated: HumanInterviewState = {
      ...interviewState,
      ...newState,
    };
    updateProfile({
      humanInterview: updated,
    });
  };

  /* ── Confirm Booking ── */
  const handleConfirmBooking = () => {
    setIsBookingLoading(true);
    setTimeout(() => {
      setIsBookingLoading(false);
      handleUpdateInterviewState({
        status: 'upcoming',
        scheduledDate: activeDay.date,
        scheduledTime: activeSlot?.time || '02:00 PM - 03:00 PM (1 hr)',
        timezone: 'Asia/Riyadh (GMT+3)',
        meetingLink: 'https://meet.jadeer.io/interview/jad-tech-8492',
        interviewerName: 'Eng. Tariq Al-Mansour',
        interviewerTitle: 'Principal Systems Architect & Calibration Lead',
        interviewerCompany: 'Microsoft',
        interviewerInitials: 'TM',
        topic: `Stage 02B: Human Technical Calibration (${profile.track || 'Backend Distributed Systems'})`,
      });
      triggerToast('Human Technical Calibration successfully scheduled!');
    }, 600);
  };

  /* ── Simulate Interview Completion (For Demo / Testing) ── */
  const handleSimulateCompletion = () => {
    handleUpdateInterviewState({
      status: 'completed',
      rubric: DEFAULT_COMPLETED_RUBRIC,
    });
    triggerToast('Interview completed! Official verified scorecard and feedback generated.');
  };

  /* ── Copy Meeting Link ── */
  const handleCopyLink = () => {
    navigator.clipboard.writeText(interviewState.meetingLink || 'https://meet.jadeer.io/interview/jad-tech-8492');
    triggerToast('Meeting link copied to clipboard!');
  };

  /* ── Reschedule Request Submit ── */
  const handleSendReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRescheduleModal(false);
    triggerToast('Reschedule request dispatched to your interviewer panel.');
  };

  const rubric = interviewState.rubric || DEFAULT_COMPLETED_RUBRIC;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-[fade-in_0.4s_ease] pb-16 py-2 sm:py-4">

      {/* ── Live Toast Notification ── */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-[#ecfdf5] border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-md fixed bottom-6 right-6 z-50 animate-[slide-up_0.2s_ease]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         1. STATE-DRIVEN HERO HEADER & STATUS BANNER (CLEAN LIGHT THEME)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)] relative overflow-hidden">
        {/* Accent gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6E8F75] via-[#10B981] to-[#6E8F75]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {/* Dynamic Status Pill */}
              {activeStatus === 'completed' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stage 02B: Calibrated & Verified ({rubric.overallScore}/100)</span>
                </span>
              )}
              {activeStatus === 'upcoming' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>• Confirmed Calibration: {interviewState.scheduledDate || 'Aug 30, 2026'}</span>
                </span>
              )}
              {activeStatus === 'not_scheduled' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Action Required: Session Not Scheduled</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                <span>Track:</span>
                <strong className="text-slate-900">{profile.track || 'Backend Development'}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeStatus === 'completed' && 'Human Technical Calibration: Scorecard & Feedback'}
              {activeStatus === 'upcoming' && 'Upcoming Human Technical Calibration Session'}
              {activeStatus === 'not_scheduled' && 'Schedule Human Technical Calibration'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeStatus === 'completed' &&
                'Your 1-to-1 live technical interview with Microsoft Lead Architect Eng. Tariq Al-Mansour has been evaluated and officially certified on the Jadeer Verified Dossier.'}
              {activeStatus === 'upcoming' &&
                'Your 1-hour live technical calibration with Eng. Tariq Al-Mansour is scheduled. Please review the readiness guidelines and expected evaluation rubric below.'}
              {activeStatus === 'not_scheduled' &&
                'Select an available 1-hour slot with our Principal Interviewer Panel to calibrate your AI assessment findings, discuss system design trade-offs, and finalize project readiness.'}
            </p>
          </div>

          {/* Right Header Status / Countdown / Demo Switcher */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            {/* Read-Only Status Indicator Stepper */}
            <div className="p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 flex items-center gap-1 select-none pointer-events-none">
              <div
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  activeStatus === 'not_scheduled'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs'
                    : 'text-slate-400 font-medium'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeStatus === 'not_scheduled' ? 'bg-amber-600' : 'bg-slate-300'}`} />
                <span>Not Scheduled</span>
              </div>

              <div className="w-2 h-[1px] bg-slate-300" />

              <div
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  activeStatus === 'upcoming'
                    ? 'bg-[#6E8F75] text-white shadow-2xs'
                    : activeStatus === 'completed'
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                {activeStatus === 'completed' ? (
                  <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${activeStatus === 'upcoming' ? 'bg-white animate-pulse' : 'bg-slate-300'}`} />
                )}
                <span>Upcoming</span>
              </div>

              <div className="w-2 h-[1px] bg-slate-300" />

              <div
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  activeStatus === 'completed'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-400 font-medium'
                }`}
              >
                {activeStatus === 'completed' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                <span>Completed</span>
              </div>
            </div>

            {/* Quick action button for upcoming */}
            {activeStatus === 'upcoming' && (
              <a
                href={interviewState.meetingLink || 'https://meet.jadeer.io/interview/jad-tech-8492'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] transition-all shadow-md active:scale-95"
              >
                <Video className="w-4 h-4" />
                <span>Join Video Room</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         2. READINESS GUIDELINES (Displayed for Not Scheduled & Upcoming)
         ═══════════════════════════════════════════════════════════════ */}
      {activeStatus !== 'completed' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
            <h2 className="text-sm font-extrabold text-[#0B0F19] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6E8F75]" />
              <span>Pre-Interview Technical Readiness Guidelines</span>
            </h2>
            <span className="text-[11px] font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-0.5 rounded-full">
              4 Steps to Prepare
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center font-bold text-xs">
                <Laptop className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-[#0B0F19]">1. Environment Setup</h3>
              <p className="text-[11px] text-[#0B0F19]/60 leading-relaxed">
                Have your local IDE ready with chosen compiler / runtime (C++20, Go, Python, Node.js) and clean git working tree.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center font-bold text-xs">
                <Mic className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-[#0B0F19]">2. Audio & Video Calibration</h3>
              <p className="text-[11px] text-[#0B0F19]/60 leading-relaxed">
                Ensure HD webcam is active, dedicated microphone / headset is connected, and background noise is minimized.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center font-bold text-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-[#0B0F19]">3. Verbalized Problem Solving</h3>
              <p className="text-[11px] text-[#0B0F19]/60 leading-relaxed">
                Verbalize thought processes clearly, discuss space / time complexity trade-offs, and explain architectural decisions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#6E8F75]" />
              </div>
              <h3 className="text-xs font-extrabold text-[#0B0F19]">4. Telemetry & Repo Defense</h3>
              <p className="text-[11px] text-[#0B0F19]/60 leading-relaxed">
                Be ready to walk through your Stage 01 AI evaluation findings and your submitted Project Workspace repository.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         STATE A: NOT SCHEDULED — INTERACTIVE SLOT PICKER & BOOKING
         ═══════════════════════════════════════════════════════════════ */}
      {activeStatus === 'not_scheduled' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

          {/* Left Column (8 cols): Date & Slot Picker */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">
              <div className="border-b border-[#0B0F19]/[0.05] pb-4 space-y-1">
                <h2 className="text-base font-extrabold text-[#0B0F19] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#6E8F75]" />
                  <span>Select Calibration Date & 1-Hour Time Slot</span>
                </h2>
                <p className="text-xs text-[#0B0F19]/55">
                  Sessions are 60 minutes long and conduct live technical whiteboard & code review.
                </p>
              </div>

              {/* Day Tabs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">
                  Step 1: Choose Day
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {AVAILABLE_CALENDAR_DAYS.map((day, idx) => {
                    const isSelected = selectedDayIndex === idx;
                    return (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`
                          px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 border transition-all cursor-pointer
                          ${isSelected
                            ? 'bg-[#6E8F75] text-white border-[#6E8F75] shadow-xs'
                            : 'bg-[#FAF9F6] border-[#0B0F19]/[0.06] text-[#0B0F19]/70 hover:border-[#6E8F75]/40'
                          }
                        `}
                      >
                        {day.dayLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">
                  Step 2: Choose 1-Hour Slot ({activeDay.dayLabel})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        disabled={!slot.available}
                        className={`
                          flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer
                          ${isSelected
                            ? 'bg-[#6E8F75]/10 border-[#6E8F75] text-[#6E8F75] shadow-xs'
                            : slot.available
                            ? 'bg-[#FAF9F6] border-[#0B0F19]/[0.06] text-[#0B0F19]/80 hover:border-[#6E8F75]/30'
                            : 'bg-black/[0.02] border-[#0B0F19]/[0.03] text-[#0B0F19]/30 cursor-not-allowed'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot.time}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#6E8F75]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preparation Notes */}
              <div className="space-y-2 pt-2 border-t border-[#0B0F19]/[0.05]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">
                  Step 3: Notes & Specific Topic Focus for Interviewer
                </label>
                <textarea
                  rows={3}
                  value={candidateNotes}
                  onChange={(e) => setCandidateNotes(e.target.value)}
                  placeholder="Mention any specific areas from your AI assessment or repository you want to highlight..."
                  className="w-full p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isBookingLoading}
                  className="w-full h-12 rounded-2xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isBookingLoading ? 'Scheduling Session...' : 'Confirm & Schedule Calibration Session'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Panel Assignment Preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
              <div className="border-b border-[#0B0F19]/[0.05] pb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B0F19]">
                  Assigned Calibration Panel
                </h3>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#6E8F75] text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
                  TM
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-[#0B0F19]">Eng. Tariq Al-Mansour</h4>
                  <p className="text-xs text-[#0B0F19]/60 font-medium">Principal Systems Architect</p>
                  <span className="inline-block text-[10px] font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2 py-0.5 rounded-md border border-[#6E8F75]/20">
                    Microsoft • Lead Interviewer
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#0B0F19]/70 leading-relaxed">
                Eng. Tariq leads distributed systems architecture and has conducted over 180+ calibration sessions for Jadeer candidates.
              </p>

              <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-1 text-xs">
                <span className="font-bold text-[#0B0F19] block">Calibration Format:</span>
                <p className="text-[#0B0F19]/60 text-[11px]">
                  15 min AI score review • 30 min Live system design & code defense • 15 min Actionable feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         STATE B: UPCOMING SESSION — PANEL DETAILS & VIDEO LINK
         ═══════════════════════════════════════════════════════════════ */}
      {activeStatus === 'upcoming' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

          {/* Left Column (8 cols): Scheduled Session Card & Focus Areas */}
          <div className="lg:col-span-8 space-y-6">

            {/* Scheduled Session Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0B0F19]/[0.05] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#6E8F75]">
                      Confirmed 1-to-1 Calibration
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-[#0B0F19]">
                    {interviewState.topic || 'Stage 02B: Human Technical Calibration'}
                  </h2>
                </div>

                <div className="text-left sm:text-right space-y-0.5">
                  <p className="text-xs font-bold text-[#0B0F19] flex items-center sm:justify-end gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#6E8F75]" />
                    <span>{interviewState.scheduledDate || 'Saturday, Aug 30, 2026'}</span>
                  </p>
                  <p className="text-xs text-[#0B0F19]/50 font-mono">
                    {interviewState.scheduledTime || '02:00 PM - 03:00 PM (1 hr)'} • {interviewState.timezone || 'Asia/Riyadh (GMT+3)'}
                  </p>
                </div>
              </div>

              {/* Video Room Connection Card */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#6E8F75] text-white flex items-center justify-center shadow-xs">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Jadeer Secure Video Room</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                        {interviewState.meetingLink || 'https://meet.jadeer.io/interview/jad-tech-8492'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </button>

                    <a
                      href={interviewState.meetingLink || 'https://meet.jadeer.io/interview/jad-tech-8492'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2 rounded-xl bg-[#6E8F75] hover:bg-[#587a60] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Video Call</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Expected Evaluation Weightings */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B0F19]">
                  Expected Evaluation Competencies & Weighting
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EVALUATION_WEIGHTS.map((dim) => {
                    const Icon = dim.icon;
                    return (
                      <div
                        key={dim.key}
                        className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0B0F19] flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-[#6E8F75]" />
                            <span>{dim.label}</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-1.5 py-0.5 rounded">
                            {dim.weight}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#0B0F19]/55 leading-tight">{dim.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Demo Simulation Action */}
              <div className="pt-4 border-t border-[#0B0F19]/[0.05] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(true)}
                  className="text-xs font-bold text-[#0B0F19]/60 hover:text-[#0B0F19] transition-colors cursor-pointer"
                >
                  Request Reschedule
                </button>

                <button
                  type="button"
                  onClick={handleSimulateCompletion}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                  title="Simulate interview conclusion to review the verified scorecard & feedback"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Simulate Interview Completion (Live Demo)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Interviewer Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
              <div className="border-b border-[#0B0F19]/[0.05] pb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B0F19]">
                  Assigned Interviewer Panel
                </h3>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#6E8F75] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                  {interviewState.interviewerInitials || 'TM'}
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-[#0B0F19]">
                    {interviewState.interviewerName || 'Eng. Tariq Al-Mansour'}
                  </h4>
                  <p className="text-xs text-[#0B0F19]/60 font-medium truncate">
                    {interviewState.interviewerTitle || 'Principal Systems Architect'}
                  </p>
                  <span className="inline-block text-[10px] font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2 py-0.5 rounded-md border border-[#6E8F75]/20">
                    {interviewState.interviewerCompany || 'Microsoft'} • Verified Calibration Lead
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#0B0F19]/[0.05] text-xs text-[#0B0F19]/70">
                <div className="flex items-center justify-between">
                  <span className="text-[#0B0F19]/50">Interviews Conducted:</span>
                  <strong className="text-[#0B0F19]">180+ Candidates</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#0B0F19]/50">Domain Focus:</span>
                  <strong className="text-[#0B0F19]">Distributed Systems & C++20</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#0B0F19]/50">Average Rating:</span>
                  <strong className="text-amber-600 font-bold">4.95 / 5.0 ⭐</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         STATE C: COMPLETED — VERIFIED SCORECARD & FEEDBACK RUBRIC
         ═══════════════════════════════════════════════════════════════ */}
      {activeStatus === 'completed' && (
        <div className="space-y-8">

          {/* Verified Rubric Overview Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0B0F19]/[0.05] pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    ✓ Official Verified Calibration Dossier
                  </span>
                  <span className="text-xs font-mono text-[#0B0F19]/40">
                    Ref: JAD-HC-8492-VERIFIED
                  </span>
                </div>
                <h2 className="text-xl font-black text-[#0B0F19]">
                  Human Assessment Rubric & Scorecard
                </h2>
                <p className="text-xs text-[#0B0F19]/60">
                  Calibrated by <strong className="text-[#0B0F19]">{rubric.interviewerName}</strong> ({rubric.interviewerTitle} at {rubric.interviewerCompany})
                </p>
              </div>

              {/* Overall Calibration Score Badge */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-center min-w-[160px] space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B0F19]/50 block">Overall Score</span>
                <span className="text-3xl font-black text-[#6E8F75]">{rubric.overallScore} / 100</span>
                <span className="text-[10px] font-bold text-emerald-700 block">{rubric.grade}</span>
              </div>
            </div>

            {/* Individual Competency Scores Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B0F19]">
                Competency Breakdown & Evaluation Scores
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. System Thinking */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B0F19]">System Thinking & Architecture</span>
                    <span className="text-xs font-black text-[#6E8F75]">{rubric.systemThinking}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/[0.06] overflow-hidden">
                    <div className="h-full bg-[#6E8F75] rounded-full" style={{ width: `${rubric.systemThinking}%` }} />
                  </div>
                  <p className="text-[11px] text-[#0B0F19]/55">
                    Exceptional cache invalidation patterns, socket non-blocking multiplexing, and fault-tolerance topology.
                  </p>
                </div>

                {/* 2. Code Quality */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B0F19]">Code Quality & RAII Memory Safety</span>
                    <span className="text-xs font-black text-[#6E8F75]">{rubric.codeQuality}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/[0.06] overflow-hidden">
                    <div className="h-full bg-[#6E8F75] rounded-full" style={{ width: `${rubric.codeQuality}%` }} />
                  </div>
                  <p className="text-[11px] text-[#0B0F19]/55">
                    Clean zero-cost abstractions, robust thread synchronization, and clean error propagation.
                  </p>
                </div>

                {/* 3. Problem Solving */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B0F19]">Problem Solving & Complexity</span>
                    <span className="text-xs font-black text-[#6E8F75]">{rubric.problemSolving}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/[0.06] overflow-hidden">
                    <div className="h-full bg-[#6E8F75] rounded-full" style={{ width: `${rubric.problemSolving}%` }} />
                  </div>
                  <p className="text-[11px] text-[#0B0F19]/55">
                    Swift analysis of multi-threaded race conditions and optimal database indexing strategies.
                  </p>
                </div>

                {/* 4. Technical Articulation */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B0F19]">Technical Articulation & Defense</span>
                    <span className="text-xs font-black text-[#6E8F75]">{rubric.technicalArticulation}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/[0.06] overflow-hidden">
                    <div className="h-full bg-[#6E8F75] rounded-full" style={{ width: `${rubric.technicalArticulation}%` }} />
                  </div>
                  <p className="text-[11px] text-[#0B0F19]/55">
                    Crisp, professional technical communication under deep architectural questioning.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Qualitative Interviewer Notes & Actionable Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

            {/* Qualitative Notes & Strengths (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
                <div className="border-b border-[#0B0F19]/[0.05] pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#0B0F19] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#6E8F75]" />
                    <span>Interviewer Notes & Actionable Feedback</span>
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Executive Summary
                  </span>
                </div>

                {/* Summary Notes Quote */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-xs text-[#0B0F19]/80 leading-relaxed">
                  "{rubric.summaryNotes}"
                </div>

                {/* Key Strengths Identified */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/50 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Engineering Strengths Demonstrated</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-emerald-950/80">
                    {rubric.strengths.map((strength) => (
                      <li key={strength} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growth Recommendations Checklist */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] space-y-3">
                  <h4 className="text-xs font-bold text-[#0B0F19] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#6E8F75]" />
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
                            className="mt-0.5 rounded text-[#6E8F75] focus:ring-[#6E8F75]"
                          />
                          <span className={`text-[#0B0F19]/80 leading-relaxed ${isDone ? 'line-through text-[#0B0F19]/40' : ''}`}>
                            {rec}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Unlocked Certification Card (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
                <div className="border-b border-[#0B0F19]/[0.05] pb-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B0F19]">
                    Verified Technical Credential
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center space-y-3 relative overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl bg-[#6E8F75] text-white flex items-center justify-center mx-auto shadow-md">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900">{rubric.verifiedBadge}</h4>
                    <p className="text-[11px] text-slate-600">Calibration Score: 94 / 100</p>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/60 text-[10px] font-mono text-emerald-800 font-bold">
                    HASH: JAD-HC-9492-VERIFIED
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Link
                    to="/candidates/portfolio"
                    className="w-full h-11 rounded-2xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>View Evidence Portfolio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/candidates/jobs"
                    className="w-full h-11 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-[#0B0F19] text-xs font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-2"
                  >
                    <span>View Calibrated Job Matches</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6E8F75]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         RESCHEDULE REQUEST MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#0B0F19]/[0.08] shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowRescheduleModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#0B0F19]/40 hover:text-[#0B0F19] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0B0F19]">Request Interview Reschedule</h3>
              <p className="text-xs text-[#0B0F19]/60">
                Provide a reason for the interviewer panel. We will notify you once approved.
              </p>
            </div>

            <form onSubmit={handleSendReschedule} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#0B0F19] uppercase tracking-wider">
                  Reason for Rescheduling
                </label>
                <textarea
                  rows={3}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="e.g., University exam shift or technical conflict..."
                  required
                  className="w-full p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#0B0F19]/60 hover:text-[#0B0F19]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#587a60] transition-all shadow-xs"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
