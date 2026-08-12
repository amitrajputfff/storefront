-- ============================================================================
-- ZEEVARA Reviews — schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / OR REPLACE).
-- Depends on 0001_admin_cms.sql (pgcrypto extension, touch_updated_at()).
-- ============================================================================

-- ---------------------------------------------------------------- reviews --
create table if not exists public.reviews (
  id              uuid primary key default gen_random_uuid(),
  product_handle  text not null,              -- matches Product.handle
  author_name     text not null,
  author_location text,
  rating          smallint not null check (rating between 1 and 5),
  title           text not null,
  body            text not null,
  status          text not null default 'pending' check (status in ('pending','approved','rejected')),
  verified        boolean not null default false,
  source          text not null default 'customer' check (source in ('customer','admin')),
  helpful_count   integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists reviews_product_status_idx
  on public.reviews (product_handle, status, created_at desc);

drop trigger if exists reviews_touch on public.reviews;
create trigger reviews_touch
  before update on public.reviews
  for each row execute function public.touch_updated_at();

alter table public.reviews enable row level security;

drop policy if exists reviews_public_read_approved on public.reviews;
create policy reviews_public_read_approved
  on public.reviews for select to anon
  using (status = 'approved');

-- RLS is ROW-level, not COLUMN-level — the explicit column grant below is the
-- actual fix that keeps an anon caller from selecting internal columns.
revoke all on public.reviews from anon, authenticated;
grant select (id, product_handle, author_name, author_location, rating, title, body, verified, created_at)
  on public.reviews to anon;

-- --------------------------------------------------------------- review_images --
create table if not exists public.review_images (
  id         uuid primary key default gen_random_uuid(),
  review_id  uuid not null references public.reviews(id) on delete cascade,
  url        text not null,
  alt_text   text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists review_images_review_idx on public.review_images (review_id, sort_order);

alter table public.review_images enable row level security;

drop policy if exists review_images_public_read on public.review_images;
create policy review_images_public_read
  on public.review_images for select to anon
  using (exists (
    select 1 from public.reviews r
    where r.id = review_images.review_id and r.status = 'approved'
  ));

revoke all on public.review_images from anon, authenticated;
grant select on public.review_images to anon;

-- All writes (insert/update/delete) go through service-role server actions
-- only — same as `media`/`site_content` in 0001 — so no anon write policy is
-- defined here. Review photos reuse the existing `site-media` storage bucket
-- with folder = 'reviews'; no new bucket needed.
