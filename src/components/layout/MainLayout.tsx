import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useSidebar } from '@/contexts/SidebarContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function MainLayout() {
  const { isCollapsed } = useSidebar();
  const { isStudent } = useUserRole();
  const location = useLocation();
  const path = location.pathname;

  // Bi-directional Route Guard for complete Portal Isolation
  if (isStudent) {
    const isGraduatePath =
      path === '/dashboard' ||
      path.startsWith('/candidates/') ||
      path.startsWith('/projects/') ||
      path === '/schedule';
    
    if (isGraduatePath) {
      return <Navigate to="/student/dashboard" replace />;
    }
  } else {
    const isStudentPath = path.startsWith('/student/');
    if (isStudentPath) {
      return <Navigate to="/dashboard" replace />;
    }
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
