import { useState } from 'react';
import {
  User,
  MapPin,
  Mail,
  Globe,
  Edit3,
  Check,
  X,
  FileText,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  GraduationCap,
  Award,
  Save,
  CheckCircle2,
  Upload,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — COMPREHENSIVE CANDIDATE PROFILE
   Static overview with quick inline editing mode (no multi-step wizard restart).
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Inline Brand Icons ─────────────────────────────────────────────────── */
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface ProfileState {
  fullName: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  skills: {
    languages: string[];
    systems: string[];
    tools: string[];
  };
  education: {
    degree: string;
    institution: string;
    graduationYear: string;
  };
}

const initialProfile: ProfileState = {
  fullName: 'Ahmad Al-Hassan',
  title: 'Junior Backend & Systems Engineer',
  location: 'Riyadh, Saudi Arabia',
  email: 'ahmad.hassan@example.com',
  bio: 'Junior Software Engineer specialized in low-latency backend systems, asynchronous socket multiplexing with Linux epoll, and modern C++20 object-oriented architecture. Passionate about high-throughput distributed architectures, zero-cost abstractions, and rigorous memory safety with RAII.',
  githubUrl: 'https://github.com/ahmad-alhassan-dev',
  linkedinUrl: 'https://linkedin.com/in/ahmad-al-hassan',
  portfolioUrl: 'https://ahmadhassan.dev',
  skills: {
    languages: ['C++20', 'C', 'Python', 'SQL', 'Bash'],
    systems: ['Linux epoll', 'POSIX Sockets', 'gRPC', 'Redis Sentinel', 'RAII & Smart Pointers', 'vtable / CRTP'],
    tools: ['CMake', 'Valgrind / Memcheck', 'Docker', 'Git', 'GitHub Actions', 'GDB'],
  },
  education: {
    degree: 'B.S. in Software Engineering (Honors)',
    institution: 'King Saud University (KSU)',
    graduationYear: 'Class of 2025',
  },
};

export default function CandidateProfilesPage() {
  const [profile, setProfile] = useState<ProfileState>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileState>(initialProfile);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'languages' | 'systems' | 'tools'>('languages');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleStartEdit = () => {
    setDraft(JSON.parse(JSON.stringify(profile)));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setProfile(draft);
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    setDraft((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [newSkillCategory]: [...prev.skills[newSkillCategory], newSkillInput.trim()],
      },
    }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (category: 'languages' | 'systems' | 'tools', skillToRemove: string) => {
    setDraft((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((s) => s !== skillToRemove),
      },
    }));
  };

  return (
    <div className="space-y-7 animate-[fade-in_0.4s_ease] pb-14">

      {/* ═══════════════════════════════════════════════════════════════
         PROFILE HEADER CARD WITH INLINE EDIT TRIGGER
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          {/* Left: Avatar & Candidate Info */}
          <div className="flex items-start gap-4 sm:gap-5 flex-1">
            <div className="relative">
              <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-3xl bg-[#6E8F75] text-white flex items-center justify-center text-xl sm:text-2xl font-bold ring-4 ring-[#6E8F75]/15 shadow-md shrink-0">
                AH
              </div>
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#10b981] ring-2 ring-white" />
            </div>

            <div className="space-y-1 flex-1">
              {!isEditing ? (
                <>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-xs font-bold border border-[#6E8F75]/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Profile
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#0B0F19]/[0.04] text-[#0B0F19]/60">
                      ID: JAD-8492
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
                    {profile.fullName}
                  </h1>

                  <p className="text-[14.5px] text-[#0B0F19]/65 font-medium">
                    {profile.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#0B0F19]/45 pt-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#6E8F75]" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#6E8F75]" />
                      {profile.email}
                    </span>
                  </div>
                </>
              ) : (
                /* Inline Edit Mode Fields for Header */
                <div className="space-y-3 w-full max-w-lg">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0B0F19]/40 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={draft.fullName}
                      onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-[#0B0F19]/[0.1] text-sm font-bold text-[#0B0F19] focus:border-[#6E8F75] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0B0F19]/40 mb-1">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19] focus:border-[#6E8F75] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0B0F19]/40 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={draft.location}
                        onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-[#0B0F19]/[0.1] text-xs font-semibold text-[#0B0F19] focus:border-[#6E8F75] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Right: Edit Mode Controls */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            {!isEditing ? (
              <button
                id="edit-profile-btn"
                onClick={handleStartEdit}
                className="
                  inline-flex items-center gap-2 px-5 py-3 rounded-2xl
                  bg-[#6E8F75] text-white text-xs font-bold
                  hover:bg-[#5d7d64] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)]
                  transition-all duration-200 shadow-sm cursor-pointer active:scale-95
                "
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19]/60 hover:text-[#0B0F19] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] transition-all shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Saved Confirmation Notification */}
        {showSavedToast && (
          <div className="mt-4 p-3 rounded-2xl bg-[#ecfdf5] border border-emerald-200 text-xs text-[#065f46] font-semibold flex items-center gap-2 animate-[slide-up_0.2s_ease]">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>Profile information updated and synced across all evaluation modules.</span>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         MAIN PROFILE DETAILS (GRID SECTIONS)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─────────────────────────────────────────────────────────────
           LEFT COLUMN (8 cols): BIO, TECHNICAL SKILLS, EDUCATION
           ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. Professional Bio & Summary */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <h2 className="text-base font-extrabold text-[#0B0F19]">
                Professional Summary & Focus
              </h2>
              <span className="text-[11px] font-semibold text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-0.5 rounded-md">
                Verified Dossier
              </span>
            </div>

            {!isEditing ? (
              <p className="text-[14px] text-[#0B0F19]/70 leading-relaxed">
                {profile.bio}
              </p>
            ) : (
              <textarea
                rows={4}
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                className="w-full p-3.5 rounded-2xl border border-[#0B0F19]/[0.1] text-xs leading-relaxed text-[#0B0F19] focus:border-[#6E8F75] focus:outline-none"
              />
            )}
          </div>

          {/* 2. Verified Technical Skills Taxonomy */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <div>
                <h2 className="text-base font-extrabold text-[#0B0F19]">
                  Verified Technical Competencies
                </h2>
                <p className="text-xs text-[#0B0F19]/40 mt-0.5">
                  Core competencies evaluated through AI interviews and production PRs
                </p>
              </div>
              <span className="text-xs font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-1 rounded-full">
                {profile.skills.languages.length + profile.skills.systems.length + profile.skills.tools.length} Skills
              </span>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/40 block">
                Programming Languages
              </span>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? draft.skills.languages : profile.skills.languages).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-xs font-semibold text-[#0B0F19]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6E8F75]" />
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill('languages', skill)}
                        className="ml-1 text-rose-500 hover:text-rose-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Systems & Architecture */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/40 block">
                Systems, Concurrency & Networking
              </span>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? draft.skills.systems : profile.skills.systems).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6E8F75]/10 border border-[#6E8F75]/20 text-xs font-semibold text-[#6E8F75]"
                  >
                    <Check className="w-3 h-3 text-[#6E8F75]" />
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill('systems', skill)}
                        className="ml-1 text-rose-500 hover:text-rose-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools & DevOps */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/40 block">
                Engineering Tools & Diagnostics
              </span>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? draft.skills.tools : profile.skills.tools).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-xs font-semibold text-[#0B0F19]/70"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill('tools', skill)}
                        className="ml-1 text-rose-500 hover:text-rose-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Inline Add Skill Tool (Only in Edit Mode) */}
            {isEditing && (
              <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-dashed border-[#0B0F19]/15 flex flex-wrap items-center gap-2 pt-3">
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="h-9 px-2 rounded-xl bg-white border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19] font-medium"
                >
                  <option value="languages">Languages</option>
                  <option value="systems">Systems & Networking</option>
                  <option value="tools">Tools & Diagnostics</option>
                </select>
                <input
                  type="text"
                  placeholder="e.g. Memory Profiling, Asio..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddSkill();
                  }}
                  className="flex-1 h-9 px-3 rounded-xl bg-white border border-[#0B0F19]/[0.1] text-xs text-[#0B0F19]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3.5 py-2 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64]"
                >
                  Add Skill
                </button>
              </div>
            )}
          </div>

          {/* 3. Education & Academic Background */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between border-b border-[#0B0F19]/[0.05] pb-3">
              <h2 className="text-base font-extrabold text-[#0B0F19] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#6E8F75]" />
                Education & Verification
              </h2>
            </div>

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#0B0F19]">
                  {profile.education.degree}
                </h3>
                <p className="text-xs text-[#0B0F19]/55">
                  {profile.education.institution} • {profile.education.graduationYear}
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                Degree Verified
              </span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           RIGHT COLUMN (4 cols): PROFILES, RESUME ATTACHMENT, STATUS
           ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. Connected Profiles & External Links */}
          <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
            <h2 className="text-sm font-extrabold text-[#0B0F19] border-b border-[#0B0F19]/[0.05] pb-2.5">
              Connected Profiles
            </h2>

            {!isEditing ? (
              <div className="space-y-2.5 text-xs">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] hover:border-[#6E8F75]/30 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <GitHubIcon className="w-4 h-4 text-[#0B0F19]" />
                    <span className="font-bold text-[#0B0F19]">GitHub</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#0B0F19]/30 group-hover:text-[#6E8F75]" />
                </a>

                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] hover:border-[#6E8F75]/30 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <LinkedInIcon className="w-4 h-4 text-[#0077b5]" />
                    <span className="font-bold text-[#0B0F19]">LinkedIn</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#0B0F19]/30 group-hover:text-[#6E8F75]" />
                </a>

                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] hover:border-[#6E8F75]/30 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#6E8F75]" />
                    <span className="font-bold text-[#0B0F19]">Personal Website</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#0B0F19]/30 group-hover:text-[#6E8F75]" />
                </a>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#0B0F19]/40 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={draft.githubUrl}
                    onChange={(e) => setDraft({ ...draft, githubUrl: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-[#0B0F19]/10 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#0B0F19]/40 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={draft.linkedinUrl}
                    onChange={(e) => setDraft({ ...draft, linkedinUrl: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-[#0B0F19]/10 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#0B0F19]/40 mb-1">Portfolio Website</label>
                  <input
                    type="text"
                    value={draft.portfolioUrl}
                    onChange={(e) => setDraft({ ...draft, portfolioUrl: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg border border-[#0B0F19]/10 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Uploaded Resume Artifact */}
          <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-3">
            <h2 className="text-sm font-extrabold text-[#0B0F19] border-b border-[#0B0F19]/[0.05] pb-2.5">
              Verified Resume
            </h2>

            <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] space-y-2">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#6E8F75] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold text-[#0B0F19] truncate">
                    Ahmad_Al-Hassan_Resume.pdf
                  </p>
                  <p className="text-[10px] text-[#0B0F19]/40">
                    1.4 MB • Analyzed by Jadeer AI
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#0B0F19]/[0.04] text-[11px]">
                <span className="text-[#6E8F75] font-semibold">Active Document</span>
                <span className="text-[#0B0F19]/40 font-mono">PDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
