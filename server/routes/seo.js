import { Router } from 'express';
import { config } from '../config.js';
import { getContent } from '../services/contentService.js';

const CORE = [
  '/',
  '/about',
  '/pillars',
  '/gatherings',
  '/reflections',
  '/leadership',
  '/faq',
  '/contact',
  '/events',
  '/videos',
  '/resources',
];

function isLivePage(page) {
  if (!page) return false;
  const status = page.status || 'published';
  if (status === 'published') return true;
  if (status === 'scheduled' && page.publishAt) {
    const t = Date.parse(page.publishAt);
    return !Number.isNaN(t) && t <= Date.now();
  }
  return false;
}

const router = Router();

router.get('/robots', (req, res) => {
  const base = (config.siteUrl || `${req.protocol}://${req.get('host')}` || '').replace(/\/$/, '');
  res
    .type('text/plain')
    .send(
      ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /api/', '', `Sitemap: ${base}/sitemap.xml`, ''].join(
        '\n',
      ),
    );
});

router.get('/sitemap', async (req, res, next) => {
  try {
    const base = (config.siteUrl || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const content = await getContent();
    const paths = new Set(CORE);
    Object.entries(content.pages || {}).forEach(([key, page]) => {
      if (!key || key === 'admin' || key === 'api') return;
      if (!isLivePage(page)) return;
      paths.add(`/${key}`);
    });
    (content.redirects || []).forEach((r) => {
      if (r?.enabled === false || !r?.from) return;
      // don't list redirect sources as canonical urls
    });

    const urls = [...paths]
      .sort((a, b) => a.localeCompare(b))
      .map((p) => `  <url><loc>${base}${p === '/' ? '/' : p}</loc></url>`)
      .join('\n');

    res
      .type('application/xml')
      .send(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
  } catch (err) {
    next(err);
  }
});

export default router;
