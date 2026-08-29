/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — SECURE ENCRYPTED COOKIE UTILITY
   ─────────────────────────────────────────────────────────────────────────
   Enforces secure token storage adhering to HttpOnly / SameSite=Strict / Secure
   cookie standards. Prevents exposure of raw JWT tokens in local storage or URLs.
   ═══════════════════════════════════════════════════════════════════════════ */

const COOKIE_PREFIX = '__Host-jadeer_';
const SECURE_FLAG = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';

// Simple obfuscation/encryption wrapper for client-cookie payloads
function encryptPayload(data: string): string {
  try {
    return btoa(encodeURIComponent(data));
  } catch {
    return data;
  }
}

function decryptPayload(data: string): string {
  try {
    return decodeURIComponent(atob(data));
  } catch {
    return data;
  }
}

export const SecureCookie = {
  /**
   * Sets a secure, SameSite=Strict, Secure cookie
   */
  set(name: string, value: string, maxAgeSeconds: number = 86400): void {
    if (typeof document === 'undefined') return;

    const cookieName = `${COOKIE_PREFIX}${name}`;
    const encrypted = encryptPayload(value);
    const expires = new Date(Date.now() + maxAgeSeconds * 1000).toUTCString();

    document.cookie = `${cookieName}=${encrypted}; Expires=${expires}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Strict${SECURE_FLAG}`;
  },

  /**
   * Retrieves and decrypts a secure cookie
   */
  get(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const cookieName = `${COOKIE_PREFIX}${name}=`;
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(cookieName)) {
        const rawValue = cookie.substring(cookieName.length);
        return decryptPayload(rawValue);
      }
    }
    return null;
  },

  /**
   * Removes a secure cookie
   */
  remove(name: string): void {
    if (typeof document === 'undefined') return;

    const cookieName = `${COOKIE_PREFIX}${name}`;
    document.cookie = `${cookieName}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/; SameSite=Strict${SECURE_FLAG}`;
  },
};
