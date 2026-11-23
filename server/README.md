# UGO backend

Express API + Vite (dev) / static `dist` (production). Postgres in hosted environments; PGlite locally when `DATABASE_URL` is unset.

## Layout

```
server/
  index.js              # boot, static/SPA, sitemap, graceful shutdown
  app.js                # Express API + security middleware
  config.js             # env-driven configuration
  db/index.js           # sql() helper (pg | pglite)
  middleware/           # auth, security headers, rate limits
  routes/               # health, auth, content, pages, media, contact
  services/             # domain logic
migrations/             # SQL schema (additive)
scripts/migrate.mjs     # production migrate
```

## API

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/health` | no | liveness + db mode |
| GET | `/api/ready` | no | readiness (503 if db down) |
| POST | `/api/login` | no | email + password → httpOnly cookie |
| POST | `/api/logout` | no | clear session |
| GET | `/api/session` | no | auth status |
| GET | `/api/me` | yes | current admin |
| GET | `/api/content` | no | full site JSON |
| PUT | `/api/content` | yes | save content + revision |
| PATCH | `/api/content/pages/:pageKey` | yes | patch one page |
| GET | `/api/content/revisions` | yes | revision list |
| POST | `/api/content/revisions/:id/restore` | yes | restore revision |
| GET | `/api/pages` | no | list CMS pages |
| GET/PUT | `/api/pages/:key` | put yes | page payload |
| GET | `/api/uploads` | yes | media library |
| POST | `/api/upload` | yes | multipart image upload |
| POST | `/api/contact` | no | store contact/newsletter message |
| GET | `/api/contact/messages` | yes | inbox |
| POST | `/api/contact/messages/:id/read` | yes | mark message read |

## Production notes

- Set `CMS_ADMIN_PASSWORD` (rotated into DB when present)
- Set `SITE_URL` / `CORS_ORIGIN` for public HTTPS origin
- `COOKIE_SECURE=1` and `TRUST_PROXY=1` behind TLS terminators
- Login / contact / upload routes are rate-limited
- Mutating requests check `Origin` in production when allow-list is configured
