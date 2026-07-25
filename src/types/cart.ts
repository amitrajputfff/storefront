import { Money, ProductImage } from "./product";

export interface CartItem {
  id: string;
  productId: string;
  productHandle: string;
  variantId: string;
  title: string;
  variantTitle: string;
  image: ProductImage;
  price: Money;
  quantity: number;
  maxQuantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: Money;
  totalQuantity: number;
}
