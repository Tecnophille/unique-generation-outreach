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
import NavEditor from './NavEditor';
import Finder from './Finder';
import CommandPalette from './CommandPalette';
import BootScreen from '../components/BootScreen';
import './admin.css';

const SECTIONS = [
  { id: 'overview', label: 'Dashboard', group: 'Start', icon: 'home' },
  { id: 'finder', label: 'Content finder', group: 'Start', icon: 'search' },
  { id: 'pages', label: 'Pages & builder', group: 'Content', icon: 'pages' },
  { id: 'events', label: 'Events studio', group: 'Content', icon: 'calendar' },
  { id: 'videos', label: 'YouTube studio', group: 'Content', icon: 'video' },
  { id: 'resources', label: 'Resources', group: 'Content', icon: 'file' },
  { id: 'media', label: 'Media library', group: 'Content', icon: 'image' },
  { id: 'announcements', label: 'Announcements', group: 'Content', icon: 'megaphone' },
  { id: 'testimonials', label: 'Testimonials', group: 'Content', icon: 'quote' },
  { id: 'partners', label: 'Partners', group: 'Content', icon: 'handshake' },
  { id: 'homepage', label: 'Homepage studio', group: 'Homepage', icon: 'spark' },
  { id: 'leadership', label: 'Team directory', group: 'Directory', icon: 'users' },
  { id: 'faqs', label: 'FAQ answers', group: 'Directory', icon: 'help' },
  { id: 'contact', label: 'Contact panel', group: 'Directory', icon: 'mail' },
  { id: 'inbox', label: 'Inbox', group: 'Directory', icon: 'inbox' },
  { id: 'nav', label: 'Navigation', group: 'Site', icon: 'menu' },
  { id: 'redirects', label: 'Redirects', group: 'Site', icon: 'redirect' },
  { id: 'settings', label: 'Site settings', group: 'Site', icon: 'settings' },
  { id: 'backup', label: 'Backup & restore', group: 'Site', icon: 'backup' },
];

function NavIcon({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: 'false',
  };
  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case 'pages':
      return (
        <svg {...common}>
          <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
          <path d="M14 3v5h5" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
          <path d="M8 3.5V7M16 3.5V7M3.5 10h17" />
        </svg>
      );
    case 'video':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="m16 10 5-3v10l-5-3v-4Z" />
        </svg>
      );
    case 'file':
      return (
        <svg {...common}>
          <path d="M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
          <path d="M14 4v4h4M9 13h6M9 17h4" />
        </svg>
      );
    case 'image':
      return (
        <svg {...common}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <circle cx="9" cy="10" r="1.6" />
          <path d="m3.5 15.5 5-4 3.5 3 2.5-2 5.5 5" />
        </svg>
      );
    case 'megaphone':
      return (
        <svg {...common}>
          <path d="M4 14v-4l12-5v14L4 14Z" />
          <path d="M8 14.5V19l3-1.5" />
        </svg>
      );
    case 'quote':
      return (
        <svg {...common}>
          <path d="M8 17H5.5A2.5 2.5 0 0 1 3 14.5V12h5v5ZM19 17h-2.5A2.5 2.5 0 0 1 14 14.5V12h5v5Z" />
          <path d="M3 12V9.5A4.5 4.5 0 0 1 7.5 5H8M14 12V9.5A4.5 4.5 0 0 1 18.5 5H19" />
        </svg>
      );
    case 'handshake':
      return (
        <svg {...common}>
          <path d="M8 12 5.5 9.5 3 12l3 3 2.5-2.5ZM16 12l2.5-2.5L21 12l-3 3-2-2" />
          <path d="m8.5 14.5 2 2a2 2 0 0 0 2.8 0l3.2-3.2" />
        </svg>
      );
    case 'spark':
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        </svg>
      );
    case 'users':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
          <circle cx="17" cy="9" r="2.4" />
          <path d="M15 19a4.2 4.2 0 0 1 5.5-4" />
        </svg>
      );
    case 'help':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.8.4-1.5 1-1.5 2" />
          <path d="M12 17h.01" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="m3.5 7.5 8.5 6 8.5-6" />
        </svg>
      );
    case 'inbox':
      return (
        <svg {...common}>
          <path d="M4 13h4l2 3h4l2-3h4v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5Z" />
          <path d="M4 13 7 5h10l3 8" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case 'redirect':
      return (
        <svg {...common}>
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 3.5v2.2M12 18.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
        </svg>
      );
    case 'backup':
      return (
        <svg {...common}>
          <path d="M12 5v9" />
          <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
          <path d="M5 17.5h14" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...common}>
          <path d="M10 12h10" />
          <path d="m16 8 4 4-4 4" />
          <path d="M13 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
        </svg>
      );
  }
}

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
  const [unread, setUnread] = useState(0);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [sideCollapsed, setSideCollapsed] = useState(() => {
    try {
      return localStorage.getItem('ugo-cms-side') === '1';
    } catch {
      return false;
    }
  });

  const goSection = useCallback((id) => {
    setSection(id);
    setNavOpen(false);
    setCmdOpen(false);
  }, []);

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
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setSideCollapsed((v) => {
          const next = !v;
          try {
            localStorage.setItem('ugo-cms-side', next ? '1' : '0');
          } catch {
            /* ignore */
          }
          return next;
        });
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dirty, saving, save]);

  useEffect(() => {
    function onBeforeUnload(e) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (!authed) return;
    fetch('/api/contact/unread-count', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { count: 0 }))
      .then((d) => setUnread(Number(d.count) || 0))
      .catch(() => setUnread(0));
  }, [authed, section]);

  useEffect(() => {
    if (!navOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e) {
      if (e.key === 'Escape') setNavOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [navOpen]);

  useEffect(() => {
    function onResize() {
      if (window.matchMedia('(min-width: 901px)').matches) setNavOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  async function logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setAuthed(false);
    setNavOpen(false);
  }

  const filteredSections = useMemo(() => {
    const q = navQuery.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.filter(
      (s) => s.label.toLowerCase().includes(q) || s.group.toLowerCase().includes(q),
    );
  }, [navQuery]);

  if (checking || loading) return <BootScreen label="Loading CMS" />;
  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  if (!draft) return <BootScreen label="No content loaded" />;

  return (
    <div
      className={`admin-shell admin-shell--studio${sideCollapsed ? ' admin-shell--collapsed' : ''}${navOpen ? ' admin-shell--nav-open' : ''}`}
    >
      <button
        type="button"
        className="admin-nav-backdrop"
        aria-label="Close navigation"
        tabIndex={navOpen ? 0 : -1}
        onClick={() => setNavOpen(false)}
      />

      <aside className="admin-side" aria-label="Studio navigation" id="admin-side-nav">
        <div className="admin-side__brand">
          <img src="/logo-icon.png?v=3" alt="" />
          <div>
            <strong>UGO CMS</strong>
            <span>Full content studio</span>
          </div>
          <button
            type="button"
            className="admin-side__close"
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
          >
            ✕
          </button>
        </div>
        <button
          type="button"
          className="admin-side__cmd"
          onClick={() => {
            setCmdOpen(true);
            setNavOpen(false);
          }}
          title="Command palette (Ctrl/⌘ K)"
        >
          Jump… <kbd>⌘K</kbd>
        </button>
        <input
          className="admin-side__search"
          placeholder="Filter nav…"
          value={navQuery}
          onChange={(e) => setNavQuery(e.target.value)}
        />
        <nav className="admin-side__nav">
          {filteredSections.map((s, idx) => (
            <div key={s.id}>
              {idx === 0 || filteredSections[idx - 1].group !== s.group ? (
                <div className="admin-side__group">{s.group}</div>
              ) : null}
              <button
                type="button"
                className={section === s.id ? 'is-active' : ''}
                onClick={() => goSection(s.id)}
                title={s.label}
                aria-label={s.label}
              >
                <span className="admin-side__icon">
                  <NavIcon name={s.icon} />
                </span>
                <span className="admin-side__label">{s.label}</span>
                {s.id === 'inbox' && unread > 0 ? (
                  <span className="admin-side__badge">{unread}</span>
                ) : null}
              </button>
            </div>
          ))}
        </nav>
        <div className="admin-side__foot">
          <button
            type="button"
            className="admin-side__collapse"
            onClick={() => {
              setSideCollapsed((v) => {
                const next = !v;
                try {
                  localStorage.setItem('ugo-cms-side', next ? '1' : '0');
                } catch {
                  /* ignore */
                }
                return next;
              });
            }}
            title={sideCollapsed ? 'Expand sidebar (Ctrl/⌘ \\)' : 'Collapse sidebar (Ctrl/⌘ \\)'}
            aria-label={sideCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={sideCollapsed}
          >
            <span className="admin-side__collapse-icon" aria-hidden="true">
              {sideCollapsed ? '»' : '«'}
            </span>
            <span className="admin-side__collapse-text">{sideCollapsed ? 'Expand' : 'Collapse'}</span>
          </button>
          <Link to="/" target="_blank" rel="noreferrer">
            <span className="admin-side__icon" aria-hidden="true">
              <NavIcon name="redirect" />
            </span>
            <span className="admin-side__label">Open website</span>
          </Link>
          <button type="button" onClick={logout}>
            <span className="admin-side__icon" aria-hidden="true">
              <NavIcon name="logout" />
            </span>
            <span className="admin-side__label">Sign out</span>
          </button>
        </div>
      </aside>

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        sections={SECTIONS}
        onSelect={goSection}
        unread={unread}
      />

      <main className="admin-main">
        <div className="admin-toolbar admin-toolbar--sticky">
          <div className="admin-toolbar__left">
            <button
              type="button"
              className="admin-nav-toggle"
              aria-expanded={navOpen}
              aria-controls="admin-side-nav"
              onClick={() => setNavOpen((v) => !v)}
            >
              <span className="admin-nav-toggle__bars" aria-hidden="true" />
              Menu
            </button>
            <div className="admin-toolbar__titles">
              <span className="admin-kicker">{SECTIONS.find((s) => s.id === section)?.group}</span>
              <strong>{SECTIONS.find((s) => s.id === section)?.label}</strong>
            </div>
          </div>
          <div className="admin-toolbar__right">
            <button
              className="admin-btn ghost admin-toolbar__cmd"
              type="button"
              onClick={() => setCmdOpen(true)}
              title="Command palette"
            >
              ⌘K
            </button>
            <button className="admin-btn primary" type="button" onClick={save} disabled={!dirty || saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              className="admin-btn ghost admin-toolbar__secondary"
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
            <button className="admin-btn ghost admin-toolbar__secondary" type="button" onClick={refresh}>
              Reload
            </button>
            {dirty ? <span className="admin-status admin-toolbar__meta">Unsaved</span> : null}
            {status ? <span className="admin-status ok admin-toolbar__meta">{status}</span> : null}
            {error ? <span className="admin-status err">{error}</span> : null}
          </div>
        </div>

        {section === 'overview' && (
          <Dashboard
            draft={draft}
            setSection={goSection}
            onRestored={(payload) => {
              setDraft(normalizeContent(structuredClone(payload)));
              setStatus('Revision restored');
            }}
          />
        )}
        {section === 'finder' && <Finder draft={draft} setSection={goSection} />}
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
            <p className="hint">
              Public contact details and the stay-in-touch panel. Email and phone appear as clickable
              links on the site once set.
            </p>
            <div className="admin-card admin-grid">
              <h3 style={{ margin: 0 }}>Contact details</h3>
              <div className="admin-grid two">
                <Field label="Public email" hint="Used for the Reach out button and mailto links">
                  <input
                    type="email"
                    inputMode="email"
                    placeholder="hello@example.org"
                    value={draft.contact?.email || ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        contact: { ...d.contact, email: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field label="Public phone" hint="Shown with a tap-to-call link">
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="+234 …"
                    value={draft.contact?.phone || ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        contact: { ...d.contact, phone: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Button label">
                <input
                  value={draft.contact?.cta || ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      contact: { ...d.contact, cta: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>
            <div className="admin-card admin-grid">
              <h3 style={{ margin: 0 }}>Panel copy</h3>
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
              <Field label="Panel image URL">
                <input
                  value={draft.contact?.skyImage || ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      contact: { ...d.contact, skyImage: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>
            <div className="admin-card admin-grid">
              <h3 style={{ margin: 0 }}>Newsletter block</h3>
              <div className="admin-grid two">
                <Field label="Title before accent">
                  <input
                    value={draft.contact?.newsletter?.titleBefore || ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        contact: {
                          ...d.contact,
                          newsletter: {
                            ...(d.contact?.newsletter || {}),
                            titleBefore: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </Field>
                <Field label="Title accent">
                  <input
                    value={draft.contact?.newsletter?.titleAccent || ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        contact: {
                          ...d.contact,
                          newsletter: {
                            ...(d.contact?.newsletter || {}),
                            titleAccent: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Newsletter body">
                <textarea
                  value={draft.contact?.newsletter?.body || ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      contact: {
                        ...d.contact,
                        newsletter: {
                          ...(d.contact?.newsletter || {}),
                          body: e.target.value,
                        },
                      },
                    }))
                  }
                />
              </Field>
            </div>
          </>
        )}

        {section === 'nav' && <NavEditor draft={draft} setDraft={setDraft} />}
      </main>
    </div>
  );
}
