import MediaPicker from './MediaPicker';

function Field({ label, children }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

const emptyEvent = () => ({
  id: `ev-${Date.now()}`,
  title: '',
  date: '',
  location: '',
  image: '',
  summary: '',
  link: '',
});

export default function EventsEditor({ draft, setDraft }) {
  const events = draft.events || [];

  function setEvents(next) {
    setDraft((d) => ({ ...d, events: next }));
  }

  function update(i, patch) {
    const next = [...events];
    next[i] = { ...next[i], ...patch };
    setEvents(next);
  }

  return (
    <>
      <h2>Events</h2>
      <p className="hint">
        Site-wide events appear on the Events page (create or open <code>/events</code>). Add
        gatherings-specific stories under Menu pages → gatherings.
      </p>
      <div className="admin-toolbar" style={{ position: 'static', background: 'transparent' }}>
        <button className="admin-btn primary" type="button" onClick={() => setEvents([emptyEvent(), ...events])}>
          New event
        </button>
      </div>
      {events.length === 0 ? <p className="hint">No events yet. Create one to get started.</p> : null}
      {events.map((ev, i) => (
        <div className="admin-card admin-grid" key={ev.id || i}>
          <div className="admin-page-head">
            <strong>{ev.title || `Event ${i + 1}`}</strong>
            <button
              className="admin-btn danger"
              type="button"
              onClick={() => setEvents(events.filter((_, idx) => idx !== i))}
            >
              Delete
            </button>
          </div>
          <div className="admin-grid two">
            <Field label="Title">
              <input value={ev.title || ''} onChange={(e) => update(i, { title: e.target.value })} />
            </Field>
            <Field label="Date / when">
              <input value={ev.date || ''} onChange={(e) => update(i, { date: e.target.value })} />
            </Field>
          </div>
          <div className="admin-grid two">
            <Field label="Location">
              <input
                value={ev.location || ''}
                onChange={(e) => update(i, { location: e.target.value })}
              />
            </Field>
            <Field label="Details link (optional)">
              <input value={ev.link || ''} onChange={(e) => update(i, { link: e.target.value })} />
            </Field>
          </div>
          <Field label="Image URL">
            <input value={ev.image || ''} onChange={(e) => update(i, { image: e.target.value })} />
          </Field>
          <MediaPicker onPick={(url) => update(i, { image: url })} />
          {ev.image ? <img className="admin-thumb" src={ev.image} alt="" /> : null}
          <Field label="Summary">
            <textarea
              value={ev.summary || ''}
              onChange={(e) => update(i, { summary: e.target.value })}
            />
          </Field>
        </div>
      ))}
    </>
  );
}
