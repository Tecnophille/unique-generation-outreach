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
