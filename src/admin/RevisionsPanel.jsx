import { useEffect, useState } from 'react';
import EmptyState from './EmptyState';

export default function RevisionsPanel({ onRestored }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setError('');
    const res = await fetch('/api/content/revisions?limit=12', { credentials: 'include' });
    if (!res.ok) {
      setError('Could not load revisions');
      return;
    }
    setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function restore(id) {
    setBusyId(id);
    setError('');
    try {
      const res = await fetch(`/api/content/revisions/${id}/restore`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Restore failed');
      const payload = await res.json();
      onRestored?.(payload);
      await load();
    } catch (err) {
      setError(err.message || 'Restore failed');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="admin-card">
      <div className="admin-page-head">
        <h3 style={{ margin: 0 }}>Content revisions</h3>
        <button className="admin-btn ghost" type="button" onClick={load}>
          Refresh
        </button>
      </div>
      <p className="hint">Every save creates a revision in the database. Restore if you need to roll back.</p>
      {error ? <p className="admin-status err">{error}</p> : null}
      <div className="admin-grid">
        {items.length === 0 ? (
          <EmptyState
            icon="list"
            title="No revisions yet"
            body="Each Save in the studio creates a restore point here. Make a change and save to start the history."
            actionLabel="Refresh"
            onAction={load}
          />
        ) : null}
        {items.map((item) => (
          <div key={item.id} className="admin-list-item" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <div>
              <strong>#{item.id}</strong> · {item.note || 'Save'}
              <div className="hint" style={{ margin: 0 }}>
                {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
              </div>
            </div>
            <button
              className="admin-btn ghost"
              type="button"
              disabled={busyId === item.id}
              onClick={() => restore(item.id)}
            >
              {busyId === item.id ? 'Restoring…' : 'Restore'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
