import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — BOOK SESSION PAGE
   Multi-step booking flow: Select Mentor → Pick Time Slot → Choose Topic
   → Confirm Booking. Clean wizard-style interface.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Available Time Slots ───────────────────────────────────────────────── */

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface DaySlots {
  date: string;
  dayLabel: string;
  slots: TimeSlot[];
}

const weekSlots: DaySlots[] = [
  {
    date: '2026-08-28',
    dayLabel: 'Thu, Aug 28',
    slots: [
      { id: 't1', time: '10:00 AM', available: false },
      { id: 't2', time: '11:00 AM', available: true },
      { id: 't3', time: '2:00 PM', available: true },
      { id: 't4', time: '4:00 PM', available: true },
      { id: 't5', time: '5:00 PM', available: false },
    ],
  },
  {
    date: '2026-08-29',
    dayLabel: 'Fri, Aug 29',
    slots: [
      { id: 't6', time: '10:00 AM', available: true },
      { id: 't7', time: '11:00 AM', available: true },
      { id: 't8', time: '2:00 PM', available: false },
      { id: 't9', time: '4:00 PM', available: true },
      { id: 't10', time: '5:00 PM', available: true },
    ],
  },
  {
    date: '2026-08-30',
    dayLabel: 'Sat, Aug 30',
    slots: [
      { id: 't11', time: '10:00 AM', available: true },
      { id: 't12', time: '11:00 AM', available: false },
      { id: 't13', time: '12:00 PM', available: true },
      { id: 't14', time: '2:00 PM', available: true },
    ],
  },
  {
    date: '2026-08-31',
    dayLabel: 'Sun, Aug 31',
    slots: [
      { id: 't15', time: '10:00 AM', available: true },
      { id: 't16', time: '11:00 AM', available: true },
      { id: 't17', time: '3:00 PM', available: true },
      { id: 't18', time: '5:00 PM', available: false },
    ],
  },
];

/* ── Session Topics ─────────────────────────────────────────────────────── */

const sessionTopics = [
  { id: 'career', label: 'Career Path Planning', desc: 'Discuss career goals, specialization paths, and job market insights' },
  { id: 'code-review', label: 'Code Review & Feedback', desc: 'Get your code reviewed by an industry expert with actionable feedback' },
  { id: 'system-design', label: 'System Design Walkthrough', desc: 'Learn how to approach system design problems step by step' },
  { id: 'interview-prep', label: 'Mock Interview Preparation', desc: 'Practice technical and behavioral interview questions' },
  { id: 'project-guidance', label: 'Project Guidance', desc: 'Get advice on your current project architecture and implementation' },
  { id: 'general', label: 'General Mentorship', desc: 'Open conversation — bring any questions or topics you\'d like' },
];

/* ── Booking Steps ──────────────────────────────────────────────────────── */

type BookingStep = 'time' | 'topic' | 'confirm';

const steps: { key: BookingStep; label: string; num: string }[] = [
  { key: 'time', label: 'Select Time', num: '01' },
  { key: 'topic', label: 'Choose Topic', num: '02' },
  { key: 'confirm', label: 'Confirm', num: '03' },
];

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function BookSessionPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('time');
  const [selectedDay, setSelectedDay] = useState<string>(weekSlots[0].date);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sessionGoals, setSessionGoals] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const activeDaySlots = weekSlots.find((d) => d.date === selectedDay);
  const activeDayLabel = activeDaySlots?.dayLabel || '';
  const selectedSlotTime = activeDaySlots?.slots.find((s) => s.id === selectedSlot)?.time;
  const selectedTopicData = sessionTopics.find((t) => t.id === selectedTopic);

  const stepIndex = steps.findIndex((s) => s.key === currentStep);

  const canProceed =
    (currentStep === 'time' && selectedSlot) ||
    (currentStep === 'topic' && selectedTopic) ||
    currentStep === 'confirm';

  const handleNext = () => {
    if (currentStep === 'time' && selectedSlot) setCurrentStep('topic');
    else if (currentStep === 'topic' && selectedTopic) setCurrentStep('confirm');
    else if (currentStep === 'confirm') setIsBooked(true);
  };

  const handleBack = () => {
    if (currentStep === 'topic') setCurrentStep('time');
    else if (currentStep === 'confirm') setCurrentStep('topic');
  };

  /* ── Booked Success Screen ─────────────────────────────────────── */
  if (isBooked) {
    return (
      <div className="max-w-xl mx-auto py-16 sm:py-24 animate-[scale-in_0.4s_var(--ease-spring)]">
        <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#0B0F19]/[0.05] shadow-[0_8px_40px_rgba(0,0,0,0.04)] text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-student-500 text-white flex items-center justify-center shadow-[0_8px_24px_rgba(0,86,214,0.3)] animate-[gentle-bounce_2s_ease-in-out_infinite]">
            <Check className="w-8 h-8" strokeWidth={2.5} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
              Session Booked!
            </h2>
            <p className="text-[15px] text-[#0B0F19]/55 leading-relaxed max-w-sm mx-auto">
              Your consultation session has been confirmed. You'll receive a calendar invite shortly.
            </p>
          </div>

          <div className="bg-[#FAF9F6] rounded-2xl p-5 space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-student-500 text-white flex items-center justify-center text-sm font-bold">
                MA
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#0B0F19]">Eng. Mariam Ashraf</p>
                <p className="text-[12px] text-[#0B0F19]/45">Principal Software Engineer, Microsoft</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-[12px] text-[#0B0F19]/55 pt-2 border-t border-[#0B0F19]/[0.04]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-student-500" />
                <span className="font-semibold">{activeDayLabel}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-student-500" />
                <span>{selectedSlotTime} (45 min)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-student-500" />
                <span>Video Call</span>
              </div>
            </div>
            {selectedTopicData && (
              <div className="flex items-center gap-1.5 text-[12px]">
                <MessageCircle className="w-3.5 h-3.5 text-student-500" />
                <span className="font-semibold text-[#0B0F19]/70">{selectedTopicData.label}</span>
              </div>
            )}
            {sessionGoals.trim() && (
              <div className="pt-2 border-t border-[#0B0F19]/[0.04]">
                <p className="text-[10px] text-[#0B0F19]/40 font-medium">Session Goals</p>
                <p className="text-[12px] italic text-[#0B0F19]/70 leading-relaxed font-medium">
                  "{sessionGoals}"
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/student/dashboard"
              className="
                flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl
                bg-student-500 text-white text-[14px] font-bold
                hover:bg-student-600 transition-all duration-200 shadow-md
              "
            >
              Back to Dashboard
            </Link>
            <Link
              to="/student/mentors"
              className="
                flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl
                bg-white text-[#0B0F19] text-[14px] font-bold
                border border-[#0B0F19]/[0.08] hover:bg-[#FAF9F6]
                transition-all duration-200
              "
            >
              Browse More Mentors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-[fade-in_0.4s_ease] py-2 sm:py-6">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <Link
          to="/student/mentors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-student-500 hover:text-student-600 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Mentors
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
          Book a <span className="text-student-500">Consultation Session</span>
        </h1>
      </div>

      {/* ── Mentor Summary Card ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-[#0B0F19]/[0.05] flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-student-500 text-white flex items-center justify-center text-base font-bold shadow-[0_4px_12px_rgba(0,86,214,0.25)] shrink-0">
          MA
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-[#0B0F19]">Eng. Mariam Ashraf</p>
          <p className="text-[12px] text-[#0B0F19]/50">Principal Software Engineer @ Microsoft</p>
        </div>
        <div className="flex items-center gap-1 text-[12px] shrink-0">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-bold text-[#0B0F19]/70">4.9</span>
        </div>
      </div>

      {/* ── Step Indicator ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {steps.map((step, idx) => {
          const isComplete = idx < stepIndex;
          const isCurrent = idx === stepIndex;
          return (
            <div key={step.key} className="flex items-center gap-2 sm:gap-3 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all duration-300
                    ${isComplete
                      ? 'bg-student-500 text-white shadow-[0_2px_8px_rgba(0,86,214,0.3)]'
                      : isCurrent
                        ? 'bg-white border-2 border-student-500 text-student-500'
                        : 'bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-[#0B0F19]/30'
                    }
                  `}
                >
                  {isComplete ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : step.num}
                </div>
                <span
                  className={`text-[12px] font-semibold truncate hidden sm:inline ${
                    isCurrent ? 'text-[#0B0F19]' : isComplete ? 'text-[#0B0F19]/60' : 'text-[#0B0F19]/30'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-[2px] rounded-full ${isComplete ? 'bg-student-500' : 'bg-[#0B0F19]/[0.06]'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step Content ────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.05] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">

        {/* ── STEP 1: Select Time ─────────────────────────────────── */}
        {currentStep === 'time' && (
          <div className="space-y-5 animate-[cross-fade-in_0.3s_ease]">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#0B0F19]">Select a Date & Time</h2>
              <p className="text-[13px] text-[#0B0F19]/50">
                Choose from available 45-minute consultation slots
              </p>
            </div>

            {/* Day Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {weekSlots.map((day) => (
                <button
                  key={day.date}
                  onClick={() => { setSelectedDay(day.date); setSelectedSlot(null); }}
                  className={`
                    px-4 py-2.5 rounded-xl text-[12.5px] font-semibold whitespace-nowrap transition-all duration-200
                    ${selectedDay === day.date
                      ? 'bg-student-500 text-white shadow-[0_4px_12px_rgba(0,86,214,0.25)]'
                      : 'bg-[#FAF9F6] text-[#0B0F19]/60 border border-[#0B0F19]/[0.06] hover:border-student-500/30'
                    }
                  `}
                >
                  {day.dayLabel}
                </button>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {activeDaySlots?.slots.map((slot) => (
                <button
                  key={slot.id}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`
                    relative px-4 py-3.5 rounded-xl text-[13px] font-semibold transition-all duration-200
                    ${!slot.available
                      ? 'bg-[#FAF9F6] text-[#0B0F19]/20 cursor-not-allowed line-through'
                      : selectedSlot === slot.id
                        ? 'bg-student-500 text-white shadow-[0_4px_16px_rgba(0,86,214,0.3)] scale-[1.02]'
                        : 'bg-white text-[#0B0F19]/70 border border-[#0B0F19]/[0.08] hover:border-student-500/40 hover:text-student-500'
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {slot.time}
                  </div>
                  {selectedSlot === slot.id && (
                    <Check className="absolute top-2 right-2 w-3.5 h-3.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Choose Topic ────────────────────────────────── */}
        {currentStep === 'topic' && (
          <div className="space-y-5 animate-[cross-fade-in_0.3s_ease]">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#0B0F19]">What would you like to discuss?</h2>
              <p className="text-[13px] text-[#0B0F19]/50">
                Select a focus area so your mentor can prepare
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sessionTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`
                    text-left p-4 rounded-2xl border transition-all duration-200
                    ${selectedTopic === topic.id
                      ? 'bg-student-500/[0.06] border-student-500/30 shadow-[0_0_0_2px_rgba(0,86,214,0.15)]'
                      : 'bg-white border-[#0B0F19]/[0.06] hover:border-student-500/20'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        selectedTopic === topic.id
                          ? 'border-student-500 bg-student-500'
                          : 'border-[#0B0F19]/20'
                      }`}
                    >
                      {selectedTopic === topic.id && (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div>
                      <p className={`text-[13.5px] font-bold ${
                        selectedTopic === topic.id ? 'text-[#0B0F19]' : 'text-[#0B0F19]/70'
                      }`}>
                        {topic.label}
                      </p>
                      <p className="text-[11.5px] text-[#0B0F19]/45 leading-relaxed mt-0.5">
                        {topic.desc}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Session Goals Prompt */}
            <div className="space-y-2 pt-2">
              <label className="block text-[13.5px] font-bold text-[#0B0F19]">
                What do you want to achieve from this session? What specific topics or questions do you want to discuss with your mentor?
              </label>
              <textarea
                value={sessionGoals}
                onChange={(e) => setSessionGoals(e.target.value)}
                placeholder="e.g. I want to review my basic API routing structure and understand when to use middleware vs direct logic..."
                className="
                  w-full min-h-[100px] p-3.5 rounded-2xl
                  bg-[#FAF9F6] border border-[#0B0F19]/[0.08]
                  text-[13.5px] text-[#0B0F19] placeholder:text-[#0B0F19]/35
                  focus:outline-none focus:border-student-500 focus:ring-2 focus:ring-student-500/10 focus:bg-white
                  transition-all duration-200 resize-none
                "
              />
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm Booking ─────────────────────────────── */}
        {currentStep === 'confirm' && (
          <div className="space-y-5 animate-[cross-fade-in_0.3s_ease]">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#0B0F19]">Confirm Your Session</h2>
              <p className="text-[13px] text-[#0B0F19]/50">
                Review the details below and confirm your booking
              </p>
            </div>

            <div className="bg-[#FAF9F6] rounded-2xl p-5 sm:p-6 space-y-4 border border-[#0B0F19]/[0.04]">
              {/* Mentor */}
              <div className="flex items-center gap-3 pb-4 border-b border-[#0B0F19]/[0.06]">
                <div className="w-11 h-11 rounded-full bg-student-500 text-white flex items-center justify-center text-sm font-bold shadow-[0_2px_8px_rgba(0,86,214,0.25)]">
                  MA
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0B0F19]">Eng. Mariam Ashraf</p>
                  <p className="text-[12px] text-[#0B0F19]/50">Principal Software Engineer, Microsoft</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 text-[13px]">
                  <Calendar className="w-4 h-4 text-student-500" />
                  <div>
                    <p className="text-[11px] text-[#0B0F19]/40 font-medium">Date</p>
                    <p className="font-bold text-[#0B0F19]">{activeDayLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-[13px]">
                  <Clock className="w-4 h-4 text-student-500" />
                  <div>
                    <p className="text-[11px] text-[#0B0F19]/40 font-medium">Time</p>
                    <p className="font-bold text-[#0B0F19]">{selectedSlotTime} (45 min)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-[13px]">
                  <Video className="w-4 h-4 text-student-500" />
                  <div>
                    <p className="text-[11px] text-[#0B0F19]/40 font-medium">Format</p>
                    <p className="font-bold text-[#0B0F19]">Video Call</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-[13px]">
                  <MessageCircle className="w-4 h-4 text-student-500" />
                  <div>
                    <p className="text-[11px] text-[#0B0F19]/40 font-medium">Topic</p>
                    <p className="font-bold text-[#0B0F19]">{selectedTopicData?.label}</p>
                  </div>
                </div>
              </div>

              {sessionGoals.trim() && (
                <div className="pt-3 border-t border-[#0B0F19]/[0.06] space-y-1">
                  <p className="text-[11.5px] text-[#0B0F19]/40 font-medium">Session Goals & Questions</p>
                  <p className="text-[12.5px] font-semibold text-[#0B0F19] leading-relaxed italic bg-white p-3 rounded-xl border border-[#0B0F19]/[0.04]">
                    "{sessionGoals}"
                  </p>
                </div>
              )}

              {/* Info Note */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-white border border-[#0B0F19]/[0.04] text-[12px] text-[#0B0F19]/50">
                <Sparkles className="w-3.5 h-3.5 text-student-500 mt-0.5 shrink-0" />
                <span>
                  A calendar invite and video call link will be sent to your email after booking. You can reschedule up to 24 hours before the session.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4 border-t border-[#0B0F19]/[0.05]">
          {currentStep !== 'time' ? (
            <button
              onClick={handleBack}
              className="
                inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl
                text-[13px] font-semibold text-[#0B0F19]/60
                hover:text-[#0B0F19] hover:bg-[#0B0F19]/[0.04]
                transition-all duration-200
              "
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-2xl
              text-[14px] font-bold transition-all duration-200
              ${canProceed
                ? 'bg-student-500 text-white hover:bg-student-600 hover:shadow-[0_8px_20px_rgba(0,86,214,0.3)] active:scale-[0.98] shadow-md'
                : 'bg-[#0B0F19]/[0.06] text-[#0B0F19]/25 cursor-not-allowed'
              }
            `}
          >
            {currentStep === 'confirm' ? (
              <>
                Confirm Booking
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
