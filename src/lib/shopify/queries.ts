export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    tags
    createdAt
    totalInventory
    images(first: 20) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    options {
      name
      values
    }
    priceRange {
      minVariantPrice {
        amount
      }
      maxVariantPrice {
        amount
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
      }
      maxVariantPrice {
        amount
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          sku
          availableForSale
          quantityAvailable
          price {
            amount
          }
          compareAtPrice {
            amount
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    rating: metafield(namespace: "custom", key: "rating") {
      value
    }
    reviewCount: metafield(namespace: "custom", key: "review_count") {
      value
    }
    materialsLine: metafield(namespace: "custom", key: "materials_line") {
      value
    }
    careInstructions: metafield(namespace: "custom", key: "care_instructions") {
      value
    }
    shippingReturnsNote: metafield(namespace: "custom", key: "shipping_returns_note") {
      value
    }
    recentPurchases: metafield(namespace: "custom", key: "recent_purchases") {
      value
    }
    minDeliveryDays: metafield(namespace: "custom", key: "min_delivery_days") {
      value
    }
    maxDeliveryDays: metafield(namespace: "custom", key: "max_delivery_days") {
      value
    }
  }
`;

export const ALL_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query AllProducts($first: Int = 250) {
    products(first: $first) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFragment
    }
  }
`;

export const SEARCH_PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query SearchProducts($query: String!, $first: Int = 20) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!, $buyerIdentity: CartBuyerIdentityInput, $delivery: CartDeliveryInput) {
    cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity, delivery: $delivery }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;
