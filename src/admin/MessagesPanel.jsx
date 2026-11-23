import { useEffect, useState } from 'react';

export default function MessagesPanel() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setError('');
    const res = await fetch('/api/contact/messages?limit=40', { credentials: 'include' });
    if (!res.ok) {
      setError('Could not load inbox');
      return;
    }
    setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

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

  return (
    <>
      <h2>Inbox</h2>
      <p className="hint">Messages from the public contact / newsletter form are stored in the CMS database.</p>
      {error ? <p className="admin-status err">{error}</p> : null}
      <div className="admin-card" style={{ marginBottom: '1rem' }}>
        <button className="admin-btn ghost" type="button" onClick={load}>
          Refresh inbox
        </button>
      </div>
      <div className="admin-grid">
        {items.length === 0 ? <p className="hint">No messages yet.</p> : null}
        {items.map((item) => (
          <div className="admin-card" key={item.id}>
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
            </p>
            {item.subject ? <p className="hint">{item.subject}</p> : null}
            <p>{item.message}</p>
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
          </div>
        ))}
      </div>
    </>
  );
}
