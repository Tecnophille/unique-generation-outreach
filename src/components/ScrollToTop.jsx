import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SPA navigations keep the previous scroll offset by default — so landing
 * on a new marketing page while scrolled down feels like starting at the bottom.
 * Also force an *instant* jump: global `scroll-behavior: smooth` would otherwise
 * animate from the old offset and look like a whoosh up from the footer.
 */
export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el) {
        el.scrollIntoView({ block: 'start', behavior: 'auto' });
        html.style.scrollBehavior = previous;
        return;
      }
    }

    window.scrollTo(0, 0);
    html.scrollTop = 0;
    document.body.scrollTop = 0;

    // Keep smooth scrolling suppressed for a frame so late layout/paint
    // cannot restart a smooth animation from the old offset.
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      html.style.scrollBehavior = previous;
    });
  }, [pathname, hash, key]);

  return null;
}
