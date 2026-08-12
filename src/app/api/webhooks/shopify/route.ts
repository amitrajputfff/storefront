import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { sendPurchaseCapiEvent } from "@/lib/shopify/meta-capi";
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
  line_items: { variant_id: number | null; product_id: number | null; quantity: number }[];
  note_attributes?: { name: string; value: string }[];
  client_details?: { browser_ip?: string; user_agent?: string } | null;
}

function noteAttribute(payload: ShopifyOrderWebhookPayload, name: string): string | undefined {
  return payload.note_attributes?.find((a) => a.name === name)?.value;
}

async function handleOrderCreate(rawBody: string) {
  const order: ShopifyOrderWebhookPayload = JSON.parse(rawBody);

  await sendPurchaseCapiEvent({
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
    // Real checkout orders (online payment) carry Shopify's own browser session
    // details; COD orders (completed via Admin API, no checkout session) fall
    // back to what we captured ourselves at submit time — see create-order.ts.
    clientIp: order.client_details?.browser_ip ?? noteAttribute(order, "client_ip"),
    clientUserAgent: order.client_details?.user_agent ?? noteAttribute(order, "client_user_agent"),
  });
}

export async function POST(request: NextRequest) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");

  if (!verifyShopifyHmac(rawBody, hmacHeader, secret)) {
    return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic") ?? "unknown";

  if (topic === "orders/create") {
    await handleOrderCreate(rawBody);
    console.log(`[shopify-webhook] ${topic} — sent Purchase CAPI event`);
    return NextResponse.json({ topic });
  }

  // Any product create/update/delete invalidates the tagged product cache —
  // the next request rebuilds it from Shopify, so new products/categories
  // show up automatically without a redeploy.
  revalidateTag("shopify-products", { expire: 3600 });

  console.log(`[shopify-webhook] ${topic} — revalidated shopify-products`);

  return NextResponse.json({ revalidated: true, topic });
}
