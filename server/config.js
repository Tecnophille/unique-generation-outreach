import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(__dirname, '..');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

function parseOrigins(raw) {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const corsOrigins = parseOrigins(process.env.CORS_ORIGIN || process.env.APP_ORIGIN || '');
const siteUrl = (process.env.SITE_URL || process.env.APP_ORIGIN || '').replace(/\/$/, '');

const adminPasswordFromEnv = Boolean(process.env.CMS_ADMIN_PASSWORD?.trim());
const defaultPassword = process.env.CMS_ADMIN_PASSWORD?.trim() || 'ugoadmin2026';

export const config = {
  nodeEnv,
  isProd,
  port: Number(process.env.PORT || (isProd ? 8080 : 5173)),
  host: process.env.HOST || '0.0.0.0',
  databaseUrl: process.env.DATABASE_URL?.trim() || '',
  siteUrl,
  corsOrigins,
  trustProxy: process.env.TRUST_PROXY === '1' || process.env.TRUST_PROXY === 'true' || isProd,
  cookieSecure:
    process.env.COOKIE_SECURE === '1' ||
    process.env.COOKIE_SECURE === 'true' ||
    (isProd && process.env.COOKIE_SECURE !== '0'),
  contentSeedPath: path.join(root, 'public/cms/content.json'),
  contentMirrorPath: path.join(root, 'public/cms/content.json'),
  uploadsDir: path.join(root, 'public/uploads'),
  distDir: path.join(root, 'dist'),
  pgliteDataDir: path.join(root, 'data/pglite'),
  sessionDays: Number(process.env.SESSION_DAYS || 7),
  adminPasswordFromEnv,
  defaultAdmin: {
    email: process.env.CMS_ADMIN_EMAIL || 'admin@ugo.local',
    name: process.env.CMS_ADMIN_NAME || 'UGO Admin',
    password: defaultPassword,
  },
};

export function validateConfig() {
  const warnings = [];
  if (config.isProd && !config.adminPasswordFromEnv) {
    warnings.push(
      'CMS_ADMIN_PASSWORD is unset — using the local default. Set this secret before going public.',
    );
  }
  if (config.isProd && !config.databaseUrl) {
    warnings.push('DATABASE_URL is unset — using on-disk PGlite (fine for local prod smoke tests).');
  }
  if (config.isProd && config.corsOrigins.length === 0 && !config.siteUrl) {
    warnings.push(
      'CORS_ORIGIN / SITE_URL unset — same-origin browser traffic still works; set them if the API is called cross-origin.',
    );
  }
  return warnings;
}

export function cookieOptions(maxAgeMs) {
  const opts = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: config.cookieSecure,
  };
  if (maxAgeMs != null) opts.maxAge = maxAgeMs;
  return opts;
}
