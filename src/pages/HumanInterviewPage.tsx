import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  CalendarPlus,
  ArrowRight,
  Globe,
  Lock,
  Mail,
  RotateCcw,
  AlertCircle,
  XCircle,
  FileText,
  Send,
  X,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — SCHEDULE HUMAN TECHNICAL INTERVIEW (RICH COMPREHENSIVE EDITION)
   Stage 02B: 1-on-1 Mentor Calibration with Reschedule Request Workflow
   ═══════════════════════════════════════════════════════════════════════════ */

interface TimeSlot {
  id: string;
  time: string;
  period: 'morning' | 'afternoon';
  available: boolean;
}

const timeSlots: TimeSlot[] = [
  { id: 't1', time: '10:00 AM', period: 'morning', available: true },
  { id: 't2', time: '11:30 AM', period: 'morning', available: true },
  { id: 't3', time: '02:00 PM', period: 'afternoon', available: true },
  { id: 't4', time: '03:30 PM', period: 'afternoon', available: true },
  { id: 't5', time: '05:00 PM', period: 'afternoon', available: true },
  { id: 't6', time: '06:30 PM', period: 'afternoon', available: false },
];

export type RescheduleStatus = 'none' | 'pending' | 'approved' | 'rejected';

export default function HumanInterviewPage() {
  const [selectedDay, setSelectedDay] = useState(24); // 24th of current month
  const [selectedSlot, setSelectedSlot] = useState<string>('t3'); // 02:00 PM
  const [selectedTimezone] = useState('Asia/Riyadh (GMT+3)');
  const [isBooked, setIsBooked] = useState(true); // Default booked for instant flexibility testing
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  // Reschedule Request State
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState(
    'University semester project deadline shifted to Saturday morning.',
  );
  const [rescheduleDay, setRescheduleDay] = useState(27);
  const [rescheduleSlot, setRescheduleSlot] = useState('t4');
  const [rescheduleStatus, setRescheduleStatus] = useState<RescheduleStatus>('none');
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);

  const daysInMonth = [
    { day: 19, available: false, label: 'Mon' },
    { day: 20, available: false, label: 'Tue' },
    { day: 21, available: false, label: 'Wed' },
    { day: 22, available: true, label: 'Thu' },
    { day: 23, available: true, label: 'Fri' },
    { day: 24, available: true, label: 'Sat' },
    { day: 25, available: true, label: 'Sun' },
    { day: 26, available: true, label: 'Mon' },
    { day: 27, available: true, label: 'Tue' },
    { day: 28, available: true, label: 'Wed' },
    { day: 29, available: true, label: 'Thu' },
    { day: 30, available: true, label: 'Fri' },
  ];

  const currentSlotObj = timeSlots.find((s) => s.id === selectedSlot);
  const rescheduleSlotObj = timeSlots.find((s) => s.id === rescheduleSlot);

  const handleConfirmBooking = () => {
    setIsBookingLoading(true);
    setTimeout(() => {
      setIsBookingLoading(false);
      setIsBooked(true);
      setRescheduleStatus('none');
    }, 700);
  };

  const handleCopyMeetingLink = () => {
    navigator.clipboard.writeText('https://meet.jadeer.io/interview/jad-tech-8492');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendRescheduleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReschedule(true);
    setTimeout(() => {
      setIsSubmittingReschedule(false);
      setShowRescheduleModal(false);
      setRescheduleStatus('pending');
    }, 600);
  };

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease] pb-12">

      {/* ═══════════════════════════════════════════════════════════════
         TOP HEADER & VALIDATION CONTEXT
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.05] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-xs font-bold border border-[#6E8F75]/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                AI Interview Passed (95% Score)
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#0B0F19]/[0.04] text-[#0B0F19]/60">
                Stage 02B: Human Calibration
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
              Schedule Human Technical Interview
            </h1>
            <p className="text-[14px] text-[#0B0F19]/55 max-w-3xl leading-relaxed">
              Book a 1-on-1 technical calibration session with an industry Senior Mentor to review your AI assessment findings, discuss system design trade-offs, and finalize project readiness.
            </p>
          </div>

          {/* Status Badge */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] shrink-0 min-w-[220px]">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#6E8F75]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#6E8F75]">
                Pipeline Gate
              </span>
            </div>
            <p className="text-[13px] font-bold text-[#0B0F19]">
              Mentor Calibration Required
            </p>
            <p className="text-[11px] text-[#0B0F19]/45 mt-0.5">
              Unlocks assigned project workspace
            </p>
          </div>
        </div>
      </div>

      {/* ── Reschedule Status Notification Banner ────────────────────── */}
      {rescheduleStatus === 'pending' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-[slide-up_0.3s_ease]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                Reschedule Request Under Mentor Review
              </p>
              <p className="text-xs text-amber-800/75">
                Requested new slot: Oct {rescheduleDay}, 2026 @ {rescheduleSlotObj?.time} • Reason: "{rescheduleReason}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setRescheduleStatus('approved')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
              title="Simulate Mentor Approval"
            >
              Simulate Approve
            </button>
            <button
              onClick={() => setRescheduleStatus('rejected')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
              title="Simulate Mentor Rejection"
            >
              Simulate Reject
            </button>
          </div>
        </div>
      )}

      {rescheduleStatus === 'approved' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 animate-[slide-up_0.3s_ease]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md uppercase">
                  Reschedule Approved
                </span>
                <p className="text-sm font-bold text-emerald-950">
                  New Slot Confirmed: Oct {rescheduleDay}, 2026 @ {rescheduleSlotObj?.time}
                </p>
              </div>
              <p className="text-xs text-emerald-800/75 mt-0.5">
                Mentor Eng. Tariq Al-Mansoor approved your excuse. Updated calendar invitation dispatched to your email.
              </p>
            </div>
          </div>

          <button
            onClick={() => setRescheduleStatus('none')}
            className="text-xs font-bold text-emerald-800 hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {rescheduleStatus === 'rejected' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 animate-[slide-up_0.3s_ease]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-700 flex items-center justify-center shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-rose-600 text-white px-2 py-0.5 rounded-md uppercase">
                  Reschedule Rejected
                </span>
                <p className="text-sm font-bold text-rose-950">
                  Original Slot Retained: Oct {selectedDay}, 2026 @ {currentSlotObj?.time}
                </p>
              </div>
              <p className="text-xs text-rose-800/75 mt-0.5">
                Mentor feedback: "Requested slot conflicts with scheduled Sprint 2 kickoff. Please attend your original time or contact support."
              </p>
            </div>
          </div>

          <button
            onClick={() => setRescheduleStatus('none')}
            className="text-xs font-bold text-rose-800 hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MAIN SCHEDULING CARD (RICH SPLIT SCREEN)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-[#0B0F19]/[0.05] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* ─────────────────────────────────────────────────────────────
             LEFT PANEL (7 cols): CALENDAR PICKER & TIME SLOTS
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#0B0F19]/[0.05] space-y-7">

            {/* Month Header & Navigation */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0B0F19]">Select Date & Time</h2>
                <p className="text-xs text-[#0B0F19]/45 mt-0.5">Choose your preferred session slot</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#0B0F19]">October 2026</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6] text-[#0B0F19]/50 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6] text-[#0B0F19]/50 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Full Month Days Grid Selector */}
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#0B0F19]/40 mb-3">
                Available Days (Oct 2026)
              </label>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {daysInMonth.map((d) => {
                  const isSelected = selectedDay === d.day;

                  return (
                    <button
                      key={d.day}
                      disabled={!d.available}
                      onClick={() => setSelectedDay(d.day)}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer
                        ${
                          isSelected
                            ? 'bg-[#6E8F75] border-[#6E8F75] text-white shadow-[0_4px_16px_rgba(110,143,117,0.3)] scale-[1.03]'
                            : d.available
                              ? 'bg-white border-[#0B0F19]/[0.08] text-[#0B0F19] hover:border-[#6E8F75]/40 hover:bg-[#6E8F75]/[0.04]'
                              : 'bg-[#FAF9F6] border-[#0B0F19]/[0.04] text-[#0B0F19]/25 cursor-not-allowed opacity-60'
                        }
                      `}
                    >
                      <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-white/80' : 'text-[#0B0F19]/40'}`}>
                        {d.label}
                      </span>
                      <span className="text-base font-extrabold mt-0.5">
                        {d.day}
                      </span>
                      {d.available && !isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6E8F75] mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timezone Indicator */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0B0F19]/70">
                <Globe className="w-4 h-4 text-[#6E8F75]" />
                <span>Timezone: {selectedTimezone}</span>
              </div>
              <span className="text-[11px] text-[#6E8F75] font-bold">Auto-Detected</span>
            </div>

            {/* Available Time Slots */}
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#0B0F19]/40 mb-3">
                Available Time Slots
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.id;

                  return (
                    <button
                      key={slot.id}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`
                        flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer
                        ${
                          isSelected
                            ? 'bg-[#6E8F75] border-[#6E8F75] text-white shadow-[0_4px_16px_rgba(110,143,117,0.3)] scale-[1.02]'
                            : slot.available
                              ? 'bg-white border-[#0B0F19]/[0.08] text-[#0B0F19] hover:border-[#6E8F75]/40 hover:bg-[#6E8F75]/[0.04]'
                              : 'bg-[#FAF9F6] border-[#0B0F19]/[0.04] text-[#0B0F19]/25 cursor-not-allowed line-through'
                        }
                      `}
                    >
                      <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#6E8F75]'}`} />
                      <span>{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
             RIGHT PANEL (5 cols): SUMMARY, MEETING LINK & FLEXIBILITY
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#FAF9F6]/40 flex flex-col justify-between space-y-6">

            <div className="space-y-6">
              {/* 1. Interviewer Profile Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#0B0F19]/[0.06] shadow-sm space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E8F75]">
                  Assigned Senior Mentor
                </span>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#0B0F19] text-white flex items-center justify-center font-extrabold text-sm shadow-md border border-white/10 shrink-0">
                    TM
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#0B0F19]">
                      Eng. Tariq Al-Mansoor
                    </h3>
                    <p className="text-[12px] text-[#0B0F19]/50 leading-tight">
                      Principal Systems Architect @ STC Pay
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#6E8F75] font-semibold mt-1">
                      <Sparkles className="w-3 h-3" />
                      5+ yrs Jadeer Lead Mentor
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Assessment Session Summary */}
              <div className="space-y-3 p-4 rounded-2xl bg-white border border-[#0B0F19]/[0.06] shadow-sm text-xs">
                <h4 className="font-bold text-[#0B0F19] text-[13px] border-b border-[#0B0F19]/[0.05] pb-2">
                  Session Specifications
                </h4>

                <div className="flex items-center justify-between text-[#0B0F19]/70">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#6E8F75]" />
                    Duration:
                  </span>
                  <span className="font-bold text-[#0B0F19]">45 Minutes</span>
                </div>

                <div className="flex items-center justify-between text-[#0B0F19]/70">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#6E8F75]" />
                    Selected Date:
                  </span>
                  <span className="font-bold text-[#0B0F19]">
                    Oct {selectedDay}, 2026 @ {currentSlotObj?.time}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#0B0F19]/70">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#6E8F75]" />
                    Format:
                  </span>
                  <span className="font-bold text-[#0B0F19]">Live 1-on-1 Video & Code Review</span>
                </div>
              </div>

              {/* 3. Video Meeting Link Section */}
              <div>
                {!isBooked ? (
                  <div className="p-4 rounded-2xl bg-[#0B0F19]/[0.03] border border-dashed border-[#0B0F19]/15 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B0F19]/60">
                      <Lock className="w-3.5 h-3.5 text-[#0B0F19]/40" />
                      <span>Video Meeting Link (Zoom / Teams)</span>
                    </div>
                    <p className="text-[12px] text-[#0B0F19]/45 leading-relaxed">
                      Your encrypted video meeting link will automatically activate upon confirming your time slot.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#6E8F75]/10 border border-[#6E8F75]/30 space-y-2.5 animate-[slide-up_0.3s_ease]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#6E8F75] uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Meeting Room Confirmed
                      </span>
                      <span className="text-[10px] bg-[#6E8F75] text-white px-2 py-0.5 rounded-full font-bold">
                        Live Room
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#6E8F75]/20">
                      <span className="text-[12px] font-mono text-[#0B0F19] truncate mr-2">
                        https://meet.jadeer.io/interview/jad-tech-8492
                      </span>
                      <button
                        onClick={handleCopyMeetingLink}
                        className="p-1.5 rounded-lg hover:bg-[#FAF9F6] text-[#6E8F75] transition-colors shrink-0"
                        title="Copy Meeting Link"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className="text-[11px] text-[#0B0F19]/50 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#6E8F75]" />
                      Confirmation sent to ahmad.hassan@example.com
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Action Buttons & Reschedule Trigger */}
            <div className="space-y-3 pt-2">
              {!isBooked ? (
                <button
                  id="confirm-booking-btn"
                  onClick={handleConfirmBooking}
                  disabled={isBookingLoading}
                  className="
                    w-full py-4 rounded-2xl bg-[#6E8F75] text-white text-sm font-bold
                    hover:bg-[#5d7d64] hover:shadow-[0_8px_24px_rgba(110,143,117,0.3)]
                    transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]
                  "
                >
                  {isBookingLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Locking Slot...
                    </span>
                  ) : (
                    <>
                      <span>Confirm Booking for Oct {selectedDay}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href="https://calendar.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="py-3 rounded-2xl bg-[#0B0F19] text-white text-xs font-bold hover:bg-[#1a2440] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      <span>Calendar</span>
                    </a>

                    {/* Reschedule Request Button */}
                    <button
                      type="button"
                      onClick={() => setShowRescheduleModal(true)}
                      className="py-3 rounded-2xl bg-white border border-[#0B0F19]/[0.1] text-[#0B0F19] text-xs font-bold hover:bg-[#FAF9F6] hover:border-[#6E8F75]/50 transition-all flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#6E8F75]" />
                      <span>Reschedule Slot</span>
                    </button>
                  </div>

                  <a
                    href="/projects/workspace"
                    className="w-full py-3 rounded-2xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] transition-colors flex items-center justify-center gap-1.5 text-center shadow-sm"
                  >
                    <span>Proceed to Project Workspace</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              )}

              <p className="text-[11px] text-center text-[#0B0F19]/40">
                Reschedule requests are subject to mentor availability and validation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         RESCHEDULE REQUEST MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#0B0F19]/[0.08] shadow-2xl space-y-6 animate-[scale-in_0.25s_ease]">

            <div className="flex items-center justify-between pb-3 border-b border-[#0B0F19]/[0.06]">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#6E8F75]" />
                <h3 className="text-lg font-bold text-[#0B0F19]">
                  Request Appointment Reschedule
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="p-1.5 rounded-lg text-[#0B0F19]/40 hover:text-[#0B0F19] hover:bg-[#FAF9F6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendRescheduleRequest} className="space-y-4">
              {/* Proposed New Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60">
                  Select Proposed New Date
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[26, 27, 28, 29].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setRescheduleDay(day)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        rescheduleDay === day
                          ? 'bg-[#6E8F75] text-white border-[#6E8F75]'
                          : 'bg-[#FAF9F6] text-[#0B0F19] border-[#0B0F19]/[0.06]'
                      }`}
                    >
                      Oct {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proposed Time Slot */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60">
                  Select Proposed Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.slice(0, 3).map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setRescheduleSlot(slot.id)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                        rescheduleSlot === slot.id
                          ? 'bg-[#6E8F75] text-white border-[#6E8F75]'
                          : 'bg-[#FAF9F6] text-[#0B0F19] border-[#0B0F19]/[0.06]'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason / Excuse Text Area */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60">
                  Reason for Rescheduling
                </label>
                <textarea
                  rows={3}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  required
                  placeholder="Provide a brief explanation for your mentor..."
                  className="w-full p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:ring-2 focus:ring-[#6E8F75]/15 focus:outline-none transition-all"
                />
                <p className="text-[11px] text-[#0B0F19]/45">
                  Mentors review reasons to maintain sprint accountability and calibration standards.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#0B0F19]/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19]/70 hover:bg-[#FAF9F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReschedule}
                  className="px-6 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] transition-all flex items-center gap-2 shadow-md"
                >
                  {isSubmittingReschedule ? (
                    'Submitting Request...'
                  ) : (
                    <>
                      <span>Submit Request to Mentor</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
