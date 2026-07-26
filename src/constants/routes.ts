export const routes = {
  home: () => "/",
  shop: () => "/collections",
  collection: (handle: string) => `/collections/${handle}`,
  product: (handle: string) => `/products/${handle}`,
  search: (query?: string) =>
    query ? `/search?q=${encodeURIComponent(query)}` : "/search",
  cart: () => "/cart",
  wishlist: () => "/wishlist",
  trackOrder: () => "/track-order",
  about: () => "/about",
  contact: () => "/contact",
  faq: () => "/faq",
  privacy: () => "/privacy",
  terms: () => "/terms",
  shippingPolicy: () => "/shipping-policy",
  returnPolicy: () => "/return-policy",
} as const;
