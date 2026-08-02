export interface Money {
  amount: number;
  currencyCode: "INR";
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface Variant {
  id: string;
  title: string;
  sku: string;
  price: Money;
  compareAtPrice?: Money;
  selectedOptions: SelectedOption[];
  availableForSale: boolean;
  inventoryQuantity: number;
  image?: ProductImage;
}

/**
 * Not a closed set — a product's categories are whatever tags it carries in
 * Shopify (minus a few functional tags like "bestseller"), so a brand-new tag
 * becomes a valid category automatically. See lib/product-categories.ts.
 */
export type ProductCategory = string;

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  categories: ProductCategory[];
  tags: string[];
  images: ProductImage[];
  options: ProductOption[];
  variants: Variant[];
  priceRange: { min: Money; max: Money };
  compareAtPriceRange?: { min: Money; max: Money };
  rating: number;
  reviewCount: number;
  isBestseller: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  isLimitedTimeOffer: boolean;
  totalInventory: number;
  createdAt: string;
  materialsLine: string;
  recentPurchases?: number;
  careInstructions: string;
  shippingReturnsNote: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}

export interface AuthoredProduct {
  handle: string;
  title: string;
  description: string;
  category: ProductCategory;
  categories?: ProductCategory[];
  tags?: string[];
  images: ProductImage[];
  options?: ProductOption[];
  variants: AuthoredVariant[];
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isLimitedTimeOffer?: boolean;
  createdAt: string;
  materialsLine: string;
  recentPurchases?: number;
  careInstructions: string;
  shippingReturnsNote?: string;
}

export interface AuthoredVariant {
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  selectedOptions: SelectedOption[];
  availableForSale?: boolean;
  inventoryQuantity: number;
  image?: ProductImage;
}
