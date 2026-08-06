import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Gallery } from "@/components/product/gallery";
import { getBadge } from "@/lib/product-badge";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductFaq } from "@/components/product/product-faq";
import { PdpValueProps } from "@/components/product/pdp-value-props";
import { Reviews } from "@/components/product/reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { RecentlyViewedRecorder } from "@/components/product/recently-viewed-recorder";
import { Bundle } from "@/components/product/bundle";
import { SaleTimerBar } from "@/components/product/sale-timer-bar";
import { JsonLd, buildBreadcrumbJsonLd, buildProductJsonLd } from "@/lib/jsonld";
import {
  getAllProducts,
  getProductByHandle,
  getRelatedProducts,
} from "@/mock/products";
import { getCategoryByHandle } from "@/mock/categories";
import { getActivePromoCodes } from "@/lib/shopify/discounts";
import { getKeyBenefits } from "@/lib/ai/key-benefits";
import { routes } from "@/constants/routes";
import { SITE_NAME, SITE_URL } from "@/constants/site";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return {};

  return {
    title: `${product.title} | ${SITE_NAME}`,
    description: product.description,
    alternates: { canonical: `${SITE_URL}/products/${product.handle}` },
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const category = getCategoryByHandle(product.categories[0]);
  const [related, promoCodes, benefits] = await Promise.all([
    getRelatedProducts(product, 8),
    getActivePromoCodes(),
    getKeyBenefits(product),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <RecentlyViewedRecorder handle={product.handle} />
      <JsonLd data={buildProductJsonLd(product)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          {
            name: category?.name ?? product.categories[0],
            url: routes.collection(product.categories[0]),
          },
          { name: product.title, url: routes.product(product.handle) },
        ])}
      />

      <SaleTimerBar className="flex md:hidden" />

      <nav className="text-muted-foreground mb-6 hidden items-center gap-2 text-xs md:flex">
        <Link href={routes.home()} className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href={routes.collection(product.categories[0])} className="hover:text-foreground">
          {category?.name ?? product.categories[0]}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Gallery images={product.images} badge={getBadge(product)} />
        </div>
        <div className="flex flex-col gap-10">
          <ProductPurchasePanel product={product} promoCodes={promoCodes} benefits={benefits} />
          {product.descriptionHtml ? (
            <div
              className="max-w-none text-base leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-2 [&_h2]:text-lg [&_h2]:font-medium [&_h3]:font-medium [&_iframe]:my-4 [&_iframe]:block [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-lg [&_iframe]:border-0 [&_img]:my-4 [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:rounded-lg [&_p]:leading-relaxed [&_strong]:font-semibold [&>*+*]:mt-4"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : (
            <p className="text-base leading-relaxed">{product.description}</p>
          )}
        </div>
      </div>

      <div className="mt-16 max-w-2xl md:mt-24">
        <Accordion defaultValue={["shipping"]}>
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping &amp; Returns</AccordionTrigger>
            <AccordionContent>
              <p>{product.shippingReturnsNote}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="care">
            <AccordionTrigger>Care Instructions</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground mb-2 text-xs">{product.materialsLine}</p>
              <p>{product.careInstructions}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mt-16 md:mt-24">
        <ProductFaq />
      </div>

      <div className="mt-16 md:mt-24">
        <PdpValueProps />
      </div>

      {related.length > 0 && (
        <div className="mt-16 md:mt-24">
          <Bundle product={product} relatedProducts={related} />
        </div>
      )}

      <div id="reviews" className="mt-16 max-w-3xl scroll-mt-24 md:mt-24">
        <Reviews product={product} />
      </div>

      {related.length > 0 && (
        <div className="mt-16 md:mt-24">
          <RelatedProducts products={related} />
        </div>
      )}

      <div className="mt-16 md:mt-24">
        <RecentlyViewed excludeHandle={product.handle} />
      </div>
    </main>
  );
}
