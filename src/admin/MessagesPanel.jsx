import { useEffect, useMemo, useState } from 'react';

export default function MessagesPanel() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  async function load() {
    setError('');
    const res = await fetch('/api/contact/messages?limit=100', { credentials: 'include' });
    if (!res.ok) {
      setError('Could not load inbox');
      return;
    }
    setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((item) => {
      if (filter === 'new' && item.status !== 'new') return false;
      if (filter === 'read' && item.status === 'new') return false;
      if (!needle) return true;
      return `${item.name || ''} ${item.email || ''} ${item.subject || ''} ${item.message || ''}`
        .toLowerCase()
        .includes(needle);
    });
  }, [items, filter, q]);

  async function markRead(id) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/contact/messages/${id}/read`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Update failed');
      await load();
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this message permanently?')) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/contact/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      await load();
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setBusyId(null);
    }
  }

  const unread = items.filter((i) => i.status === 'new').length;

  return (
    <>
      <h2>Inbox</h2>
      <p className="hint">
        Messages from the public contact form. {unread ? `${unread} unread.` : 'All caught up.'}
      </p>
      {error ? <p className="admin-status err">{error}</p> : null}
      <div className="admin-toolbar" style={{ position: 'static', background: 'transparent' }}>
        <button className="admin-btn ghost" type="button" onClick={load}>
          Refresh
        </button>
        <div className="admin-page-tabs" style={{ margin: 0 }}>
          {['all', 'new', 'read'].map((f) => (
            <button
              key={f}
              type="button"
              className={filter === f ? 'is-active' : ''}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          className="admin-search"
          placeholder="Search inbox…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="admin-grid">
        {visible.length === 0 ? <p className="hint">No messages in this view.</p> : null}
        {visible.map((item) => (
          <div className={`admin-card${item.status === 'new' ? ' admin-card--accent' : ''}`} key={item.id}>
            <div className="admin-page-head">
              <strong>
                #{item.id} · {item.status}
              </strong>
              <span className="hint" style={{ margin: 0 }}>
                {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
              </span>
            </div>
            <p style={{ margin: '0.35rem 0' }}>
              <strong>{item.name || 'Anonymous'}</strong>
              {item.email ? ` · ${item.email}` : ''}
              {item.phone ? ` · ${item.phone}` : ''}
            </p>
            {item.subject ? <p className="hint">{item.subject}</p> : null}
            <p>{item.message}</p>
            <div className="admin-inline-actions">
              {item.email ? (
                <a
                  className="admin-btn ghost"
                  href={`mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent(
                    `Re: ${item.subject || 'Your message to UGO'}`,
                  )}`}
                >
                  Reply by email
                </a>
              ) : null}
              {item.status === 'new' ? (
                <button
                  className="admin-btn ghost"
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => markRead(item.id)}
                >
                  {busyId === item.id ? 'Updating…' : 'Mark read'}
                </button>
              ) : null}
              <button
                className="admin-btn danger"
                type="button"
                disabled={busyId === item.id}
                onClick={() => remove(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
