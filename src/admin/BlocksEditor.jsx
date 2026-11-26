import { Field, ListToolbar, uid } from './fields';
import MediaPicker from './MediaPicker';
import SortableList from './SortableList';

const BLOCK_TYPES = [
  { type: 'richtext', label: 'Rich text' },
  { type: 'quote', label: 'Quote' },
  { type: 'gallery', label: 'Gallery' },
  { type: 'video', label: 'YouTube' },
  { type: 'cta', label: 'Call to action' },
  { type: 'stats', label: 'Stats row' },
  { type: 'embed', label: 'Embed / HTML' },
];

const LAYOUT_OPTIONS = [
  { value: 'auto', label: 'Auto (default slot)' },
  { value: 'column', label: 'Reading column' },
  { value: 'wide', label: 'Full width' },
];

function emptyBlock(type) {
  const id = uid('block');
  switch (type) {
    case 'quote':
      return { id, type, text: '', attribution: '', layout: 'auto' };
    case 'gallery':
      return { id, type, items: [{ src: '', caption: '' }], layout: 'auto' };
    case 'video':
      return { id, type, title: '', url: '', layout: 'auto' };
    case 'cta':
      return { id, type, title: '', text: '', label: '', href: '', layout: 'auto' };
    case 'stats':
      return {
        id,
        type,
        layout: 'auto',
        items: [
          { value: '', label: '' },
          { value: '', label: '' },
          { value: '', label: '' },
        ],
      };
    case 'embed':
      return { id, type, html: '', layout: 'auto' };
    default:
      return { id, type: 'richtext', title: '', body: '', layout: 'auto' };
  }
}

function BlockFields({ block, i, update }) {
  return (
    <>
      <Field
        label="Layout slot"
        hint="Maps to existing ContentColumn / full-wrap bands — not freeform pixels."
      >
        <select
          value={block.layout || 'auto'}
          onChange={(e) => update(i, { layout: e.target.value })}
        >
          {LAYOUT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      {block.type === 'richtext' && (
        <>
          <Field label="Title">
            <input
              value={block.title || ''}
              onChange={(e) => update(i, { title: e.target.value })}
            />
          </Field>
          <Field label="Body">
            <textarea
              style={{ minHeight: '8rem' }}
              value={block.body || ''}
              onChange={(e) => update(i, { body: e.target.value })}
            />
          </Field>
        </>
      )}

      {block.type === 'quote' && (
        <>
          <Field label="Quote">
            <textarea
              value={block.text || ''}
              onChange={(e) => update(i, { text: e.target.value })}
            />
          </Field>
          <Field label="Attribution">
            <input
              value={block.attribution || ''}
              onChange={(e) => update(i, { attribution: e.target.value })}
            />
          </Field>
        </>
      )}

      {block.type === 'video' && (
        <>
          <Field label="Title">
            <input
              value={block.title || ''}
              onChange={(e) => update(i, { title: e.target.value })}
            />
          </Field>
          <Field label="YouTube URL">
            <input
              value={block.url || ''}
              onChange={(e) => update(i, { url: e.target.value })}
            />
          </Field>
        </>
      )}

      {block.type === 'cta' && (
        <>
          <Field label="Title">
            <input
              value={block.title || ''}
              onChange={(e) => update(i, { title: e.target.value })}
            />
          </Field>
          <Field label="Text">
            <textarea
              value={block.text || ''}
              onChange={(e) => update(i, { text: e.target.value })}
            />
          </Field>
          <div className="admin-grid two">
            <Field label="Button label">
              <input
                value={block.label || ''}
                onChange={(e) => update(i, { label: e.target.value })}
              />
            </Field>
            <Field label="Button href">
              <input
                value={block.href || ''}
                onChange={(e) => update(i, { href: e.target.value })}
              />
            </Field>
          </div>
        </>
      )}

      {block.type === 'embed' && (
        <Field label="HTML embed" hint="Use trusted embeds only (iframe snippets).">
          <textarea
            style={{ minHeight: '7rem', fontFamily: 'ui-monospace, monospace' }}
            value={block.html || ''}
            onChange={(e) => update(i, { html: e.target.value })}
          />
        </Field>
      )}

      {block.type === 'stats' && (
        <>
          {(block.items || []).map((item, j) => (
            <div className="admin-grid two" key={j}>
              <Field label="Value">
                <input
                  value={item.value || ''}
                  onChange={(e) => {
                    const items = [...(block.items || [])];
                    items[j] = { ...item, value: e.target.value };
                    update(i, { items });
                  }}
                />
              </Field>
              <Field label="Label">
                <input
                  value={item.label || ''}
                  onChange={(e) => {
                    const items = [...(block.items || [])];
                    items[j] = { ...item, label: e.target.value };
                    update(i, { items });
                  }}
                />
              </Field>
            </div>
          ))}
          <ListToolbar
            addLabel="Add stat"
            onAdd={() =>
              update(i, { items: [...(block.items || []), { value: '', label: '' }] })
            }
          />
        </>
      )}

      {block.type === 'gallery' && (
        <>
          {(block.items || []).map((item, j) => (
            <div className="admin-list-item admin-grid" key={j}>
              <Field label="Image URL">
                <input
                  value={item.src || ''}
                  onChange={(e) => {
                    const items = [...(block.items || [])];
                    items[j] = { ...item, src: e.target.value };
                    update(i, { items });
                  }}
                />
              </Field>
              <MediaPicker
                onPick={(url) => {
                  const items = [...(block.items || [])];
                  items[j] = { ...item, src: url };
                  update(i, { items });
                }}
              />
              <Field label="Caption">
                <input
                  value={item.caption || ''}
                  onChange={(e) => {
                    const items = [...(block.items || [])];
                    items[j] = { ...item, caption: e.target.value };
                    update(i, { items });
                  }}
                />
              </Field>
              <button
                className="admin-btn ghost"
                type="button"
                onClick={() =>
                  update(i, {
                    items: (block.items || []).filter((_, idx) => idx !== j),
                  })
                }
              >
                Remove image
              </button>
            </div>
          ))}
          <ListToolbar
            addLabel="Add image"
            onAdd={() =>
              update(i, {
                items: [...(block.items || []), { src: '', caption: '' }],
              })
            }
          />
        </>
      )}
    </>
  );
}

export default function BlocksEditor({ blocks = [], onChange }) {
  function update(i, patch) {
    const next = [...blocks];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  return (
    <div className="admin-blocks">
      <div className="admin-page-head">
        <div>
          <h3 style={{ margin: 0 }}>Page blocks</h3>
          <p className="hint" style={{ margin: '0.25rem 0 0' }}>
            Add sections, drag the handle to reorder, pick a layout slot, then Save. Esc cancels an
            in-progress drag.
          </p>
        </div>
      </div>
      <div className="admin-block-add">
        {BLOCK_TYPES.map((b) => (
          <button
            key={b.type}
            className="admin-btn ghost"
            type="button"
            onClick={() => onChange([...(blocks || []), emptyBlock(b.type)])}
          >
            + {b.label}
          </button>
        ))}
      </div>

      <SortableList
        items={blocks || []}
        onReorder={onChange}
        getKey={(block, i) => block.id || `block-${i}`}
        renderItem={(block, i, { DragHandle, moveUp, moveDown, canMoveUp, canMoveDown, isDragging }) => (
          <div className={`admin-card admin-block${isDragging ? ' is-dragging-card' : ''}`}>
            <div className="admin-page-head admin-sortable__head">
              <div className="admin-sortable__title">
                <DragHandle label={`Drag ${BLOCK_TYPES.find((t) => t.type === block.type)?.label || 'block'}`} />
                <strong>
                  {BLOCK_TYPES.find((t) => t.type === block.type)?.label || block.type}
                </strong>
              </div>
              <div className="admin-inline-actions">
                <button
                  className="admin-btn ghost"
                  type="button"
                  disabled={!canMoveUp}
                  aria-label="Move up"
                  onClick={moveUp}
                >
                  ↑
                </button>
                <button
                  className="admin-btn ghost"
                  type="button"
                  disabled={!canMoveDown}
                  aria-label="Move down"
                  onClick={moveDown}
                >
                  ↓
                </button>
                <button
                  className="admin-btn danger"
                  type="button"
                  onClick={() => onChange(blocks.filter((_, idx) => idx !== i))}
                >
                  Remove
                </button>
              </div>
            </div>
            <BlockFields block={block} i={i} update={update} />
          </div>
        )}
      />
    </div>
  );
}
