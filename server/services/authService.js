import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sql } from '../db/index.js';
import { config } from '../config.js';

export async function ensureAdmin() {
  const email = String(config.defaultAdmin.email).trim().toLowerCase();
  const name = config.defaultAdmin.name;
  const existing = await sql('select id, email from admins where email = $1 limit 1', [email]);

  if (!existing.length) {
    const hash = await bcrypt.hash(config.defaultAdmin.password, 12);
    const rows = await sql(
      `insert into admins (email, name, password_hash)
       values ($1, $2, $3)
       returning id, email, name`,
      [email, name, hash],
    );
    console.log(`[auth] seeded admin ${email}`);
    return rows[0];
  }

  // When CMS_ADMIN_PASSWORD is explicitly provided, rotate only if it changed.
  if (config.adminPasswordFromEnv) {
    const rows = await sql('select password_hash from admins where email = $1 limit 1', [email]);
    const currentHash = rows[0]?.password_hash;
    const matches = currentHash
      ? await bcrypt.compare(config.defaultAdmin.password, currentHash)
      : false;
    if (!matches) {
      const hash = await bcrypt.hash(config.defaultAdmin.password, 12);
      await sql(
        `update admins
         set password_hash = $1, name = $2, updated_at = now()
         where email = $3`,
        [hash, name, email],
      );
      console.log(`[auth] rotated admin password from CMS_ADMIN_PASSWORD for ${email}`);
    } else {
      await sql(`update admins set name = $1, updated_at = now() where email = $2`, [name, email]);
    }
  }

  return existing[0];
}

export async function login(email, password) {
  const rows = await sql('select * from admins where email = $1 limit 1', [
    String(email || config.defaultAdmin.email).trim().toLowerCase(),
  ]);
  const admin = rows[0];
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return null;

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + config.sessionDays * 24 * 60 * 60 * 1000);
  await sql(`insert into sessions (token, admin_id, expires_at) values ($1, $2, $3)`, [
    token,
    admin.id,
    expires.toISOString(),
  ]);
  return {
    token,
    expiresAt: expires.toISOString(),
    admin: { id: admin.id, email: admin.email, name: admin.name },
  };
}

export async function logout(token) {
  if (!token) return;
  await sql('delete from sessions where token = $1', [token]);
}

export async function getSession(token) {
  if (!token || String(token).length > 128) return null;
  const rows = await sql(
    `select s.token, s.expires_at, a.id, a.email, a.name
     from sessions s
     join admins a on a.id = s.admin_id
     where s.token = $1
     limit 1`,
    [token],
  );
  const row = rows[0];
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await sql('delete from sessions where token = $1', [token]);
    return null;
  }
  return {
    token: row.token,
    admin: { id: row.id, email: row.email, name: row.name },
  };
}

export async function cleanupSessions() {
  await sql('delete from sessions where expires_at < now()');
}
