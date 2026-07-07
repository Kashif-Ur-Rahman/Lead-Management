import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import LeadForm from '../components/LeadForm';
import { useLeads } from '../context/LeadContext';

export default function EditLeadPage() {
  const { id } = useParams();
  const { getLeadById, updateLead } = useLeads();
  const navigate = useNavigate();
  const lead = getLeadById(id);

  if (!lead) {
    return (
      <Layout>
        <p>Lead not found.</p>
      </Layout>
    );
  }

  function handleSubmit(values) {
    updateLead(id, values);
    navigate(`/leads/${id}`); // Back to details page to see the update (req #8).
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Edit Lead - {lead.id}</h1>
          <p className="page-subtitle">Update the lead information below</p>
        </div>
      </div>
      <div className="card card--form">
        <LeadForm mode="edit" initialValues={lead} onSubmit={handleSubmit} onCancel={() => navigate(`/leads/${id}`)} />
      </div>
    </Layout>
  );
}
