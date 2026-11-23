import { Router } from 'express';
import { dbMode, sql } from '../db/index.js';

const router = Router();

router.get('/health', async (_req, res, next) => {
  try {
    await sql('select 1 as ok');
    res.json({
      ok: true,
      service: 'ugo-cms-api',
      db: dbMode(),
      time: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
