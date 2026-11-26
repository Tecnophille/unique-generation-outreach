import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureReady } from '../server/boot.js';
import { getContent } from '../server/services/contentService.js';
import { isPublicPathLive } from '../server/lib/publicRoutes.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.join(root, 'dist', 'index.html');

function spaPathFromRequest(req) {
  const q = req.query?.spaPath;
  if (typeof q === 'string' && q.startsWith('/')) return q.split('?')[0] || '/';

  const forwarded = req.headers['x-forwarded-uri'] || req.headers['x-invoke-path'];
  if (typeof forwarded === 'string' && forwarded.startsWith('/') && !forwarded.startsWith('/api/')) {
    return forwarded.split('?')[0] || '/';
  }

  const url = String(req.url || '/');
  if (url.startsWith('/api/spa')) return '/';
  return url.split('?')[0] || '/';
}

function sendIndex(res, status) {
  const html = fs.readFileSync(indexPath, 'utf8');
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(html);
}

export default async function handler(req, res) {
  try {
    await ensureReady();
    const pathname = spaPathFromRequest(req);
    const content = await getContent();
    const live = isPublicPathLive(pathname, content);
    if (!fs.existsSync(indexPath)) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Missing dist/index.html');
      return;
    }
    sendIndex(res, live ? 200 : 404);
  } catch (err) {
    console.error('[spa]', err?.message || err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Server error');
  }
}
