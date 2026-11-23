import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';
import { Field, normalizeContent } from './fields';
import Dashboard from './Dashboard';
import PagesEditor from './PagesEditor';
import EventsEditor from './EventsEditor';
import VideosEditor from './VideosEditor';
import MediaLibrary from './MediaLibrary';
import HomepageEditor from './HomepageEditor';
import TeamEditor from './TeamEditor';
import FaqsEditor from './FaqsEditor';
import AnnouncementsEditor from './AnnouncementsEditor';
import TestimonialsEditor from './TestimonialsEditor';
import PartnersEditor from './PartnersEditor';
import SettingsEditor from './SettingsEditor';
import MessagesPanel from './MessagesPanel';
import RedirectsEditor from './RedirectsEditor';
import ResourcesEditor from './ResourcesEditor';
import BackupEditor from './BackupEditor';
import Finder from './Finder';
import './admin.css';

const SECTIONS = [
  { id: 'overview', label: 'Dashboard', group: 'Start' },
  { id: 'finder', label: 'Content finder', group: 'Start' },
  { id: 'pages', label: 'Pages & builder', group: 'Content' },
  { id: 'events', label: 'Events studio', group: 'Content' },
  { id: 'videos', label: 'YouTube studio', group: 'Content' },
  { id: 'resources', label: 'Resources', group: 'Content' },
  { id: 'media', label: 'Media library', group: 'Content' },
  { id: 'announcements', label: 'Announcements', group: 'Content' },
  { id: 'testimonials', label: 'Testimonials', group: 'Content' },
  { id: 'partners', label: 'Partners', group: 'Content' },
  { id: 'homepage', label: 'Homepage studio', group: 'Homepage' },
  { id: 'leadership', label: 'Team directory', group: 'Directory' },
  { id: 'faqs', label: 'FAQ answers', group: 'Directory' },
  { id: 'contact', label: 'Contact panel', group: 'Directory' },
  { id: 'inbox', label: 'Inbox', group: 'Directory' },
  { id: 'nav', label: 'Navigation', group: 'Site' },
  { id: 'redirects', label: 'Redirects', group: 'Site' },
  { id: 'settings', label: 'Site settings', group: 'Site' },
  { id: 'backup', label: 'Backup & restore', group: 'Site' },
];

const LOCAL_DRAFT_KEY = 'ugo-cms-local-draft';

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
          <div className="admin-login__logo-frame">
            <img
              className="admin-login__logo"
              src="/logo-icon.png?v=3"
              alt="Unique Generation Outreach"
              width={88}
              height={88}
            />
          </div>
          <p className="admin-login__org">Unique Generation Outreach</p>
          <h1 id="admin-login-title">Content studio</h1>
          <p className="admin-login__lede">
            Sign in to manage pages, media, events, video, and the full UGO site.
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
  const [navQuery, setNavQuery] = useState('');
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/session', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authenticated)))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!content) return;
    try {
      const raw = localStorage.getItem(LOCAL_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.draft && parsed?.savedAt) {
          const serverUpdated = content.updatedAt ? Date.parse(content.updatedAt) : 0;
          if (Date.parse(parsed.savedAt) > serverUpdated) {
            setDraft(normalizeContent(parsed.draft));
            setStatus('Restored local unsaved draft');
            return;
          }
        }
      }
    } catch {
      /* ignore */
    }
    setDraft(normalizeContent(structuredClone(content)));
  }, [content]);

  const dirty = useMemo(() => {
    if (!draft || !content) return false;
    return JSON.stringify(draft) !== JSON.stringify(normalizeContent(content));
  }, [draft, content]);

  useEffect(() => {
    if (!draft || !dirty) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          LOCAL_DRAFT_KEY,
          JSON.stringify({ savedAt: new Date().toISOString(), draft }),
        );
      } catch {
        /* ignore quota */
      }
    }, 800);
    return () => clearTimeout(t);
  }, [draft, dirty]);

  const save = useCallback(async () => {
    if (!draft) return;
    setStatus('');
    setError('');
    setSaving(true);
    try {
      await saveContent(draft);
      localStorage.removeItem(LOCAL_DRAFT_KEY);
      setStatus('Saved successfully');
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [draft, saveContent]);

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (dirty && !saving) save();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dirty, saving, save]);

  async function logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setAuthed(false);
  }

  const filteredSections = useMemo(() => {
    const q = navQuery.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.filter(
      (s) => s.label.toLowerCase().includes(q) || s.group.toLowerCase().includes(q),
    );
  }, [navQuery]);

  if (checking || loading) return <div className="boot-screen">Loading CMS…</div>;
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  if (!draft) return <div className="boot-screen">No content loaded.</div>;

  return (
    <div className="admin-shell admin-shell--studio">
      <aside className="admin-side">
        <div className="admin-side__brand">
          <img src="/logo-icon.png?v=3" alt="" />
          <div>
            <strong>UGO CMS</strong>
            <span>Full content studio</span>
          </div>
        </div>
        <input
          className="admin-side__search"
          placeholder="Search studio…"
          value={navQuery}
          onChange={(e) => setNavQuery(e.target.value)}
        />
        {filteredSections.map((s, idx) => (
          <div key={s.id}>
            {idx === 0 || filteredSections[idx - 1].group !== s.group ? (
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
        <div className="admin-toolbar admin-toolbar--sticky">
          <div className="admin-toolbar__left">
            <span className="admin-kicker">{SECTIONS.find((s) => s.id === section)?.group}</span>
            <strong>{SECTIONS.find((s) => s.id === section)?.label}</strong>
          </div>
          <div className="admin-toolbar__right">
            <button className="admin-btn primary" type="button" onClick={save} disabled={!dirty || saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              className="admin-btn ghost"
              type="button"
              onClick={() => {
                setDraft(normalizeContent(structuredClone(content)));
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
            {dirty ? <span className="admin-status">Unsaved · Ctrl/⌘ S</span> : null}
            {status ? <span className="admin-status ok">{status}</span> : null}
            {error ? <span className="admin-status err">{error}</span> : null}
          </div>
        </div>

        {section === 'overview' && (
          <Dashboard
            draft={draft}
            setSection={setSection}
            onRestored={(payload) => {
              setDraft(normalizeContent(structuredClone(payload)));
              setStatus('Revision restored');
            }}
          />
        )}
        {section === 'finder' && <Finder draft={draft} setSection={setSection} />}
        {section === 'pages' && <PagesEditor draft={draft} setDraft={setDraft} />}
        {section === 'events' && <EventsEditor draft={draft} setDraft={setDraft} />}
        {section === 'videos' && <VideosEditor draft={draft} setDraft={setDraft} />}
        {section === 'resources' && <ResourcesEditor draft={draft} setDraft={setDraft} />}
        {section === 'media' && (
          <MediaLibrary onStatus={setStatus} onError={setError} />
        )}
        {section === 'announcements' && (
          <AnnouncementsEditor draft={draft} setDraft={setDraft} />
        )}
        {section === 'testimonials' && (
          <TestimonialsEditor draft={draft} setDraft={setDraft} />
        )}
        {section === 'partners' && <PartnersEditor draft={draft} setDraft={setDraft} />}
        {section === 'homepage' && <HomepageEditor draft={draft} setDraft={setDraft} />}
        {section === 'leadership' && <TeamEditor draft={draft} setDraft={setDraft} />}
        {section === 'faqs' && <FaqsEditor draft={draft} setDraft={setDraft} />}
        {section === 'inbox' && <MessagesPanel />}
        {section === 'redirects' && <RedirectsEditor draft={draft} setDraft={setDraft} />}
        {section === 'settings' && <SettingsEditor draft={draft} setDraft={setDraft} />}
        {section === 'backup' && (
          <BackupEditor
            draft={draft}
            setDraft={setDraft}
            onStatus={setStatus}
            onError={setError}
          />
        )}

        {section === 'contact' && (
          <>
            <h2>Contact panel</h2>
            <div className="admin-card admin-grid">
              <Field label="Eyebrow">
                <input
                  value={draft.contact?.eyebrow || ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      contact: { ...d.contact, eyebrow: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Title">
                <input
                  value={draft.contact?.title || ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      contact: { ...d.contact, title: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Body">
                <textarea
                  value={draft.contact?.body || ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      contact: { ...d.contact, body: e.target.value },
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
            <p className="hint">Primary menu links. New pages can auto-add entries.</p>
            <button
              className="admin-btn primary"
              type="button"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  nav: [...(d.nav || []), { label: 'New link', href: '/' }],
                }))
              }
            >
              Add nav item
            </button>
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
                <button
                  className="admin-btn ghost"
                  type="button"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      nav: (d.nav || []).filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
