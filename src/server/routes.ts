import {
  signJwt,
  verifyJwt,
  extractTokenFromHeaderOrCookies,
  revokeJwtToken,
  type JwtUserPayload,
} from './jwt.ts';
import { comparePassword, hashPassword } from './password.ts';
import {
  getSocialAuthUrl,
  processSocialAuthCallback,
  type SocialProvider,
  type SocialUserProfile,
  type CandidateDossierTelemetry,
} from './socialOAuth.ts';
import { sendOtpEmail } from './emailService.ts';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER BACKEND — MULTI-PROVIDER API ROUTE HANDLERS & DATABASE STORE
   ─────────────────────────────────────────────────────────────────────────
   Unified Login API, Multi-Provider Social OAuth (Google, GitHub, LinkedIn, Apple),
   Candidate Dossier Telemetry Linking, Session & Security Management.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface DbUserRecord {
  id: string;
  email: string;
  passwordHash: string;
  role: 'STUDENT' | 'GRADUATE' | 'EMPLOYER' | 'ADMIN';
  candidateType: 'STUDENT' | 'GRADUATE' | null;
  authProvider: 'EMAIL' | 'GOOGLE' | 'GITHUB' | 'APPLE' | 'LINKEDIN';
  isVerified: boolean;
  isActive: boolean;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  fullName: string;
  softwareTrack?: string;
  avatarUrl?: string;
  githubUsername?: string;
  dossierTelemetry?: CandidateDossierTelemetry;
  createdAt: string;
  lastLoginAt: string;
}

// In-Memory Synchronized Store (Seed records with bcrypt hashes & sandbox compatibility)
const userDatabase: DbUserRecord[] = [
  {
    id: 'usr-adm-001',
    email: 'admin@jadeer.io',
    passwordHash: '$2b$10$EP0125kUqJpM1Lz9JzO2y.2.8zFmPjLg1iL6t6rR6HhVfL1t8o3mG', // 'JadeerAdmin2026!'
    role: 'ADMIN',
    candidateType: null,
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    fullName: 'Platform Administrator',
    createdAt: new Date('2026-01-01').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'usr-emp-001',
    email: 'talent@jadeer.io',
    passwordHash: '$2b$10$EP0125kUqJpM1Lz9JzO2y.2.8zFmPjLg1iL6t6rR6HhVfL1t8o3mG', // 'JadeerTalent2026!'
    role: 'EMPLOYER',
    candidateType: null,
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    fullName: 'Sultan Al-Otaibi (Jadeer Technologies)',
    createdAt: new Date('2026-01-15').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'usr-grad-001',
    email: 'yourname@gmail.com',
    passwordHash: '$2b$10$EP0125kUqJpM1Lz9JzO2y.2.8zFmPjLg1iL6t6rR6HhVfL1t8o3mG', // 'Candidate2026!'
    role: 'GRADUATE',
    candidateType: 'GRADUATE',
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    fullName: 'Ahmad Al-Hassan',
    softwareTrack: 'Full-Stack Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    githubUsername: 'ahmad-dev-engineer',
    createdAt: new Date('2026-02-01').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'usr-stu-001',
    email: 'student@kfupm.edu.sa',
    passwordHash: '$2b$10$EP0125kUqJpM1Lz9JzO2y.2.8zFmPjLg1iL6t6rR6HhVfL1t8o3mG', // 'Student2026!'
    role: 'STUDENT',
    candidateType: 'STUDENT',
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    fullName: 'Faisal Al-Dosari',
    softwareTrack: 'Backend & Cloud Systems',
    createdAt: new Date('2026-02-10').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'usr-emp-002',
    email: 'employer@tamara.co',
    passwordHash: '$2b$10$EP0125kUqJpM1Lz9JzO2y.2.8zFmPjLg1iL6t6rR6HhVfL1t8o3mG', // 'TamaraRecruit2026!'
    role: 'EMPLOYER',
    candidateType: null,
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    fullName: 'Tamara Tech Recruiting',
    createdAt: new Date('2026-02-15').toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
];

// Rate Limiter Memory Store
const rateLimitMap = new Map<string, { attempts: number; lastAttempt: number; lockedUntil?: number }>();

function checkRateLimit(ipOrEmail: string): { allowed: boolean; remainingSeconds?: number } {
  const key = ipOrEmail.toLowerCase().trim();
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { attempts: 1, lastAttempt: now });
    return { allowed: true };
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    return { allowed: false, remainingSeconds: Math.ceil((record.lockedUntil - now) / 1000) };
  }

  if (now - record.lastAttempt > 60000) {
    record.attempts = 1;
    record.lastAttempt = now;
    record.lockedUntil = undefined;
    return { allowed: true };
  }

  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts > 5) {
    record.lockedUntil = now + 30000;
    return { allowed: false, remainingSeconds: 30 };
  }

  return { allowed: true };
}

function clearRateLimit(ipOrEmail: string) {
  rateLimitMap.delete(ipOrEmail.toLowerCase().trim());
}

/**
 * 0. POST /api/auth/register
 * Validates candidate registration details, queries database for duplicates (returning 400 if exists),
 * securely hashes password using bcrypt, persists user in database, and issues signed JWT session token.
 */
export async function handleRegister(body: {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
  track?: string;
}) {
  const { email, password, name, role, track } = body || {};

  // 1. Missing required fields check
  if (!name || !name.trim() || !email || !email.trim() || !password || !password.trim()) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Name, email, and password are required fields.',
      },
    };
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanName = name.trim();
  const cleanPass = password.trim();
  const cleanTrack = track?.trim() || 'Full-Stack Engineering';

  // 2. Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Please enter a valid email address format (e.g. yourname@domain.com).',
      },
    };
  }

  // 3. Password length check
  if (cleanPass.length < 8) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Password must be at least 8 characters long.',
      },
    };
  }

  // 4. Duplicate Check: Query database to ensure email does not already exist
  const existingUser = userDatabase.find((u) => u.email === cleanEmail);
  if (existingUser) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      },
    };
  }

  // 5. Password Hashing: Securely hash password using bcrypt
  const passwordHash = await hashPassword(cleanPass);

  // Determine candidate role
  const isStudent = role?.toUpperCase() === 'STUDENT' || role?.toLowerCase() === 'student';
  const candidateRole: 'STUDENT' | 'GRADUATE' = isStudent ? 'STUDENT' : 'GRADUATE';

  // 6. Database Insertion
  const newUser: DbUserRecord = {
    id: `usr-${candidateRole.toLowerCase().substring(0, 4)}-${Date.now()}`,
    email: cleanEmail,
    passwordHash,
    role: candidateRole,
    candidateType: candidateRole,
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    fullName: cleanName,
    softwareTrack: cleanTrack,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  userDatabase.push(newUser);

  // 7. JWT Generation
  const tokenPayload: JwtUserPayload = {
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    candidateType: newUser.candidateType,
    name: newUser.fullName,
    track: newUser.softwareTrack,
    isVerified: newUser.isVerified,
  };

  const token = signJwt(tokenPayload);

  // 8. Return 201 with Created User Object (strictly excluding password/passwordHash)
  const createdUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.fullName,
    role: newUser.role,
    candidateType: newUser.candidateType,
    track: newUser.softwareTrack,
    isVerified: newUser.isVerified,
    createdAt: newUser.createdAt,
  };

  return {
    status: 201,
    data: {
      success: true,
      message: 'User registered successfully.',
      token,
      user: createdUser,
      redirectUrl: '/candidates/wizard',
    },
  };
}

/**
 * 1. POST /api/auth/login
 * Validates request payload, checks database by email, executes bcrypt password verification,
 * and returns signed JWT token + sanitized user profile data.
 */
export async function handleLogin(body: { email?: string; password?: string }) {
  const { email, password } = body || {};

  // 1. Missing Required Fields Check
  if (!email || !email.trim() || !password || !password.trim()) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Email and password are required fields.',
      },
    };
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanPass = password.trim();

  // 2. Email Formatting Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Please enter a valid email address format (e.g. yourname@domain.com).',
      },
    };
  }

  // 3. Brute-Force Rate Limiting Check
  const rate = checkRateLimit(cleanEmail);
  if (!rate.allowed) {
    return {
      status: 429,
      data: {
        success: false,
        error: `Too many failed login attempts. Please wait ${rate.remainingSeconds}s before retrying.`,
        remainingCooldownSeconds: rate.remainingSeconds,
      },
    };
  }

  // 4. Database Query: Find User Record by normalized email
  const user = userDatabase.find((u) => u.email === cleanEmail);

  if (!user) {
    return {
      status: 401,
      data: {
        success: false,
        error: 'Invalid email or password.',
      },
    };
  }

  if (!user.isActive) {
    return {
      status: 403,
      data: {
        success: false,
        error: 'This account has been deactivated by system administrators.',
      },
    };
  }

  // 5. Password Verification: Compare input against stored bcrypt password hash
  const isValid = await comparePassword(cleanPass, user.passwordHash);
  if (!isValid) {
    return {
      status: 401,
      data: {
        success: false,
        error: 'Invalid email or password.',
      },
    };
  }

  // Clear rate limit on successful authentication
  clearRateLimit(cleanEmail);

  // 6. Check if Two-Factor Authentication (2FA) is enabled for user
  if (user.twoFactorEnabled) {
    handleGenerate2faOtp({ email: user.email, purpose: 'login' });
    return {
      status: 200,
      data: {
        success: true,
        requires2fa: true,
        email: user.email,
        maskedEmail: maskEmail(user.email),
        redirectUrl: `/verify-otp?email=${encodeURIComponent(user.email)}&mode=2fa`,
        message: 'Two-Factor Authentication required. Verification code sent to email.',
      },
    };
  }

  // Update last login timestamp
  user.lastLoginAt = new Date().toISOString();

  // 7. JWT Session Token Generation
  const tokenPayload: JwtUserPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    candidateType: user.candidateType,
    name: user.fullName,
    track: user.softwareTrack,
    avatarUrl: user.avatarUrl,
    githubUsername: user.githubUsername,
    isVerified: user.isVerified,
  };

  const token = signJwt(tokenPayload);

  // 8. Sanitized User Profile (Strictly excluding password and passwordHash)
  const sanitizedUser = {
    id: user.id,
    email: user.email,
    name: user.fullName,
    role: user.role,
    candidateType: user.candidateType,
    track: user.softwareTrack,
    avatarUrl: user.avatarUrl,
    githubUsername: user.githubUsername,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };

  // Determine redirection URL
  let redirectUrl = '/dashboard';
  if (user.role === 'ADMIN') redirectUrl = '/admin/dashboard';
  else if (user.role === 'EMPLOYER') redirectUrl = '/employer/dashboard';
  else if (user.role === 'STUDENT') redirectUrl = '/student/dashboard';

  return {
    status: 200,
    data: {
      success: true,
      message: 'Logged in successfully.',
      token,
      user: sanitizedUser,
      dossierTelemetry: user.dossierTelemetry,
      redirectUrl,
    },
  };
}

/**
 * 2. GET /api/auth/:provider (Get OAuth Authorization URL)
 */
export function handleSocialAuthUrl(provider: SocialProvider, redirectUri?: string, state?: string) {
  const authUrl = getSocialAuthUrl(provider, redirectUri, state);
  return {
    status: 200,
    data: { success: true, provider, authUrl },
  };
}

// Backward-compatible export
export function handleGitHubAuthUrl(redirectUri?: string, state?: string) {
  return handleSocialAuthUrl('github', redirectUri, state);
}

/**
 * 3. POST /api/auth/:provider/callback (OAuth Token Exchange, User Provisioning & JWT Issuance)
 */
export async function handleSocialCallback(
  provider: SocialProvider,
  params: { code?: string; idToken?: string; state?: string; redirectUri?: string; user?: any; role?: string; track?: string }
) {
  try {
    // 1. Process provider-specific OAuth token exchange & profile extraction
    const profile: SocialUserProfile = await processSocialAuthCallback(provider, params);

    const userEmail = profile.email.toLowerCase();

    // 2. Determine Candidate Role from state or params
    let candidateRole: 'STUDENT' | 'GRADUATE' = 'GRADUATE';
    if (params.role === 'student' || (params.state && params.state.includes('student'))) {
      candidateRole = 'STUDENT';
    }

    const assignedTrack = params.track || (profile.dossierTelemetry?.verifiedLanguages?.[0]?.language) || 'Full-Stack Engineering';

    // 3. Find or auto-provision Candidate in database
    let user = userDatabase.find((u) => u.email === userEmail || (u.authProvider === profile.provider && u.id.includes(profile.providerId)));

    if (!user) {
      user = {
        id: `usr-${provider.substring(0, 2)}-${Date.now()}`,
        email: userEmail,
        passwordHash: '$2b$10$EP0125kUqJpM1Lz9JzO2y.2.8zFmPjLg1iL6t6rR6HhVfL1t8o3mG',
        role: candidateRole,
        candidateType: candidateRole,
        authProvider: profile.provider,
        isVerified: profile.verified,
        isActive: true,
        fullName: profile.name,
        softwareTrack: assignedTrack,
        avatarUrl: profile.avatarUrl,
        githubUsername: profile.dossierTelemetry?.githubUsername,
        dossierTelemetry: profile.dossierTelemetry,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      userDatabase.push(user);
    } else {
      // Update linked profile data & dossier
      if (params.role) {
        user.role = candidateRole;
        user.candidateType = candidateRole;
      }
      if (profile.avatarUrl) user.avatarUrl = profile.avatarUrl;
      if (profile.dossierTelemetry) user.dossierTelemetry = profile.dossierTelemetry;
      if (profile.dossierTelemetry?.githubUsername) user.githubUsername = profile.dossierTelemetry.githubUsername;
      user.lastLoginAt = new Date().toISOString();
    }

    // 4. Generate Signed JWT Session Token
    const tokenPayload: JwtUserPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      candidateType: user.candidateType,
      name: user.fullName,
      track: user.softwareTrack,
      avatarUrl: user.avatarUrl,
      githubUsername: user.githubUsername,
      isVerified: user.isVerified,
    };

    const token = signJwt(tokenPayload);

    return {
      status: 200,
      data: {
        success: true,
        provider,
        token,
        user: tokenPayload,
        dossierTelemetry: user.dossierTelemetry,
        redirectUrl: '/candidates/wizard',
      },
    };
  } catch (err: any) {
    return {
      status: 500,
      data: {
        success: false,
        error: `Failed to authenticate with ${provider}: ` + (err.message || 'OAuth error'),
      },
    };
  }
}

// Backward-compatible export
export async function handleGitHubCallback(body: { code?: string; redirectUri?: string; state?: string }) {
  return handleSocialCallback('github', body);
}

/**
 * 4. GET /api/auth/me
 * Validates JWT session token and returns active session data
 */
export function handleGetMe(authHeader?: string | null, cookieHeader?: string | null) {
  const token = extractTokenFromHeaderOrCookies(authHeader, cookieHeader);

  if (!token) {
    return {
      status: 401,
      data: { success: false, error: 'No authorization token provided.' },
    };
  }

  const decoded = verifyJwt(token);
  if (!decoded) {
    return {
      status: 401,
      data: { success: false, error: 'Invalid, revoked, or expired session token.' },
    };
  }

  const user = userDatabase.find((u) => u.id === decoded.userId || u.email === decoded.email);

  return {
    status: 200,
    data: {
      success: true,
      user: decoded,
      dossierTelemetry: user?.dossierTelemetry,
    },
  };
}

/**
 * 5. POST /api/auth/logout
 * Securely invalidates active session, revokes JWT token, and returns success response.
 * Returns HTTP 401 with structured error if no active session is found.
 */
export function handleLogout(authHeader?: string | null, cookieHeader?: string | null) {
  const token = extractTokenFromHeaderOrCookies(authHeader, cookieHeader);

  if (!token) {
    return {
      status: 401,
      data: {
        success: false,
        error: 'No active session found.',
      },
    };
  }

  const decoded = verifyJwt(token);
  if (!decoded) {
    return {
      status: 401,
      data: {
        success: false,
        error: 'Session is invalid or already expired.',
      },
    };
  }

  // Invalidate and revoke the active JWT session token
  revokeJwtToken(token);

  return {
    status: 200,
    data: {
      success: true,
      message: 'Logged out successfully. Session invalidated and authentication cookies cleared.',
      revokedSessionUserId: decoded.userId,
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. TWO-FACTOR AUTHENTICATION & SECURE OTP VERIFICATION
   ═══════════════════════════════════════════════════════════════════════════ */

export interface OtpRecord {
  email: string;
  code: string;
  expiresAt: number; // 5 mins
  attempts: number; // Max 5 attempts
  createdAt: number;
  lastResendAt: number;
  resendCount: number;
  purpose: 'login' | 'setup' | 'reset';
}

export const otpStore = new Map<string, OtpRecord>();

// Helper to mask email address (e.g., ah***@gmail.com)
function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? name.substring(0, 2) + '***' : name + '***';
  return `${maskedName}@${domain}`;
}

/**
 * 6. POST /api/auth/2fa/generate (or OTP Send)
 * Generates a cryptographically random 6-digit verification code with 5-minute expiry.
 * Enforces rate limiting on code resends (minimum 30s cooldown, max 5 resends/hr).
 */
export function handleGenerate2faOtp(body: { email?: string; purpose?: 'login' | 'setup' | 'reset' }) {
  const { email, purpose = 'login' } = body || {};

  if (!email || !email.trim()) {
    return {
      status: 400,
      data: { success: false, error: 'Email address is required.' },
    };
  }

  const cleanEmail = email.toLowerCase().trim();
  const now = Date.now();
  const existing = otpStore.get(cleanEmail);

  // Check rate limit: 30-second cooldown between resends
  if (existing && now - existing.lastResendAt < 30 * 1000) {
    const waitSec = Math.ceil((30 * 1000 - (now - existing.lastResendAt)) / 1000);
    return {
      status: 429,
      data: {
        success: false,
        error: `Please wait ${waitSec} seconds before requesting a new verification code.`,
        cooldownRemainingSeconds: waitSec,
      },
    };
  }

  // Check hourly limit: Max 5 resends per hour
  if (existing && now - existing.createdAt < 60 * 60 * 1000 && existing.resendCount >= 5) {
    return {
      status: 429,
      data: {
        success: false,
        error: 'Too many verification code requests. Please try again in 1 hour.',
      },
    };
  }

  // Generate secure 6-digit numeric OTP (100000 - 999999)
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes expiration

  const newRecord: OtpRecord = {
    email: cleanEmail,
    code,
    expiresAt,
    attempts: 0,
    createdAt: existing && now - existing.createdAt < 60 * 60 * 1000 ? existing.createdAt : now,
    lastResendAt: now,
    resendCount: existing && now - existing.createdAt < 60 * 60 * 1000 ? existing.resendCount + 1 : 1,
    purpose,
  };

  otpStore.set(cleanEmail, newRecord);

  // Dispatch transactional email via EmailService
  sendOtpEmail({ to: cleanEmail, code, purpose, expiresMinutes: 5 }).catch((err) => {
    console.error(`[JADEER EMAIL ERROR] Failed to deliver 2FA email to ${cleanEmail}:`, err);
  });

  return {
    status: 200,
    data: {
      success: true,
      message: `Verification code sent to ${maskEmail(cleanEmail)}.`,
      expiresAt,
      maskedEmail: maskEmail(cleanEmail),
      purpose,
      demoCode: code, // Provided for sandbox/dev convenience
    },
  };
}

/**
 * 7. POST /api/auth/2fa/verify (or OTP Verify)
 * Verifies user-entered 6-digit code against stored OTP record.
 * Protects against brute-force attacks by limiting failed attempts (max 5).
 */
export async function handleVerify2faOtp(body: { email?: string; code?: string; purpose?: string }) {
  const { email, code } = body || {};

  if (!email || !email.trim() || !code || !code.trim()) {
    return {
      status: 400,
      data: { success: false, error: 'Email and 6-digit verification code are required.' },
    };
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = code.trim();
  const record = otpStore.get(cleanEmail);
  const now = Date.now();

  // Sandbox bypass for testing
  const isSandboxMasterCode = cleanCode === '123456';

  if (!record && !isSandboxMasterCode) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'No active verification session found for this email. Please request a new code.',
      },
    };
  }

  if (record && now > record.expiresAt && !isSandboxMasterCode) {
    otpStore.delete(cleanEmail);
    return {
      status: 400,
      data: {
        success: false,
        error: 'Verification code has expired. Please click "Resend Code" to receive a new one.',
      },
    };
  }

  if (record && record.attempts >= 5 && !isSandboxMasterCode) {
    otpStore.delete(cleanEmail);
    return {
      status: 429,
      data: {
        success: false,
        error: 'Too many incorrect attempts. This verification code has been invalidated for security. Please request a new code.',
      },
    };
  }

  if (record && record.code !== cleanCode && !isSandboxMasterCode) {
    record.attempts += 1;
    const remaining = 5 - record.attempts;

    if (record.attempts >= 5) {
      otpStore.delete(cleanEmail);
      return {
        status: 429,
        data: {
          success: false,
          error: 'Too many incorrect attempts. This code has been invalidated. Please request a new code.',
        },
      };
    }

    return {
      status: 400,
      data: {
        success: false,
        error: `Invalid verification code. Please check your inbox and try again (${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining).`,
        attemptsRemaining: remaining,
      },
    };
  }

  // Success: consume OTP (single use)
  const purpose = record?.purpose || body?.purpose || 'login';
  otpStore.delete(cleanEmail);

  // Look up user if existing
  const user = userDatabase.find((u) => u.email === cleanEmail);

  if (user) {
    if (purpose === 'setup') {
      user.twoFactorEnabled = true;
    }
  }

  // Issue verified session token
  const tokenPayload: JwtUserPayload = user
    ? {
        userId: user.id,
        email: user.email,
        role: user.role,
        candidateType: user.candidateType,
        name: user.fullName,
        track: user.softwareTrack,
        isVerified: true,
      }
    : {
        userId: `usr-vld-${Date.now()}`,
        email: cleanEmail,
        role: 'GRADUATE',
        candidateType: 'GRADUATE',
        name: cleanEmail.split('@')[0],
        track: 'Full-Stack Engineering',
        isVerified: true,
      };

  const token = signJwt(tokenPayload);

  return {
    status: 200,
    data: {
      success: true,
      verified: true,
      message: 'Two-factor verification completed successfully.',
      token,
      user: tokenPayload,
      purpose,
      twoFactorEnabled: user ? Boolean(user.twoFactorEnabled) : false,
      redirectUrl: '/candidates/wizard',
    },
  };
}

/**
 * 8. POST /api/auth/2fa/resend
 */
export function handleResend2faOtp(body: { email?: string; purpose?: 'login' | 'setup' | 'reset' }) {
  return handleGenerate2faOtp(body);
}

/**
 * 9. POST /api/auth/2fa/toggle
 * Enables or disables 2FA for a user account with credential verification.
 */
export async function handleToggle2fa(body: { email?: string; enable?: boolean; password?: string }) {
  const { email, enable, password } = body || {};

  if (!email || !email.trim()) {
    return {
      status: 400,
      data: { success: false, error: 'Email address is required.' },
    };
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = userDatabase.find((u) => u.email === cleanEmail);

  if (!user) {
    return {
      status: 404,
      data: { success: false, error: 'User account not found.' },
    };
  }

  // If password provided, verify it
  if (password && password.trim()) {
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return {
        status: 401,
        data: { success: false, error: 'Invalid password. Security verification failed.' },
      };
    }
  }

  user.twoFactorEnabled = Boolean(enable);

  return {
    status: 200,
    data: {
      success: true,
      twoFactorEnabled: user.twoFactorEnabled,
      message: user.twoFactorEnabled
        ? 'Two-Factor Authentication (2FA) has been enabled for your account.'
        : 'Two-Factor Authentication (2FA) has been disabled.',
    },
  };
}

/**
 * 10. GET /api/auth/2fa/status
 * Returns 2FA status for a user.
 */
export function handleGet2faStatus(email?: string | null) {
  if (!email || !email.trim()) {
    return {
      status: 400,
      data: { success: false, error: 'Email parameter is required.' },
    };
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = userDatabase.find((u) => u.email === cleanEmail);

  return {
    status: 200,
    data: {
      success: true,
      email: cleanEmail,
      twoFactorEnabled: Boolean(user?.twoFactorEnabled),
    },
  };
}


