function Field({ label, children, hint }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {children}
      {hint ? <span className="admin-field__hint">{hint}</span> : null}
    </div>
  );
}

export function youtubeId(url) {
  const m = String(url || '').match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|v=)([\w-]{11})/,
  );
  return m?.[1] || '';
}

const emptyVideo = () => ({
  id: `yt-${Date.now()}`,
  title: '',
  url: '',
  description: '',
});

export default function VideosEditor({ draft, setDraft }) {
  const videos = draft.videos || [];

  function setVideos(next) {
    setDraft((d) => ({ ...d, videos: next }));
  }

  function update(i, patch) {
    const next = [...videos];
    next[i] = { ...next[i], ...patch };
    setVideos(next);
  }

  return (
    <>
      <h2>YouTube & videos</h2>
      <p className="hint">
        Paste full YouTube links. They publish on the Videos page (<code>/videos</code>) and can
        also be attached to any menu page.
      </p>
      <div className="admin-toolbar" style={{ position: 'static', background: 'transparent' }}>
        <button className="admin-btn primary" type="button" onClick={() => setVideos([emptyVideo(), ...videos])}>
          Add YouTube link
        </button>
      </div>
      {videos.length === 0 ? <p className="hint">No videos yet.</p> : null}
      {videos.map((v, i) => {
        const id = youtubeId(v.url);
        return (
          <div className="admin-card admin-grid" key={v.id || i}>
            <div className="admin-page-head">
              <strong>{v.title || `Video ${i + 1}`}</strong>
              <div className="admin-inline-actions">
                <button
                  className="admin-btn ghost"
                  type="button"
                  onClick={() =>
                    setVideos([
                      {
                        ...structuredClone(v),
                        id: `yt-${Date.now()}`,
                        title: `${v.title || 'Video'} (copy)`,
                      },
                      ...videos,
                    ])
                  }
                >
                  Duplicate
                </button>
                <button
                  className="admin-btn danger"
                  type="button"
                  onClick={() => setVideos(videos.filter((_, idx) => idx !== i))}
                >
                  Delete
                </button>
              </div>
            </div>
            <Field label="Title">
              <input value={v.title || ''} onChange={(e) => update(i, { title: e.target.value })} />
            </Field>
            <Field label="YouTube URL" hint="Example: https://www.youtube.com/watch?v=…">
              <input value={v.url || ''} onChange={(e) => update(i, { url: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea
                value={v.description || ''}
                onChange={(e) => update(i, { description: e.target.value })}
              />
            </Field>
            {id ? (
              <div className="admin-video-preview">
                <iframe
                  title={v.title || 'YouTube preview'}
                  src={`https://www.youtube.com/embed/${id}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : v.url ? (
              <p className="admin-status err">Could not read a YouTube video id from that URL.</p>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
