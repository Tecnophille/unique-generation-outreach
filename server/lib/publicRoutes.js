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
  '/events',
  '/resources',
];

export function normalizePublicPath(pathname) {
  const raw = String(pathname || '/').split('?')[0].split('#')[0];
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`;
  return withSlash.replace(/\/+$/, '') || '/';
}

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

/** Enabled CMS redirect sources — not canonical for sitemap. */
export function listRedirectSourcePaths(content) {
  const sources = new Set();
  for (const rule of content?.redirects || []) {
    if (rule?.enabled === false || !rule?.from || !rule?.to) continue;
    sources.add(normalizePublicPath(rule.from));
  }
  return sources;
}

/**
 * Whether a public URL should return HTTP 200 with the SPA shell.
 * Admin always allowed. Only published (or due scheduled) CMS pages otherwise.
 */
export function isPublicPathLive(pathname, content) {
  const path = normalizePublicPath(pathname);

  if (path === '/') return true;
  if (path === '/admin' || path.startsWith('/admin/')) return true;

  // Multi-segment public URLs are not used by this site.
  const segments = path.slice(1).split('/').filter(Boolean);
  if (segments.length !== 1) return false;

  const key = segments[0];
  if (key === 'api' || key === 'uploads') return false;

  // Let the SPA shell load so client RedirectHandler can navigate.
  // These paths are still excluded from sitemap (not canonical).
  if (listRedirectSourcePaths(content).has(path)) return true;

  return isLivePage(content?.pages?.[key]);
}

/**
 * Canonical public URLs for sitemap.xml.
 * Only published (or due scheduled) pages — never hardcoded dead hubs,
 * and never redirect sources (destination is the canonical URL).
 */
export function listLivePublicPaths(content) {
  const redirectSources = listRedirectSourcePaths(content);
  const paths = new Set();

  for (const p of CORE_PUBLIC_PATHS) {
    if (p !== '/' && !isLivePage(content?.pages?.[p.slice(1)])) continue;
    if (redirectSources.has(p)) continue;
    paths.add(p);
  }

  for (const [key, page] of Object.entries(content?.pages || {})) {
    if (!key || key === 'admin' || key === 'api') continue;
    if (!isLivePage(page)) continue;
    const path = `/${key}`;
    if (redirectSources.has(path)) continue;
    paths.add(path);
  }

  return [...paths].sort((a, b) => a.localeCompare(b));
}
