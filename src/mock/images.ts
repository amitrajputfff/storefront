import { ProductImage } from "@/types";

/**
 * Curated, content-checked Unsplash photo IDs (direct images.unsplash.com CDN URLs,
 * never the deprecated source.unsplash.com random-redirect service) so builds are
 * reproducible. Swap this file out for real product photography / Shopify CDN URLs
 * at launch — see lib/shopify-adapter.ts.
 */
function unsplash(id: string, width = 1200): string {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${width}&auto=format&fit=crop`;
}

let imageId = 0;
function img(id: string, altText: string, width = 1200, height = 1500): ProductImage {
  imageId += 1;
  return {
    id: `img-${imageId}`,
    url: unsplash(id, width),
    altText,
    width,
    height,
  };
}

export const categoryImages = {
  "home-decor": [
    img("1586023492125-27b2c045efd7", "Warm minimalist living room with natural light"),
    img("1567538096630-e0c55bd6374c", "Cozy styled living room interior"),
    img("1493663284031-b7e3aefcae8e", "Neutral-toned sofa in a sunlit room"),
    img("1524758631624-e2822e304c36", "Interior corner styled with potted plants"),
    img("1618221195710-dd6b41faaea6", "Ceramic vase on a wooden console table"),
    img("1586105251261-72a756497a11", "Styled shelf with decor objects"),
  ],
  kitchen: [
    img("1556911220-e15b29be8c8f", "Bright modern kitchen interior"),
    img("1556909212-d5b604d0c90d", "Kitchen counter styled with cookware"),
    img("1590794056226-79ef3a8147e1", "Kitchen tools laid out on a countertop"),
    img("1556909172-54557c7e4fb7", "Wooden kitchen utensils in a holder"),
    img("1556909212-d5b604d0c90d", "Enamel dutch oven on a kitchen counter"),
    img("1590794056226-79ef3a8147e1", "Cast-iron cookware on a stovetop"),
  ],
  office: [
    img("1518051870910-a46e30d9db16", "Minimal desk setup with laptop"),
    img("1497215842964-222b430dc094", "Clean home office workspace"),
    img("1600185365483-26d7a4cc7519", "Notebook and stationery on a desk"),
    img("1611930022073-b7a4ba5fcccd", "Organized desk workspace with plant"),
    img("1523275335684-37898b6baf30", "Desk detail with office accessories"),
    img("1585336261022-680e295ce3fe", "Close-up of a fountain pen"),
  ],
  travel: [
    img("1524230572899-a752b3835840", "Packed travel luggage on a bed"),
    img("1503602642458-232111445657", "Scenic travel landscape"),
    img("1543076447-215ad9ba6923", "Travel bag and gear laid out"),
    img("1445205170230-053b83016050", "Open road travel scene"),
    img("1601758174114-e711c0cbaa69", "Travel accessories flatlay"),
    img("1583512603805-3cc6b41f3edb", "Packing organizer detail shot"),
  ],
  accessories: [
    img("1526170375885-4d8ecf77b99f", "Accessories flatlay on neutral background"),
    img("1520962880247-cfaf541c8724", "Wristwatch detail shot"),
    img("1522771739844-6a9f6d5f14af", "Minimal jewelry on display"),
    img("1585421514738-01798e348b17", "Sunglasses styled on a flat surface"),
    img("1612817159949-195b6eb9e31a", "Leather-strap watch close-up"),
    img("1544441893-675973e31985", "Wardrobe accessories flatlay"),
  ],
  fitness: [
    img("1518611012118-696072aa579a", "Group fitness class stretching on yoga mats"),
    img("1544367567-0f2fcb009e0b", "Silhouette of a woman doing yoga at sunset"),
    img("1517836357463-d25dfeac3438", "Deadlift with barbell and weight plates"),
    img("1571008887538-b36bb32f4571", "Runner's legs on a road, mid-stride"),
    img("1595078475328-1ab05d0a6a0e", "Woman lifting a barbell in a home gym"),
    img("1602143407151-7111542de6e8", "Insulated steel water bottle"),
  ],
  lifestyle: [
    img("1592194996308-7b43878e84a6", "Cozy lifestyle scene with soft textiles"),
    img("1552346154-21d32810aba3", "Lifestyle flatlay with everyday objects"),
    img("1556228453-efd6c1ff04f6", "Soft blanket styled on a couch"),
    img("1600166898405-da9535204843", "Warm-toned lifestyle interior detail"),
    img("1552346154-21d32810aba3", "Everyday lifestyle objects styled together"),
    img("1450778869180-41d0601e046e", "Quiet lifestyle moment, natural light"),
  ],
  pets: [
    img("1583511655857-d19b40a7a54e", "French bulldog puppy in a yellow hoodie"),
    img("1583337130417-3346a1be7dee", "French bulldog puppy, side profile"),
    img("1548199973-03cce0bbc87b", "Two small dogs running on a dirt path"),
    img("1601979031925-424e53b6caaa", "Puppy close-up outdoors"),
    img("1560807707-8cc77767d783", "Cavalier puppy resting on a couch"),
    img("1548767797-d8c844163c4c", "Two guinea pigs eating vegetables"),
  ],
  beauty: [
    img("1608571423902-eed4a5ad8108", "Amber dropper bottle on a wooden stand"),
    img("1595515106969-1ce29566ff1c", "Bathroom shelf styled with towels"),
    img("1522337360788-8b13dee7a37e", "Detail shot of healthy hair"),
    img("1600334129128-685c5582fd35", "Spa styling with warm stones and florals"),
    img("1602910344008-22f323cc1817", "Beauty routine, applying makeup"),
  ],
  electronics: [
    img("1585155770447-2f66e2a397b5", "Wireless earbuds tossed in the air"),
    img("1587829741301-dc798b83add3", "Minimal white keyboard on a desk"),
    img("1591370874773-6702e8f12fd8", "Multi-monitor desk setup"),
    img("1585790050230-5dd28404ccb9", "Two tablets on a clean desk"),
    img("1585155770447-2f66e2a397b5", "Wireless earbuds detail shot"),
    img("1587033411391-5d9e51cce126", "Tablet with a colorful wallpaper"),
  ],
} as const;

// heroImages, lifestyleBannerImage, featuredCollectionImage, and aboutHeroImage
// moved to src/lib/content/defaults.ts as the fallback layer for the /admin
// CMS — see getContent("home.hero")/getContent("home.lifestyle_banner")/
// getContent("home.featured_collection")/getPage("about").

export const instagramGallery = [
  img("1618221195710-dd6b41faaea6", "@zeevara.co — styled vase detail", 800, 800),
  img("1590794056226-79ef3a8147e1", "@zeevara.co — kitchen tools", 800, 800),
  img("1600185365483-26d7a4cc7519", "@zeevara.co — desk styling", 800, 800),
  img("1552346154-21d32810aba3", "@zeevara.co — lifestyle flatlay", 800, 800),
  img("1585421514738-01798e348b17", "@zeevara.co — accessories detail", 800, 800),
  img("1600334129128-685c5582fd35", "@zeevara.co — spa styling", 800, 800),
  img("1583337130417-3346a1be7dee", "@zeevara.co — puppy in ZEEVARA yellow", 800, 800),
  img("1608571423902-eed4a5ad8108", "@zeevara.co — fragrance styling", 800, 800),
];
