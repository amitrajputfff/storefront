import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

function verifyShopifyHmac(rawBody: string, hmacHeader: string | null, secret: string): boolean {
  if (!hmacHeader) return false;
  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const a = Buffer.from(digest);
  const b = Buffer.from(hmacHeader);
  return a.length === b.length && timingSafeEqual(a, b);
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
    // No-op: Shopify's native Facebook & Instagram sales channel already
    // reports Purchase to Meta for every order, COD included — sending our
    // own event here duplicated it (see checkout/success/page.tsx). Kept as
    // an explicit branch so this ack doesn't fall through to the product
    // cache revalidation below, which orders/create has no bearing on.
    return NextResponse.json({ topic });
  }

  // Any product create/update/delete invalidates the tagged product cache —
  // the next request rebuilds it from Shopify, so new products/categories
  // show up automatically without a redeploy.
  revalidateTag("shopify-products", { expire: 3600 });

  console.log(`[shopify-webhook] ${topic} — revalidated shopify-products`);

  return NextResponse.json({ revalidated: true, topic });
}
