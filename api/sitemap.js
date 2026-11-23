import { createApiApp } from '../server/app.js';
import { ensureReady } from '../server/boot.js';

const app = createApiApp();

export default async function handler(req, res) {
  await ensureReady();
  req.url = '/api/sitemap';
  return app(req, res);
}
