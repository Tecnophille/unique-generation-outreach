import { Field } from './fields';
import MediaPicker from './MediaPicker';
import EmptyState from './EmptyState';

export default function TeamEditor({ draft, setDraft }) {
  const team = draft.leadership || [];

  function setTeam(next) {
    setDraft((d) => ({ ...d, leadership: next }));
  }

  function add() {
    setTeam([
      ...team,
      { name: '', role: '', titles: '', location: '', bio: '', photo: '' },
    ]);
  }

  function update(i, patch) {
    const leadership = [...team];
    leadership[i] = { ...leadership[i], ...patch };
    setTeam(leadership);
  }

  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= team.length) return;
    const next = [...team];
    [next[i], next[j]] = [next[j], next[i]];
    setTeam(next);
  }

  return (
    <>
      <h2>Team directory</h2>
      <p className="hint">
        First person is featured as Convener. Upload photos, reorder with ↑ ↓, then Save.
      </p>
      <button className="admin-btn primary" type="button" onClick={add}>
        Add person
      </button>
      {team.length === 0 ? (
        <EmptyState
          icon="media"
          title="Team directory is empty"
          body="Add leaders and volunteers. The first person is featured as Convener on the leadership page."
          actionLabel="Add person"
          onAction={add}
        />
      ) : null}
      {team.map((person, i) => (
        <div className="admin-card admin-grid" key={i}>
          <div className="admin-page-head">
            <strong>
              {i === 0 ? 'Featured · ' : ''}
              {person.name || `Person ${i + 1}`}
            </strong>
            <div className="admin-inline-actions">
              <button className="admin-btn ghost" type="button" onClick={() => move(i, -1)}>
                ↑
              </button>
              <button className="admin-btn ghost" type="button" onClick={() => move(i, 1)}>
                ↓
              </button>
              <button
                className="admin-btn danger"
                type="button"
                onClick={() => setTeam(team.filter((_, idx) => idx !== i))}
              >
                Remove
              </button>
            </div>
          </div>

          <div className="admin-team-photo">
            {person.photo ? (
              <img className="admin-team-photo__preview" src={person.photo} alt="" />
            ) : (
              <div className="admin-team-photo__placeholder">No photo</div>
            )}
            <div className="admin-grid">
              <Field label="Photo URL">
                <input
                  value={person.photo || ''}
                  onChange={(e) => update(i, { photo: e.target.value })}
                  placeholder="Upload below or paste URL"
                />
              </Field>
              <MediaPicker
                label="Upload / pick team photo"
                onPick={(url) => update(i, { photo: url })}
              />
              {person.photo ? (
                <button
                  className="admin-btn ghost"
                  type="button"
                  onClick={() => update(i, { photo: '' })}
                >
                  Remove photo
                </button>
              ) : null}
            </div>
          </div>

          <div className="admin-grid two">
            <Field label="Name">
              <input
                value={person.name || ''}
                onChange={(e) => update(i, { name: e.target.value })}
              />
            </Field>
            <Field label="Role">
              <input
                value={person.role || ''}
                onChange={(e) => update(i, { role: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Titles">
            <input
              value={person.titles || ''}
              onChange={(e) => update(i, { titles: e.target.value })}
            />
          </Field>
          <Field label="Location">
            <input
              value={person.location || ''}
              onChange={(e) => update(i, { location: e.target.value })}
            />
          </Field>
          <Field label="Bio">
            <textarea
              value={person.bio || ''}
              onChange={(e) => update(i, { bio: e.target.value })}
            />
          </Field>
        </div>
      ))}
    </>
  );
}
