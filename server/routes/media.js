import { Router } from 'express';
import multer from 'multer';
import { authRequired } from '../middleware/auth.js';
import { config } from '../config.js';
import { deleteMedia, ensureUploadsDir, listMedia, recordUpload } from '../services/mediaService.js';

ensureUploadsDir();

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage: config.useSupabaseStorage || config.onVercel ? multer.memoryStorage() : diskStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed'));
    }
    cb(null, true);
  },
});

const router = Router();

router.get('/uploads', authRequired, async (_req, res, next) => {
  try {
    res.json(await listMedia());
  } catch (err) {
    next(err);
  }
});

router.post('/upload', authRequired, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if ((config.onVercel || config.useSupabaseStorage) && !config.useSupabaseStorage) {
      return res.status(503).json({
        error:
          'Media uploads require Supabase Storage. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      });
    }
    const asset = await recordUpload(req.file, req.admin.id);
    res.status(201).json(asset);
  } catch (err) {
    next(err);
  }
});

router.delete('/uploads/:id', authRequired, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });
    res.json(await deleteMedia(id));
  } catch (err) {
    next(err);
  }
});

export default router;
