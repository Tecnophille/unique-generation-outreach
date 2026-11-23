# Deploy UGO on Vercel + Supabase

## Architecture

| Piece | Where |
|-------|--------|
| React site (`dist/`) | Vercel static CDN |
| Express CMS API (`api/index.js`) | Vercel Serverless Function |
| Postgres (content, auth, inbox, media rows) | **Supabase** |
| Image uploads | **Supabase Storage** bucket `ugo-media` |

Local `npm run dev` still uses PGlite when no DB URL is set.

## 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. **Database → Connection string → URI**
   - Copy the **pooler** URI → `CMS_DATABASE_URL` (runtime / Vercel).
   - Copy the **direct** URI → `DATABASE_URL_UNPOOLED` (migrations).
3. Replace `[YOUR-PASSWORD]` with the database password.
4. **Project Settings → API**
   - `SUPABASE_URL` = Project URL  
   - `SUPABASE_SERVICE_ROLE_KEY` = `service_role` secret (server only — never expose to the browser).
5. Create a **public** Storage bucket named `ugo-media` (or run locally):

```bash
export SUPABASE_URL=...
export SUPABASE_SERVICE_ROLE_KEY=...
node scripts/ensure-supabase-bucket.mjs
```

6. Apply schema:

```bash
export DATABASE_URL_UNPOOLED='postgresql://…direct…'
npm run migrate
```

## 2. Vercel project

1. Push this repo to GitHub.
2. Import the repo in Vercel (framework: Vite — `vercel.json` already sets build/output).
3. Add environment variables (Production + Preview):

| Name | Value |
|------|--------|
| `CMS_DATABASE_URL` | Supabase pooler URI |
| `DATABASE_URL_UNPOOLED` | Supabase direct URI (for build migrate) |
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `SUPABASE_STORAGE_BUCKET` | `ugo-media` |
| `CMS_ADMIN_EMAIL` | your admin email |
| `CMS_ADMIN_PASSWORD` | long random secret |
| `SITE_URL` | `https://your-deployment.vercel.app` |
| `CORS_ORIGIN` | same as `SITE_URL` |
| `COOKIE_SECURE` | `1` |
| `TRUST_PROXY` | `1` |

4. Deploy. First request to `/api/health` should show `"db":"supabase"`.
5. Open `/admin`, sign in, confirm Dashboard + media uploads.

### CLI (optional)

```bash
npx vercel login
npx vercel env pull   # after vars are set in the dashboard
npx vercel --prod
```

Never paste database passwords or service-role keys into chat.

## 3. Post-deploy checks

```bash
curl -s https://YOUR_DOMAIN/api/health
# { "ok": true, "db": "supabase", "storage": "supabase", ... }
```

- Public site loads  
- `/admin` login works  
- Save content (creates a revision in Supabase)  
- Upload an image (lands in Storage; URL is absolute Supabase public URL)

## Notes

- Vercel’s filesystem is ephemeral — local `/uploads` is not used in production when Storage is configured.
- Cold starts run `ensureAdmin` / `ensureContent` once per instance; content seeds from `public/cms/content.json` if the DB is empty.
- `cursor-app.json` no longer requests Cursor-managed Postgres; Supabase is the source of truth.
