import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const prod = 'https://unique-generation-outreach.vercel.app';
const selectedDir = path.join(root, 'public/uploads/from-pdf/selected');
const contentPath = path.join(root, 'public/cms/content.json');
const mapPath = path.join(selectedDir, 'supabase-url-map.json');

function loadEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i < 0) continue;
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[line.slice(0, i)] = v;
  }
  return out;
}

// Prefer production env only — do not let local .env.local override the CMS password.
const env = loadEnvFile(path.join(root, '.env.production.local'));

const email = env.CMS_ADMIN_EMAIL || 'admin@ugo.local';
const password = env.CMS_ADMIN_PASSWORD;
if (!password || password === '[SENSITIVE]') {
  console.error('Missing usable CMS_ADMIN_PASSWORD in .env.production.local');
  process.exit(1);
}

const loginRes = await fetch(`${prod}/api/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const loginBody = await loginRes.json();
if (!loginRes.ok) {
  console.error('Login failed', loginRes.status, loginBody);
  process.exit(1);
}

const setCookie = loginRes.headers.getSetCookie?.() || [];
const cookieHeader =
  setCookie.map((c) => c.split(';')[0]).join('; ') ||
  (loginRes.headers.get('set-cookie') || '').split(',').map((c) => c.split(';')[0].trim()).filter((c) => c.includes('=')).join('; ');

const token = loginBody.token;
const authHeaders = {
  Cookie: cookieHeader || `ugo_cms_token=${token}`,
  ...(token ? { 'x-cms-token': token } : {}),
};

console.log('Logged in as', loginBody.admin?.email);

const files = fs
  .readdirSync(selectedDir)
  .filter((f) => f.endsWith('.jpg'))
  .sort();

const urlMap = fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, 'utf8')) : {};

for (const file of files) {
  if (urlMap[file]?.url?.includes('supabase')) {
    console.log('skip existing', file);
    continue;
  }
  const buf = fs.readFileSync(path.join(selectedDir, file));
  const form = new FormData();
  form.append('file', new Blob([buf], { type: 'image/jpeg' }), file);

  const up = await fetch(`${prod}/api/upload`, {
    method: 'POST',
    headers: authHeaders,
    body: form,
  });
  const body = await up.json().catch(() => ({}));
  if (!up.ok) {
    console.error('Upload failed', file, up.status, body);
    process.exit(1);
  }
  urlMap[file] = { url: body.url, id: body.id, filename: body.filename };
  console.log('uploaded', file, '->', body.url);
  fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2));
}

function rewriteLocalPaths(value) {
  if (typeof value === 'string') {
    const m = value.match(/\/uploads\/from-pdf\/selected\/([^/?#]+)$/);
    if (m && urlMap[m[1]]?.url) return urlMap[m[1]].url;
    return value;
  }
  if (Array.isArray(value)) return value.map(rewriteLocalPaths);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = rewriteLocalPaths(v);
    return out;
  }
  return value;
}

const localContent = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const content = rewriteLocalPaths(localContent);
content.updatedAt = new Date().toISOString();
fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
console.log('Updated local content.json with Supabase URLs');

const putRes = await fetch(`${prod}/api/content`, {
  method: 'PUT',
  headers: {
    ...authHeaders,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(content),
});
const putBody = await putRes.json().catch(() => ({}));
if (!putRes.ok) {
  console.error('Content save failed', putRes.status, putBody);
  process.exit(1);
}
console.log('Production CMS content updated');

const check = await fetch(`${prod}/api/content`);
const live = await check.json();
console.log('live hero=', live.hero?.image);
console.log('live about0=', live.about?.images?.[0]);
console.log('live leader0=', live.leadership?.[0]?.photo);
console.log('done files=', files.length);
