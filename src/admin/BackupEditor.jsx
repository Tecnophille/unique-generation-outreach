import { useRef, useState } from 'react';

export default function BackupEditor({ draft, setDraft, onStatus, onError }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState('');

  function exportJson() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ugo-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onStatus?.('Content JSON downloaded');
  }

  async function importJson(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object' || !data.pages) {
        throw new Error('Invalid content file (missing pages)');
      }
      setDraft(data);
      setPreview(
        `Loaded ${Object.keys(data.pages || {}).length} pages · ${data.events?.length || 0} events · ${data.videos?.length || 0} videos`,
      );
      onStatus?.('Import ready — review then Save changes');
      onError?.('');
    } catch (err) {
      onError?.(err.message || 'Import failed');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <>
      <h2>Backup & restore</h2>
      <p className="hint">
        Download a full JSON snapshot of the CMS content, or import a previous export. Import loads
        into the editor only — click <strong>Save changes</strong> to publish.
      </p>
      <div className="admin-card admin-inline-actions">
        <button className="admin-btn primary" type="button" onClick={exportJson}>
          Export content JSON
        </button>
        <label className="admin-btn ghost">
          Import content JSON
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => importJson(e.target.files?.[0])}
          />
        </label>
      </div>
      {preview ? <p className="admin-status ok">{preview}</p> : null}
      <div className="admin-card">
        <h3 style={{ margin: '0 0 0.5rem' }}>Snapshot tip</h3>
        <ul className="admin-help">
          <li>Export before big redesigns so you can roll back quickly.</li>
          <li>Revision history remains available on the Dashboard after saves.</li>
          <li>Media files stay in the media library / Supabase Storage — this export is content JSON.</li>
        </ul>
      </div>
    </>
  );
}
