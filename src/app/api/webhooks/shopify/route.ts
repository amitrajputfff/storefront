import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { sendPurchaseEvent } from "@/lib/meta-capi";
import { SITE_URL } from "@/constants/site";

interface ShopifyOrderWebhookPayload {
  id: number;
  email?: string | null;
  phone?: string | null;
  total_price: string;
  currency: string;
  landing_site?: string | null;
  browser_ip?: string | null;
  customer?: { email?: string | null; phone?: string | null } | null;
  line_items: { product_id: number | null; quantity: number }[];
}

async function handleOrderCreate(rawBody: string) {
  const order = JSON.parse(rawBody) as ShopifyOrderWebhookPayload;
  await sendPurchaseEvent({
    eventId: `shopify-order-${order.id}`,
    value: parseFloat(order.total_price),
    currency: order.currency,
    contentIds: order.line_items.map((li) => String(li.product_id)).filter(Boolean),
    numItems: order.line_items.reduce((sum, li) => sum + li.quantity, 0),
    email: order.email ?? order.customer?.email ?? null,
    phone: order.phone ?? order.customer?.phone ?? null,
    eventSourceUrl: order.landing_site ? `${SITE_URL}${order.landing_site}` : SITE_URL,
    clientIp: order.browser_ip ?? null,
  });
}

function verifyShopifyHmac(rawBody: string, hmacHeader: string | null, secret: string): boolean {
  if (!hmacHeader) return false;
  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const a = Buffer.from(digest);
  const b = Buffer.from(hmacHeader);
  return a.length === b.length && timingSafeEqual(a, b);
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

  // Any product create/update/delete invalidates the tagged product cache —
  // the next request rebuilds it from Shopify, so new products/categories
  // show up automatically without a redeploy.
  revalidateTag("shopify-products", { expire: 3600 });

  console.log(`[shopify-webhook] ${topic} — revalidated shopify-products`);

  if (topic === "orders/create") {
    try {
      await handleOrderCreate(rawBody);
    } catch (err) {
      console.error("[shopify-webhook] failed to send Purchase event", err);
    }
  }

  return NextResponse.json({ revalidated: true, topic });
}
