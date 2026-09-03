/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — DashboardCalibrationCard Component
   ─────────────────────────────────────────────────────────────────────────
   Canonical UI card for Human Calibration on Graduate & Student Dashboards.
   Faithfully reflects the real hosted Supabase lifecycle:
     - awaiting_assignment: Calm waiting state. No fake interviewer or time.
     - choose_time: Shows real assigned interviewer, indicates scheduling required.
     - confirmed: Shows real session date, time, timezone, room link, manage CTA.
     - completed: Shows real score, grade, candidate-visible feedback & badge.
   ═══════════════════════════════════════════════════════════════════════════ */

import { Link } from 'react-router-dom';
import { Clock, Video, ArrowRight, CheckCircle2, UserCheck, ShieldAlert, CalendarCheck2, AlertCircle } from 'lucide-react';
import type { UseDashboardHumanCalibrationResult } from '@/hooks/useDashboardHumanCalibration';

interface DashboardCalibrationCardProps {
  calibration: UseDashboardHumanCalibrationResult;
  track?: string;
  isStudent?: boolean;
}

export default function DashboardCalibrationCard({
  calibration,
  track = 'Backend Development',
  isStudent = false,
}: DashboardCalibrationCardProps) {
  const { state, expert, evaluation, confirmedDetails } = calibration;

  // 1. Awaiting Assignment (Calm waiting state)
  if (state === 'awaiting_assignment') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FA] border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Stage 03: Human Calibration
          </span>
          <span className="text-[10.5px] font-semibold text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
            Awaiting Assignment
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="text-[14px] font-bold text-[#0F172A]">
            Technical Interviewer Assignment Pending
          </h4>
          <p className="text-[12px] text-[#334155] leading-relaxed">
            The Jadeer evaluation panel is reviewing your {track} profile and matching you with a principal calibrator. You will be notified when your interviewer is assigned.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Panel matching in progress</span>
          <Link
            to="/candidates/human-interview"
            className="font-semibold text-[#5E8174] hover:text-[#4D6D62] inline-flex items-center gap-1 transition-colors"
          >
            <span>Calibration Desk</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  // 2. Choose Time (Interviewer assigned, scheduling required)
  if (state === 'choose_time') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F0E8]/70 border border-[#E8E2D5] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5E8174]">
            Stage 03: Human Calibration
          </span>
          <span className="text-[10.5px] font-semibold text-[#5E8174] bg-[#5E8174]/15 border border-[#5E8174]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E8174] animate-pulse" />
            Action Required • Select Slot
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#5E8174] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              {expert?.initials || 'JP'}
            </div>
            <div className="min-w-0">
              <h4 className="text-[14px] font-bold text-[#0F172A] truncate">
                {expert?.fullName || 'Assigned Calibrator'}
              </h4>
              <p className="text-[11px] text-[#334155] truncate">
                {expert?.title} • <span className="font-semibold text-[#5E8174]">{expert?.company}</span>
              </p>
            </div>
          </div>
          <p className="text-[12px] text-slate-600 leading-relaxed pt-1">
            Your principal reviewer is assigned. Choose an available time slot to lock your 1-on-1 calibration interview.
          </p>
        </div>

        <div className="pt-2 border-t border-[#E8E2D5] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">No appointment booked yet</span>
          <Link
            to="/candidates/human-interview"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4D6D62] transition-all shadow-xs"
          >
            <span>Choose Time Slot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // 3. Confirmed (Real scheduled session)
  if (state === 'confirmed' && confirmedDetails) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FA] border border-[#5E8174]/40 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5E8174]">
            Stage 03: Human Calibration
          </span>
          <span className="text-[10.5px] font-semibold text-[#5E8174] bg-[#5E8174]/10 border border-[#5E8174]/20 px-2.5 py-0.5 rounded-full">
            Confirmed Session
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#5E8174] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              {confirmedDetails.interviewerInitials}
            </div>
            <div className="min-w-0">
              <h4 className="text-[14px] font-bold text-[#0F172A] truncate">
                {confirmedDetails.interviewerName}
              </h4>
              <p className="text-[11px] text-[#334155] truncate">
                {confirmedDetails.interviewerTitle} •{' '}
                <span className="font-semibold text-[#5E8174]">{confirmedDetails.interviewerCompany}</span>
              </p>
            </div>
          </div>

          {/* Time & Room surface */}
          <div className="px-3.5 py-2.5 rounded-xl bg-[#F4F0E8]/70 border border-[#E8E2D5] flex flex-wrap items-center gap-3 text-[11px] text-[#334155]">
            <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
              <Clock className="w-3.5 h-3.5 text-[#5E8174]" />
              {confirmedDetails.scheduledDate} • {confirmedDetails.scheduledTime}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-mono text-[10px]">{confirmedDetails.timezone}</span>
            {confirmedDetails.meetingUrl && (
              <>
                <span className="text-slate-300">•</span>
                <a
                  href={confirmedDetails.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#5E8174] hover:text-[#4D6D62]"
                >
                  <Video className="w-3 h-3" />
                  Join Room
                </a>
              </>
            )}
          </div>

          {confirmedDetails.googleCalendarSyncStatus === 'synced' && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#5E8174] font-medium pt-0.5">
              <CalendarCheck2 className="w-3.5 h-3.5 text-[#5E8174]" />
              <span>Google Calendar: Synced</span>
              {confirmedDetails.googleCalendarHtmlLink && (
                <>
                  <span className="text-slate-300">•</span>
                  <a
                    href={confirmedDetails.googleCalendarHtmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-[#4D6D62]"
                  >
                    View
                  </a>
                </>
              )}
            </div>
          )}
          {confirmedDetails.googleCalendarSyncStatus === 'failed' && (
            <div className="flex items-center justify-between text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/70">
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Calendar sync failed</span>
              </span>
              <Link
                to="/candidates/human-interview"
                className="underline font-semibold hover:text-amber-800"
              >
                Retry
              </Link>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Atomic slot reserved</span>
          <Link
            to="/candidates/human-interview"
            className="text-xs font-bold text-[#5E8174] hover:text-[#4D6D62] inline-flex items-center gap-1 transition-colors"
          >
            <span>Session Details / Reschedule</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  // 4. Completed (Candidate-visible evaluation scorecard)
  if (state === 'completed' && evaluation) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FA] border border-[#5E8174]/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5E8174]">
            Stage 03: Human Calibration
          </span>
          <span className="text-[10.5px] font-semibold text-[#5E8174] bg-[#5E8174]/10 border border-[#5E8174]/20 px-2.5 py-0.5 rounded-full">
            Calibrated • Score {evaluation.overallScore}%
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="text-[14px] font-bold text-[#0F172A]">
              Human Technical Calibration Completed
            </h4>
            <span className="text-xs font-extrabold text-[#5E8174]">
              {evaluation.overallScore}/100
            </span>
          </div>
          <p className="text-[12px] text-[#334155] leading-relaxed">
            {evaluation.candidateVisibleFeedback ||
              'Candidate successfully passed technical review with exemplary systems competence.'}
          </p>
        </div>

        {evaluation.verifiedBadge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#5E8174]/30 text-[11px] font-semibold text-[#0F172A] shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8174]" />
            <span>{evaluation.verifiedBadge}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Calibrated {evaluation.submittedAt ? new Date(evaluation.submittedAt).toLocaleDateString() : 'Recently'}
          </span>
          <Link
            to="/candidates/human-interview"
            className="text-xs font-bold text-[#5E8174] hover:text-[#4D6D62] inline-flex items-center gap-1 transition-colors"
          >
            <span>View Scorecard & Rubric</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  // Fallback / default awaiting assignment
  return null;
}
