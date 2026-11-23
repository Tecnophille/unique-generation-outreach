import { useEffect, useMemo, useState } from 'react';
import EmptyState from './EmptyState';

export default function MediaLibrary({ onStatus, onError }) {
  const [uploads, setUploads] = useState([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch('/api/uploads', { credentials: 'include' });
    if (res.ok) setUploads(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return uploads;
    return uploads.filter((f) =>
      `${f.original_name || ''} ${f.filename || ''} ${f.url || ''}`
        .toLowerCase()
        .includes(needle),
    );
  }, [uploads, q]);

  async function uploadFiles(files) {
    setBusy(true);
    try {
      for (const file of files) {
        const body = new FormData();
        body.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          body,
        });
        if (!res.ok) throw new Error('Upload failed');
      }
      await load();
      onStatus?.(`Uploaded ${files.length} file(s)`);
      onError?.('');
    } catch (err) {
      onError?.(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!id) return;
    if (!window.confirm('Delete this media asset from the library?')) return;
    const res = await fetch(`/api/uploads/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      onError?.('Delete failed');
      return;
    }
    await load();
    onStatus?.('Media deleted');
  }

  return (
    <>
      <h2>Media library</h2>
      <p className="hint">
        Central image bank for banners, events, galleries, and partners. Search, upload many at once,
        copy URLs, or delete unused assets.
      </p>
      <div className="admin-toolbar" style={{ position: 'static', background: 'transparent' }}>
        <label className="admin-btn primary">
          {busy ? 'Uploading…' : 'Upload images'}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={busy}
            onChange={(e) => {
              const files = [...(e.target.files || [])];
              if (files.length) uploadFiles(files);
              e.target.value = '';
            }}
          />
        </label>
        <input
          className="admin-search"
          placeholder="Search media…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="admin-status">
          {filtered.length} / {uploads.length}
        </span>
      </div>
      <div className="admin-media-grid">
        {uploads.length === 0 ? (
          <EmptyState
            icon="media"
            title="Media library is empty"
            body="Upload images here, then reuse them for team photos, events, heroes, and partners."
          />
        ) : null}
        {uploads.length > 0 && filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="No media matched"
            body="Try another filename, or clear the search to see everything in the library."
            actionLabel="Clear search"
            onAction={() => setQ('')}
          />
        ) : null}
        {filtered.map((f) => (
          <div className="admin-media-card" key={f.id || f.url}>
            <img
              className="admin-thumb"
              src={f.url}
              alt={f.original_name || f.filename || 'Upload'}
            />
            <code title={f.url}>{f.original_name || f.filename || f.url}</code>
            <div className="admin-inline-actions">
              <button
                className="admin-btn ghost"
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(f.url);
                    onStatus?.('Copied image URL');
                  } catch {
                    onStatus?.(f.url);
                  }
                }}
              >
                Copy URL
              </button>
              {f.id ? (
                <button className="admin-btn danger" type="button" onClick={() => remove(f.id)}>
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
