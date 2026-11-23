import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';

export default function Footer() {
  const { content } = useContent();
  const { brand, nav, social, footer } = content;
  const socialLinks = [
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'twitter', label: 'X / Twitter' },
  ].filter((s) => social?.[s.key]);

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
          </div>
          <div>
            <h4>Follow us</h4>
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
                  <Link to="/contact">Connect with us</Link>
                </li>
              )}
              <li>
                <Link to="/contact">Volunteer with us</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/pillars">Pillars</Link>
              </li>
              <li>
                <Link to="/gatherings">Gatherings</Link>
              </li>
              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                <Link to="/videos">Videos</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Pages</h4>
            <ul>
              {(nav || []).map((item) => (
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
