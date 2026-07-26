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

  return NextResponse.json({ revalidated: true, topic });
}
