import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SPA navigations keep the previous scroll offset by default — so landing
 * on a new marketing page while scrolled down feels like starting at the bottom.
 */
export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el) {
        el.scrollIntoView({ block: 'start' });
        return;
      }
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, hash, key]);

  return null;
}
