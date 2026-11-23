# Unique Generation Outreach

Marketing site + CMS for Unique Generation Outreach.

**Production target:** [Vercel](https://vercel.com) (site + API) + [Supabase](https://supabase.com) (Postgres + Storage).

## Quick start (local)

```bash
npm install
npm run dev
```

- Site: http://127.0.0.1:5173/
- CMS: http://127.0.0.1:5173/admin — `admin@ugo.local` / `ugoadmin2026`
- Without a DB URL, content uses on-disk **PGlite**

## Deploy: Vercel + Supabase

Full guide: [`docs/vercel-supabase.md`](./docs/vercel-supabase.md)

Summary:

1. Create a Supabase project → set `CMS_DATABASE_URL` (+ direct URI for migrate).
2. Create public Storage bucket `ugo-media` → set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
3. `npm run migrate` against the direct URI.
4. Import this repo in Vercel, add the env vars, deploy.

```bash
npm run vercel-build   # used by Vercel (build + migrate)
```

## Scripts

| Script | Action |
|--------|--------|
| `npm run dev` | Local API + Vite |
| `npm run build` | Vite production bundle |
| `npm run vercel-build` | Build + migrate (CI / Vercel) |
| `npm start` | Serve `dist/` + API (Docker / VM) |
| `npm run migrate` | Apply `migrations/*.sql` |
| `npm run supabase:bucket` | Create public Storage bucket |

## Architecture

```
api/index.js     Vercel serverless Express entry
server/          API (auth, content, pages, media, contact)
migrations/      Postgres schema (Supabase)
src/             React site + /admin CMS
public/cms/      Content seed JSON
```

Env template: `.env.example`
