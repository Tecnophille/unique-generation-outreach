/**
 * Creates a public Supabase Storage bucket for CMS uploads (idempotent).
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Optional: SUPABASE_STORAGE_BUCKET (default ugo-media)
 */
const base = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';
const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'ugo-media';

if (!base || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const res = await fetch(`${base}/storage/v1/bucket`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${key}`,
    apikey: key,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: bucket,
    name: bucket,
    public: true,
    file_size_limit: 8_388_608,
    allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  }),
});

if (res.ok) {
  console.log(`Created public bucket: ${bucket}`);
  process.exit(0);
}

const text = await res.text();
if (res.status === 409 || /already exists/i.test(text)) {
  console.log(`Bucket already exists: ${bucket}`);
  process.exit(0);
}

console.error(`Failed (${res.status}): ${text}`);
process.exit(1);
