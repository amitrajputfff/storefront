import { ProductImage } from "./product";

export interface MegaMenuLink {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  heading: string;
  categoryHandle: string;
  links: MegaMenuLink[];
}

export interface MegaMenuPromo {
  label: string;
  href: string;
  image: ProductImage;
}

export interface NavMenu {
  columns: MegaMenuColumn[];
  promos: MegaMenuPromo[];
}
