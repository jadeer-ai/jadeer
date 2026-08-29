import React, { createContext, useContext, useState, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — INTERVIEW SCHEDULE CONTEXT (Cross-Portal Shared Data Layer)
   ─────────────────────────────────────────────────────────────────────────
   This context provides a shared interview scheduling store that both the
   Employer Portal and the Graduate/Candidate Portal read from and write to.

   When an employer schedules an interview, the data is persisted to
   localStorage and immediately available to the candidate's dashboard.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Interview Data Model ──────────────────────────────────────────────── */

export type InterviewType = 'ai' | 'human' | 'panel';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateInitials: string;
  role: string;
  company: string;
  date: string;           // ISO date string (YYYY-MM-DD)
  timeSlot: string;       // Display string e.g. "02:00 PM"
  timezone: string;       // e.g. "Asia/Riyadh (GMT+3)"
  meetingLink: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledBy: 'employer' | 'candidate';
  notes?: string;
  createdAt: string;      // ISO timestamp
}

export type ScheduleInterviewInput = Omit<Interview, 'id' | 'status' | 'createdAt'>;

/* ── Context Type ──────────────────────────────────────────────────────── */

export interface InterviewScheduleContextType {
  /** All interviews in the system */
  interviews: Interview[];
  /** Filter interviews for a specific candidate */
  getInterviewsForCandidate: (candidateId: string) => Interview[];
  /** Get all employer-created interviews */
  getInterviewsForEmployer: () => Interview[];
  /** Get upcoming (scheduled, not cancelled/completed) sorted by date */
  getUpcomingInterviews: () => Interview[];
  /** Schedule a new interview */
  scheduleInterview: (data: ScheduleInterviewInput) => Interview;
  /** Cancel an interview by ID */
  cancelInterview: (id: string) => void;
}

/* ── Storage Key ───────────────────────────────────────────────────────── */

const STORAGE_KEY = 'jadeer-scheduled-interviews';

function loadFromStorage(): Interview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Interview[];
  } catch {
    // localStorage unavailable or corrupt
  }
  return [];
}

function saveToStorage(interviews: Interview[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interviews));
  } catch {
    // localStorage unavailable
  }
}

function generateId(): string {
  return `int-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ── Context & Provider ────────────────────────────────────────────────── */

const InterviewScheduleContext = createContext<InterviewScheduleContextType | undefined>(undefined);

export function InterviewScheduleProvider({ children }: { children: React.ReactNode }) {
  const [interviews, setInterviews] = useState<Interview[]>(loadFromStorage);

  /* ── Derived Queries ──────────────────────────────────────────────── */

  const getInterviewsForCandidate = useCallback(
    (candidateId: string): Interview[] =>
      interviews.filter((i) => i.candidateId === candidateId),
    [interviews],
  );

  const getInterviewsForEmployer = useCallback(
    (): Interview[] =>
      interviews.filter((i) => i.scheduledBy === 'employer'),
    [interviews],
  );

  const getUpcomingInterviews = useCallback(
    (): Interview[] =>
      interviews
        .filter((i) => i.status === 'scheduled')
        .sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date);
          if (dateCompare !== 0) return dateCompare;
          return a.timeSlot.localeCompare(b.timeSlot);
        }),
    [interviews],
  );

  /* ── Mutations ────────────────────────────────────────────────────── */

  const scheduleInterview = useCallback(
    (data: ScheduleInterviewInput): Interview => {
      const newInterview: Interview = {
        ...data,
        id: generateId(),
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };

      setInterviews((prev) => {
        const next = [...prev, newInterview];
        saveToStorage(next);
        return next;
      });

      return newInterview;
    },
    [],
  );

  const cancelInterview = useCallback((id: string) => {
    setInterviews((prev) => {
      const next = prev.map((i) =>
        i.id === id ? { ...i, status: 'cancelled' as InterviewStatus } : i,
      );
      saveToStorage(next);
      return next;
    });
  }, []);

  return (
    <InterviewScheduleContext.Provider
      value={{
        interviews,
        getInterviewsForCandidate,
        getInterviewsForEmployer,
        getUpcomingInterviews,
        scheduleInterview,
        cancelInterview,
      }}
    >
      {children}
    </InterviewScheduleContext.Provider>
  );
}

/* ── Hook ───────────────────────────────────────────────────────────────── */

export function useInterviewSchedule() {
  const context = useContext(InterviewScheduleContext);
  if (!context) {
    throw new Error('useInterviewSchedule must be used within an InterviewScheduleProvider');
  }
  return context;
}
