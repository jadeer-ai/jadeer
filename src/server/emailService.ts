/* ═══════════════════════════════════════════════════════════════════════════
   JADEER PLATFORM — EMAIL SERVICE & NOTIFICATION TRANSPORTER
   ─────────────────────────────────────────────────────────────────────────
   Handles transactional email delivery for Two-Factor Authentication (2FA),
   Candidate Onboarding, and Interview Invitations with responsive HTML templates.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface EmailDispatchRecord {
  id: string;
  to: string;
  subject: string;
  template: '2fa_otp' | 'password_reset' | 'interview_invite';
  code?: string;
  html?: string;
  sentAt: string;
  status: 'DELIVERED' | 'QUEUED' | 'FAILED';
}

export const emailDeliveryLogs: EmailDispatchRecord[] = [];

/**
 * Generate responsive Jadeer HTML template for 2FA Verification Code
 */
export function build2faEmailHtml(code: string, purpose: string, expiresMinutes: number = 5): string {
  const purposeTitle =
    purpose === 'setup'
      ? 'Activate Two-Factor Authentication'
      : purpose === 'reset'
      ? 'Reset Your Account Password'
      : 'Verify Your Sign-In';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Jadeer Verification Code</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F6; margin: 0; padding: 24px; color: #0B0F19; }
    .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 36px 32px; border: 1px solid rgba(11, 15, 25, 0.08); box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03); }
    .logo-badge { display: inline-flex; align-items: center; gap: 8px; background: #6E8F75; color: #ffffff; font-weight: 800; font-size: 13px; letter-spacing: 0.05em; padding: 6px 14px; border-radius: 12px; margin-bottom: 20px; }
    h1 { font-size: 22px; font-weight: 800; color: #0B0F19; margin-top: 0; margin-bottom: 12px; letter-spacing: -0.02em; }
    p { font-size: 14px; color: rgba(11, 15, 25, 0.65); line-height: 1.6; margin: 0 0 20px 0; }
    .code-box { background: #FAF9F6; border: 2px dashed #6E8F75; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: 'SF Mono', Consolas, Monaco, monospace; font-size: 36px; font-weight: 800; letter-spacing: 0.25em; color: #0B0F19; margin: 0; }
    .expiry { font-size: 12px; font-weight: 600; color: #6E8F75; margin-top: 8px; }
    .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #92400E; margin-top: 24px; }
    .footer { text-align: center; margin-top: 32px; font-size: 11px; color: rgba(11, 15, 25, 0.4); border-top: 1px solid rgba(11, 15, 25, 0.06); padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-badge">JADEER • جدير</div>
    <h1>${purposeTitle}</h1>
    <p>Please enter the 6-digit verification code below to complete your security verification on the Jadeer Platform.</p>
    
    <div class="code-box">
      <div class="otp-code">${code}</div>
      <div class="expiry">Expires in ${expiresMinutes} minutes • Single-use only</div>
    </div>

    <div class="warning">
      <strong>Security Notice:</strong> If you did not request this verification code, please ignore this email or change your password immediately.
    </div>

    <div class="footer">
      © 2026 Jadeer Engineering Platform • Riyadh, Saudi Arabia • Automated Security System
    </div>
  </div>
</body>
</html>
`.trim();
}

/**
 * Dispatch 2FA verification email
 */
export async function sendOtpEmail(options: {
  to: string;
  code: string;
  purpose?: 'login' | 'setup' | 'reset';
  expiresMinutes?: number;
}): Promise<{ success: boolean; messageId: string }> {
  const { to, code, purpose = 'login', expiresMinutes = 5 } = options;
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const subject = `[Jadeer] Your Security Verification Code: ${code} (${purpose.toUpperCase()})`;
  const htmlContent = build2faEmailHtml(code, purpose, expiresMinutes);

  const record: EmailDispatchRecord = {
    id: messageId,
    to,
    subject,
    template: '2fa_otp',
    code,
    html: htmlContent,
    sentAt: new Date().toISOString(),
    status: 'DELIVERED',
  };

  emailDeliveryLogs.push(record);

  // Structured sandbox console output
  console.log(`\n📧 ═════════════════════════════════════════════════════════════════`);
  console.log(`   JADEER EMAIL TRANSPORTER [SIMULATED DISPATCH]`);
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Code: ${code} (Valid for ${expiresMinutes} min)`);
  console.log(`   Message ID: ${messageId}`);
  console.log(`═════════════════════════════════════════════════════════════════\n`);

  return { success: true, messageId };
}
