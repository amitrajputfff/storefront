"use server";

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
  discountPercent?: number;
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
  const totalQuantity = input.lineItems.reduce((sum, line) => sum + line.quantity, 0);

  try {
    const createData = await adminFetch<DraftOrderCreateResponse>(DRAFT_ORDER_CREATE_MUTATION, {
      input: {
        lineItems: input.lineItems.map((line) => ({
          variantId: line.variantId,
          quantity: line.quantity,
        })),
        email: input.customer.email || undefined,
        shippingAddress: {
          firstName,
          lastName,
          address1: input.customer.address1,
          address2: input.customer.address2 || undefined,
          city: input.customer.city,
          province: input.customer.state,
          zip: input.customer.pincode,
          country: "India",
          phone: input.customer.phone,
        },
        note: "Cash on Delivery order via storefront checkout",
        tags: ["COD", "storefront-checkout"],
        ...(input.discountPercent && input.discountPercent > 0
          ? {
              appliedDiscount: {
                value: input.discountPercent,
                valueType: "PERCENTAGE",
                title: `Buy ${totalQuantity} discount`,
              },
            }
          : {}),
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
  } catch {
    return {
      success: false,
      error: "Something went wrong placing your order — please try again.",
    };
  }
}
