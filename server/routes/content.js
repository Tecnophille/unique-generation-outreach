import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  getContent,
  getRevision,
  listRevisions,
  restoreRevision,
  saveContent,
} from '../services/contentService.js';

const router = Router();

router.get('/content', async (_req, res, next) => {
  try {
    res.json(await getContent());
  } catch (err) {
    next(err);
  }
});

router.put('/content', authRequired, async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Invalid content payload' });
    }
    const note = String(req.body._revisionNote || req.headers['x-revision-note'] || 'CMS save');
    const payload = { ...req.body };
    delete payload._revisionNote;
    const saved = await saveContent(payload, req.admin.id, note);
    res.json(saved);
  } catch (err) {
    next(err);
  }
});

router.patch('/content/pages/:pageKey', authRequired, async (req, res, next) => {
  try {
    const current = await getContent();
    const pageKey = req.params.pageKey;
    if (!current.pages) current.pages = {};
    current.pages[pageKey] = {
      ...(current.pages[pageKey] || {}),
      ...(req.body || {}),
    };
    const saved = await saveContent(
      current,
      req.admin.id,
      `Updated page:${pageKey}`,
    );
    res.json(saved.pages[pageKey]);
  } catch (err) {
    next(err);
  }
});

router.get('/content/revisions', authRequired, async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    res.json(await listRevisions(limit));
  } catch (err) {
    next(err);
  }
});

router.get('/content/revisions/:id', authRequired, async (req, res, next) => {
  try {
    const rev = await getRevision(Number(req.params.id));
    if (!rev) return res.status(404).json({ error: 'Not found' });
    res.json(rev);
  } catch (err) {
    next(err);
  }
});

router.post('/content/revisions/:id/restore', authRequired, async (req, res, next) => {
  try {
    const saved = await restoreRevision(Number(req.params.id), req.admin.id);
    res.json(saved);
  } catch (err) {
    next(err);
  }
});

export default router;
