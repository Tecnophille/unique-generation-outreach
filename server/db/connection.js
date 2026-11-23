/**
 * Resolve Postgres connection settings for Supabase / any hosted Postgres.
 *
 * Precedence (first non-empty wins):
 *   1. CMS_DATABASE_URL     — preferred app secret (works with Cursor Secrets)
 *   2. SUPABASE_DB_URL      — explicit Supabase URI
 *   3. DATABASE_URL         — standard / Docker / platform-injected
 *
 * For migrations, prefer a direct (non-pooler) URI when available:
 *   DATABASE_URL_UNPOOLED or SUPABASE_DB_URL_DIRECT
 */

export function resolveDatabaseUrl({ forMigrate = false } = {}) {
  if (forMigrate) {
    const direct =
      process.env.DATABASE_URL_UNPOOLED?.trim() ||
      process.env.SUPABASE_DB_URL_DIRECT?.trim() ||
      '';
    if (direct) return direct;
  }

  return (
    process.env.CMS_DATABASE_URL?.trim() ||
    process.env.SUPABASE_DB_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    ''
  );
}

export function looksLikeSupabase(url = '') {
  return /supabase\.(co|com)|pooler\.supabase/i.test(url);
}

export function pgSslOption(url = '') {
  const forcedOn = process.env.DB_SSL === '1' || process.env.DB_SSL === 'true';
  const forcedOff = process.env.DB_SSL === '0' || process.env.DB_SSL === 'false';
  if (forcedOff) return undefined;
  if (forcedOn || looksLikeSupabase(url) || /sslmode=require/i.test(url)) {
    // Supabase uses certificates that Node may not trust via system CAs in some images.
    const rejectUnauthorized =
      process.env.DB_SSL_REJECT_UNAUTHORIZED === '1' ||
      process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';
    return { rejectUnauthorized };
  }
  return undefined;
}

export function pgClientConfig(url, { max } = {}) {
  const config = {
    connectionString: url,
    ssl: pgSslOption(url),
  };
  if (max != null) config.max = max;
  return config;
}

export function describeDbTarget(url = '') {
  if (!url) return 'pglite';
  if (looksLikeSupabase(url)) return 'supabase';
  return 'postgres';
}
