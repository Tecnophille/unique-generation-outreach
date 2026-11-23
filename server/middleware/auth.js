import { getSession } from '../services/authService.js';

export function getToken(req) {
  return req.cookies?.ugo_cms_token || req.headers['x-cms-token'] || null;
}

export async function authRequired(req, res, next) {
  try {
    const session = await getSession(getToken(req));
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.admin = session.admin;
    req.sessionToken = session.token;
    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const session = await getSession(getToken(req));
    if (session) {
      req.admin = session.admin;
      req.sessionToken = session.token;
    }
    next();
  } catch (err) {
    next(err);
  }
}
