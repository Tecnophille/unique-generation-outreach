import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authRequired } from '../middleware/auth.js';
import { config } from '../config.js';
import { ensureUploadsDir, listMedia, recordUpload } from '../services/mediaService.js';

ensureUploadsDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
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
    const asset = await recordUpload(req.file, req.admin.id);
    res.status(201).json(asset);
  } catch (err) {
    next(err);
  }
});

export default router;
