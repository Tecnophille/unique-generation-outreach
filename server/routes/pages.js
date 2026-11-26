import { Router } from 'express';
import { authRequired, optionalAuth } from '../middleware/auth.js';
import { isLivePage } from '../lib/publicRoutes.js';
import { toPublicContent } from '../lib/publicContent.js';
import { getContent, saveContent } from '../services/contentService.js';

const router = Router();

router.get('/pages', optionalAuth, async (req, res, next) => {
  try {
    const content = await getContent();
    const scoped = req.admin ? content : toPublicContent(content);
    const pages = scoped.pages || {};
    res.json(
      Object.entries(pages).map(([key, page]) => ({
        key,
        title: page?.title || page?.heroTitle || key,
        path: page?.path || `/${key}`,
        updatedAt: content.updatedAt || null,
      })),
    );
  } catch (err) {
    next(err);
  }
});

router.get('/pages/:pageKey', optionalAuth, async (req, res, next) => {
  try {
    const content = await getContent();
    const page = content.pages?.[req.params.pageKey];
    if (!page) return res.status(404).json({ error: 'Page not found' });
    if (!req.admin && !isLivePage(page)) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json({ key: req.params.pageKey, ...page });
  } catch (err) {
    next(err);
  }
});

router.put('/pages/:pageKey', authRequired, async (req, res, next) => {
  try {
    const content = await getContent();
    if (!content.pages) content.pages = {};
    content.pages[req.params.pageKey] = req.body || {};
    const saved = await saveContent(
      content,
      req.admin.id,
      `Replaced page:${req.params.pageKey}`,
    );
    res.json(saved.pages[req.params.pageKey]);
  } catch (err) {
    next(err);
  }
});

export default router;
