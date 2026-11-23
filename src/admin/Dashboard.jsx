import RevisionsPanel from './RevisionsPanel';

export default function Dashboard({ draft, setSection, onRestored }) {
  const pages = Object.keys(draft.pages || {});
  const published = pages.filter((k) => (draft.pages[k].status || 'published') !== 'draft');
  const drafts = pages.length - published.length;

  const stats = [
    { value: pages.length, label: 'Pages', go: 'pages' },
    { value: draft.events?.length || 0, label: 'Events', go: 'events' },
    { value: draft.videos?.length || 0, label: 'Videos', go: 'videos' },
    { value: draft.leadership?.length || 0, label: 'Team', go: 'leadership' },
    { value: draft.faqs?.length || 0, label: 'FAQs', go: 'faqs' },
    { value: draft.testimonials?.length || 0, label: 'Testimonials', go: 'testimonials' },
    { value: draft.partners?.length || 0, label: 'Partners', go: 'partners' },
    { value: draft.announcements?.length || 0, label: 'Announcements', go: 'announcements' },
    { value: drafts, label: 'Draft pages', go: 'pages' },
  ];

  const quick = [
    { id: 'pages', label: 'Create / edit pages', hint: 'Routes, stories, blocks, SEO' },
    { id: 'events', label: 'Manage events', hint: 'Dates, venues, featured' },
    { id: 'videos', label: 'YouTube library', hint: 'Embeds across the site' },
    { id: 'media', label: 'Media library', hint: 'Upload & reuse images' },
    { id: 'homepage', label: 'Homepage studio', hint: 'Hero + teasers in one place' },
    { id: 'settings', label: 'Site settings', hint: 'Brand, SEO, social, footer' },
  ];

  return (
    <>
      <div className="admin-hero-panel">
        <div>
          <p className="admin-kicker">UGO Content Studio</p>
          <h2>Mission control</h2>
          <p className="hint">
            Full-site CMS for Unique Generation Outreach — pages, media, events, video, team, and
            more. Last saved:{' '}
            {draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '—'}
          </p>
        </div>
        <div className="admin-hero-panel__actions">
          <button className="admin-btn primary" type="button" onClick={() => setSection('pages')}>
            Open pages
          </button>
          <button className="admin-btn ghost" type="button" onClick={() => setSection('media')}>
            Upload media
          </button>
        </div>
      </div>

      <div className="admin-stats admin-stats--wide">
        {stats.map((s) => (
          <button
            key={s.label}
            type="button"
            className="admin-stat admin-stat--btn"
            onClick={() => setSection(s.go)}
          >
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-grid two">
        <div className="admin-card">
          <h3 style={{ margin: '0 0 0.75rem' }}>Jump in</h3>
          <div className="admin-quick">
            {quick.map((q) => (
              <button
                key={q.id}
                type="button"
                className="admin-quick__link"
                onClick={() => setSection(q.id)}
              >
                <strong>{q.label}</strong>
                <span>{q.hint}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="admin-card">
          <h3 style={{ margin: '0 0 0.75rem' }}>Live routes</h3>
          <div className="admin-quick">
            {pages.slice(0, 12).map((key) => (
              <a
                key={key}
                className="admin-quick__link"
                href={`/${key}`}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{draft.pages[key]?.label || key}</strong>
                <span>
                  /{key}
                  {(draft.pages[key]?.status || 'published') === 'draft' ? ' · draft' : ''}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ margin: '0 0 0.5rem' }}>Studio map</h3>
        <ul className="admin-help">
          <li>
            <strong>Content</strong> — pages with block builder, events, YouTube, media, announcements,
            testimonials, partners.
          </li>
          <li>
            <strong>Homepage</strong> — hero and teaser sections that feed the public landing page.
          </li>
          <li>
            <strong>Directory</strong> — team, FAQs, contact panel, inbox messages.
          </li>
          <li>
            <strong>Site</strong> — navigation, brand/SEO/social settings, revision history.
          </li>
        </ul>
      </div>

      <RevisionsPanel onRestored={onRestored} />
    </>
  );
}
