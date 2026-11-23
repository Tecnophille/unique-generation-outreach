import { Field, ListToolbar, uid } from './fields';
import MediaPicker from './MediaPicker';

const BLOCK_TYPES = [
  { type: 'richtext', label: 'Rich text' },
  { type: 'quote', label: 'Quote' },
  { type: 'gallery', label: 'Gallery' },
  { type: 'video', label: 'YouTube' },
  { type: 'cta', label: 'Call to action' },
  { type: 'stats', label: 'Stats row' },
  { type: 'embed', label: 'Embed / HTML' },
];

function emptyBlock(type) {
  const id = uid('block');
  switch (type) {
    case 'quote':
      return { id, type, text: '', attribution: '' };
    case 'gallery':
      return { id, type, items: [{ src: '', caption: '' }] };
    case 'video':
      return { id, type, title: '', url: '' };
    case 'cta':
      return { id, type, title: '', text: '', label: '', href: '' };
    case 'stats':
      return {
        id,
        type,
        items: [
          { value: '', label: '' },
          { value: '', label: '' },
          { value: '', label: '' },
        ],
      };
    case 'embed':
      return { id, type, html: '' };
    default:
      return { id, type: 'richtext', title: '', body: '' };
  }
}

export default function BlocksEditor({ blocks = [], onChange }) {
  function update(i, patch) {
    const next = [...blocks];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="admin-blocks">
      <div className="admin-page-head">
        <div>
          <h3 style={{ margin: 0 }}>Page blocks</h3>
          <p className="hint" style={{ margin: '0.25rem 0 0' }}>
            Stack flexible sections under the page story. Reorder freely.
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

      {(blocks || []).map((block, i) => (
        <div className="admin-card admin-block" key={block.id || i}>
          <div className="admin-page-head">
            <strong>
              {BLOCK_TYPES.find((t) => t.type === block.type)?.label || block.type}
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
                onClick={() => onChange(blocks.filter((_, idx) => idx !== i))}
              >
                Remove
              </button>
            </div>
          </div>

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
        </div>
      ))}
    </div>
  );
}
