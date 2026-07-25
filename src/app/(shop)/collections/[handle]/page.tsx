import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Filters } from "@/components/collection/filters";
import { SortDropdown } from "@/components/collection/sort-dropdown";
import { CollectionResults } from "@/components/collection/collection-results";
import { getCollectionByHandle, getAllCollectionHandles } from "@/mock/collections";
import { filterAndSortProducts } from "@/lib/filter-products";
import { SITE_NAME, SITE_URL } from "@/constants/site";

export async function generateStaticParams() {
  const handles = await getAllCollectionHandles();
  return handles.map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);
  if (!collection) return {};

  return {
    title: `${collection.title} | ${SITE_NAME}`,
    description: collection.description,
    alternates: { canonical: `${SITE_URL}/collections/${collection.handle}` },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { handle } = await params;
  const query = await searchParams;
  const collection = await getCollectionByHandle(handle);
  if (!collection) notFound();

  const filtered = filterAndSortProducts(collection.products, query);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <div className="relative mb-10 flex h-[30vh] min-h-[220px] items-end overflow-hidden rounded-2xl">
        <Image
          src={collection.image.url}
          alt={collection.image.altText}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 p-8 text-white">
          <h1 className="text-3xl font-medium tracking-tight md:text-4xl">{collection.title}</h1>
          <p className="mt-2 max-w-xl text-sm opacity-90">{collection.description}</p>
          <p className="mt-1 text-xs opacity-75">{collection.products.length} products</p>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <Filters products={collection.products} />
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              Showing {filtered.length} of {collection.products.length}
            </p>
            <SortDropdown />
          </div>
          <CollectionResults products={filtered} />
        </div>
      </div>
    </main>
  );
}
