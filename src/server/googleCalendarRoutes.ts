/* ═══════════════════════════════════════════════════════════════════════════
   JADEER BACKEND — GOOGLE CALENDAR REST ROUTE HANDLERS
   ─────────────────────────────────────────────────────────────────────────
   Serves endpoints:
   - GET  /api/calendar/connect-url
   - GET  /api/calendar/callback
   - GET  /api/calendar/status
   - POST /api/calendar/disconnect
   - POST /api/calendar/sync-session
   - POST /api/calendar/retry-sync
   - POST /api/calendar/delete-event
   ═══════════════════════════════════════════════════════════════════════════ */

import type { IncomingMessage, ServerResponse } from 'http';
import {
  getGoogleCalendarAuthUrl,
  exchangeCalendarCode,
  getCalendarStatus,
  disconnectCalendar,
  createCalendarEvent,
  deleteCalendarEvent,
  type SessionCalendarPayload,
} from './googleCalendarService.ts';

function getHostRedirectUri(req: IncomingMessage): string {
  const host = req.headers.host || 'localhost:5174';
  const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  return `${protocol}://${host}/api/calendar/callback`;
}

export async function handleCalendarAuthUrl(
  req: IncomingMessage,
  candidateUserId: string,
  returnUrl?: string
) {
  if (!candidateUserId) {
    return { statusCode: 400, data: { error: 'candidateUserId is required' } };
  }
  const redirectUri = getHostRedirectUri(req);
  const authUrl = getGoogleCalendarAuthUrl(candidateUserId, redirectUri, returnUrl);
  return { statusCode: 200, data: { authUrl, url: authUrl } };
}

export async function handleCalendarCallback(
  req: IncomingMessage,
  res: ServerResponse,
  code: string,
  stateRaw: string
) {
  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('<h3>Missing authorization code from Google</h3>');
    return;
  }

  let state: { candidateUserId: string; returnUrl?: string } = { candidateUserId: '' };
  try {
    const decoded = Buffer.from(stateRaw, 'base64url').toString('utf8');
    state = JSON.parse(decoded);
  } catch {
    // If not base64url JSON, use as plain userId
    state = { candidateUserId: stateRaw };
  }

  const redirectUri = getHostRedirectUri(req);
  const result = await exchangeCalendarCode(code, state.candidateUserId, redirectUri);

  const targetReturnUrl = state.returnUrl || '/dashboard';
  const separator = targetReturnUrl.includes('?') ? '&' : '?';
  const redirectDestination = result.success
    ? `${targetReturnUrl}${separator}calendar_status=connected`
    : `${targetReturnUrl}${separator}calendar_status=failed&error=${encodeURIComponent(result.error || 'Connection failed')}`;

  res.writeHead(302, { Location: redirectDestination });
  res.end();
}

export async function handleCalendarStatus(candidateUserId: string) {
  if (!candidateUserId) {
    return { statusCode: 400, data: { error: 'candidateUserId is required' } };
  }
  const status = await getCalendarStatus(candidateUserId);
  return { statusCode: 200, data: status };
}

export async function handleCalendarDisconnect(body: { candidateUserId: string }) {
  if (!body?.candidateUserId) {
    return { statusCode: 400, data: { error: 'candidateUserId is required' } };
  }
  const success = await disconnectCalendar(body.candidateUserId);
  return { statusCode: 200, data: { success, disconnected: true } };
}

export async function handleSyncSession(body: SessionCalendarPayload) {
  if (!body?.sessionId || !body?.candidateUserId) {
    return { statusCode: 400, data: { error: 'sessionId and candidateUserId are required' } };
  }
  const result = await createCalendarEvent(body);
  return { statusCode: 200, data: result };
}

export async function handleRetrySync(body: SessionCalendarPayload) {
  if (!body?.sessionId || !body?.candidateUserId) {
    return { statusCode: 400, data: { error: 'sessionId and candidateUserId are required' } };
  }
  const result = await createCalendarEvent(body);
  return { statusCode: 200, data: result };
}

export async function handleDeleteCalendarEvent(body: {
  candidateUserId: string;
  eventId: string;
  sessionId: string;
}) {
  if (!body?.sessionId || !body?.candidateUserId || !body?.eventId) {
    return { statusCode: 400, data: { error: 'sessionId, candidateUserId, and eventId are required' } };
  }
  const result = await deleteCalendarEvent(body.candidateUserId, body.eventId, body.sessionId);
  return { statusCode: 200, data: result };
}
