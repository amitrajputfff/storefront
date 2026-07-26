#!/usr/bin/env node
/**
 * One-off seed script: creates new products in the live ZEEVARA Shopify store
 * via the Admin GraphQL API, and publishes each to the Online Store channel.
 *
 * Requires SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local
 * (the Admin token needs the write_products / read_products scopes).
 *
 * Usage: node scripts/create-products.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ADMIN_API_VERSION = "2025-01";

function loadEnvLocal() {
  const path = join(__dirname, "..", ".env.local");
  const content = readFileSync(path, "utf8");
  const vars = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return vars;
}

const env = loadEnvLocal();
const DOMAIN = env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!DOMAIN || !ADMIN_TOKEN) {
  console.error(
    "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local — see README for setup steps.",
  );
  process.exit(1);
}

async function adminFetch(query, variables) {
  const res = await fetch(`https://${DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(
      `Admin API request failed (${res.status}): ${JSON.stringify(json.errors ?? json)}`,
    );
  }
  return json.data;
}

function unsplash(id, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${width}&auto=format&fit=crop`;
}

// ---------------------------------------------------------------------------
// Product definitions — 15 new products, 3-4 per category, distinct from the
// mock catalog's existing product concepts. Prices in INR (Shopify wants a
// plain numeric string; currency is set by the store's configured currency).
// ---------------------------------------------------------------------------

const PRODUCTS = [
  // ---- Kitchen (4) ----
  {
    title: "Enamel Cast-Iron Dutch Oven",
    handle: "enamel-cast-iron-dutch-oven",
    productType: "Kitchen",
    tags: ["kitchen", "cookware", "bestseller"],
    descriptionHtml:
      "<p>A heavy-bottomed enamel-coated Dutch oven built for slow braises and everyday simmering. The enamel interior resists staining and doesn't require seasoning, so it goes straight from stovetop to oven to table.</p>",
    variants: [
      { color: "Cream", price: "3499", compareAtPrice: "4299", sku: "ZV-KIT-DUTCH-CRM" },
      { color: "Charcoal", price: "3499", compareAtPrice: "4299", sku: "ZV-KIT-DUTCH-CHR" },
    ],
    images: [unsplash("1556909212-d5b604d0c90d"), unsplash("1590794056226-79ef3a8147e1")],
  },
  {
    title: "Copper Measuring Cup Set",
    handle: "copper-measuring-cup-set",
    productType: "Kitchen",
    tags: ["kitchen", "baking"],
    descriptionHtml:
      "<p>A set of four nesting measuring cups in brushed copper-finish stainless steel, with etched measurement markings that won't wear off. Sized for both dry and liquid measuring.</p>",
    variants: [{ price: "1299", sku: "ZV-KIT-CUPS-CPR" }],
    images: [unsplash("1556909172-54557c7e4fb7"), unsplash("1556911220-e15b29be8c8f")],
  },
  {
    title: "Marble Mortar & Pestle",
    handle: "marble-mortar-and-pestle",
    productType: "Kitchen",
    tags: ["kitchen", "prep"],
    descriptionHtml:
      "<p>Hand-carved from a single block of marble, weighted for effortless grinding of spices, herbs, and pastes. The polished interior and honed exterior make it as much a countertop object as a tool.</p>",
    variants: [{ price: "1899", sku: "ZV-KIT-MORTAR" }],
    images: [unsplash("1556909172-54557c7e4fb7")],
  },
  {
    title: "Glass Storage Jar Set of 6",
    handle: "glass-storage-jar-set",
    productType: "Kitchen",
    tags: ["kitchen", "storage", "new"],
    descriptionHtml:
      "<p>Borosilicate glass jars with airtight bamboo lids, in three sizes to suit grains, spices, and snacks. Stackable and labeled with a reusable chalk-marker panel.</p>",
    variants: [{ price: "1599", compareAtPrice: "1999", sku: "ZV-KIT-JARS-SET6" }],
    images: [unsplash("1556911220-e15b29be8c8f"), unsplash("1556909212-d5b604d0c90d")],
  },

  // ---- Fitness (4) ----
  {
    title: "Adjustable Dumbbell Set",
    handle: "adjustable-dumbbell-set",
    productType: "Fitness",
    tags: ["fitness", "strength", "bestseller"],
    descriptionHtml:
      "<p>A single pair of dumbbells that adjusts from 2.5kg to 24kg per side via a quick-turn dial — replaces an entire rack in a fraction of the floor space.</p>",
    variants: [{ price: "6999", compareAtPrice: "8499", sku: "ZV-FIT-DUMBBELL-ADJ" }],
    images: [unsplash("1517836357463-d25dfeac3438"), unsplash("1595078475328-1ab05d0a6a0e")],
  },
  {
    title: "Cork Yoga Block Duo",
    handle: "cork-yoga-block-duo",
    productType: "Fitness",
    tags: ["fitness", "yoga"],
    descriptionHtml:
      "<p>Two natural cork yoga blocks with a grippy, sweat-resistant surface and enough density to support deep stretches without compressing over time.</p>",
    variants: [{ price: "899", sku: "ZV-FIT-BLOCK-CORK" }],
    images: [unsplash("1518611012118-696072aa579a")],
  },
  {
    title: "Compression Recovery Sleeves",
    handle: "compression-recovery-sleeves",
    productType: "Fitness",
    tags: ["fitness", "recovery", "new"],
    descriptionHtml:
      "<p>Graduated-compression calf sleeves designed to reduce muscle fatigue during long runs and speed up recovery after. Moisture-wicking knit, true to size.</p>",
    variants: [
      { size: "S/M", price: "1199", sku: "ZV-FIT-SLEEVE-SM" },
      { size: "L/XL", price: "1199", sku: "ZV-FIT-SLEEVE-LX" },
    ],
    images: [unsplash("1571008887538-b36bb32f4571"), unsplash("1571019613454-1cb2f99b2d8b")],
  },
  {
    title: "Insulated Gym Water Bottle",
    handle: "insulated-gym-water-bottle",
    productType: "Fitness",
    tags: ["fitness", "hydration"],
    descriptionHtml:
      "<p>Double-wall stainless steel bottle that keeps water cold through a full training session, with a leakproof flip-top spout built for one-handed use mid-set.</p>",
    variants: [
      { color: "Black", price: "1499", sku: "ZV-FIT-BOTTLE-BLK" },
      { color: "Sage", price: "1499", sku: "ZV-FIT-BOTTLE-SGE" },
    ],
    images: [unsplash("1602143407151-7111542de6e8"), unsplash("1523362628745-0c100150b504")],
  },

  // ---- Beauty (4) ----
  {
    title: "Vitamin C Brightening Serum",
    handle: "vitamin-c-brightening-serum",
    productType: "Beauty",
    tags: ["beauty", "skincare", "bestseller"],
    descriptionHtml:
      "<p>A 15% vitamin C serum in a light, fast-absorbing base with vitamin E and ferulic acid to help stabilize it — formulated to even tone without the sting of older formulations.</p>",
    variants: [{ price: "1799", compareAtPrice: "2199", sku: "ZV-BTY-SERUM-VITC" }],
    images: [unsplash("1608571423902-eed4a5ad8108"), unsplash("1602910344008-22f323cc1817")],
  },
  {
    title: "Rose Clay Face Mask",
    handle: "rose-clay-face-mask",
    productType: "Beauty",
    tags: ["beauty", "skincare"],
    descriptionHtml:
      "<p>French rose clay blended with kaolin for a gentler draw than pure bentonite, finished with a touch of rosehip oil so skin doesn't feel stripped after rinsing.</p>",
    variants: [{ price: "999", sku: "ZV-BTY-MASK-ROSE" }],
    images: [unsplash("1600334129128-685c5582fd35")],
  },
  {
    title: "Bamboo Konjac Sponge Set",
    handle: "bamboo-konjac-sponge-set",
    productType: "Beauty",
    tags: ["beauty", "cleansing", "new"],
    descriptionHtml:
      "<p>A pair of konjac cleansing sponges infused with activated bamboo charcoal — soft enough for daily use, biodegradable, and gentle enough for sensitive skin.</p>",
    variants: [{ price: "699", sku: "ZV-BTY-SPONGE-BMB" }],
    images: [unsplash("1522337360788-8b13dee7a37e")],
  },
  {
    title: "Sandalwood Body Butter",
    handle: "sandalwood-body-butter",
    productType: "Beauty",
    tags: ["beauty", "body"],
    descriptionHtml:
      "<p>A rich shea and cocoa butter blend scented with sandalwood and warm amber — thick enough to seal in moisture overnight, without a greasy finish.</p>",
    variants: [{ price: "1299", compareAtPrice: "1599", sku: "ZV-BTY-BUTTER-SNDL" }],
    images: [unsplash("1595515106969-1ce29566ff1c")],
  },

  // ---- Electronics (3) ----
  {
    title: "Low-Profile Mechanical Keyboard",
    handle: "low-profile-mechanical-keyboard",
    productType: "Electronics",
    tags: ["electronics", "desk", "bestseller"],
    descriptionHtml:
      "<p>A compact 75%-layout mechanical keyboard with low-profile switches, PBT keycaps, and a braided USB-C cable — quiet enough for shared spaces without losing tactile feedback.</p>",
    variants: [
      { color: "Black", price: "5499", compareAtPrice: "6499", sku: "ZV-ELC-KEYB-BLK" },
      { color: "White", price: "5499", compareAtPrice: "6499", sku: "ZV-ELC-KEYB-WHT" },
    ],
    images: [unsplash("1587829741301-dc798b83add3"), unsplash("1591370874773-6702e8f12fd8")],
  },
  {
    title: "Webcam Privacy Cover Set",
    handle: "webcam-privacy-cover-set",
    productType: "Electronics",
    tags: ["electronics", "accessories"],
    descriptionHtml:
      "<p>Ultra-thin sliding covers for laptop and external webcams, in three sizes to fit most devices without interfering with the lid closing.</p>",
    variants: [{ price: "399", sku: "ZV-ELC-WEBCAM-COVER" }],
    images: [unsplash("1587033411391-5d9e51cce126")],
  },
  {
    title: "USB-C 7-in-1 Hub Adapter",
    handle: "usb-c-7-in-1-hub-adapter",
    productType: "Electronics",
    tags: ["electronics", "desk", "new"],
    descriptionHtml:
      "<p>A single aluminum-bodied hub adding HDMI, two USB-A, SD/microSD, and 100W pass-through charging to any USB-C laptop — small enough to leave permanently plugged in.</p>",
    variants: [{ price: "2499", sku: "ZV-ELC-HUB-USBC" }],
    images: [unsplash("1591370874773-6702e8f12fd8"), unsplash("1587033411391-5d9e51cce126")],
  },
];

// ---------------------------------------------------------------------------

const LOCATIONS_QUERY = `
  query { locations(first: 1) { nodes { id name } } }
`;

const PUBLICATIONS_QUERY = `
  query { publications(first: 10) { nodes { id name } } }
`;

const PRODUCT_SET_MUTATION = `
  mutation ProductSet($input: ProductSetInput!, $synchronous: Boolean!) {
    productSet(input: $input, synchronous: $synchronous) {
      product {
        id
        handle
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const PUBLISH_MUTATION = `
  mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

function buildProductOptions(product) {
  const optionNames = new Set();
  for (const v of product.variants) {
    if (v.color) optionNames.add("Color");
    if (v.size) optionNames.add("Size");
  }

  // Shopify requires at least one option + non-null optionValues per variant,
  // even for simple single-variant products — fall back to Title/Default Title.
  if (optionNames.size === 0) {
    return [{ name: "Title", values: [{ name: "Default Title" }] }];
  }

  return Array.from(optionNames).map((name) => {
    const values = Array.from(
      new Set(
        product.variants
          .map((v) => (name === "Color" ? v.color : v.size))
          .filter(Boolean),
      ),
    );
    return { name, values: values.map((name) => ({ name })) };
  });
}

function buildVariantInput(product, variant, locationId) {
  const optionValues = [];
  if (variant.color) optionValues.push({ optionName: "Color", name: variant.color });
  if (variant.size) optionValues.push({ optionName: "Size", name: variant.size });
  if (optionValues.length === 0) {
    optionValues.push({ optionName: "Title", name: "Default Title" });
  }

  return {
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    sku: variant.sku,
    optionValues,
    inventoryPolicy: "DENY",
    inventoryQuantities: [{ locationId, name: "available", quantity: 40 }],
  };
}

async function main() {
  console.log(`Seeding products into ${DOMAIN} ...\n`);

  const { locations } = await adminFetch(LOCATIONS_QUERY);
  const locationId = locations.nodes[0]?.id;
  if (!locationId) throw new Error("No fulfillment location found on this store.");

  const { publications } = await adminFetch(PUBLICATIONS_QUERY);
  // Publish to every sales channel (Online Store, POS, and any headless/custom
  // storefront channel) — the app's Storefront API token may be scoped to a
  // channel other than "Online Store", so publishing to just one isn't enough.
  if (publications.nodes.length === 0) {
    console.warn("No sales channels found — products will be created but not published.");
  }

  const results = [];

  for (const product of PRODUCTS) {
    const input = {
      title: product.title,
      handle: product.handle,
      descriptionHtml: product.descriptionHtml,
      vendor: "ZEEVARA",
      productType: product.productType,
      tags: product.tags,
      status: "ACTIVE",
      productOptions: buildProductOptions(product),
      variants: product.variants.map((v) => buildVariantInput(product, v, locationId)),
      files: product.images.map((url) => ({
        originalSource: url,
        alt: product.title,
        contentType: "IMAGE",
      })),
    };

    try {
      const { productSet } = await adminFetch(PRODUCT_SET_MUTATION, { input, synchronous: true });

      if (productSet.userErrors.length > 0) {
        console.error(`✖ ${product.title}: ${JSON.stringify(productSet.userErrors)}`);
        results.push({ title: product.title, status: "failed", error: productSet.userErrors });
        continue;
      }

      const created = productSet.product;

      if (publications.nodes.length > 0) {
        const { publishablePublish } = await adminFetch(PUBLISH_MUTATION, {
          id: created.id,
          input: publications.nodes.map((p) => ({ publicationId: p.id })),
        });
        if (publishablePublish.userErrors.length > 0) {
          console.warn(`  (publish warning for ${product.title}: ${JSON.stringify(publishablePublish.userErrors)})`);
        }
      }

      console.log(`✔ ${created.title} (${created.handle})`);
      results.push({ title: created.title, handle: created.handle, status: "created" });
    } catch (err) {
      console.error(`✖ ${product.title}: ${err.message}`);
      results.push({ title: product.title, status: "failed", error: err.message });
    }
  }

  const created = results.filter((r) => r.status === "created").length;
  console.log(`\nDone — ${created}/${PRODUCTS.length} products created.`);

  const failed = results.filter((r) => r.status === "failed");
  if (failed.length > 0) {
    console.log("\nFailed:");
    for (const f of failed) console.log(`  - ${f.title}: ${JSON.stringify(f.error)}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
