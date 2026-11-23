import { Field, uid } from './fields';
import MediaPicker from './MediaPicker';

export default function PartnersEditor({ draft, setDraft }) {
  const items = draft.partners || [];

  function setItems(next) {
    setDraft((d) => ({ ...d, partners: next }));
  }

  return (
    <>
      <h2>Partners & sponsors</h2>
      <p className="hint">Logos and links for organizations walking with UGO.</p>
      <button
        className="admin-btn primary"
        type="button"
        onClick={() =>
          setItems([{ id: uid('ptr'), name: '', url: '', logo: '', blurb: '' }, ...items])
        }
      >
        Add partner
      </button>
      {items.map((item, i) => (
        <div className="admin-card admin-grid" key={item.id || i}>
          <div className="admin-page-head">
            <strong>{item.name || `Partner ${i + 1}`}</strong>
            <button
              className="admin-btn danger"
              type="button"
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            >
              Delete
            </button>
          </div>
          <div className="admin-grid two">
            <Field label="Name">
              <input
                value={item.name || ''}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, name: e.target.value };
                  setItems(next);
                }}
              />
            </Field>
            <Field label="Website URL">
              <input
                value={item.url || ''}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...item, url: e.target.value };
                  setItems(next);
                }}
              />
            </Field>
          </div>
          <Field label="Logo URL">
            <input
              value={item.logo || ''}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, logo: e.target.value };
                setItems(next);
              }}
            />
          </Field>
          <MediaPicker
            onPick={(url) => {
              const next = [...items];
              next[i] = { ...item, logo: url };
              setItems(next);
            }}
          />
          {item.logo ? <img className="admin-thumb" src={item.logo} alt="" /> : null}
          <Field label="Blurb">
            <textarea
              value={item.blurb || ''}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, blurb: e.target.value };
                setItems(next);
              }}
            />
          </Field>
        </div>
      ))}
    </>
  );
}