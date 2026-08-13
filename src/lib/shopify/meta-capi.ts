import { createHash } from "node:crypto";

const CAPI_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export interface CapiPurchaseInput {
  eventId: string;
  eventSourceUrl: string;
  value: number;
  currency: string;
  contentIds: string[];
  numItems: number;
  email?: string;
  phone?: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  clientUserAgent?: string;
}

/** Client-side trackPurchase was removed (see checkout/success/page.tsx) since
 * Shopify's native Facebook & Instagram sales channel already reports Purchase
 * for orders placed through its hosted checkout. This is fired from the
 * orders/create webhook for COD orders ONLY (see isCodOrder() in the webhook
 * route) — the one case that native channel doesn't see, since COD orders are
 * completed via the Admin API and never touch that checkout. */
export async function sendPurchaseCapiEvent(input: CapiPurchaseInput): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    console.warn("[meta-capi] Skipped — NEXT_PUBLIC_META_PIXEL_ID or META_CAPI_ACCESS_TOKEN not set.");
    return;
  }

  const userData: Record<string, unknown> = {};
  if (input.email) userData.em = [sha256(input.email)];
  if (input.phone) userData.ph = [sha256(input.phone.replace(/\D/g, ""))];
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: userData,
        custom_data: {
          currency: input.currency,
          value: input.value,
          content_ids: input.contentIds,
          content_type: "product",
          num_items: input.numItems,
        },
      },
    ],
    ...(process.env.META_CAPI_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE }
      : {}),
  };

  const res = await fetch(
    `https://graph.facebook.com/${CAPI_VERSION}/${pixelId}/events?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    console.error(`[meta-capi] Purchase event failed: ${res.status} ${body}`);
  }
}
