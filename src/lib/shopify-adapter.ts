/**
 * Placeholder for the future Shopify Storefront API integration.
 *
 * Every `types/*` shape in this project (Product, Variant, Collection, Money...) is
 * modeled to map ~1:1 onto Shopify's Storefront API GraphQL types. When wiring in the
 * real API, only `mock/products/index.ts`'s accessor functions (getAllProducts,
 * getProductByHandle, getCollectionByHandle, ...) need to be replaced with GraphQL
 * fetches that return the same shapes — no changes should be required in components
 * or pages, since they only ever import from those accessor functions.
 *
 * Expected mapping:
 *  - Product.id            -> Shopify Product.id (gid://shopify/Product/...)
 *  - Product.priceRange    -> Product.priceRange { minVariantPrice, maxVariantPrice }
 *  - Variant               -> ProductVariant (price/compareAtPrice as MoneyV2 strings,
 *                             convert to the numeric Money shape used here)
 *  - Collection.productIds -> Collection.products edges
 *
 * Not implemented — intentionally left as documentation only until a Storefront API
 * token/domain is available.
 */
export {};
