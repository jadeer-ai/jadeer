/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — ADMIN SERVICE & API DATA LAYER
   ─────────────────────────────────────────────────────────────────────────
   Provides dynamic management, telemetry telemetry, and CRUD operations
   for Users, Profiles, Job Listings, Applications, and CR Verifications.
   Mirrors the Prisma schema data model and supports live client-side reactive
   mutations with localStorage persistence.
   ═══════════════════════════════════════════════════════════════════════════ */

export type UserRole = 'STUDENT' | 'GRADUATE' | 'EMPLOYER' | 'ADMIN';
export type AuthProvider = 'EMAIL' | 'GOOGLE' | 'GITHUB';
export type SoftwareTrack =
  | 'SOFTWARE_ENGINEERING'
  | 'BACKEND'
  | 'FRONTEND'
  | 'FULLSTACK'
  | 'EMBEDDED_SYSTEMS'
  | 'MOBILE'
  | 'DEVOPS'
  | 'DATA_ENGINEERING'
  | 'AI_ML'
  | 'CYBERSECURITY';

export type SeniorityLevel = 'INTERN' | 'JUNIOR' | 'MID_LEVEL';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
export type LocationType = 'ON_SITE' | 'HYBRID' | 'REMOTE';
export type JobStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED';
export type ApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'AI_INTERVIEW'
  | 'HUMAN_INTERVIEW'
  | 'PROJECT_ASSESSMENT'
  | 'SHORTLISTED'
export type AssessmentType =
  | 'CODING_CHALLENGE'
  | 'SYSTEM_DESIGN'
  | 'CODE_REVIEW'
  | 'TECHNICAL_QUIZ';

export type TargetAudience = 'student' | 'grad' | 'all';

export type AssessmentDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type AssessmentStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
  weight: number; // percentage or points
}

export interface RubricDimension {
  id: string;
  dimensionName: string;
  weight: number; // e.g. 30 (%)
  description: string;
}

export interface AdminAssessmentRecord {
  id: string;
  title: string;
  description: string;
  softwareTrack: SoftwareTrack;
  type: AssessmentType;
  difficulty: AssessmentDifficulty;
  status: AssessmentStatus;
  targetAudience: TargetAudience;
  timeLimitMinutes: number;
  passingScore: number;
  problemStatement: string;
  starterCode: string;
  language: string;
  testCases: TestCase[];
  rubric: RubricDimension[];
  tags: string[];
  totalSubmissions: number;
  avgScore: number;
  createdAt: string;
  updatedAt: string;
}

export type ConsultationStatus =
  | 'PENDING_APPROVAL'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ConsultationTopic =
  | 'CAREER_ROADMAP'
  | 'SYSTEM_DESIGN'
  | 'CODE_REVIEW'
  | 'MOCK_INTERVIEW'
  | 'RESUME_CALIBRATION'
  | 'PORTFOLIO_CRITIQUE';

export interface AdminConsultationRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentTrack: SoftwareTrack;
  mentorId: string;
  mentorName: string;
  mentorTitle: string;
  mentorCompany: string;
  topic: ConsultationTopic;
  topicTitle: string;
  notes?: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  status: ConsultationStatus;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export type CandidateType = 'STUDENT' | 'GRADUATE';

export interface AdminUserRecord {
  id: string;
  email: string;
  role: UserRole;
  candidateType?: CandidateType;
  authProvider: AuthProvider;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  // Attached Profile info
  studentProfile?: {
    id: string;
    fullName: string;
    university: string;
    graduationYear: number;
    softwareTrack: SoftwareTrack;
    bio: string;
    githubUrl: string;
    linkedinUrl: string;
    city: string;
    country: string;
  };
  companyProfile?: {
    id: string;
    companyName: string;
    companyInitials: string;
    industry: string;
    companySize: string;
    location: string;
    workModel: LocationType;
    website: string;
    commercialRegistrationNumber: string;
    isCRVerified: boolean;
    contactName: string;
    contactRole: string;
  };
}

export interface AdminJobListingRecord {
  id: string;
  companyId: string;
  companyName: string;
  companyInitials: string;
  title: string;
  softwareTrack: SoftwareTrack;
  seniorityLevel: SeniorityLevel;
  employmentType: EmploymentType;
  locationType: LocationType;
  location: string;
  description: string;
  responsibilities: string;
  requirements: string;
  skills: string[];
  status: JobStatus;
  targetAudience: TargetAudience;
  minimumMatchScore: number;
  enableAIInterview: boolean;
  enableProjectAssessment: boolean;
  publishedAt: string;
  createdAt: string;
  applicantsCount: number;
  avgMatchScore: number;
}

export interface AdminApplicationRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateTrack: SoftwareTrack;
  candidateRole: UserRole;
  jobListingId: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  matchScore: number;
  aiInterviewScore: number | null;
  projectScore: number | null;
  humanInterviewScore: number | null;
  overallTelemetryScore: number;
  appliedAt: string;
  coverNote: string;
}

export interface AdminMetrics {
  totalUsers: number;
  totalCandidates: number;
  totalEmployers: number;
  verifiedEmployers: number;
  totalJobListings: number;
  activeJobListings: number;
  totalApplications: number;
  avgTelemetryScore: number;
  verificationRate: number;
  totalAssessments: number;
  activeAssessments: number;
  totalConsultations: number;
  upcomingConsultations: number;
  completedConsultations: number;
  avgMentorRating: number;
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEFAULT SEED DATA (Direct match with Prisma seed.ts)
   ═══════════════════════════════════════════════════════════════════════════ */

const initialUsersSeed: AdminUserRecord[] = [
  {
    id: 'usr-adm-001',
    email: 'admin@jadeer.io',
    role: 'ADMIN',
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    createdAt: '2026-01-10T08:00:00.000Z',
    lastLoginAt: '2026-08-28T19:40:00.000Z',
  },
  {
    id: 'usr-emp-001',
    email: 'talent@jadeer.io',
    role: 'EMPLOYER',
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    createdAt: '2026-02-01T10:30:00.000Z',
    lastLoginAt: '2026-08-28T15:10:00.000Z',
    companyProfile: {
      id: 'cmp-001',
      companyName: 'Jadeer Technologies Inc.',
      companyInitials: 'JT',
      industry: 'FinTech & Cloud Infrastructure',
      companySize: '51-200 employees',
      location: 'Riyadh, Saudi Arabia',
      workModel: 'HYBRID',
      website: 'https://jadeer.io',
      commercialRegistrationNumber: '1010894231',
      isCRVerified: true,
      contactName: 'Sultan Al-Otaibi',
      contactRole: 'Head of Engineering Talent',
    },
  },
  {
    id: 'usr-emp-002',
    email: 'engineering@tamara.co',
    role: 'EMPLOYER',
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    createdAt: '2026-02-15T11:00:00.000Z',
    lastLoginAt: '2026-08-27T18:22:00.000Z',
    companyProfile: {
      id: 'cmp-002',
      companyName: 'Tamara',
      companyInitials: 'TM',
      industry: 'FinTech — Buy Now Pay Later',
      companySize: '201-500 employees',
      location: 'Riyadh, Saudi Arabia',
      workModel: 'HYBRID',
      website: 'https://tamara.co',
      commercialRegistrationNumber: '1010567890',
      isCRVerified: true,
      contactName: 'Fahad Al-Rashidi',
      contactRole: 'VP of Engineering',
    },
  },
  {
    id: 'usr-emp-003',
    email: 'careers@lean.sa',
    role: 'EMPLOYER',
    authProvider: 'EMAIL',
    isVerified: false,
    isActive: true,
    createdAt: '2026-08-20T09:15:00.000Z',
    lastLoginAt: '2026-08-25T12:00:00.000Z',
    companyProfile: {
      id: 'cmp-003',
      companyName: 'Lean Technologies',
      companyInitials: 'LT',
      industry: 'Open Banking & API Infrastructure',
      companySize: '51-200 employees',
      location: 'Riyadh, Saudi Arabia',
      workModel: 'REMOTE',
      website: 'https://leantech.me',
      commercialRegistrationNumber: '1010992341',
      isCRVerified: false,
      contactName: 'Nasser Al-Subaie',
      contactRole: 'Engineering Manager',
    },
  },
  {
    id: 'usr-cnd-001',
    email: 'ahmad.alhassan@jadeer.io',
    role: 'GRADUATE',
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    createdAt: '2026-03-01T09:00:00.000Z',
    lastLoginAt: '2026-08-28T14:30:00.000Z',
    studentProfile: {
      id: 'stu-001',
      fullName: 'Ahmad Al-Hassan',
      university: 'King Fahd University of Petroleum & Minerals (KFUPM)',
      graduationYear: 2025,
      softwareTrack: 'BACKEND',
      bio: 'Specialized in high-throughput distributed microservices, REST/gRPC APIs, and PostgreSQL optimization.',
      githubUrl: 'https://github.com/ahmad-alhassan',
      linkedinUrl: 'https://linkedin.com/in/ahmad-alhassan',
      city: 'Dhahran',
      country: 'Saudi Arabia',
    },
  },
  {
    id: 'usr-cnd-002',
    email: 'sara.fahad@jadeer.io',
    role: 'GRADUATE',
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    createdAt: '2026-03-04T14:20:00.000Z',
    lastLoginAt: '2026-08-28T11:05:00.000Z',
    studentProfile: {
      id: 'stu-002',
      fullName: 'Sara Fahad',
      university: 'Princess Nourah bint Abdulrahman University',
      graduationYear: 2025,
      softwareTrack: 'FRONTEND',
      bio: 'UI/UX enthusiast, building reactive web architectures with React, TypeScript, and Tailwind CSS.',
      githubUrl: 'https://github.com/sara-fahad',
      linkedinUrl: 'https://linkedin.com/in/sara-fahad',
      city: 'Riyadh',
      country: 'Saudi Arabia',
    },
  },
  {
    id: 'usr-cnd-003',
    email: 'rayan.alghamdi@jadeer.io',
    role: 'STUDENT',
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    createdAt: '2026-03-10T16:45:00.000Z',
    lastLoginAt: '2026-08-27T20:15:00.000Z',
    studentProfile: {
      id: 'stu-003',
      fullName: 'Rayan Al-Ghamdi',
      university: 'King Saud University (KSU)',
      graduationYear: 2026,
      softwareTrack: 'FULLSTACK',
      bio: 'Full-stack software developer passionate about cloud-native systems and rapid iteration.',
      githubUrl: 'https://github.com/rayan-alghamdi',
      linkedinUrl: 'https://linkedin.com/in/rayan-alghamdi',
      city: 'Riyadh',
      country: 'Saudi Arabia',
    },
  },
  {
    id: 'usr-cnd-004',
    email: 'mohammed.khalid@jadeer.io',
    role: 'GRADUATE',
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    createdAt: '2026-03-15T12:00:00.000Z',
    lastLoginAt: '2026-08-26T17:50:00.000Z',
    studentProfile: {
      id: 'stu-004',
      fullName: 'Mohammed Khalid',
      university: 'King Abdulaziz University',
      graduationYear: 2025,
      softwareTrack: 'DEVOPS',
      bio: 'Automating continuous integration, Docker containers, Kubernetes deployments, and cloud security.',
      githubUrl: 'https://github.com/mohammed-khalid',
      linkedinUrl: 'https://linkedin.com/in/mohammed-khalid',
      city: 'Jeddah',
      country: 'Saudi Arabia',
    },
  },
  {
    id: 'usr-cnd-005',
    email: 'nora.rashid@jadeer.io',
    role: 'STUDENT',
    authProvider: 'EMAIL',
    isVerified: true,
    isActive: true,
    createdAt: '2026-03-20T10:10:00.000Z',
    lastLoginAt: '2026-08-28T09:30:00.000Z',
    studentProfile: {
      id: 'stu-005',
      fullName: 'Nora Rashid',
      university: 'Imam Abdulrahman Bin Faisal University',
      graduationYear: 2026,
      softwareTrack: 'AI_ML',
      bio: 'Researching computer vision and NLP model fine-tuning with Python, PyTorch, and HuggingFace.',
      githubUrl: 'https://github.com/nora-rashid',
      linkedinUrl: 'https://linkedin.com/in/nora-rashid',
      city: 'Dammam',
      country: 'Saudi Arabia',
    },
  },
];

const initialJobListingsSeed: AdminJobListingRecord[] = [
  {
    id: 'job-001',
    companyId: 'cmp-001',
    companyName: 'Jadeer Technologies Inc.',
    companyInitials: 'JT',
    title: 'Backend Engineer — Payment Systems',
    softwareTrack: 'BACKEND',
    seniorityLevel: 'JUNIOR',
    employmentType: 'FULL_TIME',
    locationType: 'HYBRID',
    location: 'Riyadh, Saudi Arabia',
    description: 'Design and build scalable payment processing microservices using Node.js and PostgreSQL.',
    responsibilities: 'API development, database optimization, integration with third-party payment gateways, writing comprehensive tests.',
    requirements: 'BS in Computer Science or equivalent. Strong understanding of REST APIs, SQL, and distributed systems.',
    skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'REST API', 'Microservices'],
    status: 'ACTIVE',
    targetAudience: 'grad',
    minimumMatchScore: 72,
    enableAIInterview: true,
    enableProjectAssessment: true,
    publishedAt: '2026-04-01T09:00:00.000Z',
    createdAt: '2026-04-01T08:30:00.000Z',
    applicantsCount: 14,
    avgMatchScore: 84,
  },
  {
    id: 'job-002',
    companyId: 'cmp-001',
    companyName: 'Jadeer Technologies Inc.',
    companyInitials: 'JT',
    title: 'Frontend Developer — Design Systems',
    softwareTrack: 'FRONTEND',
    seniorityLevel: 'JUNIOR',
    employmentType: 'FULL_TIME',
    locationType: 'REMOTE',
    location: 'Remote (Saudi Arabia)',
    description: 'Build and maintain our internal design system and component library using React and Tailwind CSS.',
    responsibilities: 'Component development, accessibility audits, design token management, Storybook documentation.',
    requirements: 'Strong React/TypeScript skills. Eye for detail and UI/UX sensibility.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Storybook', 'Next.js'],
    status: 'ACTIVE',
    targetAudience: 'all',
    minimumMatchScore: 68,
    enableAIInterview: true,
    enableProjectAssessment: true,
    publishedAt: '2026-04-10T10:00:00.000Z',
    createdAt: '2026-04-10T09:15:00.000Z',
    applicantsCount: 9,
    avgMatchScore: 82,
  },
  {
    id: 'job-003',
    companyId: 'cmp-001',
    companyName: 'Jadeer Technologies Inc.',
    companyInitials: 'JT',
    title: 'DevOps Intern — Cloud Infrastructure',
    softwareTrack: 'DEVOPS',
    seniorityLevel: 'INTERN',
    employmentType: 'INTERNSHIP',
    locationType: 'ON_SITE',
    location: 'Riyadh, Saudi Arabia',
    description: 'Assist the platform engineering team in managing CI/CD pipelines and cloud infrastructure on AWS.',
    responsibilities: 'Pipeline maintenance, monitoring dashboards, container orchestration support, documentation.',
    requirements: 'Currently pursuing CS or related degree. Familiarity with Linux, Docker, and basic AWS services.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
    status: 'ACTIVE',
    targetAudience: 'student',
    minimumMatchScore: 60,
    enableAIInterview: true,
    enableProjectAssessment: false,
    publishedAt: '2026-05-01T11:00:00.000Z',
    createdAt: '2026-05-01T10:00:00.000Z',
    applicantsCount: 18,
    avgMatchScore: 88,
  },
  {
    id: 'job-004',
    companyId: 'cmp-002',
    companyName: 'Tamara',
    companyInitials: 'TM',
    title: 'Full-Stack Engineer — Merchant Portal',
    softwareTrack: 'FULLSTACK',
    seniorityLevel: 'MID_LEVEL',
    employmentType: 'FULL_TIME',
    locationType: 'HYBRID',
    location: 'Riyadh, Saudi Arabia',
    description: 'Build and enhance the merchant-facing dashboard for BNPL transaction management and analytics.',
    responsibilities: 'End-to-end feature development, API design, frontend implementation, performance optimization.',
    requirements: '2+ years of full-stack experience. Proficiency in React, Node.js, and SQL databases.',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'System Design'],
    status: 'ACTIVE',
    targetAudience: 'grad',
    minimumMatchScore: 75,
    enableAIInterview: true,
    enableProjectAssessment: true,
    publishedAt: '2026-04-18T14:00:00.000Z',
    createdAt: '2026-04-18T13:00:00.000Z',
    applicantsCount: 12,
    avgMatchScore: 85,
  },
  {
    id: 'job-005',
    companyId: 'cmp-002',
    companyName: 'Tamara',
    companyInitials: 'TM',
    title: 'Mobile Developer — Consumer App (Flutter)',
    softwareTrack: 'MOBILE',
    seniorityLevel: 'JUNIOR',
    employmentType: 'FULL_TIME',
    locationType: 'ON_SITE',
    location: 'Riyadh, Saudi Arabia',
    description: 'Develop and maintain the consumer-facing mobile application for Android and iOS using Flutter.',
    responsibilities: 'Feature development, state management, API integration, app store release management.',
    requirements: 'Experience with Flutter/Dart. Understanding of mobile UX patterns and platform guidelines.',
    skills: ['Flutter', 'Dart', 'REST API', 'Firebase', 'Figma', 'Kotlin'],
    status: 'PAUSED',
    targetAudience: 'student',
    minimumMatchScore: 65,
    enableAIInterview: true,
    enableProjectAssessment: true,
    publishedAt: '2026-05-10T12:00:00.000Z',
    createdAt: '2026-05-10T11:00:00.000Z',
    applicantsCount: 6,
    avgMatchScore: 64,
  },
  {
    id: 'job-006',
    companyId: 'cmp-002',
    companyName: 'Tamara',
    companyInitials: 'TM',
    title: 'AI/ML Engineer — Risk Scoring',
    softwareTrack: 'AI_ML',
    seniorityLevel: 'MID_LEVEL',
    employmentType: 'FULL_TIME',
    locationType: 'HYBRID',
    location: 'Riyadh, Saudi Arabia',
    description: 'Develop and deploy machine learning models for credit risk assessment and fraud detection.',
    responsibilities: 'Model training, feature engineering, A/B testing, model monitoring, research prototyping.',
    requirements: 'MS in CS/Stats or equivalent experience. Proficiency in Python, scikit-learn, and TensorFlow/PyTorch.',
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'Data Engineering', 'PostgreSQL', 'Docker'],
    status: 'DRAFT',
    targetAudience: 'all',
    minimumMatchScore: 80,
    enableAIInterview: true,
    enableProjectAssessment: true,
    publishedAt: '2026-05-20T09:00:00.000Z',
    createdAt: '2026-05-20T08:00:00.000Z',
    applicantsCount: 2,
    avgMatchScore: 82,
  },
];

const initialApplicationsSeed: AdminApplicationRecord[] = [
  {
    id: 'app-001',
    candidateId: 'stu-001',
    candidateName: 'Ahmad Al-Hassan',
    candidateEmail: 'ahmad.alhassan@jadeer.io',
    candidateTrack: 'BACKEND',
    candidateRole: 'GRADUATE',
    jobListingId: 'job-001',
    jobTitle: 'Backend Engineer — Payment Systems',
    companyName: 'Jadeer Technologies Inc.',
    status: 'SHORTLISTED',
    matchScore: 91,
    aiInterviewScore: 88,
    projectScore: 94,
    humanInterviewScore: 90,
    overallTelemetryScore: 91,
    appliedAt: '2026-04-05T10:30:00.000Z',
    coverNote: 'Extensive hands-on expertise building fintech microservices and async worker queues.',
  },
  {
    id: 'app-002',
    candidateId: 'stu-002',
    candidateName: 'Sara Fahad',
    candidateEmail: 'sara.fahad@jadeer.io',
    candidateTrack: 'FRONTEND',
    candidateRole: 'GRADUATE',
    jobListingId: 'job-002',
    jobTitle: 'Frontend Developer — Design Systems',
    companyName: 'Jadeer Technologies Inc.',
    status: 'PROJECT_ASSESSMENT',
    matchScore: 87,
    aiInterviewScore: 85,
    projectScore: 90,
    humanInterviewScore: null,
    overallTelemetryScore: 87,
    appliedAt: '2026-04-12T14:15:00.000Z',
    coverNote: 'Created multi-theme React component libraries and design token pipelines.',
  },
  {
    id: 'app-003',
    candidateId: 'stu-003',
    candidateName: 'Rayan Al-Ghamdi',
    candidateEmail: 'rayan.alghamdi@jadeer.io',
    candidateTrack: 'FULLSTACK',
    candidateRole: 'STUDENT',
    jobListingId: 'job-004',
    jobTitle: 'Full-Stack Engineer — Merchant Portal',
    companyName: 'Fintech Systems Partner',
    status: 'HUMAN_INTERVIEW',
    matchScore: 84,
    aiInterviewScore: 82,
    projectScore: 86,
    humanInterviewScore: 80,
    overallTelemetryScore: 83,
    appliedAt: '2026-04-20T09:40:00.000Z',
    coverNote: 'Excited to bring full-stack TypeScript and clean code patterns to BNPL merchant tools.',
  },
  {
    id: 'app-004',
    candidateId: 'stu-004',
    candidateName: 'Mohammed Khalid',
    candidateEmail: 'mohammed.khalid@jadeer.io',
    candidateTrack: 'DEVOPS',
    candidateRole: 'GRADUATE',
    jobListingId: 'job-003',
    jobTitle: 'DevOps Intern — Cloud Infrastructure',
    companyName: 'Jadeer Technologies Inc.',
    status: 'SHORTLISTED',
    matchScore: 89,
    aiInterviewScore: 86,
    projectScore: null,
    humanInterviewScore: 92,
    overallTelemetryScore: 89,
    appliedAt: '2026-05-03T11:00:00.000Z',
    coverNote: 'Strong foundation in Docker containerization, Kubernetes helm charts, and GitHub Actions.',
  },
  {
    id: 'app-005',
    candidateId: 'stu-005',
    candidateName: 'Nora Rashid',
    candidateEmail: 'nora.rashid@jadeer.io',
    candidateTrack: 'AI_ML',
    candidateRole: 'STUDENT',
    jobListingId: 'job-006',
    jobTitle: 'AI/ML Engineer — Risk Scoring',
    companyName: 'Fintech Systems Partner',
    status: 'SUBMITTED',
    matchScore: 82,
    aiInterviewScore: null,
    projectScore: null,
    humanInterviewScore: null,
    overallTelemetryScore: 82,
    appliedAt: '2026-05-22T15:30:00.000Z',
    coverNote: 'Specialized in transformer models, tabular data classification, and fraud detection algorithms.',
  },
];

export const initialAssessmentsSeed: AdminAssessmentRecord[] = [
  {
    id: 'asm-001',
    title: 'Concurrent Sliding-Window Rate Limiter',
    description: 'Implement a high-throughput sliding window rate limiter supporting millisecond windows and multi-tenant keys.',
    softwareTrack: 'BACKEND',
    type: 'CODING_CHALLENGE',
    difficulty: 'INTERMEDIATE',
    status: 'ACTIVE',
    targetAudience: 'grad',
    timeLimitMinutes: 45,
    passingScore: 75,
    problemStatement: `### Problem Description

In high-throughput microservices, protecting downstream APIs requires strict rate limiting.
You must implement a \`SlidingWindowRateLimiter\` class that:

1. **Tracks requests** by \`tenantId\` within a sliding time window (\`windowMs\`).
2. **Allows up to** \`maxRequests\` per window.
3. **Rejects requests exceeding the threshold** with exact retry-after countdowns.
4. **Automatically prunes expired timestamps** to maintain $O(1)$ amortized memory complexity.

#### Constraints
- Time window: $100\\text{ms} \\le \\text{windowMs} \\le 60,000\\text{ms}$
- Maximum requests per window: $1 \\le \\text{maxRequests} \\le 10,000$
- Concurrency: Must be thread-safe / asynchronous safe.`,
    starterCode: `export class SlidingWindowRateLimiter {
  private windowMs: number;
  private maxRequests: number;
  private requestLog: Map<string, number[]>;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requestLog = new Map();
  }

  public allowRequest(tenantId: string, timestamp: number = Date.now()): { allowed: boolean; retryAfterMs?: number } {
    // TODO: Implement sliding window rate limit evaluation
    return { allowed: true };
  }
}`,
    language: 'TypeScript',
    testCases: [
      {
        id: 'tc-001',
        input: 'allowRequest("tenant-a", 1000) [x5]',
        expectedOutput: '{ allowed: true }',
        isHidden: false,
        explanation: 'Initial requests under threshold should pass.',
        weight: 30,
      },
      {
        id: 'tc-002',
        input: 'allowRequest("tenant-a", 1050) [6th request]',
        expectedOutput: '{ allowed: false, retryAfterMs: 950 }',
        isHidden: false,
        explanation: 'Requests exceeding limit within window must be rejected with retry countdown.',
        weight: 35,
      },
      {
        id: 'tc-003',
        input: 'Concurrent multi-tenant burst (1,000 requests across 10 keys)',
        expectedOutput: 'All tenant partitions strictly isolated',
        isHidden: true,
        explanation: 'Verifies memory cleanup and tenant partitioning.',
        weight: 35,
      },
    ],
    rubric: [
      { id: 'rb-1', dimensionName: 'Algorithmic Correctness', weight: 40, description: 'Correct timestamp sliding window mechanics without edge-case leaks.' },
      { id: 'rb-2', dimensionName: 'Memory & Space Efficiency', weight: 30, description: 'Periodic eviction of stale log arrays preventing unbounded memory growth.' },
      { id: 'rb-3', dimensionName: 'Code Modularity & Types', weight: 30, description: 'Clean TypeScript interfaces and defensive parameter checks.' },
    ],
    tags: ['Algorithms', 'Backend', 'Rate Limiting', 'Concurrency', 'TypeScript'],
    totalSubmissions: 14,
    avgScore: 84,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-08-20T14:30:00.000Z',
  },
  {
    id: 'asm-002',
    title: 'Virtualized Infinite-Scroll Data Grid',
    description: 'Build a high-performance virtualized table component capable of rendering 100,000+ records with 60 FPS scrolling.',
    softwareTrack: 'FRONTEND',
    type: 'CODING_CHALLENGE',
    difficulty: 'INTERMEDIATE',
    status: 'ACTIVE',
    targetAudience: 'all',
    timeLimitMinutes: 60,
    passingScore: 80,
    problemStatement: `### Problem Description

Develop a \`VirtualList\` engine that only mounts DOM nodes for rows currently within the visible viewport buffer.

1. **Calculate visible slice**: Given \`totalItems\`, \`itemHeight\`, \`viewportHeight\`, and \`scrollTop\`, determine the \`startIndex\` and \`endIndex\`.
2. **Buffer rows**: Add an overscan buffer of 3 items above and below the viewport.
3. **Offset calculation**: Provide \`topOffset\` and \`totalHeight\` for proper scroll bar representation.`,
    starterCode: `export interface VirtualSlice {
  startIndex: number;
  endIndex: number;
  topOffset: number;
  totalHeight: number;
}

export function calculateVirtualSlice(
  totalItems: number,
  itemHeight: number,
  viewportHeight: number,
  scrollTop: number,
  overscan: number = 3
): VirtualSlice {
  // TODO: Compute virtual window slice
  return {
    startIndex: 0,
    endIndex: 10,
    topOffset: 0,
    totalHeight: totalItems * itemHeight,
  };
}`,
    language: 'TypeScript',
    testCases: [
      {
        id: 'tc-201',
        input: 'totalItems=1000, itemHeight=40, viewportHeight=400, scrollTop=0',
        expectedOutput: 'startIndex: 0, endIndex: 13, topOffset: 0',
        isHidden: false,
        explanation: 'Top of page rendering with 3 overscan rows.',
        weight: 30,
      },
      {
        id: 'tc-202',
        input: 'totalItems=1000, itemHeight=40, viewportHeight=400, scrollTop=2000',
        expectedOutput: 'startIndex: 47, endIndex: 63, topOffset: 1880',
        isHidden: false,
        explanation: 'Mid-scroll virtual window positioning.',
        weight: 35,
      },
      {
        id: 'tc-203',
        input: 'totalItems=100000, rapid scroll jump to bottom',
        expectedOutput: 'endIndex bounds clamped to 99999 without array out-of-bounds',
        isHidden: true,
        explanation: 'Boundary safety checks.',
        weight: 35,
      },
    ],
    rubric: [
      { id: 'rb-4', dimensionName: 'Math Precision & Offsets', weight: 40, description: 'Pixel-perfect offset calculation preventing jitter during rapid scroll.' },
      { id: 'rb-5', dimensionName: 'DOM Node Conservation', weight: 35, description: 'Maintains fixed node pool regardless of dataset magnitude.' },
      { id: 'rb-6', dimensionName: 'Overscan & UX Buffer', weight: 25, description: 'Smooth visual experience without white flickering on touch scroll.' },
    ],
    tags: ['Frontend', 'Virtualization', 'React', 'Performance', 'DOM'],
    totalSubmissions: 19,
    avgScore: 88,
    createdAt: '2026-03-12T11:30:00.000Z',
    updatedAt: '2026-08-18T09:15:00.000Z',
  },
  {
    id: 'asm-003',
    title: 'Vector Cosine Similarity & Nearest-Neighbor Search Engine',
    description: 'Implement an optimized cosine distance metric and exact top-k vector retrieval engine for dense embeddings.',
    softwareTrack: 'AI_ML',
    type: 'CODING_CHALLENGE',
    difficulty: 'ADVANCED',
    status: 'ACTIVE',
    targetAudience: 'grad',
    timeLimitMinutes: 60,
    passingScore: 80,
    problemStatement: `### Problem Description

Implement a vector search module that processes query embeddings against a corpus of document vectors.

1. **Cosine Similarity**: Compute $S_C(A, B) = \\frac{A \\cdot B}{\\|A\\| \\|B\\|}$ with numerical stability.
2. **Top-K Retrieval**: Extract the top $K$ most similar items sorted by descending similarity.
3. **Threshold Filter**: Exclude any candidates with score below \`minThreshold\`.`,
    starterCode: `import math

def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    # TODO: Compute cosine similarity
    return 0.0

def search_top_k(query_vec: list[float], corpus: list[dict], top_k: int = 5, min_score: float = 0.7) -> list[dict]:
    # TODO: Score and return top K matches
    return []`,
    language: 'Python',
    testCases: [
      {
        id: 'tc-301',
        input: 'vec_a=[1.0, 0.0], vec_b=[1.0, 0.0]',
        expectedOutput: '1.0',
        isHidden: false,
        explanation: 'Identical vectors yield maximum similarity.',
        weight: 30,
      },
      {
        id: 'tc-302',
        input: 'vec_a=[1.0, 0.0], vec_b=[0.0, 1.0]',
        expectedOutput: '0.0',
        isHidden: false,
        explanation: 'Orthogonal vectors yield zero similarity.',
        weight: 35,
      },
      {
        id: 'tc-303',
        input: '1536-dimensional dense embedding batch (10,000 vectors)',
        expectedOutput: 'Top 5 matches sorted with float64 precision',
        isHidden: true,
        explanation: 'High-dimensional performance and zero-vector safety.',
        weight: 35,
      },
    ],
    rubric: [
      { id: 'rb-7', dimensionName: 'Vector Math Precision', weight: 45, description: 'Correct dot product and Euclidean norm calculation with zero-norm guard.' },
      { id: 'rb-8', dimensionName: 'Heap / Sort Optimization', weight: 35, description: 'Min-heap top-k retrieval instead of full $O(N \\log N)$ sort.' },
      { id: 'rb-9', dimensionName: 'Dimensionality Agility', weight: 20, description: 'Supports dynamic dimension sizes seamlessly.' },
    ],
    tags: ['AI/ML', 'Vector Search', 'Embeddings', 'Python', 'Linear Algebra'],
    totalSubmissions: 8,
    avgScore: 82,
    createdAt: '2026-04-02T16:00:00.000Z',
    updatedAt: '2026-08-25T11:10:00.000Z',
  },
  {
    id: 'asm-004',
    title: 'Container Health & Auto-Restart Daemon',
    description: 'Build a container health audit script with exponential backoff and webhook alerting.',
    softwareTrack: 'DEVOPS',
    type: 'CODING_CHALLENGE',
    difficulty: 'INTERMEDIATE',
    status: 'ACTIVE',
    targetAudience: 'student',
    timeLimitMinutes: 45,
    passingScore: 70,
    problemStatement: `### Problem Description

Develop an automated DevOps health monitor that tracks microservice container uptime, memory utilization, and error logs, automatically initiating remediation protocols when health checks fail.`,
    starterCode: `import time

class ContainerHealthMonitor:
    def __init__(self, max_memory_mb: int = 512, max_restarts: int = 3):
        self.max_memory = max_memory_mb
        self.max_restarts = max_restarts
        self.restart_counts = {}

    def check_health(self, container_id: str, memory_usage_mb: int, is_responding: bool) -> dict:
        # TODO: Implement health check & remediation trigger
        return {"status": "HEALTHY", "action": "NONE"}`,
    language: 'Python',
    testCases: [
      {
        id: 'tc-401',
        input: 'check_health("app-1", memory=300, is_responding=True)',
        expectedOutput: 'status: HEALTHY, action: NONE',
        isHidden: false,
        explanation: 'Normal operational parameters.',
        weight: 35,
      },
      {
        id: 'tc-402',
        input: 'check_health("app-1", memory=600, is_responding=True)',
        expectedOutput: 'status: DEGRADED, action: RESTART',
        isHidden: false,
        explanation: 'Memory ceiling breach triggers remediation.',
        weight: 35,
      },
      {
        id: 'tc-403',
        input: 'Consecutive failures exceeding max_restarts',
        expectedOutput: 'status: CRITICAL, action: ALERT_ONCALL',
        isHidden: true,
        explanation: 'Escalation policy enforcement.',
        weight: 30,
      },
    ],
    rubric: [
      { id: 'rb-10', dimensionName: 'Remediation Logic', weight: 40, description: 'Clean state tracking of failure thresholds.' },
      { id: 'rb-11', dimensionName: 'Escalation Policy', weight: 35, description: 'Stops crash loops when containers fail to recover.' },
      { id: 'rb-12', dimensionName: 'Log Output Formatting', weight: 25, description: 'Structured JSON log emission.' },
    ],
    tags: ['DevOps', 'Docker', 'Reliability', 'Automation', 'Python'],
    totalSubmissions: 11,
    avgScore: 79,
    createdAt: '2026-04-18T13:45:00.000Z',
    updatedAt: '2026-08-22T17:20:00.000Z',
  },
];

export const initialConsultationsSeed: AdminConsultationRecord[] = [
  {
    id: 'csl-001',
    studentId: 'stu-001',
    studentName: 'Ahmad Al-Hassan',
    studentEmail: 'ahmad.alhassan@jadeer.io',
    studentTrack: 'BACKEND',
    mentorId: 'mnt-001',
    mentorName: 'Tariq Al-Mansoor',
    mentorTitle: 'Principal Systems Architect',
    mentorCompany: 'Jadeer Calibration Lead',
    topic: 'SYSTEM_DESIGN',
    topicTitle: 'Distributed Financial Ledgers & Kafka Event Streaming',
    notes: 'Focus on idempotent payment webhooks and distributed lock contention under high TPS.',
    scheduledAt: '2026-08-30T14:00:00.000Z',
    durationMinutes: 45,
    meetingLink: 'https://meet.jadeer.io/csl-001',
    status: 'SCHEDULED',
    createdAt: '2026-08-24T10:00:00.000Z',
    updatedAt: '2026-08-24T10:30:00.000Z',
  },
  {
    id: 'csl-002',
    studentId: 'stu-002',
    studentName: 'Sara Fahad',
    studentEmail: 'sara.fahad@jadeer.io',
    studentTrack: 'FRONTEND',
    mentorId: 'mnt-002',
    mentorName: 'Layla Al-Khatib',
    mentorTitle: 'Staff Frontend Engineer',
    mentorCompany: 'Jadeer Frontend Lead',
    topic: 'CODE_REVIEW',
    topicTitle: 'Production Design Tokens & Virtualized Table Optimization',
    notes: 'Reviewing custom React hook virtualizer and performance profiling in Chrome DevTools.',
    scheduledAt: '2026-08-31T16:30:00.000Z',
    durationMinutes: 45,
    meetingLink: 'https://meet.jadeer.io/csl-002',
    status: 'SCHEDULED',
    createdAt: '2026-08-25T11:15:00.000Z',
    updatedAt: '2026-08-25T11:15:00.000Z',
  },
  {
    id: 'csl-003',
    studentId: 'stu-003',
    studentName: 'Rayan Al-Ghamdi',
    studentEmail: 'rayan.alghamdi@jadeer.io',
    studentTrack: 'FULLSTACK',
    mentorId: 'mnt-003',
    mentorName: 'Sultan Al-Otaibi',
    mentorTitle: 'Head of Engineering Talent',
    mentorCompany: 'Jadeer Calibration Lead',
    topic: 'MOCK_INTERVIEW',
    topicTitle: 'Full-Stack System Calibration & Live Coding Sprint',
    notes: 'Simulated high-pressure technical interview covering Postgres query planning.',
    scheduledAt: '2026-08-28T11:00:00.000Z',
    durationMinutes: 60,
    meetingLink: 'https://meet.jadeer.io/csl-003',
    status: 'COMPLETED',
    rating: 5,
    feedback: 'Excellent grasp of PostgreSQL indexing and Next.js server actions. Recommended for mid-level fast-track.',
    createdAt: '2026-08-20T09:00:00.000Z',
    updatedAt: '2026-08-28T12:05:00.000Z',
  },
  {
    id: 'csl-004',
    studentId: 'stu-004',
    studentName: 'Mohammed Khalid',
    studentEmail: 'mohammed.khalid@jadeer.io',
    studentTrack: 'DEVOPS',
    mentorId: 'mnt-004',
    mentorName: 'Omar Al-Shehri',
    mentorTitle: 'Lead Cloud Platform SRE',
    mentorCompany: 'Cloud Infrastructure Lead',
    topic: 'CAREER_ROADMAP',
    topicTitle: 'Kubernetes Operator Architecture & CI/CD Security',
    notes: 'Wants guidance on transitioning from Docker Compose to multi-cluster EKS pipelines.',
    scheduledAt: '2026-09-02T10:00:00.000Z',
    durationMinutes: 45,
    meetingLink: 'https://meet.jadeer.io/csl-004',
    status: 'PENDING_APPROVAL',
    createdAt: '2026-08-27T14:20:00.000Z',
    updatedAt: '2026-08-27T14:20:00.000Z',
  },
  {
    id: 'csl-005',
    studentId: 'stu-005',
    studentName: 'Nora Rashid',
    studentEmail: 'nora.rashid@jadeer.io',
    studentTrack: 'AI_ML',
    mentorId: 'mnt-005',
    mentorName: 'Dr. Khalid Al-Fassi',
    mentorTitle: 'Chief AI Scientist',
    mentorCompany: 'AI Research Lead',
    topic: 'PORTFOLIO_CRITIQUE',
    topicTitle: 'Vector Search Embeddings & LLM Risk Scoring Engines',
    notes: 'In-depth code walk-through of exact and approximate k-NN nearest-neighbor search.',
    scheduledAt: '2026-08-27T15:00:00.000Z',
    durationMinutes: 45,
    meetingLink: 'https://meet.jadeer.io/csl-005',
    status: 'COMPLETED',
    rating: 5,
    feedback: 'Outstanding mathematical grounding in cosine distance metrics. Project ready for venture showcase.',
    createdAt: '2026-08-19T13:00:00.000Z',
    updatedAt: '2026-08-27T16:00:00.000Z',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   STORAGE KEYS & LOCAL SYNC
   ═══════════════════════════════════════════════════════════════════════════ */

const STORAGE_USERS = 'jadeer-admin-users-v1';
const STORAGE_JOBS = 'jadeer-admin-jobs-v1';
const STORAGE_APPS = 'jadeer-admin-apps-v1';
const STORAGE_ASSESSMENTS = 'jadeer-admin-assessments-v1';
const STORAGE_CONSULTATIONS = 'jadeer-admin-consultations-v1';

function loadUsers(): AdminUserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return initialUsersSeed;
}

function loadJobs(): AdminJobListingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_JOBS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return initialJobListingsSeed;
}

function loadApps(): AdminApplicationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_APPS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return initialApplicationsSeed;
}

function loadAssessments(): AdminAssessmentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_ASSESSMENTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return initialAssessmentsSeed;
}

function saveAssessments(assessments: AdminAssessmentRecord[]) {
  try {
    localStorage.setItem(STORAGE_ASSESSMENTS, JSON.stringify(assessments));
  } catch {
    // ignore
  }
}

function loadConsultations(): AdminConsultationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_CONSULTATIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return initialConsultationsSeed;
}

function saveConsultations(consultations: AdminConsultationRecord[]) {
  try {
    localStorage.setItem(STORAGE_CONSULTATIONS, JSON.stringify(consultations));
  } catch {
    // ignore
  }
}

function saveUsers(users: AdminUserRecord[]) {
  try {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  } catch {
    // ignore
  }
}

function saveJobs(jobs: AdminJobListingRecord[]) {
  try {
    localStorage.setItem(STORAGE_JOBS, JSON.stringify(jobs));
  } catch {
    // ignore
  }
}

function saveApps(apps: AdminApplicationRecord[]) {
  try {
    localStorage.setItem(STORAGE_APPS, JSON.stringify(apps));
  } catch {
    // ignore
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN API CLIENT
   ═══════════════════════════════════════════════════════════════════════════ */

export const AdminApiService = {
  // ── Metrics ────────────────────────────────────────────────────────────
  getMetrics(): AdminMetrics {
    const users = loadUsers();
    const jobs = loadJobs();
    const apps = loadApps();

    const candidates = users.filter((u) => u.role === 'STUDENT' || u.role === 'GRADUATE');
    const employers = users.filter((u) => u.role === 'EMPLOYER');
    const verifiedEmployers = employers.filter((e) => e.companyProfile?.isCRVerified);
    const activeJobs = jobs.filter((j) => j.status === 'ACTIVE');
    const assessments = loadAssessments();
    const activeAssessments = assessments.filter((a) => a.status === 'ACTIVE');
    const consultations = loadConsultations();
    const upcomingConsultations = consultations.filter((c) => c.status === 'SCHEDULED' || c.status === 'PENDING_APPROVAL');
    const completedConsultations = consultations.filter((c) => c.status === 'COMPLETED');
    const ratedConsultations = consultations.filter((c) => typeof c.rating === 'number');
    const avgMentorRating =
      ratedConsultations.length > 0
        ? Number(
            (
              ratedConsultations.reduce((sum, c) => sum + (c.rating || 0), 0) /
              ratedConsultations.length
            ).toFixed(1)
          )
        : 5.0;

    const totalTelemetryScore = apps.reduce((acc, a) => acc + a.overallTelemetryScore, 0);
    const avgScore = apps.length > 0 ? Math.round(totalTelemetryScore / apps.length) : 0;
    const verificationRate =
      employers.length > 0 ? Math.round((verifiedEmployers.length / employers.length) * 100) : 0;

    return {
      totalUsers: users.length,
      totalCandidates: candidates.length,
      totalEmployers: employers.length,
      verifiedEmployers: verifiedEmployers.length,
      totalJobListings: jobs.length,
      activeJobListings: activeJobs.length,
      totalApplications: apps.length,
      avgTelemetryScore: avgScore,
      verificationRate,
      totalAssessments: assessments.length,
      activeAssessments: activeAssessments.length,
      totalConsultations: consultations.length,
      upcomingConsultations: upcomingConsultations.length,
      completedConsultations: completedConsultations.length,
      avgMentorRating,
    };
  },

  // ── Consultations & Mentor Sessions ────────────────────────────────────
  getConsultations(filters?: {
    status?: ConsultationStatus;
    track?: SoftwareTrack;
    search?: string;
  }): AdminConsultationRecord[] {
    let list = loadConsultations();

    if (filters?.status) {
      list = list.filter((c) => c.status === filters.status);
    }
    if (filters?.track) {
      list = list.filter((c) => c.studentTrack === filters.track);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.studentName.toLowerCase().includes(q) ||
          c.mentorName.toLowerCase().includes(q) ||
          c.mentorCompany.toLowerCase().includes(q) ||
          c.topicTitle.toLowerCase().includes(q) ||
          (c.notes && c.notes.toLowerCase().includes(q))
      );
    }

    return list;
  },

  getConsultationById(id: string): AdminConsultationRecord | undefined {
    return loadConsultations().find((c) => c.id === id);
  },

  updateConsultationStatus(id: string, status: ConsultationStatus): AdminConsultationRecord[] {
    const list = loadConsultations();
    const now = new Date().toISOString();
    const updated = list.map((c) => (c.id === id ? { ...c, status, updatedAt: now } : c));
    saveConsultations(updated);
    return updated;
  },

  scheduleConsultation(
    data: Omit<AdminConsultationRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): AdminConsultationRecord {
    const list = loadConsultations();
    const newId = `csl-${String(list.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const created: AdminConsultationRecord = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [created, ...list];
    saveConsultations(updated);
    return created;
  },

  deleteConsultation(id: string): AdminConsultationRecord[] {
    const list = loadConsultations();
    const updated = list.filter((c) => c.id !== id);
    saveConsultations(updated);
    return updated;
  },

  // ── Assessments & Coding Tasks ─────────────────────────────────────────
  getAssessments(filters?: {
    track?: SoftwareTrack;
    difficulty?: AssessmentDifficulty;
    status?: AssessmentStatus;
    search?: string;
  }): AdminAssessmentRecord[] {
    let list = loadAssessments();

    if (filters?.track) {
      list = list.filter((a) => a.softwareTrack === filters.track);
    }
    if (filters?.difficulty) {
      list = list.filter((a) => a.difficulty === filters.difficulty);
    }
    if (filters?.status) {
      list = list.filter((a) => a.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  },

  getAssessmentById(id: string): AdminAssessmentRecord | undefined {
    return loadAssessments().find((a) => a.id === id);
  },

  createAssessment(
    data: Omit<AdminAssessmentRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalSubmissions' | 'avgScore'>
  ): AdminAssessmentRecord {
    const list = loadAssessments();
    const newId = `asm-${String(list.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const created: AdminAssessmentRecord = {
      ...data,
      id: newId,
      totalSubmissions: 0,
      avgScore: 0,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [created, ...list];
    saveAssessments(updated);
    return created;
  },

  updateAssessment(id: string, patch: Partial<AdminAssessmentRecord>): AdminAssessmentRecord[] {
    const list = loadAssessments();
    const now = new Date().toISOString();
    const updated = list.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: now } : a));
    saveAssessments(updated);
    return updated;
  },

  deleteAssessment(id: string): AdminAssessmentRecord[] {
    const list = loadAssessments();
    const updated = list.filter((a) => a.id !== id);
    saveAssessments(updated);
    return updated;
  },

  toggleAssessmentStatus(id: string): AdminAssessmentRecord[] {
    const list = loadAssessments();
    const updated = list.map((a) => {
      if (a.id === id) {
        const nextStatus: AssessmentStatus = a.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
        return { ...a, status: nextStatus, updatedAt: new Date().toISOString() };
      }
      return a;
    });
    saveAssessments(updated);
    return updated;
  },

  // ── Users ──────────────────────────────────────────────────────────────
  getUsers(filters?: { role?: UserRole; search?: string; status?: 'active' | 'inactive' }): AdminUserRecord[] {
    let list = loadUsers();

    if (filters?.role) {
      list = list.filter((u) => u.role === filters.role);
    }
    if (filters?.status) {
      const wantActive = filters.status === 'active';
      list = list.filter((u) => u.isActive === wantActive);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter((u) => {
        const name = u.studentProfile?.fullName || u.companyProfile?.companyName || '';
        return u.email.toLowerCase().includes(q) || name.toLowerCase().includes(q);
      });
    }

    return list;
  },

  toggleUserActive(userId: string): AdminUserRecord[] {
    const list = loadUsers();
    const updated = list.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u));
    saveUsers(updated);
    return updated;
  },

  toggleUserVerified(userId: string): AdminUserRecord[] {
    const list = loadUsers();
    const updated = list.map((u) => (u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
    saveUsers(updated);
    return updated;
  },

  deleteUser(userId: string): AdminUserRecord[] {
    const list = loadUsers();
    const updated = list.filter((u) => u.id !== userId);
    saveUsers(updated);
    return updated;
  },

  // ── Employer CR Verification ──────────────────────────────────────────
  verifyEmployerCR(userId: string, isVerified: boolean): AdminUserRecord[] {
    const list = loadUsers();
    const updated = list.map((u) => {
      if (u.id === userId && u.companyProfile) {
        return {
          ...u,
          isVerified: isVerified,
          companyProfile: {
            ...u.companyProfile,
            isCRVerified: isVerified,
          },
        };
      }
      return u;
    });
    saveUsers(updated);
    return updated;
  },

  // ── Job Listings ───────────────────────────────────────────────────────
  getJobListings(filters?: { status?: JobStatus; track?: SoftwareTrack; search?: string }): AdminJobListingRecord[] {
    let list = loadJobs();

    if (filters?.status) {
      list = list.filter((j) => j.status === filters.status);
    }
    if (filters?.track) {
      list = list.filter((j) => j.softwareTrack === filters.track);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    return list;
  },

  updateJobStatus(jobId: string, status: JobStatus): AdminJobListingRecord[] {
    const list = loadJobs();
    const updated = list.map((j) => (j.id === jobId ? { ...j, status } : j));
    saveJobs(updated);
    return updated;
  },

  deleteJobListing(jobId: string): AdminJobListingRecord[] {
    const list = loadJobs();
    const updated = list.filter((j) => j.id !== jobId);
    saveJobs(updated);
    return updated;
  },

  // ── Applications & Telemetry ───────────────────────────────────────────
  getApplications(): AdminApplicationRecord[] {
    return loadApps();
  },

  updateApplicationStatus(appId: string, status: ApplicationStatus): AdminApplicationRecord[] {
    const list = loadApps();
    const updated = list.map((a) => (a.id === appId ? { ...a, status } : a));
    saveApps(updated);
    return updated;
  },

  // ── Unified Profile Architecture ──────────────────────────────────────
  getUnifiedCandidateProfile(identifier?: string): {
    user: AdminUserRecord;
    consultations: AdminConsultationRecord[];
    applications: AdminApplicationRecord[];
    assessments: AdminAssessmentRecord[];
    metrics: {
      totalConsultations: number;
      completedConsultations: number;
      activeApplications: number;
      telemetryScore: number;
      track: string;
      isValidationStarted: boolean;
      validationPhase: number;
    };
  } {
    const users = loadUsers();
    const id = identifier || 'usr-cnd-001';
    const user =
      users.find(
        (u) =>
          u.id === id ||
          u.studentProfile?.id === id ||
          u.email.toLowerCase() === id.toLowerCase() ||
          u.studentProfile?.fullName.toLowerCase().includes(id.toLowerCase())
      ) ||
      users.find((u) => u.role === 'GRADUATE' || u.role === 'STUDENT') ||
      users[0];

    const studentId = user.studentProfile?.id || 'stu-001';
    const userEmail = user.email.toLowerCase();

    const allConsultations = loadConsultations();
    const userConsultations = allConsultations.filter(
      (c) => c.studentId === studentId || c.studentEmail.toLowerCase() === userEmail
    );

    const allApps = loadApps();
    const userApps = allApps.filter((a) => a.candidateId === studentId || a.candidateName === user.studentProfile?.fullName);

    const track = (user.studentProfile?.softwareTrack || 'BACKEND') as SoftwareTrack;
    const allAssessments = loadAssessments();
    const trackAssessments = allAssessments.filter((a) => a.softwareTrack === track);

    const completedConsultations = userConsultations.filter((c) => c.status === 'COMPLETED').length;
    const avgScore =
      userApps.length > 0
        ? Math.round(
            userApps.reduce((acc, a) => acc + (a.overallTelemetryScore || a.matchScore || 0), 0) / userApps.length
          )
        : 88;

    return {
      user,
      consultations: userConsultations,
      applications: userApps,
      assessments: trackAssessments.length > 0 ? trackAssessments : allAssessments,
      metrics: {
        totalConsultations: userConsultations.length,
        completedConsultations,
        activeApplications: userApps.length,
        telemetryScore: avgScore,
        track: user.studentProfile?.softwareTrack || 'BACKEND',
        isValidationStarted: true,
        validationPhase: 2, // Phase 2: AI Assessment Active
      },
    };
  },

  // ── Reset to Prisma Seed Defaults ──────────────────────────────────────
  resetToPrismaSeed(): void {
    saveUsers(initialUsersSeed);
    saveJobs(initialJobListingsSeed);
    saveApps(initialApplicationsSeed);
    saveAssessments(initialAssessmentsSeed);
    saveConsultations(initialConsultationsSeed);
  },
};
