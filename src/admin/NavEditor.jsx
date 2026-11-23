import { Field } from './fields';

function moveItem(list, from, to) {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

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
        Primary menu order matches the public site and footer. Use Move up / Move down (or ↑ ↓) to
        reorder, then Save.
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

      <ol className="admin-nav-list">
        {nav.map((item, i) => (
          <li className="admin-card admin-nav-item" key={`${item.href}-${i}`}>
            <div className="admin-nav-item__index" aria-hidden="true">
              {i + 1}
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
                disabled={i === 0}
                aria-label={`Move ${item.label || 'item'} up`}
                onClick={() => setNav(moveItem(nav, i, i - 1))}
              >
                ↑ Up
              </button>
              <button
                className="admin-btn ghost"
                type="button"
                disabled={i >= nav.length - 1}
                aria-label={`Move ${item.label || 'item'} down`}
                onClick={() => setNav(moveItem(nav, i, i + 1))}
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
          </li>
        ))}
      </ol>
    </>
  );
}
