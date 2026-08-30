import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/contexts/UserProfileContext';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Code2,
  Clock,
  CheckCircle2,
  BrainCircuit,
  Terminal,
  Copy,
  Check,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Award,
  PlaySquare,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — AI TECHNICAL INTERVIEWER (ACTIVE STATE)
   Conversational Text & Voice Assessment: C++ Object-Oriented Programming
   ═══════════════════════════════════════════════════════════════════════════ */

interface Message {
  id: string;
  sender: 'ai' | 'candidate';
  text: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  audioDuration?: string;
  timestamp: string;
  competencyPill?: string;
}

const initialMessages: Message[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: "Hello Ahmad! Welcome to your adaptive technical evaluation for the Junior Backend & Systems Engineer track. Today, we will explore core C++ Object-Oriented Programming concepts, memory safety, and low-level runtime mechanisms.\n\nLet's start with a fundamental scenario: Why should a base class destructor always be declared `virtual` when implementing polymorphic hierarchies, and what happens at the memory level if you delete a derived object through a base class pointer without it?",
    codeSnippet: {
      language: 'cpp',
      code: `class Base {\npublic:\n    ~Base() { /* non-virtual destructor */ }\n};\n\nclass Derived : public Base {\n    int* buffer;\npublic:\n    Derived(size_t size) : buffer(new int[size]) {}\n    ~Derived() { delete[] buffer; }\n};\n\nBase* ptr = new Derived(1024);\ndelete ptr; // What specific problem occurs here?`,
    },
    audioDuration: '0:34',
    timestamp: '10:02 AM',
    competencyPill: 'Polymorphism & Memory Safety',
  },
  {
    id: 'msg-2',
    sender: 'candidate',
    text: "When you delete a derived object through a pointer to a base class that has a non-virtual destructor, C++ yields undefined behavior according to the standard. In practice, the compiler performs static binding based on the pointer type rather than dynamic dispatch.\n\nThis means only `~Base()` is executed, and `~Derived()` is never called. Any dynamically allocated resources owned by the derived class — such as the `buffer` array in your snippet — will not be freed, causing a memory leak. Declaring `virtual ~Base()` ensures the destructor call is dispatched through the virtual table (vtable), properly invoking `~Derived()` first, followed by `~Base()`.",
    audioDuration: '0:48',
    timestamp: '10:04 AM',
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: "Spot on explanation, Ahmad. You accurately highlighted both the static binding issue and the resulting resource leak.\n\nNow let's go one layer deeper under the hood: How does the compiler actually implement this dynamic dispatch mechanism? Specifically, explain what the virtual method table (vtable) and virtual pointer (vptr) are, what memory overhead they introduce to an object instance, and how runtime polymorphism contrasts with compile-time polymorphism like C++ templates or CRTP?",
    codeSnippet: {
      language: 'cpp',
      code: `// Dynamic Polymorphism (vtable/vptr overhead at runtime):\nclass Shape {\npublic:\n    virtual void draw() const = 0;\n};\n\n// Compile-Time Polymorphism (Zero runtime cost via CRTP):\ntemplate <typename Derived>\nclass ShapeCRTP {\npublic:\n    void draw() const {\n        static_cast<const Derived*>(this)->drawImplementation();\n    }\n};`,
    },
    audioDuration: '0:42',
    timestamp: '10:06 AM',
    competencyPill: 'Runtime vtable vs Compile-Time CRTP',
  },
  {
    id: 'msg-4',
    sender: 'candidate',
    text: "Here is how the dynamic dispatch works internally:\n\n1. **Virtual Table (vtable)**: The compiler generates a static table of function pointers for each class containing virtual methods. There is only one vtable per class stored in read-only memory.\n2. **Virtual Pointer (vptr)**: Each instantiated object of a polymorphic class gets an implicit hidden pointer (`__vptr`) inserted by the compiler (usually at offset 0). The vptr points to that class's vtable. On 64-bit architectures, this adds exactly 8 bytes of memory overhead per object.\n3. **Call Resolution**: When invoking `ptr->draw()`, the runtime looks up `ptr->__vptr`, dereferences the function slot in the vtable, and jumps to the concrete implementation. This introduces a slight pointer indirection cost and inhibits inline optimization.\n\nIn contrast, **Compile-Time Polymorphism (like CRTP or Templates)** resolves function calls at compile-time directly in the binary without vtable lookups or vptr memory overhead, enabling aggressive inlining by the compiler.",
    timestamp: '10:08 AM',
  },
];

export default function AIInterviewPage() {
  const navigate = useNavigate();
  const { addAssessmentResult, profile: userProfile } = useUserProfile();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  /* Test Runner State & Modal */
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<Array<{ name: string; passed: boolean; duration: string }>>([
    { name: 'Virtual Destructor Pointer Dispatch', passed: true, duration: '12ms' },
    { name: 'RAII Smart Pointer Scope Cleanup', passed: true, duration: '8ms' },
    { name: 'Template Inlining & Zero-Cost CRTP', passed: true, duration: '15ms' },
  ]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [claimedBadge, setClaimedBadge] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
    }, 1200);
  };

  const handleCompleteAssessment = () => {
    const badgeName = 'Verified Backend Engineer';
    addAssessmentResult({
      title: 'C++ Systems & Memory Safety Assessment',
      category: 'Backend Systems & C++',
      score: 96,
      maxScore: 100,
      passed: true,
      badgeEarned: badgeName,
      challengesCompleted: 5,
      totalChallenges: 5,
    });
    setClaimedBadge(badgeName);
    setShowCompletionModal(true);
  };

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiThinking]);

  // Voice recording timer simulation
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newCandidateMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'candidate',
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newCandidateMsg]);
    setInputValue('');
    setIsAiThinking(true);

    // Simulated adaptive AI reply after 1.8s
    setTimeout(() => {
      setIsAiThinking(false);
      const adaptiveAiReply: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: "Excellent breakdown! You clearly understand the memory layout and the tradeoff between virtual table pointer indirection and template inlining.\n\nLet's apply this to modern C++: How would you manage the lifetime of polymorphic objects using `std::unique_ptr<Base>` and `std::shared_ptr<Base>` to guarantee RAII without manual `delete` calls?",
        codeSnippet: {
          language: 'cpp',
          code: `// Modern C++ Smart Pointer polymorphism:\n#include <memory>\n\nstd::unique_ptr<Base> createComponent(bool fastMode) {\n    if (fastMode) {\n        return std::make_unique<DerivedFast>();\n    }\n    return std::make_unique<DerivedRobust>();\n}`,
        },
        audioDuration: '0:28',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        competencyPill: 'Smart Pointers & RAII Lifetime',
      };
      setMessages((prev) => [...prev, adaptiveAiReply]);
    }, 1800);
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      // Simulate speech-to-text transcription
      if (recordingSeconds > 1) {
        const transcribedText =
          'Using std::unique_ptr<Base> provides single ownership with zero memory overhead beyond the raw pointer. Because std::unique_ptr relies on the virtual destructor of Base, calling reset() or letting it go out of scope invokes the correct destructor automatically.';
        setInputValue(transcribedText);
      }
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-5 animate-[fade-in_0.4s_ease]">

      {/* ═══════════════════════════════════════════════════════════════
         ASSESSMENT HEADER & METRICS BAR
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#0B0F19]/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          {/* Left: Active Session Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981]/10 text-[#059669] text-xs font-bold border border-[#10b981]/20">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-[pulse-glow_1.8s_ease-in-out_infinite]" />
                Live Assessment Session
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#0B0F19]/[0.04] text-[#0B0F19]/60">
                Track: {userProfile.track || 'Junior Backend / Systems'}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-[#0B0F19]/70">
                Calibration: {userProfile.role === 'student' ? '🎓 Internship Benchmark' : '⚡ Graduate Hiring Gate'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B0F19] tracking-tight">
              C++ Object-Oriented Design & Memory Architecture
            </h2>
          </div>

          {/* Right: Timer, Test Runner & Claim Badge Action */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            {/* Session Timer */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] text-xs font-semibold text-[#0B0F19]">
              <Clock className="w-4 h-4 text-[#6E8F75]" />
              <span>18:42</span>
              <span className="text-[#0B0F19]/30">/ 30:00</span>
            </div>

            {/* Run Tests Button */}
            <button
              onClick={handleRunTests}
              disabled={isRunningTests}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B0F19] text-white text-xs font-bold hover:bg-[#1a2332] transition-colors shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#82a78a] ${isRunningTests ? 'animate-spin' : ''}`} />
              <span>{isRunningTests ? 'Executing Test Suite...' : 'Run Test Suite'}</span>
            </button>

            {/* Complete & Submit Assessment Button */}
            <button
              onClick={handleCompleteAssessment}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)] transition-all shadow-sm active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>Submit & Claim Badge</span>
            </button>

            {/* AI Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`
                flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border
                ${isMuted
                  ? 'bg-white border-[#0B0F19]/[0.08] text-[#0B0F19]/40'
                  : 'bg-[#6E8F75]/10 border-[#6E8F75]/25 text-[#6E8F75]'
                }
              `}
              title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isMuted ? 'Voice Off' : 'AI Voice On'}</span>
            </button>
          </div>
        </div>

        {/* Live Test Suite Indicators */}
        <div className="mt-4 pt-4 border-t border-[#0B0F19]/[0.05] grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {testResults.map((t) => (
            <div key={t.name} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B0F19]/[0.05] text-xs">
              <span className="flex items-center gap-2 font-medium text-[#0B0F19]/80 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{t.name}</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0 font-bold">
                {t.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         SCROLLABLE CONVERSATION WORKSPACE
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-[#0B0F19]/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col h-[620px] overflow-hidden">

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAF9F6]/40">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isAi ? 'justify-start' : 'justify-end'} animate-[slide-up_0.3s_var(--ease-spring)]`}
              >
                {/* AI Avatar */}
                {isAi && (
                  <div className="w-10 h-10 rounded-2xl bg-[#0B0F19] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(11,15,25,0.2)] border border-white/10">
                    <Sparkles className="w-5 h-5 text-[#82a78a]" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className={`max-w-[88%] sm:max-w-[80%] ${isAi ? 'space-y-2.5' : 'space-y-1.5'}`}>

                  {/* Header info */}
                  <div className={`flex items-center gap-2 px-1 text-xs ${isAi ? 'text-[#0B0F19]/40' : 'justify-end text-[#0B0F19]/40'}`}>
                    <span className="font-bold text-[#0B0F19]/70">
                      {isAi ? 'Jadeer AI Technical Interviewer' : `${userProfile.fullName || 'Ahmad Al-Hassan'} (You)`}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.competencyPill && (
                      <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-[#6E8F75]/10 text-[#6E8F75] font-semibold text-[10px]">
                        {msg.competencyPill}
                      </span>
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`
                      p-4 sm:p-5 rounded-3xl text-[14.5px] leading-relaxed
                      ${
                        isAi
                          ? 'bg-[#0B0F19] text-white/95 rounded-tl-lg shadow-[0_4px_20px_rgba(11,15,25,0.15)] border border-white/[0.08]'
                          : 'bg-white text-[#0B0F19] rounded-tr-lg border border-[#0B0F19]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
                      }
                    `}
                  >
                    {/* Voice audio badge if message was spoken */}
                    {msg.audioDuration && (
                      <div
                        className={`
                          inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-semibold
                          ${isAi ? 'bg-white/10 text-white/80' : 'bg-[#6E8F75]/10 text-[#6E8F75]'}
                        `}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Voice Output ({msg.audioDuration})</span>
                      </div>
                    )}

                    {/* Body Text */}
                    <div className="whitespace-pre-line font-normal">
                      {msg.text}
                    </div>

                    {/* C++ Code Block inside AI message */}
                    {msg.codeSnippet && (
                      <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-[#050810] shadow-inner">
                        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06] text-xs text-white/50 font-mono">
                          <span className="flex items-center gap-1.5 font-semibold text-white/70">
                            <Code2 className="w-3.5 h-3.5 text-[#82a78a]" />
                            {msg.codeSnippet.language.toUpperCase()} Snippet
                          </span>
                          <button
                            onClick={() => copyCode(msg.codeSnippet!.code, msg.id)}
                            className="flex items-center gap-1 hover:text-white transition-colors"
                          >
                            {copiedCodeId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#10b981]" />
                                <span className="text-[#10b981]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-[13px] font-mono text-[#d1fae5] overflow-x-auto leading-relaxed scrollbar-none">
                          <code>{msg.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidate Avatar */}
                {!isAi && (
                  <div className="w-10 h-10 rounded-2xl bg-[#6E8F75] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(110,143,117,0.3)] font-bold text-xs">
                    AH
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Thinking Animation Indicator */}
          {isAiThinking && (
            <div className="flex gap-3 sm:gap-4 justify-start animate-[fade-in_0.3s_ease]">
              <div className="w-10 h-10 rounded-2xl bg-[#0B0F19] text-white flex items-center justify-center shrink-0 border border-white/10">
                <BrainCircuit className="w-5 h-5 text-[#82a78a] animate-[pulse-glow_1.5s_infinite]" />
              </div>
              <div className="bg-[#0B0F19] text-white p-4 rounded-3xl rounded-tl-lg border border-white/[0.08] shadow-md flex items-center gap-3">
                <span className="text-xs text-white/70 font-medium">Evaluating your answer & adapting next prompt</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#82a78a] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#82a78a] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#82a78a] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
           SLEEK BOTTOM INPUT SECTION WITH VOICE & TEXT
           ═══════════════════════════════════════════════════════════════ */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#0B0F19]/[0.06]">

          {/* Live Voice Recording Bar (Active State) */}
          {isRecording && (
            <div className="flex items-center justify-between px-4 py-3 mb-3 rounded-2xl bg-[#f43f5e]/[0.06] border border-[#f43f5e]/20 animate-[slide-up_0.2s_ease]">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-[#f43f5e] animate-ping" />
                <span className="text-xs font-bold text-[#f43f5e] uppercase tracking-wider">
                  Listening to Voice Input... ({formatTimer(recordingSeconds)})
                </span>
                {/* Voice soundwave animation bars */}
                <div className="hidden sm:flex items-center gap-1 ml-2">
                  <span className="w-1 h-3 bg-[#f43f5e] rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                  <span className="w-1 h-6 bg-[#f43f5e] rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s]" />
                  <span className="w-1 h-4 bg-[#f43f5e] rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
                  <span className="w-1 h-7 bg-[#f43f5e] rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.3s]" />
                  <span className="w-1 h-3 bg-[#f43f5e] rounded-full animate-[pulse_0.5s_ease-in-out_infinite]" />
                </div>
              </div>
              <button
                onClick={handleToggleRecord}
                className="px-3 py-1 text-xs font-bold bg-[#f43f5e] text-white rounded-lg hover:bg-[#e11d48] transition-colors"
              >
                Done Speaking
              </button>
            </div>
          )}

          {/* Input Box Controls */}
          <div className="flex items-end gap-2 sm:gap-3">

            {/* Voice Microphone Button (Prominent) */}
            <button
              id="voice-record-btn"
              type="button"
              onClick={handleToggleRecord}
              className={`
                flex items-center justify-center h-[52px] w-[52px] rounded-2xl shrink-0 transition-all duration-300
                ${
                  isRecording
                    ? 'bg-[#f43f5e] text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-105'
                    : 'bg-[#6E8F75] text-white hover:bg-[#5d7d64] hover:shadow-[0_4px_16px_rgba(110,143,117,0.35)] active:scale-95'
                }
              `}
              title={isRecording ? 'Stop Voice Recording' : 'Hold to Speak / Voice Input'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input Field */}
            <div className="flex-1 relative">
              <textarea
                id="interview-chat-input"
                rows={2}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your technical response or click the microphone to speak..."
                className="
                  w-full px-4 py-3 rounded-2xl resize-none
                  bg-[#FAF9F6] border border-[#0B0F19]/[0.08]
                  text-[14.5px] text-[#0B0F19] placeholder:text-[#0B0F19]/30
                  transition-all duration-200
                  hover:border-[#0B0F19]/15
                  focus:outline-none focus:border-[#6E8F75] focus:ring-[3px] focus:ring-[#6E8F75]/10 focus:bg-white
                  leading-relaxed
                "
              />
            </div>

            {/* Send Button */}
            <button
              id="send-message-btn"
              type="button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isAiThinking}
              className={`
                flex items-center justify-center h-[52px] px-5 rounded-2xl shrink-0 text-sm font-semibold gap-2 transition-all duration-300
                ${
                  inputValue.trim() && !isAiThinking
                    ? 'bg-[#6E8F75] text-white hover:bg-[#5d7d64] hover:shadow-[0_4px_16px_rgba(110,143,117,0.3)] active:scale-95 cursor-pointer'
                    : 'bg-[#0B0F19]/[0.05] text-[#0B0F19]/30 cursor-not-allowed'
                }
              `}
            >
              <span className="hidden sm:inline">Submit</span>
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom helper prompt shortcuts */}
          <div className="flex items-center justify-between mt-3 text-[11px] text-[#0B0F19]/40 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E8F75]" />
              Press <kbd className="px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#0B0F19]/10 font-mono text-[10px]">Enter</kbd> to submit, <kbd className="px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#0B0F19]/10 font-mono text-[10px]">Shift+Enter</kbd> for new line
            </span>
            <span className="hidden md:inline">
              Voice transcription automatically converts to code & technical notes
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         COMPLETION & BADGE CLAIM MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-[#0B0F19]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#0B0F19]/[0.08] shadow-2xl space-y-6 text-center animate-[scale-in_0.25s_var(--ease-spring)]">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#6E8F75]/10 text-[#6E8F75] ring-4 ring-[#6E8F75]/20 shadow-md">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase tracking-wider border border-emerald-200">
                Evaluation Passed • 96% Rating
              </span>
              <h2 className="text-2xl font-extrabold text-[#0B0F19] tracking-tight">
                Verified Badge Earned!
              </h2>
              <p className="text-xs text-[#0B0F19]/60 leading-relaxed max-w-sm mx-auto">
                Congratulations Ahmad! Your C++ Memory Safety & Systems evaluation results have been verified and persisted to your profile context.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.06] flex items-center justify-between text-left">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B0F19]/45">Newly Unlocked Badge</p>
                <p className="text-sm font-extrabold text-[#0B0F19] flex items-center gap-1.5 mt-0.5">
                  <Award className="w-4 h-4 text-[#6E8F75]" />
                  {claimedBadge}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                Synced to Profile
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate('/candidates/portfolio')}
                className="w-full py-3 rounded-2xl bg-[#6E8F75] text-white text-xs font-bold hover:bg-[#5d7d64] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>View Verified Candidate Dossier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#FAF9F6] border border-[#0B0F19]/[0.08] text-xs font-semibold text-[#0B0F19]/70 hover:text-[#0B0F19] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
