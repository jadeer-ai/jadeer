import { RouterProvider } from 'react-router-dom';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { CandidateJourneyProvider } from '@/contexts/CandidateJourneyContext';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import router from '@/router';

export default function App() {
  return (
    <UserRoleProvider>
      <CandidateJourneyProvider>
        <SidebarProvider>
          <RouterProvider router={router} />
        </SidebarProvider>
      </CandidateJourneyProvider>
    </UserRoleProvider>
  );
}

