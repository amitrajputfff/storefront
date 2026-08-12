"use server";

import { headers } from "next/headers";
import { adminFetch, isShopifyAdminConfigured } from "./admin-client";

const DRAFT_ORDER_CREATE_MUTATION = `
  mutation DraftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder { id }
      userErrors { field message }
    }
  }
`;

const DRAFT_ORDER_COMPLETE_MUTATION = `
  mutation DraftOrderComplete($id: ID!) {
    draftOrderComplete(id: $id, paymentPending: true) {
      draftOrder {
        order { id name }
      }
      userErrors { field message }
    }
  }
`;

interface DraftOrderCreateResponse {
  draftOrderCreate: {
    draftOrder: { id: string } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
}

interface DraftOrderCompleteResponse {
  draftOrderComplete: {
    draftOrder: { order: { id: string; name: string } | null } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
}

export interface CreateCodOrderInput {
  lineItems: { variantId: string; quantity: number }[];
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  metaCookies?: { fbp?: string; fbc?: string };
}

export type CreateCodOrderResult =
  | { success: true; orderName: string }
  | { success: false; error: string };

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? fullName;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
  return { firstName, lastName };
}

function toE164IndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (phone.startsWith("+")) return phone;
  return `+${digits}`;
}

/** Places a COD order directly in Shopify via a draft order completed with payment pending
 * (i.e. unpaid until cash is collected on delivery) — bypasses Shopify's hosted checkout. */
export async function createCodOrder(input: CreateCodOrderInput): Promise<CreateCodOrderResult> {
  if (!isShopifyAdminConfigured()) {
    return {
      success: false,
      error: "Cash on Delivery isn't available right now — please pay online instead.",
    };
  }

  if (input.lineItems.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  const { firstName, lastName } = splitName(input.customer.fullName);
  const phone = toE164IndianPhone(input.customer.phone);

  // COD orders are completed via the Admin API, not Shopify's hosted checkout, so
  // there's no browser session for Shopify to capture client_details from. We carry
  // our own capture through as note attributes for the orders/create CAPI webhook.
  const requestHeaders = await headers();
  const clientIp = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientUserAgent = requestHeaders.get("user-agent") ?? undefined;
  const customAttributes = [
    input.metaCookies?.fbp ? { key: "fbp", value: input.metaCookies.fbp } : null,
    input.metaCookies?.fbc ? { key: "fbc", value: input.metaCookies.fbc } : null,
    clientIp ? { key: "client_ip", value: clientIp } : null,
    clientUserAgent ? { key: "client_user_agent", value: clientUserAgent } : null,
  ].filter((a): a is { key: string; value: string } => a !== null);

  try {
    const createData = await adminFetch<DraftOrderCreateResponse>(DRAFT_ORDER_CREATE_MUTATION, {
      input: {
        lineItems: input.lineItems.map((line) => ({
          variantId: line.variantId,
          quantity: line.quantity,
        })),
        email: input.customer.email || undefined,
        phone,
        shippingAddress: {
          firstName,
          lastName,
          address1: input.customer.address1,
          address2: input.customer.address2 || undefined,
          city: input.customer.city,
          province: input.customer.state,
          zip: input.customer.pincode,
          country: "India",
          phone,
        },
        note: "Cash on Delivery order via storefront checkout",
        tags: ["COD", "storefront-checkout"],
        customAttributes,
      },
    });

    const createErrors = createData.draftOrderCreate.userErrors;
    if (createErrors.length > 0) {
      return { success: false, error: createErrors.map((e) => e.message).join("; ") };
    }

    const draftOrderId = createData.draftOrderCreate.draftOrder?.id;
    if (!draftOrderId) {
      return { success: false, error: "Shopify did not return a draft order." };
    }

    const completeData = await adminFetch<DraftOrderCompleteResponse>(
      DRAFT_ORDER_COMPLETE_MUTATION,
      { id: draftOrderId },
    );

    const completeErrors = completeData.draftOrderComplete.userErrors;
    if (completeErrors.length > 0) {
      return { success: false, error: completeErrors.map((e) => e.message).join("; ") };
    }

    const order = completeData.draftOrderComplete.draftOrder?.order;
    if (!order) {
      return { success: false, error: "Shopify did not return an order." };
    }

    return { success: true, orderName: order.name };
  } catch (error) {
    console.error("Creating COD order failed:", error);
    return {
      success: false,
      error: "Something went wrong placing your order — please try again.",
    };
  }
}
