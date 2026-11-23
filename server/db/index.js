import fs from 'fs';
import path from 'path';
import { readdir, readFile } from 'fs/promises';
import pg from 'pg';
import { config, root } from '../config.js';
import {
  describeDbTarget,
  pgClientConfig,
  resolveDatabaseUrl,
} from './connection.js';

const databaseUrl = resolveDatabaseUrl();
let pool;
let local;

export async function sql(text, params = []) {
  if (databaseUrl) {
    pool ??= new pg.Pool(pgClientConfig(databaseUrl, { max: 5 }));
    return (await pool.query(text, params)).rows;
  }
  local ??= startLocal().catch((error) => {
    local = undefined;
    throw error;
  });
  const db = await local;
  const result = await db.query(text, params);
  return result.rows;
}

async function startLocal() {
  const { PGlite } = await import('@electric-sql/pglite');
  fs.mkdirSync(config.pgliteDataDir, { recursive: true });
  const db = new PGlite(config.pgliteDataDir);
  const migrationsDir = path.join(root, 'migrations');
  const files = (await readdir(migrationsDir).catch(() => []))
    .filter((f) => f.endsWith('.sql'))
    .sort();
  await db.exec(`
    create table if not exists schema_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    );
  `);
  const done = new Set(
    (await db.query('select name from schema_migrations')).rows.map((r) => r.name),
  );
  for (const file of files) {
    if (done.has(file)) continue;
    const sqlText = await readFile(path.join(migrationsDir, file), 'utf8');
    await db.exec(sqlText);
    await db.query('insert into schema_migrations (name) values ($1)', [file]);
    console.log(`[db] applied ${file}`);
  }
  return db;
}

export function dbMode() {
  return describeDbTarget(databaseUrl);
}

export async function closeDb() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
