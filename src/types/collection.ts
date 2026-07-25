import { ProductImage } from "./product";

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ProductImage;
  productIds: string[];
}

export interface CategoryDef {
  handle: string;
  name: string;
  description: string;
  image: ProductImage;
}
