import { useEffect, useState } from 'react';

export default function MediaPicker({ onPick, label = 'Pick from library' }) {
  const [open, setOpen] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch('/api/uploads', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then(setUploads)
      .catch(() => setUploads([]));
  }, [open]);

  async function upload(file) {
    if (!file) return;
    setBusy(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setUploads((u) => [data, ...u]);
      onPick?.(data.url);
      setOpen(false);
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-media-picker">
      <button className="admin-btn ghost" type="button" onClick={() => setOpen((v) => !v)}>
        {open ? 'Close library' : label}
      </button>
      {open ? (
        <div className="admin-media-picker__panel">
          <label className="admin-btn ghost admin-media-picker__upload">
            {busy ? 'Uploading…' : 'Upload new image'}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={busy}
              onChange={(e) => upload(e.target.files?.[0])}
            />
          </label>
          <div className="admin-media-picker__grid">
            {uploads.length === 0 ? <p className="hint">No uploads yet.</p> : null}
            {uploads.map((f) => (
              <button
                key={f.id || f.url}
                type="button"
                className="admin-media-picker__item"
                onClick={() => {
                  onPick?.(f.url);
                  setOpen(false);
                }}
              >
                <img src={f.url} alt="" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
