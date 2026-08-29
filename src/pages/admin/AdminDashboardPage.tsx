import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Building2,
  FileCheck2,
  Database,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Power,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Code2,
  Layers,
  Award,
  BarChart3,
  SlidersHorizontal,
  Plus,
  Trash2,
  Eye,
  Check,
  X,
  FileText,
  ChevronDown,
  Pencil,
  Copy,
  Play,
  CheckSquare,
  Terminal,
  FileCode2,
  Sliders,
  HelpCircle,
  CalendarCheck,
  Calendar,
  Video,
  MessageSquare,
  Star,
  UserCheck,
  Activity,
  User,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  AdminApiService,
  type AdminUserRecord,
  type AdminJobListingRecord,
  type AdminApplicationRecord,
  type AdminAssessmentRecord,
  type AdminConsultationRecord,
  type AdminMetrics,
  type UserRole,
  type JobStatus,
  type SoftwareTrack,
  type ApplicationStatus,
  type AssessmentType,
  type AssessmentDifficulty,
  type AssessmentStatus,
  type TestCase,
  type RubricDimension,
  type ConsultationStatus,
  type ConsultationTopic,
} from '@/services/adminService';

export default function AdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [metrics, setMetrics] = useState<AdminMetrics>(() => AdminApiService.getMetrics());
  const [users, setUsers] = useState<AdminUserRecord[]>(() => AdminApiService.getUsers());
  const [jobs, setJobs] = useState<AdminJobListingRecord[]>(() => AdminApiService.getJobListings());
  const [applications, setApplications] = useState<AdminApplicationRecord[]>(() => AdminApiService.getApplications());
  const [assessments, setAssessments] = useState<AdminAssessmentRecord[]>(() => AdminApiService.getAssessments());
  const [consultations, setConsultations] = useState<AdminConsultationRecord[]>(() => AdminApiService.getConsultations());

  // Filter states
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [userSearch, setUserSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState<JobStatus | 'ALL'>('ALL');
  const [jobSearch, setJobSearch] = useState('');
  const [assessmentTrackFilter, setAssessmentTrackFilter] = useState<SoftwareTrack | 'ALL'>('ALL');
  const [assessmentDifficultyFilter, setAssessmentDifficultyFilter] = useState<AssessmentDifficulty | 'ALL'>('ALL');
  const [assessmentStatusFilter, setAssessmentStatusFilter] = useState<AssessmentStatus | 'ALL'>('ALL');
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const [consultationStatusFilter, setConsultationStatusFilter] = useState<ConsultationStatus | 'ALL'>('ALL');
  const [consultationTrackFilter, setConsultationTrackFilter] = useState<SoftwareTrack | 'ALL'>('ALL');
  const [consultationSearch, setConsultationSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTracksExpanded, setIsTracksExpanded] = useState(false);

  // Consultation Modal States
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingConsultationId, setEditingConsultationId] = useState<string | null>(null);
  const [viewingConsultation, setViewingConsultation] = useState<AdminConsultationRecord | null>(null);

  // Consultation Form Fields
  const [formStudentName, setFormStudentName] = useState('');
  const [formStudentEmail, setFormStudentEmail] = useState('');
  const [formStudentTrack, setFormStudentTrack] = useState<SoftwareTrack>('BACKEND');
  const [formMentorName, setFormMentorName] = useState('');
  const [formMentorTitle, setFormMentorTitle] = useState('Staff Engineer');
  const [formMentorCompany, setFormMentorCompany] = useState('Tamara');
  const [formConsultationTopic, setFormConsultationTopic] = useState<ConsultationTopic>('SYSTEM_DESIGN');
  const [formTopicTitle, setFormTopicTitle] = useState('');
  const [formScheduledAt, setFormScheduledAt] = useState('2026-09-01T14:00');
  const [formDurationMinutes, setFormDurationMinutes] = useState(45);
  const [formMeetingLink, setFormMeetingLink] = useState('https://meet.jadeer.io/session');
  const [formConsultationNotes, setFormConsultationNotes] = useState('');
  const [formConsultationStatus, setFormConsultationStatus] = useState<ConsultationStatus>('SCHEDULED');

  // Assessment Authoring & Preview Modal States
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'metadata' | 'problem' | 'testCases' | 'rubric'>('metadata');
  const [previewAssessment, setPreviewAssessment] = useState<AdminAssessmentRecord | null>(null);

  // Assessment Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTrack, setFormTrack] = useState<SoftwareTrack>('BACKEND');
  const [formType, setFormType] = useState<AssessmentType>('CODING_CHALLENGE');
  const [formDifficulty, setFormDifficulty] = useState<AssessmentDifficulty>('INTERMEDIATE');
  const [formStatus, setFormStatus] = useState<AssessmentStatus>('ACTIVE');
  const [formTimeLimit, setFormTimeLimit] = useState(45);
  const [formPassingScore, setFormPassingScore] = useState(75);
  const [formProblemStatement, setFormProblemStatement] = useState('');
  const [formStarterCode, setFormStarterCode] = useState('');
  const [formLanguage, setFormLanguage] = useState('TypeScript');
  const [formTags, setFormTags] = useState('Algorithms, Concurrency');
  const [formTestCases, setFormTestCases] = useState<TestCase[]>([
    { id: 'tc-1', input: 'sampleInput()', expectedOutput: 'true', isHidden: false, explanation: 'Baseline test case', weight: 50 },
    { id: 'tc-2', input: 'edgeCaseConcurrent()', expectedOutput: 'true', isHidden: true, explanation: 'High-throughput boundary test', weight: 50 },
  ]);
  const [formRubric, setFormRubric] = useState<RubricDimension[]>([
    { id: 'rb-1', dimensionName: 'Algorithmic Correctness', weight: 40, description: 'Correct execution across all functional specifications.' },
    { id: 'rb-2', dimensionName: 'Clean Code & Typing', weight: 30, description: 'Idiomatic patterns, clear variable naming, and modular structure.' },
    { id: 'rb-3', dimensionName: 'Time & Memory Efficiency', weight: 30, description: 'Optimal asymptotic complexity.' },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshAllData = () => {
    setMetrics(AdminApiService.getMetrics());
    setUsers(AdminApiService.getUsers());
    setJobs(AdminApiService.getJobListings());
    setApplications(AdminApiService.getApplications());
    setAssessments(AdminApiService.getAssessments());
  };

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  // User Actions
  const handleToggleUserActive = (userId: string, name: string) => {
    const updated = AdminApiService.toggleUserActive(userId);
    setUsers(updated);
    setMetrics(AdminApiService.getMetrics());
    showToast(`Updated active status for ${name}`);
  };

  const handleToggleUserVerified = (userId: string, name: string) => {
    const updated = AdminApiService.toggleUserVerified(userId);
    setUsers(updated);
    setMetrics(AdminApiService.getMetrics());
    showToast(`Updated verification status for ${name}`);
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`Are you sure you want to delete user "${name}"?`)) {
      const updated = AdminApiService.deleteUser(userId);
      setUsers(updated);
      setMetrics(AdminApiService.getMetrics());
      showToast(`User ${name} has been removed`);
    }
  };

  // Employer CR Actions
  const handleVerifyEmployerCR = (userId: string, companyName: string, isVerified: boolean) => {
    const updated = AdminApiService.verifyEmployerCR(userId, isVerified);
    setUsers(updated);
    setMetrics(AdminApiService.getMetrics());
    showToast(`${companyName} CR verification set to ${isVerified ? 'VERIFIED' : 'PENDING'}`);
  };

  // Job Actions
  const handleUpdateJobStatus = (jobId: string, title: string, status: JobStatus) => {
    const updated = AdminApiService.updateJobStatus(jobId, status);
    setJobs(updated);
    setMetrics(AdminApiService.getMetrics());
    showToast(`Job listing "${title}" status updated to ${status}`);
  };

  const handleDeleteJob = (jobId: string, title: string) => {
    if (confirm(`Are you sure you want to delete job listing "${title}"?`)) {
      const updated = AdminApiService.deleteJobListing(jobId);
      setJobs(updated);
      setMetrics(AdminApiService.getMetrics());
      showToast(`Job listing "${title}" deleted`);
    }
  };

  // Application Actions
  const handleUpdateAppStatus = (appId: string, candidateName: string, status: ApplicationStatus) => {
    const updated = AdminApiService.updateApplicationStatus(appId, status);
    setApplications(updated);
    setMetrics(AdminApiService.getMetrics());
    showToast(`Application for ${candidateName} updated to ${status}`);
  };

  // Reset to Prisma Seed
  const handleResetSeed = () => {
    if (confirm('Reset entire platform database to Prisma seed defaults? This will restore original test candidates, employers, and job listings.')) {
      AdminApiService.resetToPrismaSeed();
      refreshAllData();
      showToast('Database reset to Prisma seed dataset successfully');
    }
  };

  // Assessment Actions
  const handleOpenCreateModal = () => {
    setEditingAssessmentId(null);
    setFormTitle('');
    setFormDescription('');
    setFormTrack('BACKEND');
    setFormType('CODING_CHALLENGE');
    setFormDifficulty('INTERMEDIATE');
    setFormStatus('ACTIVE');
    setFormTimeLimit(45);
    setFormPassingScore(75);
    setFormProblemStatement('### Problem Description\n\nDescribe the technical challenge, architectural goals, and performance constraints here...');
    setFormStarterCode('// Boilerplate starter code\nexport function solveProblem() {\n  // TODO: implement solution\n}');
    setFormLanguage('TypeScript');
    setFormTags('Algorithms, Concurrency');
    setFormTestCases([
      { id: 'tc-1', input: 'sampleInput()', expectedOutput: 'true', isHidden: false, explanation: 'Standard baseline test case', weight: 50 },
      { id: 'tc-2', input: 'edgeCaseConcurrent()', expectedOutput: 'true', isHidden: true, explanation: 'High-throughput boundary test', weight: 50 },
    ]);
    setFormRubric([
      { id: 'rb-1', dimensionName: 'Algorithmic Correctness', weight: 40, description: 'Correct execution across all functional specs.' },
      { id: 'rb-2', dimensionName: 'Code Quality & Design', weight: 30, description: 'Modular, clean, and typed implementation.' },
      { id: 'rb-3', dimensionName: 'Complexity & Performance', weight: 30, description: 'Optimal asymptotic complexity.' },
    ]);
    setModalTab('metadata');
    setIsAssessmentModalOpen(true);
  };

  const handleOpenEditModal = (a: AdminAssessmentRecord) => {
    setEditingAssessmentId(a.id);
    setFormTitle(a.title);
    setFormDescription(a.description);
    setFormTrack(a.softwareTrack);
    setFormType(a.type);
    setFormDifficulty(a.difficulty);
    setFormStatus(a.status);
    setFormTimeLimit(a.timeLimitMinutes);
    setFormPassingScore(a.passingScore);
    setFormProblemStatement(a.problemStatement);
    setFormStarterCode(a.starterCode);
    setFormLanguage(a.language);
    setFormTags(a.tags.join(', '));
    setFormTestCases(
      a.testCases && a.testCases.length > 0
        ? a.testCases
        : [{ id: 'tc-1', input: 'sampleInput()', expectedOutput: 'true', isHidden: false, explanation: 'Standard test case', weight: 50 }]
    );
    setFormRubric(
      a.rubric && a.rubric.length > 0
        ? a.rubric
        : [
            { id: 'rb-1', dimensionName: 'Algorithmic Correctness', weight: 40, description: 'Correct execution across specs.' },
            { id: 'rb-2', dimensionName: 'Code Quality & Typing', weight: 30, description: 'Clean, structured code.' },
            { id: 'rb-3', dimensionName: 'Performance & Optimization', weight: 30, description: 'Optimal complexity.' },
          ]
    );
    setModalTab('metadata');
    setIsAssessmentModalOpen(true);
  };

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      alert('Please enter an assessment title.');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingAssessmentId) {
      const updated = AdminApiService.updateAssessment(editingAssessmentId, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        softwareTrack: formTrack,
        type: formType,
        difficulty: formDifficulty,
        status: formStatus,
        timeLimitMinutes: Number(formTimeLimit) || 45,
        passingScore: Number(formPassingScore) || 75,
        problemStatement: formProblemStatement,
        starterCode: formStarterCode,
        language: formLanguage,
        testCases: formTestCases,
        rubric: formRubric,
        tags: tagsArray,
      });
      setAssessments(updated);
      setMetrics(AdminApiService.getMetrics());
      showToast(`Updated assessment "${formTitle.trim()}"`);
    } else {
      const created = AdminApiService.createAssessment({
        title: formTitle.trim(),
        description: formDescription.trim(),
        softwareTrack: formTrack,
        type: formType,
        difficulty: formDifficulty,
        status: formStatus,
        timeLimitMinutes: Number(formTimeLimit) || 45,
        passingScore: Number(formPassingScore) || 75,
        problemStatement: formProblemStatement,
        starterCode: formStarterCode,
        language: formLanguage,
        testCases: formTestCases,
        rubric: formRubric,
        tags: tagsArray,
      });
      setAssessments(AdminApiService.getAssessments());
      setMetrics(AdminApiService.getMetrics());
      showToast(`Created new assessment "${created.title}"`);
    }

    setIsAssessmentModalOpen(false);
  };

  const handleDeleteAssessment = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete technical assessment "${title}"?`)) {
      const updated = AdminApiService.deleteAssessment(id);
      setAssessments(updated);
      setMetrics(AdminApiService.getMetrics());
      showToast(`Deleted assessment "${title}"`);
    }
  };

  const handleToggleAssessmentStatus = (id: string, title: string) => {
    const updated = AdminApiService.toggleAssessmentStatus(id);
    setAssessments(updated);
    setMetrics(AdminApiService.getMetrics());
    showToast(`Toggled status for assessment "${title}"`);
  };

  const handleAddTestCase = () => {
    const newTc: TestCase = {
      id: `tc-${Date.now().toString().slice(-4)}`,
      input: '',
      expectedOutput: '',
      isHidden: false,
      explanation: '',
      weight: 25,
    };
    setFormTestCases([...formTestCases, newTc]);
  };

  const handleRemoveTestCase = (id: string) => {
    if (formTestCases.length <= 1) {
      alert('At least 1 test case is required.');
      return;
    }
    setFormTestCases(formTestCases.filter((tc) => tc.id !== id));
  };

  const handleUpdateTestCase = (id: string, field: keyof TestCase, value: any) => {
    setFormTestCases(formTestCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)));
  };

  const handleAddRubricDimension = () => {
    const newRb: RubricDimension = {
      id: `rb-${Date.now().toString().slice(-4)}`,
      dimensionName: 'Architecture & Modularity',
      weight: 25,
      description: 'Evaluation criteria for clean code structure and scalability.',
    };
    setFormRubric([...formRubric, newRb]);
  };

  const handleRemoveRubricDimension = (id: string) => {
    if (formRubric.length <= 1) {
      alert('At least 1 rubric dimension is required.');
      return;
    }
    setFormRubric(formRubric.filter((rb) => rb.id !== id));
  };

  const handleUpdateRubricDimension = (id: string, field: keyof RubricDimension, value: any) => {
    setFormRubric(formRubric.map((rb) => (rb.id === id ? { ...rb, [field]: value } : rb)));
  };

  // Consultation Actions
  const handleOpenScheduleModal = () => {
    setEditingConsultationId(null);
    setFormStudentName('');
    setFormStudentEmail('');
    setFormStudentTrack('BACKEND');
    setFormMentorName('Tariq Al-Mansoor');
    setFormMentorTitle('Principal Systems Architect');
    setFormMentorCompany('Elm');
    setFormConsultationTopic('SYSTEM_DESIGN');
    setFormTopicTitle('');
    setFormScheduledAt('2026-09-02T15:00');
    setFormDurationMinutes(45);
    setFormMeetingLink('https://meet.jadeer.io/csl-session');
    setFormConsultationNotes('');
    setFormConsultationStatus('SCHEDULED');
    setIsScheduleModalOpen(true);
  };

  const handleOpenEditConsultation = (c: AdminConsultationRecord) => {
    setEditingConsultationId(c.id);
    setFormStudentName(c.studentName);
    setFormStudentEmail(c.studentEmail);
    setFormStudentTrack(c.studentTrack);
    setFormMentorName(c.mentorName);
    setFormMentorTitle(c.mentorTitle);
    setFormMentorCompany(c.mentorCompany);
    setFormConsultationTopic(c.topic);
    setFormTopicTitle(c.topicTitle);
    setFormScheduledAt(c.scheduledAt ? c.scheduledAt.slice(0, 16) : '2026-09-02T15:00');
    setFormDurationMinutes(c.durationMinutes);
    setFormMeetingLink(c.meetingLink || 'https://meet.jadeer.io/csl-session');
    setFormConsultationNotes(c.notes || '');
    setFormConsultationStatus(c.status);
    setIsScheduleModalOpen(true);
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentName.trim() || !formTopicTitle.trim()) {
      alert('Please fill in candidate name and session topic.');
      return;
    }

    if (editingConsultationId) {
      const updated = AdminApiService.getConsultations().map((c) =>
        c.id === editingConsultationId
          ? {
              ...c,
              studentName: formStudentName.trim(),
              studentEmail: formStudentEmail.trim(),
              studentTrack: formStudentTrack,
              mentorName: formMentorName.trim(),
              mentorTitle: formMentorTitle.trim(),
              mentorCompany: formMentorCompany.trim(),
              topic: formConsultationTopic,
              topicTitle: formTopicTitle.trim(),
              scheduledAt: new Date(formScheduledAt).toISOString(),
              durationMinutes: Number(formDurationMinutes) || 45,
              meetingLink: formMeetingLink.trim(),
              notes: formConsultationNotes.trim(),
              status: formConsultationStatus,
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      try {
        localStorage.setItem('jadeer-admin-consultations-v1', JSON.stringify(updated));
      } catch {}
      setConsultations(updated);
      setMetrics(AdminApiService.getMetrics());
      showToast(`Updated consultation session with ${formStudentName}`);
    } else {
      const created = AdminApiService.scheduleConsultation({
        studentId: `stu-${Date.now().toString().slice(-4)}`,
        studentName: formStudentName.trim(),
        studentEmail: formStudentEmail.trim(),
        studentTrack: formStudentTrack,
        mentorId: `mnt-${Date.now().toString().slice(-4)}`,
        mentorName: formMentorName.trim(),
        mentorTitle: formMentorTitle.trim(),
        mentorCompany: formMentorCompany.trim(),
        topic: formConsultationTopic,
        topicTitle: formTopicTitle.trim(),
        scheduledAt: new Date(formScheduledAt).toISOString(),
        durationMinutes: Number(formDurationMinutes) || 45,
        meetingLink: formMeetingLink.trim(),
        notes: formConsultationNotes.trim(),
        status: formConsultationStatus,
      });
      setConsultations(AdminApiService.getConsultations());
      setMetrics(AdminApiService.getMetrics());
      showToast(`Scheduled consultation session for ${created.studentName}`);
    }
    setIsScheduleModalOpen(false);
  };

  const handleUpdateConsultationStatus = (id: string, candidateName: string, status: ConsultationStatus) => {
    const updated = AdminApiService.updateConsultationStatus(id, status);
    setConsultations(updated);
    setMetrics(AdminApiService.getMetrics());
    showToast(`Consultation for ${candidateName} marked as ${status}`);
  };

  const handleDeleteConsultation = (id: string, topicTitle: string) => {
    if (confirm(`Are you sure you want to delete consultation "${topicTitle}"?`)) {
      const updated = AdminApiService.deleteConsultation(id);
      setConsultations(updated);
      setMetrics(AdminApiService.getMetrics());
      showToast(`Deleted consultation "${topicTitle}"`);
    }
  };

  // Filtered Consultations
  const filteredConsultations = consultations.filter((c) => {
    if (consultationStatusFilter !== 'ALL' && c.status !== consultationStatusFilter) return false;
    if (consultationTrackFilter !== 'ALL' && c.studentTrack !== consultationTrackFilter) return false;
    if (consultationSearch.trim()) {
      const q = consultationSearch.toLowerCase();
      return (
        c.studentName.toLowerCase().includes(q) ||
        c.mentorName.toLowerCase().includes(q) ||
        c.mentorCompany.toLowerCase().includes(q) ||
        c.topicTitle.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered Assessments
  const filteredAssessments = assessments.filter((a) => {
    if (assessmentTrackFilter !== 'ALL' && a.softwareTrack !== assessmentTrackFilter) return false;
    if (assessmentDifficultyFilter !== 'ALL' && a.difficulty !== assessmentDifficultyFilter) return false;
    if (assessmentStatusFilter !== 'ALL' && a.status !== assessmentStatusFilter) return false;
    if (assessmentSearch.trim()) {
      const q = assessmentSearch.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'ALL' && u.role !== userRoleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      const name = u.studentProfile?.fullName || u.companyProfile?.companyName || '';
      return (
        u.email.toLowerCase().includes(q) ||
        name.toLowerCase().includes(q) ||
        (u.studentProfile?.university && u.studentProfile.university.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered Jobs
  const filteredJobs = jobs.filter((j) => {
    if (jobStatusFilter !== 'ALL' && j.status !== jobStatusFilter) return false;
    if (jobSearch.trim()) {
      const q = jobSearch.toLowerCase();
      return (
        j.title.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <AdminLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {/* ── Notification Toast ────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#0B0F19] text-white border border-white/[0.15] shadow-2xl animate-[slide-up_0.2s_ease-out]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         TAB 1: OVERVIEW & TELEMETRY (CLEAN & STREAMLINED)
         ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-[fade-in_0.2s_ease]">
          {/* ── 1. Minimal Header with Inline Quick Actions ────────────── */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#0B0F19]/[0.06] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-[11px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  Live Platform Telemetry
                </span>
                <span className="text-[11px] text-[#0B0F19]/40 font-mono">DB v1.0 • Connected</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B0F19] tracking-tight">
                Platform Operations & Data Console
              </h1>
              <p className="text-xs text-[#0B0F19]/50 max-w-xl leading-relaxed">
                Live visibility across verified software engineering pipelines, CR approvals, and AI match scoring.
              </p>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleTabChange('consultations')}
                className="px-3 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#6E8F75]/10 text-[#0B0F19] hover:text-[#6E8F75] border border-[#0B0F19]/[0.08] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-[#6E8F75]" />
                <span>Consultations ({metrics.totalConsultations})</span>
              </button>
              <button
                onClick={() => handleTabChange('assessments')}
                className="px-3 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#6E8F75]/10 text-[#0B0F19] hover:text-[#6E8F75] border border-[#0B0F19]/[0.08] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Code2 className="w-3.5 h-3.5 text-[#6E8F75]" />
                <span>Assessments ({metrics.totalAssessments})</span>
              </button>
              <button
                onClick={() => handleTabChange('users')}
                className="px-3 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#6E8F75]/10 text-[#0B0F19] hover:text-[#6E8F75] border border-[#0B0F19]/[0.08] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Users className="w-3.5 h-3.5 text-[#6E8F75]" />
                <span>Users ({metrics.totalUsers})</span>
              </button>
              <button
                onClick={() => handleTabChange('jobs')}
                className="px-3 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#6E8F75]/10 text-[#0B0F19] hover:text-[#6E8F75] border border-[#0B0F19]/[0.08] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#6E8F75]" />
                <span>Listings ({metrics.totalJobListings})</span>
              </button>
              <button
                onClick={() => handleTabChange('employers')}
                className="px-3 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#6E8F75]/10 text-[#0B0F19] hover:text-[#6E8F75] border border-[#0B0F19]/[0.08] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Building2 className="w-3.5 h-3.5 text-[#6E8F75]" />
                <span>CR Desk ({metrics.totalEmployers})</span>
              </button>
              <button
                onClick={handleResetSeed}
                title="Reset Database to Prisma Seed"
                className="p-2 rounded-xl bg-[#FAF9F6] hover:bg-rose-50 text-[#0B0F19]/60 hover:text-rose-600 border border-[#0B0F19]/[0.08] transition-all cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── 2. Compact Streamlined Metric Cards ─────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Total Users */}
            <div
              onClick={() => handleTabChange('users')}
              className="bg-white rounded-2xl p-4.5 border border-[#0B0F19]/[0.06] shadow-xs hover:border-[#6E8F75]/40 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45">
                  Total Accounts
                </span>
                <div className="w-7 h-7 rounded-lg bg-student-500/10 text-student-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19]">{metrics.totalUsers}</div>
                <p className="text-[11px] text-[#0B0F19]/50 mt-0.5">
                  {metrics.totalCandidates} Candidates • {metrics.totalEmployers} Employers
                </p>
              </div>
            </div>

            {/* Active Job Postings */}
            <div
              onClick={() => handleTabChange('jobs')}
              className="bg-white rounded-2xl p-4.5 border border-[#0B0F19]/[0.06] shadow-xs hover:border-[#6E8F75]/40 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45">
                  Active Listings
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19]">{metrics.activeJobListings}</div>
                <p className="text-[11px] text-[#0B0F19]/50 mt-0.5">
                  {metrics.totalJobListings} Total Created Listings
                </p>
              </div>
            </div>

            {/* Applications */}
            <div
              onClick={() => handleTabChange('applications')}
              className="bg-white rounded-2xl p-4.5 border border-[#0B0F19]/[0.06] shadow-xs hover:border-[#6E8F75]/40 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45">
                  Applications
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileCheck2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19]">{metrics.totalApplications}</div>
                <p className="text-[11px] text-[#0B0F19]/50 mt-0.5">
                  Avg Match Score: <span className="font-bold text-[#0B0F19]">{metrics.avgTelemetryScore}%</span>
                </p>
              </div>
            </div>

            {/* CR Verification */}
            <div
              onClick={() => handleTabChange('employers')}
              className="bg-white rounded-2xl p-4.5 border border-[#0B0F19]/[0.06] shadow-xs hover:border-[#6E8F75]/40 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45">
                  Employer CR Rate
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19]">{metrics.verificationRate}%</div>
                <p className="text-[11px] text-[#0B0F19]/50 mt-0.5">
                  {metrics.verifiedEmployers} of {metrics.totalEmployers} Verified
                </p>
              </div>
            </div>
          </div>

          {/* ── 3. Consolidated Collapsible Software Tracks Grid ─────────── */}
          <div className="bg-white rounded-2xl p-5 border border-[#0B0F19]/[0.06] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#6E8F75]" />
                <h3 className="text-sm font-bold text-[#0B0F19]">Software Tracks & Talent Distribution</h3>
                <span className="text-[10px] font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2 py-0.5 rounded-md">
                  10 Domains
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsTracksExpanded(!isTracksExpanded)}
                className="text-[11px] font-semibold text-[#0B0F19]/50 hover:text-[#0B0F19] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{isTracksExpanded ? 'Hide Details' : 'Show All Tracks'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTracksExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Compact tracks pills grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
              {[
                { track: 'Backend', count: '1 Cand • 1 Job', dot: 'bg-emerald-500' },
                { track: 'Frontend', count: '1 Cand • 1 Job', dot: 'bg-blue-500' },
                { track: 'Full-Stack', count: '1 Cand • 1 Job', dot: 'bg-purple-500' },
                { track: 'DevOps & Cloud', count: '1 Cand • 1 Job', dot: 'bg-amber-500' },
                { track: 'AI / ML', count: '1 Cand • 1 Job', dot: 'bg-rose-500' },
                { track: 'Mobile Dev', count: '1 Job Listing', dot: 'bg-indigo-500' },
                { track: 'Embedded Systems', count: 'Open Domain', dot: 'bg-slate-400' },
                { track: 'Data Engineering', count: 'Open Domain', dot: 'bg-teal-500' },
                { track: 'Cybersecurity', count: 'Open Domain', dot: 'bg-cyan-500' },
                { track: 'Software Eng.', count: 'Core Track', dot: 'bg-stone-400' },
              ]
                .slice(0, isTracksExpanded ? 10 : 5)
                .map((t) => (
                  <div
                    key={t.track}
                    className="px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] flex items-center justify-between hover:bg-[#FAF9F6]/80 transition-colors"
                  >
                    <div className="min-w-0 pr-1">
                      <p className="text-xs font-bold text-[#0B0F19] truncate">{t.track}</p>
                      <p className="text-[10px] text-[#0B0F19]/45 truncate">{t.count}</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${t.dot} shrink-0`} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         TAB: CONSULTATIONS & MENTOR SESSIONS
         ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'consultations' && (
        <div className="space-y-6 animate-[fade-in_0.2s_ease]">
          {/* Header & Controls Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B0F19]/[0.06] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-[11px] font-bold">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    Dedicated Consultation & Mentorship Desk
                  </span>
                  <span className="text-[11px] text-[#0B0F19]/40 font-mono">
                    {metrics.totalConsultations} Total Sessions
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-[#0B0F19]">
                  Mentor Consultations & Booking Requests
                </h2>
                <p className="text-xs text-[#0B0F19]/50 max-w-2xl">
                  Supervise 1-on-1 career guidance bookings, mentor session allocations, agenda focus topics, and telemetry feedback ratings in isolation.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenScheduleModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B0F19] text-white text-xs font-bold hover:bg-[#1A2433] transition-all shadow-xs cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-[#6E8F75]" />
                <span>Schedule Consultation</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B0F19]/45">
                  Total Bookings
                </span>
                <div className="text-xl font-extrabold text-[#0B0F19] mt-0.5">
                  {metrics.totalConsultations}
                </div>
                <p className="text-[10px] text-[#0B0F19]/40 mt-0.5">All registered sessions</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B0F19]/45">
                  Upcoming & Active
                </span>
                <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
                  {metrics.upcomingConsultations}
                </div>
                <p className="text-[10px] text-[#0B0F19]/40 mt-0.5">Scheduled / In-progress</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B0F19]/45">
                  Completed Guidance
                </span>
                <div className="text-xl font-extrabold text-blue-700 mt-0.5">
                  {metrics.completedConsultations}
                </div>
                <p className="text-[10px] text-[#0B0F19]/40 mt-0.5">Verified mentor feedback</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B0F19]/45">
                  Mentor Satisfaction
                </span>
                <div className="text-xl font-extrabold text-amber-700 mt-0.5 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{metrics.avgMentorRating}</span>
                  <span className="text-xs text-[#0B0F19]/40 font-normal">/ 5.0</span>
                </div>
                <p className="text-[10px] text-[#0B0F19]/40 mt-0.5">Candidate survey ratings</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="pt-2 border-t border-[#0B0F19]/[0.06] flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0B0F19]/40" />
                <input
                  type="text"
                  value={consultationSearch}
                  onChange={(e) => setConsultationSearch(e.target.value)}
                  placeholder="Search by student, mentor, topic, notes..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Track Filter */}
                <select
                  value={consultationTrackFilter}
                  onChange={(e) => setConsultationTrackFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19] focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all cursor-pointer"
                >
                  <option value="ALL">All Software Tracks</option>
                  <option value="BACKEND">Backend</option>
                  <option value="FRONTEND">Frontend</option>
                  <option value="FULLSTACK">Full-Stack</option>
                  <option value="DEVOPS">DevOps & Cloud</option>
                  <option value="AI_ML">AI & Machine Learning</option>
                  <option value="MOBILE">Mobile Development</option>
                </select>

                {/* Status Filter */}
                <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#0B0F19]/[0.06]">
                  {(['ALL', 'SCHEDULED', 'PENDING_APPROVAL', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setConsultationStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        consultationStatusFilter === st
                          ? 'bg-white text-[#0B0F19] shadow-2xs'
                          : 'text-[#0B0F19]/50 hover:text-[#0B0F19]'
                      }`}
                    >
                      {st === 'ALL'
                        ? 'All'
                        : st === 'PENDING_APPROVAL'
                        ? 'Pending'
                        : st.charAt(0) + st.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Consultations Table */}
          <div className="bg-white rounded-3xl border border-[#0B0F19]/[0.06] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0B0F19]">
                <thead className="bg-[#FAF9F6] border-b border-[#0B0F19]/[0.06] text-[11px] uppercase tracking-wider text-[#0B0F19]/50 font-bold">
                  <tr>
                    <th className="py-3.5 px-5">Candidate / Student</th>
                    <th className="py-3.5 px-4">Assigned Mentor & Org</th>
                    <th className="py-3.5 px-4">Topic & Objectives</th>
                    <th className="py-3.5 px-4">Schedule & Duration</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B0F19]/[0.04]">
                  {filteredConsultations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs text-[#0B0F19]/40">
                        <CalendarCheck className="w-8 h-8 mx-auto text-[#0B0F19]/20 mb-2" />
                        No consultation sessions match your active filters.
                      </td>
                    </tr>
                  ) : (
                    filteredConsultations.map((c) => {
                      const dateObj = new Date(c.scheduledAt);
                      const formattedDate = dateObj.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                      const formattedTime = dateObj.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <tr key={c.id} className="hover:bg-[#FAF9F6]/50 transition-colors">
                          {/* Student */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-student-500/10 text-student-700 flex items-center justify-center font-extrabold text-xs shrink-0">
                                {c.studentName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-[#0B0F19] truncate">{c.studentName}</p>
                                <p className="text-[11px] text-[#0B0F19]/45 truncate">{c.studentEmail}</p>
                                <span className="inline-block mt-0.5 text-[10px] font-bold text-student-700 bg-student-50 px-1.5 py-0.5 rounded">
                                  {c.studentTrack}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Mentor */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5 min-w-0">
                              <p className="font-bold text-[#0B0F19] truncate">{c.mentorName}</p>
                              <p className="text-[11px] text-[#0B0F19]/55 truncate">{c.mentorTitle}</p>
                              <span className="inline-block text-[10px] font-medium text-[#6E8F75] bg-[#6E8F75]/10 px-1.5 py-0.5 rounded">
                                {c.mentorCompany}
                              </span>
                            </div>
                          </td>

                          {/* Topic */}
                          <td className="py-4 px-4 max-w-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                  {c.topic.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <p className="font-semibold text-[#0B0F19] truncate">{c.topicTitle}</p>
                              {c.notes && (
                                <p className="text-[11px] text-[#0B0F19]/50 line-clamp-1 italic">
                                  "{c.notes}"
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Schedule */}
                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 font-bold text-[#0B0F19]">
                                <Clock className="w-3.5 h-3.5 text-[#6E8F75]" />
                                <span>{formattedDate}</span>
                              </div>
                              <p className="text-[11px] text-[#0B0F19]/50">
                                {formattedTime} ({c.durationMinutes} min)
                              </p>
                              {c.meetingLink && (
                                <a
                                  href={c.meetingLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6E8F75] hover:underline mt-0.5"
                                >
                                  <Video className="w-3 h-3" />
                                  <span>Join Video Room</span>
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4">
                            <div>
                              {c.status === 'SCHEDULED' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Scheduled
                                </span>
                              )}
                              {c.status === 'PENDING_APPROVAL' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock className="w-3 h-3" />
                                  Pending Approval
                                </span>
                              )}
                              {c.status === 'IN_PROGRESS' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 animate-pulse">
                                  <Activity className="w-3 h-3" />
                                  In Progress
                                </span>
                              )}
                              {c.status === 'COMPLETED' && (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                    <CheckSquare className="w-3 h-3" />
                                    Completed
                                  </span>
                                  {c.rating && (
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                      <span>{c.rating}.0 Rating</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {c.status === 'CANCELLED' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                                  <X className="w-3 h-3" />
                                  Cancelled
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewingConsultation(c)}
                                title="View Session Details & Notes"
                                className="p-1.5 rounded-lg bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-[#0B0F19]/70 hover:text-[#0B0F19] hover:bg-stone-100 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {c.status === 'PENDING_APPROVAL' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateConsultationStatus(c.id, c.studentName, 'SCHEDULED')}
                                  title="Approve Booking Request"
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  Approve
                                </button>
                              )}

                              {c.status === 'SCHEDULED' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateConsultationStatus(c.id, c.studentName, 'COMPLETED')}
                                  title="Mark Session Completed"
                                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  Complete
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleOpenEditConsultation(c)}
                                title="Edit Session"
                                className="p-1.5 rounded-lg bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-[#0B0F19]/70 hover:text-[#0B0F19] hover:bg-stone-100 transition-colors cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteConsultation(c.id, c.topicTitle)}
                                title="Delete Consultation"
                                className="p-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         TAB: ASSESSMENTS & CODING CHALLENGES
         ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'assessments' && (
        <div className="space-y-6 animate-[fade-in_0.2s_ease]">
          {/* Header & Controls Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B0F19]/[0.06] shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-[11px] font-bold">
                    <Code2 className="w-3.5 h-3.5" />
                    Assessment & Evaluation Engine
                  </span>
                  <span className="text-[11px] text-[#0B0F19]/40 font-mono">{metrics.totalAssessments} Total Challenges</span>
                </div>
                <h2 className="text-xl font-extrabold text-[#0B0F19]">Technical Assessment Management</h2>
                <p className="text-xs text-[#0B0F19]/50 max-w-2xl">
                  Author coding challenges, define automated evaluation test cases, calibrate scoring rubrics, and configure technical track benchmarks.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="px-4 py-2.5 rounded-xl bg-[#6E8F75] hover:bg-[#5d7d64] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Author Assessment</span>
              </button>
            </div>

            {/* Filter Controls Strip */}
            <div className="pt-2 border-t border-[#0B0F19]/[0.06] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-[#0B0F19]/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by challenge title, description, or tags..."
                  value={assessmentSearch}
                  onChange={(e) => setAssessmentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] placeholder:text-[#0B0F19]/30 focus:outline-none focus:border-[#6E8F75]"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Track Selector */}
                <select
                  value={assessmentTrackFilter}
                  onChange={(e) => setAssessmentTrackFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19] focus:outline-none focus:border-[#6E8F75] cursor-pointer"
                >
                  <option value="ALL">All Technical Tracks</option>
                  <option value="BACKEND">Backend</option>
                  <option value="FRONTEND">Frontend</option>
                  <option value="FULLSTACK">Full-Stack</option>
                  <option value="AI_ML">AI / ML</option>
                  <option value="DEVOPS">DevOps & Cloud</option>
                  <option value="MOBILE">Mobile</option>
                  <option value="DATA_ENGINEERING">Data Engineering</option>
                  <option value="CYBERSECURITY">Cybersecurity</option>
                  <option value="SOFTWARE_ENGINEERING">Core Software Eng.</option>
                </select>

                {/* Difficulty Selector */}
                <select
                  value={assessmentDifficultyFilter}
                  onChange={(e) => setAssessmentDifficultyFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19] focus:outline-none focus:border-[#6E8F75] cursor-pointer"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>

                {/* Status Filter */}
                <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#0B0F19]/[0.08]">
                  {(['ALL', 'ACTIVE', 'DRAFT'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAssessmentStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        assessmentStatusFilter === st
                          ? 'bg-[#0B0F19] text-white shadow-2xs'
                          : 'text-[#0B0F19]/60 hover:text-[#0B0F19]'
                      }`}
                    >
                      {st === 'ALL' ? 'All' : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Cards Grid */}
          {filteredAssessments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#0B0F19]/[0.06] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center mx-auto">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B0F19]">No technical assessments found</h3>
              <p className="text-xs text-[#0B0F19]/50 max-w-sm mx-auto">
                Try adjusting your search criteria or create a new assessment using the authoring button above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAssessments.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B0F19]/[0.06] shadow-xs hover:border-[#6E8F75]/30 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Track Pill, Difficulty, Status */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75]">
                          {a.softwareTrack.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            a.difficulty === 'BEGINNER'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : a.difficulty === 'INTERMEDIATE'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {a.difficulty}
                        </span>
                        <span className="text-[10px] font-mono text-[#0B0F19]/40 bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#0B0F19]/[0.06]">
                          {a.language}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          a.status === 'ACTIVE'
                            ? 'bg-emerald-100/70 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-extrabold text-[#0B0F19] tracking-tight">{a.title}</h3>
                      <p className="text-xs text-[#0B0F19]/60 line-clamp-2 mt-1 leading-relaxed">{a.description}</p>
                    </div>

                    {/* Meta Specifications */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
                        <span className="text-[10px] font-bold text-[#0B0F19]/40 uppercase">Time Limit</span>
                        <div className="text-xs font-extrabold text-[#0B0F19] mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#6E8F75]" />
                          <span>{a.timeLimitMinutes} mins</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
                        <span className="text-[10px] font-bold text-[#0B0F19]/40 uppercase">Pass Threshold</span>
                        <div className="text-xs font-extrabold text-[#0B0F19] mt-0.5 flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-500" />
                          <span>{a.passingScore}% Pass</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04]">
                        <span className="text-[10px] font-bold text-[#0B0F19]/40 uppercase">Automated Tests</span>
                        <div className="text-xs font-extrabold text-[#0B0F19] mt-0.5 flex items-center gap-1">
                          <CheckSquare className="w-3 h-3 text-blue-500" />
                          <span>{a.testCases.length} Cases</span>
                        </div>
                      </div>
                    </div>

                    {/* Rubric Dimensions Pills */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-[#0B0F19]/45 uppercase">Evaluation Rubric</span>
                      <div className="flex flex-wrap gap-1.5">
                        {a.rubric.map((r) => (
                          <span
                            key={r.id}
                            className="text-[11px] font-medium bg-[#FAF9F6] text-[#0B0F19]/70 px-2 py-0.5 rounded-md border border-[#0B0F19]/[0.06]"
                          >
                            {r.dimensionName} ({r.weight}%)
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    {a.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {a.tags.map((t) => (
                          <span key={t} className="text-[10px] font-mono text-[#0B0F19]/40">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Telemetry Stats & Action Buttons */}
                  <div className="pt-3 border-t border-[#0B0F19]/[0.06] flex items-center justify-between gap-2">
                    <div className="text-[11px] text-[#0B0F19]/50">
                      <span className="font-bold text-[#0B0F19]">{a.totalSubmissions}</span> Submissions •{' '}
                      <span className="font-bold text-[#6E8F75]">{a.avgScore}%</span> Avg Score
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewAssessment(a)}
                        title="Preview Problem Statement & Code"
                        className="p-2 rounded-xl bg-[#FAF9F6] hover:bg-[#6E8F75]/10 text-[#0B0F19]/70 hover:text-[#6E8F75] border border-[#0B0F19]/[0.08] transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(a)}
                        title="Edit Assessment"
                        className="p-2 rounded-xl bg-[#FAF9F6] hover:bg-blue-50 text-[#0B0F19]/70 hover:text-blue-600 border border-[#0B0F19]/[0.08] transition-all cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleAssessmentStatus(a.id, a.title)}
                        title={a.status === 'ACTIVE' ? 'Set to Draft' : 'Activate Assessment'}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          a.status === 'ACTIVE'
                            ? 'bg-[#FAF9F6] hover:bg-amber-50 text-[#0B0F19]/70 hover:text-amber-600 border-[#0B0F19]/[0.08]'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAssessment(a.id, a.title)}
                        title="Delete Assessment"
                        className="p-2 rounded-xl bg-[#FAF9F6] hover:bg-rose-50 text-[#0B0F19]/70 hover:text-rose-600 border border-[#0B0F19]/[0.08] transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         TAB 2: USER MANAGEMENT
         ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-[fade-in_0.2s_ease]">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B0F19]/[0.06] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#0B0F19]/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates by name, email, or university..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] placeholder:text-[#0B0F19]/30 focus:outline-none focus:border-[#6E8F75]"
              />
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['ALL', 'GRADUATE', 'STUDENT', 'EMPLOYER', 'ADMIN'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    userRoleFilter === role
                      ? 'bg-[#0B0F19] text-white shadow-xs'
                      : 'bg-[#FAF9F6] text-[#0B0F19]/60 hover:bg-[#FAF9F6]/80 hover:text-[#0B0F19]'
                  }`}
                >
                  {role === 'ALL' ? 'All Users' : role}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-[#0B0F19]/[0.06] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#0B0F19]/[0.06] text-[#0B0F19]/50 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">User & Profile</th>
                    <th className="py-4 px-6">Role / Domain</th>
                    <th className="py-4 px-6">Affiliation / Org</th>
                    <th className="py-4 px-6">Verification</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B0F19]/[0.04]">
                  {filteredUsers.map((user) => {
                    const displayName =
                      user.studentProfile?.fullName || user.companyProfile?.companyName || user.email.split('@')[0];
                    const affiliation =
                      user.studentProfile?.university || user.companyProfile?.industry || 'Platform Internal';
                    const domain = user.studentProfile?.softwareTrack || user.companyProfile?.workModel || 'Admin';

                    return (
                      <tr key={user.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                        {/* Name / Email */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] font-bold flex items-center justify-center text-xs shrink-0">
                              {displayName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#0B0F19] truncate">{displayName}</p>
                              <p className="text-[11px] text-[#0B0F19]/45 truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                              user.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-700'
                                : user.role === 'EMPLOYER'
                                ? 'bg-amber-100 text-amber-700'
                                : user.role === 'GRADUATE'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-student-500/10 text-student-500'
                            }`}
                          >
                            {user.role} • {domain}
                          </span>
                        </td>

                        {/* Affiliation */}
                        <td className="py-4 px-6 text-[#0B0F19]/70 max-w-xs truncate">
                          {affiliation}
                        </td>

                        {/* Verification */}
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggleUserVerified(user.id, displayName)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                              user.isVerified
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                          >
                            {user.isVerified ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Verified</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                <span>Pending</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggleUserActive(user.id, displayName)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                              user.isActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{user.isActive ? 'Active' : 'Suspended'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right space-x-2">
                          {user.studentProfile && (
                            <Link
                              to={`/candidates/profiles?candidate=${encodeURIComponent(user.studentProfile.fullName)}`}
                              title="View Full Live Dossier"
                              className="p-1.5 rounded-lg text-[#0B0F19]/40 hover:text-[#6E8F75] hover:bg-[#6E8F75]/10 inline-flex transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}

                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteUser(user.id, displayName)}
                              title="Delete User Record"
                              className="p-1.5 rounded-lg text-[#0B0F19]/40 hover:text-rose-600 hover:bg-rose-50 inline-flex transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         TAB 3: JOB LISTINGS MANAGEMENT
         ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'jobs' && (
        <div className="space-y-6 animate-[fade-in_0.2s_ease]">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B0F19]/[0.06] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#0B0F19]/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job listings by title, company, or skills..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] placeholder:text-[#0B0F19]/30 focus:outline-none focus:border-[#6E8F75]"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(['ALL', 'ACTIVE', 'PAUSED', 'DRAFT', 'CLOSED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setJobStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    jobStatusFilter === status
                      ? 'bg-[#0B0F19] text-white shadow-xs'
                      : 'bg-[#FAF9F6] text-[#0B0F19]/60 hover:bg-[#FAF9F6]/80 hover:text-[#0B0F19]'
                  }`}
                >
                  {status === 'ALL' ? 'All Statuses' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-xs space-y-4 hover:border-[#6E8F75]/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E8F75] bg-[#6E8F75]/10 px-2.5 py-0.5 rounded-full">
                      {job.softwareTrack} • {job.seniorityLevel}
                    </span>
                    <h3 className="text-base font-bold text-[#0B0F19] mt-2">{job.title}</h3>
                    <p className="text-xs font-semibold text-[#0B0F19]/60">{job.companyName} • {job.location}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 ${
                      job.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : job.status === 'PAUSED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="text-xs text-[#0B0F19]/60 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-[11px] font-semibold text-[#0B0F19]/70">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Metrics & Actions */}
                <div className="pt-4 border-t border-[#0B0F19]/[0.04] flex items-center justify-between">
                  <div className="text-xs text-[#0B0F19]/50">
                    <span className="font-bold text-[#0B0F19]">{job.applicantsCount} Applicants</span> • Min Score: {job.minimumMatchScore}%
                  </div>

                  <div className="flex items-center gap-1.5">
                    {job.status !== 'ACTIVE' && (
                      <button
                        onClick={() => handleUpdateJobStatus(job.id, job.title, 'ACTIVE')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Activate
                      </button>
                    )}
                    {job.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleUpdateJobStatus(job.id, job.title, 'PAUSED')}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Pause
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      className="p-1.5 rounded-lg text-[#0B0F19]/30 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         TAB 4: COMPANY & CR VERIFICATION
         ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'employers' && (
        <div className="space-y-6 animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-xs space-y-2">
            <h3 className="text-base font-bold text-[#0B0F19]">Commercial Registration (CR) Verification Desk</h3>
            <p className="text-xs text-[#0B0F19]/50">
              Validate registered Saudi business entities against official commercial registration records to grant verified employer badges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {users
              .filter((u) => u.role === 'EMPLOYER' && u.companyProfile)
              .map((emp) => {
                const cmp = emp.companyProfile!;
                return (
                  <div
                    key={emp.id}
                    className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#6E8F75]/10 text-[#6E8F75] flex items-center justify-center font-bold text-base">
                          {cmp.companyInitials}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            cmp.isCRVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {cmp.isCRVerified ? 'CR Verified' : 'CR Pending'}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-[#0B0F19]">{cmp.companyName}</h4>
                        <p className="text-xs text-[#0B0F19]/50">{cmp.industry}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] space-y-1 text-xs">
                        <div className="flex justify-between text-[#0B0F19]/50">
                          <span>CR Number:</span>
                          <span className="font-mono font-bold text-[#0B0F19]">{cmp.commercialRegistrationNumber}</span>
                        </div>
                        <div className="flex justify-between text-[#0B0F19]/50">
                          <span>Location:</span>
                          <span className="text-[#0B0F19] font-medium">{cmp.location}</span>
                        </div>
                        <div className="flex justify-between text-[#0B0F19]/50">
                          <span>Contact:</span>
                          <span className="text-[#0B0F19] font-medium">{cmp.contactName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#0B0F19]/[0.04]">
                      {cmp.isCRVerified ? (
                        <button
                          onClick={() => handleVerifyEmployerCR(emp.id, cmp.companyName, false)}
                          className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Revoke CR Verification
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifyEmployerCR(emp.id, cmp.companyName, true)}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Verify CR</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         TAB 5: APPLICATIONS & TELEMETRY
         ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'applications' && (
        <div className="space-y-6 animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.06] shadow-xs space-y-2">
            <h3 className="text-base font-bold text-[#0B0F19]">Candidate Applications & AI Telemetry Dossiers</h3>
            <p className="text-xs text-[#0B0F19]/50">
              Inspect candidate evaluations across AI assessments, project workspaces, and 1-to-1 calibration interviews.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#0B0F19]/[0.06] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#0B0F19]/[0.06] text-[#0B0F19]/50 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Candidate</th>
                    <th className="py-4 px-6">Target Role & Company</th>
                    <th className="py-4 px-6">Match Score</th>
                    <th className="py-4 px-6">AI Assessment</th>
                    <th className="py-4 px-6">Project Score</th>
                    <th className="py-4 px-6">Stage Status</th>
                    <th className="py-4 px-6 text-right">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B0F19]/[0.04]">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-[#0B0F19]">{app.candidateName}</p>
                        <p className="text-[11px] text-[#0B0F19]/45">{app.candidateTrack}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-[#0B0F19]">{app.jobTitle}</p>
                        <p className="text-[11px] text-[#0B0F19]/45">{app.companyName}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          {app.matchScore}%
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[#0B0F19]/70">
                        {app.aiInterviewScore ? `${app.aiInterviewScore}%` : '—'}
                      </td>
                      <td className="py-4 px-6 font-mono text-[#0B0F19]/70">
                        {app.projectScore ? `${app.projectScore}%` : '—'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-student-500/10 text-student-500">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/candidates/profiles?candidate=${encodeURIComponent(app.candidateName)}`}
                          className="px-3 py-1.5 rounded-xl bg-[#6E8F75]/10 hover:bg-[#6E8F75]/20 text-[#6E8F75] text-xs font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Review</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         TAB 6: PRISMA DATABASE & SCHEMA MODELS
         ═════════════════════════════════════════════════════════════════ */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B0F19]/[0.06] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0B0F19]">Prisma Database Models & Schema Contract</h3>
                <p className="text-xs text-[#0B0F19]/50">
                  Relational data models established in <code className="font-mono text-[#6E8F75]">prisma/schema.prisma</code> and compiled with Prisma Client v6.19.3.
                </p>
              </div>
              <button
                onClick={handleResetSeed}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Seed Dataset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {[
                { name: 'users', desc: 'Unified auth for all roles', count: `${users.length} records` },
                { name: 'student_profiles', desc: 'Candidate CVs, tracks, GitHub', count: `${users.filter((u) => u.studentProfile).length} records` },
                { name: 'company_profiles', desc: 'Employer CR numbers & sizes', count: `${users.filter((u) => u.companyProfile).length} records` },
                { name: 'consultation_sessions', desc: '1-on-1 mentor guidance & bookings', count: `${consultations.length} records` },
                { name: 'job_listings', desc: 'Active & draft software roles', count: `${jobs.length} records` },
                { name: 'assessments', desc: 'Authoring & coding challenges', count: `${assessments.length} records` },
                { name: 'assessment_test_cases', desc: 'Automated test suite runners', count: `${assessments.reduce((acc, a) => acc + a.testCases.length, 0)} test cases` },
                { name: 'applications', desc: 'Candidate-job matches & status', count: `${applications.length} records` },
                { name: 'telemetry_snapshots', desc: 'Granular AI/Human scores', count: '60 dimensions' },
              ].map((m) => (
                <div key={m.name} className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0B0F19]">{m.name}</span>
                    <span className="text-[10px] font-bold text-[#6E8F75] bg-[#6E8F75]/10 px-2 py-0.5 rounded-full">{m.count}</span>
                  </div>
                  <p className="text-[11px] text-[#0B0F19]/50">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         MODAL 1: ASSESSMENT AUTHORING & RUBRIC BUILDER
         ═════════════════════════════════════════════════════════════════ */}
      {isAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fade-in_0.15s_ease-out]">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-[#0B0F19]/10 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#0B0F19]/[0.08] flex items-center justify-between bg-[#FAF9F6]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-[11px] font-bold">
                    <Code2 className="w-3.5 h-3.5" />
                    {editingAssessmentId ? 'Edit Technical Assessment' : 'Author New Assessment'}
                  </span>
                  {editingAssessmentId && <span className="text-[11px] font-mono text-[#0B0F19]/40">{editingAssessmentId}</span>}
                </div>
                <h3 className="text-lg font-extrabold text-[#0B0F19] mt-1">
                  {editingAssessmentId ? formTitle || 'Edit Assessment' : 'Create Coding Task & Telemetry Rubric'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsAssessmentModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white border border-[#0B0F19]/[0.08] text-[#0B0F19]/60 hover:text-[#0B0F19] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#0B0F19]/[0.06] bg-white overflow-x-auto">
              {[
                { id: 'metadata', label: '1. Metadata & Domain', icon: Sliders },
                { id: 'problem', label: '2. Problem & Starter Code', icon: FileCode2 },
                { id: 'testCases', label: `3. Test Cases (${formTestCases.length})`, icon: CheckSquare },
                { id: 'rubric', label: `4. Evaluation Rubric (${formRubric.length})`, icon: Award },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setModalTab(t.id as any)}
                    className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      modalTab === t.id
                        ? 'border-[#6E8F75] text-[#6E8F75]'
                        : 'border-transparent text-[#0B0F19]/50 hover:text-[#0B0F19]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveAssessment} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: METADATA */}
              {modalTab === 'metadata' && (
                <div className="space-y-4 animate-[fade-in_0.15s_ease]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-[#0B0F19]">Assessment Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Concurrent Sliding-Window Rate Limiter"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] focus:outline-none focus:border-[#6E8F75]"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-[#0B0F19]">Short Summary / Description</label>
                      <textarea
                        rows={2}
                        placeholder="Concise overview of what this challenge evaluates..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] focus:outline-none focus:border-[#6E8F75]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#0B0F19]">Technical Track *</label>
                      <select
                        value={formTrack}
                        onChange={(e) => setFormTrack(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19] focus:outline-none focus:border-[#6E8F75]"
                      >
                        <option value="BACKEND">Backend Engineering</option>
                        <option value="FRONTEND">Frontend Engineering</option>
                        <option value="FULLSTACK">Full-Stack</option>
                        <option value="AI_ML">AI / ML</option>
                        <option value="DEVOPS">DevOps & Cloud</option>
                        <option value="MOBILE">Mobile Development</option>
                        <option value="DATA_ENGINEERING">Data Engineering</option>
                        <option value="CYBERSECURITY">Cybersecurity</option>
                        <option value="EMBEDDED_SYSTEMS">Embedded Systems</option>
                        <option value="SOFTWARE_ENGINEERING">Core Software Engineering</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#0B0F19]">Assessment Type</label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19] focus:outline-none focus:border-[#6E8F75]"
                      >
                        <option value="CODING_CHALLENGE">Algorithmic Coding Task</option>
                        <option value="SYSTEM_DESIGN">System Architecture Challenge</option>
                        <option value="CODE_REVIEW">Code Review & Security Refactor</option>
                        <option value="TECHNICAL_QUIZ">Technical Calibration Quiz</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#0B0F19]">Difficulty Level</label>
                      <select
                        value={formDifficulty}
                        onChange={(e) => setFormDifficulty(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19] focus:outline-none focus:border-[#6E8F75]"
                      >
                        <option value="BEGINNER">Beginner (Foundational)</option>
                        <option value="INTERMEDIATE">Intermediate (Production Practice)</option>
                        <option value="ADVANCED">Advanced (High-Concurrency / Scale)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#0B0F19]">Status</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19] focus:outline-none focus:border-[#6E8F75]"
                      >
                        <option value="ACTIVE">Active (Available to Candidates)</option>
                        <option value="DRAFT">Draft (Internal Only)</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#0B0F19]">Time Limit (Minutes)</label>
                      <input
                        type="number"
                        min={10}
                        max={180}
                        value={formTimeLimit}
                        onChange={(e) => setFormTimeLimit(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] focus:outline-none focus:border-[#6E8F75]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#0B0F19]">Passing Score Threshold (%)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={formPassingScore}
                        onChange={(e) => setFormPassingScore(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] focus:outline-none focus:border-[#6E8F75]"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-[#0B0F19]">Domain Tags (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="Algorithms, Concurrency, TypeScript, Performance"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19] focus:outline-none focus:border-[#6E8F75]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROBLEM STATEMENT & STARTER CODE */}
              {modalTab === 'problem' && (
                <div className="space-y-4 animate-[fade-in_0.15s_ease]">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#0B0F19]">Problem Statement & Instructions (Markdown Supported)</label>
                      <span className="text-[10px] text-[#0B0F19]/40 font-mono">Markdown formatting</span>
                    </div>
                    <textarea
                      rows={8}
                      placeholder="### Problem Description&#10;&#10;Explain the functional requirements, API signatures, edge cases, and constraints..."
                      value={formProblemStatement}
                      onChange={(e) => setFormProblemStatement(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-mono text-[#0B0F19] focus:outline-none focus:border-[#6E8F75]"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#0B0F19]">Starter Code Boilerplate</label>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#0B0F19]/40 font-bold">Language:</span>
                        <select
                          value={formLanguage}
                          onChange={(e) => setFormLanguage(e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19]"
                        >
                          <option value="TypeScript">TypeScript</option>
                          <option value="JavaScript">JavaScript</option>
                          <option value="Python">Python</option>
                          <option value="Go">Go</option>
                          <option value="Rust">Rust</option>
                          <option value="Java">Java</option>
                          <option value="C++">C++</option>
                        </select>
                      </div>
                    </div>
                    <textarea
                      rows={8}
                      placeholder="// Starter function definition & types"
                      value={formStarterCode}
                      onChange={(e) => setFormStarterCode(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#0B0F19] text-emerald-300 font-mono text-xs focus:outline-none border border-white/10"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: AUTOMATED TEST CASES */}
              {modalTab === 'testCases' && (
                <div className="space-y-4 animate-[fade-in_0.15s_ease]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-[#0B0F19] uppercase tracking-wider">
                        Automated Test Cases ({formTestCases.length})
                      </h4>
                      <p className="text-[11px] text-[#0B0F19]/50">
                        Define public visible test cases and hidden anti-cheat verification inputs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTestCase}
                      className="px-3 py-1.5 rounded-xl bg-[#6E8F75]/10 hover:bg-[#6E8F75]/20 text-[#6E8F75] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Test Case</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formTestCases.map((tc, idx) => (
                      <div
                        key={tc.id}
                        className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#0B0F19] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-[#0B0F19]">Test Case #{idx + 1}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 text-xs text-[#0B0F19]/70 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tc.isHidden}
                                onChange={(e) => handleUpdateTestCase(tc.id, 'isHidden', e.target.checked)}
                                className="rounded text-[#6E8F75] focus:ring-0 cursor-pointer"
                              />
                              <span className="text-[11px] font-semibold">Hidden Test Case</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => handleRemoveTestCase(tc.id)}
                              className="text-rose-500 hover:text-rose-700 p-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#0B0F19]/50 uppercase">Input Expression / JSON</label>
                            <input
                              type="text"
                              value={tc.input}
                              onChange={(e) => handleUpdateTestCase(tc.id, 'input', e.target.value)}
                              placeholder='e.g. allowRequest("tenant-1", 1000)'
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#0B0F19]/[0.08] font-mono text-xs text-[#0B0F19]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#0B0F19]/50 uppercase">Expected Output</label>
                            <input
                              type="text"
                              value={tc.expectedOutput}
                              onChange={(e) => handleUpdateTestCase(tc.id, 'expectedOutput', e.target.value)}
                              placeholder="e.g. { allowed: true }"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#0B0F19]/[0.08] font-mono text-xs text-[#0B0F19]"
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-[#0B0F19]/50 uppercase">Explanation / Test Objective</label>
                            <input
                              type="text"
                              value={tc.explanation || ''}
                              onChange={(e) => handleUpdateTestCase(tc.id, 'explanation', e.target.value)}
                              placeholder="e.g. Verifies nominal request under threshold without latency penalty."
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: EVALUATION RUBRIC & TELEMETRY */}
              {modalTab === 'rubric' && (
                <div className="space-y-4 animate-[fade-in_0.15s_ease]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-[#0B0F19] uppercase tracking-wider">
                          Grading Rubrics & AI Telemetry Dimensions
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            formRubric.reduce((sum, r) => sum + (Number(r.weight) || 0), 0) === 100
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Total Weight: {formRubric.reduce((sum, r) => sum + (Number(r.weight) || 0), 0)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#0B0F19]/50">
                        Weights must total 100% to calibrate candidate scoring matrices.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddRubricDimension}
                      className="px-3 py-1.5 rounded-xl bg-[#6E8F75]/10 hover:bg-[#6E8F75]/20 text-[#6E8F75] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Dimension</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formRubric.map((rb, idx) => (
                      <div
                        key={rb.id}
                        className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0B0F19]">Dimension #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRubricDimension(rb.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] font-bold text-[#0B0F19]/50 uppercase">Dimension Name</label>
                            <input
                              type="text"
                              value={rb.dimensionName}
                              onChange={(e) => handleUpdateRubricDimension(rb.id, 'dimensionName', e.target.value)}
                              placeholder="e.g. Algorithmic Correctness"
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#0B0F19]/50 uppercase">Weight (%)</label>
                            <input
                              type="number"
                              min={5}
                              max={100}
                              value={rb.weight}
                              onChange={(e) => handleUpdateRubricDimension(rb.id, 'weight', Number(e.target.value))}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#0B0F19]/[0.08] text-xs font-mono font-bold text-[#0B0F19]"
                            />
                          </div>

                          <div className="sm:col-span-4 space-y-1">
                            <label className="text-[10px] font-bold text-[#0B0F19]/50 uppercase">Criteria & Evaluator Guidance</label>
                            <input
                              type="text"
                              value={rb.description}
                              onChange={(e) => handleUpdateRubricDimension(rb.id, 'description', e.target.value)}
                              placeholder="Specific evaluation benchmark for scoring algorithms and AI telemetry..."
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#0B0F19]/[0.08] text-xs text-[#0B0F19]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-[#0B0F19]/[0.08] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssessmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#FAF9F6]/80 text-[#0B0F19]/70 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#6E8F75] hover:bg-[#5d7d64] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    {editingAssessmentId ? 'Save Assessment Changes' : 'Publish & Sync to Database'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         MODAL 2: ASSESSMENT TEST RUNNER & RUBRIC PREVIEW
         ═════════════════════════════════════════════════════════════════ */}
      {previewAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fade-in_0.15s_ease-out]">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-[#0B0F19]/10 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
            {/* Header */}
            <div className="p-6 border-b border-[#0B0F19]/[0.08] flex items-center justify-between bg-[#FAF9F6]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75]">
                    {previewAssessment.softwareTrack.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    {previewAssessment.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-[#0B0F19]/40 bg-white px-2 py-0.5 rounded-md border border-[#0B0F19]/[0.06]">
                    {previewAssessment.language}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0B0F19]">{previewAssessment.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => setPreviewAssessment(null)}
                className="w-8 h-8 rounded-xl bg-white border border-[#0B0F19]/[0.08] text-[#0B0F19]/60 hover:text-[#0B0F19] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Problem Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">Problem Statement</h4>
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] text-xs text-[#0B0F19] whitespace-pre-wrap font-sans leading-relaxed">
                  {previewAssessment.problemStatement}
                </div>
              </div>

              {/* Starter Code Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">
                    Starter Code Boilerplate ({previewAssessment.language})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(previewAssessment.starterCode);
                      showToast('Starter code copied to clipboard');
                    }}
                    className="text-xs text-[#6E8F75] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-[#0B0F19] text-emerald-300 font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed">
                  <code>{previewAssessment.starterCode}</code>
                </pre>
              </div>

              {/* Test Cases */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">
                  Verification Test Suite ({previewAssessment.testCases.length} Cases)
                </h4>
                <div className="space-y-2">
                  {previewAssessment.testCases.map((tc, idx) => (
                    <div key={tc.id} className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0B0F19]">Test Case #{idx + 1}</span>
                        {tc.isHidden ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                            Hidden Anti-Cheat
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                            Public
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                        <div>
                          <span className="text-[#0B0F19]/40 block text-[10px]">INPUT:</span>
                          <span className="text-[#0B0F19] font-bold">{tc.input}</span>
                        </div>
                        <div>
                          <span className="text-[#0B0F19]/40 block text-[10px]">EXPECTED OUTPUT:</span>
                          <span className="text-emerald-700 font-bold">{tc.expectedOutput}</span>
                        </div>
                      </div>
                      {tc.explanation && (
                        <p className="text-[11px] text-[#0B0F19]/55 pt-0.5">{tc.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rubric Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">Evaluation Rubric Matrix</h4>
                <div className="border border-[#0B0F19]/[0.06] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F6] text-[#0B0F19]/60 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Evaluation Dimension</th>
                        <th className="py-2.5 px-4">Weight</th>
                        <th className="py-2.5 px-4">Rubric Benchmark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0B0F19]/[0.06]">
                      {previewAssessment.rubric.map((r) => (
                        <tr key={r.id}>
                          <td className="py-2.5 px-4 font-bold text-[#0B0F19]">{r.dimensionName}</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-[#6E8F75]">{r.weight}%</td>
                          <td className="py-2.5 px-4 text-[#0B0F19]/60 text-[11px]">{r.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#0B0F19]/[0.08] flex items-center justify-end gap-2 bg-[#FAF9F6]">
              <button
                type="button"
                onClick={() => setPreviewAssessment(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#0B0F19]/[0.08] text-[#0B0F19] text-xs font-bold cursor-pointer hover:bg-stone-50"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         MODAL 3: SCHEDULE / EDIT CONSULTATION SESSION
         ═════════════════════════════════════════════════════════════════ */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fade-in_0.15s_ease-out]">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-[#0B0F19]/10 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#0B0F19]/[0.08] flex items-center justify-between bg-[#FAF9F6]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-[11px] font-bold">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    {editingConsultationId ? 'Edit Consultation Session' : 'Schedule 1-on-1 Mentor Session'}
                  </span>
                  {editingConsultationId && (
                    <span className="text-[11px] font-mono text-[#0B0F19]/40">{editingConsultationId}</span>
                  )}
                </div>
                <h3 className="text-lg font-extrabold text-[#0B0F19] mt-1">
                  {editingConsultationId ? 'Update Booking & Guidance Details' : 'Book New Mentor Consultation'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white border border-[#0B0F19]/[0.08] text-[#0B0F19]/60 hover:text-[#0B0F19] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveConsultation} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Candidate Info Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#6E8F75]" />
                  <span>Candidate / Student Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formStudentName}
                      onChange={(e) => setFormStudentName(e.target.value)}
                      placeholder="e.g. Ahmad Al-Hassan"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formStudentEmail}
                      onChange={(e) => setFormStudentEmail(e.target.value)}
                      placeholder="ahmad@jadeer.io"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Technical Track</label>
                    <select
                      value={formStudentTrack}
                      onChange={(e) => setFormStudentTrack(e.target.value as SoftwareTrack)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                    >
                      <option value="BACKEND">Backend</option>
                      <option value="FRONTEND">Frontend</option>
                      <option value="FULLSTACK">Full-Stack</option>
                      <option value="DEVOPS">DevOps & Cloud</option>
                      <option value="AI_ML">AI / ML</option>
                      <option value="MOBILE">Mobile Dev</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mentor Info Section */}
              <div className="space-y-3 pt-3 border-t border-[#0B0F19]/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#6E8F75]" />
                  <span>Assigned Industry Mentor</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Mentor Name</label>
                    <input
                      type="text"
                      required
                      value={formMentorName}
                      onChange={(e) => setFormMentorName(e.target.value)}
                      placeholder="e.g. Tariq Al-Mansoor"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Professional Title</label>
                    <input
                      type="text"
                      required
                      value={formMentorTitle}
                      onChange={(e) => setFormMentorTitle(e.target.value)}
                      placeholder="Principal Architect"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Organization / Employer</label>
                    <input
                      type="text"
                      required
                      value={formMentorCompany}
                      onChange={(e) => setFormMentorCompany(e.target.value)}
                      placeholder="Elm / Tamara / STC"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Consultation Topic & Timing */}
              <div className="space-y-3 pt-3 border-t border-[#0B0F19]/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#6E8F75]" />
                  <span>Guidance Agenda & Timing</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Consultation Topic Area</label>
                    <select
                      value={formConsultationTopic}
                      onChange={(e) => setFormConsultationTopic(e.target.value as ConsultationTopic)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                    >
                      <option value="SYSTEM_DESIGN">System Design & Architecture</option>
                      <option value="CODE_REVIEW">Production Code Review & PR Critique</option>
                      <option value="MOCK_INTERVIEW">Live Mock Technical Interview</option>
                      <option value="CAREER_ROADMAP">Engineering Career Roadmap</option>
                      <option value="RESUME_CALIBRATION">Evidence CV & Portfolio Calibration</option>
                      <option value="PORTFOLIO_CRITIQUE">Capstone Project & Repo Walkthrough</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Session Title</label>
                    <input
                      type="text"
                      required
                      value={formTopicTitle}
                      onChange={(e) => setFormTopicTitle(e.target.value)}
                      placeholder="e.g. Distributed Ledgers & High TPS Architecture"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={formScheduledAt}
                      onChange={(e) => setFormScheduledAt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      min={15}
                      max={120}
                      step={15}
                      value={formDurationMinutes}
                      onChange={(e) => setFormDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Video Meeting Room URL</label>
                    <input
                      type="url"
                      value={formMeetingLink}
                      onChange={(e) => setFormMeetingLink(e.target.value)}
                      placeholder="https://meet.jadeer.io/room-id"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B0F19] mb-1">Status</label>
                    <select
                      value={formConsultationStatus}
                      onChange={(e) => setFormConsultationStatus(e.target.value as ConsultationStatus)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="PENDING_APPROVAL">Pending Approval</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B0F19] mb-1">Agenda & Prep Notes</label>
                  <textarea
                    rows={3}
                    value={formConsultationNotes}
                    onChange={(e) => setFormConsultationNotes(e.target.value)}
                    placeholder="Provide context, required prep readings, or candidate questions..."
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs focus:bg-white focus:border-[#6E8F75] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="pt-4 border-t border-[#0B0F19]/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#0B0F19]/[0.08] text-[#0B0F19] text-xs font-bold cursor-pointer hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0B0F19] text-white text-xs font-bold hover:bg-[#1A2433] transition-all shadow-xs cursor-pointer"
                >
                  {editingConsultationId ? 'Save Changes' : 'Confirm Consultation Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
         MODAL 4: VIEW CONSULTATION DETAILS & NOTES
         ═════════════════════════════════════════════════════════════════ */}
      {viewingConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fade-in_0.15s_ease-out]">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col border border-[#0B0F19]/10 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#0B0F19]/[0.08] flex items-center justify-between bg-[#FAF9F6]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6E8F75]/10 text-[#6E8F75] text-[11px] font-bold">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    Consultation Record
                  </span>
                  <span className="text-[11px] font-mono text-[#0B0F19]/40">{viewingConsultation.id}</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0B0F19] mt-1">{viewingConsultation.topicTitle}</h3>
              </div>

              <button
                type="button"
                onClick={() => setViewingConsultation(null)}
                className="w-8 h-8 rounded-xl bg-white border border-[#0B0F19]/[0.08] text-[#0B0F19]/60 hover:text-[#0B0F19] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-[#0B0F19]">
              {/* Timing & Room Link */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Clock className="w-4 h-4 text-[#6E8F75]" />
                    <span>
                      {new Date(viewingConsultation.scheduledAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      ({viewingConsultation.durationMinutes} min)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-[#0B0F19]/[0.08]">
                    {viewingConsultation.status}
                  </span>
                </div>
                {viewingConsultation.meetingLink && (
                  <a
                    href={viewingConsultation.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6E8F75] text-white font-bold hover:bg-[#5d7d64] transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Live Meeting Room</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Participant Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B0F19]/40">Candidate</span>
                  <p className="font-bold text-sm">{viewingConsultation.studentName}</p>
                  <p className="text-[11px] text-[#0B0F19]/50">{viewingConsultation.studentEmail}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-student-700 bg-student-50 px-2 py-0.5 rounded">
                    {viewingConsultation.studentTrack} Track
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B0F19]/40">Mentor</span>
                  <p className="font-bold text-sm">{viewingConsultation.mentorName}</p>
                  <p className="text-[11px] text-[#0B0F19]/50">{viewingConsultation.mentorTitle}</p>
                  <span className="inline-block mt-1 text-[10px] font-medium text-[#6E8F75] bg-[#6E8F75]/10 px-2 py-0.5 rounded">
                    {viewingConsultation.mentorCompany}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {viewingConsultation.notes && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">Agenda & Prep Notes</h4>
                  <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.04] text-[#0B0F19]/80 leading-relaxed whitespace-pre-wrap">
                    {viewingConsultation.notes}
                  </div>
                </div>
              )}

              {/* Completed Feedback & Rating */}
              {viewingConsultation.feedback && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50 flex items-center justify-between">
                    <span>Mentor Verification Feedback</span>
                    {viewingConsultation.rating && (
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {viewingConsultation.rating}.0 / 5.0
                      </span>
                    )}
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-[#0B0F19]/90 leading-relaxed italic">
                    "{viewingConsultation.feedback}"
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#0B0F19]/[0.08] flex items-center justify-end gap-2 bg-[#FAF9F6]">
              <button
                type="button"
                onClick={() => setViewingConsultation(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#0B0F19]/[0.08] text-[#0B0F19] text-xs font-bold cursor-pointer hover:bg-stone-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
