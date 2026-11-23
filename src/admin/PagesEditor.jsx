import { useMemo, useState } from 'react';
import MediaPicker from './MediaPicker';
import BlocksEditor from './BlocksEditor';
import { Field, ListToolbar } from './fields';

const CORE_PAGES = new Set([
  'about',
  'pillars',
  'gatherings',
  'reflections',
  'leadership',
  'faq',
  'contact',
  'events',
  'videos',
]);

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function pagePath(key) {
  return `/${key}`;
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
      <MediaPicker onPick={(url) => patchPage({ heroImage: url })} label="Upload / pick banner image" />
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
  const pageKeys = useMemo(() => {
    const keys = Object.keys(draft.pages || {});
    const preferred = [
      'about',
      'pillars',
      'gatherings',
      'reflections',
      'leadership',
      'faq',
      'contact',
      'events',
      'videos',
    ];
    const ordered = [
      ...preferred.filter((k) => keys.includes(k)),
      ...keys.filter((k) => !preferred.includes(k)).sort(),
    ];
    return ordered;
  }, [draft.pages]);

  const [active, setActive] = useState(pageKeys[0] || 'about');
  const [newTitle, setNewTitle] = useState('');
  const page = draft.pages?.[active] || {};
  const path = pagePath(active);

  const patchPage = (next) =>
    setDraft((d) => ({
      ...d,
      pages: {
        ...(d.pages || {}),
        [active]: { ...((d.pages || {})[active] || {}), ...next },
      },
    }));

  function createPage() {
    const title = newTitle.trim() || 'New page';
    let key = slugify(title);
    if (!key) key = `page-${Date.now().toString(36)}`;
    if (key === 'admin' || key === 'api') {
      alert('That slug is reserved.');
      return;
    }
    if (draft.pages?.[key]) {
      alert(`Page “${key}” already exists.`);
      return;
    }
    const nextPage = {
      label: title,
      title,
      intro: '',
      heroImage: '',
      storyTitle: '',
      story: '',
      cta: { label: '', href: '' },
      gallery: [],
      events: [],
      videos: [],
      articles: [],
      blocks: [],
      status: 'published',
      seo: { title: '', description: '' },
      custom: true,
    };
    setDraft((d) => {
      const nav = [...(d.nav || [])];
      if (!nav.some((n) => n.href === `/${key}`)) {
        nav.push({ label: title, href: `/${key}` });
      }
      return {
        ...d,
        pages: { ...(d.pages || {}), [key]: nextPage },
        nav,
      };
    });
    setActive(key);
    setNewTitle('');
  }

  function deletePage() {
    if (CORE_PAGES.has(active) && !page.custom) {
      alert('Core pages cannot be deleted. Clear their content instead.');
      return;
    }
    if (!window.confirm(`Delete page /${active}?`)) return;
    setDraft((d) => {
      const pages = { ...(d.pages || {}) };
      delete pages[active];
      return {
        ...d,
        pages,
        nav: (d.nav || []).filter((n) => n.href !== `/${active}`),
      };
    });
    setActive('about');
  }

  function ensureEventsPage() {
    if (draft.pages?.events) {
      setActive('events');
      return;
    }
    setDraft((d) => ({
      ...d,
      pages: {
        ...(d.pages || {}),
        events: {
          label: 'Events',
          title: 'Upcoming & past gatherings',
          intro: 'Dates, places, and stories from Unique Generation Outreach.',
          heroImage: '',
          storyTitle: 'Come be part of it',
          story: 'Browse events managed from the CMS Events studio.',
          cta: { label: 'Contact us', href: '/contact' },
          useSiteEvents: true,
          custom: true,
        },
      },
      nav: (d.nav || []).some((n) => n.href === '/events')
        ? d.nav
        : [...(d.nav || []), { label: 'Events', href: '/events' }],
    }));
    setActive('events');
  }

  function ensureVideosPage() {
    if (draft.pages?.videos) {
      setActive('videos');
      return;
    }
    setDraft((d) => ({
      ...d,
      pages: {
        ...(d.pages || {}),
        videos: {
          label: 'Videos',
          title: 'Watch with us',
          intro: 'Messages, highlights, and stories on YouTube.',
          heroImage: '',
          storyTitle: 'On the channel',
          story: 'Videos managed from the CMS YouTube studio.',
          cta: { label: 'Contact us', href: '/contact' },
          useSiteVideos: true,
          custom: true,
        },
      },
      nav: (d.nav || []).some((n) => n.href === '/videos')
        ? d.nav
        : [...(d.nav || []), { label: 'Videos', href: '/videos' }],
    }));
    setActive('videos');
  }

  return (
    <>
      <h2>Pages & content</h2>
      <p className="hint">
        Edit every public route, create new pages, attach galleries, event write-ups, and YouTube
        embeds. Save when you are done.
      </p>

      <div className="admin-card admin-grid">
        <div className="admin-grid two">
          <Field label="New page title">
            <input
              value={newTitle}
              placeholder="e.g. Youth camp"
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  createPage();
                }
              }}
            />
          </Field>
          <div className="admin-inline-actions">
            <button className="admin-btn primary" type="button" onClick={createPage}>
              Create page
            </button>
            <button className="admin-btn ghost" type="button" onClick={ensureEventsPage}>
              Open Events page
            </button>
            <button className="admin-btn ghost" type="button" onClick={ensureVideosPage}>
              Open Videos page
            </button>
          </div>
        </div>
      </div>

      <div className="admin-page-tabs">
        {pageKeys.map((key) => (
          <button
            key={key}
            type="button"
            className={active === key ? 'is-active' : ''}
            onClick={() => setActive(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="admin-card admin-grid">
        <div className="admin-page-head">
          <div>
            <strong>{active}</strong>
            <div className="hint" style={{ margin: 0 }}>
              Live at{' '}
              <a href={path} target="_blank" rel="noreferrer">
                {path}
              </a>
              {page.custom ? ' · custom page' : ' · core page'}
            </div>
          </div>
          <div className="admin-inline-actions">
            <a className="admin-btn ghost" href={path} target="_blank" rel="noreferrer">
              Preview ↗
            </a>
            {(page.custom || !CORE_PAGES.has(active)) && (
              <button className="admin-btn danger" type="button" onClick={deletePage}>
                Delete page
              </button>
            )}
          </div>
        </div>

        <div className="admin-grid two">
          <Field label="Publish status">
            <select
              value={page.status || 'published'}
              onChange={(e) => patchPage({ status: e.target.value })}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
          <Field label="SEO title override">
            <input
              value={page.seo?.title || ''}
              onChange={(e) =>
                patchPage({ seo: { ...(page.seo || {}), title: e.target.value } })
              }
            />
          </Field>
        </div>
        <Field label="SEO description">
          <textarea
            value={page.seo?.description || ''}
            onChange={(e) =>
              patchPage({ seo: { ...(page.seo || {}), description: e.target.value } })
            }
          />
        </Field>

        <CommonFields page={page} patchPage={patchPage} />

        <BlocksEditor
          blocks={page.blocks || []}
          onChange={(blocks) => patchPage({ blocks })}
        />

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
                <button
                  className="admin-btn ghost"
                  type="button"
                  onClick={() =>
                    patchPage({
                      milestones: (page.milestones || []).filter((_, idx) => idx !== i),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <ListToolbar
              addLabel="Add milestone"
              onAdd={() =>
                patchPage({
                  milestones: [...(page.milestones || []), { year: 'New', text: '' }],
                })
              }
            />
          </>
        )}

        {(active === 'about' || page.custom || active === 'events' || active === 'videos') && (
          <>
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
                <MediaPicker
                  onPick={(url) => {
                    const gallery = [...(page.gallery || [])];
                    gallery[i] = { ...g, src: url };
                    patchPage({ gallery });
                  }}
                />
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
                <button
                  className="admin-btn ghost"
                  type="button"
                  onClick={() =>
                    patchPage({ gallery: (page.gallery || []).filter((_, idx) => idx !== i) })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <ListToolbar
              addLabel="Add gallery image"
              onAdd={() =>
                patchPage({
                  gallery: [...(page.gallery || []), { src: '', caption: '' }],
                })
              }
            />
          </>
        )}

        {active === 'pillars' && (
          <>
            <h3>Pillar deep-dives</h3>
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
                <button
                  className="admin-btn ghost"
                  type="button"
                  onClick={() =>
                    patchPage({ items: (page.items || []).filter((_, idx) => idx !== i) })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <ListToolbar
              addLabel="Add pillar"
              onAdd={() =>
                patchPage({
                  items: [...(page.items || []), { title: '', text: '', detail: '' }],
                })
              }
            />
          </>
        )}

        {(active === 'gatherings' || page.custom) && active !== 'videos' && (
          <>
            <h3>Event stories on this page</h3>
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
                <MediaPicker
                  onPick={(url) => {
                    const events = [...(page.events || [])];
                    events[i] = { ...ev, image: url };
                    patchPage({ events });
                  }}
                />
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
                <button
                  className="admin-btn ghost"
                  type="button"
                  onClick={() =>
                    patchPage({ events: (page.events || []).filter((_, idx) => idx !== i) })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <ListToolbar
              addLabel="Add event story"
              onAdd={() =>
                patchPage({
                  events: [
                    ...(page.events || []),
                    { year: '', name: '', theme: '', image: '', story: '' },
                  ],
                })
              }
            />
          </>
        )}

        {(active === 'reflections' || page.custom) && (
          <>
            <h3>Articles</h3>
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
                <button
                  className="admin-btn ghost"
                  type="button"
                  onClick={() =>
                    patchPage({ articles: (page.articles || []).filter((_, idx) => idx !== i) })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <ListToolbar
              addLabel="Add article"
              onAdd={() =>
                patchPage({
                  articles: [...(page.articles || []), { date: '', title: '', body: '' }],
                })
              }
            />
          </>
        )}

        <h3>YouTube on this page</h3>
        <p className="hint">Optional embeds for this route. Site-wide videos also live under Videos.</p>
        {(page.videos || []).map((v, i) => (
          <div className="admin-list-item admin-grid" key={i}>
            <Field label="Title">
              <input
                value={v.title || ''}
                onChange={(e) => {
                  const videos = [...(page.videos || [])];
                  videos[i] = { ...v, title: e.target.value };
                  patchPage({ videos });
                }}
              />
            </Field>
            <Field label="YouTube URL">
              <input
                value={v.url || ''}
                onChange={(e) => {
                  const videos = [...(page.videos || [])];
                  videos[i] = { ...v, url: e.target.value };
                  patchPage({ videos });
                }}
              />
            </Field>
            <button
              className="admin-btn ghost"
              type="button"
              onClick={() =>
                patchPage({ videos: (page.videos || []).filter((_, idx) => idx !== i) })
              }
            >
              Remove
            </button>
          </div>
        ))}
        <ListToolbar
          addLabel="Add YouTube link"
          onAdd={() =>
            patchPage({
              videos: [...(page.videos || []), { title: '', url: '', description: '' }],
            })
          }
        />

        {active === 'leadership' && (
          <>
            <h3>Focus cards</h3>
            <p className="hint">Team bios are under Team directory. These cards are page-only.</p>
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

        {(active === 'events' || page.useSiteEvents) && (
          <p className="hint">
            This page lists site-wide events from the <strong>Events</strong> studio. Manage items
            there, then Save.
          </p>
        )}
        {(active === 'videos' || page.useSiteVideos) && (
          <p className="hint">
            This page lists site-wide YouTube links from the <strong>YouTube</strong> studio.
          </p>
        )}
      </div>
    </>
  );
}
