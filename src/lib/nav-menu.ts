import { NavMenu } from "@/types";
import { categoryImages } from "@/mock/images";
import { getNewArrivals, getDeals } from "@/mock/collections";
import { routes } from "@/constants/routes";
import { getActiveCategories } from "./categories-with-products";

export async function getNavMenu(): Promise<NavMenu> {
  const [activeCategories, newArrivals, deals] = await Promise.all([
    getActiveCategories(),
    getNewArrivals(),
    getDeals(),
  ]);

  const promos: NavMenu["promos"] = [];
  if (newArrivals.products.length > 0) {
    promos.push({
      label: "New Arrivals",
      href: routes.collection("new-arrivals"),
      image: categoryImages["home-decor"][3],
    });
  }
  if (deals.products.length > 0) {
    promos.push({
      label: "This Week's Deals",
      href: routes.collection("deals"),
      image: categoryImages.accessories[0],
    });
  }

  return {
    columns: activeCategories.map((category) => ({
      heading: category.name,
      categoryHandle: category.handle,
      links: [
        { label: `All ${category.name}`, href: routes.collection(category.handle) },
        { label: "Best Sellers", href: `${routes.collection(category.handle)}?sort=best-selling` },
        { label: "New In", href: `${routes.collection(category.handle)}?sort=newest` },
      ],
    })),
    promos,
  };
}
