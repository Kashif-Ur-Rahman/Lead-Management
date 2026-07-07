import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import { FiChevronUp, FiChevronDown, FiTrash2, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const COLUMNS = [
  { key: 'id', label: 'Lead ID' },
  { key: 'practiceName', label: 'Practice Name' },
  { key: 'contactPerson', label: 'Contact Person' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'state', label: 'State' },
  { key: 'platform', label: 'Platform' },
  { key: 'leadSource', label: 'Lead Source' },
  { key: 'avgCollection', label: 'Avg Collection' },
  { key: 'salesRep', label: 'Sales Rep' },
  { key: 'priority', label: 'Priority' },
  { key: 'leadStatus', label: 'Lead Status' },
  { key: 'serviceType', label: 'Service Type' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'lastActivityDate', label: 'Last Activity Date' },
  { key: 'nextFollowUpDate', label: 'Next Follow-up Date' },
  { key: 'daysSinceActivity', label: 'Days Since Activity' },
  { key: 'followUpStatus', label: 'Follow-up Status' },
  { key: 'agingBucket', label: 'Aging Bucket' },
  { key: 'stage', label: 'Stage' },
  { key: 'actions', label: '' },
];

const BADGE_FIELDS = new Set(['priority', 'leadStatus', 'followUpStatus', 'stage']);

export default function LeadTable({ leads, onDelete }) {
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sorted = useMemo(() => {
    if (!sort.key) return leads;
    const copy = [...leads];
    copy.sort((a, b) => {
      const av = a[sort.key] ?? '';
      const bv = b[sort.key] ?? '';
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [leads, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(key) {
    if (key === 'actions') return;
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  }

  return (
    <div className="table-wrap">
      <table className="lead-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} onClick={() => toggleSort(col.key)}>
                <span className="th-label">
                  {col.label}
                  {col.key !== 'actions' && (
                    <span className="sort-icons">
                      <FiChevronUp className={`sort-caret ${sort.key === col.key && sort.dir === 'asc' ? 'sort-caret--active' : ''}`} />
                      <FiChevronDown className={`sort-caret ${sort.key === col.key && sort.dir === 'desc' ? 'sort-caret--active' : ''}`} />
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageItems.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length} className="empty-cell">
                No leads match the selected filters.
              </td>
            </tr>
          )}
          {pageItems.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>
                <Link className="practice-link" to={`/leads/${lead.id}`}>
                  {lead.practiceName}
                </Link>
              </td>
              <td>{lead.contactPerson}</td>
              <td>{lead.specialty}</td>
              <td>{lead.state}</td>
              <td>{lead.platform}</td>
              <td>{lead.leadSource}</td>
              <td>${Number(lead.avgCollection).toLocaleString()}</td>
              <td>{lead.salesRep}</td>
              <td><Badge value={lead.priority} /></td>
              <td><Badge value={lead.leadStatus} /></td>
              <td>{lead.serviceType}</td>
              <td>{formatDate(lead.createdDate)}</td>
              <td>{formatDate(lead.lastActivityDate)}</td>
              <td>{formatDate(lead.nextFollowUpDate)}</td>
              <td>{lead.daysSinceActivity}</td>
              <td><Badge value={lead.followUpStatus} /></td>
              <td>{lead.agingBucket}</td>
              <td><Badge value={lead.stage} /></td>
              <td>
                <button
                  type="button"
                  className="icon-btn icon-btn--danger"
                  title="Delete lead"
                  onClick={() => onDelete(lead.id)}
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <span className="table-footer__count">
          Showing {sorted.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} leads
        </span>

        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setPage(1)}><FiChevronsLeft /></button>
          <button disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)}><FiChevronLeft /></button>
          <span className="pagination__current">{currentPage}</span>
          <button disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)}><FiChevronRight /></button>
          <button disabled={currentPage === totalPages} onClick={() => setPage(totalPages)}><FiChevronsRight /></button>

          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function formatDate(d) {
  if (!d) return '';
  // If already in MM/DD/YYYY form, return as-is
  if (d.indexOf('/') >= 0) return d;
  // Expecting YYYY-MM-DD or ISO-like; convert to MM/DD/YYYY
  const parts = String(d).split('T')[0].split('-');
  if (parts.length === 3) {
    return `${parts[1].padStart(2, '0')}/${parts[2].padStart(2, '0')}/${parts[0]}`;
  }
  return d;
}
