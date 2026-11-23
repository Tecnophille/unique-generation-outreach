import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sql } from '../db/index.js';
import { config } from '../config.js';

export async function ensureAdmin() {
  const existing = await sql('select id from admins limit 1');
  if (existing.length) return existing[0];
  const hash = await bcrypt.hash(config.defaultAdmin.password, 10);
  const rows = await sql(
    `insert into admins (email, name, password_hash)
     values ($1, $2, $3)
     returning id, email, name`,
    [config.defaultAdmin.email, config.defaultAdmin.name, hash],
  );
  console.log(`[auth] seeded admin ${config.defaultAdmin.email}`);
  return rows[0];
}

export async function login(email, password) {
  const rows = await sql('select * from admins where email = $1 limit 1', [
    email || config.defaultAdmin.email,
  ]);
  const admin = rows[0];
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return null;

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + config.sessionDays * 24 * 60 * 60 * 1000);
  await sql(
    `insert into sessions (token, admin_id, expires_at) values ($1, $2, $3)`,
    [token, admin.id, expires.toISOString()],
  );
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
  if (!token) return null;
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
