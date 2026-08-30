import { RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { CandidateJourneyProvider } from '@/contexts/CandidateJourneyContext';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import { InterviewScheduleProvider } from '@/contexts/InterviewScheduleContext';
import { CompanyProfileProvider } from '@/contexts/CompanyProfileContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import router from '@/router';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <UserProfileProvider>
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
      </UserProfileProvider>
    </ClerkProvider>
  );
}

