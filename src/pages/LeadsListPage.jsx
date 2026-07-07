import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FiPlus, FiUpload, FiAlertCircle } from 'react-icons/fi';
import LeadFilters, { DEFAULT_FILTERS, applyFilters } from '../components/LeadFilters';
import LeadTable from '../components/LeadTable';
import { useLeads } from '../context/LeadContext';

export default function LeadsListPage() {
  const { leads, deleteLead } = useLeads();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const navigate = useNavigate();

  const filteredLeads = useMemo(() => applyFilters(leads, filters), [leads, filters]);

  function handleDelete(id) {
    if (window.confirm(`Delete lead ${id}? This cannot be undone.`)) {
      deleteLead(id);
    }
  }

  function handleExport() {
    const header = Object.keys(filteredLeads[0] || {}).filter((k) => k !== 'communications');
    const rows = filteredLeads.map((l) => header.map((h) => `"${String(l[h] ?? '').replace(/"/g, '""')}"`).join(','));
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Leads</h1>
          <p className="page-subtitle">Manage and track your leads in one place</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary" onClick={() => navigate('/leads/new')}>
            <FiPlus /> Add New Lead
          </button>
          <button className="btn btn--outline" onClick={handleExport}>
            <FiUpload /> Export
          </button>
        </div>
      </div>

      <div className="card">
        <LeadFilters filters={filters} setFilters={setFilters} />
        <LeadTable leads={filteredLeads} onDelete={handleDelete} />
      </div>

      <div className="system-note">
        <span className="system-note__icon"><FiAlertCircle /></span>
        <div>
          <strong>System Rule</strong>
          <p>When Lead Stage is updated to Won, the record will be moved to Active Clients automatically.</p>
        </div>
      </div>
    </Layout>
  );
}
