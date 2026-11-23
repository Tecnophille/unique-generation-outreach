import { useContent } from '../cms/ContentContext';

export function TestimonialsStrip() {
  const { content } = useContent();
  const items = (content?.testimonials || []).filter((t) => t.featured !== false && t.quote);
  if (!items.length) return null;
  return (
    <section className="section social-proof">
      <div className="wrap">
        <h2 className="uniq-heading">Voices with us</h2>
        <div className="social-proof__grid">
          {items.map((t) => (
            <article key={t.id || t.name} className="social-proof__card">
              <p>“{t.quote}”</p>
              <footer>
                {t.image ? <img src={t.image} alt="" /> : null}
                <div>
                  <strong>{t.name}</strong>
                  {t.role ? <span>{t.role}</span> : null}
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PartnersStrip() {
  const { content } = useContent();
  const items = (content?.partners || []).filter((p) => p.name || p.logo);
  if (!items.length) return null;
  return (
    <section className="section section--tight partners-strip">
      <div className="wrap">
        <h2 className="uniq-heading">Partners</h2>
        <div className="partners-strip__grid">
          {items.map((p) => {
            const body = (
              <>
                {p.logo ? <img src={p.logo} alt={p.name || 'Partner'} /> : <strong>{p.name}</strong>}
              </>
            );
            return p.url ? (
              <a key={p.id || p.name} className="partners-strip__item" href={p.url} target="_blank" rel="noreferrer">
                {body}
              </a>
            ) : (
              <div key={p.id || p.name} className="partners-strip__item">
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FeaturedEventsStrip() {
  const { content } = useContent();
  const items = (content?.events || [])
    .filter((e) => e.featured && (e.status || 'published') === 'published')
    .slice(0, 3);
  if (!items.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="uniq-heading">Featured events</h2>
        <div className="uniq-events">
          {items.map((ev) => (
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
