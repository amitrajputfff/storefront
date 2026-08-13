-- ============================================================================
-- ZEEVARA Meta Purchase event dedupe — schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS).
-- ============================================================================

-- Records which Shopify orders we've already sent a Purchase CAPI event for,
-- so a redelivered orders/create webhook (Shopify is at-least-once delivery)
-- can't fire a second, unmatched Purchase event for the same order.
create table if not exists public.meta_purchase_events (
  shopify_order_id bigint primary key,
  order_name        text not null,
  sent_at           timestamptz not null default now()
);

alter table public.meta_purchase_events enable row level security;

-- Only the service-role webhook handler ever touches this table — no anon
-- access needed at all.
revoke all on public.meta_purchase_events from anon, authenticated;
