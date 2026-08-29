import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Star,
  Filter,
  Users,
  Calendar,
  MessageCircle,
  Video,
  Clock,
  ChevronRight,
  Briefcase,
  Code2,
  Database,
  Globe,
  Cpu,
  Brain,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — MENTOR CONSULTATION PAGE
   Browse, filter, and discover industry mentors. View profiles, specialties,
   availability, and book 1-to-1 sessions.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Specialty Filter Tags ──────────────────────────────────────────────── */

const specialtyFilters = [
  { label: 'All Mentors', value: 'all', icon: Users },
  { label: 'Backend', value: 'backend', icon: Database },
  { label: 'Frontend', value: 'frontend', icon: Globe },
  { label: 'System Design', value: 'system-design', icon: Cpu },
  { label: 'Machine Learning', value: 'ml', icon: Brain },
  { label: 'Career Guidance', value: 'career', icon: Briefcase },
];

/* ── Mentor Data ────────────────────────────────────────────────────────── */

interface Mentor {
  id: string;
  name: string;
  initials: string;
  title: string;
  company: string;
  bio: string;
  specialties: string[];
  category: string[];
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  nextAvailable: string;
  available: boolean;
  hourlyRate: string;
  languages: string[];
}

const allMentors: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Eng. Mariam Ashraf',
    initials: 'MA',
    title: 'Principal Software Engineer',
    company: 'Microsoft',
    bio: 'Specializing in cloud-native architectures and distributed systems. 12+ years building scalable platforms serving millions of users.',
    specialties: ['Cloud Architecture', 'Distributed Systems', 'Azure'],
    category: ['backend', 'system-design'],
    rating: 4.9,
    reviewCount: 73,
    sessionsCompleted: 87,
    nextAvailable: 'Today, 5:00 PM',
    available: true,
    hourlyRate: '$45 / session',
    languages: ['Arabic', 'English'],
  },
  {
    id: 'mentor-2',
    name: 'Eng. Khaled Hamdy',
    initials: 'KH',
    title: 'Engineering Manager',
    company: 'Amazon',
    bio: 'Leading backend teams building payment infrastructure. Passionate about mentoring junior engineers and career development.',
    specialties: ['Backend Development', 'Team Leadership', 'Microservices'],
    category: ['backend', 'career'],
    rating: 4.8,
    reviewCount: 102,
    sessionsCompleted: 124,
    nextAvailable: 'Tomorrow, 10:00 AM',
    available: true,
    hourlyRate: '$40 / session',
    languages: ['Arabic', 'English'],
  },
  {
    id: 'mentor-3',
    name: 'Dr. Nour El-Din',
    initials: 'ND',
    title: 'ML Research Engineer',
    company: 'Google DeepMind',
    bio: 'PhD in Machine Learning with focus on NLP and transformer architectures. Published 15+ papers in top-tier conferences.',
    specialties: ['Machine Learning', 'NLP', 'Python'],
    category: ['ml', 'backend'],
    rating: 5.0,
    reviewCount: 48,
    sessionsCompleted: 56,
    nextAvailable: 'Fri, Aug 29',
    available: false,
    hourlyRate: '$55 / session',
    languages: ['Arabic', 'English', 'French'],
  },
  {
    id: 'mentor-4',
    name: 'Eng. Yasmin Farouk',
    initials: 'YF',
    title: 'Senior Frontend Engineer',
    company: 'Spotify',
    bio: 'Building delightful user experiences with React and TypeScript. Expert in design systems, accessibility, and performance optimization.',
    specialties: ['React', 'TypeScript', 'Design Systems'],
    category: ['frontend'],
    rating: 4.9,
    reviewCount: 61,
    sessionsCompleted: 79,
    nextAvailable: 'Today, 7:00 PM',
    available: true,
    hourlyRate: '$35 / session',
    languages: ['Arabic', 'English'],
  },
  {
    id: 'mentor-5',
    name: 'Eng. Ahmed Mostafa',
    initials: 'AM',
    title: 'Staff Engineer',
    company: 'Meta',
    bio: 'Full-stack engineer with deep expertise in system design and large-scale data processing. Previously built real-time analytics systems.',
    specialties: ['System Design', 'Data Engineering', 'Full Stack'],
    category: ['system-design', 'backend'],
    rating: 4.7,
    reviewCount: 89,
    sessionsCompleted: 143,
    nextAvailable: 'Tomorrow, 2:00 PM',
    available: true,
    hourlyRate: '$50 / session',
    languages: ['Arabic', 'English'],
  },
  {
    id: 'mentor-6',
    name: 'Dr. Hana Selim',
    initials: 'HS',
    title: 'Director of Engineering',
    company: 'Careem',
    bio: 'Engineering leader with 15+ years experience. Expert in building and scaling engineering teams in MENA region startups.',
    specialties: ['Engineering Leadership', 'Career Growth', 'Startup Culture'],
    category: ['career'],
    rating: 4.9,
    reviewCount: 95,
    sessionsCompleted: 167,
    nextAvailable: 'Sat, Aug 30',
    available: true,
    hourlyRate: '$60 / session',
    languages: ['Arabic', 'English'],
  },
];

/* ── Past Session Card ──────────────────────────────────────────────────── */

interface PastSession {
  id: string;
  mentorName: string;
  mentorInitials: string;
  topic: string;
  date: string;
  rating: number;
  keyTakeaway: string;
  recordingUrl?: string;
  recommendedResources?: { title: string; url: string }[];
  mentorNotes?: string;
}

const pastSessions: PastSession[] = [
  {
    id: 'past-1',
    mentorName: 'Eng. Sara El-Kady',
    mentorInitials: 'SE',
    topic: 'REST API Design Best Practices',
    date: 'Aug 20, 2026',
    rating: 5,
    keyTakeaway: 'Learned about resource naming conventions, pagination patterns, and HATEOAS principles.',
    recordingUrl: 'https://zoom.us/rec/play/xyz-api-design',
    recommendedResources: [
      { title: 'Designing Quality APIs (Book)', url: 'https://example.com/books/api-design' },
      { title: 'REST API Tutorial (Web)', url: 'https://example.com/rest-tutorial' },
    ],
    mentorNotes: 'Excellent understanding of HTTP methods. Focus on pagination and error handling in your next API design iteration.',
  },
  {
    id: 'past-2',
    mentorName: 'Dr. Hana Selim',
    mentorInitials: 'HS',
    topic: 'Navigating Your First Software Role',
    date: 'Aug 15, 2026',
    rating: 5,
    keyTakeaway: 'Mapped out a 6-month career roadmap focusing on backend specialization.',
    recordingUrl: 'https://zoom.us/rec/play/abc-first-role',
    recommendedResources: [
      { title: 'Backend Developer Roadmap (GitHub)', url: 'https://github.com/kamranahmedse/developer-roadmap' },
    ],
    mentorNotes: 'Ahmad has great passion. We set goals around system architecture and database index tuning.',
  },
];

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function MentorConsultationPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMentors = allMentors.filter((mentor) => {
    const matchesFilter = activeFilter === 'all' || mentor.category.includes(activeFilter);
    const matchesSearch =
      searchQuery === '' ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fade-in_0.4s_ease] py-2 sm:py-6">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#0B0F19]/45">
          <span>Mentorship Network</span>
          <span>•</span>
          <span>{allMentors.length} Mentors Available</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
          Find Your <span className="text-student-500">Industry Mentor</span>
        </h1>
        <p className="text-[15px] text-[#0B0F19]/55 max-w-xl leading-relaxed">
          Connect 1-to-1 with experienced engineers from top tech companies. Get personalized career guidance, code reviews, and interview preparation.
        </p>
      </div>

      {/* ── Search & Filter Bar ──────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#0B0F19]/35" />
          <input
            id="mentor-search"
            type="text"
            placeholder="Search by name, specialty, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full pl-11 pr-4 py-3.5 rounded-2xl
              bg-white border border-[#0B0F19]/[0.08]
              text-[14px] text-[#0B0F19] placeholder:text-[#0B0F19]/35
              focus:outline-none focus:border-student-500/40 focus:shadow-[0_0_0_3px_rgba(0,86,214,0.1)]
              transition-all duration-200
            "
          />
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {specialtyFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`
                  inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                  text-[12.5px] font-semibold transition-all duration-200
                  ${isActive
                    ? 'bg-student-500 text-white shadow-[0_4px_12px_rgba(0,86,214,0.25)]'
                    : 'bg-white text-[#0B0F19]/60 border border-[#0B0F19]/[0.08] hover:border-student-500/30 hover:text-student-500'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Mentors Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMentors.map((mentor, idx) => (
          <div
            key={mentor.id}
            className="
              bg-white rounded-3xl p-6 border border-[#0B0F19]/[0.05]
              shadow-[0_2px_16px_rgba(0,0,0,0.02)]
              hover:border-student-500/25 hover:-translate-y-0.5
              hover:shadow-[0_16px_40px_rgba(0,86,214,0.1)]
              transition-all duration-300 group space-y-4
            "
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Header Row */}
            <div className="flex items-start gap-3.5">
              <div className="relative shrink-0">
                <div className="w-13 h-13 rounded-2xl bg-student-500 text-white flex items-center justify-center text-base font-bold shadow-[0_4px_12px_rgba(0,86,214,0.25)]">
                  {mentor.initials}
                </div>
                {mentor.available && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#10b981] ring-2 ring-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-[#0B0F19] truncate">{mentor.name}</h3>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[12px] font-bold text-[#0B0F19]/70">{mentor.rating}</span>
                    <span className="text-[11px] text-[#0B0F19]/35">({mentor.reviewCount})</span>
                  </div>
                </div>
                <p className="text-[12.5px] text-[#0B0F19]/50">{mentor.title}</p>
                <p className="text-[12px] text-student-500 font-semibold">{mentor.company}</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[13px] text-[#0B0F19]/55 leading-relaxed line-clamp-2">
              {mentor.bio}
            </p>

            {/* Specialties */}
            <div className="flex flex-wrap gap-1.5">
              {mentor.specialties.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-0.5 rounded-lg bg-[#FAF9F6] border border-[#0B0F19]/[0.04] text-[11px] font-semibold text-[#0B0F19]/60"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#0B0F19]/[0.04]">
              <div className="flex items-center gap-4 text-[11px] text-[#0B0F19]/45">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-student-500" />
                  <span className="font-medium">{mentor.nextAvailable}</span>
                </div>
                <span>{mentor.sessionsCompleted} sessions</span>
              </div>

              <Link
                to="/student/book-session"
                className="
                  inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                  bg-student-500 text-white text-[12px] font-bold
                  hover:bg-student-600 active:scale-[0.97]
                  transition-all duration-200 shadow-sm
                  group-hover:shadow-[0_4px_12px_rgba(0,86,214,0.25)]
                "
              >
                Book Session
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="py-16 text-center">
          <Users className="w-10 h-10 mx-auto text-[#0B0F19]/20 mb-3" />
          <p className="text-[15px] font-semibold text-[#0B0F19]/40">No mentors match your search</p>
          <p className="text-[13px] text-[#0B0F19]/30 mt-1">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* ── Past Sessions ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-student-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B0F19]/50">
            Past Session Notes
          </h2>
        </div>

        <div className="space-y-3">
          {pastSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl p-5 border border-[#0B0F19]/[0.05] space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-student-500/15 text-student-500 flex items-center justify-center text-[11px] font-bold">
                    {session.mentorInitials}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#0B0F19]">{session.topic}</p>
                    <p className="text-[11px] text-[#0B0F19]/45">
                      {session.mentorName} • {session.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: session.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Key Takeaway */}
              <p className="text-[12.5px] text-[#0B0F19]/55 leading-relaxed pl-10.5">
                <span className="font-semibold text-[#0B0F19]/70">Key Takeaway:</span>{' '}
                {session.keyTakeaway}
              </p>

              {/* Detailed Feedback & Recording & Resources (with separator) */}
              {(session.recordingUrl || session.mentorNotes || session.recommendedResources) && (
                <div className="pl-10.5 pt-3 border-t border-[#0B0F19]/[0.03] space-y-3.5">
                  {/* Recording Link */}
                  {session.recordingUrl && (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11.5px] font-bold text-[#0B0F19]/70 uppercase tracking-wider">Session Recording:</span>
                      <a
                        href={session.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-student-50 border border-student-100 text-student-600 text-[11px] font-bold hover:bg-student-100 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Watch Recording
                      </a>
                    </div>
                  )}

                  {/* Mentor Notes */}
                  {session.mentorNotes && (
                    <div className="space-y-1">
                      <p className="text-[11.5px] font-bold text-[#0B0F19]/70 uppercase tracking-wider">Mentor Notes & Feedback:</p>
                      <p className="text-[12px] text-[#0B0F19]/60 leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-[#0B0F19]/[0.03]">
                        {session.mentorNotes}
                      </p>
                    </div>
                  )}

                  {/* Recommended Resources */}
                  {session.recommendedResources && session.recommendedResources.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[11.5px] font-bold text-[#0B0F19]/70 uppercase tracking-wider">Recommended Resources:</p>
                      <div className="flex flex-wrap gap-2">
                        {session.recommendedResources.map((res) => (
                          <a
                            key={res.title}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#0B0F19]/[0.06] text-student-600 text-[11px] font-semibold hover:border-student-300 hover:bg-student-50/50 transition-colors"
                          >
                            <BookOpen className="w-3 h-3 text-student-500" />
                            {res.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
