import { Router } from 'express';
import { config } from '../config.js';
import { getContent } from '../services/contentService.js';
import { listLivePublicPaths } from '../lib/publicRoutes.js';

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
    const paths = listLivePublicPaths(content);

    const urls = paths
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
