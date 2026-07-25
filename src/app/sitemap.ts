import { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";
import { getAllProducts } from "@/mock/products";
import { getAllCollectionHandles } from "@/mock/collections";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collectionHandles] = await Promise.all([
    getAllProducts(),
    getAllCollectionHandles(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/collections`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/search`, changeFrequency: "weekly", priority: 0.3 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/shipping-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/return-policy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const collectionRoutes: MetadataRoute.Sitemap = collectionHandles.map((handle) => ({
    url: `${SITE_URL}/collections/${handle}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.handle}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: product.createdAt,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
