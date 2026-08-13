import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse, after } from "next/server";
import { sendPurchaseCapiEvent } from "@/lib/shopify/meta-capi";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin-client";
import { SITE_URL } from "@/constants/site";

function verifyShopifyHmac(rawBody: string, hmacHeader: string | null, secret: string): boolean {
  if (!hmacHeader) return false;
  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const a = Buffer.from(digest);
  const b = Buffer.from(hmacHeader);
  return a.length === b.length && timingSafeEqual(a, b);
}

interface ShopifyOrderWebhookPayload {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  total_price: string;
  currency: string;
  tags?: string;
  line_items: { variant_id: number | null; product_id: number | null; quantity: number }[];
  note_attributes?: { name: string; value: string }[];
  client_details?: { browser_ip?: string; user_agent?: string } | null;
}

function noteAttribute(payload: ShopifyOrderWebhookPayload, name: string): string | undefined {
  return payload.note_attributes?.find((a) => a.name === name)?.value;
}

/** True for orders placed via our own COD flow (see create-order.ts, which
 * tags every draft order it completes with "COD"). */
function isCodOrder(order: ShopifyOrderWebhookPayload): boolean {
  return (order.tags ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .includes("cod");
}

async function handleOrderCreate(rawBody: string) {
  const order: ShopifyOrderWebhookPayload = JSON.parse(rawBody);

  // Shopify's native Facebook & Instagram sales channel already reports
  // Purchase for orders placed through its own hosted checkout — confirmed
  // live in Events Manager. Sending our own event for those too creates a
  // second, unmatched Purchase (different event_id) that Meta can't dedupe
  // against the native one, double-counting the order. COD orders are placed
  // via the Admin API and never touch that checkout, so the native channel
  // doesn't see them at all — we're the only source for those, and only those.
  if (!isCodOrder(order)) {
    console.log(`[shopify-webhook] orders/create ${order.name} — skipped Meta CAPI (non-COD, native channel covers it)`);
    return;
  }

  // Belt-and-braces idempotency: Shopify's webhook delivery is at-least-once
  // and can redeliver the same orders/create payload (e.g. after a timeout),
  // which would otherwise fire a second Purchase event for the same order.
  if (isSupabaseAdminConfigured()) {
    const { error: dedupeError } = await getSupabaseAdminClient()
      .from("meta_purchase_events")
      .insert({ shopify_order_id: order.id, order_name: order.name });

    if (dedupeError) {
      const alreadySent = dedupeError.code === "23505"; // unique_violation
      console.log(
        `[shopify-webhook] orders/create ${order.name} — skipped Meta CAPI (${
          alreadySent ? "already sent" : `dedupe check failed: ${dedupeError.message}`
        })`,
      );
      return;
    }
  }

  const capiInput = {
    eventId: order.name,
    eventSourceUrl: `${SITE_URL}/checkout/success?order=${encodeURIComponent(order.name)}`,
    value: Number(order.total_price),
    currency: order.currency,
    contentIds: order.line_items.map((line) => String(line.variant_id ?? line.product_id)),
    numItems: order.line_items.reduce((sum, line) => sum + line.quantity, 0),
    email: order.email,
    phone: order.phone,
    fbp: noteAttribute(order, "fbp"),
    fbc: noteAttribute(order, "fbc"),
    // COD orders are completed via the Admin API, so there's no browser
    // session for Shopify to capture client_details from — fall back to what
    // we captured ourselves at submit time (see create-order.ts).
    clientIp: order.client_details?.browser_ip ?? noteAttribute(order, "client_ip"),
    clientUserAgent: order.client_details?.user_agent ?? noteAttribute(order, "client_user_agent"),
  };

  // Ack Shopify immediately rather than making it wait on Meta's API — a slow
  // Meta call could otherwise trip Shopify's delivery timeout and trigger a
  // retry (i.e. a second delivery) while the first is still in flight.
  after(async () => {
    try {
      await sendPurchaseCapiEvent(capiInput);
      console.log(`[shopify-webhook] ${order.name} — sent Purchase CAPI event`);
    } catch (error) {
      console.error(`[shopify-webhook] ${order.name} — Purchase CAPI event failed`, error);
    }
  });
}

export async function POST(request: NextRequest) {
  // Different webhook topics can be signed with different secrets depending on
  // how they were registered — e.g. topics set up via Settings > Notifications
  // use the account-level signing secret shown there, while topics registered
  // by the app itself (Dev Dashboard webhook config / Admin API subscriptions)
  // are signed with the app's Client Secret. Accept either.
  const candidateSecrets = [process.env.SHOPIFY_WEBHOOK_SECRET, process.env.SHOPIFY_ADMIN_CLIENT_SECRET].filter(
    (s): s is string => Boolean(s),
  );
  if (candidateSecrets.length === 0) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");

  const topic = request.headers.get("x-shopify-topic") ?? "unknown";

  if (!candidateSecrets.some((secret) => verifyShopifyHmac(rawBody, hmacHeader, secret))) {
    console.error(`[shopify-webhook] HMAC verification failed for topic "${topic}"`, {
      webhookId: request.headers.get("x-shopify-webhook-id"),
      apiVersion: request.headers.get("x-shopify-api-version"),
      triggeredAt: request.headers.get("x-shopify-triggered-at"),
    });
    return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
  }

  if (topic === "orders/create") {
    // handleOrderCreate logs its own outcome (sent / skipped / deduped) — the
    // Meta send itself runs after this response via after(), so awaiting it
    // here only covers the fast dedupe check, not the slow API call.
    await handleOrderCreate(rawBody);
    return NextResponse.json({ topic });
  }

  // Any product create/update/delete invalidates the tagged product cache —
  // the next request rebuilds it from Shopify, so new products/categories
  // show up automatically without a redeploy.
  revalidateTag("shopify-products", { expire: 3600 });

  console.log(`[shopify-webhook] ${topic} — revalidated shopify-products`);

  return NextResponse.json({ revalidated: true, topic });
}
