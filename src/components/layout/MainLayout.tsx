import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import TopJourneyNav from './TopJourneyNav';

export default function MainLayout() {
  const { isStudent } = useUserRole();
  const location = useLocation();
  const path = location.pathname;

  // Clean dashboard routing for student view
  if (isStudent && path === '/dashboard') {
    return <Navigate to="/student/dashboard" replace />;
  }

  return (
    <div id="candidate-app-layout" className="min-h-screen bg-[#F8F9FA] text-[#0F172A]">
      {/* ── Unified Top Journey Navigation Shell ── */}
      <TopJourneyNav />

      {/* ── Main Candidate Content Area (Full-Width) ── */}
      <main
        id="main-content"
        className="min-h-screen transition-all duration-300 ease-[var(--ease-smooth)]"
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 py-6 lg:py-8 animate-[fade-in_0.3s_ease]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

