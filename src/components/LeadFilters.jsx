import { useState } from 'react';
import { FiSearch, FiFilter, FiRotateCw } from 'react-icons/fi';
import {
  LEAD_STATUSES,
  PRIORITIES,
  SERVICE_TYPES,
  FOLLOW_UP_STATUSES,
  SPECIALTIES,
  US_STATES,
  LEAD_SOURCES,
  STAGES,
} from '../utils/constants';

export const DEFAULT_FILTERS = {
  search: '',
  leadStatus: 'All',
  priority: 'All',
  serviceType: 'All',
  followUpStatus: 'All',
  specialty: 'All',
  state: 'All',
  leadSource: 'All',
  stage: 'All',
};

function Select({ label, value, onChange, options }) {
  return (
    <div className="filter-select">
      <span className="filter-select__label">{label}</span>
      <select value={value} onChange={onChange}>
        <option value="All">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function LeadFilters({ filters, setFilters }) {
  const [showMore, setShowMore] = useState(false);

  function update(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function reset() {
    setFilters(DEFAULT_FILTERS);
    setShowMore(false);
  }

  return (
    <div className="filters-bar">
      <div className="filters-row">
        <div className="search-box centered-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search leads..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
          />
        </div>

        <div className="filters-right">
          <Select label="Lead Status" value={filters.leadStatus} onChange={(e) => update('leadStatus', e.target.value)} options={LEAD_STATUSES} />
          <Select label="Priority" value={filters.priority} onChange={(e) => update('priority', e.target.value)} options={PRIORITIES} />
          <Select label="Service Type" value={filters.serviceType} onChange={(e) => update('serviceType', e.target.value)} options={SERVICE_TYPES} />
          <Select label="Follow-up Status" value={filters.followUpStatus} onChange={(e) => update('followUpStatus', e.target.value)} options={FOLLOW_UP_STATUSES} />

          <button type="button" className="btn btn--outline more-filters-btn" onClick={() => setShowMore((s) => !s)}>
            <FiFilter className="more-icon" /> <span className="more-text">More Filters</span>
          </button>
        </div>
        <button type="button" className="btn btn--ghost reset-inline reset-end" onClick={reset}>
          <FiRotateCw /> Reset
        </button>
      </div>

      {showMore && (
        <div className="filters-row filters-row--more">
          <Select label="Specialty" value={filters.specialty} onChange={(e) => update('specialty', e.target.value)} options={SPECIALTIES} />
          <Select label="State" value={filters.state} onChange={(e) => update('state', e.target.value)} options={US_STATES} />
          <Select label="Lead Source" value={filters.leadSource} onChange={(e) => update('leadSource', e.target.value)} options={LEAD_SOURCES} />
          <Select label="Stage" value={filters.stage} onChange={(e) => update('stage', e.target.value)} options={STAGES} />
        </div>
      )}
    </div>
  );
}

// Pure filtering function - kept separate from the component so it can be
// unit tested and reused (e.g. for the Export button) without touching UI.
export function applyFilters(leads, filters) {
  return leads.filter((lead) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = `${lead.practiceName} ${lead.contactPerson} ${lead.id}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.leadStatus !== 'All' && lead.leadStatus !== filters.leadStatus) return false;
    if (filters.priority !== 'All' && lead.priority !== filters.priority) return false;
    if (filters.serviceType !== 'All' && lead.serviceType !== filters.serviceType) return false;
    if (filters.followUpStatus !== 'All' && lead.followUpStatus !== filters.followUpStatus) return false;
    if (filters.specialty !== 'All' && lead.specialty !== filters.specialty) return false;
    if (filters.state !== 'All' && lead.state !== filters.state) return false;
    if (filters.leadSource !== 'All' && lead.leadSource !== filters.leadSource) return false;
    if (filters.stage !== 'All' && lead.stage !== filters.stage) return false;
    return true;
  });
}
