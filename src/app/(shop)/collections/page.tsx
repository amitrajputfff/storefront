import { Metadata } from "next";
import { Filters } from "@/components/collection/filters";
import { SortDropdown } from "@/components/collection/sort-dropdown";
import { CollectionResults } from "@/components/collection/collection-results";
import { getAllProducts } from "@/mock/products";
import { filterAndSortProducts } from "@/lib/filter-products";
import { SectionHeading } from "@/components/shared/section-heading";
import { SITE_NAME } from "@/constants/site";

export const metadata: Metadata = {
  title: `Shop All | ${SITE_NAME}`,
  description: "Browse the full ZEEVARA catalog — considered objects for everyday life.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const query = await searchParams;
  const allProducts = await getAllProducts();
  const filtered = filterAndSortProducts(allProducts, query);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <SectionHeading title="Shop All" description="Every ZEEVARA product, in one place." className="mb-10" />

      <div className="flex flex-col gap-8 lg:flex-row">
        <Filters products={allProducts} />
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              Showing {filtered.length} of {allProducts.length}
            </p>
            <SortDropdown />
          </div>
          <CollectionResults products={filtered} />
        </div>
      </div>
    </main>
  );
}
