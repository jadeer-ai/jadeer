import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import {
  GitBranch,
  GitPullRequest,
  GitCommit,
  CheckCircle2,
  Video,
  Send,
  Upload,
  FileText,
  Paperclip,
  ExternalLink,
  Plus,
  Filter,
  Layers,
  MessageSquare,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — ACTIVE PROJECT WORKSPACE
   Software Lifecycle Management for Assigned Industry Projects
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Inline GitHub Icon ─────────────────────────────────────────────────── */
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

/* ── Types & Models ─────────────────────────────────────────────────────── */

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  isMentor?: boolean;
  avatarBg: string;
}

interface KanbanTask {
  id: string;
  title: string;
  tag: string;
  priority: 'high' | 'medium' | 'low';
  assignee: { name: string; initials: string; bg: string };
  prNumber?: string;
  branch?: string;
  points: number;
}

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  initials: string;
  avatarBg: string;
  text: string;
  time: string;
  isMentor?: boolean;
  meetingInvite?: {
    title: string;
    time: string;
    linkText: string;
  };
}

interface CommitItem {
  id: string;
  hash: string;
  message: string;
  author: string;
  time: string;
  branch: string;
}

interface UploadedFile {
  name: string;
  size: string;
  uploader: string;
  date: string;
}

/* ── Sample Project Data ────────────────────────────────────────────────── */

const teamMembers: TeamMember[] = [
  { name: 'Tariq Al-Mansoor', role: 'Principal Systems Architect & Jadeer Mentor', initials: 'TM', isMentor: true, avatarBg: 'bg-[#0F172A]' },
  { name: 'Ahmad Al-Hassan (You)', role: 'Junior Backend & Systems', initials: 'AH', avatarBg: 'bg-[#5E8174]' },
  { name: 'Layla Nasser', role: 'Junior Systems & APIs', initials: 'LN', avatarBg: 'bg-[#1e2844]' },
  { name: 'Omar Farooq', role: 'Junior DevOps & CI/CD', initials: 'OF', avatarBg: 'bg-[#0e7490]' },
];

const initialTasks: Record<'todo' | 'inProgress' | 'review' | 'done', KanbanTask[]> = {
  todo: [
    {
      id: 'task-1',
      title: 'Implement exponential backoff retry policy for dropped gRPC packets',
      tag: 'Reliability',
      priority: 'medium',
      assignee: { name: 'Layla Nasser', initials: 'LN', bg: 'bg-[#1e2844]' },
      points: 3,
    },
    {
      id: 'task-2',
      title: 'Benchmark memory throughput under 100k concurrent client streams',
      tag: 'Benchmarking',
      priority: 'low',
      assignee: { name: 'Omar Farooq', initials: 'OF', bg: 'bg-[#0e7490]' },
      points: 5,
    },
  ],
  inProgress: [
    {
      id: 'task-3',
      title: 'Worker heartbeat & Redis distributed lease renewal worker',
      tag: 'Core Systems',
      priority: 'high',
      assignee: { name: 'Ahmad Al-Hassan', initials: 'AH', bg: 'bg-[#6E8F75]' },
      branch: 'feat/redis-lease-heartbeat',
      points: 8,
    },
  ],
  review: [
    {
      id: 'task-4',
      title: 'PR #42: Connection pooling & RAII socket wrapper with epoll event loop',
      tag: 'Architecture',
      priority: 'high',
      assignee: { name: 'Ahmad Al-Hassan', initials: 'AH', bg: 'bg-[#6E8F75]' },
      prNumber: '#42',
      branch: 'feat/epoll-socket-pool',
      points: 5,
    },
  ],
  done: [
    {
      id: 'task-5',
      title: 'Telemetry schema definition in Protocol Buffers v3',
      tag: 'Contracts',
      priority: 'medium',
      assignee: { name: 'Layla Nasser', initials: 'LN', bg: 'bg-[#1e2844]' },
      points: 3,
    },
    {
      id: 'task-6',
      title: 'GitHub Actions automated matrix test suite on Linux & macOS',
      tag: 'DevOps',
      priority: 'medium',
      assignee: { name: 'Omar Farooq', initials: 'OF', bg: 'bg-[#0e7490]' },
      points: 2,
    },
  ],
};

const initialChatMessages: ChatMessage[] = [
  {
    id: 'c-1',
    sender: 'Tariq Al-Mansoor',
    role: 'Senior Mentor',
    initials: 'TM',
    avatarBg: 'bg-[#0B0F19]',
    isMentor: true,
    text: "Great progress on the connection pooling PR @Ahmad! I left a review note regarding RAII cleanup under unexpected socket disconnects. Let's make sure the destructor handles lingering file descriptors cleanly.",
    time: '2:15 PM',
  },
  {
    id: 'c-2',
    sender: 'Ahmad Al-Hassan',
    role: 'Junior Backend',
    initials: 'AH',
    avatarBg: 'bg-[#6E8F75]',
    text: "Thanks Tariq! I've updated the RAII wrapper to call `close()` in `noexcept` destructor and verified via Valgrind. Re-pushed commit `3f8a92c`.",
    time: '2:30 PM',
  },
  {
    id: 'c-3',
    sender: 'Tariq Al-Mansoor',
    role: 'Senior Mentor',
    initials: 'TM',
    avatarBg: 'bg-[#0B0F19]',
    isMentor: true,
    text: "Awesome work. Let's do our weekly architecture alignment today to plan Milestone 2 deliverables.",
    time: '3:00 PM',
    meetingInvite: {
      title: 'Sprint 3 Architecture Sync & PR Walkthrough',
      time: 'Today @ 4:00 PM (30 mins)',
      linkText: 'Join Mentor Video Call',
    },
  },
];

const initialCommits: CommitItem[] = [
  { id: 'cm-1', hash: '3f8a92c', message: 'fix(socket): ensure noexcept RAII socket cleanup in destructor', author: 'Ahmad Al-Hassan', time: '18m ago', branch: 'feat/epoll-socket-pool' },
  { id: 'cm-2', hash: '9b10a4e', message: 'feat(proto): add ingestion latency metrics to proto message', author: 'Layla Nasser', time: '2h ago', branch: 'feat/proto-metrics' },
  { id: 'cm-3', hash: '1d7f88a', message: 'ci(actions): add clang-format and cppcheck linter step', author: 'Omar Farooq', time: '5h ago', branch: 'main' },
];

const initialFiles: UploadedFile[] = [
  { name: 'architecture_diagram_v3.png', size: '2.4 MB', uploader: 'Tariq Al-Mansoor', date: 'Yesterday' },
  { name: 'valgrind_memory_benchmark.pdf', size: '840 KB', uploader: 'Ahmad Al-Hassan', date: 'Today' },
];

export default function ProjectWorkspacePage() {
  const { profile: userProfile } = useUserProfile();
  const [tasks, setTasks] = useState(initialTasks);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [chatInput, setChatInput] = useState('');
  const [activeRightTab, setActiveRightTab] = useState<'chat' | 'files' | 'git'>('chat');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialFiles);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isStudent = userProfile.role === 'student';

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: `c-${Date.now()}`,
      sender: userProfile.fullName || 'Ahmad Al-Hassan',
      role: isStudent ? 'University Intern' : 'Junior Backend Engineer',
      initials: 'AH',
      avatarBg: 'bg-[#6E8F75]',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const newFile: UploadedFile = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploader: userProfile.fullName || 'Ahmad Al-Hassan',
        date: 'Just now',
      };
      setUploadedFiles((prev) => [newFile, ...prev]);
    }
  }, [userProfile.fullName]);

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newFile: UploadedFile = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploader: userProfile.fullName || 'Ahmad Al-Hassan',
        date: 'Just now',
      };
      setUploadedFiles((prev) => [newFile, ...prev]);
    }
  };

  return (
    <div className="space-y-6 animate-[fade-in_0.4s_ease]">

      {/* ═══════════════════════════════════════════════════════════════
         PROJECT HEADER & MENTOR / TEAM CARD
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          {/* Left: Project Title, Badge & Repo Link */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-semibold border border-[#5E8174]/20">
                <span className="w-2 h-2 rounded-full bg-[#5E8174] animate-pulse" />
                {isStudent ? 'University Internship / Co-op Project' : 'Assigned Industry Project'}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-lg bg-[#F8F9FA] border border-slate-200/60 text-[#334155]">
                Sprint 3 of 6 • Active
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#F8F9FA] border border-slate-200/60 text-[#334155]">
                Track: {userProfile.track || 'Backend Systems'}
              </span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#334155] hover:text-[#0F172A] transition-colors"
              >
                <GitHubIcon className="w-3.5 h-3.5" />
                <span className="font-mono text-[11px]">jadeer-org/distributed-task-queue</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Distributed Task Queue & Telemetry Ingestion Engine
            </h1>
            <p className="text-sm text-[#334155] max-w-3xl leading-relaxed">
              {isStudent
                ? 'Co-op Capstone Sprint: Build high-throughput asynchronous job scheduling and telemetry buffer in C++20 with mentor guidance and verified PR milestones.'
                : 'High-throughput asynchronous job scheduler and stream telemetry buffer in C++20 with gRPC, Redis Sentinel, and custom epoll connection pooling.'}
            </p>
          </div>

          {/* Right: Milestone Progress Gauge */}
          <div className="shrink-0 p-4 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] mb-1.5">
              <span>Milestone 2 Progress</span>
              <span className="text-[#5E8174]">68%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden mb-2">
              <div className="w-[68%] h-full bg-[#5E8174] rounded-full transition-all duration-700" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Deadline: Oct 28, 2026</span>
              <span>12/18 Tasks Done</span>
            </div>
          </div>
        </div>

        {/* ── Mentor & Team Composition Bar ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">

          {/* Assigned Senior Mentor (Warm Beige Neutral Surface) */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F4F0E8]/80 border border-[#E8E2D5]">
            <div className="w-11 h-11 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0 border border-slate-800">
              TM
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-[#0F172A] truncate">
                  Tariq Al-Mansoor
                </p>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[#5E8174] text-white">
                  Mentor
                </span>
              </div>
              <p className="text-xs text-[#334155]/80 font-medium truncate mt-0.5">
                Principal Systems Architect & Jadeer Mentor
              </p>
            </div>
          </div>

          {/* Assigned Junior Engineering Team */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60">
            <div className="flex items-center gap-3">
              {/* Stacked avatars */}
              <div className="flex -space-x-2.5 overflow-hidden">
                {teamMembers.map((m) => (
                  <div
                    key={m.name}
                    className={`inline-block w-8 h-8 rounded-full ${m.avatarBg} text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white`}
                    title={`${m.name} (${m.role})`}
                  >
                    {m.initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F172A]">
                  4 Engineers Assigned
                </p>
                <p className="text-[11px] text-slate-500">
                  Backend, Systems & DevOps Pod
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveRightTab('chat')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#0F172A] hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#5E8174]" />
              Team Hub
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         SPLIT WORKSPACE LAYOUT
         Left: Kanban Sprint Board | Right: Communication & Artifacts Hub
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* ─────────────────────────────────────────────────────────────
           LEFT SIDE (7 cols): SPRINT KANBAN TASK BOARD
           ───────────────────────────────────────────────────────────── */}
        <div className="xl:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">

            {/* Board Header & Controls */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#5E8174]" />
                <h2 className="text-lg font-bold text-[#0F172A]">Sprint 3 Kanban Board</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F8F9FA] border border-slate-200 text-slate-500 font-medium">
                  6 Tasks
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl text-slate-400 hover:text-[#0F172A] hover:bg-[#F8F9FA] transition-colors cursor-pointer">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4D6D62] transition-all shadow-2xs cursor-pointer active:scale-95">
                  <Plus className="w-3.5 h-3.5" />
                  New Task
                </button>
              </div>
            </div>

            {/* 4-Column Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Column: To Do */}
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    To Do ({tasks.todo.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                </div>

                {tasks.todo.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all group space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F4F0E8] text-[#334155] uppercase">
                        {task.tag}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-medium">
                        {task.points} pts
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#0F172A] leading-snug">
                      {task.title}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full ${task.assignee.bg} text-white flex items-center justify-center text-[9px] font-bold`}>
                          {task.assignee.initials}
                        </div>
                        <span className="truncate max-w-[90px]">{task.assignee.name.split(' ')[0]}</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Column: In Progress (Active) */}
              <div className="p-3.5 rounded-2xl bg-[#5E8174]/[0.05] border border-[#5E8174]/20 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5E8174]">
                    In Progress ({tasks.inProgress.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#5E8174] animate-pulse" />
                </div>

                {tasks.inProgress.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-white rounded-xl border border-[#5E8174]/30 shadow-2xs space-y-2.5 ring-1 ring-[#5E8174]/15"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#5E8174]/10 text-[#5E8174] uppercase">
                        {task.tag}
                      </span>
                      <span className="text-[11px] font-mono text-[#5E8174] font-bold">
                        {task.points} pts
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#0F172A] leading-snug">
                      {task.title}
                    </p>
                    {task.branch && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#5E8174] bg-[#5E8174]/[0.08] px-2 py-1 rounded-lg">
                        <GitBranch className="w-3 h-3" />
                        <span className="truncate">{task.branch}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full ${task.assignee.bg} text-white flex items-center justify-center text-[9px] font-bold`}>
                          {task.assignee.initials}
                        </div>
                        <span className="font-semibold text-[#0F172A]">{task.assignee.name.split(' ')[0]} (You)</span>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                        High Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Column: In Review / PR Open */}
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Review / PR ({tasks.review.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                </div>

                {tasks.review.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F4F0E8] text-[#334155] uppercase">
                        {task.tag}
                      </span>
                      {task.prNumber && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-700 font-semibold bg-[#F8F9FA] border border-slate-200 px-2 py-0.5 rounded-md">
                          <GitPullRequest className="w-3 h-3 text-[#5E8174]" />
                          {task.prNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#0F172A] leading-snug">
                      {task.title}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full ${task.assignee.bg} text-white flex items-center justify-center text-[9px] font-bold`}>
                          {task.assignee.initials}
                        </div>
                        <span className="truncate">{task.assignee.name.split(' ')[0]}</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        Mentor Reviewing
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Column: Done */}
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Done ({tasks.done.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#5E8174]" />
                </div>

                {tasks.done.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-white/80 rounded-xl border border-slate-200/60 space-y-2 opacity-90"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#5E8174]/10 text-[#5E8174] uppercase">
                        {task.tag}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8174]" />
                    </div>
                    <p className="text-xs font-medium text-slate-400 line-through leading-snug">
                      {task.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
           RIGHT SIDE (5 cols): INTERACTIVE COMMUNICATION & ARTIFACTS HUB
           ───────────────────────────────────────────────────────────── */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden flex flex-col h-[680px]">

            {/* Hub Tab Switcher */}
            <div className="flex items-center border-b border-slate-200/80 bg-[#F8F9FA] px-3 pt-2">
              {[
                { id: 'chat', label: 'Mentor & Team Chat', icon: MessageSquare },
                { id: 'files', label: 'Deliverables', icon: Paperclip, count: uploadedFiles.length },
                { id: 'git', label: 'GitHub Commits', icon: GitCommit, count: initialCommits.length },
              ].map((tab) => {
                const isActive = activeRightTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRightTab(tab.id as any)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-t-2xl text-xs font-bold transition-all border-t-2 cursor-pointer
                      ${
                        isActive
                          ? 'bg-white text-[#0F172A] border-[#5E8174] shadow-2xs'
                          : 'text-slate-400 border-transparent hover:text-[#0F172A]'
                      }
                    `}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#5E8174]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-200/60 text-slate-600 text-[10px]">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── TAB 1: MENTOR & TEAM CHAT ────────────────────────────── */}
            {activeRightTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white">
                {/* Messages stream */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F8F9FA]/40">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3 animate-[slide-up_0.2s_ease]">
                      <div className={`w-8 h-8 rounded-xl ${msg.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                        {msg.initials}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#0F172A]">{msg.sender}</span>
                            {msg.isMentor && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-[#0F172A] text-white">
                                Mentor
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{msg.time}</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs text-[#334155] leading-relaxed">
                          {msg.text}

                          {/* Meeting Invite Widget inside Mentor Message */}
                          {msg.meetingInvite && (
                            <div className="mt-3 p-3.5 rounded-xl bg-[#5E8174]/[0.06] border border-[#5E8174]/20 space-y-2">
                              <div className="flex items-center gap-2">
                                <Video className="w-4 h-4 text-[#5E8174]" />
                                <span className="font-bold text-xs text-[#0F172A]">
                                  {msg.meetingInvite.title}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#334155]/75">
                                {msg.meetingInvite.time}
                              </p>
                              <button className="w-full py-2 rounded-lg bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4D6D62] transition-colors shadow-2xs cursor-pointer active:scale-95">
                                {msg.meetingInvite.linkText}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat input box */}
                <div className="p-3.5 border-t border-slate-200/80 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                      placeholder="Message your team or ask mentor for code review..."
                      className="flex-1 h-11 px-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#5E8174] focus:bg-white transition-all"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="w-11 h-11 rounded-xl bg-[#5E8174] text-white flex items-center justify-center hover:bg-[#4D6D62] transition-colors shrink-0 shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: DELIVERABLES & DRAG-AND-DROP UPLOAD ───────────── */}
            {activeRightTab === 'files' && (
              <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-y-auto space-y-4">
                {/* Drag-and-drop zone with Warm Beige Tint */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all
                    ${
                      isDragging
                        ? 'border-[#5E8174] bg-[#5E8174]/[0.08]'
                        : 'border-slate-200 bg-[#F4F0E8]/40 hover:border-[#5E8174]/40 hover:bg-[#F4F0E8]/60'
                    }
                  `}
                >
                  <Upload className="w-6 h-6 text-[#5E8174] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#0F172A]">
                    Upload Architecture Diagrams & Docs
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Drag & drop files or click to browse (PDF, PNG, DOCX, ZIP up to 50MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>

                {/* Uploaded files list */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Project Deliverables ({uploadedFiles.length})
                  </p>
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FA] border border-slate-200/60"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-[#5E8174] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0F172A] truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {file.size} • by {file.uploader}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#5E8174] bg-[#5E8174]/10 border border-[#5E8174]/20 px-2 py-0.5 rounded">
                        {file.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 3: CONNECTED GITHUB COMMITS ─────────────────────── */}
            {activeRightTab === 'git' && (
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Recent Repository Activity
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#5E8174] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5E8174]" />
                    branch: main
                  </span>
                </div>

                {initialCommits.map((commit) => (
                  <div
                    key={commit.id}
                    className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-slate-200/60 space-y-2 hover:border-[#5E8174]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        <GitCommit className="w-3 h-3 text-[#5E8174]" />
                        {commit.hash}
                      </span>
                      <span className="text-[10px] text-slate-400">{commit.time}</span>
                    </div>
                    <p className="text-xs font-medium text-[#0F172A] leading-snug">
                      {commit.message}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>{commit.author}</span>
                      <span className="font-mono text-[10px] text-[#5E8174]">{commit.branch}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
