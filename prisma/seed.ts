/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — DATABASE SEED SCRIPT
   ─────────────────────────────────────────────────────────────────────────
   Populates the development database with realistic sample data aligned
   with the existing front-end mock data (candidate profiles, employer
   companies, job listings, and applications with telemetry scores).

   Run with:  npx prisma db seed
   ═══════════════════════════════════════════════════════════════════════════ */

import {
  PrismaClient,
  UserRole,
  AuthProvider,
  SoftwareTrack,
  SeniorityLevel,
  EmploymentType,
  LocationType,
  JobStatus,
  ApplicationStatus,
  EvaluatorType,
} from '@prisma/client';

const prisma = new PrismaClient();

// ── Utility: Simple hash placeholder (replace with bcrypt in production) ──
function placeholderHash(password: string): string {
  // In production, use: await bcrypt.hash(password, 12)
  return `__hashed__${password}__`;
}

async function main() {
  console.log('🌱 Seeding Jadeer database...\n');

  // ═══════════════════════════════════════════════════════════════════════
  // 1. ADMIN USER
  // ═══════════════════════════════════════════════════════════════════════
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jadeer.io' },
    update: {},
    create: {
      email: 'admin@jadeer.io',
      passwordHash: placeholderHash('JadeerAdmin2026!'),
      role: UserRole.ADMIN,
      authProvider: AuthProvider.EMAIL,
      isVerified: true,
      isActive: true,
    },
  });
  console.log(`  ✓ Admin:    ${admin.email} (${admin.id})`);

  // ═══════════════════════════════════════════════════════════════════════
  // 2. EMPLOYER USERS & COMPANY PROFILES
  // ═══════════════════════════════════════════════════════════════════════

  // Employer 1: Jadeer Technologies (matches CompanyProfileContext default)
  const employer1 = await prisma.user.upsert({
    where: { email: 'talent@jadeer.io' },
    update: {},
    create: {
      email: 'talent@jadeer.io',
      passwordHash: placeholderHash('JadeerTalent2026!'),
      role: UserRole.EMPLOYER,
      authProvider: AuthProvider.EMAIL,
      isVerified: true,
      isActive: true,
      companyProfile: {
        create: {
          companyName: 'Jadeer Technologies Inc.',
          companyInitials: 'JT',
          industry: 'FinTech & Cloud Infrastructure',
          companySize: '51-200 employees',
          location: 'Riyadh, Saudi Arabia',
          workModel: LocationType.HYBRID,
          website: 'https://jadeer.io',
          commercialRegistrationNumber: '1010894231',
          isCRVerified: true,
          contactName: 'Sultan Al-Otaibi',
          contactRole: 'Head of Engineering Talent',
        },
      },
    },
    include: { companyProfile: true },
  });
  console.log(`  ✓ Employer: ${employer1.email} → ${employer1.companyProfile?.companyName}`);

  // Employer 2: Tamara (Saudi fintech)
  const employer2 = await prisma.user.upsert({
    where: { email: 'engineering@tamara.co' },
    update: {},
    create: {
      email: 'engineering@tamara.co',
      passwordHash: placeholderHash('TamaraEng2026!'),
      role: UserRole.EMPLOYER,
      authProvider: AuthProvider.EMAIL,
      isVerified: true,
      isActive: true,
      companyProfile: {
        create: {
          companyName: 'Tamara',
          companyInitials: 'TM',
          industry: 'FinTech — Buy Now Pay Later',
          companySize: '201-500 employees',
          location: 'Riyadh, Saudi Arabia',
          workModel: LocationType.HYBRID,
          website: 'https://tamara.co',
          commercialRegistrationNumber: '1010567890',
          isCRVerified: true,
          contactName: 'Fahad Al-Rashidi',
          contactRole: 'VP of Engineering',
        },
      },
    },
    include: { companyProfile: true },
  });
  console.log(`  ✓ Employer: ${employer2.email} → ${employer2.companyProfile?.companyName}`);

  // ═══════════════════════════════════════════════════════════════════════
  // 3. CANDIDATE USERS & STUDENT PROFILES
  // ═══════════════════════════════════════════════════════════════════════
  // Aligned with CandidateProfilesPage registry

  const candidateData = [
    {
      email: 'ahmad.alhassan@jadeer.io',
      fullName: 'Ahmad Al-Hassan',
      university: 'King Fahd University of Petroleum & Minerals',
      graduationYear: 2025,
      softwareTrack: SoftwareTrack.BACKEND,
      role: UserRole.GRADUATE,
      bio: 'Passionate backend engineer with expertise in distributed systems and API design.',
      githubUrl: 'https://github.com/ahmad-alhassan',
      linkedinUrl: 'https://linkedin.com/in/ahmad-alhassan',
      city: 'Dhahran',
    },
    {
      email: 'sara.fahad@jadeer.io',
      fullName: 'Sara Fahad',
      university: 'Princess Nourah bint Abdulrahman University',
      graduationYear: 2025,
      softwareTrack: SoftwareTrack.FRONTEND,
      role: UserRole.GRADUATE,
      bio: 'UI/UX-focused frontend developer specializing in React and design systems.',
      githubUrl: 'https://github.com/sara-fahad',
      linkedinUrl: 'https://linkedin.com/in/sara-fahad',
      city: 'Riyadh',
    },
    {
      email: 'rayan.alghamdi@jadeer.io',
      fullName: 'Rayan Al-Ghamdi',
      university: 'King Saud University',
      graduationYear: 2026,
      softwareTrack: SoftwareTrack.FULLSTACK,
      role: UserRole.STUDENT,
      bio: 'Full-stack developer interested in cloud-native architectures and DevOps practices.',
      githubUrl: 'https://github.com/rayan-alghamdi',
      linkedinUrl: 'https://linkedin.com/in/rayan-alghamdi',
      city: 'Riyadh',
    },
    {
      email: 'mohammed.khalid@jadeer.io',
      fullName: 'Mohammed Khalid',
      university: 'King Abdulaziz University',
      graduationYear: 2025,
      softwareTrack: SoftwareTrack.DEVOPS,
      role: UserRole.GRADUATE,
      bio: 'DevOps engineer focused on CI/CD pipelines, containerization, and infrastructure as code.',
      githubUrl: 'https://github.com/mohammed-khalid',
      linkedinUrl: 'https://linkedin.com/in/mohammed-khalid',
      city: 'Jeddah',
    },
    {
      email: 'nora.rashid@jadeer.io',
      fullName: 'Nora Rashid',
      university: 'Imam Abdulrahman Bin Faisal University',
      graduationYear: 2026,
      softwareTrack: SoftwareTrack.AI_ML,
      role: UserRole.STUDENT,
      bio: 'Aspiring AI/ML engineer with research experience in NLP and computer vision.',
      githubUrl: 'https://github.com/nora-rashid',
      linkedinUrl: 'https://linkedin.com/in/nora-rashid',
      city: 'Dammam',
    },
  ];

  const candidateProfiles: string[] = [];

  for (const c of candidateData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        passwordHash: placeholderHash('Candidate2026!'),
        role: c.role,
        authProvider: AuthProvider.EMAIL,
        isVerified: true,
        isActive: true,
        studentProfile: {
          create: {
            fullName: c.fullName,
            university: c.university,
            graduationYear: c.graduationYear,
            softwareTrack: c.softwareTrack,
            bio: c.bio,
            githubUrl: c.githubUrl,
            linkedinUrl: c.linkedinUrl,
            city: c.city,
            country: 'Saudi Arabia',
          },
        },
      },
      include: { studentProfile: true },
    });
    if (user.studentProfile) {
      candidateProfiles.push(user.studentProfile.id);
    }
    console.log(`  ✓ Candidate: ${c.fullName} (${c.softwareTrack}) — ${c.role}`);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 4. JOB LISTINGS
  // ═══════════════════════════════════════════════════════════════════════

  const company1Id = employer1.companyProfile!.id;
  const company2Id = employer2.companyProfile!.id;

  const jobListingsData = [
    {
      companyId: company1Id,
      title: 'Backend Engineer — Payment Systems',
      softwareTrack: SoftwareTrack.BACKEND,
      seniorityLevel: SeniorityLevel.JUNIOR,
      employmentType: EmploymentType.FULL_TIME,
      locationType: LocationType.HYBRID,
      location: 'Riyadh, Saudi Arabia',
      description: 'Design and build scalable payment processing microservices using Node.js and PostgreSQL.',
      responsibilities: 'API development, database optimization, integration with third-party payment gateways, writing comprehensive tests.',
      requirements: 'BS in Computer Science or equivalent. Strong understanding of REST APIs, SQL, and distributed systems.',
      skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'REST API', 'Microservices'],
      status: JobStatus.ACTIVE,
      minimumMatchScore: 72,
      enableAIInterview: true,
      enableProjectAssessment: true,
    },
    {
      companyId: company1Id,
      title: 'Frontend Developer — Design Systems',
      softwareTrack: SoftwareTrack.FRONTEND,
      seniorityLevel: SeniorityLevel.JUNIOR,
      employmentType: EmploymentType.FULL_TIME,
      locationType: LocationType.REMOTE,
      location: 'Remote (Saudi Arabia)',
      description: 'Build and maintain our internal design system and component library using React and Tailwind CSS.',
      responsibilities: 'Component development, accessibility audits, design token management, Storybook documentation.',
      requirements: 'Strong React/TypeScript skills. Eye for detail and UI/UX sensibility.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Storybook', 'Next.js'],
      status: JobStatus.ACTIVE,
      minimumMatchScore: 68,
      enableAIInterview: true,
      enableProjectAssessment: true,
    },
    {
      companyId: company1Id,
      title: 'DevOps Intern — Cloud Infrastructure',
      softwareTrack: SoftwareTrack.DEVOPS,
      seniorityLevel: SeniorityLevel.INTERN,
      employmentType: EmploymentType.INTERNSHIP,
      locationType: LocationType.ON_SITE,
      location: 'Riyadh, Saudi Arabia',
      description: 'Assist the platform engineering team in managing CI/CD pipelines and cloud infrastructure on AWS.',
      responsibilities: 'Pipeline maintenance, monitoring dashboards, container orchestration support, documentation.',
      requirements: 'Currently pursuing CS or related degree. Familiarity with Linux, Docker, and basic AWS services.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
      status: JobStatus.ACTIVE,
      minimumMatchScore: 60,
      enableAIInterview: true,
      enableProjectAssessment: false,
    },
    {
      companyId: company2Id,
      title: 'Full-Stack Engineer — Merchant Portal',
      softwareTrack: SoftwareTrack.FULLSTACK,
      seniorityLevel: SeniorityLevel.MID_LEVEL,
      employmentType: EmploymentType.FULL_TIME,
      locationType: LocationType.HYBRID,
      location: 'Riyadh, Saudi Arabia',
      description: 'Build and enhance the merchant-facing dashboard for BNPL transaction management and analytics.',
      responsibilities: 'End-to-end feature development, API design, frontend implementation, performance optimization.',
      requirements: '2+ years of full-stack experience. Proficiency in React, Node.js, and SQL databases.',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'System Design'],
      status: JobStatus.ACTIVE,
      minimumMatchScore: 75,
      enableAIInterview: true,
      enableProjectAssessment: true,
    },
    {
      companyId: company2Id,
      title: 'Mobile Developer — Consumer App (Flutter)',
      softwareTrack: SoftwareTrack.MOBILE,
      seniorityLevel: SeniorityLevel.JUNIOR,
      employmentType: EmploymentType.FULL_TIME,
      locationType: LocationType.ON_SITE,
      location: 'Riyadh, Saudi Arabia',
      description: 'Develop and maintain the consumer-facing mobile application for Android and iOS using Flutter.',
      responsibilities: 'Feature development, state management, API integration, app store release management.',
      requirements: 'Experience with Flutter/Dart. Understanding of mobile UX patterns and platform guidelines.',
      skills: ['Flutter', 'Dart', 'REST API', 'Firebase', 'Figma', 'Kotlin'],
      status: JobStatus.ACTIVE,
      minimumMatchScore: 65,
      enableAIInterview: true,
      enableProjectAssessment: true,
    },
    {
      companyId: company2Id,
      title: 'AI/ML Engineer — Risk Scoring',
      softwareTrack: SoftwareTrack.AI_ML,
      seniorityLevel: SeniorityLevel.MID_LEVEL,
      employmentType: EmploymentType.FULL_TIME,
      locationType: LocationType.HYBRID,
      location: 'Riyadh, Saudi Arabia',
      description: 'Develop and deploy machine learning models for credit risk assessment and fraud detection.',
      responsibilities: 'Model training, feature engineering, A/B testing, model monitoring, research prototyping.',
      requirements: 'MS in CS/Stats or equivalent experience. Proficiency in Python, scikit-learn, and TensorFlow/PyTorch.',
      skills: ['Python', 'TensorFlow', 'Machine Learning', 'Data Engineering', 'PostgreSQL', 'Docker'],
      status: JobStatus.DRAFT,
      minimumMatchScore: 80,
      enableAIInterview: true,
      enableProjectAssessment: true,
    },
  ];

  const createdJobs: string[] = [];

  for (const job of jobListingsData) {
    const created = await prisma.jobListing.create({ data: job });
    createdJobs.push(created.id);
    console.log(`  ✓ Job: "${created.title}" (${created.softwareTrack}, ${created.status})`);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 5. APPLICATIONS WITH TELEMETRY
  // ═══════════════════════════════════════════════════════════════════════

  const applicationData = [
    // Ahmad → Backend Engineer (Jadeer)
    { candidateIdx: 0, jobIdx: 0, status: ApplicationStatus.SHORTLISTED, matchScore: 91, aiScore: 88, projectScore: 94, humanScore: 90, overall: 91 },
    // Ahmad → Full-Stack Engineer (Tamara)
    { candidateIdx: 0, jobIdx: 3, status: ApplicationStatus.AI_INTERVIEW, matchScore: 78, aiScore: 72, projectScore: null, humanScore: null, overall: 75 },
    // Sara → Frontend Developer (Jadeer)
    { candidateIdx: 1, jobIdx: 1, status: ApplicationStatus.PROJECT_ASSESSMENT, matchScore: 87, aiScore: 85, projectScore: 90, humanScore: null, overall: 87 },
    // Sara → Full-Stack Engineer (Tamara)
    { candidateIdx: 1, jobIdx: 3, status: ApplicationStatus.SUBMITTED, matchScore: 72, aiScore: null, projectScore: null, humanScore: null, overall: 72 },
    // Rayan → Full-Stack Engineer (Tamara)
    { candidateIdx: 2, jobIdx: 3, status: ApplicationStatus.HUMAN_INTERVIEW, matchScore: 84, aiScore: 82, projectScore: 86, humanScore: 80, overall: 83 },
    // Rayan → Frontend Developer (Jadeer)
    { candidateIdx: 2, jobIdx: 1, status: ApplicationStatus.UNDER_REVIEW, matchScore: 76, aiScore: null, projectScore: null, humanScore: null, overall: 76 },
    // Mohammed → DevOps Intern (Jadeer)
    { candidateIdx: 3, jobIdx: 2, status: ApplicationStatus.SHORTLISTED, matchScore: 89, aiScore: 86, projectScore: null, humanScore: 92, overall: 89 },
    // Mohammed → Backend Engineer (Jadeer)
    { candidateIdx: 3, jobIdx: 0, status: ApplicationStatus.AI_INTERVIEW, matchScore: 71, aiScore: 68, projectScore: null, humanScore: null, overall: 70 },
    // Nora → AI/ML Engineer (Tamara — Draft, but submitted before it went to draft)
    { candidateIdx: 4, jobIdx: 5, status: ApplicationStatus.SUBMITTED, matchScore: 82, aiScore: null, projectScore: null, humanScore: null, overall: 82 },
    // Nora → Mobile Developer (Tamara)
    { candidateIdx: 4, jobIdx: 4, status: ApplicationStatus.REJECTED, matchScore: 45, aiScore: 40, projectScore: null, humanScore: null, overall: 43 },
  ];

  const telemetryDimensions = [
    'Problem Solving',
    'Code Quality',
    'System Design',
    'Communication',
    'Technical Knowledge',
    'Project Execution',
  ];

  for (const app of applicationData) {
    const candidateId = candidateProfiles[app.candidateIdx];
    const jobListingId = createdJobs[app.jobIdx];

    if (!candidateId || !jobListingId) continue;

    const application = await prisma.application.create({
      data: {
        candidateId,
        jobListingId,
        status: app.status,
        matchScore: app.matchScore,
        aiInterviewScore: app.aiScore,
        projectScore: app.projectScore,
        humanInterviewScore: app.humanScore,
        overallTelemetryScore: app.overall,
        coverNote: `Excited to apply for this role. My background aligns well with the requirements.`,
      },
    });

    // Generate telemetry snapshots for applications that have AI scores
    if (app.aiScore !== null) {
      const snapshotsToCreate = telemetryDimensions.map((dimension) => ({
        applicationId: application.id,
        dimension,
        score: Math.round((app.aiScore! + (Math.random() - 0.5) * 20) * 10) / 10,
        maxScore: 100,
        evaluatorType: EvaluatorType.AI,
        notes: `Automated assessment for ${dimension.toLowerCase()}.`,
      }));

      await prisma.telemetrySnapshot.createMany({ data: snapshotsToCreate });
    }

    console.log(
      `  ✓ Application: Candidate[${app.candidateIdx}] → Job[${app.jobIdx}] ` +
      `(${app.status}, match: ${app.matchScore}%)`
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════════════
  const counts = {
    users: await prisma.user.count(),
    studentProfiles: await prisma.studentProfile.count(),
    companyProfiles: await prisma.companyProfile.count(),
    jobListings: await prisma.jobListing.count(),
    applications: await prisma.application.count(),
    telemetrySnapshots: await prisma.telemetrySnapshot.count(),
  };

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 Seed Complete!');
  console.log(`   Users:               ${counts.users}`);
  console.log(`   Student Profiles:    ${counts.studentProfiles}`);
  console.log(`   Company Profiles:    ${counts.companyProfiles}`);
  console.log(`   Job Listings:        ${counts.jobListings}`);
  console.log(`   Applications:        ${counts.applications}`);
  console.log(`   Telemetry Snapshots: ${counts.telemetrySnapshots}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
