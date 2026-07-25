import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { getTrending } from "@/mock/collections";
import { routes } from "@/constants/routes";

export async function TrendingProducts() {
  const collection = await getTrending();
  if (collection.products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <SectionHeading
        eyebrow="What's popular"
        title="Trending This Week"
        action={{ label: "Shop All", href: routes.collection("trending") }}
        className="mb-10"
      />
      <ProductGrid products={collection.products.slice(0, 8)} />
    </section>
  );
}
