export { normalizeContent, uid } from '../cms/contentModel';

export function Field({ label, htmlFor, children, hint }) {
  return (
    <div className="admin-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint ? <span className="admin-field__hint">{hint}</span> : null}
    </div>
  );
}

export function ListToolbar({ onAdd, addLabel, children }) {
  return (
    <div className="admin-list-toolbar">
      {onAdd ? (
        <button className="admin-btn ghost" type="button" onClick={onAdd}>
          {addLabel || 'Add'}
        </button>
      ) : null}
      {children}
    </div>
  );
}

/** Presets for CSS object-position — keeps faces in frame when cover-cropping. */
export const IMAGE_FOCUS_OPTIONS = [
  { value: 'center top', label: 'Faces (top) — recommended' },
  { value: 'center 20%', label: 'Near top' },
  { value: 'center center', label: 'Center' },
  { value: 'center 65%', label: 'Lower third' },
  { value: 'center bottom', label: 'Bottom' },
];

export function ImageFocusField({ value, onChange, hint }) {
  const current = value || 'center top';
  const known = IMAGE_FOCUS_OPTIONS.some((o) => o.value === current);
  return (
    <Field
      label="Image focus"
      hint={hint || 'If heads are cropped, choose Faces (top). Avoid Center for portraits.'}
    >
      <select value={known ? current : 'custom'} onChange={(e) => {
        if (e.target.value === 'custom') return;
        onChange(e.target.value);
      }}>
        {IMAGE_FOCUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        {!known ? <option value="custom">Custom ({current})</option> : null}
      </select>
    </Field>
  );
}
