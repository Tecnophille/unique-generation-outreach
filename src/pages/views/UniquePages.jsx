import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../cms/ContentContext';
import { mediaAlt, slugifyAnchor } from '../../cms/mediaAlt';
import TeamAvatar from '../../components/TeamAvatar';
import ExpandableText from '../../components/ExpandableText';
import YouTubeEmbed, { youtubeId } from '../../components/YouTubeEmbed';
import { topicFromChannelTitle, topicQueryValue } from '../../components/Contact';
import { InView, Stagger, StaggerItem } from '../../components/motion';

/** Same .wrap left edge as page story / page hero; prose measure via --prose. */
function ContentColumn({ children, className = '', amount = 0.35, as: Comp = InView }) {
  const classes = ['wrap', 'page-blocks__column', className].filter(Boolean).join(' ');
  if (Comp === 'div') {
    return <div className={classes}>{children}</div>;
  }
  return (
    <Comp className={classes} amount={amount}>
      {children}
    </Comp>
  );
}

/** Full page wrap for multi-column grids (gallery / stats). */
function ContentWrap({ children, className = '' }) {
  return <div className={['wrap', className].filter(Boolean).join(' ')}>{children}</div>;
}

function StoryBlock({ title, story, cta }) {
  if (!story && !title) return null;
  return (
    <section className="uniq-story section section--tight">
      <InView className="wrap uniq-story__inner page-blocks__column" amount={0.35}>
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
    <section className="uniq-quote page-blocks__section--quote">
      <ContentColumn amount={0.4}>
        <blockquote className="page-blocks__quote">
          <p>“{quote.text}”</p>
          {quote.attribution ? <cite>— {quote.attribution}</cite> : null}
        </blockquote>
      </ContentColumn>
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

export function AboutUnique({ page, pageKey = 'about' }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <PageBlocks blocks={page.blocks} />
      <QuoteBlock quote={page.quote} />
      {(page.milestones || []).length ? (
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
      ) : null}
      {(page.gallery || []).length ? (
        <section className="section section--tight">
          <div className="wrap">
            <SectionHeading>Life around the mission</SectionHeading>
            <Stagger className="uniq-gallery">
              {(page.gallery || []).map((g) => (
                <StaggerItem as="figure" key={g.src}>
                  <img src={g.src} alt={mediaAlt(g, 'Mission gallery photo')} />
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
      ) : page.cta ? (
        <InView className="wrap page-extras__cta" style={{ paddingBottom: '2.5rem' }}>
          <Link className="btn btn--solid" to={page.cta.href}>
            {page.cta.label}
          </Link>
        </InView>
      ) : null}
      <PageVideos page={page} pageKey={pageKey} />
    </>
  );
}

export function PillarsUnique({ page, pageKey = 'pillars' }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <PageBlocks blocks={page.blocks} />
      <section className="section section--tight">
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
      <PageVideos page={page} pageKey={pageKey} />
    </>
  );
}

export function GatheringsUnique({ page, pageKey = 'gatherings', includePageVideos = true }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <PageBlocks blocks={page.blocks} />
      <section className="section section--tight">
        <Stagger className="wrap uniq-events">
          {(page.events || []).map((ev) => (
            <StaggerItem as="article" key={ev.name} className="uniq-event">
              <div className="uniq-event__media">
                <img
                  src={ev.image}
                  alt={mediaAlt(ev, `${ev.name || 'Gathering'} photo`)}
                  style={
                    ev.imagePosition
                      ? { objectPosition: ev.imagePosition }
                      : undefined
                  }
                />
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
      {includePageVideos ? <PageVideos page={page} pageKey={pageKey} /> : null}
    </>
  );
}

function ReflectionArticleCard({ article }) {
  const paras = String(article.body || '')
    .split(/\n\n+/)
    .filter(Boolean);
  const teaser = paras[0] || '';
  const rest = paras.slice(1);
  const needsExpand = rest.length > 0 || teaser.length > 240;
  const [open, setOpen] = useState(false);
  const anchor = slugifyAnchor(article.title) || 'reflection';
  const panelId = `${anchor}-body`;

  return (
    <StaggerItem as="article" id={anchor} className="uniq-article">
      <div className="reflection__date">{article.date}</div>
      <h3>
        <a className="uniq-article__anchor" href={`#${anchor}`}>
          {article.title}
        </a>
      </h3>
      {open || !needsExpand ? (
        <div id={panelId}>
          {paras.map((p) => (
            <p key={p.slice(0, 28)}>{p}</p>
          ))}
        </div>
      ) : (
        <p id={panelId}>{teaser.length > 240 ? `${teaser.slice(0, 240).replace(/\s+\S*$/, '').trimEnd()}…` : teaser}</p>
      )}
      {needsExpand ? (
        <button
          type="button"
          className="expandable__toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Show less' : 'Read more'}
        </button>
      ) : null}
    </StaggerItem>
  );
}

export function ReflectionsUnique({ page, pageKey = 'reflections' }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <PageBlocks blocks={page.blocks} />
      <section className="section section--tight">
        <Stagger className="wrap uniq-articles">
          {(page.articles || []).map((a) => (
            <ReflectionArticleCard key={a.title} article={a} />
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
      <PageVideos page={page} pageKey={pageKey} />
    </>
  );
}

export function LeadershipUnique({ page, pageKey = 'leadership' }) {
  const { content } = useContent();
  const team = content.leadership || [];
  const [convener, ...rest] = team;

  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <PageBlocks blocks={page.blocks} />
      {(page.focus || []).length ? (
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
      ) : null}
      <section className="section section--tight">
        <div className="wrap">
          <SectionHeading>The team</SectionHeading>
          {convener ? (
            <InView as="article" className="leader leader-featured" style={{ marginTop: '1.5rem' }}>
              <TeamAvatar person={convener} large />
              <div>
                <div className="leader__role">{convener.role}</div>
                <h3>{convener.name}</h3>
                <p className="leader__titles">{convener.titles}</p>
                <ExpandableText text={convener.bio} limit={280} />
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
                  <ExpandableText text={person.bio} limit={160} />
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
      <PageVideos page={page} pageKey={pageKey} />
    </>
  );
}

export function FaqUnique({ page, pageKey = 'faq' }) {
  const { content } = useContent();
  const faqs = content.faqs || [];
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} cta={page.cta} />
      <PageBlocks blocks={page.blocks} />
      <section className="section section--tight">
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
      <PageVideos page={page} pageKey={pageKey} />
    </>
  );
}

export function ContactUnique({ page, pageKey = 'contact' }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} />
      <PageBlocks blocks={page.blocks} />
      {(page.channels || []).length ? (
        <section className="section section--tight">
          <Stagger className="wrap page-extras__grid">
            {(page.channels || []).map((c) => {
              const topic = topicFromChannelTitle(c.title);
              const to = `/contact?topic=${topicQueryValue(topic)}#enquiry`;
              return (
                <StaggerItem as="article" key={c.title} className="page-extras__card page-extras__card--action">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <Link className="page-extras__card-link" to={to}>
                    Start this enquiry
                    <span aria-hidden="true"> →</span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>
      ) : null}
      <PageVideos page={page} pageKey={pageKey} />
    </>
  );
}

export function resolvePageVideos(page, content, pageKey) {
  const includeSite = pageKey === 'videos' || page?.useSiteVideos === true;
  const pageVideos = (page?.videos || []).filter((v) => youtubeId(v?.url));
  const siteVideos = includeSite ? content?.videos || [] : [];
  const seen = new Set();
  const videos = [];
  for (const v of [...pageVideos, ...siteVideos]) {
    const key = String(v?.url || v?.id || '').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    videos.push(v);
  }
  return { videos, includeSite };
}

/** Site-wide YouTube studio library + optional per-page embeds. */
export function PageVideos({ page, pageKey }) {
  const { content } = useContent();
  const { videos, includeSite } = resolvePageVideos(page, content, pageKey);
  return (
    <VideosBlock
      videos={videos}
      heading={includeSite ? 'On YouTube' : 'Videos'}
      showEmpty={includeSite && pageKey === 'videos'}
    />
  );
}

function VideosBlock({ videos, heading = 'Videos', showEmpty = false }) {
  const list = (videos || []).filter((v) => youtubeId(v.url));
  if (!list.length) {
    if (!showEmpty) return null;
    return (
      <section className="page-blocks__section">
        <ContentColumn className="site-empty">
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
        </ContentColumn>
      </section>
    );
  }
  const single = list.length === 1;
  const body = (
    <>
      <SectionHeading>{heading}</SectionHeading>
      <Stagger className={`uniq-videos${single ? ' uniq-videos--single' : ''}`}>
        {list.map((v) => (
          <StaggerItem as="article" key={v.id || v.url} className="uniq-video">
            <YouTubeEmbed url={v.url} title={v.title} />
            {v.title ? <h3>{v.title}</h3> : null}
            {v.description ? <p>{v.description}</p> : null}
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
  return (
    <section className="page-blocks__section">
      {single ? <ContentColumn as="div">{body}</ContentColumn> : <ContentWrap>{body}</ContentWrap>}
    </section>
  );
}

function GalleryBlock({ gallery, heading }) {
  const items = (gallery || []).filter((g) => g?.src);
  if (!items.length) return null;
  const single = items.length === 1;
  const body = (
    <>
      {heading ? <SectionHeading>{heading}</SectionHeading> : null}
      <Stagger className="uniq-gallery">
        {items.map((g) => (
          <StaggerItem as="figure" key={g.src}>
            <img src={g.src} alt={mediaAlt(g, 'Gallery photo')} />
            {g.caption ? <figcaption>{g.caption}</figcaption> : null}
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
  return (
    <section className="page-blocks__section">
      {single ? <ContentColumn as="div">{body}</ContentColumn> : <ContentWrap>{body}</ContentWrap>}
    </section>
  );
}

function SiteEventsBlock() {
  const { content } = useContent();
  const events = (content.events || []).filter((e) => (e.status || 'published') === 'published');
  if (!events.length) {
    return (
      <section className="page-blocks__section">
        <ContentColumn className="site-empty">
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
        </ContentColumn>
      </section>
    );
  }
  return (
    <section className="page-blocks__section">
      <ContentWrap>
        <Stagger className="uniq-events">
          {events.map((ev) => (
            <StaggerItem as="article" key={ev.id || ev.title} className="uniq-event">
              {ev.image ? (
                <div className="uniq-event__media">
                  <img
                    src={ev.image}
                    alt={mediaAlt(ev, `${ev.title || 'Event'} photo`)}
                    style={
                      ev.imagePosition ? { objectPosition: ev.imagePosition } : undefined
                    }
                  />
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
      </ContentWrap>
    </section>
  );
}

function blockHasContent(block) {
  if (!block?.type) return false;
  switch (block.type) {
    case 'richtext':
      return Boolean(block.title?.trim() || block.body?.trim());
    case 'quote':
      return Boolean(block.text?.trim());
    case 'gallery':
      return (block.items || []).some((g) => g?.src);
    case 'video':
      return Boolean(youtubeId(block.url));
    case 'cta':
      return Boolean(block.title?.trim() || block.text?.trim() || (block.label && block.href));
    case 'stats':
      return (block.items || []).some((i) => i?.value || i?.label);
    case 'embed':
      return Boolean(block.html?.trim());
    default:
      return false;
  }
}

/** Resolve CMS layout slot against the existing column / full-wrap bands. */
function BlockSlot({ block, preferWide = false, staticColumn = false, children }) {
  const layout = block?.layout || 'auto';
  const wide = layout === 'wide' || (layout === 'auto' && preferWide);
  if (wide) return <ContentWrap>{children}</ContentWrap>;
  if (staticColumn) return <ContentColumn as="div">{children}</ContentColumn>;
  return <ContentColumn>{children}</ContentColumn>;
}

/**
 * Every CMS block type shares ContentColumn (same 44rem band as the page story)
 * unless it is a multi-item grid (gallery/stats) that needs the full wrap —
 * or the editor picks an explicit layout slot.
 */
export function PageBlocks({ blocks }) {
  const list = (blocks || []).filter(blockHasContent);
  if (!list.length) return null;

  return (
    <div className="page-blocks" aria-label="Page content">
      {list.map((block) => {
        if (block.type === 'richtext') {
          return (
            <section key={block.id} className="page-blocks__section">
              <BlockSlot block={block}>
                {block.title ? <h2 className="uniq-heading">{block.title}</h2> : null}
                {String(block.body || '')
                  .split(/\n\n+/)
                  .filter(Boolean)
                  .map((p) => (
                    <p key={p.slice(0, 32)} className="page-blocks__prose">
                      {p}
                    </p>
                  ))}
              </BlockSlot>
            </section>
          );
        }

        if (block.type === 'quote') {
          return (
            <section key={block.id} className="page-blocks__section page-blocks__section--quote">
              <BlockSlot block={block}>
                <blockquote className="page-blocks__quote">
                  <p>“{block.text}”</p>
                  {block.attribution ? <cite>— {block.attribution}</cite> : null}
                </blockquote>
              </BlockSlot>
            </section>
          );
        }

        if (block.type === 'gallery') {
          const items = (block.items || []).filter((g) => g?.src);
          const single = items.length === 1;
          const body = (
            <Stagger className="uniq-gallery">
              {items.map((g) => (
                <StaggerItem as="figure" key={g.src}>
                  <img src={g.src} alt={mediaAlt(g, 'Gallery photo')} />
                  {g.caption ? <figcaption>{g.caption}</figcaption> : null}
                </StaggerItem>
              ))}
            </Stagger>
          );
          return (
            <section key={block.id} className="page-blocks__section">
              <BlockSlot block={block} preferWide={!single} staticColumn>
                {body}
              </BlockSlot>
            </section>
          );
        }

        if (block.type === 'video') {
          return (
            <section key={block.id} className="page-blocks__section">
              <BlockSlot block={block}>
                {block.title ? <h2 className="uniq-heading">{block.title}</h2> : null}
                <article className="uniq-video">
                  <YouTubeEmbed url={block.url} title={block.title} />
                </article>
              </BlockSlot>
            </section>
          );
        }

        if (block.type === 'cta') {
          return (
            <section key={block.id} className="page-blocks__section">
              <BlockSlot block={block}>
                <div className="uniq-cta-block">
                  {block.title ? <h2>{block.title}</h2> : null}
                  {block.text ? <p>{block.text}</p> : null}
                  {block.label && block.href ? (
                    <Link className="btn btn--solid" to={block.href}>
                      {block.label}
                    </Link>
                  ) : null}
                </div>
              </BlockSlot>
            </section>
          );
        }

        if (block.type === 'stats') {
          const items = (block.items || []).filter((item) => item?.value || item?.label);
          const narrow = items.length <= 2;
          const body = (
            <Stagger className="uniq-stats">
              {items.map((item, i) => (
                <StaggerItem as="article" key={i}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </StaggerItem>
              ))}
            </Stagger>
          );
          return (
            <section key={block.id} className="page-blocks__section">
              <BlockSlot block={block} preferWide={!narrow} staticColumn>
                {body}
              </BlockSlot>
            </section>
          );
        }

        if (block.type === 'embed') {
          return (
            <section key={block.id} className="page-blocks__section">
              <BlockSlot block={block}>
                <div className="uniq-embed" dangerouslySetInnerHTML={{ __html: block.html }} />
              </BlockSlot>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}

function SiteResourcesBlock() {
  const { content } = useContent();
  const resources = content.resources || [];
  if (!resources.length) {
    return (
      <section className="page-blocks__section">
        <ContentColumn className="site-empty">
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
        </ContentColumn>
      </section>
    );
  }
  return (
    <section className="page-blocks__section">
      <ContentWrap>
        <Stagger className="uniq-resources">
          {resources.map((r) => (
            <StaggerItem as="article" key={r.id || r.title} className="uniq-resource">
              {r.cover ? <img src={r.cover} alt={mediaAlt(r, `${r.title || 'Resource'} cover`)} /> : null}
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
      </ContentWrap>
    </section>
  );
}

/** Flexible layout for CMS-created pages and events/videos hubs. */
export function CustomPageUnique({ page, pageKey = 'custom' }) {
  return (
    <>
      <StoryBlock title={page.storyTitle} story={page.story} cta={page.cta} />
      <PageBlocks blocks={page.blocks} />
      {page.useSiteEvents ? <SiteEventsBlock /> : null}
      {page.useSiteResources ? <SiteResourcesBlock /> : null}
      {!page.useSiteEvents && (page.events || []).length ? (
        <GatheringsUnique
          page={{
            ...page,
            storyTitle: '',
            story: '',
            cta: null,
            blocks: [],
            videos: [],
            useSiteVideos: false,
          }}
          includePageVideos={false}
        />
      ) : null}
      {(page.articles || []).length ? (
        <ReflectionsUnique
          page={{ ...page, storyTitle: '', story: '', cta: null, blocks: [], useSiteVideos: false }}
        />
      ) : null}
      <GalleryBlock gallery={page.gallery} heading="Gallery" />
      <PageVideos page={page} pageKey={pageKey} />
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
