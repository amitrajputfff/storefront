"use server";

import { adminFetch, isShopifyAdminConfigured } from "@/lib/shopify/admin-client";

export interface TrackedOrder {
  name: string;
  confirmationNumber: string;
  createdAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  total: { amount: string; currencyCode: string };
  trackingNumber?: string;
  trackingUrl?: string;
  trackingCompany?: string;
  lineItems: { title: string; quantity: number; imageUrl?: string }[];
  shippingCity?: string;
}

export interface TrackOrderResult {
  success: boolean;
  order?: TrackedOrder;
  error?: string;
}

const ORDER_QUERY = `
  query FindOrder($query: String!) {
    orders(first: 1, query: $query) {
      nodes {
        name
        confirmationNumber
        createdAt
        displayFulfillmentStatus
        displayFinancialStatus
        totalPriceSet { shopMoney { amount currencyCode } }
        shippingAddress { city }
        fulfillments(first: 1) {
          trackingInfo(first: 1) { number url company }
        }
        lineItems(first: 20) {
          nodes { title quantity image { url } }
        }
      }
    }
  }
`;

interface ShopifyOrderNode {
  name: string;
  confirmationNumber: string;
  createdAt: string;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  shippingAddress: { city: string | null } | null;
  fulfillments: { trackingInfo: { number: string | null; url: string | null; company: string | null }[] }[];
  lineItems: { nodes: { title: string; quantity: number; image: { url: string } | null }[] };
}

export async function trackOrder(
  orderNumberInput: string,
  emailInput: string,
): Promise<TrackOrderResult> {
  if (!isShopifyAdminConfigured()) {
    return { success: false, error: "Order tracking is not configured yet." };
  }

  const orderNumber = orderNumberInput.replace(/\D/g, "");
  const email = emailInput.trim().toLowerCase();

  if (!orderNumber || !email) {
    return { success: false, error: "Enter both your order number and email." };
  }

  try {
    const data = await adminFetch<{ orders: { nodes: ShopifyOrderNode[] } }>(ORDER_QUERY, {
      query: `name:${orderNumber} email:${email}`,
    });

    const node = data.orders.nodes[0];
    if (!node) {
      return {
        success: false,
        error: "We couldn't find an order matching that order number and email.",
      };
    }

    const tracking = node.fulfillments[0]?.trackingInfo?.[0];

    return {
      success: true,
      order: {
        name: node.name,
        confirmationNumber: node.confirmationNumber,
        createdAt: node.createdAt,
        fulfillmentStatus: node.displayFulfillmentStatus,
        financialStatus: node.displayFinancialStatus,
        total: node.totalPriceSet.shopMoney,
        trackingNumber: tracking?.number ?? undefined,
        trackingUrl: tracking?.url ?? undefined,
        trackingCompany: tracking?.company ?? undefined,
        shippingCity: node.shippingAddress?.city ?? undefined,
        lineItems: node.lineItems.nodes.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          imageUrl: item.image?.url,
        })),
      },
    };
  } catch {
    return { success: false, error: "Something went wrong — please try again in a moment." };
  }
}
