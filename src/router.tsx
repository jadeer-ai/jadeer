import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
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
} from '@/pages';

const router = createBrowserRouter([
  /* ── Public & Authentication Pages ─────────────────────────────────── */
  { path: '/', element: <LandingPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/signin', element: <SignInPage /> },
  { path: '/login', element: <SignInPage /> },
  { path: '/wizard', element: <CandidateWizardPage /> },

  /* ── Candidate Portal Shell ────────────────────────────────────────── */
  {
    element: <MainLayout />,
    children: [
      /* Main Candidate Dashboard (Home View) */
      { path: '/dashboard', element: <DashboardPage /> },
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

      /* Student Mentorship Routes */
      { path: '/student/dashboard', element: <StudentDashboardPage /> },
      { path: '/student/mentors', element: <MentorConsultationPage /> },
      { path: '/student/book-session', element: <BookSessionPage /> },
    ],
  },
]);

export default router;

