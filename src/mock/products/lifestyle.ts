import { AuthoredProduct } from "@/types";
import { categoryImages } from "../images";

const images = categoryImages.lifestyle;

export const products: AuthoredProduct[] = [
  {
    handle: "merino-wool-ribbed-throw",
    title: "Merino Wool Ribbed Throw",
    description:
      "A generously sized throw knitted from fine merino in a soft rib, heavy enough to hold its drape over a sofa arm and light enough not to feel like a duvet. The kind of blanket that migrates from the couch to the bed and back without anyone deciding it should.",
    category: "lifestyle",
    tags: ["throw", "wool", "everyday-ritual"],
    images: [images[0], images[2]],
    options: [{ name: "Color", values: ["Oatmeal", "Charcoal", "Camel"] }],
    variants: [
      {
        title: "Oatmeal",
        sku: "ZV-LFS-THRW-OAT",
        price: 3299,
        selectedOptions: [{ name: "Color", value: "Oatmeal" }],
        inventoryQuantity: 24,
      },
      {
        title: "Charcoal",
        sku: "ZV-LFS-THRW-CHA",
        price: 3299,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        inventoryQuantity: 18,
      },
      {
        title: "Camel",
        sku: "ZV-LFS-THRW-CAM",
        price: 3499,
        compareAtPrice: 3999,
        selectedOptions: [{ name: "Color", value: "Camel" }],
        inventoryQuantity: 9,
      },
    ],
    rating: 4.8,
    reviewCount: 187,
    isBestseller: true,
    isFeatured: true,
    createdAt: "2025-09-18T00:00:00.000Z",
    materialsLine: "100% merino wool, ribbed knit construction, whipstitched edge finish",
    recentPurchases: 33,
    careInstructions:
      "Dry clean, or hand wash cold with a wool-specific detergent and dry flat. Do not tumble dry, wring, or hang wet — this stretches the rib.",
  },
  {
    handle: "leather-bound-daily-journal",
    title: "Leather-Bound Daily Journal",
    description:
      "An undated daily journal in vegetable-tanned leather that darkens and softens with handling, so the cover you start with is never the one you finish with. Cream, lightly textured paper takes fountain pen without bleeding through.",
    category: "lifestyle",
    tags: ["journal", "stationery", "everyday-ritual"],
    images: [images[1], images[3]],
    options: [{ name: "Color", values: ["Tan", "Black"] }],
    variants: [
      {
        title: "Tan",
        sku: "ZV-LFS-JRNL-TAN",
        price: 899,
        selectedOptions: [{ name: "Color", value: "Tan" }],
        inventoryQuantity: 52,
      },
      {
        title: "Black",
        sku: "ZV-LFS-JRNL-BLK",
        price: 899,
        selectedOptions: [{ name: "Color", value: "Black" }],
        inventoryQuantity: 38,
      },
    ],
    rating: 4.6,
    reviewCount: 41,
    isNewArrival: true,
    createdAt: "2026-07-12T00:00:00.000Z",
    materialsLine:
      "Vegetable-tanned leather cover, 160gsm cream paper, 240 lined pages, elastic closure and ribbon marker",
    careInstructions:
      "Condition occasionally with a natural leather balm. Keep away from prolonged moisture — the leather is meant to darken and soften with use, not warp.",
  },
  {
    handle: "ceramic-tea-ritual-set",
    title: "Ceramic Tea Ritual Set",
    description:
      "A hand-glazed stoneware teapot with a stainless mesh infuser, paired with two matching cups sized for a proper pause rather than a rushed cup. Built for loose leaf, but forgiving enough for a bag when the morning calls for it.",
    category: "lifestyle",
    tags: ["tea", "ritual", "tableware"],
    images: [images[3], images[5]],
    options: [{ name: "Glaze", values: ["Ash", "Terracotta"] }],
    variants: [
      {
        title: "Ash",
        sku: "ZV-LFS-TEA-ASH",
        price: 1899,
        selectedOptions: [{ name: "Glaze", value: "Ash" }],
        inventoryQuantity: 31,
      },
      {
        title: "Terracotta",
        sku: "ZV-LFS-TEA-TER",
        price: 1899,
        selectedOptions: [{ name: "Glaze", value: "Terracotta" }],
        inventoryQuantity: 27,
      },
    ],
    rating: 4.7,
    reviewCount: 96,
    isTrending: true,
    createdAt: "2026-04-08T00:00:00.000Z",
    materialsLine: "Hand-glazed stoneware teapot with stainless mesh infuser, two matching stoneware cups",
    careInstructions:
      "Hand wash recommended to preserve the glaze finish. Let cool before washing — sudden temperature changes can hairline-crack the glaze.",
  },
  {
    handle: "sandalwood-vetiver-reed-diffuser",
    title: "Sandalwood & Vetiver Reed Diffuser",
    description:
      "A slow, flameless way to hold a scent in a room. Sandalwood and vetiver oil climbs natural rattan reeds into a hand-blown glass vessel, settling into something warmer and woodier than the sharp first note suggests.",
    category: "lifestyle",
    tags: ["diffuser", "scent", "home-ritual"],
    images: [images[4]],
    options: [{ name: "Size", values: ["100ml", "200ml"] }],
    variants: [
      {
        title: "100ml",
        sku: "ZV-LFS-DIFF-100",
        price: 899,
        selectedOptions: [{ name: "Size", value: "100ml" }],
        inventoryQuantity: 64,
      },
      {
        title: "200ml",
        sku: "ZV-LFS-DIFF-200",
        price: 1499,
        selectedOptions: [{ name: "Size", value: "200ml" }],
        inventoryQuantity: 29,
      },
    ],
    rating: 4.8,
    reviewCount: 233,
    isBestseller: true,
    createdAt: "2025-11-30T00:00:00.000Z",
    materialsLine: "Sandalwood and vetiver fragrance oil, natural rattan reeds, hand-blown glass vessel",
    recentPurchases: 47,
    careInstructions:
      "Flip the reeds weekly for a stronger throw. Keep away from direct sunlight and out of reach of pets and children.",
  },
  {
    handle: "walnut-inlay-backgammon-set",
    title: "Walnut Inlay Backgammon Set",
    description:
      "A folding backgammon board in walnut and maple inlay that closes into its own carry case, checkers and dice included. Considered enough for a shelf, sturdy enough for an actual weeknight game that runs later than planned.",
    category: "lifestyle",
    tags: ["games", "backgammon", "gifting"],
    images: [images[5], images[1]],
    options: [{ name: "Size", values: ["Travel", "Classic"] }],
    variants: [
      {
        title: "Travel",
        sku: "ZV-LFS-BKGM-TRV",
        price: 2799,
        selectedOptions: [{ name: "Size", value: "Travel" }],
        inventoryQuantity: 21,
      },
      {
        title: "Classic",
        sku: "ZV-LFS-BKGM-CLS",
        price: 3799,
        compareAtPrice: 4499,
        selectedOptions: [{ name: "Size", value: "Classic" }],
        inventoryQuantity: 8,
      },
    ],
    rating: 4.5,
    reviewCount: 58,
    createdAt: "2026-02-02T00:00:00.000Z",
    materialsLine: "Walnut and maple wood inlay, engraved resin checkers, magnetic hinge closure",
    careInstructions:
      "Wipe with a dry cloth only. Keep away from direct sunlight and high humidity, both of which can warp the wood inlay over time.",
  },
];
