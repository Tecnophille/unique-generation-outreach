import fs from 'fs';
import path from 'path';
import { sql } from '../db/index.js';
import { config } from '../config.js';

export function ensureUploadsDir() {
  if (config.useSupabaseStorage) return;
  fs.mkdirSync(config.uploadsDir, { recursive: true });
}

async function uploadToSupabase(file) {
  const safe = String(file.originalname || 'upload.bin').replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${Date.now()}-${safe}`;
  const objectPath = `uploads/${filename}`;
  const endpoint = `${config.supabaseUrl}/storage/v1/object/${config.supabaseBucket}/${objectPath}`;

  const body = file.buffer || (file.path ? fs.readFileSync(file.path) : null);
  if (!body) {
    const err = new Error('Missing upload body');
    err.status = 400;
    throw err;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.supabaseServiceKey}`,
      apikey: config.supabaseServiceKey,
      'Content-Type': file.mimetype || 'application/octet-stream',
      'x-upsert': 'true',
    },
    body,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    const err = new Error(`Supabase Storage upload failed (${res.status}): ${detail.slice(0, 200)}`);
    err.status = 502;
    throw err;
  }

  const publicUrl = `${config.supabaseUrl}/storage/v1/object/public/${config.supabaseBucket}/${objectPath}`;
  return { filename, url: publicUrl };
}

export async function recordUpload(file, adminId = null) {
  let filename;
  let url;

  if (config.useSupabaseStorage) {
    ({ filename, url } = await uploadToSupabase(file));
  } else {
    if (!file.filename && file.buffer) {
      // memory upload without supabase — write to local disk
      ensureUploadsDir();
      const safe = String(file.originalname || 'upload.bin').replace(/[^a-zA-Z0-9._-]/g, '_');
      filename = `${Date.now()}-${safe}`;
      fs.writeFileSync(path.join(config.uploadsDir, filename), file.buffer);
    } else {
      filename = file.filename;
    }
    url = `/uploads/${filename}`;
  }

  const rows = await sql(
    `insert into media_assets (filename, original_name, url, mime_type, size_bytes, uploaded_by)
     values ($1, $2, $3, $4, $5, $6)
     returning id, filename, original_name, url, mime_type, size_bytes, created_at`,
    [
      filename,
      file.originalname || '',
      url,
      file.mimetype || 'image/jpeg',
      file.size || file.buffer?.length || 0,
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

  if (config.useSupabaseStorage || config.onVercel) return [];

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
