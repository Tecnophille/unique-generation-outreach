import { Field } from './fields';
import EmptyState from './EmptyState';

export default function FaqsEditor({ draft, setDraft }) {
  const faqs = draft.faqs || [];

  function add() {
    setDraft((d) => ({
      ...d,
      faqs: [...(d.faqs || []), { q: '', a: '' }],
    }));
  }

  return (
    <>
      <h2>FAQ answers</h2>
      <p className="hint">Shared Q&A used by the FAQ page.</p>
      <button className="admin-btn primary" type="button" onClick={add}>
        Add FAQ
      </button>
      {faqs.length === 0 ? (
        <EmptyState
          icon="list"
          title="No FAQ answers yet"
          body="Add questions visitors ask most — they power the public FAQ page."
          actionLabel="Add FAQ"
          onAction={add}
        />
      ) : null}
      {faqs.map((item, i) => (
        <div className="admin-card admin-grid" key={i}>
          <div className="admin-page-head">
            <strong>FAQ {i + 1}</strong>
            <button
              className="admin-btn danger"
              type="button"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  faqs: d.faqs.filter((_, idx) => idx !== i),
                }))
              }
            >
              Remove
            </button>
          </div>
          <Field label="Question">
            <input
              value={item.q || ''}
              onChange={(e) => {
                const next = [...faqs];
                next[i] = { ...item, q: e.target.value };
                setDraft((d) => ({ ...d, faqs: next }));
              }}
            />
          </Field>
          <Field label="Answer">
            <textarea
              value={item.a || ''}
              onChange={(e) => {
                const next = [...faqs];
                next[i] = { ...item, a: e.target.value };
                setDraft((d) => ({ ...d, faqs: next }));
              }}
            />
          </Field>
        </div>
      ))}
    </>
  );
}