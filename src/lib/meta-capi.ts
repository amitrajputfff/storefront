import { createHash } from "node:crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN;

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function isMetaCapiConfigured(): boolean {
  return Boolean(PIXEL_ID && ACCESS_TOKEN);
}

export interface PurchaseEventInput {
  eventId: string;
  value: number;
  currency: string;
  contentIds: string[];
  numItems: number;
  email?: string | null;
  phone?: string | null;
  eventSourceUrl?: string | null;
  clientIp?: string | null;
}

// Server-side mirror of the client Purchase event: Shopify's hosted checkout
// lives on a different domain than the storefront pixel, so this is the only
// place a completed order ever reaches Meta. event_id lets Meta dedupe against
// a future client-side Purchase event, should one ever get added.
export async function sendPurchaseEvent(input: PurchaseEventInput): Promise<void> {
  if (!isMetaCapiConfigured()) return;

  const userData: Record<string, string | string[]> = {};
  if (input.email) userData.em = [sha256(input.email)];
  if (input.phone) userData.ph = [sha256(input.phone.replace(/\D/g, ""))];
  if (input.clientIp) userData.client_ip_address = input.clientIp;

  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl ?? undefined,
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
  };

  const res = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error(`[meta-capi] Purchase event failed: ${res.status} ${await res.text()}`);
  }
}
