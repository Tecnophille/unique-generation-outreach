import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import mediaRoutes from './routes/media.js';
import pagesRoutes from './routes/pages.js';
import contactRoutes from './routes/contact.js';

export function createApiApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '6mb' }));
  app.use(cookieParser());
  app.use('/uploads', express.static(config.uploadsDir));

  app.use('/api', healthRoutes);
  app.use('/api', authRoutes);
  app.use('/api', contentRoutes);
  app.use('/api', pagesRoutes);
  app.use('/api', mediaRoutes);
  app.use('/api', contactRoutes);

  app.use((err, _req, res, _next) => {
    console.error('[api]', err);
    res.status(err.status || 500).json({
      error: err.message || 'Server error',
    });
  });

  return app;
}
