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
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { Reviews } from "@/components/product/reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { RecentlyViewedRecorder } from "@/components/product/recently-viewed-recorder";
import { Bundle } from "@/components/product/bundle";
import { JsonLd, buildBreadcrumbJsonLd, buildProductJsonLd } from "@/lib/jsonld";
import {
  getAllProducts,
  getProductByHandle,
  getRelatedProducts,
} from "@/mock/products";
import { getCategoryByHandle } from "@/mock/categories";
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

  const category = getCategoryByHandle(product.category);
  const related = await getRelatedProducts(product, 8);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <RecentlyViewedRecorder handle={product.handle} />
      <JsonLd data={buildProductJsonLd(product)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: category?.name ?? product.category, url: routes.collection(product.category) },
          { name: product.title, url: routes.product(product.handle) },
        ])}
      />

      <nav className="text-muted-foreground mb-6 flex items-center gap-2 text-xs">
        <Link href={routes.home()} className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href={routes.collection(product.category)} className="hover:text-foreground">
          {category?.name ?? product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery images={product.images} />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductPurchasePanel product={product} />
        </div>
      </div>

      <div className="mt-16 max-w-2xl md:mt-24">
        <Accordion defaultValue={["description"]}>
          <AccordionItem value="description">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>
              <p>{product.description}</p>
            </AccordionContent>
          </AccordionItem>
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
