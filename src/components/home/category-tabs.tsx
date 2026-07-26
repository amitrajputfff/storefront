import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { categories } from "@/mock/categories";
import { getProductsByCategory } from "@/mock/products";
import { routes } from "@/constants/routes";

const FEATURED_HANDLES = [
  "home-decor",
  "kitchen",
  "office",
  "travel",
  "fitness",
  "beauty",
];

export async function CategoryTabs() {
  const candidates = categories.filter((c) => FEATURED_HANDLES.includes(c.handle));
  const productsByCandidate = await Promise.all(
    candidates.map((c) => getProductsByCategory(c.handle)),
  );

  const featured = candidates.filter((_, index) => productsByCandidate[index].length > 0);
  const productsByCategory = productsByCandidate.filter((products) => products.length > 0);

  if (featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <SectionHeading eyebrow="Browse" title="Shop by Category" className="mb-10" />

      <Tabs defaultValue={featured[0]?.handle}>
        <TabsList variant="line" className="mb-8 w-full justify-start overflow-x-auto">
          {featured.map((category) => (
            <TabsTrigger key={category.handle} value={category.handle}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {featured.map((category, index) => (
          <TabsContent key={category.handle} value={category.handle}>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{category.description}</p>
              <Link
                href={routes.collection(category.handle)}
                className="shrink-0 text-sm font-medium underline underline-offset-4"
              >
                Shop All
              </Link>
            </div>
            <ProductGrid products={productsByCategory[index].slice(0, 4)} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
