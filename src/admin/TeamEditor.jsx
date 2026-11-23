import { Field } from './fields';
import MediaPicker from './MediaPicker';

export default function TeamEditor({ draft, setDraft }) {
  const team = draft.leadership || [];

  function update(i, patch) {
    const leadership = [...team];
    leadership[i] = { ...leadership[i], ...patch };
    setDraft((d) => ({ ...d, leadership }));
  }

  return (
    <>
      <h2>Team directory</h2>
      <p className="hint">
        Leaders and helpers shown on the Leadership page. Upload a photo for each person (or paste an
        image URL).
      </p>
      <button
        className="admin-btn primary"
        type="button"
        onClick={() =>
          setDraft((d) => ({
            ...d,
            leadership: [
              ...(d.leadership || []),
              { name: '', role: '', titles: '', location: '', bio: '', photo: '' },
            ],
          }))
        }
      >
        Add person
      </button>
      {team.map((person, i) => (
        <div className="admin-card admin-grid" key={i}>
          <div className="admin-page-head">
            <strong>{person.name || `Person ${i + 1}`}</strong>
            <button
              className="admin-btn danger"
              type="button"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  leadership: d.leadership.filter((_, idx) => idx !== i),
                }))
              }
            >
              Remove
            </button>
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
                  placeholder="https://… or upload below"
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
