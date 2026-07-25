import { Money, ProductImage } from "./product";

export interface WishlistItem {
  productId: string;
  handle: string;
  title: string;
  image: ProductImage;
  price: Money;
  addedAt: string;
}
