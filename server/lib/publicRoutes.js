/** Shared live-route checks for sitemap, SPA 404, and Express fallback. */

export const CORE_PUBLIC_PATHS = [
  '/',
  '/about',
  '/pillars',
  '/gatherings',
  '/reflections',
  '/leadership',
  '/faq',
  '/contact',
  '/videos',
];

export function isLivePage(page) {
  if (!page) return false;
  const status = page.status || 'published';
  if (status === 'published') return true;
  if (status === 'scheduled' && page.publishAt) {
    const t = Date.parse(page.publishAt);
    return !Number.isNaN(t) && t <= Date.now();
  }
  return false;
}

/**
 * Whether a public URL should return HTTP 200 with the SPA shell.
 * Admin always allowed. Only published (or due scheduled) CMS pages otherwise.
 */
export function isPublicPathLive(pathname, content) {
  const raw = String(pathname || '/').split('?')[0].split('#')[0];
  const path = raw.replace(/\/+$/, '') || '/';

  if (path === '/') return true;
  if (path === '/admin' || path.startsWith('/admin/')) return true;

  // Multi-segment public URLs are not used by this site.
  const segments = path.slice(1).split('/').filter(Boolean);
  if (segments.length !== 1) return false;

  const key = segments[0];
  if (key === 'api' || key === 'uploads') return false;

  return isLivePage(content?.pages?.[key]);
}

export function listLivePublicPaths(content) {
  const paths = new Set(CORE_PUBLIC_PATHS.filter((p) => p === '/' || isLivePage(content?.pages?.[p.slice(1)])));
  Object.entries(content?.pages || {}).forEach(([key, page]) => {
    if (!key || key === 'admin' || key === 'api') return;
    if (!isLivePage(page)) return;
    paths.add(`/${key}`);
  });
  return [...paths].sort((a, b) => a.localeCompare(b));
}
