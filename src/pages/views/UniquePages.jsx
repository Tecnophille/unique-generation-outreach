import { Link } from 'react-router-dom';
import { useContent } from '../../cms/ContentContext';
import TeamAvatar from '../../components/TeamAvatar';
import { InView, Stagger, StaggerItem } from '../../components/motion';

function StoryBlock({ title, story, cta }) {
  if (!story && !title) return null;
  return (
    <section className="uniq-story section section--tight">
      <InView className="wrap uniq-story__inner" amount={0.35}>
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
      </InView>
    </section>
  );
}

function QuoteBlock({ quote }) {
  if (!quote?.text) return null;
  return (
    <section className="uniq-quote">
      <InView className="wrap" amount={0.4}>
        <blockquote>
          <p>“{quote.text}”</p>
          {quote.attribution ? <cite>— {quote.attribution}</cite> : null}
        </blockquote>
      </InView>
    </section>
  );
}

function SectionHeading({ children }) {
  return (
    <InView as="h2" className="uniq-heading" amount={0.6}>
      {children}
    </InView>
  );
}

export function AboutUnique({ page }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <QuoteBlock quote={page.quote} />
      <section className="section section--tight">
        <div className="wrap">
          <SectionHeading>Milestones of the mission</SectionHeading>
          <Stagger className="uniq-milestones">
            {(page.milestones || []).map((m) => (
              <StaggerItem as="article" key={m.year}>
                <span>{m.year}</span>
                <p>{m.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <SectionHeading>Life around the mission</SectionHeading>
          <Stagger className="uniq-gallery">
            {(page.gallery || []).map((g) => (
              <StaggerItem as="figure" key={g.src}>
                <img src={g.src} alt={g.caption || ''} />
                {g.caption ? <figcaption>{g.caption}</figcaption> : null}
              </StaggerItem>
            ))}
          </Stagger>
          {page.cta ? (
            <InView className="page-extras__cta" delay={0.08}>
              <Link className="btn btn--solid" to={page.cta.href}>
                {page.cta.label}
              </Link>
            </InView>
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
        <Stagger className="wrap uniq-pillar-list">
          {(page.items || []).map((item, i) => (
            <StaggerItem as="article" key={item.title} className="uniq-pillar">
              <div className="uniq-pillar__index">0{i + 1}</div>
              <div>
                <h3>{item.title}</h3>
                <p className="uniq-pillar__lead">{item.text}</p>
                <p>{item.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        {page.cta ? (
          <InView className="wrap page-extras__cta" delay={0.08}>
            <Link className="btn btn--solid" to={page.cta.href}>
              {page.cta.label}
            </Link>
          </InView>
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
        <Stagger className="wrap uniq-events">
          {(page.events || []).map((ev) => (
            <StaggerItem as="article" key={ev.name} className="uniq-event">
              <div className="uniq-event__media">
                <img src={ev.image} alt="" />
              </div>
              <div className="uniq-event__body">
                <span className="tag">GHP {ev.year}</span>
                <h3>{ev.name}</h3>
                <p className="uniq-event__theme">{ev.theme}</p>
                <p>{ev.story}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        {page.cta ? (
          <InView className="wrap page-extras__cta" delay={0.08}>
            <Link className="btn btn--solid" to={page.cta.href}>
              {page.cta.label}
            </Link>
          </InView>
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
        <Stagger className="wrap uniq-articles">
          {(page.articles || []).map((a) => (
            <StaggerItem as="article" key={a.title} className="uniq-article">
              <div className="reflection__date">{a.date}</div>
              <h3>{a.title}</h3>
              {String(a.body || '')
                .split(/\n\n+/)
                .filter(Boolean)
                .map((p) => (
                  <p key={p.slice(0, 28)}>{p}</p>
                ))}
            </StaggerItem>
          ))}
        </Stagger>
        {page.cta ? (
          <InView className="wrap page-extras__cta" delay={0.08}>
            <Link className="btn btn--solid" to={page.cta.href}>
              {page.cta.label}
            </Link>
          </InView>
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
          <Stagger className="page-extras__grid">
            {(page.focus || []).map((f) => (
              <StaggerItem as="article" key={f.title} className="page-extras__card">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <SectionHeading>The team</SectionHeading>
          {convener ? (
            <InView as="article" className="leader leader-featured" style={{ marginTop: '1.5rem' }}>
              <TeamAvatar person={convener} large />
              <div>
                <div className="leader__role">{convener.role}</div>
                <h3>{convener.name}</h3>
                <p className="leader__titles">{convener.titles}</p>
                <p>{convener.bio}</p>
              </div>
            </InView>
          ) : null}
          <Stagger className="team-grid" style={{ marginTop: '1.5rem' }}>
            {rest.map((person) => (
              <StaggerItem as="article" key={person.name} className="leader team-card">
                <TeamAvatar person={person} />
                <div>
                  <div className="leader__role">{person.role}</div>
                  <h3>{person.name}</h3>
                  <p className="leader__titles">{person.titles}</p>
                  {person.location ? <p className="leader__location">{person.location}</p> : null}
                  <p>{person.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          {page.cta ? (
            <InView className="page-extras__cta" delay={0.08}>
              <Link className="btn btn--solid" to={page.cta.href}>
                {page.cta.label}
              </Link>
            </InView>
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
          <Stagger className="faq-list">
            {faqs.map((item) => (
              <StaggerItem as="details" key={item.q} className="faq-item">
                <summary>
                  {item.q}
                  <span className="faq-item__plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="faq-item__body">{item.a}</p>
              </StaggerItem>
            ))}
          </Stagger>
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
        <Stagger className="wrap page-extras__grid">
          {(page.channels || []).map((c) => (
            <StaggerItem as="article" key={c.title} className="page-extras__card">
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}

function youtubeId(url) {
  const m = String(url || '').match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|v=)([\w-]{11})/,
  );
  return m?.[1] || '';
}

function VideosBlock({ videos, heading = 'Videos', showEmpty = false }) {
  const list = (videos || []).filter((v) => youtubeId(v.url));
  if (!list.length) {
    if (!showEmpty) return null;
    return (
      <section className="section">
        <InView className="wrap site-empty">
          <h2>Videos coming soon</h2>
          <p>
            We’re gathering messages and moments from Unique Generation Outreach. Subscribe on the
            contact page to hear when new videos go live.
          </p>
          <div className="site-empty__actions">
            <Link className="btn btn--solid" to="/contact">
              Stay in touch
            </Link>
            <Link className="btn btn--outline" to="/reflections">
              Read reflections
            </Link>
          </div>
        </InView>
      </section>
    );
  }
  return (
    <section className="section">
      <div className="wrap">
        <SectionHeading>{heading}</SectionHeading>
        <Stagger className="uniq-videos">
          {list.map((v) => {
            const id = youtubeId(v.url);
            return (
              <StaggerItem as="article" key={v.id || v.url} className="uniq-video">
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
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

function GalleryBlock({ gallery }) {
  if (!gallery?.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        <SectionHeading>Gallery</SectionHeading>
        <Stagger className="uniq-gallery">
          {gallery.map((g) => (
            <StaggerItem as="figure" key={g.src}>
              <img src={g.src} alt={g.caption || ''} />
              {g.caption ? <figcaption>{g.caption}</figcaption> : null}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function SiteEventsBlock() {
  const { content } = useContent();
  const events = (content.events || []).filter((e) => (e.status || 'published') === 'published');
  if (!events.length) {
    return (
      <section className="section">
        <InView className="wrap site-empty">
          <h2>Events are coming soon</h2>
          <p>
            We’re preparing the next gatherings and outreaches. Check back shortly, or reach out if
            you’d like to partner with Unique Generation Outreach.
          </p>
          <div className="site-empty__actions">
            <Link className="btn btn--solid" to="/contact">
              Contact us
            </Link>
            <Link className="btn btn--outline" to="/gatherings">
              Read gathering stories
            </Link>
          </div>
        </InView>
      </section>
    );
  }
  return (
    <section className="section">
      <Stagger className="wrap uniq-events">
        {events.map((ev) => (
          <StaggerItem as="article" key={ev.id || ev.title} className="uniq-event">
            {ev.image ? (
              <div className="uniq-event__media">
                <img src={ev.image} alt="" />
              </div>
            ) : null}
            <div className="uniq-event__body">
              {ev.category ? <span className="tag">{ev.category}</span> : null}
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
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function PageBlocks({ blocks }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((block) => {
        if (block.type === 'richtext') {
          return <StoryBlock key={block.id} title={block.title} story={block.body} />;
        }
        if (block.type === 'quote') {
          return <QuoteBlock key={block.id} quote={block} />;
        }
        if (block.type === 'gallery') {
          return <GalleryBlock key={block.id} gallery={block.items} />;
        }
        if (block.type === 'video') {
          return <VideosBlock key={block.id} videos={[block]} heading={block.title || 'Video'} />;
        }
        if (block.type === 'cta') {
          return (
            <section key={block.id} className="section section--tight">
              <InView className="wrap uniq-cta-block">
                {block.title ? <h2>{block.title}</h2> : null}
                {block.text ? <p>{block.text}</p> : null}
                {block.label && block.href ? (
                  <Link className="btn btn--solid" to={block.href}>
                    {block.label}
                  </Link>
                ) : null}
              </InView>
            </section>
          );
        }
        if (block.type === 'stats') {
          return (
            <section key={block.id} className="section section--tight">
              <Stagger className="wrap uniq-stats">
                {(block.items || []).map((item, i) => (
                  <StaggerItem as="article" key={i}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          );
        }
        if (block.type === 'embed' && block.html) {
          return (
            <section key={block.id} className="section section--tight">
              <InView
                className="wrap uniq-embed"
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            </section>
          );
        }
        return null;
      })}
    </>
  );
}

function SiteResourcesBlock() {
  const { content } = useContent();
  const resources = content.resources || [];
  if (!resources.length) {
    return (
      <section className="section">
        <InView className="wrap site-empty">
          <h2>Resources are on the way</h2>
          <p>
            Guides and downloads will appear here as they’re published. Meanwhile, explore the
            mission story or get in touch.
          </p>
          <div className="site-empty__actions">
            <Link className="btn btn--solid" to="/about">
              Our story
            </Link>
            <Link className="btn btn--outline" to="/contact">
              Contact us
            </Link>
          </div>
        </InView>
      </section>
    );
  }
  return (
    <section className="section">
      <Stagger className="wrap uniq-resources">
        {resources.map((r) => (
          <StaggerItem as="article" key={r.id || r.title} className="uniq-resource">
            {r.cover ? <img src={r.cover} alt="" /> : null}
            <div>
              {r.category ? <span className="tag">{r.category}</span> : null}
              <h3>{r.title}</h3>
              {r.description ? <p>{r.description}</p> : null}
              {r.url ? (
                <p>
                  <a className="btn btn--solid" href={r.url} target="_blank" rel="noreferrer">
                    Open / download
                  </a>
                </p>
              ) : null}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
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
      <PageBlocks blocks={page.blocks} />
      {page.useSiteEvents ? <SiteEventsBlock /> : null}
      {page.useSiteResources ? <SiteResourcesBlock /> : null}
      {!page.useSiteEvents && (page.events || []).length ? (
        <GatheringsUnique page={{ ...page, storyTitle: '', story: '', cta: null, videos: [] }} />
      ) : null}
      {(page.articles || []).length ? (
        <ReflectionsUnique page={{ ...page, storyTitle: '', story: '', cta: null }} />
      ) : null}
      <GalleryBlock gallery={page.gallery} />
      <VideosBlock
        videos={pageVideos}
        heading={page.useSiteVideos ? 'On YouTube' : 'Videos'}
        showEmpty={Boolean(page.useSiteVideos)}
      />
      {page.cta?.label && page.cta?.href && !page.story ? (
        <InView className="wrap page-extras__cta" style={{ paddingBottom: '3rem' }}>
          <Link className="btn btn--solid" to={page.cta.href}>
            {page.cta.label}
          </Link>
        </InView>
      ) : null}
    </>
  );
}
