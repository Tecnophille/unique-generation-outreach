# Unique Generation Outreach

Production-ready marketing site + CMS for Unique Generation Outreach (Vite + React + Express + Postgres/PGlite).

## Quick start (development)

```bash
npm install
cp .env.example .env   # optional
npm run dev
```

- Site: http://127.0.0.1:5173/
- CMS: http://127.0.0.1:5173/admin  
  Default login: `admin@ugo.local` / `ugoadmin2026`

## Production

```bash
npm ci
npm run build
CMS_ADMIN_PASSWORD='your-long-secret' NODE_ENV=production npm start
```

Production defaults to port `8080`. Health checks:

- `GET /api/health`
- `GET /api/ready`

### Docker

```bash
export CMS_ADMIN_PASSWORD='your-long-secret'
docker compose up --build
```

App: http://localhost:8080 · Postgres included.

### Environment

See `.env.example`. Important variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection (PGlite used when unset) |
| `CMS_ADMIN_PASSWORD` | Admin password (rotated on boot when set) |
| `CMS_ADMIN_EMAIL` | Admin email |
| `SITE_URL` / `CORS_ORIGIN` | Public origin(s) |
| `COOKIE_SECURE` | Set `1` behind HTTPS |
| `TRUST_PROXY` | Set `1` behind a reverse proxy |

### Cursor publish

`cursor-app.json` requests a managed Postgres database. Bind secret `CMS_ADMIN_PASSWORD` before going public. Migrations in `migrations/` run during build when `DATABASE_URL` is present.

## Architecture

```
server/          Express API (auth, content, pages, media, contact)
migrations/      SQL schema
src/             React site + /admin CMS
public/cms/      Content seed / mirror JSON
public/uploads/  Media uploads
```

Backend details: `server/README.md` · CMS guide in the project store docs.

## Scripts

| Script | Action |
|--------|--------|
| `npm run dev` | API + Vite middleware |
| `npm run build` | Vite production build + migrate |
| `npm start` | Serve `dist/` + API (`NODE_ENV=production`) |
| `npm run migrate` | Apply SQL migrations (Postgres) |
| `npm run lint` | Oxlint |
