create table if not exists admins (
  id serial primary key,
  email text not null unique,
  name text not null default 'Admin',
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  token text primary key,
  admin_id integer not null references admins(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists sessions_admin_id_idx on sessions(admin_id);
create index if not exists sessions_expires_at_idx on sessions(expires_at);

create table if not exists site_content (
  id integer primary key check (id = 1),
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by integer references admins(id) on delete set null
);

create table if not exists content_revisions (
  id serial primary key,
  payload jsonb not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  created_by integer references admins(id) on delete set null
);

create index if not exists content_revisions_created_at_idx on content_revisions(created_at desc);

create table if not exists media_assets (
  id serial primary key,
  filename text not null unique,
  original_name text not null default '',
  url text not null,
  mime_type text not null default 'image/jpeg',
  size_bytes integer not null default 0,
  created_at timestamptz not null default now(),
  uploaded_by integer references admins(id) on delete set null
);
