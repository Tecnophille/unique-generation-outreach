import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';

const EXTRA_EXPLORE = [
  { href: '/events', label: 'Events' },
  { href: '/videos', label: 'Videos' },
  { href: '/resources', label: 'Resources' },
];

function exploreLinks(nav = [], pages = {}) {
  const seen = new Set();
  const links = [];

  function push(href, label) {
    const path = String(href || '').split('?')[0].split('#')[0] || '/';
    if (!path.startsWith('/') || seen.has(path)) return;
    if (path !== '/' && !pages[path.slice(1)]) return;
    seen.add(path);
    links.push({ href: path, label: label || path.slice(1) });
  }

  push('/', 'Home');
  for (const item of nav) {
    if (item?.href) push(item.href, item.label);
  }
  for (const item of EXTRA_EXPLORE) {
    push(item.href, item.label);
  }
  return links;
}

export default function Footer() {
  const { content } = useContent();
  const { brand, nav, social, footer, contact, pages } = content;
  const socialLinks = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'twitter', label: 'X / Twitter' },
  ].filter((s) => social?.[s.key]);
  const email = (contact?.email || '').trim();
  const phone = (contact?.phone || '').trim();
  const tel = phone.replace(/[^\d+]/g, '');
  const explore = exploreLinks(nav, pages || {});

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <Link className="footer__brand" to="/">
              <img
                className="footer__logo"
                src="/logo.png"
                alt={brand.name}
                width={2090}
                height={527}
              />
            </Link>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', maxWidth: '18rem' }}>
              {footer?.blurb || 'Unity · Empowerment · Opportunities · Transformation'}
            </p>
            {(email || phone) && (
              <ul className="footer__contact">
                {email ? (
                  <li>
                    <a href={`mailto:${email}`}>{email}</a>
                  </li>
                ) : null}
                {phone ? (
                  <li>
                    <a href={tel ? `tel:${tel}` : undefined}>{phone}</a>
                  </li>
                ) : null}
              </ul>
            )}
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              {socialLinks.length ? (
                socialLinks.map((s) => (
                  <li key={s.key}>
                    <a href={social[s.key]} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))
              ) : (
                <li>
                  <Link to="/contact">Get in touch</Link>
                </li>
              )}
              <li>
                <Link to="/contact?topic=volunteering#enquiry">Volunteer with us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              {explore.map((item) => (
                <li key={item.href}>
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copy">
            {footer?.copyright ||
              `Copyright ${new Date().getFullYear()} · ${brand.name}`}
          </p>
          <button
            type="button"
            className="footer__to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Return to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
