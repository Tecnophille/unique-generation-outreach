import { Field, uid } from './fields';
import EmptyState from './EmptyState';
import SortableList from './SortableList';

export default function AnnouncementsEditor({ draft, setDraft }) {
  const items = draft.announcements || [];

  function setItems(next) {
    setDraft((d) => ({ ...d, announcements: next }));
  }

  function add() {
    setItems([
      {
        id: uid('ann'),
        text: '',
        href: '',
        enabled: true,
        tone: 'accent',
      },
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
      <h2>Announcements</h2>
      <p className="hint">
        Site-wide banner messages shown above the navigation when enabled. Drag to reorder priority,
        then Save.
      </p>
      <button className="admin-btn primary" type="button" onClick={add}>
        New announcement
      </button>
      {items.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="No announcements yet"
          body="Add a short banner for campaigns, gatherings, or urgent updates. Only enabled ones show on the public site."
          actionLabel="New announcement"
          onAction={add}
        />
      ) : null}
      <SortableList
        items={items}
        onReorder={setItems}
        getKey={(item, i) => item.id || `ann-${i}`}
        renderItem={(item, i, { DragHandle, moveUp, moveDown, canMoveUp, canMoveDown, isDragging }) => (
          <div className={`admin-card admin-grid${isDragging ? ' is-dragging-card' : ''}`}>
            <div className="admin-page-head admin-sortable__head">
              <div className="admin-sortable__title">
                <DragHandle label={`Drag announcement ${i + 1}`} />
                <strong>Announcement {i + 1}</strong>
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
            <Field label="Message">
              <input value={item.text || ''} onChange={(e) => update(i, { text: e.target.value })} />
            </Field>
            <div className="admin-grid two">
              <Field label="Link (optional)">
                <input value={item.href || ''} onChange={(e) => update(i, { href: e.target.value })} />
              </Field>
              <Field label="Tone">
                <select
                  value={item.tone || 'accent'}
                  onChange={(e) => update(i, { tone: e.target.value })}
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
                onChange={(e) => update(i, { enabled: e.target.checked })}
              />
              Enabled on public site
            </label>
          </div>
        )}
      />
    </>
  );
}
