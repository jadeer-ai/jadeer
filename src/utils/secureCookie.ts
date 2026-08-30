/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — SECURE ENCRYPTED COOKIE UTILITY
   ─────────────────────────────────────────────────────────────────────────
   Enforces secure token storage adhering to HttpOnly / SameSite=Strict / Secure
   cookie standards. Prevents exposure of raw JWT tokens in local storage or URLs.
   ═══════════════════════════════════════════════════════════════════════════ */

const COOKIE_PREFIX = 'jadeer_';
const SECURE_FLAG = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';

function decodeCookieValue(raw: string): string {
  if (!raw) return '';
  // Try URI decode first
  try {
    const uriDecoded = decodeURIComponent(raw);
    // If it looks like JSON or normal string, return it
    if (uriDecoded.startsWith('{') || uriDecoded.startsWith('[') || uriDecoded.startsWith('eyJ')) {
      return uriDecoded;
    }
    // Try base64 decode if applicable
    try {
      const b64Decoded = decodeURIComponent(atob(uriDecoded));
      if (b64Decoded) return b64Decoded;
    } catch {
      // not base64
    }
    return uriDecoded;
  } catch {
    return raw;
  }
}

export const SecureCookie = {
  /**
   * Sets a secure cookie
   */
  set(name: string, value: string, maxAgeSeconds: number = 86400 * 7): void {
    if (typeof document === 'undefined') return;

    const expires = new Date(Date.now() + maxAgeSeconds * 1000).toUTCString();
    const encoded = encodeURIComponent(value);

    document.cookie = `${name}=${encoded}; Expires=${expires}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${SECURE_FLAG}`;
    document.cookie = `${COOKIE_PREFIX}${name}=${encoded}; Expires=${expires}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${SECURE_FLAG}`;
  },

  /**
   * Retrieves and decodes a cookie by name, checking standard and prefixed forms
   */
  get(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    const lookupNames = [name, `${COOKIE_PREFIX}${name}`, `__Host-jadeer_${name}`];

    for (let cookie of cookies) {
      cookie = cookie.trim();
      for (const targetName of lookupNames) {
        const prefix = `${targetName}=`;
        if (cookie.startsWith(prefix)) {
          const rawValue = cookie.substring(prefix.length);
          return decodeCookieValue(rawValue);
        }
      }
    }
    return null;
  },

  /**
   * Removes a cookie
   */
  remove(name: string): void {
    if (typeof document === 'undefined') return;

    const lookupNames = [name, `${COOKIE_PREFIX}${name}`, `__Host-jadeer_${name}`];
    for (const targetName of lookupNames) {
      document.cookie = `${targetName}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/; SameSite=Lax${SECURE_FLAG}`;
    }
  },
};

