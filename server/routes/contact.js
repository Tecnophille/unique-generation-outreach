import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { createMessage, listMessages, markRead } from '../services/contactService.js';

const router = Router();

router.post('/contact', async (req, res, next) => {
  try {
    const saved = await createMessage(req.body || {});
    res.status(201).json({ ok: true, id: saved.id });
  } catch (err) {
    next(err);
  }
});

router.get('/contact/messages', authRequired, async (req, res, next) => {
  try {
    res.json(await listMessages(req.query.limit));
  } catch (err) {
    next(err);
  }
});

router.post('/contact/messages/:id/read', authRequired, async (req, res, next) => {
  try {
    const row = await markRead(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

export default router;
