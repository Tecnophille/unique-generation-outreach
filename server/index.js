import fs from 'fs';
import path from 'path';
import express from 'express';
import { createApiApp } from './app.js';
import { config, root, validateConfig } from './config.js';
import { dbMode } from './db/index.js';
import { ensureAdmin, cleanupSessions } from './services/authService.js';
import { ensureContent } from './services/contentService.js';
import { ensureUploadsDir } from './services/mediaService.js';

async function boot() {
  const warnings = validateConfig();
  for (const warning of warnings) console.warn(`[config] ${warning}`);

  ensureUploadsDir();
  await ensureAdmin();
  await ensureContent();
  await cleanupSessions();

  const app = createApiApp();

  const publicPaths = ['/', '/about', '/pillars', '/gatherings', '/reflections', '/leadership', '/faq', '/contact'];

  app.get('/robots.txt', (_req, res) => {
    const base = config.siteUrl || '';
    res.type('text/plain').send(
      ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /api/', '', `Sitemap: ${base}/sitemap.xml`, ''].join(
        '\n',
      ),
    );
  });

  app.get('/sitemap.xml', (req, res) => {
    const base = config.siteUrl || `${req.protocol}://${req.get('host')}`;
    const urls = publicPaths
      .map((p) => `  <url><loc>${base}${p === '/' ? '/' : p}</loc></url>`)
      .join('\n');
    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
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
