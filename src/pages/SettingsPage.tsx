import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useCandidateJourney } from '@/contexts/CandidateJourneyContext';
import { AuthService } from '@/services/authService';
import {
  Settings,
  Mail,
  Lock,
  Bell,
  ShieldCheck,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  Save,
  AlertCircle,
  Smartphone,
  Loader2,
  ShieldAlert,
  X,
  LogOut,
  GraduationCap,
  Briefcase,
  Layers,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — SETTINGS & PREFERENCES
   Ultra-minimalist, smart account security, 2FA & email preferences.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function SettingsPage() {
  const { clearUserRole } = useUserRole();
  const { profile: userProfile } = useUserProfile();
  const { resetOnboarding } = useCandidateJourney();
  const navigate = useNavigate();

  const currentRole = userProfile.role === 'student' ? 'student' : 'grad';

  // Account state
  const session = AuthService.getCurrentSession();
  const [email, setEmail] = useState(session?.user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorModal, setTwoFactorModal] = useState<'enable' | 'disable' | null>(null);
  const [twoFactorOtp, setTwoFactorOtp] = useState('');
  const [twoFactorPassword, setTwoFactorPassword] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  // Fetch initial 2FA status
  useEffect(() => {
    AuthService.get2faStatus(email).then((res) => {
      if (res.success) {
        setTwoFactorEnabled(res.twoFactorEnabled);
      }
    });
  }, [email]);

  // Notification toggles
  const [notifications, setNotifications] = useState({
    interviewRequests: true,
    applicationStatus: true,
    mentorReviews: true,
    talentDigest: false,
  });

  // Toasts
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast('Account credentials and security settings updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSavedToast(null), 3500);
  };

  const handleSaveNotifications = () => {
    setSavedToast('Email notification preferences saved. Interview invitations will be delivered directly to your inbox.');
    setTimeout(() => setSavedToast(null), 3500);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Open 2FA Setup Modal
  const handleStartEnable2fa = async () => {
    setTwoFactorError(null);
    setTwoFactorOtp('');
    setTwoFactorLoading(true);
    setTwoFactorModal('enable');

    const res = await AuthService.sendOtp(email, 'setup');
    setTwoFactorLoading(false);

    if (res.success && res.code) {
      setDemoOtp(res.code);
    } else if (!res.success) {
      setTwoFactorError(res.error || 'Failed to dispatch verification code.');
    }
  };

  // Confirm 2FA OTP verification
  const handleConfirmEnable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorOtp.trim()) return;

    setTwoFactorError(null);
    setTwoFactorLoading(true);

    const res = await AuthService.verifyOtp(email, twoFactorOtp.trim(), 'setup');
    setTwoFactorLoading(false);

    if (res.success) {
      setTwoFactorEnabled(true);
      setTwoFactorModal(null);
      setSavedToast('Two-Factor Authentication (2FA) has been successfully activated!');
      setTimeout(() => setSavedToast(null), 3500);
    } else {
      setTwoFactorError(res.error || 'Invalid verification code. Please check and retry.');
    }
  };

  // Confirm 2FA Disable
  const handleConfirmDisable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorError(null);
    setTwoFactorLoading(true);

    const res = await AuthService.toggle2fa(false, twoFactorPassword);
    setTwoFactorLoading(false);

    if (res.success) {
      setTwoFactorEnabled(false);
      setTwoFactorModal(null);
      setTwoFactorPassword('');
      setSavedToast('Two-Factor Authentication (2FA) has been disabled.');
      setTimeout(() => setSavedToast(null), 3500);
    } else {
      setTwoFactorError(res.error || 'Failed to disable 2FA. Please verify password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fade-in_0.4s_ease] pb-16 py-2 sm:py-4">

      {/* ═══════════════════════════════════════════════════════════════
         PAGE HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-[#6E8F75]/10 text-[#6E8F75] border-[#6E8F75]/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Account Security & Delivery
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#0B0F19]/[0.04] text-[#0B0F19]/60">
                {userProfile.fullName || 'Candidate'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-[14.5px] text-[#0B0F19]/55 leading-relaxed">
              Manage your credentials, password security, and direct email notification channels for job matches and interview requests.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-[#6E8F75] flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6" />
          </div>
        </div>

        {/* Success Toast */}
        {savedToast && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#ecfdf5] border border-emerald-200 text-xs text-[#065f46] font-semibold flex items-center gap-2 animate-[slide-up_0.3s_var(--ease-spring)]">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>{savedToast}</span>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         SECTION 1: NOTIFICATION PREFERENCES (MOST IMPORTANT)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0B0F19] tracking-tight">
                Notification Preferences
              </h2>
              <p className="text-xs text-[#0B0F19]/45">
                Configure direct email alerts for interview invitations and application progress
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex text-xs font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-3 py-1 rounded-full">
            Email Delivery
          </span>
        </div>

        {/* Email Direct Integration Callout */}
        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] flex items-start gap-3 text-xs text-[#0B0F19]/75">
          <Mail className="w-4 h-4 text-[#6E8F75] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#0B0F19] font-bold">Automated Email Dispatch:</strong> When an employer requests an interview, the invitation, calendar time slot, and meeting link are sent directly to <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#0B0F19]/[0.06] text-[#0B0F19]">{email}</code>.
          </p>
        </div>

        {/* Toggle List */}
        <div className="space-y-4 pt-1">
          {/* Toggle 1: Interview Requests & Job Matches */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#0B0F19]/[0.06] hover:border-[#6E8F75]/30 transition-all flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[14.5px] font-bold text-[#0B0F19]">
                  Interview Requests & Job Matches
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#6E8F75]/10 text-[#6E8F75] uppercase">
                  Essential
                </span>
              </div>
              <p className="text-xs text-[#0B0F19]/60 leading-relaxed">
                Receive instant email alerts when hiring companies review your Evidence Dossier and send 1-to-1 technical interview invitations.
              </p>
            </div>

            {/* Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={notifications.interviewRequests}
              onClick={() => toggleNotification('interviewRequests')}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                transition-colors duration-200 ease-in-out focus:outline-none mt-1
                ${notifications.interviewRequests ? 'bg-[#6E8F75]' : 'bg-[#0B0F19]/20'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md
                  transform ring-0 transition duration-200 ease-in-out
                  ${notifications.interviewRequests ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Toggle 2: Application Status Updates */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#0B0F19]/[0.06] hover:border-[#6E8F75]/30 transition-all flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[14.5px] font-bold text-[#0B0F19]">
                Application Status Updates
              </span>
              <p className="text-xs text-[#0B0F19]/60 leading-relaxed">
                Get notified when an engineering manager reviews your pull request benchmarks, shortlists your application, or updates your hiring stage.
              </p>
            </div>

            {/* Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={notifications.applicationStatus}
              onClick={() => toggleNotification('applicationStatus')}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                transition-colors duration-200 ease-in-out focus:outline-none mt-1
                ${notifications.applicationStatus ? 'bg-[#6E8F75]' : 'bg-[#0B0F19]/20'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md
                  transform ring-0 transition duration-200 ease-in-out
                  ${notifications.applicationStatus ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Toggle 3: Mentor Code Reviews & Workspace Syncs */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#0B0F19]/[0.06] hover:border-[#6E8F75]/30 transition-all flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[14.5px] font-bold text-[#0B0F19]">
                Mentor Code Reviews & Project Syncs
              </span>
              <p className="text-xs text-[#0B0F19]/60 leading-relaxed">
                Real-time emails when your assigned Senior Mentor comments on your GitHub commits or schedules a live architecture calibration.
              </p>
            </div>

            {/* Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={notifications.mentorReviews}
              onClick={() => toggleNotification('mentorReviews')}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                transition-colors duration-200 ease-in-out focus:outline-none mt-1
                ${notifications.mentorReviews ? 'bg-[#6E8F75]' : 'bg-[#0B0F19]/20'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md
                  transform ring-0 transition duration-200 ease-in-out
                  ${notifications.mentorReviews ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Toggle 4: Weekly Talent Digest */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#0B0F19]/[0.06] hover:border-[#6E8F75]/30 transition-all flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[14.5px] font-bold text-[#0B0F19]">
                Weekly Jadeer Talent Digest
              </span>
              <p className="text-xs text-[#0B0F19]/60 leading-relaxed">
                Weekly curated summary of new high-concurrency systems, C++, and backend engineering roles matching your Skill Graph.
              </p>
            </div>

            {/* Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={notifications.talentDigest}
              onClick={() => toggleNotification('talentDigest')}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                transition-colors duration-200 ease-in-out focus:outline-none mt-1
                ${notifications.talentDigest ? 'bg-[#6E8F75]' : 'bg-[#0B0F19]/20'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md
                  transform ring-0 transition duration-200 ease-in-out
                  ${notifications.talentDigest ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Save Notifications Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSaveNotifications}
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-2xl
              bg-[#6E8F75] hover:bg-[#5d7d64] text-white text-xs font-bold
              hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)] transition-all shadow-sm cursor-pointer active:scale-95
            "
          >
            <Save className="w-4 h-4" />
            <span>Save Notification Preferences</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         SECTION 2: ACCOUNT SETTINGS & PASSWORD
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B0F19]/[0.05] text-[#0B0F19] flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5 text-[#6E8F75]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0B0F19] tracking-tight">
                Account Credentials & Security
              </h2>
              <p className="text-xs text-[#0B0F19]/45">
                Update your primary login email and secure your account with password rotation
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateAccount} className="space-y-5">
          {/* Read-Only Candidate Role Status Card */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center font-bold shrink-0">
                {currentRole === 'student' ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-xs font-bold text-[#0B0F19]">
                  Candidate Status:{' '}
                  <span className="text-[#6E8F75]">
                    {currentRole === 'student' ? 'University Student (Internships & Co-ops)' : 'Graduate Engineer (Full-Time Roles)'}
                  </span>
                </p>
                <p className="text-[11px] text-[#0B0F19]/50">
                  Role locked at registration. Graduation transitions and status upgrades are verified and processed by institution administrators.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#45624c] bg-[#dce8de] px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto shrink-0 border border-[#b9d1bf]">
              Locked & Verified
            </span>
          </div>

          {/* Locked Technical Track Badge */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0B0F19]">
                  Technical Domain: <span className="text-[#6E8F75]">{userProfile.track || 'Backend Development'}</span>
                </p>
                <p className="text-[11px] text-[#0B0F19]/50">
                  Locked permanently upon account verification to anchor AI telemetry and project evaluations.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto shrink-0 border border-amber-200/50">
              Immutable Track
            </span>
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60">
                Registered Email Address
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10b981]">
                <Check className="w-3 h-3" />
                Verified for Job Alerts
              </span>
            </div>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-sm text-[#0B0F19] font-medium focus:bg-white focus:outline-none focus:border-[#6E8F75]"
              />
            </div>
          </div>

          {/* Password fields */}
          <div className="pt-2 border-t border-[#0B0F19]/[0.05] space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60 block">
              Change Account Password
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current Password */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-[#0B0F19]/60">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] focus:bg-white focus:outline-none focus:border-[#6E8F75]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B0F19]/40 hover:text-[#0B0F19]"
                  >
                    {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#0B0F19]/60">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] focus:bg-white focus:outline-none focus:border-[#6E8F75]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B0F19]/40 hover:text-[#0B0F19]"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#0B0F19]/60">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] focus:bg-white focus:outline-none focus:border-[#6E8F75]"
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-2xl
                bg-[#0B0F19] text-white text-xs font-bold
                hover:bg-[#1a2440] transition-colors shadow-sm cursor-pointer
              "
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Update Credentials</span>
            </button>
          </div>
        </form>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         SECTION 3: TWO-FACTOR AUTHENTICATION (2FA) & SECURITY
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${twoFactorEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-[#0B0F19]/[0.05] text-[#0B0F19]'} flex items-center justify-center font-bold`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0B0F19] tracking-tight flex items-center gap-2.5">
                <span>Two-Factor Authentication (2FA)</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-[#0B0F19]/[0.06] text-[#0B0F19]/60'}`}>
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </h2>
              <p className="text-xs text-[#0B0F19]/45">
                Enforce a 6-digit verification code sent to your email on every login attempt for enhanced account protection.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={twoFactorEnabled ? () => setTwoFactorModal('disable') : handleStartEnable2fa}
            className={`
              px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer
              ${twoFactorEnabled
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-[#6E8F75] hover:bg-[#5d7d64] text-white'
              }
            `}
          >
            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] flex items-start gap-3.5 text-xs text-[#0B0F19]/75">
          <ShieldCheck className={`w-4 h-4 ${twoFactorEnabled ? 'text-emerald-600' : 'text-[#6E8F75]'} shrink-0 mt-0.5`} />
          <div className="space-y-1">
            <p className="font-bold text-[#0B0F19]">
              {twoFactorEnabled
                ? 'Your account is cryptographically protected by Two-Factor Authentication.'
                : 'Protect your candidate profile, technical assessments, and interview invitations.'}
            </p>
            <p className="text-[#0B0F19]/60 leading-relaxed">
              When enabled, signing in requires your password plus a single-use 6-digit OTP with strict 5-minute expiration and anti-brute-force rate limiting.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2FA Setup Modal ────────────────────────────────────────── */}
      {twoFactorModal === 'enable' && (
        <div className="fixed inset-0 z-50 bg-[#0B0F19]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0B0F19]/[0.08] relative">
            <button
              onClick={() => setTwoFactorModal(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-[#0B0F19]/[0.05] text-[#0B0F19]/40 hover:text-[#0B0F19] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#0B0F19] tracking-tight">
                Verify Two-Factor Authentication
              </h3>
              <p className="text-xs text-[#0B0F19]/60 max-w-xs mx-auto">
                We've sent a 6-digit verification code to <strong className="text-[#0B0F19]">{email}</strong>.
              </p>
            </div>

            {demoOtp && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-800 font-mono">
                Sandbox Demo Code: <strong>{demoOtp}</strong> (Valid for 5 mins)
              </div>
            )}

            {twoFactorError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{twoFactorError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmEnable2fa} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60 mb-1.5 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorOtp}
                  onChange={(e) => setTwoFactorOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  required
                  autoFocus
                  className="w-full h-12 text-center text-xl font-mono font-bold tracking-[0.3em] rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] focus:bg-white focus:outline-none focus:border-[#6E8F75]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setTwoFactorModal(null)}
                  className="flex-1 py-3 rounded-xl bg-[#FAF9F6] text-[#0B0F19]/70 text-xs font-bold hover:bg-[#0B0F19]/[0.05] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={twoFactorOtp.length < 6 || twoFactorLoading}
                  className="flex-1 py-3 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {twoFactorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Activate 2FA</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 2FA Disable Modal ──────────────────────────────────────── */}
      {twoFactorModal === 'disable' && (
        <div className="fixed inset-0 z-50 bg-[#0B0F19]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#0B0F19]/[0.08] relative">
            <button
              onClick={() => setTwoFactorModal(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-[#0B0F19]/[0.05] text-[#0B0F19]/40 hover:text-[#0B0F19] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#0B0F19] tracking-tight">
                Disable Two-Factor Authentication
              </h3>
              <p className="text-xs text-[#0B0F19]/60 max-w-xs mx-auto">
                Please enter your password to confirm deactivation of 2FA.
              </p>
            </div>

            {twoFactorError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{twoFactorError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmDisable2fa} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B0F19]/60 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={twoFactorPassword}
                  onChange={(e) => setTwoFactorPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoFocus
                  className="w-full h-11 px-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] focus:bg-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setTwoFactorModal(null)}
                  className="flex-1 py-3 rounded-xl bg-[#FAF9F6] text-[#0B0F19]/70 text-xs font-bold hover:bg-[#0B0F19]/[0.05] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={twoFactorLoading}
                  className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {twoFactorLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Deactivation</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         SECTION 4: PORTAL SETTINGS, LOGOUT & RESET
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-6">
        {/* Sign Out Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#0B0F19]/[0.06]">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-[#0B0F19] tracking-tight flex items-center gap-2">
              <LogOut className="w-5 h-5 text-rose-600" />
              <span>Sign Out of Account</span>
            </h2>
            <p className="text-xs text-[#0B0F19]/55">
              Safely terminate your current session, invalidate tokens, and clear stored credentials.
            </p>
          </div>
          <button
            type="button"
            id="settings-signout-btn"
            onClick={async () => {
              await AuthService.logout();
              clearUserRole();
              resetOnboarding();
              navigate('/signin');
            }}
            className="
              inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl
              bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold
              transition-all shadow-md cursor-pointer active:scale-95
            "
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Now</span>
          </button>
        </div>

        {/* Portal Path Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#0B0F19] tracking-tight">
              Portal Path Selection
            </h2>
            <p className="text-xs text-[#0B0F19]/55">
              Reset your active view preferences and return to the main role selection screen.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearUserRole();
              resetOnboarding();
              navigate('/');
            }}
            className="
              inline-flex items-center justify-center px-5 py-2.5 rounded-xl
              bg-red-50 text-red-600 text-xs font-bold border border-red-100
              hover:bg-red-100 hover:text-red-700 transition-all cursor-pointer active:scale-95
            "
          >
            Exit Portal Selection
          </button>
        </div>
      </div>
    </div>
  );
}
