import { useEffect, useMemo, useState } from 'react';
import EmptyState from './EmptyState';

export default function MessagesPanel() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  async function load() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/contact/messages?limit=100', { credentials: 'include' });
      if (!res.ok) {
        setError('Could not load inbox');
        return;
      }
      setItems(await res.json());
    } catch {
      setError('Could not load inbox');
    } finally {
      setLoading(false);
    }
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
  const searching = q.trim().length > 0;

  return (
    <>
      <h2>Inbox</h2>
      <p className="hint">
        Messages from the public contact and newsletter forms. Reply opens your email app — nothing
        is sent from the CMS itself.
        {unread ? ` ${unread} unread.` : items.length ? ' All caught up.' : ''}
      </p>
      {error ? <p className="admin-status err">{error}</p> : null}
      <div className="admin-toolbar" style={{ position: 'static', background: 'transparent' }}>
        <button className="admin-btn ghost" type="button" onClick={load} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
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
          disabled={!items.length && !loading}
        />
      </div>

      {loading ? <p className="hint">Loading inbox…</p> : null}

      {!loading && items.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="Inbox is empty"
          body="When someone submits the contact or newsletter form on the public site, their message will show up here with name, email, and notes."
          actionLabel="Open public contact page"
          onAction={() => window.open('/contact', '_blank', 'noopener,noreferrer')}
          secondaryLabel="Refresh"
          onSecondary={load}
        />
      ) : null}

      {!loading && items.length > 0 && visible.length === 0 ? (
        <EmptyState
          icon="search"
          title={searching ? 'No matches for that search' : `No ${filter} messages`}
          body={
            searching
              ? 'Try a different name, email, or subject — or clear the search to see everything.'
              : filter === 'new'
                ? 'You’re caught up. Switch to All or Read to browse older messages.'
                : 'Nothing marked read yet. New messages stay here until you mark them.'
          }
          actionLabel={searching ? 'Clear search' : 'Show all'}
          onAction={() => {
            setQ('');
            setFilter('all');
          }}
        />
      ) : null}

      <div className="admin-grid">
        {visible.map((item) => (
          <div className={`admin-card${item.status === 'new' ? ' admin-card--accent' : ''}`} key={item.id}>
            <div className="admin-page-head">
              <strong>
                #{item.id} · {item.status}
                {item.source ? ` · ${item.source}` : ''}
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
