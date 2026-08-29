import { RouterProvider } from 'react-router-dom';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { CandidateJourneyProvider } from '@/contexts/CandidateJourneyContext';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import { InterviewScheduleProvider } from '@/contexts/InterviewScheduleContext';
import { CompanyProfileProvider } from '@/contexts/CompanyProfileContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import router from '@/router';

export default function App() {
  return (
    <UserRoleProvider>
      <CandidateJourneyProvider>
        <InterviewScheduleProvider>
          <CompanyProfileProvider>
            <AdminAuthProvider>
              <SidebarProvider>
                <RouterProvider router={router} />
              </SidebarProvider>
            </AdminAuthProvider>
          </CompanyProfileProvider>
        </InterviewScheduleProvider>
      </CandidateJourneyProvider>
    </UserRoleProvider>
  );
}

