import './FormField.css';

/**
 * One reusable field component used for every input/select on both the
 * Add and Edit forms. Centralizing the "red border + error message" logic
 * here means requirement #5 (highlight invalid fields, show messages) is
 * implemented exactly once instead of being copy-pasted per field.
 */
export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  options,
  placeholder,
  required = true,
}) {
  const hasError = Boolean(error);

  const commonProps = {
    id: name,
    name,
    value: value ?? '',
    onChange,
    className: `field-control ${hasError ? 'field-control--error' : ''}`,
  };

  return (
    <div className="field-group">
      <label htmlFor={name} className="field-label">
        {label} {required && <span className="field-required">*</span>}
      </label>

      {type === 'select' ? (
        <select {...commonProps}>
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea {...commonProps} placeholder={placeholder} rows={3} />
      ) : (
        <input {...commonProps} type={type} placeholder={placeholder} />
      )}

      {hasError && <p className="field-error">{error}</p>}
    </div>
  );
}
