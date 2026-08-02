import { Hero } from "@/components/home/hero";
import { FlashSaleBanner } from "@/components/home/flash-sale-banner";
import { LogoCloud } from "@/components/home/logo-cloud";
import { CategoryTabs } from "@/components/home/category-tabs";
import { BestSellers } from "@/components/home/best-sellers";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { LifestyleBanner } from "@/components/home/lifestyle-banner";
import { ValueProps } from "@/components/home/value-props";
import { TrendingProducts } from "@/components/home/trending-products";
import { Testimonials } from "@/components/home/testimonials";
import { RecentPurchaseToastMounter } from "@/components/shared/recent-purchase-toast-mounter";
import { getAllProducts } from "@/mock/products";
import { getContent } from "@/lib/content/get-content";

export default async function Home() {
  const [products, hero, flashSale, lifestyleBanner] = await Promise.all([
    getAllProducts(),
    getContent("home.hero"),
    getContent("home.flash_sale"),
    getContent("home.lifestyle_banner"),
  ]);
  const bestsellerTitles = products.filter((p) => p.isBestseller).map((p) => p.title);
  const toastTitles = bestsellerTitles.length > 0
    ? bestsellerTitles
    : products.slice(0, 8).map((p) => p.title);

  return (
    <main>
      <RecentPurchaseToastMounter productTitles={toastTitles} />
      <Hero content={hero} />
      {flashSale.enabled && <FlashSaleBanner content={flashSale} />}
      <LogoCloud />
      <BestSellers />
      <CategoryTabs />
      <FeaturedCollection />
      <LifestyleBanner content={lifestyleBanner} />
      <ValueProps />
      <TrendingProducts />
      <Testimonials />
    </main>
  );
}
