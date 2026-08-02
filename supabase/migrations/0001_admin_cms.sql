-- ============================================================================
-- ZEEVARA Admin CMS — schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / OR REPLACE).
-- ============================================================================

create extension if not exists pgcrypto; -- gen_random_uuid()

-- ---------------------------------------------------------------- helpers --
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ------------------------------------------------------------ admin_users --
create table if not exists public.admin_users (
  id               uuid primary key default gen_random_uuid(),
  email            text not null unique,
  -- Format: scrypt$<N>$<r>$<p>$<saltBase64>$<hashBase64>
  password_hash    text not null,
  failed_attempts  integer not null default 0,
  locked_until     timestamptz,
  last_login_at    timestamptz,
  created_at       timestamptz not null default now()
);

alter table public.admin_users enable row level security;
-- Deliberately ZERO policies: RLS enabled + no policy = deny-all for every
-- role except the service-role key, which bypasses RLS entirely.
revoke all on public.admin_users from anon, authenticated;

-- ----------------------------------------------------------- site_content --
create table if not exists public.site_content (
  key              text primary key,       -- 'home.hero', 'faq', ...
  label            text not null,          -- human label for the admin nav
  draft_value      jsonb not null default '{}'::jsonb,
  published_value  jsonb,                  -- NULL => never published
  updated_at       timestamptz not null default now(),
  published_at     timestamptz
);

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch
  before update on public.site_content
  for each row execute function public.touch_updated_at();

alter table public.site_content enable row level security;

drop policy if exists site_content_public_read_published on public.site_content;
create policy site_content_public_read_published
  on public.site_content for select to anon
  using (published_value is not null);

-- RLS is ROW-level, not COLUMN-level: without the explicit column grant below,
-- an anon caller could still `select draft_value`. This is the actual fix.
revoke all on public.site_content from anon, authenticated;
grant select (key, label, published_value, published_at)
  on public.site_content to anon;

-- ------------------------------------------------------------------ pages --
create table if not exists public.pages (
  slug                 text primary key,   -- 'about','privacy','terms',...
  title                text not null,
  -- Tiptap JSON is the editor's source of truth; the HTML is rendered ONCE
  -- server-side at save time so the public page never runs Tiptap at runtime.
  draft_body_json      jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  draft_body_html      text  not null default '',
  draft_meta           jsonb not null default '{}'::jsonb, -- {metaTitle,metaDescription,eyebrow,lastUpdatedLabel,heroImage}
  published_body_json  jsonb,
  published_body_html  text,
  published_meta       jsonb,
  is_system            boolean not null default true,      -- the 5 built-ins can't be deleted
  sort_order           integer not null default 0,
  updated_at           timestamptz not null default now(),
  published_at         timestamptz
);

drop trigger if exists pages_touch on public.pages;
create trigger pages_touch
  before update on public.pages
  for each row execute function public.touch_updated_at();

alter table public.pages enable row level security;

drop policy if exists pages_public_read_published on public.pages;
create policy pages_public_read_published
  on public.pages for select to anon
  using (published_body_html is not null);

revoke all on public.pages from anon, authenticated;
grant select (slug, title, published_body_html, published_meta, published_at, sort_order)
  on public.pages to anon;

-- ------------------------------------------------------------------ media --
create table if not exists public.media (
  id           uuid primary key default gen_random_uuid(),
  bucket       text not null default 'site-media',
  path         text not null,              -- 'hero/9f2c….webp'
  public_url   text not null,
  alt_text     text not null default '',
  width        integer,
  height       integer,
  mime_type    text,
  size_bytes   bigint,
  folder       text not null default 'general',
  deleted_at   timestamptz,                -- SOFT delete only — image URLs are
                                            -- denormalised into content jsonb,
                                            -- so a hard delete could silently
                                            -- break live pages.
  uploaded_at  timestamptz not null default now(),
  unique (bucket, path)
);

alter table public.media enable row level security;
-- No anon policies. The public site never queries `media` directly — image
-- URLs are denormalised into content jsonb, so a content read stays one query.
revoke all on public.media from anon, authenticated;

-- ------------------------------------------------------ content_revisions --
create table if not exists public.content_revisions (
  id           bigserial primary key,
  entity_type  text not null check (entity_type in ('site_content','page')),
  entity_key   text not null,
  action       text not null check (action in ('save','publish','revert')),
  snapshot     jsonb not null,
  created_by   uuid references public.admin_users(id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists content_revisions_entity_idx
  on public.content_revisions (entity_type, entity_key, created_at desc);

alter table public.content_revisions enable row level security;
revoke all on public.content_revisions from anon, authenticated;

-- ------------------------------------------------------------------------ --
-- Storage bucket for uploaded media (hero/banner images, etc.)
-- ------------------------------------------------------------------------ --
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 8388608,
        array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public bucket: anyone can read objects. No insert/update/delete policy for
-- anon/authenticated => uploads are service-role only (done via server actions).
drop policy if exists site_media_public_read on storage.objects;
create policy site_media_public_read
  on storage.objects for select to public
  using (bucket_id = 'site-media');
