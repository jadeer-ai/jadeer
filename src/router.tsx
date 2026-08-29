import { createBrowserRouter } from 'react-router-dom';
import { MainLayout, EmployerLayout } from '@/components/layout';
import LandingPage from '@/pages/LandingPage';
import SignUpPage from '@/pages/SignUpPage';
import SignInPage from '@/pages/SignInPage';
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
} from '@/components/common/ProtectedRoute';

const router = createBrowserRouter([
  /* ── Public & Authentication Pages (Guest Gated) ───────────────────── */
  { path: '/', element: <LandingPage /> },
  {
    path: '/signup',
    element: (
      <GuestOnlyRouteGuard>
        <SignUpPage />
      </GuestOnlyRouteGuard>
    ),
  },
  {
    path: '/signin',
    element: (
      <GuestOnlyRouteGuard>
        <SignInPage />
      </GuestOnlyRouteGuard>
    ),
  },
  {
    path: '/login',
    element: (
      <GuestOnlyRouteGuard>
        <SignInPage />
      </GuestOnlyRouteGuard>
    ),
  },
  { path: '/wizard', element: <CandidateWizardPage /> },
  { path: '/employer', element: <EmployerLandingPage /> },
  { path: '/employer/landing', element: <EmployerLandingPage /> },
  {
    path: '/employer/signin',
    element: (
      <GuestOnlyRouteGuard>
        <EmployerSignInPage />
      </GuestOnlyRouteGuard>
    ),
  },
  {
    path: '/employer/login',
    element: (
      <GuestOnlyRouteGuard>
        <EmployerSignInPage />
      </GuestOnlyRouteGuard>
    ),
  },
  {
    path: '/employer/signup',
    element: (
      <GuestOnlyRouteGuard>
        <EmployerSignUpPage />
      </GuestOnlyRouteGuard>
    ),
  },
  {
    path: '/employer/onboarding',
    element: (
      <GuestOnlyRouteGuard>
        <EmployerSignUpPage />
      </GuestOnlyRouteGuard>
    ),
  },

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
    element: (
      <GuestOnlyRouteGuard>
        <AdminSignInPage />
      </GuestOnlyRouteGuard>
    ),
  },
  {
    path: '/admin/login',
    element: (
      <GuestOnlyRouteGuard>
        <AdminSignInPage />
      </GuestOnlyRouteGuard>
    ),
  },

  /* ── Candidate Portal Shell ────────────────────────────────────────── */
  {
    element: <MainLayout />,
    children: [
      /* Main Candidate Dashboard (Home View) */
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/candidates/dashboard', element: <DashboardPage /> },
      { path: '/candidates/wizard', element: <CandidateWizardPage /> },

      /* Candidate Journey Routes (Graduate Path) */
      { path: '/candidates/profiles', element: <CandidateProfilesPage /> },
      { path: '/candidates/ai-interview', element: <AIInterviewPage /> },
      { path: '/candidates/human-interview', element: <HumanInterviewPage /> },
      { path: '/schedule', element: <HumanInterviewPage /> },
      { path: '/projects/workspace', element: <ProjectWorkspacePage /> },
      { path: '/candidates/portfolio', element: <PortfolioPage /> },
      { path: '/candidates/jobs', element: <JobMatchesPage /> },
      { path: '/candidates/matching', element: <JobMatchesPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/candidates/settings', element: <SettingsPage /> },
      { path: '/candidates/readiness', element: <ReadinessPage /> },

      /* ── Standalone Consultation Routes (Students & Graduates) ────── */
      { path: '/consultations', element: <MentorConsultationPage /> },
      { path: '/consultations/book', element: <BookSessionPage /> },

      /* Student-branded Dashboard */
      { path: '/student/dashboard', element: <StudentDashboardPage /> },

      /* Legacy student aliases → shared consultation pages */
      { path: '/student/mentors', element: <MentorConsultationPage /> },
      { path: '/student/book-session', element: <BookSessionPage /> },
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
