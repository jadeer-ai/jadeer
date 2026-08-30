import jwt from 'jsonwebtoken';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER BACKEND — JWT SESSION TOKEN MANAGER
   ─────────────────────────────────────────────────────────────────────────
   Secure cryptographic signing, verification, and token payload extraction.
   ═══════════════════════════════════════════════════════════════════════════ */

const JWT_SECRET = process.env.JWT_SECRET || 'jadeer_hypersecure_jwt_secret_2026_matrix_proof';
const JWT_EXPIRES_IN = '7d';

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: 'STUDENT' | 'GRADUATE' | 'EMPLOYER' | 'ADMIN';
  candidateType?: 'STUDENT' | 'GRADUATE' | null;
  name: string;
  track?: string;
  avatarUrl?: string;
  githubUsername?: string;
  isVerified: boolean;
}

export interface DecodedToken extends JwtUserPayload {
  iat: number;
  exp: number;
}

// In-Memory Revoked Token Registry
const revokedTokens = new Set<string>();

/**
 * Revoke a JWT session token (invalidates active session upon logout)
 */
export function revokeJwtToken(token: string): void {
  if (token && token.trim()) {
    revokedTokens.add(token.trim());
  }
}

/**
 * Check if a token has been revoked
 */
export function isJwtTokenRevoked(token: string): boolean {
  if (!token) return true;
  return revokedTokens.has(token.trim());
}

/**
 * Sign a new JWT session token with HS256 algorithm
 */
export function signJwt(payload: JwtUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
}

/**
 * Verify and decode an incoming JWT session token with revocation check
 */
export function verifyJwt(token: string): DecodedToken | null {
  if (!token || isJwtTokenRevoked(token)) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization Bearer header
 */
export function extractBearerToken(authHeader?: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7).trim();
}

/**
 * Parse Cookie header into a key-value dictionary
 */
export function parseCookieHeader(cookieHeader?: string | null): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });

  return list;
}

/**
 * Extract session token from either Authorization header or Cookie headers
 */
export function extractTokenFromHeaderOrCookies(
  authHeader?: string | null,
  cookieHeader?: string | null
): string | null {
  const bearer = extractBearerToken(authHeader);
  if (bearer) return bearer;

  if (cookieHeader) {
    const cookies = parseCookieHeader(cookieHeader);
    return (
      cookies['auth_token'] ||
      cookies['jadeer_auth_token'] ||
      cookies['__Host-jadeer_auth_token'] ||
      null
    );
  }

  return null;
}

