import { useState, useEffect, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { BrandLogo } from '@/components/common';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useCandidateJourney } from '@/contexts/CandidateJourneyContext';
import { AuthService } from '@/services/authService';
import {
  User,
  Code2,
  FileUp,
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  Briefcase,
  Search,
  X,
  Upload,
  FileText,
  Globe,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';

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

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CANDIDATE ACCOUNT CREATION WIZARD
   A guided, multi-step onboarding experience.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Step Definitions ───────────────────────────────────────────────────── */

const STEPS = [
  { id: 'profile', label: 'Basic Profile', icon: User },
  { id: 'skills', label: 'Technical Skills', icon: Code2 },
  { id: 'resources', label: 'Resume & Links', icon: FileUp },
] as const;

type StepId = (typeof STEPS)[number]['id'];

/* ── Skill Taxonomy ─────────────────────────────────────────────────────── */

interface SkillCategory {
  name: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'TypeScript',
      'JavaScript', 'HTML / CSS', 'Tailwind CSS', 'Redux', 'Sass',
    ],
  },
  {
    name: 'Backend',
    skills: [
      'Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#', 'Ruby',
      'PHP', 'Express.js', 'Django', 'FastAPI', 'Spring Boot', 'NestJS',
    ],
  },
  {
    name: 'Database',
    skills: [
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite',
      'Firebase', 'Supabase', 'DynamoDB', 'Prisma',
    ],
  },
  {
    name: 'DevOps & Cloud',
    skills: [
      'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD',
      'Terraform', 'Linux', 'Nginx', 'GitHub Actions',
    ],
  },
  {
    name: 'Mobile',
    skills: [
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android',
    ],
  },
  {
    name: 'Tools & Practices',
    skills: [
      'Git', 'REST APIs', 'GraphQL', 'WebSockets', 'Testing',
      'Agile / Scrum', 'Figma', 'Jira', 'System Design',
    ],
  },
];

/* ── Form State Interface ───────────────────────────────────────────────── */

interface WizardFormData {
  fullName: string;
  title: string;
  location: string;
  bio: string;
  university?: string;
    degree?: string;
    gpa?: string;
    startDate?: string;
    endDate?: string;
  selectedRole?: 'student' | 'graduate';
  selectedTrack?: string;
  selectedSkills: string[];
  skillSearch: string;
  resumeFile: File | null;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

const initialFormData: WizardFormData = {
  fullName: '',
  title: '',
  location: '',
  bio: '',
  university: 'King Fahd University of Petroleum & Minerals (KFUPM)',
  selectedRole: undefined,
  selectedSkills: [],
  skillSearch: '',
  resumeFile: null,
  githubUrl: '',
  linkedinUrl: '',
  portfolioUrl: '',
};

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════════════ */

function ProgressBar({ currentStep }: { currentStep: number }) {
  const { isStudent } = useUserRole();

  return (
    <div className="px-6 sm:px-10 pt-8 pb-2">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isComplete = i < currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-full
                    border-2 transition-all duration-500
                    ${isComplete
                      ? isStudent
                        ? 'bg-student-500 border-student-500 text-white scale-100'
                        : 'bg-[#6E8F75] border-[#6E8F75] text-white scale-100'
                      : isActive
                        ? isStudent
                          ? 'bg-student-500/10 border-student-500 text-student-600 scale-105'
                          : 'bg-[#6E8F75]/10 border-[#6E8F75] text-[#6E8F75] scale-105'
                        : 'bg-[#FAF9F6] border-[#0B0F19]/10 text-[#0B0F19]/30'
                    }
                  `}
                >
                  {isComplete ? (
                    <Check className="w-[18px] h-[18px]" strokeWidth={3} />
                  ) : (
                    <Icon className="w-[18px] h-[18px]" />
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors duration-300
                    ${isActive
                      ? isStudent ? 'text-student-600' : 'text-[#6E8F75]'
                      : isComplete
                        ? isStudent ? 'text-student-600/70' : 'text-[#6E8F75]/70'
                        : 'text-[#0B0F19]/30'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-3 sm:mx-5 h-[2px] rounded-full bg-[#0B0F19]/[0.06] mt-[-20px] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${isStudent ? 'bg-student-500' : 'bg-[#6E8F75]'}`}
                    style={{ width: isComplete ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 1 — BASIC PROFILE
   ═══════════════════════════════════════════════════════════════════════════ */

function BasicProfileStep({
  data,
  onChange,
}: {
  data: WizardFormData;
  onChange: (patch: Partial<WizardFormData>) => void;
}) {
  const { isStudent, lockedTrack } = useUserRole();

  const inputClass = `
    w-full h-[48px] px-4 rounded-xl
    bg-[#FAF9F6] border border-[#0B0F19]/[0.07]
    text-[15px] text-[#0B0F19] placeholder:text-[#0B0F19]/25
    transition-all duration-200
    hover:border-[#0B0F19]/12
    focus:outline-none focus:bg-white
    ${isStudent ? 'focus:border-student-500 focus:ring-[3px] focus:ring-student-500/10' : 'focus:border-[#6E8F75] focus:ring-[3px] focus:ring-[#6E8F75]/10'}
  `;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h3 className="text-xl font-bold text-[#0B0F19] mb-1">Tell us about yourself</h3>
        <p className="text-[14px] text-[#0B0F19]/45 leading-relaxed">
          This information helps us personalize your validation journey and build your professional profile.
        </p>
      </div>

{/* Avatar + Name row */}
      <div className="flex items-start gap-5">
        {/* Avatar placeholder */}
        <div className="shrink-0">
          <div className={`w-[72px] h-[72px] rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-200 group
            ${isStudent
              ? 'bg-student-500/[0.08] border-student-500/20 hover:border-student-500/40 hover:bg-student-500/[0.12]'
              : 'bg-[#6E8F75]/[0.08] border-[#6E8F75]/20 hover:border-[#6E8F75]/40 hover:bg-[#6E8F75]/[0.12]'
            }
          `}>
            <User className={`w-6 h-6 transition-colors ${isStudent ? 'text-student-500/40 group-hover:text-student-500/60' : 'text-[#6E8F75]/40 group-hover:text-[#6E8F75]/60'}`} />
          </div>
          <p className="text-[10px] text-[#0B0F19]/30 text-center mt-1.5 font-medium">Add photo</p>
        </div>

        {/* Full name */}
        <div className="flex-1">
          <label htmlFor="wiz-name" className="block text-[13px] font-semibold text-[#0B0F19]/60 mb-1.5">
            Full Name <span className="text-[#f43f5e]">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/20" />
            <input
              id="wiz-name"
              type="text"
              value={data.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="e.g. Ahmad Al-Hassan"
              className={`${inputClass} !pl-10`}
            />
          </div>
        </div>
      </div>

      {/* Professional Title */}
      <div>
        <label htmlFor="wiz-title" className="block text-[13px] font-semibold text-[#0B0F19]/60 mb-1.5">
          Professional Title <span className="text-[#f43f5e]">*</span>
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/20" />
          <input
            id="wiz-title"
            type="text"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. Junior Frontend Developer"
            className={`${inputClass} !pl-10`}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="wiz-location" className="block text-[13px] font-semibold text-[#0B0F19]/60 mb-1.5">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/20" />
          <input
            id="wiz-location"
            type="text"
            value={data.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="e.g. Riyadh, Saudi Arabia"
            className={`${inputClass} !pl-10`}
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="wiz-bio" className="block text-[13px] font-semibold text-[#0B0F19]/60 mb-1.5">
          Short Bio
        </label>
        <textarea
          id="wiz-bio"
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Tell companies about yourself, your interests, and what you're looking for..."
          rows={4}
          maxLength={300}
          className={`
            w-full px-4 py-3 rounded-xl resize-none
            bg-[#FAF9F6] border border-[#0B0F19]/[0.07]
            text-[15px] text-[#0B0F19] placeholder:text-[#0B0F19]/25
            transition-all duration-200
            hover:border-[#0B0F19]/12
            focus:outline-none focus:bg-white
            ${isStudent ? 'focus:border-student-500 focus:ring-[3px] focus:ring-student-500/10' : 'focus:border-[#6E8F75] focus:ring-[3px] focus:ring-[#6E8F75]/10'}
            leading-relaxed
          `}
        />
        <p className="text-right text-[11px] text-[#0B0F19]/25 mt-1">
          {data.bio.length}/300
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 2 — TECHNICAL SKILLS SELECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function SkillsSelectionStep({
  data,
  onChange,
}: {
  data: WizardFormData;
  onChange: (patch: Partial<WizardFormData>) => void;
}) {
  const { isStudent } = useUserRole();
  const [activeCategory, setActiveCategory] = useState(0);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (trimmed && !data.selectedSkills.includes(trimmed)) {
      onChange({ selectedSkills: [...data.selectedSkills, trimmed] });
    }
    setNewSkill('');
  };

  const toggleSkill = (skill: string) => {
    const current = data.selectedSkills;
    if (current.includes(skill)) {
      onChange({ selectedSkills: current.filter((s) => s !== skill) });
    } else {
      onChange({ selectedSkills: [...current, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    onChange({ selectedSkills: data.selectedSkills.filter((s) => s !== skill) });
  };

  if (isStudent) {
    return (
      <div className="space-y-6">
        {/* Section header */}
        <div>
          <h3 className="text-xl font-bold text-[#0B0F19] mb-1">What are your technical skills?</h3>
          <p className="text-[14px] text-[#0B0F19]/45 leading-relaxed">
            List the technologies, languages, or tools you are familiar with. This helps match you with the right mentors and career resources.
          </p>
        </div>

        {/* Contextual prompt */}
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-student-50 border border-student-100">
          <Sparkles className="w-4 h-4 text-student-500 mt-0.5 shrink-0" />
          <p className="text-[13px] text-student-600/80 leading-relaxed">
            <span className="font-semibold text-student-600">Tip:</span> Type a skill name (like "React", "Python", "SQL") and click **Add** or press **Enter** to list it.
          </p>
        </div>

        {/* Direct Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(newSkill);
              }
            }}
            placeholder="Type a skill (e.g. JavaScript, C++, Git) and press Enter..."
            className="
              flex-1 h-[46px] px-4 rounded-xl
              bg-[#FAF9F6] border border-[#0B0F19]/[0.08]
              text-sm text-[#0B0F19] placeholder:text-[#0B0F19]/25
              transition-all duration-200
              focus:outline-none focus:border-student-500 focus:ring-[3px] focus:ring-student-500/10 focus:bg-white
            "
          />
          <button
            type="button"
            onClick={() => addSkill(newSkill)}
            className="
              px-5 rounded-xl bg-student-500 hover:bg-student-600 text-white
              font-bold text-sm shadow-sm transition-all active:scale-[0.97] cursor-pointer
            "
          >
            Add
          </button>
        </div>

        {/* Selected skills list */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-[#0B0F19]/60">
              Your Skills
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-student-500 text-white text-[11px] font-bold">
                {data.selectedSkills.length}
              </span>
            </p>
            {data.selectedSkills.length > 0 && (
              <button
                onClick={() => onChange({ selectedSkills: [] })}
                className="text-[12px] font-medium text-[#0B0F19]/30 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {data.selectedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="
                    inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg
                    bg-student-50 text-student-600 text-[13px] font-medium
                    border border-student-100/60
                  "
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="p-0.5 rounded hover:bg-student-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-[#0B0F19]/[0.08] rounded-2xl bg-[#FAF9F6]">
              <p className="text-xs text-[#0B0F19]/40 italic">
                No skills listed yet. Type a skill above and press Add.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* Filter skills by search */
  const searchLower = data.skillSearch.toLowerCase();
  const filteredCategories = skillCategories.map((cat) => ({
    ...cat,
    skills: cat.skills.filter((s) => s.toLowerCase().includes(searchLower)),
  })).filter((cat) => cat.skills.length > 0);

  const displayCategories = data.skillSearch ? filteredCategories : [skillCategories[activeCategory]];

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h3 className="text-xl font-bold text-[#0B0F19] mb-1">What are your technical skills?</h3>
        <p className="text-[14px] text-[#0B0F19]/45 leading-relaxed">
          Select the technologies you're proficient in. This powers your Skill Graph and helps match you to the right projects.
        </p>
      </div>

      {/* Contextual prompt */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-[#6E8F75]/[0.06] border border-[#6E8F75]/10">
        <Sparkles className="w-4 h-4 text-[#6E8F75] mt-0.5 shrink-0" />
        <p className="text-[13px] text-[#6E8F75]/80 leading-relaxed">
          <span className="font-semibold text-[#6E8F75]">Tip:</span> Select at least 3 skills to unlock personalized project recommendations. Don't worry about proficiency — we'll assess that during your AI interview.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/20" />
        <input
          id="skill-search"
          type="text"
          value={data.skillSearch}
          onChange={(e) => onChange({ skillSearch: e.target.value })}
          placeholder="Search skills..."
          className="
            w-full h-[44px] pl-10 pr-4 rounded-xl
            bg-[#FAF9F6] border border-[#0B0F19]/[0.07]
            text-[14px] text-[#0B0F19] placeholder:text-[#0B0F19]/25
            transition-all duration-200
            hover:border-[#0B0F19]/12
            focus:outline-none focus:border-[#6E8F75] focus:ring-[3px] focus:ring-[#6E8F75]/10 focus:bg-white
          "
        />
        {data.skillSearch && (
          <button
            onClick={() => onChange({ skillSearch: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-[#0B0F19]/[0.04] text-[#0B0F19]/30"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category tabs (hidden when searching) */}
      {!data.skillSearch && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {skillCategories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className={`
                shrink-0 px-4 py-2 rounded-lg text-[13px] font-semibold
                transition-all duration-200
                ${i === activeCategory
                  ? 'bg-[#6E8F75] text-white shadow-[0_2px_8px_rgba(110,143,117,0.25)]'
                  : 'bg-[#0B0F19]/[0.03] text-[#0B0F19]/45 hover:bg-[#0B0F19]/[0.06] hover:text-[#0B0F19]/65'
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Skills chips */}
      <div className="min-h-[120px]">
        {displayCategories.map((cat) => (
          <div key={cat.name} className="mb-4 last:mb-0">
            {data.skillSearch && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/25 mb-2.5">
                {cat.name}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => {
                const isSelected = data.selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`
                      inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                      text-[13px] font-medium transition-all duration-200
                      ${isSelected
                        ? 'bg-[#6E8F75] text-white shadow-[0_2px_8px_rgba(110,143,117,0.2)] scale-[1.02]'
                        : 'bg-white border border-[#0B0F19]/[0.07] text-[#0B0F19]/55 hover:border-[#6E8F75]/30 hover:text-[#0B0F19]/80 hover:bg-[#6E8F75]/[0.03]'
                      }
                      active:scale-[0.97]
                    `}
                  >
                    {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected skills summary */}
      {data.selectedSkills.length > 0 && (
        <div className="pt-4 border-t border-[#0B0F19]/[0.05]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-[#0B0F19]/60">
              Selected Skills
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#6E8F75] text-white text-[11px] font-bold">
                {data.selectedSkills.length}
              </span>
            </p>
            <button
              onClick={() => onChange({ selectedSkills: [] })}
              className="text-[12px] font-medium text-[#0B0F19]/30 hover:text-[#f43f5e]/70 transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.selectedSkills.map((skill) => (
              <span
                key={skill}
                className="
                  inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg
                  bg-[#6E8F75]/[0.08] text-[#6E8F75] text-[13px] font-medium
                  border border-[#6E8F75]/10
                "
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="p-0.5 rounded hover:bg-[#6E8F75]/15 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 3 — RESUME UPLOAD & LINKS
   ═══════════════════════════════════════════════════════════════════════════ */

function ResumeUploadStep({
  data,
  onChange,
}: {
  data: WizardFormData;
  onChange: (patch: Partial<WizardFormData>) => void;
}) {
  const { isStudent } = useUserRole();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onChange({ resumeFile: files[0] });
      }
    },
    [onChange],
  );

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange({ resumeFile: e.target.files[0] });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const linkInputClass = `
    w-full h-[48px] pl-10 pr-4 rounded-xl
    bg-[#FAF9F6] border border-[#0B0F19]/[0.07]
    text-[14px] text-[#0B0F19] placeholder:text-[#0B0F19]/25
    transition-all duration-200
    hover:border-[#0B0F19]/12
    focus:outline-none focus:bg-white
    ${isStudent ? 'focus:border-student-500 focus:ring-[3px] focus:ring-student-500/10' : 'focus:border-[#6E8F75] focus:ring-[3px] focus:ring-[#6E8F75]/10'}
  `;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h3 className="text-xl font-bold text-[#0B0F19] mb-1">Upload your resume & add links</h3>
        <p className="text-[14px] text-[#0B0F19]/45 leading-relaxed">
          We'll analyze your resume and external profiles to auto-fill your Jadeer profile and enrich your Skill Graph.
        </p>
      </div>

      {/* Mandatory Requirements Status Alert */}
      <div className={`p-4 rounded-2xl border transition-all duration-200 ${
        data.resumeFile && (data.githubUrl.trim() || data.linkedinUrl.trim())
          ? isStudent ? 'bg-student-500/5 border-student-500/20' : 'bg-[#6E8F75]/10 border-[#6E8F75]/20'
          : 'bg-amber-500/5 border-amber-500/20'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-bold text-[#0B0F19]/70 uppercase tracking-wider">
            Mandatory Onboarding Gate
          </span>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            data.resumeFile && (data.githubUrl.trim() || data.linkedinUrl.trim())
              ? isStudent ? 'bg-student-500 text-white' : 'bg-[#6E8F75] text-white'
              : 'bg-amber-500 text-white'
          }`}>
            {data.resumeFile && (data.githubUrl.trim() || data.linkedinUrl.trim()) ? 'All Requirements Met ✓' : 'Action Required'}
          </span>
        </div>
        <div className="space-y-1.5 text-[12.5px]">
          <div className="flex items-center gap-2">
            {data.resumeFile ? (
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isStudent ? 'text-student-500' : 'text-[#6E8F75]'}`} />
            ) : (
              <span className="w-4 h-4 rounded-full border border-amber-500/50 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
            )}
            <span className={data.resumeFile ? 'font-medium text-[#0B0F19]/85' : 'text-[#0B0F19]/60'}>
              Resume / CV file uploaded (PDF, DOCX) <span className="text-red-500 font-bold">*</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {data.githubUrl.trim() || data.linkedinUrl.trim() ? (
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isStudent ? 'text-student-500' : 'text-[#6E8F75]'}`} />
            ) : (
              <span className="w-4 h-4 rounded-full border border-amber-500/50 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
            )}
            <span className={data.githubUrl.trim() || data.linkedinUrl.trim() ? 'font-medium text-[#0B0F19]/85' : 'text-[#0B0F19]/60'}>
              At least one verified profile link (GitHub or LinkedIn) <span className="text-red-500 font-bold">*</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI analysis hint */}
      <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border
        ${isStudent ? 'bg-student-50 border-student-100' : 'bg-[#6E8F75]/[0.06] border-[#6E8F75]/10'}
      `}>
        <Sparkles className={`w-4 h-4 mt-0.5 shrink-0 ${isStudent ? 'text-student-500' : 'text-[#6E8F75]'}`} />
        <p className={`text-[13px] leading-relaxed ${isStudent ? 'text-student-600/80' : 'text-[#6E8F75]/80'}`}>
          <span className={`font-semibold ${isStudent ? 'text-student-600' : 'text-[#6E8F75]'}`}>AI-Powered Analysis:</span> Our AI will extract skills, experience, and projects from your resume and GitHub to accelerate your profile setup.
        </p>
      </div>

      {/* ── Resume Drag & Drop Zone ──────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] font-semibold text-[#0B0F19]/70 flex items-center gap-1">
            Resume / CV <span className="text-red-500 font-bold">*</span>
          </label>
          <span className={`text-[11px] font-medium ${data.resumeFile ? 'text-[#6E8F75]' : 'text-amber-600'}`}>
            {data.resumeFile ? 'Uploaded ✓' : 'Required'}
          </span>
        </div>

        {!data.resumeFile ? (
          <div
            id="resume-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center
              py-10 px-6 rounded-2xl cursor-pointer
              border-2 border-dashed transition-all duration-300
              ${isDragging
                ? isStudent
                  ? 'border-student-500 bg-student-500/[0.06] scale-[1.01]'
                  : 'border-[#6E8F75] bg-[#6E8F75]/[0.06] scale-[1.01]'
                : isStudent
                  ? 'border-[#0B0F19]/10 bg-[#FAF9F6] hover:border-student-500/30 hover:bg-student-500/[0.02]'
                  : 'border-[#0B0F19]/10 bg-[#FAF9F6] hover:border-[#6E8F75]/30 hover:bg-[#6E8F75]/[0.02]'
              }
            `}
          >
            <div
              className={`
                flex h-14 w-14 items-center justify-center rounded-2xl mb-4
                transition-all duration-300
                ${isDragging
                  ? isStudent
                    ? 'bg-student-500/15 text-student-500 scale-110'
                    : 'bg-[#6E8F75]/15 text-[#6E8F75] scale-110'
                  : 'bg-[#0B0F19]/[0.04] text-[#0B0F19]/25'
                }
              `}
            >
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-[14px] font-semibold text-[#0B0F19]/60 mb-1">
              {isDragging ? 'Drop your file here' : 'Drag & drop your resume here'}
            </p>
            <p className="text-[13px] text-[#0B0F19]/30 mb-4">
              or click to browse from your computer
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#0B0F19]/[0.04] text-[#0B0F19]/35 font-medium">
                PDF
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#0B0F19]/[0.04] text-[#0B0F19]/35 font-medium">
                DOCX
              </span>
              <span className="text-[11px] text-[#0B0F19]/25">Max 10 MB</span>
            </div>
            <input
              ref={fileInputRef}
              id="resume-input"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          /* File uploaded state */
          <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl border
            ${isStudent
              ? 'bg-student-50/50 border-student-100/50'
              : 'bg-[#6E8F75]/[0.05] border-[#6E8F75]/15'
            }
          `}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
              ${isStudent ? 'bg-student-500/10' : 'bg-[#6E8F75]/15'}
            `}>
              <FileText className={`w-5 h-5 ${isStudent ? 'text-student-500' : 'text-[#6E8F75]'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[#0B0F19] truncate">
                {data.resumeFile.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[12px] text-[#0B0F19]/35">
                  {formatFileSize(data.resumeFile.size)}
                </span>
                <span className={`flex items-center gap-1 text-[12px] font-medium ${isStudent ? 'text-student-600' : 'text-[#6E8F75]'}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  Ready for analysis
                </span>
              </div>
            </div>
            <button
              onClick={() => onChange({ resumeFile: null })}
              className="p-2 rounded-lg hover:bg-[#0B0F19]/[0.04] text-[#0B0F19]/30 hover:text-[#f43f5e]/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[#0B0F19]/[0.05]" />
        <span className="text-[12px] font-semibold text-[#0B0F19]/20 uppercase tracking-wider">
          External Profiles
        </span>
        <div className="flex-1 h-px bg-[#0B0F19]/[0.05]" />
      </div>

      {/* ── GitHub ───────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="wiz-github" className="flex items-center gap-2 text-[13px] font-semibold text-[#0B0F19]/70">
            <GitHubIcon className="w-3.5 h-3.5" />
            GitHub Profile <span className="text-red-500 font-bold">*</span>
          </label>
          <span className={`text-[11px] font-medium ${data.githubUrl.trim() ? 'text-[#6E8F75]' : 'text-amber-600'}`}>
            {data.githubUrl.trim() ? 'Verified Link ✓' : 'Required (or LinkedIn)'}
          </span>
        </div>
        <div className="relative">
          <GitHubIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/20" />
          <input
            id="wiz-github"
            type="url"
            value={data.githubUrl}
            onChange={(e) => onChange({ githubUrl: e.target.value })}
            placeholder="https://github.com/username"
            className={linkInputClass}
          />
        </div>
      </div>

      {/* ── LinkedIn ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="wiz-linkedin" className="flex items-center gap-2 text-[13px] font-semibold text-[#0B0F19]/70">
            <LinkedInIcon className="w-3.5 h-3.5" />
            LinkedIn Profile
          </label>
          {data.linkedinUrl.trim() && (
            <span className="text-[11px] font-medium text-[#6E8F75]">
              Verified Link ✓
            </span>
          )}
        </div>
        <div className="relative">
          <LinkedInIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/20" />
          <input
            id="wiz-linkedin"
            type="url"
            value={data.linkedinUrl}
            onChange={(e) => onChange({ linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/username"
            className={linkInputClass}
          />
        </div>
      </div>

      {/* ── Portfolio / Website ───────────────────────────────────── */}
      <div>
        <label htmlFor="wiz-portfolio" className="flex items-center gap-2 text-[13px] font-semibold text-[#0B0F19]/60 mb-1.5">
          <Globe className="w-3.5 h-3.5" />
          Portfolio / Website
        </label>
        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B0F19]/20" />
          <input
            id="wiz-portfolio"
            type="url"
            value={data.portfolioUrl}
            onChange={(e) => onChange({ portfolioUrl: e.target.value })}
            placeholder="https://your-portfolio.dev"
            className={linkInputClass}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPLETION VIEW
   ═══════════════════════════════════════════════════════════════════════════ */

function CompletionView() {
  const { isStudent } = useUserRole();

  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-[scale-in_0.5s_var(--ease-spring)_both]
        ${isStudent ? 'bg-student-500/10' : 'bg-[#6E8F75]/10'}
      `}>
        <CheckCircle2 className={`w-10 h-10 ${isStudent ? 'text-student-500' : 'text-[#6E8F75]'}`} />
      </div>
      <h3 className="text-2xl font-bold text-[#0B0F19] mb-2 animate-[slide-up_0.5s_var(--ease-spring)_0.1s_both]">
        Profile Created Successfully!
      </h3>
      <p className="text-[15px] text-[#0B0F19]/45 max-w-sm leading-relaxed mb-8 animate-[slide-up_0.5s_var(--ease-spring)_0.2s_both]">
        {isStudent 
          ? 'Your student profile is ready. You can now explore resources, connect with industry mentors, and book feedback sessions.'
          : 'Your candidate profile is ready. Next, you\'ll take the AI-powered technical interview to build your Skill Graph.'
        }
      </p>
      <div className="flex flex-col sm:flex-row gap-3 animate-[slide-up_0.5s_var(--ease-spring)_0.3s_both]">
        <a
          href={isStudent ? "/student/dashboard" : "/candidates/ai-interview"}
          className={`
            inline-flex items-center justify-center gap-2 px-7 py-3.5
            text-white text-[15px] font-semibold rounded-xl
            transition-all duration-300 active:scale-[0.97]
            ${isStudent
              ? 'bg-[#6E8F75] hover:bg-[#5d7d64] hover:shadow-[0_8px_24px_rgba(110,143,117,0.3)]'
              : 'bg-[#6E8F75] hover:bg-[#5d7d64] hover:shadow-[0_8px_24px_rgba(110,143,117,0.3)]'
            }
          `}
        >
          {isStudent ? 'Go to Student Dashboard' : 'Start AI Interview'}
          <ChevronRight className="w-4 h-4" />
        </a>
        <a
          href={isStudent ? "/student/dashboard" : "/dashboard"}
          className="
            inline-flex items-center justify-center gap-2 px-7 py-3.5
            bg-white text-[#0B0F19]/60 text-[15px] font-semibold rounded-xl
            border border-[#0B0F19]/[0.08]
            hover:border-[#0B0F19]/15 hover:text-[#0B0F19]
            transition-all duration-300 active:scale-[0.97]
          "
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN WIZARD COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function CandidateWizard({ embedded = false }: { embedded?: boolean }) {
  const { isStudent, setUserRole, bindTrack, lockedTrack } = useUserRole();
  const { completeOnboarding } = useCandidateJourney();
  const { profile: userProfile, updateProfile } = useUserProfile();
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const clerkName = clerkUser?.fullName || clerkUser?.firstName || clerkUser?.username || '';
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';

  const [formData, setFormData] = useState<WizardFormData>(() => {
    const session = typeof window !== 'undefined' ? AuthService.getCurrentSession() : null;
    return {
      ...initialFormData,
      fullName: session?.user?.name || userProfile.fullName || '',
      title: userProfile.title || '',
      location: userProfile.location || '',
      bio: userProfile.bio || '',
      university: userProfile.university || 'King Fahd University of Petroleum & Minerals (KFUPM)',
      selectedTrack: userProfile.track || '',
      githubUrl: session?.user?.githubUsername
        ? `https://github.com/${session.user.githubUsername}`
        : userProfile.githubUrl || '',
      linkedinUrl: userProfile.linkedinUrl || '',
      portfolioUrl: userProfile.portfolioUrl || '',
      selectedSkills: userProfile.skills && userProfile.skills.length > 0 ? userProfile.skills : [],
    };
  });

  // Prepopulate from Clerk when available
  useEffect(() => {
    if (isClerkLoaded && clerkUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || clerkName || '',
        title: prev.title || '',
      }));
    }
  }, [isClerkLoaded, clerkUser, clerkName, isStudent]);

  const updateFormData = (patch: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.fullName.trim() !== '' && formData.title.trim() !== '';
      case 1:
        return formData.selectedSkills.length >= 1;
      case 2: {
        const hasResume = formData.resumeFile !== null;
        const hasLinks = formData.githubUrl.trim() !== '' || formData.linkedinUrl.trim() !== '';
        return hasResume && hasLinks;
      }
      default:
        return false;
    }
  };

  const goNext = () => {
    if (isAnimating) return;
    if (currentStep === STEPS.length - 1) {
      // Save profile metadata locally and mark onboarded
      const effectiveRole: 'student' | 'grad' = (formData.selectedRole === 'student' || isStudent) ? 'student' : 'grad';
      const effectiveTrack = lockedTrack || 'Backend Development';

      updateProfile({
        fullName: formData.fullName,
        title: formData.title,
        location: formData.location,
        bio: formData.bio,
        university: formData.university || 'King Fahd University of Petroleum & Minerals (KFUPM)',
        role: effectiveRole,
        track: formData.selectedTrack || effectiveTrack,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        skills: formData.selectedSkills,
        resumeFileName: formData.resumeFile ? formData.resumeFile.name : undefined,
      });

      if (formData.selectedRole) setUserRole(formData.selectedRole);
      bindTrack(effectiveTrack);
      completeOnboarding();
      setIsComplete(true);
      return;
    }
    setDirection('forward');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => s + 1);
      setIsAnimating(false);
    }, 280);
  };

  const goPrevious = () => {
    if (isAnimating || currentStep === 0) return;
    setDirection('backward');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => s - 1);
      setIsAnimating(false);
    }, 280);
  };

  /* Slide animation classes */
  const slideClass = isAnimating
    ? direction === 'forward'
      ? 'animate-[slide-out-left_0.28s_ease-in_both]'
      : 'animate-[slide-out-right_0.28s_ease-in_both]'
    : direction === 'forward'
      ? 'animate-[slide-in-right_0.35s_var(--ease-spring)_both]'
      : 'animate-[slide-in-left_0.35s_var(--ease-spring)_both]';

  const cardContent = (
    <div className="w-full max-w-[720px] mx-auto">
      {/* Standalone Official Brand Logo header if not embedded */}
      {!embedded && (
        <div className="flex items-center justify-center mb-6 animate-[fade-in_0.4s_ease_both]">
          <BrandLogo size="md" href="/" textColor="dark" />
        </div>
      )}

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_40px_rgba(0,0,0,0.04)] border border-[#0B0F19]/[0.04] overflow-hidden">
        {/* Progress bar */}
        {!isComplete && <ProgressBar currentStep={currentStep} />}

        {/* Step content */}
        <div className="px-6 sm:px-10 py-6 sm:py-8 overflow-hidden">
          {isComplete ? (
            <CompletionView />
          ) : (
            <div key={currentStep} className={slideClass}>
              {currentStep === 0 && (
                <BasicProfileStep data={formData} onChange={updateFormData} />
              )}
              {currentStep === 1 && (
                <SkillsSelectionStep data={formData} onChange={updateFormData} />
              )}
              {currentStep === 2 && (
                <ResumeUploadStep data={formData} onChange={updateFormData} />
              )}
            </div>
          )}
        </div>

        {/* Navigation footer */}
        {!isComplete && (
          <div className="px-6 sm:px-10 pb-8 pt-2 border-t border-[#0B0F19]/[0.03]">
            <div className="flex items-center justify-between gap-4">
              {/* Previous */}
              <button
                id="wizard-prev"
                onClick={goPrevious}
                disabled={currentStep === 0}
                className={`
                  inline-flex items-center gap-2 px-5 py-3 rounded-xl
                  text-[14px] font-semibold transition-all duration-200
                  ${currentStep === 0
                    ? 'text-[#0B0F19]/15 cursor-not-allowed'
                    : 'text-[#0B0F19]/50 hover:text-[#0B0F19] hover:bg-[#0B0F19]/[0.03] active:scale-[0.97]'
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Step counter */}
              <span className="text-[12px] font-medium text-[#0B0F19]/25 hidden sm:block">
                Step {currentStep + 1} of {STEPS.length}
              </span>

              {/* Next / Complete */}
              <button
                id="wizard-next"
                onClick={goNext}
                disabled={!canProceed()}
                title={!canProceed() && currentStep === 2 ? 'Upload your resume and provide at least one profile link to complete onboarding' : undefined}
                className={`
                  inline-flex items-center gap-2 px-6 py-3 rounded-xl
                  text-[14px] font-semibold transition-all duration-300
                  ${canProceed()
                    ? isStudent
                      ? 'bg-[#6E8F75] text-white hover:bg-[#5d7d64] hover:shadow-[0_4px_16px_rgba(110,143,117,0.25)] active:scale-[0.97]'
                      : 'bg-[#6E8F75] text-white hover:bg-[#5d7d64] hover:shadow-[0_4px_16px_rgba(110,143,117,0.25)] active:scale-[0.97]'
                    : isStudent
                      ? 'bg-[#6E8F75]/30 text-white/60 cursor-not-allowed'
                      : 'bg-[#6E8F75]/30 text-white/60 cursor-not-allowed'
                  }
                `}
              >
                {currentStep === STEPS.length - 1 ? 'Complete Profile' : 'Next'}
                {currentStep === STEPS.length - 1 ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!isComplete && (
        <p className="text-center text-[13px] text-[#0B0F19]/30 mt-5 animate-[fade-in_0.5s_ease_0.5s_both]">
          Your profile data is encrypted and directly feeds into your verified Jadeer Skill Graph.
        </p>
      )}
    </div>
  );

  if (embedded) {
    return cardContent;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-start lg:items-center justify-center px-4 sm:px-6 py-8 lg:py-12">
      {cardContent}
    </div>
  );
}
