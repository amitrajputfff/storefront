import { Metadata } from "next";
import { SearchBar } from "@/components/collection/search-bar";
import { SortDropdown } from "@/components/collection/sort-dropdown";
import { CollectionResults } from "@/components/collection/collection-results";
import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { searchProducts, getAllProducts } from "@/mock/products";
import { getCategoryByHandle, categories } from "@/mock/categories";
import { filterAndSortProducts } from "@/lib/filter-products";
import { routes } from "@/constants/routes";
import { SITE_NAME } from "@/constants/site";
import { SearchX } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Search | ${SITE_NAME}`,
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const query = await searchParams;
  const q = query.q ?? "";
  const matches = q ? await searchProducts(q) : [];
  const filtered = filterAndSortProducts(matches, query);

  const fallbackCategories = categories.slice(0, 3);
  const bestSellers = q && matches.length === 0 ? (await getAllProducts()).filter((p) => p.isBestseller).slice(0, 4) : [];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <div className="mb-10 space-y-4">
        <h1 className="text-2xl font-medium md:text-3xl">
          {q ? `Results for "${q}"` : "Search"}
        </h1>
        <SearchBar initialQuery={q} />
      </div>

      {q && matches.length > 0 && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">{filtered.length} results</p>
          <SortDropdown />
        </div>
      )}

      {q && matches.length === 0 ? (
        <div className="space-y-12">
          <EmptyState
            icon={SearchX}
            title={`We couldn't find anything for "${q}"`}
            description="Try a different search term, or explore a popular category below."
          />
          <div className="flex flex-wrap justify-center gap-3">
            {fallbackCategories.map((c) => (
              <Link
                key={c.handle}
                href={routes.collection(c.handle)}
                className="rounded-full border px-4 py-2 text-sm hover:bg-muted"
              >
                {c.name}
              </Link>
            ))}
          </div>
          {bestSellers.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-medium">Best Sellers</h2>
              <ProductGrid products={bestSellers} />
            </div>
          )}
        </div>
      ) : q ? (
        <CollectionResults products={filtered} />
      ) : (
        <p className="text-muted-foreground text-sm">
          Start typing to search the ZEEVARA catalog.
        </p>
      )}
    </main>
  );
}
