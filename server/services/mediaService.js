import fs from 'fs';
import path from 'path';
import { sql } from '../db/index.js';
import { config } from '../config.js';

export function ensureUploadsDir() {
  fs.mkdirSync(config.uploadsDir, { recursive: true });
}

export async function recordUpload(file, adminId = null) {
  const url = `/uploads/${file.filename}`;
  const rows = await sql(
    `insert into media_assets (filename, original_name, url, mime_type, size_bytes, uploaded_by)
     values ($1, $2, $3, $4, $5, $6)
     returning id, filename, original_name, url, mime_type, size_bytes, created_at`,
    [
      file.filename,
      file.originalname || '',
      url,
      file.mimetype || 'image/jpeg',
      file.size || 0,
      adminId,
    ],
  );
  return rows[0];
}

export async function listMedia() {
  const rows = await sql(
    `select id, filename, original_name, url, mime_type, size_bytes, created_at
     from media_assets
     order by created_at desc`,
  );
  if (rows.length) return rows;

  // Fallback scan disk for legacy uploads
  ensureUploadsDir();
  return fs
    .readdirSync(config.uploadsDir)
    .filter((f) => !f.startsWith('.'))
    .map((f) => {
      const full = path.join(config.uploadsDir, f);
      const st = fs.statSync(full);
      return {
        id: null,
        filename: f,
        original_name: f,
        url: `/uploads/${f}`,
        mime_type: 'image/*',
        size_bytes: st.size,
        created_at: st.mtime.toISOString(),
      };
    });
}
