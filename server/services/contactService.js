import { sql } from '../db/index.js';

export async function createMessage(input = {}) {
  const name = String(input.name || '').trim().slice(0, 120);
  const email = String(input.email || '').trim().slice(0, 180);
  const phone = String(input.phone || '').trim().slice(0, 40);
  const subject = String(input.subject || '').trim().slice(0, 160);
  const message = String(input.message || '').trim().slice(0, 5000);
  const source = String(input.source || 'website').trim().slice(0, 40);

  if (!message) {
    const err = new Error('Message is required');
    err.status = 400;
    throw err;
  }

  const rows = await sql(
    `insert into contact_messages (name, email, phone, subject, message, source)
     values ($1, $2, $3, $4, $5, $6)
     returning id, name, email, phone, subject, message, source, status, created_at`,
    [name, email, phone, subject, message, source],
  );
  return rows[0];
}

export async function listMessages(limit = 50) {
  return sql(
    `select id, name, email, phone, subject, message, source, status, created_at, read_at
     from contact_messages
     order by created_at desc
     limit $1`,
    [Math.min(Number(limit) || 50, 200)],
  );
}

export async function markRead(id) {
  const rows = await sql(
    `update contact_messages
     set status = 'read', read_at = coalesce(read_at, now())
     where id = $1
     returning id, status, read_at`,
    [id],
  );
  return rows[0] || null;
}
