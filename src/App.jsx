import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeadProvider } from './context/LeadContext';
import LeadsListPage from './pages/LeadsListPage';
import AddLeadPage from './pages/AddLeadPage';
import EditLeadPage from './pages/EditLeadPage';
import LeadDetailsPage from './pages/LeadDetailsPage';

export default function App() {
  return (
    <LeadProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LeadsListPage />} />
          <Route path="/leads/new" element={<AddLeadPage />} />
          <Route path="/leads/:id" element={<LeadDetailsPage />} />
          <Route path="/leads/:id/edit" element={<EditLeadPage />} />
        </Routes>
      </BrowserRouter>
    </LeadProvider>
  );
}
