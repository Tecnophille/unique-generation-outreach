import { Field, uid } from './fields';
import EmptyState from './EmptyState';

export default function RedirectsEditor({ draft, setDraft }) {
  const items = draft.redirects || [];

  function setItems(next) {
    setDraft((d) => ({ ...d, redirects: next }));
  }

  function add() {
    setItems([{ id: uid('redir'), from: '', to: '', enabled: true }, ...items]);
  }

  return (
    <>
      <h2>Redirects</h2>
      <p className="hint">
        Map old paths to new ones (SPA client redirects). Example: <code>/old</code> →{' '}
        <code>/about</code>.
      </p>
      <button className="admin-btn primary" type="button" onClick={add}>
        Add redirect
      </button>
      {items.length === 0 ? (
        <EmptyState
          icon="list"
          title="No redirects yet"
          body="Use these when a path changes so old bookmarks still land on the right page."
          actionLabel="Add redirect"
          onAction={add}
        />
      ) : null}
      {items.map((item, i) => (
        <div className="admin-card admin-grid two" key={item.id || i}>
          <Field label="From path">
            <input
              value={item.from || ''}
              placeholder="/old-path"
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, from: e.target.value };
                setItems(next);
              }}
            />
          </Field>
          <Field label="To path or URL">
            <input
              value={item.to || ''}
              placeholder="/new-path"
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, to: e.target.value };
                setItems(next);
              }}
            />
          </Field>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={item.enabled !== false}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, enabled: e.target.checked };
                setItems(next);
              }}
            />
            Enabled
          </label>
          <button
            className="admin-btn danger"
            type="button"
            onClick={() => setItems(items.filter((_, idx) => idx !== i))}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}
