import { AuthoredProduct } from "@/types";
import { categoryImages } from "../images";

const images = categoryImages.beauty;

export const products: AuthoredProduct[] = [
  {
    handle: "santal-amber-eau-de-parfum",
    title: "Santal & Amber Eau de Parfum",
    description:
      "A warm, skin-close parfum built around a smoky sandalwood heart and a soft ambroxan drydown, with a faint opening of bergamot that fades within minutes. Concentrated enough to last from desk to dinner on a single application. Genderless by design.",
    category: "beauty",
    tags: ["fragrance", "eau-de-parfum", "gifting"],
    images: [images[4], images[0]],
    options: [{ name: "Size", values: ["30ml", "50ml", "100ml"] }],
    variants: [
      {
        title: "30ml",
        sku: "ZV-BTY-EDP-30",
        price: 1899,
        selectedOptions: [{ name: "Size", value: "30ml" }],
        inventoryQuantity: 40,
      },
      {
        title: "50ml",
        sku: "ZV-BTY-EDP-50",
        price: 2999,
        selectedOptions: [{ name: "Size", value: "50ml" }],
        inventoryQuantity: 25,
      },
      {
        title: "100ml",
        sku: "ZV-BTY-EDP-100",
        price: 4999,
        compareAtPrice: 5799,
        selectedOptions: [{ name: "Size", value: "100ml" }],
        inventoryQuantity: 8,
      },
    ],
    rating: 4.8,
    reviewCount: 246,
    isBestseller: true,
    isFeatured: true,
    createdAt: "2025-09-12T00:00:00.000Z",
    materialsLine:
      "Alcohol denat., aqua, sandalwood and amber accord, ambroxan, parfum, hand-finished glass atomizer bottle",
    recentPurchases: 62,
    careInstructions:
      "Store away from direct sunlight and heat to preserve the scent profile. Apply to pulse points just after showering, when skin is still slightly damp, for best longevity. Avoid contact with eyes and broken skin.",
  },
  {
    handle: "rosehip-vitamin-c-facial-oil",
    title: "Rosehip & Vitamin C Facial Oil",
    description:
      "A fast-absorbing facial oil that pairs cold-pressed rosehip seed oil with a stabilized vitamin C to fade the look of dullness and uneven tone over time. Layers under moisturizer without pilling, and works equally well slipped into a night routine.",
    category: "beauty",
    tags: ["skincare", "facial-oil", "brightening"],
    images: [images[1], images[0]],
    options: [{ name: "Size", values: ["15ml", "30ml"] }],
    variants: [
      {
        title: "15ml",
        sku: "ZV-BTY-FOIL-15",
        price: 999,
        selectedOptions: [{ name: "Size", value: "15ml" }],
        inventoryQuantity: 50,
      },
      {
        title: "30ml",
        sku: "ZV-BTY-FOIL-30",
        price: 1699,
        selectedOptions: [{ name: "Size", value: "30ml" }],
        inventoryQuantity: 30,
      },
    ],
    rating: 4.6,
    reviewCount: 178,
    isTrending: true,
    createdAt: "2026-03-05T00:00:00.000Z",
    materialsLine:
      "Cold-pressed rosehip seed oil, 3-O-ethyl ascorbic acid (vitamin C), squalane, amber glass dropper bottle",
    careInstructions:
      "Apply 3-4 drops to cleansed skin morning or night, pressing gently before following with moisturizer. Patch test on the inner arm before first use. Store upright, away from direct heat and light.",
  },
  {
    handle: "bhringraj-amla-hair-oil",
    title: "Bhringraj & Amla Overnight Hair Oil",
    description:
      "A sesame-oil base steeped with bhringraj, amla, and curry leaf, formulated as a pre-wash treatment rather than a leave-in. Warms up easily for a scalp massage and rinses out clean, leaving roots to ends noticeably softer by the second wash.",
    category: "beauty",
    tags: ["haircare", "hair-oil", "scalp-treatment"],
    images: [images[2], images[1]],
    options: [{ name: "Size", values: ["100ml", "200ml"] }],
    variants: [
      {
        title: "100ml",
        sku: "ZV-BTY-HOIL-100",
        price: 699,
        selectedOptions: [{ name: "Size", value: "100ml" }],
        inventoryQuantity: 70,
      },
      {
        title: "200ml",
        sku: "ZV-BTY-HOIL-200",
        price: 1199,
        selectedOptions: [{ name: "Size", value: "200ml" }],
        inventoryQuantity: 45,
      },
    ],
    rating: 4.7,
    reviewCount: 289,
    isBestseller: true,
    createdAt: "2025-06-18T00:00:00.000Z",
    materialsLine: "Sesame oil base, bhringraj extract, amla extract, curry leaf extract, vitamin E",
    recentPurchases: 34,
    careInstructions:
      "Warm slightly between the palms and massage into the scalp and lengths. Leave for a minimum of two hours, or overnight for a deeper treatment, before shampooing out thoroughly. Wipe the cap threads clean after each use to prevent residue buildup.",
  },
  {
    handle: "rose-quartz-gua-sha-roller-set",
    title: "Rose Quartz Gua Sha & Roller Set",
    description:
      "A facial sculpting duo — a contoured gua sha plate and a dual-ended roller — cut from genuine semi-precious stone. Used cold from the fridge to de-puff in the morning, or slowly with a facial oil at night to ease tension along the jaw and brow.",
    category: "beauty",
    tags: ["tools", "facial-massage", "self-care"],
    images: [images[3], images[2]],
    options: [{ name: "Stone", values: ["Rose Quartz", "Amethyst"] }],
    variants: [
      {
        title: "Rose Quartz",
        sku: "ZV-BTY-GUA-RQ",
        price: 1499,
        compareAtPrice: 1899,
        selectedOptions: [{ name: "Stone", value: "Rose Quartz" }],
        inventoryQuantity: 22,
      },
      {
        title: "Amethyst",
        sku: "ZV-BTY-GUA-AME",
        price: 1599,
        compareAtPrice: 1999,
        selectedOptions: [{ name: "Stone", value: "Amethyst" }],
        inventoryQuantity: 15,
      },
    ],
    rating: 4.5,
    reviewCount: 96,
    isNewArrival: true,
    createdAt: "2026-07-08T00:00:00.000Z",
    materialsLine: "Genuine rose quartz or amethyst stone, dual-ended facial roller, cotton drawstring pouch",
    careInstructions:
      "Cleanse the stone with a damp cloth after each use and dry before storing. Avoid dropping on hard surfaces, as natural stone can chip. Keep in the pouch provided to prevent surface scratching.",
  },
  {
    handle: "shea-butter-hand-cream-duo",
    title: "Shea Butter Hand Cream Duo",
    description:
      "A pair of fast-absorbing hand creams in two quiet, skin-warm scents, built on a shea and sweet almond base. Sized to live in a bag or by the sink, with a texture rich enough for the evening but light enough not to leave a film through the day.",
    category: "beauty",
    tags: ["hand-cream", "body-care", "gifting"],
    images: [images[1], images[3]],
    options: [{ name: "Scent", values: ["Fig & Cassis", "Neroli & Musk"] }],
    variants: [
      {
        title: "Fig & Cassis",
        sku: "ZV-BTY-HAND-FIG",
        price: 799,
        selectedOptions: [{ name: "Scent", value: "Fig & Cassis" }],
        inventoryQuantity: 60,
      },
      {
        title: "Neroli & Musk",
        sku: "ZV-BTY-HAND-NER",
        price: 799,
        selectedOptions: [{ name: "Scent", value: "Neroli & Musk" }],
        inventoryQuantity: 55,
      },
    ],
    rating: 4.4,
    reviewCount: 58,
    createdAt: "2025-12-20T00:00:00.000Z",
    materialsLine: "Shea butter, glycerin, sweet almond oil, light fragrance, recyclable aluminium tube",
    careInstructions:
      "Massage into hands and cuticles as needed throughout the day. Cap tightly after use to prevent the formula from drying out at the nozzle.",
  },
];
