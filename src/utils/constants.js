// Single source of truth for all dropdown / select options + badge colors.
// Add form, Edit form, Filters, and Table all import from here so nothing
// ever goes out of sync (DRY principle - no duplicated option lists).

export const STORAGE_KEY = 'lead_management_leads';

export const SPECIALTIES = [
  'Cardiology',
  'Gastroenterology',
  'Orthopedics',
  'Dermatology',
  'Pediatrics',
  'Neurology',
  'General Surgery',
];

export const US_STATES = ['CO', 'CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC'];

export const PLATFORMS = [
  'eClinicalWorks',
  'Kareo',
  'AdvancedMD',
  'Athenahealth',
  'DrChrono',
  'NextGen',
];

export const LEAD_SOURCES = [
  'Google Ads',
  'Referral',
  'Cold Call',
  'LinkedIn',
  'Website',
  'Email Campaign',
];

export const SALES_REPS = ['Awais', 'Sara Khan', 'Bilal Ahmed', 'Hina Tariq', 'Umar Farooq'];

export const PRIORITIES = ['Low', 'Medium', 'High'];

// "Lead Status" as seen in the filter bar / table (Open vs Closed pipeline state)
export const LEAD_STATUSES = ['Open', 'In Progress', 'Closed', 'Lost'];

export const SERVICE_TYPES = [
  'Billing & Credentialing',
  'Medical Coding',
  'Prior Authorization',
  'Full RCM',
  'Denial Management',
];

// "Stage" column - sales pipeline stage
export const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

export const FOLLOW_UP_STATUSES = ['Upcoming', 'Due Today', 'Overdue'];

export const COMMUNICATION_TYPES = ['Call', 'Email', 'Meeting', 'Note'];

// Badge color map so status pills render consistently everywhere they appear.
export const BADGE_COLORS = {
  Low: { bg: '#e6f4ea', color: '#1e7e34' },
  Medium: { bg: '#fff4e0', color: '#b26a00' },
  High: { bg: '#fde8e8', color: '#c62828' },
  Open: { bg: '#e6f4ea', color: '#1e7e34' },
  'In Progress': { bg: '#e8f0fe', color: '#1a56db' },
  Closed: { bg: '#eceff1', color: '#455a64' },
  Lost: { bg: '#fde8e8', color: '#c62828' },
  Upcoming: { bg: '#e8f0fe', color: '#1a56db' },
  'Due Today': { bg: '#fff4e0', color: '#b26a00' },
  Overdue: { bg: '#fde8e8', color: '#c62828' },
  New: { bg: '#eceff1', color: '#455a64' },
  Contacted: { bg: '#e8f0fe', color: '#1a56db' },
  Qualified: { bg: '#f3e8fd', color: '#7e22ce' },
  Proposal: { bg: '#fff4e0', color: '#b26a00' },
  Won: { bg: '#e6f4ea', color: '#1e7e34' },
};

// Aging bucket is derived automatically from "days since activity" - never
// entered manually, so it can never disagree with the number shown next to it.
export function getAgingBucket(days) {
  if (days <= 15) return '0-15';
  if (days <= 30) return '16-30';
  if (days <= 60) return '31-60';
  return '60+';
}
