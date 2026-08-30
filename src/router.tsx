import { createBrowserRouter } from 'react-router-dom';
import { MainLayout, EmployerLayout } from '@/components/layout';
import LandingPage from '@/pages/LandingPage';
import SignUpPage from '@/pages/SignUpPage';
import SignInPage from '@/pages/SignInPage';
import OtpVerificationPage from '@/pages/OtpVerificationPage';
import CandidateWizardPage from '@/pages/CandidateWizardPage';
import StudentDashboardPage from '@/pages/StudentDashboardPage';
import MentorConsultationPage from '@/pages/MentorConsultationPage';
import BookSessionPage from '@/pages/BookSessionPage';
import {
  DashboardPage,
  CandidateProfilesPage,
  AIInterviewPage,
  HumanInterviewPage,
  ProjectWorkspacePage,
  PortfolioPage,
  JobMatchesPage,
  SettingsPage,
  ReadinessPage,
  EmployerLandingPage,
  EmployerSignInPage,
  EmployerSignUpPage,
  EmployerDashboardPage,
  EmployerPostJobPage,
  EmployerListingsPage,
  AdminSignInPage,
  AdminDashboardPage,
} from '@/pages';

import {
  AdminRouteGuard,
  EmployerRouteGuard,
  GuestOnlyRouteGuard,
  AuthenticatedRouteGuard,
} from '@/components/common/ProtectedRoute';
import AuthTestPage from '@/pages/AuthTestPage';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

const router = createBrowserRouter([
  /* ── Public & Authentication Pages ─────────────────────────────────── */
  { path: '/', element: <LandingPage /> },
  { path: '/test/auth', element: <AuthTestPage /> },
  { path: '/test-auth', element: <AuthTestPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/verify-otp', element: <OtpVerificationPage /> },
  { path: '/signin', element: <SignInPage /> },
  { path: '/login', element: <SignInPage /> },
  {
    path: '/sso-callback',
    element: <AuthenticateWithRedirectCallback signInForceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard" />,
  },
  { path: '/wizard', element: <CandidateWizardPage /> },
  { path: '/onboarding', element: <CandidateWizardPage /> },
  { path: '/profile/edit', element: <CandidateWizardPage /> },
  { path: '/employer', element: <EmployerLandingPage /> },
  { path: '/employer/landing', element: <EmployerLandingPage /> },
  { path: '/employer/signin', element: <EmployerSignInPage /> },
  { path: '/employer/login', element: <EmployerSignInPage /> },
  { path: '/employer/signup', element: <EmployerSignUpPage /> },
  { path: '/employer/onboarding', element: <EmployerSignUpPage /> },

  /* ── Admin Console Routes (RBAC Protected) ─────────────────────────── */
  {
    path: '/admin',
    element: (
      <AdminRouteGuard>
        <AdminDashboardPage />
      </AdminRouteGuard>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <AdminRouteGuard>
        <AdminDashboardPage />
      </AdminRouteGuard>
    ),
  },
  {
    path: '/admin/signin',
    element: <AdminSignInPage />,
  },
  {
    path: '/admin/login',
    element: <AdminSignInPage />,
  },

  /* ── Candidate Portal Shell ────────────────────────────────────────── */
  {
    element: (
      <AuthenticatedRouteGuard>
        <MainLayout />
      </AuthenticatedRouteGuard>
    ),
    children: [
      /* Main Candidate Dashboard (Home View) */
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/candidates/dashboard', element: <DashboardPage /> },
      { path: '/candidates/wizard', element: <CandidateWizardPage /> },
      { path: '/candidates/onboarding', element: <CandidateWizardPage /> },
      { path: '/candidates/profile/edit', element: <CandidateWizardPage /> },

      /* Candidate Journey Routes (Graduate Path) */
      { path: '/profile', element: <CandidateProfilesPage /> },
      { path: '/candidates/profile', element: <CandidateProfilesPage /> },
      { path: '/candidates/profiles', element: <CandidateProfilesPage /> },
      { path: '/graduate/profile', element: <CandidateProfilesPage /> },
      { path: '/student/profile', element: <CandidateProfilesPage /> },
      /* Human Technical Calibration (Shared across Student & Graduate Portals) */
      { path: '/candidates/human-interview', element: <HumanInterviewPage /> },
      { path: '/graduate/human-interview', element: <HumanInterviewPage /> },
      { path: '/student/human-interview', element: <HumanInterviewPage /> },
      { path: '/student/interview', element: <HumanInterviewPage /> },
      { path: '/student/calibration', element: <HumanInterviewPage /> },
      { path: '/portal/human-interview', element: <HumanInterviewPage /> },
      { path: '/human-interview', element: <HumanInterviewPage /> },
      { path: '/schedule', element: <HumanInterviewPage /> },

      /* AI Technical Interview */
      { path: '/candidates/ai-interview', element: <AIInterviewPage /> },
      { path: '/graduate/ai-interview', element: <AIInterviewPage /> },
      { path: '/student/ai-interview', element: <AIInterviewPage /> },

      /* Project Workspace */
      { path: '/projects/workspace', element: <ProjectWorkspacePage /> },
      { path: '/graduate/workspace', element: <ProjectWorkspacePage /> },
      { path: '/student/workspace', element: <ProjectWorkspacePage /> },

      /* Evidence Portfolio */
      { path: '/candidates/portfolio', element: <PortfolioPage /> },
      { path: '/graduate/portfolio', element: <PortfolioPage /> },
      { path: '/student/portfolio', element: <PortfolioPage /> },

      /* Job & Internship Matches */
      { path: '/candidates/jobs', element: <JobMatchesPage /> },
      { path: '/graduate/jobs', element: <JobMatchesPage /> },
      { path: '/student/jobs', element: <JobMatchesPage /> },
      { path: '/candidates/matching', element: <JobMatchesPage /> },

      /* Settings */
      { path: '/settings', element: <SettingsPage /> },
      { path: '/candidates/settings', element: <SettingsPage /> },
      { path: '/graduate/settings', element: <SettingsPage /> },
      { path: '/student/settings', element: <SettingsPage /> },
      { path: '/candidates/readiness', element: <ReadinessPage /> },

      /* ── Unified 1-to-1 Consultation Routes (Students & Graduates) ────── */
      { path: '/consultations', element: <MentorConsultationPage /> },
      { path: '/graduate/consultations', element: <MentorConsultationPage /> },
      { path: '/consultations/book', element: <MentorConsultationPage /> },
      { path: '/graduate/book-consultation', element: <MentorConsultationPage /> },

      /* Student-branded Dashboard */
      { path: '/student/dashboard', element: <StudentDashboardPage /> },

      /* Legacy student aliases → unified consultation page */
      { path: '/student/mentors', element: <MentorConsultationPage /> },
      { path: '/student/book-session', element: <MentorConsultationPage /> },
    ],
  },

  /* ── Employer / Company Portal Shell (Role Gated) ─────────────────── */
  {
    element: (
      <EmployerRouteGuard>
        <EmployerLayout />
      </EmployerRouteGuard>
    ),
    children: [
      { path: '/employer/dashboard', element: <EmployerDashboardPage /> },
      { path: '/employer/listings', element: <EmployerListingsPage /> },
      { path: '/employer/candidates', element: <CandidateProfilesPage /> },
      { path: '/employer/post-job', element: <EmployerPostJobPage /> },
    ],
  },
]);

export default router;
