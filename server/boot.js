import { validateConfig, config } from './config.js';
import { ensureAdmin, cleanupSessions } from './services/authService.js';
import { ensureContent } from './services/contentService.js';
import { ensureUploadsDir } from './services/mediaService.js';

let readyPromise;

export function ensureReady() {
  if (!readyPromise) {
    readyPromise = (async () => {
      const warnings = validateConfig();
      for (const warning of warnings) console.warn(`[config] ${warning}`);
      if (process.env.VERCEL && !config.databaseUrl) {
        throw new Error(
          'Supabase/Postgres URL required on Vercel. Set CMS_DATABASE_URL or DATABASE_URL.',
        );
      }
      ensureUploadsDir();
      await ensureAdmin();
      await ensureContent();
      await cleanupSessions();
    })().catch((err) => {
      readyPromise = undefined;
      throw err;
    });
  }
  return readyPromise;
}
