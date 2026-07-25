import { AuthoredProduct } from "@/types";
import { categoryImages } from "../images";

const images = categoryImages.travel;

export const products: AuthoredProduct[] = [
  {
    handle: "compression-packing-cube-set",
    title: "Compression Packing Cube Set",
    description:
      "Ripstop nylon cubes with two-way compression zips that shave real volume off a packed case, not just organize what's already there. Mesh top panels mean you can find a shirt without unpacking the whole bag, and the seams are bar-tacked at every stress point so the zips don't blow out mid-trip.",
    category: "travel",
    tags: ["packing-cubes", "organization", "carry-on"],
    images: [images[5], images[0]],
    options: [{ name: "Set Size", values: ["3-Piece", "5-Piece", "7-Piece"] }],
    variants: [
      {
        title: "3-Piece",
        sku: "ZV-TRV-PKCB-3",
        price: 1299,
        selectedOptions: [{ name: "Set Size", value: "3-Piece" }],
        inventoryQuantity: 64,
      },
      {
        title: "5-Piece",
        sku: "ZV-TRV-PKCB-5",
        price: 1799,
        compareAtPrice: 2199,
        selectedOptions: [{ name: "Set Size", value: "5-Piece" }],
        inventoryQuantity: 38,
      },
      {
        title: "7-Piece",
        sku: "ZV-TRV-PKCB-7",
        price: 2299,
        selectedOptions: [{ name: "Set Size", value: "7-Piece" }],
        inventoryQuantity: 15,
      },
    ],
    rating: 4.7,
    reviewCount: 156,
    isBestseller: true,
    createdAt: "2025-09-12T00:00:00.000Z",
    materialsLine: "400D recycled ripstop nylon, YKK zips, mesh top panel",
    recentPurchases: 47,
    careInstructions:
      "Wipe down with a damp cloth; do not machine wash. Air dry fully before repacking to prevent mildew forming on the mesh panel.",
  },
  {
    handle: "full-grain-leather-passport-holder",
    title: "Full-Grain Leather Passport Holder",
    description:
      "Vegetable-tanned full-grain leather, cut and stitched to hold a passport, boarding pass, and two cards without adding bulk to a jacket pocket. The edges are left raw and undyed so the whole piece deepens in color with handling — it looks better a year in than it does on day one.",
    category: "travel",
    tags: ["passport-holder", "leather", "travel-accessories"],
    images: [images[4]],
    options: [{ name: "Color", values: ["Cognac", "Black", "Olive"] }],
    variants: [
      {
        title: "Cognac",
        sku: "ZV-TRV-PASS-COG",
        price: 1199,
        selectedOptions: [{ name: "Color", value: "Cognac" }],
        inventoryQuantity: 41,
      },
      {
        title: "Black",
        sku: "ZV-TRV-PASS-BLK",
        price: 1199,
        selectedOptions: [{ name: "Color", value: "Black" }],
        inventoryQuantity: 52,
      },
      {
        title: "Olive",
        sku: "ZV-TRV-PASS-OLV",
        price: 1199,
        selectedOptions: [{ name: "Color", value: "Olive" }],
        inventoryQuantity: 9,
      },
    ],
    rating: 4.6,
    reviewCount: 98,
    isFeatured: true,
    createdAt: "2026-01-20T00:00:00.000Z",
    materialsLine: "Vegetable-tanned full-grain leather, cotton thread stitching, raw edge finish",
    careInstructions:
      "Condition every few months with a neutral leather balm. If it gets wet, blot rather than rub, and let it air dry away from direct heat.",
  },
  {
    handle: "canvas-and-leather-weekender-duffel",
    title: "Canvas & Leather Weekender Duffel",
    description:
      "Waxed cotton canvas body with full-grain leather trim, handles, and base, built to take a weekend's worth of clothes and hold its shape doing it. A detachable webbing strap and a zippered shoe compartment on the base mean it doubles as a gym bag on ordinary weeks.",
    category: "travel",
    tags: ["duffel", "weekender", "canvas", "leather"],
    images: [images[2], images[0]],
    options: [{ name: "Color", values: ["Charcoal Canvas", "Sand Canvas"] }],
    variants: [
      {
        title: "Charcoal Canvas",
        sku: "ZV-TRV-DUFL-CHR",
        price: 6499,
        compareAtPrice: 7499,
        selectedOptions: [{ name: "Color", value: "Charcoal Canvas" }],
        inventoryQuantity: 12,
      },
      {
        title: "Sand Canvas",
        sku: "ZV-TRV-DUFL-SND",
        price: 6999,
        compareAtPrice: 7999,
        selectedOptions: [{ name: "Color", value: "Sand Canvas" }],
        inventoryQuantity: 7,
      },
    ],
    rating: 4.8,
    reviewCount: 214,
    isBestseller: true,
    createdAt: "2025-11-30T00:00:00.000Z",
    materialsLine: "Waxed cotton canvas, full-grain leather trim and handles, brass hardware, cotton twill lining",
    recentPurchases: 33,
    careInstructions:
      "Spot clean the canvas with a damp cloth and mild soap. Re-wax the canvas roughly once a year to maintain water resistance, and condition the leather trim twice a year.",
  },
  {
    handle: "compression-toiletry-pouch",
    title: "Compression Toiletry Pouch",
    description:
      "A hanging toiletry pouch in coated, wipeable canvas with a compression strap that cinches bulky bottles flat for the outer pocket of a carry-on. It opens fully flat for security trays and hooks onto a rail or towel bar at the other end of the trip.",
    category: "travel",
    tags: ["toiletry-bag", "dopp-kit", "organization"],
    images: [images[5], images[4]],
    options: [{ name: "Size", values: ["Small", "Large"] }],
    variants: [
      {
        title: "Small",
        sku: "ZV-TRV-TLTP-SM",
        price: 799,
        selectedOptions: [{ name: "Size", value: "Small" }],
        inventoryQuantity: 58,
      },
      {
        title: "Large",
        sku: "ZV-TRV-TLTP-LG",
        price: 999,
        selectedOptions: [{ name: "Size", value: "Large" }],
        inventoryQuantity: 44,
      },
    ],
    rating: 4.4,
    reviewCount: 67,
    isTrending: true,
    createdAt: "2026-04-05T00:00:00.000Z",
    materialsLine: "PU-coated canvas exterior, waterproof TPU-lined interior, aluminum hanging hook",
    careInstructions:
      "Wipe the interior and exterior with a damp cloth after each trip. Air dry fully before closing to prevent trapped moisture.",
  },
  {
    handle: "leather-luggage-tag-duo",
    title: "Leather Luggage Tag Duo",
    description:
      "Two full-grain leather luggage tags with a privacy flap over the address panel and a looped leather strap reinforced at the buckle so it doesn't saw through in transit. Sold as a pair so a carry-on and a checked bag can match.",
    category: "travel",
    tags: ["luggage-tags", "leather", "gifting"],
    images: [images[4], images[3]],
    options: [{ name: "Color", values: ["Tan", "Black"] }],
    variants: [
      {
        title: "Tan",
        sku: "ZV-TRV-TAG-TAN",
        price: 699,
        selectedOptions: [{ name: "Color", value: "Tan" }],
        inventoryQuantity: 27,
      },
      {
        title: "Black",
        sku: "ZV-TRV-TAG-BLK",
        price: 699,
        selectedOptions: [{ name: "Color", value: "Black" }],
        inventoryQuantity: 31,
      },
    ],
    rating: 4.5,
    reviewCount: 42,
    isNewArrival: true,
    createdAt: "2026-07-14T00:00:00.000Z",
    materialsLine: "Full-grain leather, brass buckle, privacy flap, cotton-paper insert card",
    careInstructions:
      "Wipe clean with a dry cloth. Avoid prolonged exposure to rain — the leather may darken slightly with age and handling, which is expected.",
  },
];
