import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { securityHeaders, originGuard } from './middleware/security.js';
import { rateLimit } from './middleware/rateLimit.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import mediaRoutes from './routes/media.js';
import pagesRoutes from './routes/pages.js';
import contactRoutes from './routes/contact.js';

function corsOrigin(origin, callback) {
  if (!origin) return callback(null, true);
  if (!config.isProd) return callback(null, true);
  const allowed = new Set(config.corsOrigins);
  if (config.siteUrl) allowed.add(config.siteUrl);
  if (allowed.size === 0) return callback(null, true);
  if (allowed.has(origin)) return callback(null, true);
  // Reject without throwing — avoids a 500 from the cors package.
  return callback(null, false);
}

export function createApiApp() {
  const app = express();
  if (config.trustProxy) app.set('trust proxy', 1);

  app.disable('x-powered-by');
  app.use(securityHeaders);
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());
  app.use(originGuard);
  app.use(
    '/uploads',
    express.static(config.uploadsDir, {
      maxAge: config.isProd ? '7d' : 0,
      fallthrough: true,
    }),
  );

  app.use('/api/login', rateLimit({ windowMs: 15 * 60_000, max: 20, prefix: 'login' }));
  app.use('/api/contact', rateLimit({ windowMs: 15 * 60_000, max: 10, prefix: 'contact' }));
  app.use('/api/upload', rateLimit({ windowMs: 15 * 60_000, max: 30, prefix: 'upload' }));

  app.use('/api', healthRoutes);
  app.use('/api', authRoutes);
  app.use('/api', contentRoutes);
  app.use('/api', pagesRoutes);
  app.use('/api', mediaRoutes);
  app.use('/api', contactRoutes);

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use((err, _req, res, _next) => {
    console.error('[api]', err?.message || err);
    const status = err.status || err.statusCode || 500;
    const expose = status < 500 || !config.isProd;
    res.status(status).json({
      error: expose ? err.message || 'Server error' : 'Server error',
    });
  });

  return app;
}
