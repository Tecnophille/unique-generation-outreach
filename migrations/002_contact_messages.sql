create table if not exists contact_messages (
  id serial primary key,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  subject text not null default '',
  message text not null,
  source text not null default 'website',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists contact_messages_created_at_idx on contact_messages(created_at desc);
create index if not exists contact_messages_status_idx on contact_messages(status);
