import { Field } from './fields';
import SortableList from './SortableList';

export default function NavEditor({ draft, setDraft }) {
  const nav = draft.nav || [];

  function setNav(next) {
    setDraft((d) => ({ ...d, nav: next }));
  }

  function update(i, patch) {
    const next = [...nav];
    next[i] = { ...next[i], ...patch };
    setNav(next);
  }

  return (
    <>
      <h2>Navigation</h2>
      <p className="hint">
        Primary menu order matches the public site and footer. Drag the handle to reorder (or use ↑
        ↓), then Save. Esc cancels an in-progress drag.
      </p>

      <div className="admin-toolbar" style={{ position: 'static', background: 'transparent' }}>
        <button
          className="admin-btn primary"
          type="button"
          onClick={() => setNav([...nav, { label: 'New link', href: '/' }])}
        >
          Add nav item
        </button>
        <button
          className="admin-btn ghost"
          type="button"
          onClick={() => {
            if (nav.some((n) => n.href === '/')) return;
            const home = { label: 'Home', href: '/' };
            const pillarsIdx = nav.findIndex((n) => n.href === '/pillars');
            if (pillarsIdx >= 0) {
              const next = [...nav];
              next.splice(pillarsIdx, 0, home);
              setNav(next);
            } else {
              setNav([home, ...nav]);
            }
          }}
        >
          Add Home before Pillars
        </button>
      </div>

      {nav.length === 0 ? (
        <p className="hint">No menu links yet. Add Home, Pillars, and the rest of your routes.</p>
      ) : null}

      <SortableList
        items={nav}
        onReorder={setNav}
        listTag="ol"
        itemTag="li"
        listClassName="admin-nav-list"
        getKey={(item, i) => `${item.href}-${i}`}
        renderItem={(item, i, { DragHandle, moveUp, moveDown, canMoveUp, canMoveDown, isDragging }) => (
          <div className={`admin-card admin-nav-item${isDragging ? ' is-dragging-card' : ''}`}>
            <div className="admin-nav-item__lead">
              <DragHandle label={`Drag ${item.label || 'nav item'}`} />
              <div className="admin-nav-item__index" aria-hidden="true">
                {i + 1}
              </div>
            </div>
            <div className="admin-grid two" style={{ flex: 1, minWidth: 0 }}>
              <Field label="Label">
                <input value={item.label || ''} onChange={(e) => update(i, { label: e.target.value })} />
              </Field>
              <Field label="Href">
                <input
                  value={item.href || ''}
                  onChange={(e) => update(i, { href: e.target.value })}
                  placeholder="/about"
                />
              </Field>
            </div>
            <div className="admin-inline-actions admin-nav-item__actions">
              <button
                className="admin-btn ghost"
                type="button"
                disabled={!canMoveUp}
                aria-label={`Move ${item.label || 'item'} up`}
                onClick={moveUp}
              >
                ↑ Up
              </button>
              <button
                className="admin-btn ghost"
                type="button"
                disabled={!canMoveDown}
                aria-label={`Move ${item.label || 'item'} down`}
                onClick={moveDown}
              >
                ↓ Down
              </button>
              <button
                className="admin-btn danger"
                type="button"
                onClick={() => setNav(nav.filter((_, idx) => idx !== i))}
              >
                Remove
              </button>
            </div>
          </div>
        )}
      />
    </>
  );
}
