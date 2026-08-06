"use server";

import { shopifyFetch, isShopifyConfigured } from "./client";
import { CART_CREATE_MUTATION, CART_BILLING_ADDRESS_UPDATE_MUTATION } from "./queries";
import { INDIAN_STATE_CODES } from "@/constants/india";

interface CartLineInput {
  variantId: string;
  quantity: number;
}

export interface CheckoutCustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface CartCreateResponse {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

interface CartBillingAddressUpdateResponse {
  cartBillingAddressUpdate: {
    cart: { id: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? fullName;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
  return { firstName, lastName };
}

/** Pre-fills Shopify's hosted checkout with the address already collected on our own
 * checkout form, so the shopper isn't asked to type it all over again. */
export async function createCheckoutUrl(
  lines: CartLineInput[],
  customer?: CheckoutCustomerInfo,
): Promise<string> {
  if (!isShopifyConfigured()) {
    throw new Error("Shopify Storefront API is not configured yet.");
  }

  const buyerIdentity = customer
    ? {
        email: customer.email || undefined,
        phone: `+91${customer.phone}`,
        countryCode: "IN",
      }
    : undefined;

  const delivery = customer
    ? {
        addresses: [
          {
            address: {
              deliveryAddress: {
                ...splitName(customer.fullName),
                address1: customer.address1,
                address2: customer.address2 || undefined,
                city: customer.city,
                provinceCode: INDIAN_STATE_CODES[customer.state as keyof typeof INDIAN_STATE_CODES],
                zip: customer.pincode,
                countryCode: "IN",
                phone: `+91${customer.phone}`,
              },
            },
            selected: true,
            oneTimeUse: true,
            validationStrategy: "COUNTRY_CODE_ONLY",
          },
        ],
      }
    : undefined;

  const data = await shopifyFetch<CartCreateResponse>({
    query: CART_CREATE_MUTATION,
    variables: {
      lines: lines.map((line) => ({ merchandiseId: line.variantId, quantity: line.quantity })),
      buyerIdentity,
      delivery,
    },
    revalidate: 0,
  });

  const { cart, userErrors } = data.cartCreate;

  if (userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join("; "));
  }

  if (!cart) {
    throw new Error("Shopify did not return a cart.");
  }

  if (customer) {
    // Best-effort — billing defaults to the same address so the shopper isn't asked
    // to fill it in again on Shopify's checkout. Never block checkout on this.
    try {
      await shopifyFetch<CartBillingAddressUpdateResponse>({
        query: CART_BILLING_ADDRESS_UPDATE_MUTATION,
        variables: {
          cartId: cart.id,
          billingAddress: {
            ...splitName(customer.fullName),
            address1: customer.address1,
            address2: customer.address2 || undefined,
            city: customer.city,
            province: customer.state,
            zip: customer.pincode,
            country: "India",
            phone: `+91${customer.phone}`,
          },
        },
        revalidate: 0,
      });
    } catch {
      // Non-fatal — proceed with checkout even if billing prefill fails.
    }
  }

  return cart.checkoutUrl;
}
