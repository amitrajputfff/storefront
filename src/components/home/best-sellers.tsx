import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { getBestSellers } from "@/mock/collections";
import { routes } from "@/constants/routes";

export async function BestSellers() {
  const collection = await getBestSellers();
  if (collection.products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <SectionHeading
        eyebrow="Customer favorites"
        title="Best Sellers"
        action={{ label: "Shop All", href: routes.collection("best-sellers") }}
        className="mb-10"
      />
      <Carousel opts={{ align: "start" }} className="px-1">
        <CarouselContent>
          {collection.products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
