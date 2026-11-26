import { useState } from 'react';
import { Field, uid } from './fields';
import MediaPicker from './MediaPicker';
import EmptyState from './EmptyState';
import SortableList from './SortableList';

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

function EventCard({
  ev,
  i,
  update,
  setEvents,
  events,
  DragHandle,
  moveUp,
  moveDown,
  canMoveUp,
  canMoveDown,
  isDragging,
  showDrag,
}) {
  return (
    <div className={`admin-card admin-grid${isDragging ? ' is-dragging-card' : ''}`}>
      <div className="admin-page-head admin-sortable__head">
        <div className="admin-sortable__title">
          {showDrag && DragHandle ? <DragHandle label={`Drag ${ev.title || `event ${i + 1}`}`} /> : null}
          <strong>{ev.title || `Event ${i + 1}`}</strong>
        </div>
        <div className="admin-inline-actions">
          {showDrag ? (
            <>
              <button className="admin-btn ghost" type="button" disabled={!canMoveUp} onClick={moveUp}>
                ↑
              </button>
              <button className="admin-btn ghost" type="button" disabled={!canMoveDown} onClick={moveDown}>
                ↓
              </button>
            </>
          ) : null}
          <button
            className="admin-btn ghost"
            type="button"
            onClick={() =>
              setEvents([
                {
                  ...structuredClone(ev),
                  id: uid('ev'),
                  title: `${ev.title || 'Event'} (copy)`,
                  status: 'draft',
                  featured: false,
                },
                ...events,
              ])
            }
          >
            Duplicate
          </button>
          <button
            className="admin-btn danger"
            type="button"
            onClick={() => setEvents(events.filter((_, idx) => idx !== i))}
          >
            Delete
          </button>
        </div>
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
  );
}

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
        Large-scale event calendar content. Drag to reorder when viewing All; featured items can
        surface on the homepage.
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

      {events.length === 0 ? (
        <EmptyState
          icon="list"
          title="No events yet"
          body="Create gatherings, outreaches, and featured dates. Featured items can surface on the homepage."
          actionLabel="New event"
          onAction={() => setEvents([emptyEvent(), ...events])}
        />
      ) : null}
      {events.length > 0 && visible.length === 0 ? (
        <EmptyState
          icon="search"
          title={`No ${filter} events`}
          body="Try another filter, or switch back to All to see every event in the studio."
          actionLabel="Show all"
          onAction={() => setFilter('all')}
        />
      ) : null}

      {filter === 'all' ? (
        <SortableList
          items={events}
          onReorder={setEvents}
          getKey={(ev, i) => ev.id || `ev-${i}`}
          renderItem={(ev, i, controls) => (
            <EventCard
              ev={ev}
              i={i}
              update={update}
              setEvents={setEvents}
              events={events}
              showDrag
              {...controls}
            />
          )}
        />
      ) : (
        visible.map(({ ev, i }) => (
          <EventCard
            key={ev.id || i}
            ev={ev}
            i={i}
            update={update}
            setEvents={setEvents}
            events={events}
            showDrag={false}
          />
        ))
      )}
    </>
  );
}
