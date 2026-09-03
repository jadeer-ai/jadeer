import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import {
  FilePlus2,
  Briefcase,
  MapPin,
  Building2,
  Tag,
  X,
  Plus,
  Eye,
  Send,
  Save,
  ChevronRight,
  Sparkles,
  Monitor,
  Bot,
  ClipboardCheck,
  Globe,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Info,
  Laptop,
  Home,
  Code2,
  Calendar,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — EMPLOYER POST A JOB PAGE
   Dedicated to Software & Technical Engineering Domains.
   Signature Brand Identity: Clean Cream (#FAF9F6), Sage Green (#6E8F75),
   and Deep Navy (#0B0F19)
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Software Engineering Domains & Tracks ────────────────────────────── */

const engineeringDomains = [
  'Software Engineering',
  'Backend Development',
  'Frontend Development',
  'Full-Stack Engineering',
  'Embedded Systems & IoT',
  'Mobile Development (iOS / Android / Flutter)',
  'DevOps & Cloud Infrastructure',
  'Data Engineering & Analytics',
  'AI / Machine Learning Engineering',
  'Cybersecurity & Systems',
];

const seniorityLevels = [
  'Intern',
  'Junior',
  'Mid-Level',
];

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

const locationTypes: { label: string; icon: LucideIcon; value: string }[] = [
  { label: 'On-site', icon: Building2, value: 'on-site' },
  { label: 'Hybrid', icon: Laptop, value: 'hybrid' },
  { label: 'Remote', icon: Home, value: 'remote' },
];

const suggestedSkills = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++', 'Go', 'Rust',
  'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST API', 'PostgreSQL',
  'MongoDB', 'Redis', 'System Design', 'Microservices', 'CI/CD',
  'Machine Learning', 'Data Engineering', 'TensorFlow', 'Figma',
  'Swift', 'Kotlin', 'Flutter', 'Next.js', 'Vue.js', 'Angular',
];

/* ── Form Data Interface ───────────────────────────────────────────────── */

interface JobFormData {
  title: string;
  department: string;
  seniority: string;
  employmentType: string;
  locationType: string;
  location: string;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string[];
  enableAIInterview: boolean;
  enableProjectAssessment: boolean;
  minimumMatchScore: number;
  deadline: string;
}

const defaultFormData: JobFormData = {
  title: '',
  department: engineeringDomains[0],
  seniority: seniorityLevels[1], // Junior default
  employmentType: 'Full-time',
  locationType: 'on-site',
  location: '',
  description: '',
  responsibilities: '',
  requirements: '',
  skills: [],
  enableAIInterview: true,
  enableProjectAssessment: true,
  minimumMatchScore: 70,
  deadline: '',
};

/* ── Helper Components ─────────────────────────────────────────────────── */

function SectionHeader({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <div>
        <h2 className="text-[16px] font-bold text-[#0B0F19]">{title}</h2>
        {subtitle && <p className="text-[13px] text-[#0B0F19]/45 font-medium mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function FormLabel({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-[13px] font-bold text-[#0B0F19]/70 mb-1.5">
      {label}
      {required && <span className="text-danger-500 ml-0.5">*</span>}
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function EmployerPostJobPage() {
  const [formData, setFormData] = useState<JobFormData>(defaultFormData);
  const [showPreview, setShowPreview] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isSavedDraft, setIsSavedDraft] = useState(false);
  const skillInputRef = useRef<HTMLInputElement>(null);

  /* ── Handlers ──────────────────────────────────────────────────────── */

  const updateField = <K extends keyof JobFormData>(key: K, value: JobFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setIsSavedDraft(false);
    setIsPublished(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateField(e.target.name as keyof JobFormData, e.target.value);
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      updateField('skills', [...formData.skills, trimmed]);
    }
    setSkillInput('');
    setShowSkillSuggestions(false);
    skillInputRef.current?.focus();
  };

  const removeSkill = (skill: string) => {
    updateField('skills', formData.skills.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const filteredSuggestions = suggestedSkills.filter(
    (s) =>
      !formData.skills.includes(s) &&
      s.toLowerCase().includes(skillInput.toLowerCase())
  );

  const isFormValid =
    formData.title.trim() !== '' &&
    formData.department !== '' &&
    formData.location.trim() !== '' &&
    formData.description.trim() !== '';

  const handlePublish = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    try {
      const res = await fetch('/api/employer/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'Active' })
      });
      if (res.ok) {
        setIsPublished(true);
      } else {
        console.error('Failed to publish job');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const res = await fetch('/api/employer/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'Draft' })
      });
      if (res.ok) {
        setIsSavedDraft(true);
        setTimeout(() => setIsSavedDraft(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Published Success State ───────────────────────────────────────── */

  if (isPublished) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 animate-[fade-in_0.4s_ease]">
        <div className="w-20 h-20 rounded-3xl bg-[#6E8F75]/15 text-[#6E8F75] flex items-center justify-center mb-6 shadow-xl animate-[scale-up_0.4s_var(--ease-spring)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#0B0F19] mb-2">Job Posted Successfully!</h1>
        <p className="text-[15px] text-[#0B0F19]/50 font-medium max-w-md mb-8">
          <strong className="text-[#0B0F19]">{formData.title}</strong> ({formData.seniority}) is now live. Jadeer's AI matching engine will begin routing qualified candidates immediately.
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/employer/dashboard"
            className="px-5 py-2.5 rounded-xl bg-[#0B0F19] text-white text-[13px] font-bold hover:bg-[#1a2440] transition-colors"
          >
            Go to Dashboard
          </Link>
          <button
            onClick={() => {
              setIsPublished(false);
              setFormData(defaultFormData);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] text-[13px] font-bold border border-[#6E8F75]/20 hover:bg-[#6E8F75]/20 transition-colors"
          >
            Post Another Job
          </button>
        </div>
      </div>
    );
  }

  /* ── Preview Modal ─────────────────────────────────────────────────── */

  if (showPreview) {
    return (
      <div className="space-y-6 pb-8 animate-[fade-in_0.3s_ease]">
        <button
          onClick={() => setShowPreview(false)}
          className="flex items-center gap-2 text-[13px] font-bold text-[#0B0F19]/50 hover:text-[#0B0F19] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to editing
        </button>

        <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          {/* Preview Header */}
          <div className="relative px-8 py-8 bg-gradient-to-br from-[#6E8F75] via-[#6E8F75] to-[#587a60] text-white overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full">
                  {formData.employmentType}
                </span>
                {formData.seniority && (
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full">
                    {formData.seniority}
                  </span>
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full">
                  {formData.department}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {formData.title || 'Untitled Engineering Role'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-[13px] font-medium text-white/80">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" /> {formData.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {formData.location || 'No location specified'}
                  {formData.locationType && ` (${formData.locationType})`}
                </span>
                {formData.deadline && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Deadline: {formData.deadline}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Preview Body */}
          <div className="px-8 py-8 space-y-6">
            {formData.description && (
              <div>
                <h3 className="text-[14px] font-bold text-[#0B0F19] mb-2">About this Role</h3>
                <p className="text-[14px] text-[#0B0F19]/60 leading-relaxed whitespace-pre-wrap">{formData.description}</p>
              </div>
            )}
            {formData.responsibilities && (
              <div>
                <h3 className="text-[14px] font-bold text-[#0B0F19] mb-2">Key Responsibilities</h3>
                <p className="text-[14px] text-[#0B0F19]/60 leading-relaxed whitespace-pre-wrap">{formData.responsibilities}</p>
              </div>
            )}
            {formData.requirements && (
              <div>
                <h3 className="text-[14px] font-bold text-[#0B0F19] mb-2">Requirements</h3>
                <p className="text-[14px] text-[#0B0F19]/60 leading-relaxed whitespace-pre-wrap">{formData.requirements}</p>
              </div>
            )}
            {formData.skills.length > 0 && (
              <div>
                <h3 className="text-[14px] font-bold text-[#0B0F19] mb-3">Required Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-lg bg-[#6E8F75]/10 text-[#6E8F75] text-[12px] font-bold border border-[#6E8F75]/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Screening Methods */}
            <div className="bg-[#f9fafb] rounded-xl border border-[#0B0F19]/[0.04] p-5">
              <h3 className="text-[14px] font-bold text-[#0B0F19] mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6E8F75]" />
                Jadeer Screening Methods
              </h3>
              <div className="flex flex-wrap gap-3">
                {formData.enableAIInterview && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[12px] font-bold text-[#0B0F19]/70 border border-[#0B0F19]/[0.06]">
                    <Bot className="w-3.5 h-3.5 text-[#6E8F75]" /> AI Interview
                  </span>
                )}
                {formData.enableProjectAssessment && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[12px] font-bold text-[#0B0F19]/70 border border-[#0B0F19]/[0.06]">
                    <ClipboardCheck className="w-3.5 h-3.5 text-[#6E8F75]" /> Project Assessment
                  </span>
                )}
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[12px] font-bold text-[#0B0F19]/70 border border-[#0B0F19]/[0.06]">
                  <Sparkles className="w-3.5 h-3.5 text-[#6E8F75]" /> Min Match Score: {formData.minimumMatchScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Preview Footer */}
          <div className="px-8 py-5 border-t border-[#0B0F19]/[0.04] flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={() => setShowPreview(false)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-[#0B0F19]/70 text-[13px] font-bold border border-[#0B0F19]/[0.08] hover:bg-[#f9fafb] transition-colors"
            >
              Back to Edit
            </button>
            <button
              onClick={handlePublish}
              disabled={!isFormValid}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#6E8F75] text-white text-[13px] font-bold shadow-[0_4px_16px_rgba(110,143,117,0.25)] hover:bg-[#5d7d64] hover:shadow-[0_6px_24px_rgba(110,143,117,0.35)] hover:translate-y-[-1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
            >
              <Send className="w-4 h-4" /> Publish Listing
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═════════════════════════════════════════════════════════════════════
     FORM VIEW
     ═════════════════════════════════════════════════════════════════════ */

  return (
    <form onSubmit={handlePublish} className="space-y-8 pb-8 animate-[fade-in_0.3s_ease]">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#6E8F75] text-white flex items-center justify-center shadow-lg shadow-[#6E8F75]/25">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E8F75] bg-[#6E8F75]/10 border border-[#6E8F75]/20 px-2.5 py-0.5 rounded-full">
              Engineering Track Listing
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
            Post an <span className="text-[#6E8F75]">Engineering Role</span>
          </h1>
          <p className="mt-1 text-[14px] text-[#0B0F19]/50 font-medium max-w-xl">
            Create an engineering job listing. Jadeer's AI will automatically match verified software talent by skill radar and assessment benchmarks.
          </p>
        </div>
      </div>

      {/* ── Saved/Error Feedback ──────────────────────────────────────── */}
      {isSavedDraft && (
        <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-success-50 border border-success-200 text-success-700 text-[13px] font-bold animate-[fade-in_0.3s_ease]">
          <CheckCircle2 className="w-4 h-4" /> Draft saved successfully
        </div>
      )}

      {/* ── Section 1: Role Details ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-6 sm:p-8">
        <SectionHeader icon={Briefcase} title="Role Details" subtitle="Software engineering domain and seniority classification" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Job Title */}
          <div className="sm:col-span-2">
            <FormLabel htmlFor="title" label="Engineering Job Title" required />
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Junior Backend Engineer (Go / PostgreSQL)"
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-[14px] text-[#0B0F19] font-medium placeholder:text-[#0B0F19]/25 focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all"
            />
          </div>

          {/* Engineering Domain / Department */}
          <div>
            <FormLabel htmlFor="department" label="Engineering Domain & Track" required />
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-[14px] text-[#0B0F19] font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all appearance-none"
            >
              {engineeringDomains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          {/* Seniority Level */}
          <div>
            <FormLabel htmlFor="seniority" label="Seniority Level" required />
            <select
              id="seniority"
              name="seniority"
              value={formData.seniority}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-[14px] text-[#0B0F19] font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all appearance-none"
            >
              {seniorityLevels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Employment Type */}
          <div className="sm:col-span-2">
            <FormLabel htmlFor="employmentType" label="Employment Type" required />
            <div className="flex flex-wrap gap-2.5">
              {employmentTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateField('employmentType', type)}
                  className={`
                    px-4 py-2 rounded-xl text-[13px] font-bold border transition-all duration-200
                    ${formData.employmentType === type
                      ? 'bg-[#6E8F75] text-white border-[#6E8F75] shadow-[0_2px_12px_rgba(110,143,117,0.25)]'
                      : 'bg-white text-[#0B0F19]/60 border-[#0B0F19]/[0.08] hover:border-[#6E8F75]/40 hover:text-[#6E8F75]'}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Location & Work Arrangement ───────────────────── */}
      <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-6 sm:p-8">
        <SectionHeader icon={MapPin} title="Location & Work Arrangement" subtitle="Workplace setup and application deadline" />

        <div className="space-y-5">
          {/* Location Type */}
          <div>
            <FormLabel htmlFor="locationType" label="Work Arrangement" required />
            <div className="flex flex-wrap gap-2.5">
              {locationTypes.map(({ label, icon: LocIcon, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField('locationType', value)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold border transition-all duration-200
                    ${formData.locationType === value
                      ? 'bg-[#6E8F75] text-white border-[#6E8F75] shadow-[0_2px_12px_rgba(110,143,117,0.25)]'
                      : 'bg-white text-[#0B0F19]/60 border-[#0B0F19]/[0.08] hover:border-[#6E8F75]/40 hover:text-[#6E8F75]'}
                  `}
                >
                  <LocIcon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Location */}
            <div>
              <FormLabel htmlFor="location" label="Location / Office City" required />
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Riyadh, Saudi Arabia"
                className="w-full px-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-[14px] text-[#0B0F19] font-medium placeholder:text-[#0B0F19]/25 focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all"
              />
            </div>

            {/* Application Deadline */}
            <div>
              <FormLabel htmlFor="deadline" label="Application Deadline (Optional)" />
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-[14px] text-[#0B0F19] font-medium focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Job Description ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-6 sm:p-8">
        <SectionHeader icon={Globe} title="Engineering Description & Specs" subtitle="Technical requirements, architecture stack, and responsibilities" />

        <div className="space-y-5">
          <div>
            <FormLabel htmlFor="description" label="About this Engineering Role" required />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe what this engineering role focuses on, architecture challenges, and team scope…"
              className="w-full px-4 py-3 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-[14px] text-[#0B0F19] font-medium placeholder:text-[#0B0F19]/25 focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] resize-y min-h-[120px] transition-all"
            />
          </div>

          <div>
            <FormLabel htmlFor="responsibilities" label="Technical Responsibilities" />
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleInputChange}
              rows={4}
              placeholder="• Design and maintain microservice APIs in Go / Node.js&#10;• Optimize database query performance and indexing&#10;• Participate in code reviews and CI/CD pipelines"
              className="w-full px-4 py-3 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-[14px] text-[#0B0F19] font-medium placeholder:text-[#0B0F19]/25 focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] resize-y min-h-[120px] transition-all"
            />
          </div>

          <div>
            <FormLabel htmlFor="requirements" label="Core Qualifications & Background" />
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={4}
              placeholder="• Solid fundamentals in data structures, algorithms, and OOP&#10;• Experience with relational databases (PostgreSQL/MySQL)&#10;• Familiarity with Git workflows and testing principles"
              className="w-full px-4 py-3 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-[14px] text-[#0B0F19] font-medium placeholder:text-[#0B0F19]/25 focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] resize-y min-h-[120px] transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Section 4: Required Skills ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-6 sm:p-8">
        <SectionHeader icon={Tag} title="Required Technical Skills" subtitle="Add the programming languages, frameworks, and tools evaluated for this role" />

        {/* Selected Skills */}
        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6E8F75]/10 text-[#6E8F75] text-[12px] font-bold border border-[#6E8F75]/20"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="p-0.5 rounded-lg hover:bg-[#6E8F75]/20 text-[#6E8F75] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Skill Input */}
        <div className="relative">
          <input
            ref={skillInputRef}
            type="text"
            value={skillInput}
            onChange={(e) => {
              setSkillInput(e.target.value);
              setShowSkillSuggestions(true);
            }}
            onFocus={() => setShowSkillSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 200)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Type a technical skill and press Enter (e.g. C++, PostgreSQL, Docker)…"
            className="w-full px-4 py-2.5 rounded-xl border border-[#0B0F19]/[0.08] bg-white text-[14px] text-[#0B0F19] font-medium placeholder:text-[#0B0F19]/25 focus:outline-none focus:ring-2 focus:ring-[#6E8F75]/30 focus:border-[#6E8F75] transition-all"
          />

          {/* Suggestions Dropdown */}
          {showSkillSuggestions && skillInput.length > 0 && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 top-full mt-1 w-full max-h-[200px] overflow-y-auto bg-white border border-[#0B0F19]/[0.08] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              {filteredSuggestions.slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addSkill(s);
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#0B0F19]/70 hover:bg-[#6E8F75]/10 hover:text-[#6E8F75] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-[#6E8F75]" /> {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick-add suggestions */}
        {formData.skills.length === 0 && (
          <div className="mt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/30 mb-2">Popular technical skills</p>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.slice(0, 12).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f9fafb] text-[12px] font-medium text-[#0B0F19]/45 border border-[#0B0F19]/[0.04] hover:border-[#6E8F75]/40 hover:text-[#6E8F75] hover:bg-[#6E8F75]/10 transition-all"
                >
                  <Plus className="w-3 h-3" /> {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Section 5: Screening Preferences ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-6 sm:p-8">
        <SectionHeader icon={Sparkles} title="Jadeer Screening Preferences" subtitle="Configure how Jadeer validates and matches candidates for this role" />

        <div className="space-y-5">
          {/* Toggle cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* AI Interview Toggle */}
            <button
              type="button"
              onClick={() => updateField('enableAIInterview', !formData.enableAIInterview)}
              className={`
                text-left p-5 rounded-xl border-2 transition-all duration-200
                ${formData.enableAIInterview
                  ? 'border-[#6E8F75] bg-[#6E8F75]/10 shadow-[0_2px_12px_rgba(110,143,117,0.1)]'
                  : 'border-[#0B0F19]/[0.06] bg-white hover:border-[#0B0F19]/[0.12]'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.enableAIInterview ? 'bg-[#6E8F75] text-white' : 'bg-[#f3f4f6] text-[#0B0F19]/30'}`}>
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#0B0F19]">Adaptive AI Technical Interview</h3>
                  <p className="text-[12px] text-[#0B0F19]/45 font-medium mt-0.5">
                    Automated technical code and systems evaluation before human interviews
                  </p>
                </div>
              </div>
              <div className={`mt-3 ml-13 text-[11px] font-bold uppercase tracking-wider ${formData.enableAIInterview ? 'text-[#6E8F75]' : 'text-[#0B0F19]/25'}`}>
                {formData.enableAIInterview ? '✓ Enabled' : 'Disabled'}
              </div>
            </button>

            {/* Project Assessment Toggle */}
            <button
              type="button"
              onClick={() => updateField('enableProjectAssessment', !formData.enableProjectAssessment)}
              className={`
                text-left p-5 rounded-xl border-2 transition-all duration-200
                ${formData.enableProjectAssessment
                  ? 'border-[#6E8F75] bg-[#6E8F75]/10 shadow-[0_2px_12px_rgba(110,143,117,0.1)]'
                  : 'border-[#0B0F19]/[0.06] bg-white hover:border-[#0B0F19]/[0.12]'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.enableProjectAssessment ? 'bg-[#6E8F75] text-white' : 'bg-[#f3f4f6] text-[#0B0F19]/30'}`}>
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#0B0F19]">Production Pod Assessment</h3>
                  <p className="text-[12px] text-[#0B0F19]/45 font-medium mt-0.5">
                    Require candidates to complete hands-on project pod challenges
                  </p>
                </div>
              </div>
              <div className={`mt-3 ml-13 text-[11px] font-bold uppercase tracking-wider ${formData.enableProjectAssessment ? 'text-[#6E8F75]' : 'text-[#0B0F19]/25'}`}>
                {formData.enableProjectAssessment ? '✓ Enabled' : 'Disabled'}
              </div>
            </button>
          </div>

          {/* Minimum Match Score Slider */}
          <div className="bg-[#f9fafb] rounded-xl border border-[#0B0F19]/[0.04] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6E8F75]" />
                <span className="text-[13px] font-bold text-[#0B0F19]">Minimum Match Score</span>
              </div>
              <span className="text-[18px] font-extrabold text-[#6E8F75]">{formData.minimumMatchScore}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              step={5}
              value={formData.minimumMatchScore}
              onChange={(e) => updateField('minimumMatchScore', parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#e5e7eb] accent-[#6E8F75]"
            />
            <div className="flex justify-between mt-1.5 text-[10px] text-[#0B0F19]/30 font-medium">
              <span>30% — Broader talent pipeline</span>
              <span>100% — Strict benchmark matching</span>
            </div>
            <p className="mt-3 text-[12px] text-[#0B0F19]/40 font-medium flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#0B0F19]/25" />
              Only verified software engineers scoring at or above this threshold will appear in your matching pipeline.
            </p>
          </div>
        </div>
      </div>

      {/* ── Action Footer ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#0B0F19]/[0.06] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px] text-[#0B0F19]/40 font-medium">
            {!isFormValid && (
              <>
                <AlertCircle className="w-4 h-4 text-warning-500" />
                <span>Please fill in the required fields (Title, Domain, Location, Description)</span>
              </>
            )}
            {isFormValid && (
              <>
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                <span className="text-success-600">Ready to publish</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0B0F19]/70 text-[13px] font-bold border border-[#0B0F19]/[0.08] hover:bg-[#f9fafb] transition-colors"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B0F19] text-white text-[13px] font-bold hover:bg-[#1a2440] transition-colors"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#6E8F75] text-white text-[13px] font-bold shadow-[0_4px_16px_rgba(110,143,117,0.25)] hover:bg-[#5d7d64] hover:shadow-[0_6px_24px_rgba(110,143,117,0.35)] hover:translate-y-[-1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
            >
              <Send className="w-4 h-4" /> Publish Listing
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
