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
  Copy,
  Check,
  ShieldCheck,
  Award,
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
  const [testResults] = useState<Array<{ name: string; passed: boolean; duration: string }>>([
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
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          {/* Left: Active Session Info */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-semibold border border-[#5E8174]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5E8174] animate-pulse" />
                Live Assessment Session
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-[#F8F9FA] border border-slate-200/60 text-slate-500">
                Track: {userProfile.track || 'Junior Backend / Systems'}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-[#F8F9FA] border border-slate-200/60 text-slate-500">
                Calibration: {userProfile.role === 'student' ? 'Internship Benchmark' : 'Graduate Hiring Gate'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              C++ Object-Oriented Design & Memory Architecture
            </h2>
          </div>

          {/* Right: Timer, Test Runner & Claim Badge Action */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            {/* Session Timer */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs font-medium text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>18:42</span>
              <span className="text-slate-400">/ 30:00</span>
            </div>

            {/* Run Tests Button (Deep Slate Navy) */}
            <button
              onClick={handleRunTests}
              disabled={isRunningTests}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-[#1E293B] transition-colors shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-300 ${isRunningTests ? 'animate-spin' : ''}`} />
              <span>{isRunningTests ? 'Executing Test Suite...' : 'Run Test Suite'}</span>
            </button>

            {/* Complete & Submit Assessment Button (Muted Sage) */}
            <button
              onClick={handleCompleteAssessment}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4D6D62] hover:shadow-[0_4px_16px_rgba(94,129,116,0.25)] transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Submit & Claim Badge</span>
            </button>

            {/* AI Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border cursor-pointer
                ${isMuted
                  ? 'bg-[#F8F9FA] border-slate-200 text-slate-400 hover:text-slate-600'
                  : 'bg-[#5E8174]/10 border-[#5E8174]/20 text-[#5E8174]'
                }
              `}
              title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isMuted ? 'Voice Off' : 'Voice On'}</span>
            </button>
          </div>
        </div>

        {/* Live Test Suite Indicators (3 Refined Technical Status Chips) */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {testResults.map((t) => (
            <div key={t.name} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F9FA] border border-slate-200/60 text-xs">
              <span className="flex items-center gap-2 font-medium text-slate-600 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8174] shrink-0" />
                <span className="truncate">{t.name}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md shrink-0 font-medium">
                {t.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         SCROLLABLE CONVERSATION WORKSPACE
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col h-[620px] overflow-hidden">

        {/* Chat Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F8F9FA]">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isAi ? 'justify-start' : 'justify-end'} animate-[slide-up_0.3s_var(--ease-spring)]`}
              >
                {/* AI Avatar */}
                {isAi && (
                  <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shrink-0 border border-slate-800 shadow-xs">
                    <Sparkles className="w-4 h-4 text-[#84A98C]" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className={`max-w-[88%] sm:max-w-[80%] ${isAi ? 'space-y-2' : 'space-y-1.5'}`}>

                  {/* Header info */}
                  <div className={`flex items-center gap-2 px-1 text-xs ${isAi ? 'text-slate-400' : 'justify-end text-slate-400'}`}>
                    <span className="font-bold text-[#0F172A]">
                      {isAi ? 'Jadeer AI Technical Interviewer' : `${userProfile.fullName || 'Ahmad Al-Hassan'} (You)`}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.competencyPill && (
                      <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-[#5E8174]/10 text-[#5E8174] font-semibold text-[10px] border border-[#5E8174]/20">
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
                          ? 'bg-[#0F172A] text-slate-100 rounded-tl-lg shadow-[0_4px_16px_rgba(15,23,42,0.12)] border border-slate-800'
                          : 'bg-white text-[#0F172A] rounded-tr-lg border border-slate-200 shadow-2xs'
                      }
                    `}
                  >
                    {/* Voice audio badge if message was spoken */}
                    {msg.audioDuration && (
                      <div
                        className={`
                          inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-xs font-medium
                          ${isAi ? 'bg-white/[0.08] border border-white/[0.1] text-slate-200' : 'bg-[#5E8174]/10 border border-[#5E8174]/20 text-[#5E8174]'}
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
                      <div className="mt-4 rounded-2xl overflow-hidden border border-slate-800/80 bg-[#0A0F1D] shadow-inner">
                        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-slate-800 text-xs text-slate-400 font-mono">
                          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                            <Code2 className="w-3.5 h-3.5 text-[#84A98C]" />
                            {msg.codeSnippet.language.toUpperCase()} Snippet
                          </span>
                          <button
                            onClick={() => copyCode(msg.codeSnippet!.code, msg.id)}
                            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                          >
                            {copiedCodeId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#5E8174]" />
                                <span className="text-[#5E8174] font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-[13px] font-mono text-[#E2E8F0] overflow-x-auto leading-relaxed scrollbar-none">
                          <code>{msg.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidate Avatar */}
                {!isAi && (
                  <div className="w-9 h-9 rounded-xl bg-[#5E8174] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
                    AH
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Thinking Animation Indicator */}
          {isAiThinking && (
            <div className="flex gap-3 sm:gap-4 justify-start animate-[fade-in_0.3s_ease]">
              <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shrink-0 border border-slate-800">
                <BrainCircuit className="w-4 h-4 text-[#84A98C] animate-pulse" />
              </div>
              <div className="bg-[#0F172A] text-white p-4 rounded-3xl rounded-tl-lg border border-slate-800 shadow-sm flex items-center gap-3">
                <span className="text-xs text-slate-300 font-medium">Evaluating your answer & adapting next prompt</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84A98C] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84A98C] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84A98C] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════
           SLEEK BOTTOM INPUT SECTION WITH VOICE & TEXT
           ═══════════════════════════════════════════════════════════════ */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100">

          {/* Live Voice Recording Bar (Active State) */}
          {isRecording && (
            <div className="flex items-center justify-between px-4 py-3 mb-3 rounded-2xl bg-rose-50 border border-rose-200 animate-[slide-up_0.2s_ease]">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                  Listening to Voice Input... ({formatTimer(recordingSeconds)})
                </span>
                {/* Voice soundwave animation bars */}
                <div className="hidden sm:flex items-center gap-1 ml-2">
                  <span className="w-1 h-3 bg-rose-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                  <span className="w-1 h-5 bg-rose-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s]" />
                  <span className="w-1 h-3.5 bg-rose-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
                  <span className="w-1 h-6 bg-rose-500 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.3s]" />
                  <span className="w-1 h-3 bg-rose-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite]" />
                </div>
              </div>
              <button
                onClick={handleToggleRecord}
                className="px-3 py-1 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Done Speaking
              </button>
            </div>
          )}

          {/* Input Box Controls */}
          <div className="flex items-end gap-2 sm:gap-3">

            {/* Voice Microphone Button */}
            <button
              id="voice-record-btn"
              type="button"
              onClick={handleToggleRecord}
              className={`
                flex items-center justify-center h-11 w-11 rounded-xl shrink-0 transition-all duration-200 cursor-pointer
                ${
                  isRecording
                    ? 'bg-rose-600 text-white shadow-sm scale-105'
                    : 'bg-[#5E8174] text-white hover:bg-[#4D6D62] active:scale-95 shadow-2xs'
                }
              `}
              title={isRecording ? 'Stop Voice Recording' : 'Hold to Speak / Voice Input'}
            >
              {isRecording ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
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
                  w-full px-4 py-2.5 rounded-xl resize-none
                  bg-[#F8F9FA] border border-slate-200
                  text-[14px] text-[#0F172A] placeholder:text-slate-400
                  transition-all duration-200
                  hover:border-slate-300
                  focus:outline-none focus:border-[#5E8174] focus:ring-2 focus:ring-[#5E8174]/15 focus:bg-white
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
                flex items-center justify-center h-11 px-4 rounded-xl shrink-0 text-xs font-semibold gap-1.5 transition-all duration-200
                ${
                  inputValue.trim() && !isAiThinking
                    ? 'bg-[#5E8174] text-white hover:bg-[#4D6D62] hover:shadow-[0_4px_16px_rgba(94,129,116,0.25)] active:scale-95 cursor-pointer font-bold'
                    : 'bg-[#F8F9FA] border border-slate-200 text-slate-300 cursor-not-allowed'
                }
              `}
            >
              <span className="hidden sm:inline">Submit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom helper prompt shortcuts */}
          <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5E8174]" />
              Press <kbd className="px-1.5 py-0.5 rounded bg-[#F8F9FA] border border-slate-200 font-mono text-[10px] text-slate-600">Enter</kbd> to submit, <kbd className="px-1.5 py-0.5 rounded bg-[#F8F9FA] border border-slate-200 font-mono text-[10px] text-slate-600">Shift+Enter</kbd> for new line
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
        <div className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-[fade-in_0.2s_ease]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-xl space-y-6 text-center animate-[scale-in_0.25s_var(--ease-spring)]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#5E8174]/10 text-[#5E8174] ring-4 ring-[#5E8174]/15 shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#5E8174]/10 text-[#5E8174] text-xs font-bold uppercase tracking-wider border border-[#5E8174]/20">
                Evaluation Passed • 96% Rating
              </span>
              <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Verified Badge Earned!
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Congratulations Ahmad! Your C++ Memory Safety & Systems evaluation results have been verified and persisted to your profile context.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-slate-200/70 flex items-center justify-between text-left">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Newly Unlocked Badge</p>
                <p className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5 mt-0.5">
                  <Award className="w-4 h-4 text-[#5E8174]" />
                  {claimedBadge}
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-[#5E8174] bg-[#5E8174]/10 border border-[#5E8174]/20 px-2.5 py-1 rounded-lg">
                Synced to Profile
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate('/candidates/portfolio')}
                className="w-full py-2.5 rounded-xl bg-[#5E8174] text-white text-xs font-bold hover:bg-[#4D6D62] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>View Verified Candidate Dossier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs font-semibold text-slate-600 hover:text-[#0F172A] hover:bg-white transition-colors cursor-pointer"
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
