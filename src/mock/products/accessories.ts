import { AuthoredProduct } from "@/types";
import { categoryImages } from "../images";

const images = categoryImages.accessories;

export const products: AuthoredProduct[] = [
  {
    handle: "leather-strap-minimalist-watch",
    title: "Leather-Strap Minimalist Watch",
    description:
      "A slim 38mm case in brushed stainless steel with a sunray dial and no numerals to speak of — just two hands and a date window at three o'clock. The vegetable-tanned leather strap breaks in fast and wears in gracefully, so the watch only looks better with use.",
    category: "accessories",
    tags: ["watches", "leather", "everyday"],
    images: [images[4], images[1]],
    options: [{ name: "Strap Color", values: ["Cognac Tan", "Espresso Brown", "Black"] }],
    variants: [
      {
        title: "Cognac Tan",
        sku: "ZV-ACC-WTCH-TAN",
        price: 4499,
        selectedOptions: [{ name: "Strap Color", value: "Cognac Tan" }],
        inventoryQuantity: 27,
      },
      {
        title: "Espresso Brown",
        sku: "ZV-ACC-WTCH-ESP",
        price: 4499,
        compareAtPrice: 5299,
        selectedOptions: [{ name: "Strap Color", value: "Espresso Brown" }],
        inventoryQuantity: 19,
      },
      {
        title: "Black",
        sku: "ZV-ACC-WTCH-BLK",
        price: 4699,
        selectedOptions: [{ name: "Strap Color", value: "Black" }],
        inventoryQuantity: 12,
      },
    ],
    rating: 4.8,
    reviewCount: 241,
    isBestseller: true,
    isFeatured: true,
    createdAt: "2025-09-12T00:00:00.000Z",
    materialsLine:
      "316L stainless steel case, mineral crystal glass, vegetable-tanned genuine leather strap, Japanese quartz movement",
    recentPurchases: 63,
    careInstructions:
      "Wipe the case with a dry microfiber cloth after wear. Keep the leather strap away from prolonged water exposure and direct heat. Water-resistant to 3 ATM (splash resistant only).",
  },
  {
    handle: "acetate-round-sunglasses",
    title: "Acetate Round Sunglasses",
    description:
      "Italian acetate frames in a softly rounded silhouette, cut thick enough to hold their shape without ever feeling heavy on the face. Polarized lenses cut glare without tinting the world an odd color — the point is to see clearly, not just look like you're wearing sunglasses.",
    category: "accessories",
    tags: ["sunglasses", "eyewear", "summer"],
    images: [images[3], images[0]],
    options: [{ name: "Frame Color", values: ["Tortoise", "Black", "Olive Green"] }],
    variants: [
      {
        title: "Tortoise",
        sku: "ZV-ACC-SNGL-TRT",
        price: 1899,
        selectedOptions: [{ name: "Frame Color", value: "Tortoise" }],
        inventoryQuantity: 41,
      },
      {
        title: "Black",
        sku: "ZV-ACC-SNGL-BLK",
        price: 1899,
        selectedOptions: [{ name: "Frame Color", value: "Black" }],
        inventoryQuantity: 38,
      },
      {
        title: "Olive Green",
        sku: "ZV-ACC-SNGL-OLV",
        price: 1999,
        selectedOptions: [{ name: "Frame Color", value: "Olive Green" }],
        inventoryQuantity: 0,
        availableForSale: false,
      },
    ],
    rating: 4.5,
    reviewCount: 96,
    isTrending: true,
    createdAt: "2026-04-22T00:00:00.000Z",
    materialsLine: "Italian cellulose acetate frame, polarized CR-39 lenses, UV400 protection",
    careInstructions:
      "Clean lenses only with the included microfiber pouch. Avoid paper towels or clothing, which can scratch the coating. Store in the hard case when not in use.",
  },
  {
    handle: "fine-chain-layering-necklace",
    title: "Fine Chain Layering Necklace",
    description:
      "An 18k gold-vermiil cable chain, deliberately fine so it sits close to the collarbone and layers without crowding. Finished with a lobster clasp and a 5cm extender for versatility across necklines — the kind of piece you forget you're wearing until someone asks where it's from.",
    category: "accessories",
    tags: ["jewelry", "necklaces", "gold-vermeil"],
    images: [images[2], images[0]],
    options: [{ name: "Length", values: ["16 inch", "18 inch"] }],
    variants: [
      {
        title: "16 inch",
        sku: "ZV-ACC-NECK-16",
        price: 1699,
        selectedOptions: [{ name: "Length", value: "16 inch" }],
        inventoryQuantity: 44,
      },
      {
        title: "18 inch",
        sku: "ZV-ACC-NECK-18",
        price: 1799,
        selectedOptions: [{ name: "Length", value: "18 inch" }],
        inventoryQuantity: 33,
      },
    ],
    rating: 4.6,
    reviewCount: 158,
    isBestseller: true,
    createdAt: "2025-12-05T00:00:00.000Z",
    materialsLine: "18k gold vermeil (925 sterling silver base, 2.5 micron gold plating), lobster clasp",
    careInstructions:
      "Remove before swimming, showering, or applying perfume. Store flat in the provided pouch to prevent tangling. Polish gently with a jewelry cloth, not a chemical cleaner.",
  },
  {
    handle: "full-grain-leather-card-holder",
    title: "Full-Grain Leather Card Holder",
    description:
      "A slim, four-card holder cut from a single piece of full-grain leather and saddle-stitched by hand along the edges — no glue, no unnecessary bulk. It's built to sit flat in a front pocket and only gets more supple with the years.",
    category: "accessories",
    tags: ["wallets", "leather", "everyday-carry"],
    images: [images[5], images[4]],
    options: [{ name: "Color", values: ["Chestnut", "Black", "Navy"] }],
    variants: [
      {
        title: "Chestnut",
        sku: "ZV-ACC-CARD-CHS",
        price: 999,
        selectedOptions: [{ name: "Color", value: "Chestnut" }],
        inventoryQuantity: 52,
      },
      {
        title: "Black",
        sku: "ZV-ACC-CARD-BLK",
        price: 999,
        selectedOptions: [{ name: "Color", value: "Black" }],
        inventoryQuantity: 49,
      },
      {
        title: "Navy",
        sku: "ZV-ACC-CARD-NVY",
        price: 1099,
        compareAtPrice: 1399,
        selectedOptions: [{ name: "Color", value: "Navy" }],
        inventoryQuantity: 15,
      },
    ],
    rating: 4.7,
    reviewCount: 187,
    isFeatured: true,
    createdAt: "2026-01-28T00:00:00.000Z",
    materialsLine: "Full-grain vegetable-tanned leather, waxed cotton saddle-stitching, no metal hardware",
    careInstructions:
      "Condition every few months with a neutral leather balm to prevent drying. Avoid extended direct sunlight, which will darken the leather unevenly. Wipe spills immediately with a dry cloth.",
  },
  {
    handle: "woven-italian-leather-belt",
    title: "Woven Italian Leather Belt",
    description:
      "Hand-woven strips of Italian leather over a flexible core, finished with a matte brushed-brass buckle that's easy to swap between formal trousers and raw denim. The weave gives just enough stretch that sizing feels forgiving rather than exact.",
    category: "accessories",
    tags: ["belts", "leather", "menswear"],
    images: [images[5], images[1]],
    options: [{ name: "Size", values: ["32", "34", "36", "38"] }],
    variants: [
      {
        title: "32",
        sku: "ZV-ACC-BELT-32",
        price: 1599,
        selectedOptions: [{ name: "Size", value: "32" }],
        inventoryQuantity: 21,
      },
      {
        title: "34",
        sku: "ZV-ACC-BELT-34",
        price: 1599,
        selectedOptions: [{ name: "Size", value: "34" }],
        inventoryQuantity: 26,
      },
      {
        title: "36",
        sku: "ZV-ACC-BELT-36",
        price: 1599,
        selectedOptions: [{ name: "Size", value: "36" }],
        inventoryQuantity: 18,
      },
      {
        title: "38",
        sku: "ZV-ACC-BELT-38",
        price: 1599,
        selectedOptions: [{ name: "Size", value: "38" }],
        inventoryQuantity: 9,
      },
    ],
    rating: 4.4,
    reviewCount: 73,
    createdAt: "2025-10-30T00:00:00.000Z",
    materialsLine: "Woven Italian full-grain leather, brushed-brass buckle, flexible synthetic core",
    careInstructions:
      "Wipe clean with a dry or barely damp cloth. Hang rather than fold to keep the weave from creasing. Avoid contact with water and harsh detergents.",
  },
  {
    handle: "mulberry-silk-neck-scarf",
    title: "Mulberry Silk Neck Scarf",
    description:
      "A 70cm square of mulberry silk twill, hand-rolled at the hem and printed with a small-scale botanical motif in muted, tonal colorways. Light enough to knot at the neck, tie to a bag handle, or wear as a headscarf without ever feeling like an afterthought.",
    category: "accessories",
    tags: ["scarves", "silk", "new-arrival"],
    images: [images[0], images[2]],
    options: [{ name: "Colorway", values: ["Terracotta Botanical", "Sage Botanical"] }],
    variants: [
      {
        title: "Terracotta Botanical",
        sku: "ZV-ACC-SCRF-TRC",
        price: 1399,
        selectedOptions: [{ name: "Colorway", value: "Terracotta Botanical" }],
        inventoryQuantity: 30,
      },
      {
        title: "Sage Botanical",
        sku: "ZV-ACC-SCRF-SAG",
        price: 1399,
        selectedOptions: [{ name: "Colorway", value: "Sage Botanical" }],
        inventoryQuantity: 24,
      },
    ],
    rating: 4.6,
    reviewCount: 34,
    isNewArrival: true,
    createdAt: "2026-07-08T00:00:00.000Z",
    materialsLine: "100% mulberry silk twill, hand-rolled hem, digitally printed",
    careInstructions:
      "Dry clean recommended, or hand wash cold with a silk-safe detergent and lay flat to dry. Iron on the lowest setting with a protective cloth between the fabric and the iron.",
  },
];
