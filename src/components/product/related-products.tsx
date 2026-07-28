import { Product } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MinimalProductCard } from "@/components/product/minimal-product-card";

export function RelatedProducts({
  products,
  title = "You may also like",
}: {
  products: Product[];
  title?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">{title}</h2>
      <Carousel opts={{ align: "start" }} className="px-1">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
              <MinimalProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
