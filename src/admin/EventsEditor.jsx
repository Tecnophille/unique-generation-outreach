import { useState } from 'react';
import { Field, uid } from './fields';
import MediaPicker from './MediaPicker';

const emptyEvent = () => ({
  id: uid('ev'),
  title: '',
  date: '',
  endDate: '',
  location: '',
  category: 'Gathering',
  image: '',
  summary: '',
  link: '',
  featured: false,
  status: 'published',
});

export default function EventsEditor({ draft, setDraft }) {
  const events = draft.events || [];
  const [filter, setFilter] = useState('all');

  function setEvents(next) {
    setDraft((d) => ({ ...d, events: next }));
  }

  function update(i, patch) {
    const next = [...events];
    next[i] = { ...next[i], ...patch };
    setEvents(next);
  }

  const visible = events
    .map((ev, i) => ({ ev, i }))
    .filter(({ ev }) => {
      if (filter === 'all') return true;
      if (filter === 'featured') return ev.featured;
      return (ev.status || 'published') === filter;
    });

  return (
    <>
      <h2>Events studio</h2>
      <p className="hint">
        Large-scale event calendar content. Featured items can surface on the homepage; publish
        status controls the Events page.
      </p>
      <div className="admin-toolbar" style={{ position: 'static', background: 'transparent' }}>
        <button
          className="admin-btn primary"
          type="button"
          onClick={() => setEvents([emptyEvent(), ...events])}
        >
          New event
        </button>
        <div className="admin-page-tabs" style={{ margin: 0 }}>
          {['all', 'published', 'draft', 'featured'].map((f) => (
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
        <button
          className="admin-btn ghost"
          type="button"
          onClick={() => {
            if (draft.pages?.events) return;
            setDraft((d) => ({
              ...d,
              pages: {
                ...(d.pages || {}),
                events: {
                  label: 'Events',
                  title: 'Upcoming & past gatherings',
                  intro: 'Dates, places, and stories from Unique Generation Outreach.',
                  useSiteEvents: true,
                  custom: true,
                  status: 'published',
                },
              },
              nav: (d.nav || []).some((n) => n.href === '/events')
                ? d.nav
                : [...(d.nav || []), { label: 'Events', href: '/events' }],
            }));
          }}
        >
          Ensure /events page
        </button>
      </div>

      {visible.length === 0 ? <p className="hint">No events in this filter.</p> : null}
      {visible.map(({ ev, i }) => (
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
            <Field label="Category">
              <input
                value={ev.category || ''}
                onChange={(e) => update(i, { category: e.target.value })}
              />
            </Field>
          </div>
          <div className="admin-grid two">
            <Field label="Start / date">
              <input value={ev.date || ''} onChange={(e) => update(i, { date: e.target.value })} />
            </Field>
            <Field label="End date">
              <input
                value={ev.endDate || ''}
                onChange={(e) => update(i, { endDate: e.target.value })}
              />
            </Field>
          </div>
          <div className="admin-grid two">
            <Field label="Location">
              <input
                value={ev.location || ''}
                onChange={(e) => update(i, { location: e.target.value })}
              />
            </Field>
            <Field label="Details link">
              <input value={ev.link || ''} onChange={(e) => update(i, { link: e.target.value })} />
            </Field>
          </div>
          <div className="admin-grid two">
            <Field label="Status">
              <select
                value={ev.status || 'published'}
                onChange={(e) => update(i, { status: e.target.value })}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
            <label className="admin-check" style={{ alignSelf: 'end' }}>
              <input
                type="checkbox"
                checked={Boolean(ev.featured)}
                onChange={(e) => update(i, { featured: e.target.checked })}
              />
              Featured
            </label>
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
