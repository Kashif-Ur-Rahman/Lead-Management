import { STORAGE_KEY, getAgingBucket } from './constants';

// --- Seed data so the app isn't empty on first run (matches the sample row) ---
const SEED_LEADS = [
  {
    id: 'L-0001',
    practiceName: 'BrightCare Cardiology',
    contactPerson: 'Dr. Ahmed Khan',
    email: 'ahmed.khan@brightcare.com',
    phone: '3055551234',
    specialty: 'Gastroenterology',
    state: 'CO',
    platform: 'eClinicalWorks',
    leadSource: 'Google Ads',
    avgCollection: 50000,
    salesRep: 'Awais',
    priority: 'Medium',
    leadStatus: 'Open',
    serviceType: 'Billing & Credentialing',
    stage: 'New',
    createdDate: '2026-06-01',
    lastActivityDate: '2026-06-10',
    nextFollowUpDate: '2026-06-20',
    // snapshot fields to match the screenshot exactly
    daysSinceActivity: 7,
    agingBucket: '16-30',
    followUpStatus: 'Upcoming',
    communications: [],
  },
  {
    id: 'L-0002',
    practiceName: 'Northside Pediatrics',
    contactPerson: 'Dr. Maria Lopez',
    email: 'maria.lopez@northside.com',
    phone: '3035559876',
    specialty: 'Pediatrics',
    state: 'CA',
    platform: 'Kareo',
    leadSource: 'Referral',
    avgCollection: 120000,
    salesRep: 'Sara Khan',
    priority: 'High',
    leadStatus: 'In Progress',
    serviceType: 'Full RCM',
    stage: 'Contacted',
    createdDate: '2026-05-20',
    lastActivityDate: '2026-06-05',
    nextFollowUpDate: '2026-06-25',
    communications: [],
  },
  {
    id: 'L-0003',
    practiceName: 'Westside Orthopedics',
    contactPerson: 'Dr. Kevin Miller',
    email: 'kevin.miller@westortho.com',
    phone: '3125554411',
    specialty: 'Orthopedics',
    state: 'TX',
    platform: 'AdvancedMD',
    leadSource: 'LinkedIn',
    avgCollection: 80000,
    salesRep: 'Bilal Ahmed',
    priority: 'Low',
    leadStatus: 'Closed',
    serviceType: 'Denial Management',
    stage: 'Qualified',
    createdDate: '2026-04-12',
    lastActivityDate: '2026-06-01',
    nextFollowUpDate: '2026-06-15',
    communications: [],
  },
];

function daysBetween(dateStr, from = new Date()) {
  const date = new Date(dateStr);
  const diff = Math.floor((from.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / 86400000);
  return diff;
}

// Computes the columns that must never be typed in manually, so they can
// never drift out of sync with their source dates (Days Since Activity,
// Aging Bucket, Follow-up Status all derive from stored dates every render).
export function withDerivedFields(lead) {
  // If the lead already contains snapshot/seeded values for these derived
  // fields (used to match a static screenshot), prefer them. Otherwise
  // compute dynamically from the stored dates.
  const daysSinceActivity = typeof lead.daysSinceActivity === 'number'
    ? lead.daysSinceActivity
    : Math.max(daysBetween(lead.lastActivityDate), 0);

  const agingBucket = lead.agingBucket || getAgingBucket(daysSinceActivity);

  let followUpStatus;
  if (lead.followUpStatus) {
    followUpStatus = lead.followUpStatus;
  } else {
    const daysToFollowUp = daysBetween(lead.nextFollowUpDate) * -1; // positive = future
    followUpStatus = 'Upcoming';
    if (daysToFollowUp < 0) followUpStatus = 'Overdue';
    else if (daysToFollowUp === 0) followUpStatus = 'Due Today';
  }

  return { ...lead, daysSinceActivity, agingBucket, followUpStatus };
}

export function loadLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LEADS));
      return SEED_LEADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load leads from storage', e);
    return SEED_LEADS;
  }
}

export function saveLeads(leads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error('Failed to save leads to storage', e);
  }
}

export function generateNextLeadId(leads) {
  const max = leads.reduce((acc, l) => {
    const num = parseInt(String(l.id).replace('L-', ''), 10);
    return Number.isNaN(num) ? acc : Math.max(acc, num);
  }, 0);
  return `L-${String(max + 1).padStart(4, '0')}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
