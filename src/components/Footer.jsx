import { Link } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';

export default function Footer() {
  const { content } = useContent();
  const { brand, nav } = content;

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
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', maxWidth: '16rem' }}>
              Unity · Empowerment · Opportunities · Transformation
            </p>
          </div>
          <div>
            <h4>Follow us</h4>
            <ul>
              <li>
                <Link to="/contact">Social links coming soon</Link>
              </li>
              <li>
                <Link to="/contact">Volunteer with us</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/pillars">Unity</Link>
              </li>
              <li>
                <Link to="/pillars">Empowerment</Link>
              </li>
              <li>
                <Link to="/gatherings">Gatherings</Link>
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
        <p className="footer__copy">
          Copyright {new Date().getFullYear()} · {brand.name}
        </p>
      </div>
    </footer>
  );
}
