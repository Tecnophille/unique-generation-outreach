import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useContent } from '../cms/ContentContext';

export default function Nav() {
  const { content } = useContent();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const brand = content.brand;
  const nav = content.nav || [];
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(!isHome || window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome, location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const close = () => setOpen(false);
  const solid = !isHome || scrolled;

  return (
    <header className={`nav${solid ? ' is-scrolled' : ''}`}>
      <div className="wrap nav__inner">
        <Link className="nav__brand" to="/" onClick={close}>
          <img
            className="nav__logo"
            src="/logo.png"
            alt={brand.name}
            width={2090}
            height={527}
          />
        </Link>
        <nav aria-label="Primary">
          <ul className="nav__links">
            {nav.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`nav__mobile${open ? ' is-open' : ''}`}>
        {nav.map((item) => (
          <NavLink key={item.href} to={item.href} onClick={close}>
            {item.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
