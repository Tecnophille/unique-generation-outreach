import fs from 'fs';
import path from 'path';
import express from 'express';
import { createApiApp } from './app.js';
import { config, root } from './config.js';
import { dbMode } from './db/index.js';
import { ensureReady } from './boot.js';
import { getContent } from './services/contentService.js';

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

async function boot() {
  await ensureReady();

  const app = createApiApp();

  app.get('/robots.txt', (_req, res) => {
    const base = config.siteUrl || '';
    res.type('text/plain').send(
      ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /api/', '', `Sitemap: ${base}/sitemap.xml`, ''].join(
        '\n',
      ),
    );
  });

  app.get('/sitemap.xml', async (req, res, next) => {
    try {
      const base = (config.siteUrl || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
      const content = await getContent();
      const paths = new Set(CORE);
      Object.entries(content.pages || {}).forEach(([key, page]) => {
        if (!key || key === 'admin' || key === 'api') return;
        if (!isLivePage(page)) return;
        paths.add(`/${key}`);
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

  if (config.isProd) {
    if (!fs.existsSync(path.join(config.distDir, 'index.html'))) {
      throw new Error('Missing dist/ — run `npm run build` before starting production.');
    }
    app.use(
      express.static(config.distDir, {
        maxAge: '1y',
        immutable: true,
        index: false,
        setHeaders(res, filePath) {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      }),
    );
    app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(config.distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root,
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(config.port, config.host, () => {
    console.log(`UGO API + site on http://${config.host}:${config.port}`);
    console.log(`Mode: ${config.nodeEnv} · DB: ${dbMode()}`);
    if (config.useSupabaseStorage) console.log(`Media: Supabase Storage (${config.supabaseBucket})`);
    console.log(`Admin: /admin · ${config.defaultAdmin.email}`);
  });

  const shutdown = (signal) => {
    console.log(`[shutdown] ${signal}`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref?.();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

boot().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
