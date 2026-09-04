import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import type {
  CandidateCV,
  SelfStudyItem,
  CVPersonalInfo,
  CurrentCVSnapshot,
} from '@/lib/cv-types';
import { CVAnalysisService } from '@/services/cvAnalysisService';
import { isValidExternalUrl, displayExtractedDate } from '@/utils/validators';
import {
  User,
  MapPin,
  FileText,
  Code2,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Globe,
  BookOpen,
  Pencil,
  Plus,
  Trash2,
  X,
  Check,
  ExternalLink,
  BrainCircuit,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Link2,
  Tag,
  Info,
  ArrowRight,
  FileCheck,
  Download,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CV ANALYSIS & REVIEW PAGE
   ─────────────────────────────────────────────────────────────────────────
   Defensive frontend for reviewing and confirming parser-extracted CV data.
   Supports partial, nullable, heterogeneous parser output.

   Key behaviors:
   - Missing sections render safely (nullish coalescing)
   - Null fields never display "null" or "undefined"
   - Empty arrays hide their section headings
   - URL fields are validated before rendering as links
   - Free-form dates displayed as-is, never parsed to JS Date
   - Skills labeled as "Detected from CV", never "Verified"
   - Advanced Self Study supports full CRUD with temporary frontend type
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Helpers ───────────────────────────────────────────────────────────── */

function generateId(): string {
  return 'ss-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

const SELF_STUDY_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  planned: { label: 'Planned', className: 'bg-slate-100 text-slate-600' },
  in_progress: { label: 'In Progress', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

function formatDateRange(start?: string | null, end?: string | null): string {
  const s = displayExtractedDate(start);
  const e = displayExtractedDate(end);
  if (s && e) return `${s} — ${e}`;
  if (s) return `${s} — Present`;
  if (e) return e;
  return '';
}

/* ── Input Styles ──────────────────────────────────────────────────────── */

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors';
const textareaClass = inputClass + ' resize-y min-h-[80px]';
const selectClass = inputClass + ' appearance-none';
const labelClass = 'block text-xs font-medium text-slate-500 mb-1.5';

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function CVAnalysisPage() {
  const navigate = useNavigate();

  const { user: clerkUser } = useUser();
  const candidateId = clerkUser?.id || '';

  /* ── State ────────────────────────────────────────────────────────────── */
  const [snapshot, setSnapshot] = useState<CurrentCVSnapshot | null>(null);
  const [workingCV, setWorkingCV] = useState<CandidateCV>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  // Section editing
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [summaryDraft, setSummaryDraft] = useState('');
  const [personalInfoDraft, setPersonalInfoDraft] = useState<CVPersonalInfo>({});

  // Self Study editing
  const [editingSelfStudyIdx, setEditingSelfStudyIdx] = useState<number | null>(null);
  const [isAddingSelfStudy, setIsAddingSelfStudy] = useState(false);
  const [selfStudyDraft, setSelfStudyDraft] = useState<SelfStudyItem>({});
  const [topicInput, setTopicInput] = useState('');

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const isConfirmed = snapshot?.analysis_status === 'confirmed';

  /* ── Load Real Persisted CV ───────────────────────────────────────────── */
  const loadCV = useCallback(async () => {
    if (!candidateId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const snap = await CVAnalysisService.getCurrentCV(candidateId);
      setSnapshot(snap);
      if (snap.has_cv && (snap.analysis_status === 'review_required' || snap.analysis_status === 'confirmed')) {
        setWorkingCV(snap.reviewed_cv ?? snap.raw_extraction ?? {});
      }
    } catch (err: any) {
      setToast(`Error loading CV: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    loadCV();
  }, [loadCV]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  /* ── Derived data ────────────────────────────────────────────────────── */
  const personalInfo = workingCV.personal_info ?? {};
  const skills = workingCV.technical_skills ?? [];
  const experiences = workingCV.experience ?? [];
  const projects = workingCV.projects ?? [];
  const educations = workingCV.education ?? [];
  const certifications = workingCV.certifications ?? [];
  const languages = workingCV.languages ?? [];
  const selfStudyItems = workingCV.advanced_self_study ?? [];

  /* ── AI Assessment Context (derived from CV data, never hardcoded) ──── */
  const aiContext = useMemo(() => {
    const s = workingCV.technical_skills ?? [];
    const exp = workingCV.experience ?? [];
    const proj = workingCV.projects ?? [];
    const edu = workingCV.education ?? [];
    const ss = workingCV.advanced_self_study ?? [];

    const allSkills = s.flatMap((c) => c.skills);
    const primaryAreas = s.slice(0, 3).map((c) => c.category);
    const topTech = allSkills.slice(0, 8);

    // Preferred source order for Target Role:
    // 1. candidateCV.personal_info?.job_title
    // 2. fallback to most relevant/latest experience title only if job_title is missing
    // 3. otherwise null (neutral unavailable state)
    const explicitJobTitle = workingCV.personal_info?.job_title?.trim();
    const normalizedJobTitle = explicitJobTitle
      ? explicitJobTitle.replace(/-/g, ' ').replace(/\s+/g, ' ')
      : null;
    const latestExperienceTitle = exp[0]?.title?.trim() ?? null;
    const targetRole = normalizedJobTitle || latestExperienceTitle || null;

    const eduSummary = edu[0]?.degree ?? null;

    return {
      targetRole,
      primaryAreas,
      experienceCount: exp.length,
      projectCount: proj.length,
      educationSummary: eduSummary,
      selfStudyCount: ss.length,
      topTechnologies: topTech,
    };
  }, [workingCV]);

  /* ── CV Update helper ────────────────────────────────────────────────── */
  const updateCV = useCallback(
    (patch: Partial<CandidateCV>) => {
      setWorkingCV((prev) => {
        const updated = { ...prev, ...patch };
        if (candidateId && snapshot?.document_id) {
          CVAnalysisService.updateCVReview(candidateId, snapshot.document_id, updated);
        }
        return updated;
      });
    },
    [candidateId, snapshot]
  );

  /* ── Summary editing ─────────────────────────────────────────────────── */
  function startEditSummary() {
    setSummaryDraft(workingCV.summary ?? '');
    setEditingSection('summary');
  }
  function saveSummary() {
    updateCV({ summary: summaryDraft.trim() || null });
    setEditingSection(null);
    setToast('Summary updated');
  }

  /* ── Personal Info editing ───────────────────────────────────────────── */
  function startEditPersonalInfo() {
    setPersonalInfoDraft({ ...personalInfo });
    setEditingSection('personal_info');
  }
  function savePersonalInfo() {
    updateCV({ personal_info: { ...personalInfoDraft } });
    setEditingSection(null);
    setToast('Personal information updated');
  }
  function removeLocation(idx: number) {
    const locs = [...(personalInfoDraft.locations ?? [])];
    locs.splice(idx, 1);
    setPersonalInfoDraft((prev) => ({ ...prev, locations: locs }));
  }

  /* ── Self Study handlers ─────────────────────────────────────────────── */
  function startAddSelfStudy() {
    setSelfStudyDraft({ id: generateId(), status: 'planned', topics: [] });
    setIsAddingSelfStudy(true);
    setEditingSelfStudyIdx(null);
  }

  function startEditSelfStudy(idx: number) {
    setSelfStudyDraft({ ...selfStudyItems[idx], topics: [...(selfStudyItems[idx].topics ?? [])] });
    setEditingSelfStudyIdx(idx);
    setIsAddingSelfStudy(false);
  }

  function cancelSelfStudyEdit() {
    setIsAddingSelfStudy(false);
    setEditingSelfStudyIdx(null);
    setSelfStudyDraft({});
    setTopicInput('');
  }

  function saveSelfStudy() {
    const items = [...selfStudyItems];
    const item = { ...selfStudyDraft };
    if (!item.id) item.id = generateId();

    if (isAddingSelfStudy) {
      items.push(item);
    } else if (editingSelfStudyIdx !== null) {
      items[editingSelfStudyIdx] = item;
    }

    updateCV({ advanced_self_study: items });
    cancelSelfStudyEdit();
    setToast(isAddingSelfStudy ? 'Self study item added' : 'Self study item updated');
  }

  function removeSelfStudy(idx: number) {
    const items = [...selfStudyItems];
    items.splice(idx, 1);
    updateCV({ advanced_self_study: items });
    setToast('Self study item removed');
  }

  function updateDraft(patch: Partial<SelfStudyItem>) {
    setSelfStudyDraft((prev) => ({ ...prev, ...patch }));
  }

  function addDraftTopic() {
    const val = topicInput.trim();
    if (!val) return;
    setSelfStudyDraft((prev) => ({ ...prev, topics: [...(prev.topics ?? []), val] }));
    setTopicInput('');
  }

  function removeDraftTopic(idx: number) {
    setSelfStudyDraft((prev) => ({
      ...prev,
      topics: (prev.topics ?? []).filter((_, i) => i !== idx),
    }));
  }

  /* ── Confirm CV ──────────────────────────────────────────────────────── */
  async function handleConfirm() {
    if (!candidateId || !snapshot?.document_id) return;
    try {
      const env = await CVAnalysisService.confirmCV(candidateId, snapshot.document_id, workingCV);
      setSnapshot((prev) =>
        prev
          ? {
              ...prev,
              analysis_status: 'confirmed',
              confirmed_cv: workingCV,
              confirmed_at: env.confirmedAt,
            }
          : null
      );
      setEditingSection(null);
      cancelSelfStudyEdit();
      setToast('CV confirmed — redirecting to AI Assessment...');
      setTimeout(() => {
        navigate('/candidates/ai-interview');
      }, 800);
    } catch (err: any) {
      setToast(`Confirmation failed: ${err.message}`);
    }
  }

  /* ── Generate Test Analysis (Demo / Testing path) ───────────────────────── */
  async function handleGenerateTestAnalysis() {
    if (!candidateId || !snapshot?.document_id) return;
    setIsGeneratingAnalysis(true);
    setToast('Generating structured CV analysis...');
    try {
      const res = await CVAnalysisService.injectTestAnalysis(candidateId, snapshot.document_id);
      if (res.success) {
        await loadCV();
        setToast('Structured CV analysis generated! Please review below.');
      } else {
        setToast(`Generation failed: ${res.error}`);
      }
    } catch (err: any) {
      setToast(`Error: ${err.message}`);
    } finally {
      setIsGeneratingAnalysis(false);
    }
  }

  /* ── Loading ─────────────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <Loader2 className="w-8 h-8 text-[#5E8174] animate-spin mb-4" />
        <p className="text-sm text-slate-500 font-medium">Resolving your persisted CV document…</p>
      </div>
    );
  }

  /* ── 1. No CV Uploaded State ─────────────────────────────────────────── */
  if (!snapshot?.has_cv) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.04)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#5E8174]/10 border border-[#5E8174]/20 text-[#5E8174] flex items-center justify-center mx-auto shadow-2xs">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              No CV Document Found
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              You have not uploaded a CV document yet. Please upload your technical resume in your Profile to initiate automated CV analysis.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5E8174] hover:bg-[#4d6d62] text-white font-bold text-sm transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <span>Go to Profile & Upload CV</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── 2. Pending Analysis State ────────────────────────────────────────── */
  if (snapshot.analysis_status === 'uploaded' || snapshot.analysis_status === 'analysis_pending') {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 animate-fade-in space-y-6">
        {/* Document Header */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">{snapshot.original_filename}</p>
              <p className="text-[11px] text-slate-400">
                Uploaded {snapshot.uploaded_at ? new Date(snapshot.uploaded_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'} • Status: Analysis Pending
              </p>
            </div>
          </div>
          {snapshot.download_url && (
            <a
              href={snapshot.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#5E8174] hover:underline flex items-center gap-1"
            >
              <span>View PDF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Pending Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.04)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
              Analysis Pending
            </span>
            <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
              CV Uploaded — Analysis Has Not Been Generated Yet
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              We received your document <strong className="text-slate-700">{snapshot.original_filename}</strong>. The technical extraction parser has not completed processing this document yet.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200 text-left max-w-lg mx-auto space-y-2">
            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#5E8174]" />
              <span>Pipeline Information</span>
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Once generated, your skills, experiences, and projects will appear here for your review and factual correction before being locked for your AI Assessment.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              disabled={isGeneratingAnalysis}
              onClick={handleGenerateTestAnalysis}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5E8174] hover:bg-[#4d6d62] text-white font-bold text-sm transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>{isGeneratingAnalysis ? 'Generating Analysis...' : 'Generate Analysis (Test Path)'}</span>
            </button>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all cursor-pointer"
            >
              <span>Back to Profile</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     3. RENDER REVIEW & CONFIRMATION EXPERIENCE
     ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* ── Toast ────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[#5E8174] text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium animate-slide-up">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {toast}
        </div>
      )}

      {/* ── Real Persisted Document Metadata Banner ───────────────────── */}
      <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#5E8174]/10 text-[#5E8174] flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-[#0F172A] truncate" title={snapshot?.original_filename}>
                {snapshot?.original_filename}
              </p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                snapshot?.analysis_status === 'confirmed'
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-amber-700 bg-amber-50 border-amber-200'
              }`}>
                {snapshot?.analysis_status === 'confirmed' ? 'Confirmed & Locked' : 'Review Required'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {(snapshot?.file_size ? (snapshot.file_size / (1024 * 1024)).toFixed(1) + ' MB' : 'PDF')} • Uploaded {snapshot?.uploaded_at ? new Date(snapshot.uploaded_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'} • Doc ID: {snapshot?.document_id?.slice(0, 15)}...
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {snapshot?.download_url && (
            <a
              href={snapshot.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F9FA] hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Original PDF</span>
            </a>
          )}
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 transition-all"
          >
            <span>Replace in Profile</span>
          </Link>
        </div>
      </div>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CV Analysis</h1>
            <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
              Jadeer has organized the information detected in your CV. Review it before
              continuing — your AI Assessment will use this context to explore and validate
              your experience.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Status badge & Next stage CTA */}
            {isConfirmed ? (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirmed
                </span>
                <Link
                  to="/candidates/ai-interview"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5E8174] hover:bg-[#4D6D62] text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <span>Continue to AI Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Review Required
                </span>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5E8174] hover:bg-[#4D6D62] text-white text-sm font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  Confirm & Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Left Column: CV Sections ─────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* ══════════════════════════════════════════════════════════
             SECTION: Personal Information
             ══════════════════════════════════════════════════════════ */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Personal Information</h3>
              </div>
              {!isConfirmed && editingSection !== 'personal_info' && (
                <button type="button" onClick={startEditPersonalInfo} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" aria-label="Edit personal information">
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {editingSection === 'personal_info' && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingSection(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" aria-label="Cancel editing"><X className="w-4 h-4" /></button>
                  <button type="button" onClick={savePersonalInfo} className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors cursor-pointer" aria-label="Save changes"><Check className="w-4 h-4" /></button>
                </div>
              )}
            </div>

            {editingSection === 'personal_info' ? (
              /* Edit mode */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input className={inputClass} value={personalInfoDraft.name ?? ''} onChange={(e) => setPersonalInfoDraft((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Target Role / Job Title</label>
                  <input className={inputClass} value={personalInfoDraft.job_title ?? ''} onChange={(e) => setPersonalInfoDraft((p) => ({ ...p, job_title: e.target.value }))} placeholder="e.g. AI Engineer" />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input className={inputClass} value={personalInfoDraft.email ?? ''} onChange={(e) => setPersonalInfoDraft((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} value={personalInfoDraft.phone ?? ''} onChange={(e) => setPersonalInfoDraft((p) => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Locations</label>
                  <div className="flex flex-wrap gap-2">
                    {(personalInfoDraft.locations ?? []).map((loc, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-600 font-medium">
                        <MapPin className="w-3 h-3" />
                        {loc}
                        <button type="button" onClick={() => removeLocation(i)} className="ml-0.5 text-slate-400 hover:text-slate-600 cursor-pointer" aria-label={`Remove ${loc}`}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* View mode */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {personalInfo.name && (
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Full Name</p>
                    <p className="text-sm text-slate-700 font-medium">{personalInfo.name}</p>
                  </div>
                )}
                {personalInfo.job_title && (
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Target Role / Job Title</p>
                    <p className="text-sm text-slate-700 font-medium">{personalInfo.job_title}</p>
                  </div>
                )}
                {personalInfo.email && (
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Email</p>
                    <p className="text-sm text-slate-700">{personalInfo.email}</p>
                  </div>
                )}
                {personalInfo.phone && (
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Phone</p>
                    <p className="text-sm text-slate-700">{personalInfo.phone}</p>
                  </div>
                )}
                {(personalInfo.locations ?? []).length > 0 && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-slate-400 font-medium mb-1.5">Locations</p>
                    <div className="flex flex-wrap gap-2">
                      {(personalInfo.locations ?? []).map((loc, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-600 font-medium">
                          <MapPin className="w-3 h-3" />
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Links — only clickable when valid URLs */}
                {personalInfo.github && (
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">GitHub</p>
                    {isValidExternalUrl(personalInfo.github) ? (
                      <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                        {personalInfo.github} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500 italic">&ldquo;{personalInfo.github}&rdquo; — no valid link detected</p>
                    )}
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">LinkedIn</p>
                    {isValidExternalUrl(personalInfo.linkedin) ? (
                      <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                        {personalInfo.linkedin} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500 italic">&ldquo;{personalInfo.linkedin}&rdquo; — no valid link detected</p>
                    )}
                  </div>
                )}
                {personalInfo.portfolio && (
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Portfolio</p>
                    {isValidExternalUrl(personalInfo.portfolio) ? (
                      <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                        {personalInfo.portfolio} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500 italic">&ldquo;{personalInfo.portfolio}&rdquo; — no valid link detected</p>
                    )}
                  </div>
                )}
                {personalInfo.website && (
                  <div>
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Website</p>
                    {isValidExternalUrl(personalInfo.website) ? (
                      <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                        {personalInfo.website} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <p className="text-sm text-slate-500 italic">&ldquo;{personalInfo.website}&rdquo; — no valid link detected</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ══════════════════════════════════════════════════════════
             SECTION: Professional Summary
             ══════════════════════════════════════════════════════════ */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Professional Summary</h3>
              </div>
              {!isConfirmed && editingSection !== 'summary' && (
                <button type="button" onClick={startEditSummary} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" aria-label="Edit summary">
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {editingSection === 'summary' && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingSection(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" aria-label="Cancel"><X className="w-4 h-4" /></button>
                  <button type="button" onClick={saveSummary} className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors cursor-pointer" aria-label="Save"><Check className="w-4 h-4" /></button>
                </div>
              )}
            </div>
            {editingSection === 'summary' ? (
              <textarea className={textareaClass} rows={4} value={summaryDraft} onChange={(e) => setSummaryDraft(e.target.value)} placeholder="Professional summary…" />
            ) : workingCV.summary ? (
              <p className="text-sm text-slate-600 leading-relaxed">{workingCV.summary}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">Not found in CV</p>
            )}
          </section>

          {/* ══════════════════════════════════════════════════════════
             SECTION: Technical Skills (Detected from CV)
             ══════════════════════════════════════════════════════════ */}
          {skills.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">Technical Skills</h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">Detected from CV — not yet validated</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {skills.map((cat, ci) => (
                  <div key={ci}>
                    <p className="text-xs text-slate-500 font-semibold mb-2">{cat.category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((skill, si) => (
                        <span key={si} className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════
             SECTION: Experience
             ══════════════════════════════════════════════════════════ */}
          {experiences.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Experience</h3>
                <span className="text-xs text-slate-400 font-medium ml-1">({experiences.length})</span>
              </div>
              <div className="space-y-5">
                {experiences.map((exp, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                      <div>
                        {exp.title && <h4 className="text-sm font-semibold text-slate-800">{exp.title}</h4>}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                          {exp.organization && <span>{exp.organization}</span>}
                          {exp.employment_type && <span className="text-slate-300">·</span>}
                          {exp.employment_type && <span>{exp.employment_type}</span>}
                          {exp.location && <span className="text-slate-300">·</span>}
                          {exp.location && <span>{exp.location}</span>}
                        </div>
                      </div>
                      {(exp.start_date || exp.end_date) && (
                        <span className="text-xs text-slate-400 font-medium shrink-0 mt-0.5 sm:mt-0">
                          {formatDateRange(exp.start_date, exp.end_date)}
                        </span>
                      )}
                    </div>
                    {exp.summary && <p className="text-sm text-slate-600 mb-3">{exp.summary}</p>}
                    {(exp.responsibilities ?? []).length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 font-semibold mb-1.5">Responsibilities</p>
                        <ul className="list-disc list-inside space-y-1">
                          {(exp.responsibilities ?? []).map((r, ri) => (
                            <li key={ri} className="text-xs text-slate-600 leading-relaxed">{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(exp.achievements ?? []).length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 font-semibold mb-1.5">Achievements</p>
                        <ul className="list-disc list-inside space-y-1">
                          {(exp.achievements ?? []).map((a, ai) => (
                            <li key={ai} className="text-xs text-slate-600 leading-relaxed">{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(exp.technologies ?? []).length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-1.5">Technologies</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(exp.technologies ?? []).map((t, ti) => (
                            <span key={ti} className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════
             SECTION: Projects
             ══════════════════════════════════════════════════════════ */}
          {projects.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Projects</h3>
                <span className="text-xs text-slate-400 font-medium ml-1">({projects.length})</span>
              </div>
              <div className="space-y-5">
                {projects.map((proj, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                      <div>
                        {proj.name && <h4 className="text-sm font-semibold text-slate-800">{proj.name}</h4>}
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          {proj.category && (
                            <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[11px] font-medium">{proj.category}</span>
                          )}
                          {proj.competition && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium">{proj.competition}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {(proj.description || proj.summary) && (
                      <p className="text-sm text-slate-600 mb-3">{proj.description ?? proj.summary}</p>
                    )}
                    {(proj.responsibilities ?? []).length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 font-semibold mb-1.5">Responsibilities</p>
                        <ul className="list-disc list-inside space-y-1">
                          {(proj.responsibilities ?? []).map((r, ri) => (
                            <li key={ri} className="text-xs text-slate-600 leading-relaxed">{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(proj.achievements ?? []).length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 font-semibold mb-1.5">Achievements</p>
                        <ul className="list-disc list-inside space-y-1">
                          {(proj.achievements ?? []).map((a, ai) => (
                            <li key={ai} className="text-xs text-slate-600 leading-relaxed">{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(proj.technologies ?? []).length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 font-semibold mb-1.5">Technologies</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(proj.technologies ?? []).map((t, ti) => (
                            <span key={ti} className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-600">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Project links — only valid URLs */}
                    {(isValidExternalUrl(proj.github_url) || isValidExternalUrl(proj.project_url)) && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {isValidExternalUrl(proj.github_url) && (
                          <a href={proj.github_url!} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                            GitHub <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {isValidExternalUrl(proj.project_url) && (
                          <a href={proj.project_url!} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                            Live Demo <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                    {/* Show non-URL text for github_url if present but not valid */}
                    {proj.github_url && !isValidExternalUrl(proj.github_url) && (
                      <p className="text-xs text-slate-400 italic mt-2">GitHub: &ldquo;{proj.github_url}&rdquo; — no valid link detected</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════
             SECTION: Education
             ══════════════════════════════════════════════════════════ */}
          {educations.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Education</h3>
              </div>
              <div className="space-y-4">
                {educations.map((edu, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl p-4">
                    {edu.degree && <h4 className="text-sm font-semibold text-slate-800 mb-1">{edu.degree}</h4>}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 mb-2">
                      {edu.institution && <span>{edu.institution}</span>}
                      {edu.field_of_study && <><span className="text-slate-300">·</span><span>{edu.field_of_study}</span></>}
                      {edu.specialization && <><span className="text-slate-300">·</span><span>{edu.specialization}</span></>}
                    </div>
                    {(edu.start_date || edu.end_date) && (
                      <p className="text-xs text-slate-400 font-medium mb-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatDateRange(edu.start_date, edu.end_date)}
                      </p>
                    )}
                    {edu.grade && <p className="text-xs text-slate-500 mb-2">Grade: {edu.grade}</p>}
                    {edu.description && <p className="text-xs text-slate-600 leading-relaxed">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════
             SECTION: Certifications
             ══════════════════════════════════════════════════════════ */}
          {certifications.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-slide-up" style={{ animationDelay: '0.35s' }}>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Award className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Certifications</h3>
              </div>
              <div className="space-y-3">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100">
                    <Award className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      {cert.name && <p className="text-sm text-slate-700 font-medium">{cert.name}</p>}
                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 mt-0.5">
                        {cert.issuer && <span>{cert.issuer}</span>}
                        {cert.date && <><span className="text-slate-300">·</span><span>{displayExtractedDate(cert.date)}</span></>}
                        {cert.credential_id && <><span className="text-slate-300">·</span><span>ID: {cert.credential_id}</span></>}
                      </div>
                      {isValidExternalUrl(cert.credential_url) && (
                        <a href={cert.credential_url!} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 mt-1">
                          Verify Credential <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════
             SECTION: Languages
             ══════════════════════════════════════════════════════════ */}
          {languages.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Languages</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-700 font-medium">
                    {lang.language}
                    {lang.proficiency && (
                      <span className="text-slate-400">· {lang.proficiency}</span>
                    )}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════
             SECTION: Advanced Self Study (Full CRUD)
             ══════════════════════════════════════════════════════════ */}
          <section
            id="cv-self-study-section"
            className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-slide-up"
            style={{ animationDelay: '0.45s' }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Advanced Self Study</h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Self-reported learning context</p>
                </div>
              </div>
              {!isConfirmed && !isAddingSelfStudy && editingSelfStudyIdx === null && (
                <button
                  type="button"
                  onClick={startAddSelfStudy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5E8174] hover:bg-[#4D6D62] text-white text-xs font-semibold transition-all cursor-pointer active:scale-95"
                  aria-label="Add self study item"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Self Study
                </button>
              )}
            </div>

            {/* Self Study Items */}
            {selfStudyItems.length === 0 && !isAddingSelfStudy ? (
              /* Empty state */
              <div className="text-center py-10 mt-2">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 mb-1">No advanced self study entries yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Add advanced books, courses, or independent technical study that shaped your expertise.
                </p>
                {!isConfirmed && (
                  <button
                    type="button"
                    onClick={startAddSelfStudy}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-primary-300 hover:text-primary-700 transition-colors cursor-pointer"
                    aria-label="Add self study item"
                  >
                    <Plus className="w-4 h-4" />
                    Add Self Study
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {selfStudyItems.map((item, idx) => (
                  editingSelfStudyIdx === idx ? (
                    /* ── Inline Edit Form ───────────────────────────── */
                    <div key={item.id ?? idx} className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4 animate-scale-in">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-slate-700">Edit Self Study Item</p>
                        <div className="flex gap-2">
                          <button type="button" onClick={cancelSelfStudyEdit} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" aria-label="Cancel editing"><X className="w-4 h-4" /></button>
                          <button type="button" onClick={saveSelfStudy} className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors cursor-pointer" aria-label="Save changes"><Check className="w-4 h-4" /></button>
                        </div>
                      </div>
                      {renderSelfStudyForm()}
                    </div>
                  ) : (
                    /* ── View Card ──────────────────────────────────── */
                    <div key={item.id ?? idx} className="border border-slate-100 rounded-xl p-4 group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 min-w-0">
                          <BookOpen className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            {item.title && <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                              {item.author_or_provider && <span>{item.author_or_provider}</span>}
                              {item.category && (
                                <>
                                  {item.author_or_provider && <span className="text-slate-300">·</span>}
                                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-500">{item.category}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {!isConfirmed && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button type="button" onClick={() => startEditSelfStudy(idx)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" aria-label="Edit item">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => removeSelfStudy(idx)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" aria-label="Remove item">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Status + dates */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {item.status && SELF_STUDY_STATUS_LABELS[item.status] && (
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${SELF_STUDY_STATUS_LABELS[item.status].className}`}>
                            {SELF_STUDY_STATUS_LABELS[item.status].label}
                          </span>
                        )}
                        {(item.started_at || item.completed_at) && (
                          <span className="text-xs text-slate-400 font-medium">
                            <Clock className="w-3 h-3 inline mr-0.5" />
                            {formatDateRange(item.started_at, item.completed_at)}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="text-xs text-slate-600 leading-relaxed mt-2.5">{item.description}</p>
                      )}

                      {/* Topics */}
                      {(item.topics ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {(item.topics ?? []).map((topic, ti) => (
                            <span key={ti} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 text-[11px] font-medium">
                              <Tag className="w-2.5 h-2.5" />
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Source URL — only valid URLs */}
                      {isValidExternalUrl(item.source_url) && (
                        <a href={item.source_url!} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 mt-2.5">
                          <Link2 className="w-3 h-3" />
                          Source <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )
                ))}

                {/* ── Add Form (appears below existing items) ─────── */}
                {isAddingSelfStudy && (
                  <div className="bg-slate-50 rounded-xl border border-primary-200 p-5 space-y-4 animate-scale-in">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-slate-700">Add Self Study Item</p>
                      <div className="flex gap-2">
                        <button type="button" onClick={cancelSelfStudyEdit} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" aria-label="Cancel"><X className="w-4 h-4" /></button>
                        <button type="button" onClick={saveSelfStudy} className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors cursor-pointer" aria-label="Save"><Check className="w-4 h-4" /></button>
                      </div>
                    </div>
                    {renderSelfStudyForm()}
                  </div>
                )}
              </div>
            )}
          </section>

        </div>

        {/* ── Right Column: AI Assessment Context ──────────────────── */}
        <div className="lg:w-[340px] shrink-0">
          <div className="lg:sticky lg:top-6">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">AI Assessment Context</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">What Jadeer will explore</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-slate-400 font-medium mb-1">Target Role</p>
                  <p className="text-sm text-slate-700 font-medium">
                    {aiContext.targetRole ?? (
                      <span className="text-slate-400 font-normal italic">Not detected in CV</span>
                    )}
                  </p>
                </div>

                {aiContext.primaryAreas.length > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium mb-1.5">Primary Areas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {aiContext.primaryAreas.map((area, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-medium">{area}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-slate-800">{aiContext.experienceCount}</p>
                    <p className="text-[11px] text-slate-400">Experience</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-slate-800">{aiContext.projectCount}</p>
                    <p className="text-[11px] text-slate-400">Projects</p>
                  </div>
                </div>

                {aiContext.educationSummary && (
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium mb-1">Education</p>
                    <p className="text-xs text-slate-600">{aiContext.educationSummary}</p>
                  </div>
                )}

                {/* Advanced Self Study count — factual only */}
                {aiContext.selfStudyCount > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium mb-1">Advanced Self Study</p>
                    <p className="text-xs text-slate-600">{aiContext.selfStudyCount} item{aiContext.selfStudyCount !== 1 ? 's' : ''}</p>
                  </div>
                )}

                {aiContext.topTechnologies.length > 0 && (
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium mb-1.5">Mentioned Technologies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {aiContext.topTechnologies.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] text-slate-600">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This context is derived from your CV and will guide the AI Assessment.
                    It does not represent a score or validated assessment.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Self Study Form (shared between add and edit) ───────────────────── */
  function renderSelfStudyForm() {
    return (
      <>
        {/* Title */}
        <div>
          <label className={labelClass}>Title</label>
          <input
            className={inputClass}
            value={selfStudyDraft.title ?? ''}
            onChange={(e) => updateDraft({ title: e.target.value })}
            placeholder="e.g. Deep Learning with Python, Attention Is All You Need"
          />
        </div>

        {/* Author + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Author / Provider</label>
            <input
              className={inputClass}
              value={selfStudyDraft.author_or_provider ?? ''}
              onChange={(e) => updateDraft({ author_or_provider: e.target.value })}
              placeholder="e.g. François Chollet, fast.ai"
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input
              className={inputClass}
              value={selfStudyDraft.category ?? ''}
              onChange={(e) => updateDraft({ category: e.target.value })}
              placeholder="e.g. Book, Course, Research Paper"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={selectClass}
            value={selfStudyDraft.status ?? ''}
            onChange={(e) => updateDraft({ status: (e.target.value || undefined) as SelfStudyItem['status'] })}
          >
            <option value="">Select status</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Started</label>
            <input
              className={inputClass}
              value={selfStudyDraft.started_at ?? ''}
              onChange={(e) => updateDraft({ started_at: e.target.value })}
              placeholder="e.g. Jan 2025, 2024"
            />
          </div>
          <div>
            <label className={labelClass}>Completed</label>
            <input
              className={inputClass}
              value={selfStudyDraft.completed_at ?? ''}
              onChange={(e) => updateDraft({ completed_at: e.target.value })}
              placeholder="e.g. Mar 2025, Ongoing"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            className={textareaClass}
            rows={3}
            value={selfStudyDraft.description ?? ''}
            onChange={(e) => updateDraft({ description: e.target.value })}
            placeholder="What did you study and why is it relevant?"
          />
        </div>

        {/* Topics */}
        <div>
          <label className={labelClass}>Topics</label>
          {(selfStudyDraft.topics ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(selfStudyDraft.topics ?? []).map((topic, ti) => (
                <span key={ti} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
                  {topic}
                  <button type="button" onClick={() => removeDraftTopic(ti)} className="ml-0.5 text-primary-400 hover:text-primary-700 cursor-pointer" aria-label={`Remove topic ${topic}`}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDraftTopic(); } }}
              placeholder="Type a topic and press Enter"
            />
            <button
              type="button"
              onClick={addDraftTopic}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer shrink-0"
              aria-label="Add topic"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Source URL */}
        <div>
          <label className={labelClass}>Source URL (optional)</label>
          <input
            className={inputClass}
            type="url"
            value={selfStudyDraft.source_url ?? ''}
            onChange={(e) => updateDraft({ source_url: e.target.value })}
            placeholder="https://..."
          />
          {selfStudyDraft.source_url && !isValidExternalUrl(selfStudyDraft.source_url) && selfStudyDraft.source_url.length > 3 && (
            <p className="text-[11px] text-amber-600 mt-1">Enter a valid https:// URL or leave empty</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={cancelSelfStudyEdit}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveSelfStudy}
            className="px-4 py-2 rounded-xl bg-[#5E8174] hover:bg-[#4D6D62] text-white text-sm font-semibold transition-all cursor-pointer active:scale-95"
          >
            {isAddingSelfStudy ? 'Add Item' : 'Save Changes'}
          </button>
        </div>
      </>
    );
  }
}
