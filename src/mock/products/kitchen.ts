import { AuthoredProduct } from "@/types";
import { categoryImages } from "../images";

const images = categoryImages.kitchen;

export const products: AuthoredProduct[] = [
  {
    handle: "pre-seasoned-cast-iron-skillet",
    title: "Pre-Seasoned Cast-Iron Skillet",
    description:
      "Hand-poured and pre-seasoned with three coats of organic flaxseed oil, this skillet goes straight from stovetop to table without missing a beat. The slightly concave cooking surface and helper handle make it as comfortable searing a steak as it is baking cornbread.",
    category: "kitchen",
    tags: ["cookware", "cast-iron", "stovetop"],
    images: [images[1], images[5]],
    options: [{ name: "Size", values: ["8-inch", "10-inch"] }],
    variants: [
      {
        title: "8-inch",
        sku: "ZV-KIT-CIRON-08",
        price: 1899,
        selectedOptions: [{ name: "Size", value: "8-inch" }],
        inventoryQuantity: 45,
      },
      {
        title: "10-inch",
        sku: "ZV-KIT-CIRON-10",
        price: 2499,
        compareAtPrice: 2999,
        selectedOptions: [{ name: "Size", value: "10-inch" }],
        inventoryQuantity: 12,
      },
    ],
    rating: 4.8,
    reviewCount: 214,
    isBestseller: true,
    isFeatured: true,
    createdAt: "2025-09-12T00:00:00.000Z",
    materialsLine: "Pre-seasoned cast iron, natural flaxseed oil finish",
    recentPurchases: 76,
    careInstructions:
      "Hand wash with hot water only, no soap. Dry immediately and rub with a thin layer of neutral oil before storing. Avoid soaking or dishwasher use to protect the seasoning.",
  },
  {
    handle: "walnut-serving-utensil-set",
    title: "Walnut Serving Utensil Set",
    description:
      "A spoon, a slotted spoon, and a serving fork, each carved from a single piece of solid walnut and finished with food-safe mineral oil. The grain is left to do the talking — no two sets are quite identical.",
    category: "kitchen",
    tags: ["utensils", "wood", "serving"],
    images: [images[3], images[4]],
    variants: [
      {
        title: "Set of 3",
        sku: "ZV-KIT-UTST-STD",
        price: 999,
        selectedOptions: [{ name: "Style", value: "Standard" }],
        inventoryQuantity: 38,
      },
    ],
    rating: 4.7,
    reviewCount: 143,
    isTrending: true,
    createdAt: "2025-12-03T00:00:00.000Z",
    materialsLine: "Solid walnut, food-safe mineral oil finish",
    careInstructions:
      "Hand wash and dry immediately. Recondition monthly with mineral or walnut oil. Never soak, microwave, or run through the dishwasher.",
  },
  {
    handle: "ceramic-pour-over-coffee-dripper",
    title: "Ceramic Pour-Over Coffee Dripper",
    description:
      "A single-cup ceramic dripper with a spiral rib interior that regulates water flow for a slower, more even extraction. Pairs with standard size 02 paper filters and sits neatly atop most mugs.",
    category: "kitchen",
    tags: ["coffee", "ceramic", "brewing"],
    images: [images[2], images[5]],
    options: [{ name: "Color", values: ["Chalk White", "Charcoal"] }],
    variants: [
      {
        title: "Chalk White",
        sku: "ZV-KIT-DRIP-WHT",
        price: 1299,
        selectedOptions: [{ name: "Color", value: "Chalk White" }],
        inventoryQuantity: 52,
      },
      {
        title: "Charcoal",
        sku: "ZV-KIT-DRIP-CHR",
        price: 1299,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        inventoryQuantity: 29,
      },
    ],
    rating: 4.6,
    reviewCount: 61,
    isNewArrival: true,
    createdAt: "2026-07-08T00:00:00.000Z",
    materialsLine: "Glazed ceramic, spiral-rib interior, fits size 02 filters",
    careInstructions:
      "Dishwasher safe on the top rack. Rinse promptly after each use to prevent oil buildup and staining of the glaze.",
  },
  {
    handle: "linen-tea-towel-set",
    title: "Linen Tea Towel Set",
    description:
      "A set of two stonewashed linen tea towels, generously sized for drying dishes or lining a bread basket. Linen's natural absorbency only improves with washing, and the frayed-edge hem is left raw on purpose.",
    category: "kitchen",
    tags: ["textiles", "linen", "tea-towels"],
    images: [images[0], images[1]],
    options: [{ name: "Color", values: ["Oat", "Clay"] }],
    variants: [
      {
        title: "Oat",
        sku: "ZV-KIT-TWL-OAT",
        price: 699,
        selectedOptions: [{ name: "Color", value: "Oat" }],
        inventoryQuantity: 64,
      },
      {
        title: "Clay",
        sku: "ZV-KIT-TWL-CLA",
        price: 699,
        compareAtPrice: 899,
        selectedOptions: [{ name: "Color", value: "Clay" }],
        inventoryQuantity: 8,
      },
    ],
    rating: 4.5,
    reviewCount: 88,
    isFeatured: true,
    createdAt: "2026-03-22T00:00:00.000Z",
    materialsLine: "100% stonewashed linen, raw-edge hem",
    careInstructions:
      "Machine wash warm and tumble dry low. Softens with every wash. Do not bleach or dry clean.",
  },
  {
    handle: "stoneware-mixing-bowl-set",
    title: "Stoneware Mixing Bowl Set",
    description:
      "Three nesting stoneware bowls in graduated sizes, glazed in a soft speckled finish inside and out. Wide, stable bases keep them from sliding across the counter mid-whisk, and they nest flush for storage.",
    category: "kitchen",
    tags: ["bakeware", "stoneware", "mixing-bowls"],
    images: [images[4], images[0]],
    variants: [
      {
        title: "3-Piece Set",
        sku: "ZV-KIT-BOWL-STD",
        price: 1999,
        selectedOptions: [{ name: "Style", value: "Standard" }],
        inventoryQuantity: 24,
      },
    ],
    rating: 4.9,
    reviewCount: 167,
    isBestseller: true,
    createdAt: "2025-06-15T00:00:00.000Z",
    materialsLine: "Glazed stoneware, speckled reactive finish, dishwasher and microwave safe",
    recentPurchases: 52,
    careInstructions:
      "Dishwasher and microwave safe. Avoid extreme temperature shocks, such as moving straight from freezer to hot oven.",
  },
  {
    handle: "end-grain-bamboo-cutting-board",
    title: "End-Grain Bamboo Cutting Board",
    description:
      "An end-grain bamboo board built to be kinder to knife edges than a flat-grain board, with a moisture groove routed around the perimeter and a beveled hand grip on one side for easy lifting.",
    category: "kitchen",
    tags: ["cutting-board", "bamboo", "prep"],
    images: [images[2], images[3]],
    options: [{ name: "Size", values: ["Medium", "Large"] }],
    variants: [
      {
        title: "Medium",
        sku: "ZV-KIT-BOARD-MD",
        price: 799,
        selectedOptions: [{ name: "Size", value: "Medium" }],
        inventoryQuantity: 41,
      },
      {
        title: "Large",
        sku: "ZV-KIT-BOARD-LG",
        price: 1199,
        selectedOptions: [{ name: "Size", value: "Large" }],
        inventoryQuantity: 19,
      },
    ],
    rating: 4.4,
    reviewCount: 47,
    createdAt: "2026-01-30T00:00:00.000Z",
    materialsLine: "End-grain bamboo, food-safe mineral oil finish, routed juice groove",
    careInstructions:
      "Hand wash and dry standing up. Oil monthly with food-safe mineral oil to prevent cracking. Not dishwasher safe.",
  },
];
