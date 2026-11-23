import { createServer as createViteServer } from 'vite';
import { createApiApp } from './app.js';
import { config, root } from './config.js';
import { dbMode } from './db/index.js';
import { ensureAdmin, cleanupSessions } from './services/authService.js';
import { ensureContent } from './services/contentService.js';
import { ensureUploadsDir } from './services/mediaService.js';

async function boot() {
  ensureUploadsDir();
  await ensureAdmin();
  await ensureContent();
  await cleanupSessions();

  const app = createApiApp();

  if (process.env.NODE_ENV === 'production') {
    const path = await import('path');
    const express = (await import('express')).default;
    app.use(express.static(path.join(root, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(root, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      root,
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`UGO API + site on http://0.0.0.0:${config.port}`);
    console.log(`DB mode: ${dbMode()}`);
    console.log(`Admin: http://127.0.0.1:${config.port}/admin`);
    console.log(`Login: ${config.defaultAdmin.email} / (CMS_ADMIN_PASSWORD)`);
  });
}

boot().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
