-- ============================================================================
-- ZEEVARA Product Overrides — schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / OR REPLACE).
-- Depends on 0001_admin_cms.sql (touch_updated_at()).
-- ============================================================================

-- Admin-editable overrides layered on top of whatever the live product source
-- says (real Shopify Storefront API, or the local mock catalog when Shopify
-- isn't configured) — see src/mock/products/index.ts. Deliberately does NOT
-- include price/variants/inventory/options: those must stay driven by the
-- real source so what's shown always matches what checkout actually
-- charges/fulfills against a real Shopify order. compare_at_price is the
-- exception — it's just the "was ₹X" display figure, never what's actually
-- charged, so it's safe to override independently for perceived-discount
-- copy without touching the real price.
create table if not exists public.product_overrides (
  product_handle        text primary key,   -- matches Product.handle
  title                  text,
  description            text,
  description_html       text,
  images                  jsonb,             -- ProductImage[] — null/absent = use source data
  compare_at_price        numeric,           -- INR "was" price shown for discount %, null = use source data
  materials_line          text,
  care_instructions       text,
  shipping_returns_note   text,
  updated_at              timestamptz not null default now()
);

drop trigger if exists product_overrides_touch on public.product_overrides;
create trigger product_overrides_touch
  before update on public.product_overrides
  for each row execute function public.touch_updated_at();

alter table public.product_overrides enable row level security;
-- No anon policies. Overrides are read server-side (product data fetching in
-- src/mock/products/index.ts is already "use server") via the service-role
-- client, never queried directly from the browser.
revoke all on public.product_overrides from anon, authenticated;
