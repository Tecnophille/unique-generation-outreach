# UGO backend

Express API + Vite (dev) with Postgres in production and PGlite locally.

## Layout

```
server/
  index.js          # boot (DB seed + Vite/static + listen)
  app.js            # Express API mount
  config.js
  db/index.js       # sql() helper (pg | pglite)
  middleware/auth.js
  routes/           # health, auth, content, media
  services/         # auth, content, media
migrations/         # SQL schema (additive)
scripts/migrate.mjs # production migrate
```

## API

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/health` | no | health + db mode |
| POST | `/api/login` | no | email + password → session cookie |
| POST | `/api/logout` | no | clear session |
| GET | `/api/session` | no | auth status |
| GET | `/api/me` | yes | current admin |
| GET | `/api/content` | no | full site JSON |
| PUT | `/api/content` | yes | save content + revision |
| PATCH | `/api/content/pages/:pageKey` | yes | patch one page |
| GET | `/api/content/revisions` | yes | revision list |
| POST | `/api/content/revisions/:id/restore` | yes | restore revision |
| GET | `/api/pages` | no | list CMS pages |
| GET | `/api/pages/:key` | no | one page payload |
| PUT | `/api/pages/:key` | yes | replace one page |
| GET | `/api/uploads` | yes | media library |
| POST | `/api/upload` | yes | multipart image upload |
| POST | `/api/contact` | no | store contact/newsletter message |
| GET | `/api/contact/messages` | yes | inbox |
| POST | `/api/contact/messages/:id/read` | yes | mark message read |

## Local defaults

- Admin email: `admin@ugo.local`
- Password: `ugoadmin2026` (override with `CMS_ADMIN_PASSWORD`)
- DB: on-disk PGlite at `data/pglite` when `DATABASE_URL` is unset
- Uploads: `public/uploads` served at `/uploads`
