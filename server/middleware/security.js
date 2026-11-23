import { config } from '../config.js';

export function securityHeaders(_req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  if (config.isProd) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
}

export function originGuard(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (!config.isProd) return next();

  const allowed = new Set(config.corsOrigins);
  if (config.siteUrl) allowed.add(config.siteUrl);

  // Same-origin requests may omit Origin; allow those.
  const origin = req.get('origin');
  if (!origin) return next();
  if (allowed.size === 0) return next();
  if (allowed.has(origin)) return next();

  return res.status(403).json({ error: 'Forbidden origin' });
}
