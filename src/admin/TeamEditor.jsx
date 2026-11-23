import { Field } from './fields';

export default function TeamEditor({ draft, setDraft }) {
  const team = draft.leadership || [];

  return (
    <>
      <h2>Team directory</h2>
      <p className="hint">Leaders and helpers shown on the Leadership page.</p>
      <button
        className="admin-btn primary"
        type="button"
        onClick={() =>
          setDraft((d) => ({
            ...d,
            leadership: [
              ...(d.leadership || []),
              { name: '', role: '', titles: '', location: '', bio: '' },
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
          <div className="admin-grid two">
            <Field label="Name">
              <input
                value={person.name || ''}
                onChange={(e) => {
                  const leadership = [...team];
                  leadership[i] = { ...person, name: e.target.value };
                  setDraft((d) => ({ ...d, leadership }));
                }}
              />
            </Field>
            <Field label="Role">
              <input
                value={person.role || ''}
                onChange={(e) => {
                  const leadership = [...team];
                  leadership[i] = { ...person, role: e.target.value };
                  setDraft((d) => ({ ...d, leadership }));
                }}
              />
            </Field>
          </div>
          <Field label="Titles">
            <input
              value={person.titles || ''}
              onChange={(e) => {
                const leadership = [...team];
                leadership[i] = { ...person, titles: e.target.value };
                setDraft((d) => ({ ...d, leadership }));
              }}
            />
          </Field>
          <Field label="Location">
            <input
              value={person.location || ''}
              onChange={(e) => {
                const leadership = [...team];
                leadership[i] = { ...person, location: e.target.value };
                setDraft((d) => ({ ...d, leadership }));
              }}
            />
          </Field>
          <Field label="Bio">
            <textarea
              value={person.bio || ''}
              onChange={(e) => {
                const leadership = [...team];
                leadership[i] = { ...person, bio: e.target.value };
                setDraft((d) => ({ ...d, leadership }));
              }}
            />
          </Field>
        </div>
      ))}
    </>
  );
}
