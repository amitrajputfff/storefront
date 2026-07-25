"use client";

import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/product/product-card";

export function RecentlyViewed({ excludeHandle }: { excludeHandle?: string }) {
  const products = useRecentlyViewed(excludeHandle);

  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Recently Viewed</h2>
      <Carousel opts={{ align: "start" }} className="px-1">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
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
