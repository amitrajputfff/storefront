import { AuthoredProduct } from "@/types";
import { categoryImages } from "../images";

const images = categoryImages.fitness;

export const products: AuthoredProduct[] = [
  {
    handle: "natural-rubber-yoga-mat",
    title: "Natural Rubber Yoga Mat",
    description:
      "Cut from a single sheet of sustainably tapped natural tree rubber, this mat holds its grip through the sweatiest flow without the synthetic smell that comes with PVC. A closed-cell surface keeps moisture from soaking in, and the deep central line-work carries just enough guidance for alignment without ever feeling like it's shouting instructions.",
    category: "fitness",
    tags: ["yoga", "mat", "studio-essentials"],
    images: [images[0], images[5]],
    options: [{ name: "Color", values: ["Sage", "Charcoal", "Terracotta"] }],
    variants: [
      {
        title: "Sage",
        sku: "ZV-FIT-YOGA-SAG",
        price: 1999,
        selectedOptions: [{ name: "Color", value: "Sage" }],
        inventoryQuantity: 40,
      },
      {
        title: "Charcoal",
        sku: "ZV-FIT-YOGA-CHA",
        price: 1999,
        compareAtPrice: 2499,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        inventoryQuantity: 5,
      },
      {
        title: "Terracotta",
        sku: "ZV-FIT-YOGA-TER",
        price: 1999,
        selectedOptions: [{ name: "Color", value: "Terracotta" }],
        inventoryQuantity: 18,
      },
    ],
    rating: 4.8,
    reviewCount: 246,
    isBestseller: true,
    isFeatured: true,
    createdAt: "2025-09-10T00:00:00.000Z",
    materialsLine:
      "100% natural tree rubber base, moisture-wicking microfiber suede top layer, non-slip closed-cell construction",
    recentPurchases: 52,
    careInstructions:
      "Wipe down after each use with a damp cloth and mild soap. Air dry flat, away from direct sun, before rolling. Avoid folding for storage — roll only.",
  },
  {
    handle: "adjustable-resistance-band-set",
    title: "Adjustable Resistance Band Set",
    description:
      "Five flat resistance bands, graded from featherlight to heavy, packed into a single travel pouch that fits in a carry-on side pocket. Woven cotton-latex construction holds tension evenly instead of thinning out at the edges — built for years of daily use, not a single January.",
    category: "fitness",
    tags: ["resistance-bands", "strength", "home-workout"],
    images: [images[3], images[1]],
    options: [{ name: "Set", values: ["Essentials (3-band)", "Full (5-band)"] }],
    variants: [
      {
        title: "Essentials (3-band)",
        sku: "ZV-FIT-BAND-ESS",
        price: 899,
        selectedOptions: [{ name: "Set", value: "Essentials (3-band)" }],
        inventoryQuantity: 63,
      },
      {
        title: "Full (5-band)",
        sku: "ZV-FIT-BAND-FUL",
        price: 1399,
        selectedOptions: [{ name: "Set", value: "Full (5-band)" }],
        inventoryQuantity: 37,
      },
    ],
    rating: 4.6,
    reviewCount: 178,
    isTrending: true,
    createdAt: "2026-03-01T00:00:00.000Z",
    materialsLine:
      "Woven cotton-latex blend bands, cotton drawstring travel pouch, printed resistance guide card",
    careInstructions:
      "Wipe clean with a dry cloth after use. Store flat or loosely coiled — avoid prolonged stretching or knotting. Keep away from direct heat.",
  },
  {
    handle: "adjustable-speed-jump-rope",
    title: "Adjustable Speed Jump Rope",
    description:
      "A ball-bearing swivel and a tangle-free steel cable make this the rope that actually keeps pace with double-unders, not just warm-up skips. The handles are knurled aluminum, sized to sit comfortably even mid-sweat, and the cable trims down with a simple screw adjustment — no scissors required.",
    category: "fitness",
    tags: ["jump-rope", "cardio", "conditioning"],
    images: [images[2]],
    options: [{ name: "Color", values: ["Black", "Coral"] }],
    variants: [
      {
        title: "Black",
        sku: "ZV-FIT-ROPE-BLK",
        price: 799,
        selectedOptions: [{ name: "Color", value: "Black" }],
        inventoryQuantity: 55,
      },
      {
        title: "Coral",
        sku: "ZV-FIT-ROPE-COR",
        price: 799,
        selectedOptions: [{ name: "Color", value: "Coral" }],
        inventoryQuantity: 29,
      },
    ],
    rating: 4.5,
    reviewCount: 61,
    isNewArrival: true,
    createdAt: "2026-07-05T00:00:00.000Z",
    materialsLine: "Knurled aluminum handles, ball-bearing swivel, PVC-coated steel cable",
    careInstructions:
      "Wipe the cable dry after outdoor use to prevent rust. Store coiled loosely. Re-tighten the handle screw periodically to keep the swivel snug.",
  },
  {
    handle: "high-density-foam-roller",
    title: "High-Density Foam Roller",
    description:
      "Dense enough to work into a tight IT band without collapsing halfway through the session, this roller keeps its shape roll after roll. The molded ridge pattern mimics a therapist's thumb more than a smooth cylinder does — firmer at the edges, easier through the middle of a pass.",
    category: "fitness",
    tags: ["foam-roller", "recovery", "mobility"],
    images: [images[4], images[1]],
    options: [{ name: "Size", values: ["Compact (30cm)", "Standard (45cm)"] }],
    variants: [
      {
        title: "Compact (30cm)",
        sku: "ZV-FIT-ROLL-CMP",
        price: 1099,
        selectedOptions: [{ name: "Size", value: "Compact (30cm)" }],
        inventoryQuantity: 24,
      },
      {
        title: "Standard (45cm)",
        sku: "ZV-FIT-ROLL-STD",
        price: 1399,
        selectedOptions: [{ name: "Size", value: "Standard (45cm)" }],
        inventoryQuantity: 9,
      },
    ],
    rating: 4.7,
    reviewCount: 133,
    isBestseller: true,
    createdAt: "2025-12-15T00:00:00.000Z",
    materialsLine: "High-density molded EVA foam over a rigid hollow core",
    careInstructions:
      "Wipe with a damp cloth and mild soap after sweaty sessions. Air dry fully before storing. Avoid leaving in direct sunlight or a hot car, which can soften the foam.",
  },
  {
    handle: "ankle-and-wrist-weight-set",
    title: "Ankle & Wrist Weight Set",
    description:
      "A pair of adjustable weights that strap comfortably at the ankle or wrist, filled with soft iron sand that shifts less than shot fill during movement. A wide neoprene band and double-locking strap keep them from riding down mid-set, whether you're doing leg lifts or a brisk walk.",
    category: "fitness",
    tags: ["weights", "strength", "toning"],
    images: [images[3], images[5]],
    options: [{ name: "Weight", values: ["1kg Pair", "2kg Pair"] }],
    variants: [
      {
        title: "1kg Pair",
        sku: "ZV-FIT-WGT-1KG",
        price: 999,
        selectedOptions: [{ name: "Weight", value: "1kg Pair" }],
        inventoryQuantity: 44,
      },
      {
        title: "2kg Pair",
        sku: "ZV-FIT-WGT-2KG",
        price: 1499,
        compareAtPrice: 1899,
        selectedOptions: [{ name: "Weight", value: "2kg Pair" }],
        inventoryQuantity: 12,
      },
    ],
    rating: 4.4,
    reviewCount: 88,
    createdAt: "2026-01-20T00:00:00.000Z",
    materialsLine: "Neoprene outer shell, soft iron sand fill, double-locking hook-and-loop strap",
    careInstructions:
      "Wipe down with a damp cloth after use. Do not submerge or machine wash. Air dry fully before storing to prevent the fill from clumping.",
  },
];
