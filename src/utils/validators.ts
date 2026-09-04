/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — FORM & DOMAIN VALIDATORS
   ─────────────────────────────────────────────────────────────────────────
   Corporate email verification and institutional domain checking.
   ═══════════════════════════════════════════════════════════════════════════ */

// Disallowed free / personal consumer email domains
const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'ymail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'aim.com',
  'zoho.com',
  'zohomail.com',
  'yandex.com',
  'yandex.ru',
  'mail.com',
  'email.com',
  'usa.com',
  'gmx.com',
  'gmx.net',
  'protonmail.com',
  'proton.me',
  'pm.me',
  'tutanota.com',
  'tuta.io',
  'fastmail.com',
  'hushmail.com',
]);

export interface CorporateEmailValidation {
  isValid: boolean;
  domain?: string;
  error?: string;
}

/**
 * Validates that an email belongs to a corporate/institutional domain
 * and rejects free consumer webmail providers.
 */
export function validateCorporateEmail(email: string): CorporateEmailValidation {
  const trimmed = email.trim().toLowerCase();

  // Basic regex check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address format (e.g. name@company.com).',
    };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      error: 'Please enter a valid email address.',
    };
  }

  const domain = parts[1];

  // Check personal domain blacklist
  if (PERSONAL_EMAIL_DOMAINS.has(domain)) {
    return {
      isValid: false,
      domain,
      error: `Personal email providers (@${domain}) are not permitted. Please use an authorized corporate or institutional work email.`,
    };
  }

  return {
    isValid: true,
    domain,
  };
}

/* ── CV Analysis Validators ─────────────────────────────────────────────── */

/**
 * Returns true only if the value is a valid http:// or https:// URL.
 * Rejects non-URL text like "GitHub", "LinkedIn", empty strings, null.
 * Never generates guessed URLs.
 */
export function isValidExternalUrl(value: string | null | undefined): boolean {
  if (!value || typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Safely displays a free-form date string extracted by the CV parser.
 * Returns the original string trimmed if truthy, or the fallback.
 * Does NOT parse into JavaScript Date — real parser dates include
 * "2026", "Present", "Mar 2023", "Ongoing", "2027 (Expected)".
 */
export function displayExtractedDate(
  value: string | null | undefined,
  fallback: string = '',
): string {
  if (!value || typeof value !== 'string') return fallback;
  return value.trim();
}

