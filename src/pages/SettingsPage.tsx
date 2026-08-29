import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useCandidateJourney } from '@/contexts/CandidateJourneyContext';
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
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — SETTINGS & PREFERENCES
   Ultra-minimalist, smart account security and email notification preferences.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function SettingsPage() {
  const { isStudent, clearUserRole } = useUserRole();
  const { resetOnboarding } = useCandidateJourney();
  const navigate = useNavigate();

  // Account state
  const [email, setEmail] = useState('ahmad.hassan@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fade-in_0.4s_ease] pb-16 py-2 sm:py-4">

      {/* ═══════════════════════════════════════════════════════════════
         PAGE HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isStudent ? 'bg-student-500/10 text-student-600 border-student-500/20' : 'bg-[#6E8F75]/10 text-[#6E8F75] border-[#6E8F75]/20'}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                Account Security & Delivery
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#0B0F19]/[0.04] text-[#0B0F19]/60">
                Ahmad Al-Hassan
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-[14.5px] text-[#0B0F19]/55 leading-relaxed">
              Manage your credentials, password security, and direct email notification channels for job matches and interview requests.
            </p>
          </div>

          <div className={`w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] ${isStudent ? 'text-student-500' : 'text-[#6E8F75]'} flex items-center justify-center shrink-0`}>
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
            <div className={`w-10 h-10 rounded-2xl ${isStudent ? 'bg-student-500/10 text-student-500' : 'bg-[#6E8F75]/10 text-[#6E8F75]'} flex items-center justify-center font-bold`}>
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

          <span className={`hidden sm:inline-flex text-xs font-bold ${isStudent ? 'text-student-500 bg-student-500/10' : 'text-[#6E8F75] bg-[#6E8F75]/10'} px-3 py-1 rounded-full`}>
            Email Delivery
          </span>
        </div>

        {/* Email Direct Integration Callout */}
        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] flex items-start gap-3 text-xs text-[#0B0F19]/75">
          <Mail className={`w-4 h-4 ${isStudent ? 'text-student-500' : 'text-[#6E8F75]'} shrink-0 mt-0.5`} />
          <p className="leading-relaxed">
            <strong className="text-[#0B0F19] font-bold">Automated Email Dispatch:</strong> When an employer requests an interview, the invitation, calendar time slot, and meeting link are sent directly to <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#0B0F19]/[0.06] text-[#0B0F19]">{email}</code>.
          </p>
        </div>

        {/* Toggle List */}
        <div className="space-y-4 pt-1">
          {/* Toggle 1: Interview Requests & Job Matches */}
          <div className={`p-4 sm:p-5 rounded-2xl bg-white border border-[#0B0F19]/[0.06] ${isStudent ? 'hover:border-student-500/30' : 'hover:border-[#6E8F75]/30'} transition-all flex items-start justify-between gap-4`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[14.5px] font-bold text-[#0B0F19]">
                  Interview Requests & Job Matches
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isStudent ? 'bg-student-500/10 text-student-600' : 'bg-[#6E8F75]/10 text-[#6E8F75]'} uppercase`}>
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
                ${notifications.interviewRequests ? (isStudent ? 'bg-student-500' : 'bg-[#6E8F75]') : 'bg-[#0B0F19]/20'}
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
          <div className={`p-4 sm:p-5 rounded-2xl bg-white border border-[#0B0F19]/[0.06] ${isStudent ? 'hover:border-student-500/30' : 'hover:border-[#6E8F75]/30'} transition-all flex items-start justify-between gap-4`}>
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
                ${notifications.applicationStatus ? (isStudent ? 'bg-student-500' : 'bg-[#6E8F75]') : 'bg-[#0B0F19]/20'}
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
          <div className={`p-4 sm:p-5 rounded-2xl bg-white border border-[#0B0F19]/[0.06] ${isStudent ? 'hover:border-student-500/30' : 'hover:border-[#6E8F75]/30'} transition-all flex items-start justify-between gap-4`}>
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
                ${notifications.mentorReviews ? (isStudent ? 'bg-student-500' : 'bg-[#6E8F75]') : 'bg-[#0B0F19]/20'}
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
          <div className={`p-4 sm:p-5 rounded-2xl bg-white border border-[#0B0F19]/[0.06] ${isStudent ? 'hover:border-student-500/30' : 'hover:border-[#6E8F75]/30'} transition-all flex items-start justify-between gap-4`}>
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
                ${notifications.talentDigest ? (isStudent ? 'bg-student-500' : 'bg-[#6E8F75]') : 'bg-[#0B0F19]/20'}
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
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-2xl
              text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95
              ${isStudent
                ? 'bg-student-500 hover:bg-student-600 hover:shadow-[0_4px_16px_rgba(0,86,214,0.3)]'
                : 'bg-[#6E8F75] hover:bg-[#5d7d64] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)]'
              }
            `}
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
              <KeyRound className={`w-5 h-5 ${isStudent ? 'text-student-500' : 'text-[#6E8F75]'}`} />
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
          {/* Locked Technical Track Badge */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0B0F19]">
                  Technical Domain: <span className={isStudent ? 'text-student-600' : 'text-[#6E8F75]'}>{useUserRole().lockedTrack || 'Backend Development'}</span>
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
                className={`w-full h-11 px-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-sm text-[#0B0F19] font-medium focus:bg-white focus:outline-none ${isStudent ? 'focus:border-student-500' : 'focus:border-[#6E8F75]'}`}
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
                    className={`w-full h-10 px-3.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] focus:bg-white focus:outline-none ${isStudent ? 'focus:border-student-500' : 'focus:border-[#6E8F75]'}`}
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
                    className={`w-full h-10 px-3.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] focus:bg-white focus:outline-none ${isStudent ? 'focus:border-student-500' : 'focus:border-[#6E8F75]'}`}
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
                  className={`w-full h-10 px-3.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] focus:bg-white focus:outline-none ${isStudent ? 'focus:border-student-500' : 'focus:border-[#6E8F75]'}`}
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
         SECTION 3: PORTAL SETTINGS & RESET
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-[#0B0F19] tracking-tight">
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
              inline-flex items-center justify-center px-5 py-3 rounded-2xl
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
