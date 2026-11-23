import { Router } from 'express';
import { config, cookieOptions } from '../config.js';
import { getSession, login, logout } from '../services/authService.js';
import { authRequired, getToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const password = String(req.body?.password || '');
    const email = String(req.body?.email || config.defaultAdmin.email).trim().toLowerCase();
    if (!password || password.length > 200 || email.length > 180) {
      return res.status(400).json({ error: 'Invalid login payload' });
    }
    const result = await login(email, password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.cookie(
      'ugo_cms_token',
      result.token,
      cookieOptions(config.sessionDays * 24 * 60 * 60 * 1000),
    );
    // Cookie is the session source of truth; omit raw token in production responses.
    res.json({
      ok: true,
      admin: result.admin,
      expiresAt: result.expiresAt,
      ...(config.isProd ? {} : { token: result.token }),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    await logout(getToken(req));
    res.clearCookie('ugo_cms_token', cookieOptions());
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get('/session', async (req, res, next) => {
  try {
    const session = await getSession(getToken(req));
    res.json({
      authenticated: Boolean(session),
      admin: session?.admin || null,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authRequired, (req, res) => {
  res.json({ admin: req.admin });
});

export default router;
