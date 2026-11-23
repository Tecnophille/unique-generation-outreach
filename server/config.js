import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(__dirname, '..');

export const config = {
  port: Number(process.env.PORT || 5173),
  databaseUrl: process.env.DATABASE_URL?.trim() || '',
  contentSeedPath: path.join(root, 'public/cms/content.json'),
  contentMirrorPath: path.join(root, 'public/cms/content.json'),
  uploadsDir: path.join(root, 'public/uploads'),
  pgliteDataDir: path.join(root, 'data/pglite'),
  sessionDays: 7,
  defaultAdmin: {
    email: process.env.CMS_ADMIN_EMAIL || 'admin@ugo.local',
    name: process.env.CMS_ADMIN_NAME || 'UGO Admin',
    password: process.env.CMS_ADMIN_PASSWORD || 'ugoadmin2026',
  },
};
