import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/shared/reveal";
import { getFeatured } from "@/mock/collections";
import { featuredCollectionImage } from "@/mock/images";
import { routes } from "@/constants/routes";

export async function FeaturedCollection() {
  const collection = await getFeatured();
  if (collection.products.length === 0) return null;

  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
            <Image
              src={featuredCollectionImage.url}
              alt={featuredCollectionImage.altText}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
              Featured Collection
            </p>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
              {collection.title}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md">{collection.description}</p>
            <Button
              className="mt-6"
              render={<Link href={routes.collection(collection.handle)} />}
              nativeButton={false}
            >
              <span>Shop the Edit</span>
            </Button>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {collection.products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
