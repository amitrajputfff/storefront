"use server";

import { shopifyFetch, isShopifyConfigured } from "./client";
import { CART_CREATE_MUTATION } from "./queries";

interface CartLineInput {
  variantId: string;
  quantity: number;
}

interface CartCreateResponse {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

export async function createCheckoutUrl(lines: CartLineInput[]): Promise<string> {
  if (!isShopifyConfigured()) {
    throw new Error("Shopify Storefront API is not configured yet.");
  }

  const data = await shopifyFetch<CartCreateResponse>({
    query: CART_CREATE_MUTATION,
    variables: {
      lines: lines.map((line) => ({ merchandiseId: line.variantId, quantity: line.quantity })),
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

  return cart.checkoutUrl;
}
