import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useSidebar } from '@/contexts/SidebarContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useCandidateJourney } from '@/contexts/CandidateJourneyContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function MainLayout() {
  const { isCollapsed } = useSidebar();
  const { isStudent } = useUserRole();
  const { isOnboarded } = useCandidateJourney();
  const location = useLocation();
  const path = location.pathname;

  // Clean dashboard routing for student view
  if (isStudent && path === '/dashboard') {
    return <Navigate to="/student/dashboard" replace />;
  }

  return (
    <div id="candidate-app-layout" className="min-h-screen bg-[#FAF9F6] text-[#0B0F19]">
      <Sidebar />
      <TopBar />

      {/* ── Main Candidate Content Area ──────────────────────────────── */}
      <main
        id="main-content"
        className={`
          pt-[var(--spacing-topbar)] min-h-screen
          transition-all duration-300 ease-[var(--ease-smooth)]
          ${isCollapsed
            ? 'lg:pl-[var(--spacing-sidebar-collapsed)]'
            : 'lg:pl-[var(--spacing-sidebar)]'
          }
        `}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-[fade-in_0.3s_ease]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
