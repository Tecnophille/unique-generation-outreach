import { Link } from 'react-router-dom';

export default function PageExtras({ page }) {
  if (!page) return null;
  const highlights = page.highlights || [];
  const hasBody = Boolean(page.body);
  const hasCta = Boolean(page.cta?.label && page.cta?.href);

  if (!hasBody && highlights.length === 0 && !hasCta) return null;

  return (
    <section className="page-extras section section--tight">
      <div className="wrap">
        {hasBody ? (
          <div className="page-extras__body">
            {String(page.body)
              .split(/\n\n+/)
              .filter(Boolean)
              .map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
          </div>
        ) : null}

        {highlights.length > 0 ? (
          <div className="page-extras__grid">
            {highlights.map((item) => (
              <article key={item.title} className="page-extras__card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        ) : null}

        {hasCta ? (
          <div className="page-extras__cta">
            <Link className="btn btn--solid" to={page.cta.href}>
              {page.cta.label}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
