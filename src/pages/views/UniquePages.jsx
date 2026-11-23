import { Link } from 'react-router-dom';
import { useContent, initials } from '../../cms/ContentContext';

function StoryBlock({ title, story, cta }) {
  if (!story && !title) return null;
  return (
    <section className="uniq-story section section--tight">
      <div className="wrap uniq-story__inner">
        {title ? <h2>{title}</h2> : null}
        {String(story || '')
          .split(/\n\n+/)
          .filter(Boolean)
          .map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        {cta?.label && cta?.href ? (
          <p className="uniq-story__cta">
            <Link className="btn btn--solid" to={cta.href}>
              {cta.label}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}

function QuoteBlock({ quote }) {
  if (!quote?.text) return null;
  return (
    <section className="uniq-quote">
      <div className="wrap">
        <blockquote>
          <p>“{quote.text}”</p>
          {quote.attribution ? <cite>— {quote.attribution}</cite> : null}
        </blockquote>
      </div>
    </section>
  );
}

export function AboutUnique({ page }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <QuoteBlock quote={page.quote} />
      <section className="section section--tight">
        <div className="wrap">
          <h2 className="uniq-heading">Milestones of the mission</h2>
          <div className="uniq-milestones">
            {(page.milestones || []).map((m) => (
              <article key={m.year}>
                <span>{m.year}</span>
                <p>{m.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2 className="uniq-heading">Life around the mission</h2>
          <div className="uniq-gallery">
            {(page.gallery || []).map((g) => (
              <figure key={g.src}>
                <img src={g.src} alt={g.caption || ''} />
                {g.caption ? <figcaption>{g.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
          {page.cta ? (
            <div className="page-extras__cta">
              <Link className="btn btn--solid" to={page.cta.href}>
                {page.cta.label}
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

export function PillarsUnique({ page }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <section className="section">
        <div className="wrap uniq-pillar-list">
          {(page.items || []).map((item, i) => (
            <article key={item.title} className="uniq-pillar">
              <div className="uniq-pillar__index">0{i + 1}</div>
              <div>
                <h3>{item.title}</h3>
                <p className="uniq-pillar__lead">{item.text}</p>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
        {page.cta ? (
          <div className="wrap page-extras__cta">
            <Link className="btn btn--solid" to={page.cta.href}>
              {page.cta.label}
            </Link>
          </div>
        ) : null}
      </section>
    </>
  );
}

export function GatheringsUnique({ page }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <section className="section">
        <div className="wrap uniq-events">
          {(page.events || []).map((ev) => (
            <article key={ev.name} className="uniq-event">
              <div className="uniq-event__media">
                <img src={ev.image} alt="" />
              </div>
              <div className="uniq-event__body">
                <span className="tag">GHP {ev.year}</span>
                <h3>{ev.name}</h3>
                <p className="uniq-event__theme">{ev.theme}</p>
                <p>{ev.story}</p>
              </div>
            </article>
          ))}
        </div>
        {page.cta ? (
          <div className="wrap page-extras__cta">
            <Link className="btn btn--solid" to={page.cta.href}>
              {page.cta.label}
            </Link>
          </div>
        ) : null}
      </section>
      <VideosBlock videos={page.videos} />
    </>
  );
}

export function ReflectionsUnique({ page }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <section className="section">
        <div className="wrap uniq-articles">
          {(page.articles || []).map((a) => (
            <article key={a.title} className="uniq-article">
              <div className="reflection__date">{a.date}</div>
              <h3>{a.title}</h3>
              {String(a.body || '')
                .split(/\n\n+/)
                .filter(Boolean)
                .map((p) => (
                  <p key={p.slice(0, 28)}>{p}</p>
                ))}
            </article>
          ))}
        </div>
        {page.cta ? (
          <div className="wrap page-extras__cta">
            <Link className="btn btn--solid" to={page.cta.href}>
              {page.cta.label}
            </Link>
          </div>
        ) : null}
      </section>
    </>
  );
}

export function LeadershipUnique({ page }) {
  const { content } = useContent();
  const team = content.leadership || [];
  const [convener, ...rest] = team;

  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <section className="section section--tight">
        <div className="wrap">
          <div className="page-extras__grid">
            {(page.focus || []).map((f) => (
              <article key={f.title} className="page-extras__card">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2 className="uniq-heading">The team</h2>
          {convener ? (
            <article className="leader leader-featured" style={{ marginTop: '1.5rem' }}>
              <div className="avatar avatar--lg" aria-hidden="true">
                {initials(convener.name)}
              </div>
              <div>
                <div className="leader__role">{convener.role}</div>
                <h3>{convener.name}</h3>
                <p className="leader__titles">{convener.titles}</p>
                <p>{convener.bio}</p>
              </div>
            </article>
          ) : null}
          <div className="team-grid" style={{ marginTop: '1.5rem' }}>
            {rest.map((person) => (
              <article key={person.name} className="leader team-card">
                <div className="avatar" aria-hidden="true">
                  {initials(person.name)}
                </div>
                <div>
                  <div className="leader__role">{person.role}</div>
                  <h3>{person.name}</h3>
                  <p className="leader__titles">{person.titles}</p>
                  {person.location ? <p className="leader__location">{person.location}</p> : null}
                  <p>{person.bio}</p>
                </div>
              </article>
            ))}
          </div>
          {page.cta ? (
            <div className="page-extras__cta">
              <Link className="btn btn--solid" to={page.cta.href}>
                {page.cta.label}
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

export function FaqUnique({ page }) {
  const { content } = useContent();
  const faqs = content.faqs || [];
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} cta={page.cta} />
      <section className="section">
        <div className="wrap faq" style={{ display: 'block' }}>
          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>
                  {item.q}
                  <span className="faq-item__plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="faq-item__body">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function ContactUnique({ page }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <section className="section section--tight">
        <div className="wrap page-extras__grid">
          {(page.channels || []).map((c) => (
            <article key={c.title} className="page-extras__card">
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
      </section>
      {/* Contact form/panel is unique enough as the contact component, imported by parent if needed */}
    </>
  );
}

function youtubeId(url) {
  const m = String(url || '').match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|v=)([\w-]{11})/,
  );
  return m?.[1] || '';
}

function VideosBlock({ videos, heading = 'Videos' }) {
  const list = (videos || []).filter((v) => youtubeId(v.url));
  if (!list.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="uniq-heading">{heading}</h2>
        <div className="uniq-videos">
          {list.map((v) => {
            const id = youtubeId(v.url);
            return (
              <article key={v.id || v.url} className="uniq-video">
                <div className="uniq-video__frame">
                  <iframe
                    title={v.title || 'YouTube video'}
                    src={`https://www.youtube.com/embed/${id}`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {v.title ? <h3>{v.title}</h3> : null}
                {v.description ? <p>{v.description}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GalleryBlock({ gallery }) {
  if (!gallery?.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="uniq-heading">Gallery</h2>
        <div className="uniq-gallery">
          {gallery.map((g) => (
            <figure key={g.src}>
              <img src={g.src} alt={g.caption || ''} />
              {g.caption ? <figcaption>{g.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteEventsBlock() {
  const { content } = useContent();
  const events = content.events || [];
  if (!events.length) {
    return (
      <section className="section">
        <div className="wrap">
          <p className="hint">No events published yet.</p>
        </div>
      </section>
    );
  }
  return (
    <section className="section">
      <div className="wrap uniq-events">
        {events.map((ev) => (
          <article key={ev.id || ev.title} className="uniq-event">
            {ev.image ? (
              <div className="uniq-event__media">
                <img src={ev.image} alt="" />
              </div>
            ) : null}
            <div className="uniq-event__body">
              {ev.date ? <span className="tag">{ev.date}</span> : null}
              <h3>{ev.title}</h3>
              {ev.location ? <p className="uniq-event__theme">{ev.location}</p> : null}
              {ev.summary ? <p>{ev.summary}</p> : null}
              {ev.link ? (
                <p>
                  <a className="btn btn--solid" href={ev.link}>
                    Details
                  </a>
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Flexible layout for CMS-created pages and events/videos hubs. */
export function CustomPageUnique({ page }) {
  const { content } = useContent();
  const siteVideos = page.useSiteVideos ? content.videos || [] : [];
  const pageVideos = [...(page.videos || []), ...siteVideos];

  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} cta={page.cta} />
      {page.useSiteEvents ? <SiteEventsBlock /> : null}
      {!page.useSiteEvents && (page.events || []).length ? (
        <GatheringsUnique
          page={{ ...page, storyTitle: '', story: '', cta: null, videos: [] }}
        />
      ) : null}
      {(page.articles || []).length ? (
        <ReflectionsUnique page={{ ...page, storyTitle: '', story: '', cta: null }} />
      ) : null}
      <GalleryBlock gallery={page.gallery} />
      <VideosBlock
        videos={pageVideos}
        heading={page.useSiteVideos ? 'On YouTube' : 'Videos'}
      />
      {page.cta?.label && page.cta?.href && !page.story ? (
        <div className="wrap page-extras__cta" style={{ paddingBottom: '3rem' }}>
          <Link className="btn btn--solid" to={page.cta.href}>
            {page.cta.label}
          </Link>
        </div>
      ) : null}
    </>
  );
}
