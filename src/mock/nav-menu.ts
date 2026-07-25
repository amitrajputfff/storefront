import { NavMenu } from "@/types";
import { categories } from "./categories";
import { categoryImages } from "./images";
import { routes } from "@/constants/routes";

export const navMenu: NavMenu = {
  columns: categories.map((category) => ({
    heading: category.name,
    categoryHandle: category.handle,
    links: [
      { label: `All ${category.name}`, href: routes.collection(category.handle) },
      { label: "Best Sellers", href: `${routes.collection(category.handle)}?sort=best-selling` },
      { label: "New In", href: `${routes.collection(category.handle)}?sort=newest` },
    ],
  })),
  promos: [
    {
      label: "New Arrivals",
      href: routes.collection("new-arrivals"),
      image: categoryImages["home-decor"][3],
    },
    {
      label: "This Week's Deals",
      href: routes.collection("deals"),
      image: categoryImages.accessories[0],
    },
  ],
};
