import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Badge from '../components/Badge';
import CommunicationSection from '../components/CommunicationSection';
import { useLeads } from '../context/LeadContext';

function DetailItem({ label, value, badge }) {
  return (
    <div className="detail-item">
      <span className="detail-item__label">{label}</span>
      <span className="detail-item__value">{badge ? <Badge value={value} /> : value || '-'}</span>
    </div>
  );
}

export default function LeadDetailsPage() {
  const { id } = useParams();
  const { getLeadById, addCommunication } = useLeads();
  const navigate = useNavigate();
  const lead = getLeadById(id);

  if (!lead) {
    return (
      <Layout>
        <p>Lead not found.</p>
        <Link to="/">Back to Leads</Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <Link to="/" className="back-link">← Back to Leads</Link>
          <h1>{lead.practiceName} <span className="lead-id-tag">{lead.id}</span></h1>
          <p className="page-subtitle">{lead.contactPerson} · {lead.specialty}</p>
        </div>
        <div className="page-header__actions">
          {/* Requirement #6: Edit icon on the Lead Details page */}
          <button
            type="button"
            className="btn btn--primary"
            title="Edit lead"
            onClick={() => navigate(`/leads/${id}/edit`)}
          >
            ✎ Edit
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Lead Information</h3>
        <div className="detail-grid">
          <DetailItem label="Contact Person" value={lead.contactPerson} />
          <DetailItem label="Email" value={lead.email} />
          <DetailItem label="Phone" value={lead.phone} />
          <DetailItem label="State" value={lead.state} />
          <DetailItem label="Platform" value={lead.platform} />
          <DetailItem label="Lead Source" value={lead.leadSource} />
          <DetailItem label="Avg Collection" value={`$${Number(lead.avgCollection).toLocaleString()}`} />
          <DetailItem label="Sales Rep" value={lead.salesRep} />
          <DetailItem label="Priority" value={lead.priority} badge />
          <DetailItem label="Lead Status" value={lead.leadStatus} badge />
          <DetailItem label="Service Type" value={lead.serviceType} />
          <DetailItem label="Stage" value={lead.stage} badge />
          <DetailItem label="Created Date" value={lead.createdDate} />
          <DetailItem label="Last Activity Date" value={lead.lastActivityDate} />
          <DetailItem label="Next Follow-up Date" value={lead.nextFollowUpDate} />
          <DetailItem label="Days Since Activity" value={lead.daysSinceActivity} />
          <DetailItem label="Follow-up Status" value={lead.followUpStatus} badge />
          <DetailItem label="Aging Bucket" value={lead.agingBucket} />
        </div>
      </div>

      <div className="card">
        <CommunicationSection
          communications={lead.communications}
          onAdd={(comm) => addCommunication(lead.id, comm)}
        />
      </div>
    </Layout>
  );
}
