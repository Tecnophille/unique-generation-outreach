import { useMemo, useState } from 'react';

function walk(value, path, hits, needle) {
  if (hits.length > 80) return;
  if (typeof value === 'string') {
    if (value.toLowerCase().includes(needle)) {
      hits.push({ path, snippet: value.slice(0, 140) });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, `${path}[${i}]`, hits, needle));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => {
      if (k === 'password_hash') return;
      walk(v, path ? `${path}.${k}` : k, hits, needle);
    });
  }
}

function sectionForPath(path) {
  if (path.startsWith('pages')) return 'pages';
  if (path.startsWith('events')) return 'events';
  if (path.startsWith('videos')) return 'videos';
  if (path.startsWith('hero') || path.startsWith('about') || path.startsWith('pillars') || path.startsWith('gatherings') || path.startsWith('reflections'))
    return 'homepage';
  if (path.startsWith('leadership')) return 'leadership';
  if (path.startsWith('faqs')) return 'faqs';
  if (path.startsWith('contact')) return 'contact';
  if (path.startsWith('nav')) return 'nav';
  if (path.startsWith('announcements')) return 'announcements';
  if (path.startsWith('testimonials')) return 'testimonials';
  if (path.startsWith('partners')) return 'partners';
  if (path.startsWith('resources')) return 'resources';
  if (path.startsWith('seo') || path.startsWith('social') || path.startsWith('footer') || path.startsWith('brand'))
    return 'settings';
  return 'overview';
}

export default function Finder({ draft, setSection }) {
  const [q, setQ] = useState('');
  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    const out = [];
    walk(draft, '', out, needle);
    return out;
  }, [draft, q]);

  return (
    <>
      <h2>Content finder</h2>
      <p className="hint">Search every string in the CMS draft and jump to the matching studio.</p>
      <input
        className="admin-search admin-search--wide"
        placeholder="Search titles, stories, FAQs, events…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />
      <div className="admin-finder-list">
        {q.trim().length >= 2 && hits.length === 0 ? (
          <p className="hint">No matches.</p>
        ) : null}
        {hits.map((hit) => (
          <button
            key={`${hit.path}-${hit.snippet.slice(0, 24)}`}
            type="button"
            className="admin-finder-hit"
            onClick={() => setSection(sectionForPath(hit.path))}
          >
            <code>{hit.path}</code>
            <span>{hit.snippet}</span>
          </button>
        ))}
      </div>
    </>
  );
}
