import { Field, uid } from './fields';
import MediaPicker from './MediaPicker';
import EmptyState from './EmptyState';
import SortableList from './SortableList';

export default function ResourcesEditor({ draft, setDraft }) {
  const items = draft.resources || [];

  function setItems(next) {
    setDraft((d) => ({ ...d, resources: next }));
  }

  function add() {
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
    ]);
  }

  function update(i, patch) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    setItems(next);
  }

  return (
    <>
      <h2>Resources & downloads</h2>
      <p className="hint">
        Guides, flyers, and files linked from a Resources page. Drag to reorder, then Save.
      </p>
      <div className="admin-toolbar" style={{ position: 'static', background: 'transparent' }}>
        <button className="admin-btn primary" type="button" onClick={add}>
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
      {items.length === 0 ? (
        <EmptyState
          icon="list"
          title="No resources yet"
          body="Add guides, flyers, or download links for the Resources page."
          actionLabel="Add resource"
          onAction={add}
        />
      ) : null}
      <SortableList
        items={items}
        onReorder={setItems}
        getKey={(item, i) => item.id || `res-${i}`}
        renderItem={(item, i, { DragHandle, moveUp, moveDown, canMoveUp, canMoveDown, isDragging }) => (
          <div className={`admin-card admin-grid${isDragging ? ' is-dragging-card' : ''}`}>
            <div className="admin-page-head admin-sortable__head">
              <div className="admin-sortable__title">
                <DragHandle label={`Drag ${item.title || `resource ${i + 1}`}`} />
                <strong>{item.title || `Resource ${i + 1}`}</strong>
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
              <Field label="Title">
                <input value={item.title || ''} onChange={(e) => update(i, { title: e.target.value })} />
              </Field>
              <Field label="Category">
                <input
                  value={item.category || ''}
                  onChange={(e) => update(i, { category: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                value={item.description || ''}
                onChange={(e) => update(i, { description: e.target.value })}
              />
            </Field>
            <Field label="File / link URL">
              <input value={item.url || ''} onChange={(e) => update(i, { url: e.target.value })} />
            </Field>
            <Field label="Cover image URL">
              <input value={item.cover || ''} onChange={(e) => update(i, { cover: e.target.value })} />
            </Field>
            <MediaPicker onPick={(url) => update(i, { cover: url })} />
            <label className="admin-check">
              <input
                type="checkbox"
                checked={Boolean(item.featured)}
                onChange={(e) => update(i, { featured: e.target.checked })}
              />
              Featured
            </label>
          </div>
        )}
      />
    </>
  );
}
