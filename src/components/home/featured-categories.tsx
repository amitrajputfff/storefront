import Image from "next/image";
import Link from "next/link";
import { categories } from "@/mock/categories";
import { routes } from "@/constants/routes";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerGroup, StaggerItem } from "@/components/shared/reveal";

export function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <SectionHeading
        eyebrow="Shop by category"
        title="Find what you're looking for"
        className="mb-10"
      />
      <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 h-auto">
        {categories.map((category) => (
          <StaggerItem key={category.handle}>
            <Link
              href={routes.collection(category.handle)}
              className="group block overflow-hidden rounded-xl"
            >
              <div className="relative aspect-3/4 overflow-hidden rounded-xl">
                <Image
                  src={category.image.url}
                  alt={category.image.altText}
                  fill
                  sizes="(min-width: 768px) 20vw, 40vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/40 px-3 py-2.5">
                  <p className="text-sm font-medium text-white">{category.name}</p>
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
