import fs from 'fs';
import { sql } from '../db/index.js';
import { config } from '../config.js';
import { preparePublicContent } from '../../src/cms/contentModel.js';
import { applyPublicContentRepairs } from '../../src/cms/publicContentRepairs.js';

/** Bump when new idempotent public-copy repairs must re-run against existing DB rows. */
const PUBLIC_COPY_REPAIR_VERSION = 2;

function toJsonb(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function readSeed() {
  return JSON.parse(fs.readFileSync(config.contentSeedPath, 'utf8'));
}

function mirrorToDisk(payload) {
  if (config.onVercel) return;
  try {
    fs.mkdirSync(pathDir(config.contentMirrorPath), { recursive: true });
    fs.writeFileSync(config.contentMirrorPath, JSON.stringify(payload, null, 2));
  } catch {
    // non-fatal
  }
}

function pathDir(filePath) {
  return filePath.replace(/\/[^/]+$/, '');
}

function needsPersistedRepair(payload) {
  if (!payload || typeof payload !== 'object') return true;
  if (payload.publicCopyRepairsV1 !== PUBLIC_COPY_REPAIR_VERSION) return true;
  if (!payload.pages?.events) return true;
  if (!payload.pages?.resources) return true;
  const hasStudioEvents = (payload.events || []).some(
    (e) => (e?.status || 'published') === 'published',
  );
  const pageEvents = Array.isArray(payload.pages.events.events) ? payload.pages.events.events : [];
  const gatheringEvents = payload.pages.gatherings?.events || [];
  if (!hasStudioEvents && !pageEvents.length && gatheringEvents.length) return true;
  if (applyPublicContentRepairs(payload).changed) return true;
  return false;
}

export async function ensureContent() {
  const rows = await sql('select id from site_content where id = 1');
  if (rows.length) return getContent();
  const seed = {
    ...preparePublicContent(readSeed()),
    publicCopyRepairsV1: PUBLIC_COPY_REPAIR_VERSION,
  };
  seed.updatedAt = new Date().toISOString();
  await sql(
    `insert into site_content (id, payload, updated_at) values (1, $1::jsonb, now())`,
    [toJsonb(seed)],
  );
  await sql(
    `insert into content_revisions (payload, note) values ($1::jsonb, $2)`,
    [toJsonb(seed), 'Initial seed'],
  );
  mirrorToDisk(seed);
  console.log('[content] seeded site_content from public/cms/content.json');
  return seed;
}

function normalizePayload(payload) {
  if (payload == null) return null;
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }
  return payload;
}

export async function getContent() {
  const rows = await sql('select payload from site_content where id = 1');
  if (!rows.length) return ensureContent();
  const payload = normalizePayload(rows[0].payload);
  if (!payload || typeof payload !== 'object') return ensureContent();
  if (!payload.pages) payload.pages = {};

  const prepared = {
    ...preparePublicContent(payload),
    publicCopyRepairsV1: PUBLIC_COPY_REPAIR_VERSION,
  };

  if (needsPersistedRepair(payload)) {
    try {
      await saveContent(prepared, null, 'Auto-repair: public copy, email typo, events hub');
      console.log('[content] persisted public content repairs');
    } catch (err) {
      console.warn('[content] could not persist repairs:', err?.message || err);
    }
  }
  return prepared;
}

export async function saveContent(payload, adminId = null, note = 'CMS save') {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid content payload');
  }
  const next = {
    ...preparePublicContent({ ...payload, updatedAt: new Date().toISOString() }),
    publicCopyRepairsV1: PUBLIC_COPY_REPAIR_VERSION,
  };
  await sql(
    `insert into site_content (id, payload, updated_at, updated_by)
     values (1, $1::jsonb, now(), $2)
     on conflict (id) do update set
       payload = excluded.payload,
       updated_at = now(),
       updated_by = excluded.updated_by`,
    [toJsonb(next), adminId],
  );
  await sql(
    `insert into content_revisions (payload, note, created_by)
     values ($1::jsonb, $2, $3)`,
    [toJsonb(next), note, adminId],
  );
  mirrorToDisk(next);
  return next;
}

export async function listRevisions(limit = 20) {
  return sql(
    `select id, note, created_at, created_by
     from content_revisions
     order by created_at desc
     limit $1`,
    [limit],
  );
}

export async function getRevision(id) {
  const rows = await sql(
    `select id, payload, note, created_at, created_by
     from content_revisions where id = $1`,
    [id],
  );
  return rows[0] || null;
}

export async function restoreRevision(id, adminId = null) {
  const rev = await getRevision(id);
  if (!rev) throw new Error('Revision not found');
  return saveContent(rev.payload, adminId, `Restored revision #${id}`);
}
