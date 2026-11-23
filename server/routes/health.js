import { Router } from 'express';
import { config } from '../config.js';
import { dbMode, sql } from '../db/index.js';

const router = Router();
const startedAt = Date.now();

router.get('/health', async (_req, res, next) => {
  try {
    await sql('select 1 as ok');
    res.json({
      ok: true,
      service: 'ugo-cms-api',
      env: config.nodeEnv,
      vercel: config.onVercel,
      db: dbMode(),
      storage: config.useSupabaseStorage ? 'supabase' : 'local',
      uptimeSec: Math.round((Date.now() - startedAt) / 1000),
      time: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/ready', async (_req, res) => {
  try {
    await sql('select 1 as ok');
    res.json({ ready: true, db: dbMode() });
  } catch {
    res.status(503).json({ ready: false, db: dbMode() });
  }
});

export default router;
