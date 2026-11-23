import { useState } from 'react';

const PAGE_KEYS = [
  { key: 'about', path: '/about' },
  { key: 'pillars', path: '/pillars' },
  { key: 'gatherings', path: '/gatherings' },
  { key: 'reflections', path: '/reflections' },
  { key: 'leadership', path: '/leadership' },
  { key: 'faq', path: '/faq' },
  { key: 'contact', path: '/contact' },
];

function Field({ label, children }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function CommonFields({ page, patchPage }) {
  return (
    <>
      <div className="admin-grid two">
        <Field label="Nav/breadcrumb label">
          <input value={page.label || ''} onChange={(e) => patchPage({ label: e.target.value })} />
        </Field>
        <Field label="Banner title">
          <input value={page.title || ''} onChange={(e) => patchPage({ title: e.target.value })} />
        </Field>
      </div>
      <Field label="Banner intro">
        <textarea value={page.intro || ''} onChange={(e) => patchPage({ intro: e.target.value })} />
      </Field>
      <Field label="Banner image URL">
        <input
          value={page.heroImage || ''}
          onChange={(e) => patchPage({ heroImage: e.target.value })}
        />
      </Field>
      {page.heroImage ? <img className="admin-thumb" src={page.heroImage} alt="" /> : null}
      <Field label="Story title">
        <input
          value={page.storyTitle || ''}
          onChange={(e) => patchPage({ storyTitle: e.target.value })}
        />
      </Field>
      <Field label="Story body (blank line = new paragraph)">
        <textarea
          style={{ minHeight: '9rem' }}
          value={page.story || ''}
          onChange={(e) => patchPage({ story: e.target.value })}
        />
      </Field>
      <div className="admin-grid two">
        <Field label="CTA label">
          <input
            value={page.cta?.label || ''}
            onChange={(e) => patchPage({ cta: { ...(page.cta || {}), label: e.target.value } })}
          />
        </Field>
        <Field label="CTA href">
          <input
            value={page.cta?.href || ''}
            onChange={(e) => patchPage({ cta: { ...(page.cta || {}), href: e.target.value } })}
          />
        </Field>
      </div>
    </>
  );
}

export default function PagesEditor({ draft, setDraft }) {
  const [active, setActive] = useState('about');
  const meta = PAGE_KEYS.find((p) => p.key === active) || PAGE_KEYS[0];
  const page = draft.pages?.[active] || {};

  const patchPage = (next) =>
    setDraft((d) => ({
      ...d,
      pages: {
        ...(d.pages || {}),
        [active]: { ...page, ...next },
      },
    }));

  return (
    <>
      <h2>Menu pages</h2>
      <p className="hint">
        Each route has its own content — not a copy of the homepage. Pick a page tab, edit, then
        Save.
      </p>
      <div className="admin-page-tabs">
        {PAGE_KEYS.map((p) => (
          <button
            key={p.key}
            type="button"
            className={active === p.key ? 'is-active' : ''}
            onClick={() => setActive(p.key)}
          >
            {p.key}
          </button>
        ))}
      </div>

      <div className="admin-card admin-grid">
        <div className="admin-page-head">
          <div>
            <strong>{active}</strong>
            <div className="hint" style={{ margin: 0 }}>
              Live at{' '}
              <a href={meta.path} target="_blank" rel="noreferrer">
                {meta.path}
              </a>
            </div>
          </div>
          <a className="admin-btn ghost" href={meta.path} target="_blank" rel="noreferrer">
            Preview page ↗
          </a>
        </div>

        <CommonFields page={page} patchPage={patchPage} />

        {active === 'about' && (
          <>
            <h3>Quote</h3>
            <Field label="Quote text">
              <textarea
                value={page.quote?.text || ''}
                onChange={(e) =>
                  patchPage({ quote: { ...(page.quote || {}), text: e.target.value } })
                }
              />
            </Field>
            <Field label="Attribution">
              <input
                value={page.quote?.attribution || ''}
                onChange={(e) =>
                  patchPage({ quote: { ...(page.quote || {}), attribution: e.target.value } })
                }
              />
            </Field>
            <h3>Milestones</h3>
            {(page.milestones || []).map((m, i) => (
              <div className="admin-list-item admin-grid two" key={i}>
                <Field label="Year / label">
                  <input
                    value={m.year || ''}
                    onChange={(e) => {
                      const milestones = [...(page.milestones || [])];
                      milestones[i] = { ...m, year: e.target.value };
                      patchPage({ milestones });
                    }}
                  />
                </Field>
                <Field label="Text">
                  <input
                    value={m.text || ''}
                    onChange={(e) => {
                      const milestones = [...(page.milestones || [])];
                      milestones[i] = { ...m, text: e.target.value };
                      patchPage({ milestones });
                    }}
                  />
                </Field>
              </div>
            ))}
            <button
              className="admin-btn ghost"
              type="button"
              onClick={() =>
                patchPage({
                  milestones: [...(page.milestones || []), { year: 'New', text: '' }],
                })
              }
            >
              Add milestone
            </button>
            <h3>Gallery</h3>
            {(page.gallery || []).map((g, i) => (
              <div className="admin-list-item admin-grid" key={i}>
                <Field label="Image URL">
                  <input
                    value={g.src || ''}
                    onChange={(e) => {
                      const gallery = [...(page.gallery || [])];
                      gallery[i] = { ...g, src: e.target.value };
                      patchPage({ gallery });
                    }}
                  />
                </Field>
                <Field label="Caption">
                  <input
                    value={g.caption || ''}
                    onChange={(e) => {
                      const gallery = [...(page.gallery || [])];
                      gallery[i] = { ...g, caption: e.target.value };
                      patchPage({ gallery });
                    }}
                  />
                </Field>
              </div>
            ))}
            <button
              className="admin-btn ghost"
              type="button"
              onClick={() =>
                patchPage({
                  gallery: [...(page.gallery || []), { src: '', caption: '' }],
                })
              }
            >
              Add gallery image
            </button>
          </>
        )}

        {active === 'pillars' && (
          <>
            <h3>Pillar deep-dives (unique to this page)</h3>
            {(page.items || []).map((item, i) => (
              <div className="admin-list-item admin-grid" key={i}>
                <Field label="Title">
                  <input
                    value={item.title || ''}
                    onChange={(e) => {
                      const items = [...(page.items || [])];
                      items[i] = { ...item, title: e.target.value };
                      patchPage({ items });
                    }}
                  />
                </Field>
                <Field label="Short line">
                  <input
                    value={item.text || ''}
                    onChange={(e) => {
                      const items = [...(page.items || [])];
                      items[i] = { ...item, text: e.target.value };
                      patchPage({ items });
                    }}
                  />
                </Field>
                <Field label="Detail">
                  <textarea
                    value={item.detail || ''}
                    onChange={(e) => {
                      const items = [...(page.items || [])];
                      items[i] = { ...item, detail: e.target.value };
                      patchPage({ items });
                    }}
                  />
                </Field>
              </div>
            ))}
          </>
        )}

        {active === 'gatherings' && (
          <>
            <h3>GHP event stories (unique to this page)</h3>
            {(page.events || []).map((ev, i) => (
              <div className="admin-list-item admin-grid" key={i}>
                <div className="admin-grid two">
                  <Field label="Year">
                    <input
                      value={ev.year || ''}
                      onChange={(e) => {
                        const events = [...(page.events || [])];
                        events[i] = { ...ev, year: e.target.value };
                        patchPage({ events });
                      }}
                    />
                  </Field>
                  <Field label="Name">
                    <input
                      value={ev.name || ''}
                      onChange={(e) => {
                        const events = [...(page.events || [])];
                        events[i] = { ...ev, name: e.target.value };
                        patchPage({ events });
                      }}
                    />
                  </Field>
                </div>
                <Field label="Theme">
                  <input
                    value={ev.theme || ''}
                    onChange={(e) => {
                      const events = [...(page.events || [])];
                      events[i] = { ...ev, theme: e.target.value };
                      patchPage({ events });
                    }}
                  />
                </Field>
                <Field label="Image URL">
                  <input
                    value={ev.image || ''}
                    onChange={(e) => {
                      const events = [...(page.events || [])];
                      events[i] = { ...ev, image: e.target.value };
                      patchPage({ events });
                    }}
                  />
                </Field>
                <Field label="Story">
                  <textarea
                    value={ev.story || ''}
                    onChange={(e) => {
                      const events = [...(page.events || [])];
                      events[i] = { ...ev, story: e.target.value };
                      patchPage({ events });
                    }}
                  />
                </Field>
              </div>
            ))}
            <button
              className="admin-btn ghost"
              type="button"
              onClick={() =>
                patchPage({
                  events: [
                    ...(page.events || []),
                    { year: '', name: '', theme: '', image: '', story: '' },
                  ],
                })
              }
            >
              Add event story
            </button>
          </>
        )}

        {active === 'reflections' && (
          <>
            <h3>Full articles (unique to this page)</h3>
            {(page.articles || []).map((a, i) => (
              <div className="admin-list-item admin-grid" key={i}>
                <Field label="Date / label">
                  <input
                    value={a.date || ''}
                    onChange={(e) => {
                      const articles = [...(page.articles || [])];
                      articles[i] = { ...a, date: e.target.value };
                      patchPage({ articles });
                    }}
                  />
                </Field>
                <Field label="Title">
                  <input
                    value={a.title || ''}
                    onChange={(e) => {
                      const articles = [...(page.articles || [])];
                      articles[i] = { ...a, title: e.target.value };
                      patchPage({ articles });
                    }}
                  />
                </Field>
                <Field label="Article body">
                  <textarea
                    style={{ minHeight: '8rem' }}
                    value={a.body || ''}
                    onChange={(e) => {
                      const articles = [...(page.articles || [])];
                      articles[i] = { ...a, body: e.target.value };
                      patchPage({ articles });
                    }}
                  />
                </Field>
              </div>
            ))}
            <button
              className="admin-btn ghost"
              type="button"
              onClick={() =>
                patchPage({
                  articles: [...(page.articles || []), { date: '', title: '', body: '' }],
                })
              }
            >
              Add article
            </button>
          </>
        )}

        {active === 'leadership' && (
          <>
            <h3>Focus cards</h3>
            <p className="hint">Team bios are edited under “Team directory”. These cards are page-only.</p>
            {(page.focus || []).map((f, i) => (
              <div className="admin-list-item admin-grid" key={i}>
                <Field label="Title">
                  <input
                    value={f.title || ''}
                    onChange={(e) => {
                      const focus = [...(page.focus || [])];
                      focus[i] = { ...f, title: e.target.value };
                      patchPage({ focus });
                    }}
                  />
                </Field>
                <Field label="Text">
                  <textarea
                    value={f.text || ''}
                    onChange={(e) => {
                      const focus = [...(page.focus || [])];
                      focus[i] = { ...f, text: e.target.value };
                      patchPage({ focus });
                    }}
                  />
                </Field>
              </div>
            ))}
          </>
        )}

        {active === 'contact' && (
          <>
            <h3>Contact channels</h3>
            {(page.channels || []).map((c, i) => (
              <div className="admin-list-item admin-grid" key={i}>
                <Field label="Title">
                  <input
                    value={c.title || ''}
                    onChange={(e) => {
                      const channels = [...(page.channels || [])];
                      channels[i] = { ...c, title: e.target.value };
                      patchPage({ channels });
                    }}
                  />
                </Field>
                <Field label="Text">
                  <textarea
                    value={c.text || ''}
                    onChange={(e) => {
                      const channels = [...(page.channels || [])];
                      channels[i] = { ...c, text: e.target.value };
                      patchPage({ channels });
                    }}
                  />
                </Field>
              </div>
            ))}
          </>
        )}

        {active === 'faq' && (
          <p className="hint">
            FAQ answers are edited under <strong>FAQ answers</strong>. This page holds the unique
            intro/story/CTA only.
          </p>
        )}
      </div>
    </>
  );
}
