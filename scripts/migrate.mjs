import { readdir, readFile } from 'node:fs/promises';
import pg from 'pg';
import {
  describeDbTarget,
  pgClientConfig,
  resolveDatabaseUrl,
} from '../server/db/connection.js';

const url = resolveDatabaseUrl({ forMigrate: true });
const files = (await readdir('migrations').catch(() => []))
  .filter((f) => f.endsWith('.sql'))
  .sort();

if (url === '' || files.length === 0) {
  console.log('migrate: nothing to do (no database URL or no migration files)');
  process.exit(0);
}

console.log(`migrate: target=${describeDbTarget(url)}`);

const client = new pg.Client(pgClientConfig(url));
await client.connect();
try {
  await client.query("set lock_timeout = '60s'");
  await client.query('select pg_advisory_lock(7272741)');
  await client.query(
    'create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())',
  );
  const done = new Set(
    (await client.query('select name from schema_migrations')).rows.map((r) => r.name),
  );
  for (const file of files.filter((f) => !done.has(f))) {
    await client.query('begin');
    try {
      await client.query(await readFile(`migrations/${file}`, 'utf8'));
      await client.query('insert into schema_migrations (name) values ($1)', [file]);
      await client.query('commit');
      console.log(`migrate: applied ${file}`);
    } catch (error) {
      await client.query('rollback');
      throw error;
    }
  }
  if (files.every((f) => done.has(f))) {
    console.log('migrate: already up to date');
  }
} finally {
  await client.end();
}
