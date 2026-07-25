import { AuthoredProduct } from "@/types";
import { categoryImages } from "../images";

const images = categoryImages.electronics;

export const products: AuthoredProduct[] = [
  {
    handle: "nimbus-true-wireless-earbuds",
    title: "Nimbus True Wireless Earbuds",
    description:
      "A compact true-wireless pair tuned for balanced, all-day listening, with active noise cancelling that cuts commute noise without the pressurized-ear feeling of cheaper ANC. Each earbud pairs the instant it leaves the case, and the case itself tops up a full charge in under ten minutes flat on the counter.",
    category: "electronics",
    tags: ["earbuds", "audio", "wireless"],
    images: [images[0], images[4]],
    options: [{ name: "Color", values: ["Black", "Sand"] }],
    variants: [
      {
        title: "Black",
        sku: "ZV-ELC-EARB-BLK",
        price: 3999,
        compareAtPrice: 4999,
        selectedOptions: [{ name: "Color", value: "Black" }],
        inventoryQuantity: 64,
      },
      {
        title: "Sand",
        sku: "ZV-ELC-EARB-SND",
        price: 3999,
        selectedOptions: [{ name: "Color", value: "Sand" }],
        inventoryQuantity: 22,
      },
    ],
    rating: 4.6,
    reviewCount: 214,
    isBestseller: true,
    isFeatured: true,
    createdAt: "2025-09-12T00:00:00.000Z",
    materialsLine: "ABS-polycarbonate shell, silicone ear tips in three sizes, aluminum charging case",
    recentPurchases: 47,
    careInstructions:
      "Wipe the charging contacts dry before docking. Keep ear tips clean and swap them every six months for the best seal. Avoid submerging the charging case or leaving it in direct sun.",
  },
  {
    handle: "ripple-portable-bluetooth-speaker",
    title: "Ripple Portable Bluetooth Speaker",
    description:
      "A palm-sized speaker with 360-degree sound that fills a room without distorting at the top end, built around an IP67-rated shell so a beach trip or a shower playlist is no risk to it. Pair two units for true stereo, or run one for twenty hours on a single charge.",
    category: "electronics",
    tags: ["speaker", "audio", "outdoor"],
    images: [images[1]],
    options: [{ name: "Color", values: ["Charcoal", "Sand"] }],
    variants: [
      {
        title: "Charcoal",
        sku: "ZV-ELC-SPKR-CHR",
        price: 6999,
        compareAtPrice: 7999,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        inventoryQuantity: 18,
      },
      {
        title: "Sand",
        sku: "ZV-ELC-SPKR-SND",
        price: 6999,
        selectedOptions: [{ name: "Color", value: "Sand" }],
        inventoryQuantity: 9,
      },
    ],
    rating: 4.8,
    reviewCount: 176,
    isBestseller: true,
    isFeatured: true,
    createdAt: "2025-06-03T00:00:00.000Z",
    materialsLine: "Recycled-fabric acoustic grille, silicone corner bumpers, IP67-rated housing",
    recentPurchases: 33,
    careInstructions:
      "Rinse under fresh water after saltwater or sand exposure, then let it dry fully before charging. Charge only via USB-C, and avoid storing it at full charge in high heat for long stretches.",
  },
  {
    handle: "trio-wireless-charging-stand",
    title: "Trio 3-in-1 Wireless Charging Stand",
    description:
      "One dock for a phone, a pair of earbuds, and a watch, arranged so all three sit at a glance-friendly angle on a nightstand or desk. The phone plate pushes 15W fast charging when your handset supports it, and the whole stand folds flat for a bag.",
    category: "electronics",
    tags: ["charging", "wireless-charging", "desk"],
    images: [images[4], images[3]],
    options: [{ name: "Color", values: ["Black", "White"] }],
    variants: [
      {
        title: "Black",
        sku: "ZV-ELC-CHRG-BLK",
        price: 2499,
        selectedOptions: [{ name: "Color", value: "Black" }],
        inventoryQuantity: 47,
      },
      {
        title: "White",
        sku: "ZV-ELC-CHRG-WHT",
        price: 2499,
        selectedOptions: [{ name: "Color", value: "White" }],
        inventoryQuantity: 31,
      },
    ],
    rating: 4.4,
    reviewCount: 88,
    isTrending: true,
    createdAt: "2026-03-22T00:00:00.000Z",
    materialsLine: "Aluminum base plate, vegan-leather charging surface, foldable ABS hinge",
    careInstructions:
      "Remove phone cases thicker than 5mm or with metal components for reliable charging. Wipe the charging surface with a dry cloth and keep the coil area free of coins or cards.",
  },
  {
    handle: "rise-aluminum-laptop-stand",
    title: "Rise Aluminum Laptop Stand",
    description:
      "A single-piece, CNC-machined aluminum stand that lifts a laptop to eye level and out of its own heat, with a ventilated spine that keeps fans from working overtime. Six height settings and a fold-flat hinge mean it travels as easily as it sits on a desk.",
    category: "electronics",
    tags: ["laptop-stand", "desk", "wfh"],
    images: [images[2]],
    options: [{ name: "Color", values: ["Silver", "Space Grey"] }],
    variants: [
      {
        title: "Silver",
        sku: "ZV-ELC-LSTD-SLV",
        price: 2199,
        selectedOptions: [{ name: "Color", value: "Silver" }],
        inventoryQuantity: 40,
      },
      {
        title: "Space Grey",
        sku: "ZV-ELC-LSTD-GRY",
        price: 2199,
        selectedOptions: [{ name: "Color", value: "Space Grey" }],
        inventoryQuantity: 12,
      },
    ],
    rating: 4.7,
    reviewCount: 63,
    isFeatured: true,
    createdAt: "2025-12-01T00:00:00.000Z",
    materialsLine: "CNC-machined aluminum, silicone grip pads, folds flat to 20mm",
    careInstructions:
      "Wipe with a dry or slightly damp microfiber cloth. Avoid abrasive cleaners on the anodized finish, and check the grip pads periodically for dust buildup.",
  },
  {
    handle: "fold-tablet-stand-sleeve",
    title: "Fold Tablet Stand & Sleeve",
    description:
      "A protective sleeve that unfolds into a stable, adjustable-angle stand, built for a tablet that moves between a bag and a desk in the same afternoon. The felt-lined stand panel holds typing and reading angles alike, without a separate accessory to lose.",
    category: "electronics",
    tags: ["tablet-stand", "sleeve", "accessories"],
    images: [images[3], images[5]],
    options: [{ name: "Color", values: ["Charcoal", "Sand"] }],
    variants: [
      {
        title: "Charcoal",
        sku: "ZV-ELC-TSTD-CHR",
        price: 1599,
        selectedOptions: [{ name: "Color", value: "Charcoal" }],
        inventoryQuantity: 35,
      },
      {
        title: "Sand",
        sku: "ZV-ELC-TSTD-SND",
        price: 1599,
        selectedOptions: [{ name: "Color", value: "Sand" }],
        inventoryQuantity: 8,
      },
    ],
    rating: 4.5,
    reviewCount: 41,
    isNewArrival: true,
    createdAt: "2026-07-08T00:00:00.000Z",
    materialsLine: "Water-resistant recycled polyester exterior, microfiber lining, felt-faced stand panel",
    careInstructions:
      "Spot clean with a damp cloth and mild soap, then air dry fully before use. Avoid folding the stand panel to extreme angles while a device is loaded in it.",
  },
  {
    handle: "haven-silicone-leather-phone-case",
    title: "Haven Silicone-Leather Phone Case",
    description:
      "A slim case in a soft-touch liquid silicone shell with a microfiber-lined interior, holding its shape after months of pocket use instead of yellowing or stretching at the corners. A built-in magnetic ring keeps it aligned on wireless chargers and mounts without a case-off routine.",
    category: "electronics",
    tags: ["phone-case", "accessories", "protection"],
    images: [images[4]],
    options: [{ name: "Color", values: ["Black", "Sand", "Sage"] }],
    variants: [
      {
        title: "Black",
        sku: "ZV-ELC-CASE-BLK",
        price: 1299,
        selectedOptions: [{ name: "Color", value: "Black" }],
        inventoryQuantity: 52,
      },
      {
        title: "Sand",
        sku: "ZV-ELC-CASE-SND",
        price: 1299,
        selectedOptions: [{ name: "Color", value: "Sand" }],
        inventoryQuantity: 37,
      },
      {
        title: "Sage",
        sku: "ZV-ELC-CASE-SAG",
        price: 1299,
        selectedOptions: [{ name: "Color", value: "Sage" }],
        inventoryQuantity: 15,
      },
    ],
    rating: 4.3,
    reviewCount: 96,
    createdAt: "2025-04-18T00:00:00.000Z",
    materialsLine: "Liquid silicone exterior, microfiber lining, embedded magnetic charging ring",
    careInstructions:
      "Wipe with a soft, damp cloth; avoid harsh solvents, which can degrade the silicone finish. Remove the case occasionally to clear pocket lint from the button cutouts.",
  },
];
