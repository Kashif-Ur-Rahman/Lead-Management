import { useState } from 'react';
import FormField from './FormField';
import { validate, communicationValidationRules } from '../utils/validation';
import { COMMUNICATION_TYPES } from '../utils/constants';

const EMPTY = { type: '', note: '' };

export default function CommunicationSection({ communications = [], onAdd }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values, communicationValidationRules);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onAdd(values); // Parent prepends it - new entry appears immediately (req #11).
    setValues(EMPTY);
  }

  return (
    <section className="comm-section">
      <h3 className="section-title">Communication</h3>

      <form onSubmit={handleSubmit} className="comm-form">
        <div className="comm-form__row">
          <div className="comm-form__type">
            <FormField
              label="Type"
              name="type"
              type="select"
              options={COMMUNICATION_TYPES}
              value={values.type}
              onChange={handleChange}
              error={errors.type}
            />
          </div>
          <div className="comm-form__note">
            <FormField
              label="Note"
              name="note"
              type="textarea"
              value={values.note}
              onChange={handleChange}
              error={errors.note}
              placeholder="What was discussed?"
            />
          </div>
        </div>
        <div className="form-actions form-actions--left">
          <button type="submit" className="btn btn--primary">
            Save Note
          </button>
        </div>
      </form>

      <table className="comm-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {communications.length === 0 && (
            <tr>
              <td colSpan={3} className="empty-cell">No communication notes yet.</td>
            </tr>
          )}
          {communications.map((c) => (
            <tr key={c.id}>
              <td>{c.date}</td>
              <td>{c.type}</td>
              <td>{c.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
