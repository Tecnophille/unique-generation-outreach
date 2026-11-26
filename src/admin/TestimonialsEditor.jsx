import { Field, uid } from './fields';
import MediaPicker from './MediaPicker';
import EmptyState from './EmptyState';
import SortableList from './SortableList';

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

  function update(i, patch) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    setItems(next);
  }

  return (
    <>
      <h2>Testimonials</h2>
      <p className="hint">
        Quotes from partners, members, and friends of the mission. Drag to reorder, then Save.
      </p>
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
      <SortableList
        items={items}
        onReorder={setItems}
        getKey={(item, i) => item.id || `tst-${i}`}
        renderItem={(item, i, { DragHandle, moveUp, moveDown, canMoveUp, canMoveDown, isDragging }) => (
          <div className={`admin-card admin-grid${isDragging ? ' is-dragging-card' : ''}`}>
            <div className="admin-page-head admin-sortable__head">
              <div className="admin-sortable__title">
                <DragHandle label={`Drag ${item.name || `testimonial ${i + 1}`}`} />
                <strong>{item.name || `Testimonial ${i + 1}`}</strong>
              </div>
              <div className="admin-inline-actions">
                <button className="admin-btn ghost" type="button" disabled={!canMoveUp} onClick={moveUp}>
                  ↑
                </button>
                <button className="admin-btn ghost" type="button" disabled={!canMoveDown} onClick={moveDown}>
                  ↓
                </button>
                <button
                  className="admin-btn danger"
                  type="button"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                >
                  Delete
                </button>
              </div>
            </div>
            <Field label="Quote">
              <textarea value={item.quote || ''} onChange={(e) => update(i, { quote: e.target.value })} />
            </Field>
            <div className="admin-grid two">
              <Field label="Name">
                <input value={item.name || ''} onChange={(e) => update(i, { name: e.target.value })} />
              </Field>
              <Field label="Role / place">
                <input value={item.role || ''} onChange={(e) => update(i, { role: e.target.value })} />
              </Field>
            </div>
            <Field label="Photo URL">
              <input value={item.image || ''} onChange={(e) => update(i, { image: e.target.value })} />
            </Field>
            <MediaPicker onPick={(url) => update(i, { image: url })} />
            <label className="admin-check">
              <input
                type="checkbox"
                checked={Boolean(item.featured)}
                onChange={(e) => update(i, { featured: e.target.checked })}
              />
              Featured on homepage
            </label>
          </div>
        )}
      />
    </>
  );
}
