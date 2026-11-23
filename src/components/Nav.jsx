import { useEffect, useState } from 'react';
import { brand, nav } from '../data/content';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap nav__inner">
        <a className="nav__brand" href="#top" onClick={close}>
          <span className="nav__mark" aria-hidden="true">
            <span>UG</span>
          </span>
          {brand.short}
        </a>
        <nav aria-label="Primary">
          <ul className="nav__links">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
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
          <a key={item.href} href={item.href} onClick={close}>
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
