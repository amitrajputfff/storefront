import { Hero } from "@/components/home/hero";
import { LogoCloud } from "@/components/home/logo-cloud";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { CategoryTabs } from "@/components/home/category-tabs";
import { BestSellers } from "@/components/home/best-sellers";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { LifestyleBanner } from "@/components/home/lifestyle-banner";
import { ValueProps } from "@/components/home/value-props";
import { TrendingProducts } from "@/components/home/trending-products";
import { Testimonials } from "@/components/home/testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <LogoCloud />
      {/* <FeaturedCategories /> */}
      <CategoryTabs />
      <BestSellers />
      <FeaturedCollection />
      <LifestyleBanner />
      <ValueProps />
      <TrendingProducts />
      <Testimonials />
    </main>
  );
}
