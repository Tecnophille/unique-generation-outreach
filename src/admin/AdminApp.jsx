import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';
import PagesEditor from './PagesEditor';
import RevisionsPanel from './RevisionsPanel';
import MessagesPanel from './MessagesPanel';
import './admin.css';

const SECTIONS = [
  { id: 'overview', label: 'Dashboard', group: 'Start' },
  { id: 'pages', label: 'Menu pages', group: 'Pages' },
  { id: 'hero', label: 'Home · Hero', group: 'Homepage' },
  { id: 'about', label: 'Home · About teaser', group: 'Homepage' },
  { id: 'pillars', label: 'Home · Pillars teaser', group: 'Homepage' },
  { id: 'gatherings', label: 'Home · Gatherings teaser', group: 'Homepage' },
  { id: 'reflections', label: 'Home · Reflections teaser', group: 'Homepage' },
  { id: 'leadership', label: 'Team directory', group: 'Shared data' },
  { id: 'faqs', label: 'FAQ answers', group: 'Shared data' },
  { id: 'contact', label: 'Contact panel', group: 'Shared data' },
  { id: 'inbox', label: 'Inbox', group: 'Shared data' },
  { id: 'nav', label: 'Navigation', group: 'Site' },
  { id: 'media', label: 'Media library', group: 'Site' },
];

const PAGE_KEYS = [
  { key: 'about', path: '/about' },
  { key: 'pillars', path: '/pillars' },
  { key: 'gatherings', path: '/gatherings' },
  { key: 'reflections', path: '/reflections' },
  { key: 'contact', path: '/contact' },
  { key: 'leadership', path: '/leadership' },
  { key: 'faq', path: '/faq' },
];

function Field({ label, htmlFor, children, hint }) {
  return (
    <div className="admin-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint ? <span className="admin-field__hint">{hint}</span> : null}
    </div>
  );
}

function Login({ onSuccess }) {
  const [email, setEmail] = useState('admin@ugo.local');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        let message = 'Invalid email or password';
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          /* ignore */
        }
        throw new Error(message);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__atmosphere" aria-hidden="true" />
      <main className="admin-login__panel">
        <header className="admin-login__brand">
          <img
            className="admin-login__logo"
            src="/logo.png"
            alt="Unique Generation Outreach"
            width={88}
            height={88}
          />
          <p className="admin-login__org">Unique Generation Outreach</p>
          <h1 id="admin-login-title">Content studio</h1>
          <p className="admin-login__lede">
            Sign in to edit pages, media, and messages for the UGO site.
          </p>
        </header>

        <form
          className="admin-login__form"
          onSubmit={submit}
          aria-labelledby="admin-login-title"
          noValidate
        >
          <div
            className={`admin-login__alert${error ? ' is-visible' : ''}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            {error || '\u00a0'}
          </div>

          <Field label="Email" htmlFor="admin-email">
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              required
              aria-invalid={Boolean(error) || undefined}
              aria-describedby={error ? 'admin-login-error' : undefined}
            />
          </Field>

          <Field label="Password" htmlFor="admin-password">
            <div className="admin-login__password">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                required
                aria-invalid={Boolean(error) || undefined}
                aria-describedby={error ? 'admin-login-error' : undefined}
              />
              <button
                type="button"
                className="admin-login__reveal"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>

          {error ? (
            <p id="admin-login-error" className="visually-hidden">
              {error}
            </p>
          ) : null}

          <button className="admin-btn primary admin-login__submit" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="admin-login__foot">
          <Link to="/">← Back to the public site</Link>
        </p>
      </main>
    </div>
  );
}

export default function AdminApp() {
  const { content, loading, refresh, saveContent } = useContent();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [section, setSection] = useState('overview');
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    fetch('/api/session', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authenticated)))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (content) setDraft(structuredClone(content));
  }, [content]);

  async function loadUploads() {
    const res = await fetch('/api/uploads', { credentials: 'include' });
    if (res.ok) setUploads(await res.json());
  }

  useEffect(() => {
    if (authed && section === 'media') loadUploads();
  }, [authed, section]);

  const dirty = useMemo(() => {
    if (!draft || !content) return false;
    return JSON.stringify(draft) !== JSON.stringify(content);
  }, [draft, content]);

  async function save() {
    setStatus('');
    setError('');
    try {
      await saveContent(draft);
      setStatus('Saved successfully');
    } catch (err) {
      setError(err.message || 'Save failed');
    }
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setAuthed(false);
  }

  async function uploadFile(file) {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      credentials: 'include',
      body,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    await loadUploads();
    return data.url;
  }

  if (checking || loading) return <div className="boot-screen">Loading CMS…</div>;
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  if (!draft) return <div className="boot-screen">No content loaded.</div>;

  function updateHero(key, value) {
    setDraft((d) => ({ ...d, hero: { ...d.hero, [key]: value } }));
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-side__brand">
          <img src="/logo.png" alt="" />
          <div>
            <strong>UGO CMS</strong>
            <span>Content control centre</span>
          </div>
        </div>
        {SECTIONS.map((s, idx) => (
          <div key={s.id}>
            {idx === 0 || SECTIONS[idx - 1].group !== s.group ? (
              <div className="admin-side__group">{s.group}</div>
            ) : null}
            <button
              type="button"
              className={section === s.id ? 'is-active' : ''}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          </div>
        ))}
        <div className="admin-side__foot">
          <Link to="/" target="_blank" rel="noreferrer">
            Open website ↗
          </Link>
          <button type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-toolbar">
          <button className="admin-btn primary" type="button" onClick={save} disabled={!dirty}>
            Save changes
          </button>
          <button
            className="admin-btn ghost"
            type="button"
            onClick={() => {
              setDraft(structuredClone(content));
              setStatus('Reverted unsaved edits');
              setError('');
            }}
            disabled={!dirty}
          >
            Discard
          </button>
          <button className="admin-btn ghost" type="button" onClick={refresh}>
            Reload
          </button>
          {dirty ? <span className="admin-status">Unsaved changes</span> : null}
          {status ? <span className="admin-status ok">{status}</span> : null}
          {error ? <span className="admin-status err">{error}</span> : null}
        </div>

        {section === 'overview' && (
          <>
            <h2>Dashboard</h2>
            <p className="hint">
              Homepage teasers and menu pages are separate. Edit <strong>Menu pages</strong> for
              unique page content — not the same blocks as the homepage. Last saved:{' '}
              {draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '—'}
            </p>
            <div className="admin-stats">
              <div className="admin-stat">
                <strong>{PAGE_KEYS.length}</strong>
                <span>Menu pages</span>
              </div>
              <div className="admin-stat">
                <strong>{draft.leadership?.length || 0}</strong>
                <span>Leaders</span>
              </div>
              <div className="admin-stat">
                <strong>{draft.pages?.gatherings?.events?.length || 0}</strong>
                <span>GHP stories</span>
              </div>
              <div className="admin-stat">
                <strong>{draft.pages?.reflections?.articles?.length || 0}</strong>
                <span>Full reflections</span>
              </div>
              <div className="admin-stat">
                <strong>{draft.faqs?.length || 0}</strong>
                <span>FAQ answers</span>
              </div>
            </div>
            <div className="admin-card">
              <h3 style={{ margin: '0 0 0.75rem' }}>Quick open</h3>
              <div className="admin-quick">
                {PAGE_KEYS.map((p) => (
                  <a key={p.key} className="admin-quick__link" href={p.path} target="_blank" rel="noreferrer">
                    <strong>{p.key}</strong>
                    <span>{p.path}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="admin-card">
              <h3 style={{ margin: '0 0 0.5rem' }}>How content is organised</h3>
              <ul className="admin-help">
                <li>
                  <strong>Menu pages</strong> — unique stories, galleries, event write-ups, and articles.
                </li>
                <li>
                  <strong>Homepage teasers</strong> — shorter blocks that invite people into those pages.
                </li>
                <li>
                  <strong>Shared data</strong> — team directory + FAQ answers used by their pages.
                </li>
                <li>
                  <strong>Backend</strong> — Postgres/PGlite database, hashed admin auth, content revisions, media library.
                </li>
              </ul>
            </div>
            <RevisionsPanel
              onRestored={(payload) => {
                setDraft(structuredClone(payload));
                setStatus('Revision restored');
              }}
            />
          </>
        )}

        {section === 'pages' && <PagesEditor draft={draft} setDraft={setDraft} />}
        {section === 'inbox' && <MessagesPanel />}

        {section === 'hero' && (
          <>
            <h2>Hero</h2>
            <p className="hint">Full-bleed first viewport copy and image.</p>
            <div className="admin-card admin-grid">
              <Field label="Badge">
                <input value={draft.hero.badge} onChange={(e) => updateHero('badge', e.target.value)} />
              </Field>
              <Field label="Headline">
                <input
                  value={draft.hero.headline}
                  onChange={(e) => updateHero('headline', e.target.value)}
                />
              </Field>
              <Field label="Support text">
                <textarea
                  value={draft.hero.support}
                  onChange={(e) => updateHero('support', e.target.value)}
                />
              </Field>
              <Field label="Hero image URL">
                <input value={draft.hero.image} onChange={(e) => updateHero('image', e.target.value)} />
              </Field>
              <img className="admin-thumb" src={draft.hero.image} alt="" />
              <div className="admin-grid two">
                <Field label="Primary CTA label">
                  <input
                    value={draft.hero.primaryCta.label}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        hero: {
                          ...d.hero,
                          primaryCta: { ...d.hero.primaryCta, label: e.target.value },
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Primary CTA href">
                  <input
                    value={draft.hero.primaryCta.href}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        hero: {
                          ...d.hero,
                          primaryCta: { ...d.hero.primaryCta, href: e.target.value },
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Secondary CTA label">
                  <input
                    value={draft.hero.secondaryCta.label}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        hero: {
                          ...d.hero,
                          secondaryCta: { ...d.hero.secondaryCta, label: e.target.value },
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Secondary CTA href">
                  <input
                    value={draft.hero.secondaryCta.href}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        hero: {
                          ...d.hero,
                          secondaryCta: { ...d.hero.secondaryCta, href: e.target.value },
                        },
                      }))
                    }
                  />
                </Field>
              </div>
            </div>
          </>
        )}

        {section === 'about' && (
          <>
            <h2>About</h2>
            <div className="admin-card admin-grid">
              <Field label="Label">
                <input
                  value={draft.about.label}
                  onChange={(e) => setDraft((d) => ({ ...d, about: { ...d.about, label: e.target.value } }))}
                />
              </Field>
              <Field label="Body">
                <textarea
                  value={draft.about.body}
                  onChange={(e) => setDraft((d) => ({ ...d, about: { ...d.about, body: e.target.value } }))}
                />
              </Field>
              <Field label="CTA label">
                <input
                  value={draft.about.cta.label}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      about: { ...d.about, cta: { ...d.about.cta, label: e.target.value } },
                    }))
                  }
                />
              </Field>
              {(draft.about.images || []).map((src, i) => (
                <Field key={i} label={`Gallery image ${i + 1} (Nigerian imagery preferred)`}>
                  <input
                    value={src}
                    onChange={(e) => {
                      const images = [...draft.about.images];
                      images[i] = e.target.value;
                      setDraft((d) => ({ ...d, about: { ...d.about, images } }));
                    }}
                  />
                  <img className="admin-thumb" src={src} alt="" />
                </Field>
              ))}
            </div>
          </>
        )}

        {section === 'pillars' && (
          <>
            <h2>Pillars</h2>
            {(draft.pillars || []).map((p, i) => (
              <div className="admin-card admin-grid" key={i}>
                <div className="admin-grid two">
                  <Field label="Title">
                    <input
                      value={p.title}
                      onChange={(e) => {
                        const pillars = [...draft.pillars];
                        pillars[i] = { ...p, title: e.target.value };
                        setDraft((d) => ({ ...d, pillars }));
                      }}
                    />
                  </Field>
                  <Field label="Color">
                    <input
                      value={p.color}
                      onChange={(e) => {
                        const pillars = [...draft.pillars];
                        pillars[i] = { ...p, color: e.target.value };
                        setDraft((d) => ({ ...d, pillars }));
                      }}
                    />
                  </Field>
                </div>
                <Field label="Text">
                  <textarea
                    value={p.text}
                    onChange={(e) => {
                      const pillars = [...draft.pillars];
                      pillars[i] = { ...p, text: e.target.value };
                      setDraft((d) => ({ ...d, pillars }));
                    }}
                  />
                </Field>
              </div>
            ))}
          </>
        )}

        {section === 'gatherings' && (
          <>
            <h2>Gatherings</h2>
            <p className="hint">GHP event cards — use Nigerian community imagery.</p>
            {(draft.gatherings || []).map((g, i) => (
              <div className="admin-card admin-grid" key={i}>
                <div className="admin-grid two">
                  <Field label="Year">
                    <input
                      value={g.year}
                      onChange={(e) => {
                        const gatherings = [...draft.gatherings];
                        gatherings[i] = { ...g, year: e.target.value };
                        setDraft((d) => ({ ...d, gatherings }));
                      }}
                    />
                  </Field>
                  <Field label="Name">
                    <input
                      value={g.name}
                      onChange={(e) => {
                        const gatherings = [...draft.gatherings];
                        gatherings[i] = { ...g, name: e.target.value };
                        setDraft((d) => ({ ...d, gatherings }));
                      }}
                    />
                  </Field>
                </div>
                <Field label="Theme">
                  <input
                    value={g.theme}
                    onChange={(e) => {
                      const gatherings = [...draft.gatherings];
                      gatherings[i] = { ...g, theme: e.target.value };
                      setDraft((d) => ({ ...d, gatherings }));
                    }}
                  />
                </Field>
                <Field label="Image URL">
                  <input
                    value={g.image}
                    onChange={(e) => {
                      const gatherings = [...draft.gatherings];
                      gatherings[i] = { ...g, image: e.target.value };
                      setDraft((d) => ({ ...d, gatherings }));
                    }}
                  />
                </Field>
                <img className="admin-thumb" src={g.image} alt="" />
                <button
                  className="admin-btn danger"
                  type="button"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      gatherings: d.gatherings.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  Remove gathering
                </button>
              </div>
            ))}
            <button
              className="admin-btn ghost"
              type="button"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  gatherings: [
                    ...d.gatherings,
                    {
                      year: '2026',
                      name: 'Berakah',
                      theme: 'Blessing & increase',
                      tag: 'GHP',
                      image:
                        'https://images.pexels.com/photos/38232286/pexels-photo-38232286.jpeg?auto=compress&cs=tinysrgb&w=1200',
                    },
                  ],
                }))
              }
            >
              Add gathering
            </button>
          </>
        )}

        {section === 'reflections' && (
          <>
            <h2>Reflections</h2>
            {(draft.reflections || []).map((r, i) => (
              <div className="admin-card admin-grid" key={i}>
                <Field label="Date / label">
                  <input
                    value={r.date}
                    onChange={(e) => {
                      const reflections = [...draft.reflections];
                      reflections[i] = { ...r, date: e.target.value };
                      setDraft((d) => ({ ...d, reflections }));
                    }}
                  />
                </Field>
                <Field label="Title">
                  <input
                    value={r.title}
                    onChange={(e) => {
                      const reflections = [...draft.reflections];
                      reflections[i] = { ...r, title: e.target.value };
                      setDraft((d) => ({ ...d, reflections }));
                    }}
                  />
                </Field>
                <Field label="Excerpt">
                  <textarea
                    value={r.excerpt}
                    onChange={(e) => {
                      const reflections = [...draft.reflections];
                      reflections[i] = { ...r, excerpt: e.target.value };
                      setDraft((d) => ({ ...d, reflections }));
                    }}
                  />
                </Field>
                <button
                  className="admin-btn danger"
                  type="button"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      reflections: d.reflections.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="admin-btn ghost"
              type="button"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  reflections: [
                    ...d.reflections,
                    { date: 'New', title: 'New reflection', excerpt: '' },
                  ],
                }))
              }
            >
              Add reflection
            </button>
          </>
        )}

        {section === 'leadership' && (
          <>
            <h2>Leadership</h2>
            <p className="hint">First entry is featured as Convener.</p>
            {(draft.leadership || []).map((person, i) => (
              <div className="admin-card admin-grid" key={i}>
                <div className="admin-grid two">
                  <Field label="Name">
                    <input
                      value={person.name}
                      onChange={(e) => {
                        const leadership = [...draft.leadership];
                        leadership[i] = { ...person, name: e.target.value };
                        setDraft((d) => ({ ...d, leadership }));
                      }}
                    />
                  </Field>
                  <Field label="Role">
                    <input
                      value={person.role}
                      onChange={(e) => {
                        const leadership = [...draft.leadership];
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
                      const leadership = [...draft.leadership];
                      leadership[i] = { ...person, titles: e.target.value };
                      setDraft((d) => ({ ...d, leadership }));
                    }}
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={person.location || ''}
                    onChange={(e) => {
                      const leadership = [...draft.leadership];
                      leadership[i] = { ...person, location: e.target.value || null };
                      setDraft((d) => ({ ...d, leadership }));
                    }}
                  />
                </Field>
                <Field label="Bio">
                  <textarea
                    value={person.bio || ''}
                    onChange={(e) => {
                      const leadership = [...draft.leadership];
                      leadership[i] = { ...person, bio: e.target.value };
                      setDraft((d) => ({ ...d, leadership }));
                    }}
                  />
                </Field>
                {i > 0 ? (
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
                    Remove person
                  </button>
                ) : null}
              </div>
            ))}
            <button
              className="admin-btn ghost"
              type="button"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  leadership: [
                    ...d.leadership,
                    {
                      name: 'New team member',
                      role: 'Role',
                      titles: '',
                      location: 'Nigeria',
                      bio: '',
                      featured: false,
                    },
                  ],
                }))
              }
            >
              Add team member
            </button>
          </>
        )}

        {section === 'faqs' && (
          <>
            <h2>FAQ</h2>
            {(draft.faqs || []).map((item, i) => (
              <div className="admin-card admin-grid" key={i}>
                <Field label="Question">
                  <input
                    value={item.q}
                    onChange={(e) => {
                      const faqs = [...draft.faqs];
                      faqs[i] = { ...item, q: e.target.value };
                      setDraft((d) => ({ ...d, faqs }));
                    }}
                  />
                </Field>
                <Field label="Answer">
                  <textarea
                    value={item.a}
                    onChange={(e) => {
                      const faqs = [...draft.faqs];
                      faqs[i] = { ...item, a: e.target.value };
                      setDraft((d) => ({ ...d, faqs }));
                    }}
                  />
                </Field>
                <button
                  className="admin-btn danger"
                  type="button"
                  onClick={() =>
                    setDraft((d) => ({ ...d, faqs: d.faqs.filter((_, idx) => idx !== i) }))
                  }
                >
                  Remove FAQ
                </button>
              </div>
            ))}
            <button
              className="admin-btn ghost"
              type="button"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  faqs: [...d.faqs, { q: 'New question?', a: '' }],
                }))
              }
            >
              Add FAQ
            </button>
          </>
        )}

        {section === 'contact' && (
          <>
            <h2>Contact</h2>
            <div className="admin-card admin-grid">
              <Field label="Title">
                <input
                  value={draft.contact.title}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, contact: { ...d.contact, title: e.target.value } }))
                  }
                />
              </Field>
              <Field label="Body">
                <textarea
                  value={draft.contact.body}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, contact: { ...d.contact, body: e.target.value } }))
                  }
                />
              </Field>
              <Field label="CTA label">
                <input
                  value={draft.contact.cta}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, contact: { ...d.contact, cta: e.target.value } }))
                  }
                />
              </Field>
              <Field label="Panel image URL">
                <input
                  value={draft.contact.skyImage}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, contact: { ...d.contact, skyImage: e.target.value } }))
                  }
                />
              </Field>
              <img className="admin-thumb" src={draft.contact.skyImage} alt="" />
              <Field label="Email placeholder">
                <input
                  value={draft.contact.placeholders.email}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      contact: {
                        ...d.contact,
                        placeholders: { ...d.contact.placeholders, email: e.target.value },
                      },
                    }))
                  }
                />
              </Field>
              <Field label="Phone placeholder">
                <input
                  value={draft.contact.placeholders.phone}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      contact: {
                        ...d.contact,
                        placeholders: { ...d.contact.placeholders, phone: e.target.value },
                      },
                    }))
                  }
                />
              </Field>
            </div>
          </>
        )}

        {section === 'nav' && (
          <>
            <h2>Navigation</h2>
            {(draft.nav || []).map((item, i) => (
              <div className="admin-card admin-grid two" key={i}>
                <Field label="Label">
                  <input
                    value={item.label}
                    onChange={(e) => {
                      const nav = [...draft.nav];
                      nav[i] = { ...item, label: e.target.value };
                      setDraft((d) => ({ ...d, nav }));
                    }}
                  />
                </Field>
                <Field label="Href">
                  <input
                    value={item.href}
                    onChange={(e) => {
                      const nav = [...draft.nav];
                      nav[i] = { ...item, href: e.target.value };
                      setDraft((d) => ({ ...d, nav }));
                    }}
                  />
                </Field>
              </div>
            ))}
          </>
        )}

        {section === 'media' && (
          <>
            <h2>Media library</h2>
            <p className="hint">Upload images, then paste the returned URL into any image field.</p>
            <div className="admin-card">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadFile(file);
                    setStatus(`Uploaded: ${url}`);
                    setError('');
                  } catch (err) {
                    setError(err.message || 'Upload failed');
                  }
                }}
              />
            </div>
            <div className="admin-card admin-grid">
              {uploads.length === 0 ? <p className="hint">No uploads yet.</p> : null}
              {uploads.map((f) => (
                <div key={f.id || f.filename || f.url}>
                  <code>{f.url}</code>
                  <img
                    className="admin-thumb"
                    src={f.url}
                    alt={f.original_name || f.filename || 'Upload'}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
