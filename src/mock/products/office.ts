import { AuthoredProduct } from "@/types";
import { categoryImages } from "../images";

const images = categoryImages.office;

export const products: AuthoredProduct[] = [
  {
    handle: "walnut-wood-desk-organizer",
    title: "Walnut Wood Desk Organizer",
    description:
      "A single block of solid walnut, resawn and joined into compartments sized for the things that actually sit on a desk — cards, pens, a phone charging cable, the loose coins that collect at week's end. Brass pins mark each joint rather than hiding it.",
    category: "office",
    tags: ["desk-organization", "wood", "storage"],
    images: [images[3], images[4]],
    options: [{ name: "Size", values: ["Compact", "Full"] }],
    variants: [
      {
        title: "Compact",
        sku: "ZV-OFC-ORG-CMP",
        price: 1999,
        selectedOptions: [{ name: "Size", value: "Compact" }],
        inventoryQuantity: 24,
      },
      {
        title: "Full",
        sku: "ZV-OFC-ORG-FUL",
        price: 2799,
        selectedOptions: [{ name: "Size", value: "Full" }],
        inventoryQuantity: 9,
      },
    ],
    rating: 4.7,
    reviewCount: 156,
    isBestseller: true,
    isFeatured: true,
    createdAt: "2025-09-12T00:00:00.000Z",
    materialsLine: "Solid walnut, brass pin joinery, felt-lined base",
    recentPurchases: 37,
    careInstructions:
      "Wipe with a dry or barely damp cloth. Condition occasionally with food-safe mineral oil to maintain the finish. Avoid soaking or dishwasher use.",
  },
  {
    handle: "brass-and-leather-fountain-pen",
    title: "Brass & Leather Fountain Pen",
    description:
      "A solid brass barrel that gains a personal patina with every use, capped in vegetable-tanned leather that softens over time. Weighted for slow, deliberate writing rather than speed — the point of a fountain pen, really.",
    category: "office",
    tags: ["writing", "pen", "brass"],
    images: [images[5]],
    options: [{ name: "Nib", values: ["Fine", "Medium"] }],
    variants: [
      {
        title: "Fine Nib",
        sku: "ZV-OFC-PEN-FN",
        price: 1899,
        compareAtPrice: 2299,
        selectedOptions: [{ name: "Nib", value: "Fine" }],
        inventoryQuantity: 18,
      },
      {
        title: "Medium Nib",
        sku: "ZV-OFC-PEN-MD",
        price: 1899,
        compareAtPrice: 2299,
        selectedOptions: [{ name: "Nib", value: "Medium" }],
        inventoryQuantity: 21,
      },
    ],
    rating: 4.8,
    reviewCount: 203,
    isBestseller: true,
    createdAt: "2025-06-03T00:00:00.000Z",
    materialsLine: "Solid brass barrel, vegetable-tanned leather cap sleeve, stainless steel nib",
    recentPurchases: 52,
    careInstructions:
      "Wipe the barrel with a soft, dry cloth; brass will darken naturally with handling. Flush the nib with water every few ink changes. Store cap-on to prevent the nib from drying out.",
  },
  {
    handle: "linen-bound-notebook",
    title: "Linen-Bound Notebook",
    description:
      "A dot-grid notebook bound in linen-wrapped board, sized to sit flat when open on a desk or balance on a knee in a meeting. Acid-free paper takes fountain ink without bleeding through — tested with the pen sold two shelves over.",
    category: "office",
    tags: ["notebook", "stationery", "journal"],
    images: [images[2]],
    options: [{ name: "Color", values: ["Oat", "Charcoal", "Ink Blue"] }],
    variants: [
      {
        title: "Oat",
        sku: "ZV-OFC-NTBK-OAT",
        price: 799,
        selectedOptions: [{ name: "Color", value: "Oat" }],
        inventoryQuantity: 40,
      },
      {
        title: "Charcoal",
        sku: "ZV-OFC-NTBK-CHA",
        price: 799,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        inventoryQuantity: 33,
      },
      {
        title: "Ink Blue",
        sku: "ZV-OFC-NTBK-INK",
        price: 799,
        selectedOptions: [{ name: "Color", value: "Ink Blue" }],
        inventoryQuantity: 0,
        availableForSale: false,
      },
    ],
    rating: 4.6,
    reviewCount: 88,
    isFeatured: true,
    createdAt: "2026-01-22T00:00:00.000Z",
    materialsLine: "120gsm acid-free dot-grid paper, linen-wrapped board cover, elastic closure band",
    careInstructions:
      "Keep away from moisture and direct sunlight. Wipe the cover with a dry cloth only; not intended for machine washing.",
  },
  {
    handle: "leather-laptop-sleeve",
    title: "Leather Laptop Sleeve",
    description:
      "A slim, structured sleeve in full-grain leather, lined with wool felt to cushion against the small knocks of a daily commute. The zip pull is solid brass, matched to sit quietly against the leather rather than shine against it.",
    category: "office",
    tags: ["laptop-sleeve", "leather", "tech-accessories"],
    images: [images[0], images[1]],
    options: [{ name: "Size", values: ['13"', '15"'] }],
    variants: [
      {
        title: '13"',
        sku: "ZV-OFC-SLV-13",
        price: 2499,
        selectedOptions: [{ name: "Size", value: '13"' }],
        inventoryQuantity: 15,
      },
      {
        title: '15"',
        sku: "ZV-OFC-SLV-15",
        price: 2799,
        selectedOptions: [{ name: "Size", value: '15"' }],
        inventoryQuantity: 12,
      },
    ],
    rating: 4.5,
    reviewCount: 61,
    isTrending: true,
    createdAt: "2026-04-08T00:00:00.000Z",
    materialsLine: "Full-grain leather shell, wool-felt lining, solid brass zip pull",
    careInstructions:
      "Wipe with a dry cloth; the leather will develop a natural patina with use. Avoid prolonged exposure to direct sunlight and standing moisture.",
  },
  {
    handle: "ceramic-pen-holder",
    title: "Ceramic Pen Holder",
    description:
      "A hand-thrown stoneware cylinder, weighted at the base so it stays put when a pen is grabbed in a hurry. The matte glaze is left slightly uneven at the rim — a reminder it came off a wheel, not a mold.",
    category: "office",
    tags: ["desk-accessories", "ceramic", "pen-holder"],
    images: [images[4]],
    options: [{ name: "Glaze", values: ["Sand", "Slate"] }],
    variants: [
      {
        title: "Sand",
        sku: "ZV-OFC-PENH-SND",
        price: 649,
        selectedOptions: [{ name: "Glaze", value: "Sand" }],
        inventoryQuantity: 44,
      },
      {
        title: "Slate",
        sku: "ZV-OFC-PENH-SLT",
        price: 649,
        compareAtPrice: 799,
        selectedOptions: [{ name: "Glaze", value: "Slate" }],
        inventoryQuantity: 30,
      },
    ],
    rating: 4.4,
    reviewCount: 47,
    createdAt: "2025-11-29T00:00:00.000Z",
    materialsLine: "Hand-thrown stoneware, matte glaze, cork base pad",
    careInstructions:
      "Wipe clean with a damp cloth. Not dishwasher safe due to the adhered cork base pad.",
  },
  {
    handle: "wool-felt-desk-mat",
    title: "Wool Felt Desk Mat",
    description:
      "A pressed wool felt mat that softens the click of a keyboard and gives a laptop somewhere to sit besides bare wood. The edges are cut clean, not bound, so it lies flatter the longer it's used.",
    category: "office",
    tags: ["desk-mat", "felt", "workspace"],
    images: [images[3]],
    options: [{ name: "Color", values: ["Graphite", "Sand"] }],
    variants: [
      {
        title: "Graphite",
        sku: "ZV-OFC-MAT-GPH",
        price: 1299,
        compareAtPrice: 1599,
        selectedOptions: [{ name: "Color", value: "Graphite" }],
        inventoryQuantity: 26,
      },
      {
        title: "Sand",
        sku: "ZV-OFC-MAT-SND",
        price: 1299,
        compareAtPrice: 1599,
        selectedOptions: [{ name: "Color", value: "Sand" }],
        inventoryQuantity: 19,
      },
    ],
    rating: 4.3,
    reviewCount: 34,
    isNewArrival: true,
    createdAt: "2026-07-05T00:00:00.000Z",
    materialsLine: "3mm pressed wool felt, non-slip rubber underside",
    careInstructions:
      "Spot clean with a dry brush or lightly damp cloth. Avoid folding; store flat or loosely rolled.",
  },
];
