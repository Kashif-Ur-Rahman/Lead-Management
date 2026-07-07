// Generic, reusable validation engine.
// Both the Add form and Edit form import the SAME `leadValidationRules` and
// call the SAME `validate()` function - so validation logic only ever lives
// in one place (DRY). Adding/changing a business rule here automatically
// applies everywhere the rule is used.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[A-Za-z.\s]+$/;

// Each rule is a small function: (value, allValues) => errorMessage | null
export const leadValidationRules = {
  practiceName: (v) => {
    if (!v || !v.trim()) return 'Practice name is required.';
    if (v.trim().length < 2) return 'Practice name must be at least 2 characters.';
    return null;
  },
  contactPerson: (v) => {
    if (!v || !v.trim()) return 'Contact person is required.';
    if (!NAME_RE.test(v.trim())) return 'Contact person can only contain letters.';
    return null;
  },
  email: (v) => {
    if (!v || !v.trim()) return 'Email is required.';
    if (!EMAIL_RE.test(v.trim())) return 'Enter a valid email address.';
    return null;
  },
  phone: (v) => {
    if (!v || !v.trim()) return 'Phone number is required.';
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) return 'Enter a valid phone number (10-13 digits).';
    return null;
  },
  specialty: (v) => (!v ? 'Specialty is required.' : null),
  state: (v) => (!v ? 'State is required.' : null),
  platform: (v) => (!v ? 'Platform is required.' : null),
  leadSource: (v) => (!v ? 'Lead source is required.' : null),
  salesRep: (v) => (!v ? 'Sales rep is required.' : null),
  priority: (v) => (!v ? 'Priority is required.' : null),
  leadStatus: (v) => (!v ? 'Lead status is required.' : null),
  serviceType: (v) => (!v ? 'Service type is required.' : null),
  stage: (v) => (!v ? 'Stage is required.' : null),
  avgCollection: (v) => {
    if (v === '' || v === null || v === undefined) return 'Avg collection is required.';
    if (Number.isNaN(Number(v))) return 'Avg collection must be a number.';
    if (Number(v) <= 0) return 'Avg collection must be greater than 0.';
    return null;
  },
  nextFollowUpDate: (v) => {
    if (!v) return 'Next follow-up date is required.';
    return null;
  },
};

// Runs every rule against its matching field in `values`.
// Returns an { fieldName: errorMessage } map containing ONLY invalid fields.
export function validate(values, rules = leadValidationRules) {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    const message = rules[field](values[field], values);
    if (message) errors[field] = message;
  });
  return errors;
}

export const communicationValidationRules = {
  type: (v) => (!v ? 'Type is required.' : null),
  note: (v) => {
    if (!v || !v.trim()) return 'Note is required.';
    if (v.trim().length < 3) return 'Note must be at least 3 characters.';
    return null;
  },
};
