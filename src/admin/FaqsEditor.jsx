import { Field } from './fields';
import EmptyState from './EmptyState';
import SortableList from './SortableList';

export default function FaqsEditor({ draft, setDraft }) {
  const faqs = draft.faqs || [];

  function setFaqs(next) {
    setDraft((d) => ({ ...d, faqs: next }));
  }

  function add() {
    setFaqs([...faqs, { q: '', a: '' }]);
  }

  return (
    <>
      <h2>FAQ answers</h2>
      <p className="hint">Shared Q&A used by the FAQ page. Drag to reorder, then Save.</p>
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
      <SortableList
        items={faqs}
        onReorder={setFaqs}
        getKey={(item, i) => item.q ? `${item.q.slice(0, 24)}-${i}` : `faq-${i}`}
        renderItem={(item, i, { DragHandle, moveUp, moveDown, canMoveUp, canMoveDown, isDragging }) => (
          <div className={`admin-card admin-grid${isDragging ? ' is-dragging-card' : ''}`}>
            <div className="admin-page-head admin-sortable__head">
              <div className="admin-sortable__title">
                <DragHandle label={`Drag FAQ ${i + 1}`} />
                <strong>FAQ {i + 1}</strong>
              </div>
              <div className="admin-inline-actions">
                <button className="admin-btn ghost" type="button" disabled={!canMoveUp} onClick={moveUp}>
                  ↑
                </button>
                <button className="admin-btn ghost" type="button" disabled={!canMoveDown} onClick={moveDown}>
                  ↓
                </button>
                <button
                  className="admin-btn danger"
                  type="button"
                  onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                >
                  Remove
                </button>
              </div>
            </div>
            <Field label="Question">
              <input
                value={item.q || ''}
                onChange={(e) => {
                  const next = [...faqs];
                  next[i] = { ...item, q: e.target.value };
                  setFaqs(next);
                }}
              />
            </Field>
            <Field label="Answer">
              <textarea
                value={item.a || ''}
                onChange={(e) => {
                  const next = [...faqs];
                  next[i] = { ...item, a: e.target.value };
                  setFaqs(next);
                }}
              />
            </Field>
          </div>
        )}
      />
    </>
  );
}
