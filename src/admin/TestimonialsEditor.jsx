import { Field, uid } from './fields';
import MediaPicker from './MediaPicker';
import EmptyState from './EmptyState';

export default function TestimonialsEditor({ draft, setDraft }) {
  const items = draft.testimonials || [];

  function setItems(next) {
    setDraft((d) => ({ ...d, testimonials: next }));
  }

  function add() {
    setItems([
      { id: uid('tst'), quote: '', name: '', role: '', image: '', featured: true },
      ...items,
    ]);
  }

  return (
    <>
      <h2>Testimonials</h2>
      <p className="hint">Quotes from partners, members, and friends of the mission.</p>
      <button className="admin-btn primary" type="button" onClick={add}>
        Add testimonial
      </button>
      {items.length === 0 ? (
        <EmptyState
          icon="list"
          title="No testimonials yet"
          body="Featured quotes can appear on the homepage. Add a name, role, and optional photo."
          actionLabel="Add testimonial"
          onAction={add}
        />
      ) : null}
      {items.map((item, i) => (
        <div className="admin-card admin-grid" key={item.id || i}>
          <div className="admin-page-head">
            <strong>{item.name || `Testimonial ${i + 1}`}</strong>
            <button
              className="admin-btn danger"
              type="button"
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            >
              Delete
            </button>
          </div>
          <Field label="Quote">
            <textarea
              value={item.quote || ''}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, quote: e.target.value };
                setItems(next);
              }}
            />
          </Field>
          <div className="admin-grid two">
            <Field label="Name">
              <input
                value={item.name || ''}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, name: e.target.value };
                  setItems(next);
                }}
              />
            </Field>
            <Field label="Role / place">
              <input
                value={item.role || ''}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, role: e.target.value };
                  setItems(next);
                }}
              />
            </Field>
          </div>
          <Field label="Photo URL">
            <input
              value={item.image || ''}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, image: e.target.value };
                setItems(next);
              }}
            />
          </Field>
          <MediaPicker
            onPick={(url) => {
              const next = [...items];
              next[i] = { ...item, image: url };
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
            Featured on homepage
          </label>
        </div>
      ))}
    </>
  );
}
