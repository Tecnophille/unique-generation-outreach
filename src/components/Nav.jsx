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

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);
  const solid = !isHome || scrolled;

  return (
    <header className={`nav${solid ? ' is-scrolled' : ''}${open ? ' is-menu-open' : ''}`}>
      {open ? (
        <button
          type="button"
          className="nav__backdrop"
          aria-label="Close menu"
          onClick={close}
        />
      ) : null}
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
              <li key={`${item.href}-${item.label}`}>
                <NavLink
                  to={item.href || '/'}
                  end={item.href === '/' || item.href === ''}
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
          className={`nav__toggle${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-controls="site-mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div
        id="site-mobile-nav"
        className={`nav__mobile${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        {nav.map((item) => (
          <NavLink
            key={`${item.href}-${item.label}`}
            to={item.href || '/'}
            end={item.href === '/' || item.href === ''}
            onClick={close}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
