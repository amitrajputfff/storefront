import { routes } from "./routes";

export interface PrimaryNavItem {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
}

export const PRIMARY_NAV: PrimaryNavItem[] = [
  { label: "Shop", href: routes.shop() },
  { label: "Categories", href: routes.shop(), hasMegaMenu: true },
  { label: "New Arrivals", href: routes.collection("new-arrivals") },
  { label: "Deals", href: routes.collection("deals") },
  { label: "About Us", href: routes.about() },
];
