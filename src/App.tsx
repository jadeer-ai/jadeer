import { RouterProvider } from 'react-router-dom';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { CandidateJourneyProvider } from '@/contexts/CandidateJourneyContext';
import router from '@/router';

export default function App() {
  return (
    <CandidateJourneyProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </CandidateJourneyProvider>
  );
}
