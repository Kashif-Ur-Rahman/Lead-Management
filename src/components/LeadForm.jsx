import { useState } from 'react';
import FormField from './FormField';
import { validate, leadValidationRules } from '../utils/validation';
import {
  SPECIALTIES,
  US_STATES,
  PLATFORMS,
  LEAD_SOURCES,
  SALES_REPS,
  PRIORITIES,
  LEAD_STATUSES,
  SERVICE_TYPES,
  STAGES,
} from '../utils/constants';

const EMPTY_LEAD = {
  practiceName: '',
  contactPerson: '',
  email: '',
  phone: '',
  specialty: '',
  state: '',
  platform: '',
  leadSource: '',
  avgCollection: '',
  salesRep: '',
  priority: '',
  leadStatus: 'Open',
  serviceType: '',
  stage: 'New',
  nextFollowUpDate: '',
};

/**
 * mode: 'add' | 'edit'
 * initialValues: pre-populates the form when editing (requirement #7)
 * onSubmit: called ONLY once every field passes validation (requirement #4/#5)
 */
export default function LeadForm({ mode = 'add', initialValues, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => ({ ...EMPTY_LEAD, ...initialValues }));
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as soon as the user starts fixing it.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values, leadValidationRules);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      // Requirement #5: do not submit, fields already show red border + message.
      return;
    }
    onSubmit({ ...values, avgCollection: Number(values.avgCollection) });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <FormField label="Practice Name" name="practiceName" value={values.practiceName} onChange={handleChange} error={errors.practiceName} placeholder="e.g. BrightCare Cardiology" />
        <FormField label="Contact Person" name="contactPerson" value={values.contactPerson} onChange={handleChange} error={errors.contactPerson} placeholder="e.g. Dr. Ahmed Khan" />
        <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="name@example.com" />
        <FormField label="Phone" name="phone" value={values.phone} onChange={handleChange} error={errors.phone} placeholder="e.g. 3055551234" />
        <FormField label="Specialty" name="specialty" type="select" options={SPECIALTIES} value={values.specialty} onChange={handleChange} error={errors.specialty} />
        <FormField label="State" name="state" type="select" options={US_STATES} value={values.state} onChange={handleChange} error={errors.state} />
        <FormField label="Platform" name="platform" type="select" options={PLATFORMS} value={values.platform} onChange={handleChange} error={errors.platform} />
        <FormField label="Lead Source" name="leadSource" type="select" options={LEAD_SOURCES} value={values.leadSource} onChange={handleChange} error={errors.leadSource} />
        <FormField label="Avg Collection ($)" name="avgCollection" type="number" value={values.avgCollection} onChange={handleChange} error={errors.avgCollection} placeholder="e.g. 50000" />
        <FormField label="Sales Rep" name="salesRep" type="select" options={SALES_REPS} value={values.salesRep} onChange={handleChange} error={errors.salesRep} />
        <FormField label="Priority" name="priority" type="select" options={PRIORITIES} value={values.priority} onChange={handleChange} error={errors.priority} />
        <FormField label="Lead Status" name="leadStatus" type="select" options={LEAD_STATUSES} value={values.leadStatus} onChange={handleChange} error={errors.leadStatus} />
        <FormField label="Service Type" name="serviceType" type="select" options={SERVICE_TYPES} value={values.serviceType} onChange={handleChange} error={errors.serviceType} />
        <FormField label="Stage" name="stage" type="select" options={STAGES} value={values.stage} onChange={handleChange} error={errors.stage} />
        <FormField label="Next Follow-up Date" name="nextFollowUpDate" type="date" value={values.nextFollowUpDate} onChange={handleChange} error={errors.nextFollowUpDate} />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          {mode === 'edit' ? 'Save Changes' : 'Save Lead'}
        </button>
      </div>
    </form>
  );
}
