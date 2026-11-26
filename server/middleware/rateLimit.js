/**
 * Rate limiting for login / contact / upload.
 *
 * Prefer a shared store when available (Upstash Redis REST or Vercel KV REST) so
 * limits hold across Vercel serverless instances. Falls back to a hardened
 * per-instance Map when those env vars are unset — better than nothing, but
 * not a global cap on multi-instance cold starts.
 *
 * Env (any pair):
 *   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *   KV_REST_API_URL + KV_REST_API_TOKEN
 */

const buckets = new Map();
const MAX_BUCKETS = 5_000;

function redisRestConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim() || '';
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim() || '';
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ''), token };
}

export function clientKey(req, prefix) {
  const forwarded = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim();
  const realIp = req.headers['x-real-ip']?.toString().trim();
  const cfIp = req.headers['cf-connecting-ip']?.toString().trim();
  const ip = forwarded || cfIp || realIp || req.ip || req.socket?.remoteAddress || 'unknown';
  return `${prefix}:${ip}`;
}

function pruneBuckets(now = Date.now()) {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size <= MAX_BUCKETS) return;
  // Evict soonest-to-expire entries when under pressure.
  const ranked = [...buckets.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
  const overflow = buckets.size - MAX_BUCKETS;
  for (let i = 0; i < overflow; i += 1) {
    buckets.delete(ranked[i][0]);
  }
}

function memoryConsume(key, windowMs, max) {
  const now = Date.now();
  let entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    buckets.set(key, entry);
  }
  entry.count += 1;
  pruneBuckets(now);
  return {
    count: entry.count,
    remaining: Math.max(0, max - entry.count),
    resetAt: entry.resetAt,
    limited: entry.count > max,
  };
}

async function redisConsume(cfg, key, windowMs, max) {
  const ttlSec = Math.max(1, Math.ceil(windowMs / 1000));
  const headers = {
    Authorization: `Bearer ${cfg.token}`,
    'Content-Type': 'application/json',
  };

  const incrRes = await fetch(`${cfg.url}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(['INCR', key]),
  });
  if (!incrRes.ok) throw new Error(`redis incr failed: ${incrRes.status}`);
  const incrBody = await incrRes.json();
  const count = Number(incrBody?.result ?? incrBody);
  if (!Number.isFinite(count)) throw new Error('redis incr bad result');

  if (count === 1) {
    const expRes = await fetch(`${cfg.url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(['EXPIRE', key, ttlSec]),
    });
    if (!expRes.ok) throw new Error(`redis expire failed: ${expRes.status}`);
  }

  const now = Date.now();
  return {
    count,
    remaining: Math.max(0, max - count),
    resetAt: now + windowMs,
    limited: count > max,
  };
}

export function rateLimitBackend() {
  return redisRestConfig() ? 'redis-rest' : 'memory';
}

export function rateLimit({ windowMs = 60_000, max = 30, prefix = 'rl' } = {}) {
  const redis = redisRestConfig();

  return (req, res, next) => {
    const key = clientKey(req, prefix);
    const apply = (result) => {
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(result.remaining));
      res.setHeader('X-RateLimit-Policy', redis ? 'redis-rest' : 'memory');
      if (result.limited) {
        const retry = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
        res.setHeader('Retry-After', String(retry));
        return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
      }
      return next();
    };

    if (!redis) {
      return apply(memoryConsume(key, windowMs, max));
    }

    redisConsume(redis, key, windowMs, max)
      .then(apply)
      .catch((err) => {
        console.warn('[rateLimit] redis unavailable, falling back to memory:', err?.message || err);
        apply(memoryConsume(key, windowMs, max));
      });
  };
}

// Periodic cleanup to avoid unbounded growth on long-lived instances
setInterval(() => {
  pruneBuckets();
}, 5 * 60_000).unref?.();
