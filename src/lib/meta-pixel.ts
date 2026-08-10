declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const FBQ_RETRY_DELAY_MS = 250;
const FBQ_MAX_RETRIES = 20;

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (window.fbq) {
    window.fbq(...args);
    return;
  }
  retryFbq(args, 1);
}

function retryFbq(args: unknown[], attempt: number) {
  if (typeof window === "undefined" || attempt > FBQ_MAX_RETRIES) return;
  window.setTimeout(() => {
    if (window.fbq) {
      window.fbq(...args);
      return;
    }
    retryFbq(args, attempt + 1);
  }, FBQ_RETRY_DELAY_MS);
}

// Meta's catalog (synced by Shopify's Facebook & Instagram channel) keys items by
// the plain numeric Shopify ID, not the "gid://shopify/..." string the Storefront API returns.
function toCatalogId(gid: string): string {
  const match = gid.match(/(\d+)$/);
  return match ? match[1] : gid;
}

export function trackPageView() {
  fbq("track", "PageView");
}

export function trackViewContent(params: {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
}) {
  fbq("track", "ViewContent", {
    content_ids: [toCatalogId(params.contentId)],
    content_name: params.contentName,
    content_type: "product",
    value: params.value,
    currency: params.currency,
  });
}

export function trackAddToCart(params: {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
  quantity: number;
}) {
  const catalogId = toCatalogId(params.contentId);
  fbq("track", "AddToCart", {
    content_ids: [catalogId],
    content_name: params.contentName,
    content_type: "product",
    value: params.value,
    currency: params.currency,
    contents: [{ id: catalogId, quantity: params.quantity }],
  });
}

export function trackInitiateCheckout(params: {
  contentIds: string[];
  value: number;
  currency: string;
  numItems: number;
}) {
  fbq("track", "InitiateCheckout", {
    content_ids: params.contentIds.map(toCatalogId),
    content_type: "product",
    value: params.value,
    currency: params.currency,
    num_items: params.numItems,
  });
}

export function trackPurchase(params: {
  orderId: string;
  contentIds: string[];
  value: number;
  currency: string;
  numItems: number;
}) {
  fbq(
    "track",
    "Purchase",
    {
      content_ids: params.contentIds.map(toCatalogId),
      content_type: "product",
      value: params.value,
      currency: params.currency,
      num_items: params.numItems,
    },
    { eventID: params.orderId },
  );
}
