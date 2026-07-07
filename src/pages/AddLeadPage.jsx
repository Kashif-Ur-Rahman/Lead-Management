import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LeadForm from '../components/LeadForm';
import { useLeads } from '../context/LeadContext';

export default function AddLeadPage() {
  const { addLead } = useLeads();
  const navigate = useNavigate();

  function handleSubmit(values) {
    const newLead = addLead(values);
    // Land back on the list so the user immediately sees the new record (req #2).
    navigate('/', { state: { justAdded: newLead.id } });
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Add New Lead</h1>
          <p className="page-subtitle">Fill in the details below to create a new lead</p>
        </div>
      </div>
      <div className="card card--form">
        <LeadForm mode="add" onSubmit={handleSubmit} onCancel={() => navigate('/')} />
      </div>
    </Layout>
  );
}
