import { isLivePage } from './publicRoutes.js';

/**
 * Shape CMS payload for unauthenticated public consumers.
 * Auth CMS routes should keep returning the full document.
 */
export function toPublicContent(raw = {}) {
  const content = structuredClone(raw);

  const pages = {};
  for (const [key, page] of Object.entries(content.pages || {})) {
    if (!key || key === 'admin' || key === 'api') continue;
    if (!isLivePage(page)) continue;
    pages[key] = page;
  }
  content.pages = pages;

  content.events = (content.events || []).filter(
    (e) => (e?.status || 'published') === 'published',
  );

  content.announcements = (content.announcements || []).filter((a) => a?.enabled && a?.text);
  content.redirects = (content.redirects || []).filter((r) => r?.enabled !== false && r?.from && r?.to);

  const liveHrefs = new Set(['/', ...Object.keys(pages).map((k) => `/${k}`)]);
  content.nav = (content.nav || []).filter((item) => {
    const href = String(item?.href || '').split('?')[0].split('#')[0] || '/';
    if (href.startsWith('http')) return true;
    return liveHrefs.has(href.replace(/\/+$/, '') || '/');
  });

  return content;
}
