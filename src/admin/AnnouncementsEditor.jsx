import { Field, uid } from './fields';

export default function AnnouncementsEditor({ draft, setDraft }) {
  const items = draft.announcements || [];

  function setItems(next) {
    setDraft((d) => ({ ...d, announcements: next }));
  }

  return (
    <>
      <h2>Announcements</h2>
      <p className="hint">Site-wide banner messages shown above the navigation when enabled.</p>
      <button
        className="admin-btn primary"
        type="button"
        onClick={() =>
          setItems([
            {
              id: uid('ann'),
              text: '',
              href: '',
              enabled: true,
              tone: 'accent',
            },
            ...items,
          ])
        }
      >
        New announcement
      </button>
      {items.length === 0 ? <p className="hint">No announcements yet.</p> : null}
      {items.map((item, i) => (
        <div className="admin-card admin-grid" key={item.id || i}>
          <div className="admin-page-head">
            <strong>Announcement {i + 1}</strong>
            <button
              className="admin-btn danger"
              type="button"
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            >
              Delete
            </button>
          </div>
          <Field label="Message">
            <input
              value={item.text || ''}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, text: e.target.value };
                setItems(next);
              }}
            />
          </Field>
          <div className="admin-grid two">
            <Field label="Link (optional)">
              <input
                value={item.href || ''}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, href: e.target.value };
                  setItems(next);
                }}
              />
            </Field>
            <Field label="Tone">
              <select
                value={item.tone || 'accent'}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, tone: e.target.value };
                  setItems(next);
                }}
              >
                <option value="accent">Accent</option>
                <option value="warm">Warm</option>
                <option value="ink">Ink</option>
              </select>
            </Field>
          </div>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={Boolean(item.enabled)}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, enabled: e.target.checked };
                setItems(next);
              }}
            />
            Enabled on public site
          </label>
        </div>
      ))}
    </>
  );
}
