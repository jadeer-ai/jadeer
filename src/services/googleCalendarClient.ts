/* ═══════════════════════════════════════════════════════════════════════════
   JADEER CLIENT — GOOGLE CALENDAR CLIENT SERVICE
   ─────────────────────────────────────────────────────────────────────────
   Browser-safe integration layer connecting Candidate Portal to the server-side
   Google Calendar OAuth and synchronization engine.
   - Zero privileged OAuth secrets or tokens in browser storage
   - Idempotent event creation and reschedule updates
   - Graceful fallback: failure never interrupts Jadeer/Supabase bookings
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CalendarSyncStatus {
  connected: boolean;
  googleEmail?: string;
}

export interface SessionCalendarPayload {
  sessionId: string;
  candidateUserId: string;
  sessionType: 'human_interview' | 'consultation';
  scheduledStartTime: string;
  scheduledEndTime: string;
  timezone: string;
  meetingUrl?: string | null;
  expertName: string;
  expertTitle?: string | null;
  topicTitle?: string | null;
  track?: string | null;
}

export interface CalendarSyncResult {
  success: boolean;
  eventId?: string;
  htmlLink?: string;
  syncStatus: 'synced' | 'failed' | 'not_connected';
  error?: string;
}

/* ── 1. Check if Candidate has Connected Google Calendar ─────────────────── */
export async function getGoogleCalendarStatus(candidateUserId: string): Promise<CalendarSyncStatus> {
  if (!candidateUserId) return { connected: false };
  try {
    const res = await fetch(`/api/calendar/status?candidateUserId=${encodeURIComponent(candidateUserId)}`);
    if (!res.ok) return { connected: false };
    const data = await res.json();
    return {
      connected: Boolean(data.connected),
      googleEmail: data.googleEmail,
    };
  } catch {
    return { connected: false };
  }
}

/* ── 2. Get Connect Google Calendar OAuth URL ────────────────────────────── */
export async function getGoogleCalendarConnectUrl(
  candidateUserId: string,
  returnUrl?: string
): Promise<string | null> {
  if (!candidateUserId) return null;
  try {
    const query = new URLSearchParams({
      candidateUserId,
      ...(returnUrl ? { returnUrl } : {}),
    });
    const res = await fetch(`/api/calendar/connect-url?${query.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.authUrl || null;
  } catch {
    return null;
  }
}

/* ── 3. Disconnect Google Calendar ───────────────────────────────────────── */
export async function disconnectGoogleCalendar(candidateUserId: string): Promise<boolean> {
  if (!candidateUserId) return false;
  try {
    const res = await fetch('/api/calendar/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateUserId }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/* ── 4. Sync Session to Google Calendar (Idempotent) ─────────────────────── */
export async function syncSessionToCalendar(
  session: SessionCalendarPayload
): Promise<CalendarSyncResult> {
  try {
    const res = await fetch('/api/calendar/sync-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });

    if (!res.ok) {
      return {
        success: false,
        syncStatus: 'failed',
        error: 'Unable to synchronize session with Google Calendar',
      };
    }

    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      syncStatus: 'failed',
      error: err.message || 'Network error during calendar sync',
    };
  }
}

/* ── 5. Retry Calendar Sync ──────────────────────────────────────────────── */
export async function retryCalendarSync(
  session: SessionCalendarPayload
): Promise<CalendarSyncResult> {
  try {
    const res = await fetch('/api/calendar/retry-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });

    if (!res.ok) {
      return {
        success: false,
        syncStatus: 'failed',
        error: 'Calendar sync retry failed',
      };
    }

    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      syncStatus: 'failed',
      error: err.message || 'Network error during retry',
    };
  }
}

/* ── 6. Delete Event from Google Calendar (Cancellation) ─────────────────── */
export async function deleteCalendarEvent(
  candidateUserId: string,
  eventId: string,
  sessionId: string
): Promise<boolean> {
  try {
    const res = await fetch('/api/calendar/delete-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateUserId, eventId, sessionId }),
    });
    return res.ok;
  } catch {
    // Calendar deletion failure must NOT affect Jadeer cancellation
    return false;
  }
}
