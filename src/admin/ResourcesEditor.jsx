import { Field, uid } from './fields';
import MediaPicker from './MediaPicker';

export default function ResourcesEditor({ draft, setDraft }) {
  const items = draft.resources || [];

  function setItems(next) {
    setDraft((d) => ({ ...d, resources: next }));
  }

  return (
    <>
      <h2>Resources & downloads</h2>
      <p className="hint">
        Guides, flyers, and files linked from a Resources page. Image covers can come from the media
        library; file URLs can be external or uploaded hosts.
      </p>
      <div className="admin-toolbar" style={{ position: 'static', background: 'transparent' }}>
        <button
          className="admin-btn primary"
          type="button"
          onClick={() =>
            setItems([
              {
                id: uid('res'),
                title: '',
                description: '',
                url: '',
                cover: '',
                category: 'Guide',
                featured: false,
              },
              ...items,
            ])
          }
        >
          Add resource
        </button>
        <button
          className="admin-btn ghost"
          type="button"
          onClick={() => {
            if (draft.pages?.resources) return;
            setDraft((d) => ({
              ...d,
              pages: {
                ...(d.pages || {}),
                resources: {
                  label: 'Resources',
                  title: 'Resources & downloads',
                  intro: 'Guides and materials from Unique Generation Outreach.',
                  useSiteResources: true,
                  custom: true,
                  status: 'published',
                },
              },
              nav: (d.nav || []).some((n) => n.href === '/resources')
                ? d.nav
                : [...(d.nav || []), { label: 'Resources', href: '/resources' }],
            }));
          }}
        >
          Ensure /resources page
        </button>
      </div>
      {items.map((item, i) => (
        <div className="admin-card admin-grid" key={item.id || i}>
          <div className="admin-page-head">
            <strong>{item.title || `Resource ${i + 1}`}</strong>
            <button
              className="admin-btn danger"
              type="button"
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            >
              Delete
            </button>
          </div>
          <div className="admin-grid two">
            <Field label="Title">
              <input
                value={item.title || ''}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, title: e.target.value };
                  setItems(next);
                }}
              />
            </Field>
            <Field label="Category">
              <input
                value={item.category || ''}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, category: e.target.value };
                  setItems(next);
                }}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              value={item.description || ''}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, description: e.target.value };
                setItems(next);
              }}
            />
          </Field>
          <Field label="File / link URL">
            <input
              value={item.url || ''}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, url: e.target.value };
                setItems(next);
              }}
            />
          </Field>
          <Field label="Cover image URL">
            <input
              value={item.cover || ''}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, cover: e.target.value };
                setItems(next);
              }}
            />
          </Field>
          <MediaPicker
            onPick={(url) => {
              const next = [...items];
              next[i] = { ...item, cover: url };
              setItems(next);
            }}
          />
          <label className="admin-check">
            <input
              type="checkbox"
              checked={Boolean(item.featured)}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, featured: e.target.checked };
                setItems(next);
              }}
            />
            Featured
          </label>
        </div>
      ))}
    </>
  );
}
