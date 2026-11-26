import { Field, uid } from './fields';
import MediaPicker from './MediaPicker';
import EmptyState from './EmptyState';
import SortableList from './SortableList';

export default function PartnersEditor({ draft, setDraft }) {
  const items = draft.partners || [];

  function setItems(next) {
    setDraft((d) => ({ ...d, partners: next }));
  }

  function add() {
    setItems([{ id: uid('ptr'), name: '', url: '', logo: '', blurb: '' }, ...items]);
  }

  function update(i, patch) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    setItems(next);
  }

  return (
    <>
      <h2>Partners & sponsors</h2>
      <p className="hint">
        Logos and links for organizations walking with UGO. Drag to reorder, then Save.
      </p>
      <button className="admin-btn primary" type="button" onClick={add}>
        Add partner
      </button>
      {items.length === 0 ? (
        <EmptyState
          icon="media"
          title="No partners yet"
          body="Add organizations with a logo and link. They can show in the homepage partners strip."
          actionLabel="Add partner"
          onAction={add}
        />
      ) : null}
      <SortableList
        items={items}
        onReorder={setItems}
        getKey={(item, i) => item.id || `ptr-${i}`}
        renderItem={(item, i, { DragHandle, moveUp, moveDown, canMoveUp, canMoveDown, isDragging }) => (
          <div className={`admin-card admin-grid${isDragging ? ' is-dragging-card' : ''}`}>
            <div className="admin-page-head admin-sortable__head">
              <div className="admin-sortable__title">
                <DragHandle label={`Drag ${item.name || `partner ${i + 1}`}`} />
                <strong>{item.name || `Partner ${i + 1}`}</strong>
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
            <div className="admin-grid two">
              <Field label="Name">
                <input value={item.name || ''} onChange={(e) => update(i, { name: e.target.value })} />
              </Field>
              <Field label="Website URL">
                <input value={item.url || ''} onChange={(e) => update(i, { url: e.target.value })} />
              </Field>
            </div>
            <Field label="Logo URL">
              <input value={item.logo || ''} onChange={(e) => update(i, { logo: e.target.value })} />
            </Field>
            <MediaPicker onPick={(url) => update(i, { logo: url })} />
            {item.logo ? <img className="admin-thumb" src={item.logo} alt="" /> : null}
            <Field label="Blurb">
              <textarea value={item.blurb || ''} onChange={(e) => update(i, { blurb: e.target.value })} />
            </Field>
          </div>
        )}
      />
    </>
  );
}
