#!/usr/bin/env node
/**
 * One-off fix: replaces the media on already-created products with the
 * corrected image set from create-products.mjs's PRODUCTS array (re-imported
 * here by handle), without recreating or otherwise touching the products.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ADMIN_API_VERSION = "2025-01";

function loadEnvLocal() {
  const content = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
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

async function adminFetch(query, variables) {
  const res = await fetch(`https://${DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": ADMIN_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(`Admin API request failed (${res.status}): ${JSON.stringify(json.errors ?? json)}`);
  }
  return json.data;
}

function unsplash(id, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${width}&auto=format&fit=crop`;
}

// handle -> corrected image IDs (must match scripts/create-products.mjs)
const CORRECTED_IMAGES = {
  "enamel-cast-iron-dutch-oven": ["1556909212-d5b604d0c90d", "1590794056226-79ef3a8147e1"],
  "copper-measuring-cup-set": ["1556909172-54557c7e4fb7", "1556911220-e15b29be8c8f"],
  "marble-mortar-and-pestle": ["1556909172-54557c7e4fb7"],
  "glass-storage-jar-set": ["1556911220-e15b29be8c8f", "1556909212-d5b604d0c90d"],
  "adjustable-dumbbell-set": ["1517836357463-d25dfeac3438", "1595078475328-1ab05d0a6a0e"],
  "cork-yoga-block-duo": ["1518611012118-696072aa579a"],
  "compression-recovery-sleeves": ["1571008887538-b36bb32f4571", "1571019613454-1cb2f99b2d8b"],
  "insulated-gym-water-bottle": ["1602143407151-7111542de6e8", "1523362628745-0c100150b504"],
  "vitamin-c-brightening-serum": ["1608571423902-eed4a5ad8108", "1602910344008-22f323cc1817"],
  "sandalwood-body-butter": ["1595515106969-1ce29566ff1c"],
  "low-profile-mechanical-keyboard": ["1587829741301-dc798b83add3", "1591370874773-6702e8f12fd8"],
  "usb-c-7-in-1-hub-adapter": ["1591370874773-6702e8f12fd8", "1587033411391-5d9e51cce126"],
};

const HANDLE_QUERY = `query($handle: String!) { productByHandle(handle: $handle) { id title media(first: 10) { nodes { id } } } }`;

const DETACH_MEDIA_MUTATION = `
  mutation($productId: ID!, $mediaIds: [ID!]!) {
    productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
      deletedMediaIds
      userErrors { field message }
    }
  }
`;

const CREATE_MEDIA_MUTATION = `
  mutation($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media { id }
      mediaUserErrors { field message }
    }
  }
`;

async function main() {
  for (const [handle, imageIds] of Object.entries(CORRECTED_IMAGES)) {
    const { productByHandle } = await adminFetch(HANDLE_QUERY, { handle });
    if (!productByHandle) {
      console.log(`✖ ${handle}: not found`);
      continue;
    }

    const existingMediaIds = productByHandle.media.nodes.map((n) => n.id);
    if (existingMediaIds.length > 0) {
      const { productDeleteMedia } = await adminFetch(DETACH_MEDIA_MUTATION, {
        productId: productByHandle.id,
        mediaIds: existingMediaIds,
      });
      if (productDeleteMedia.userErrors.length > 0) {
        console.log(`  (delete warning for ${handle}: ${JSON.stringify(productDeleteMedia.userErrors)})`);
      }
    }

    const { productCreateMedia } = await adminFetch(CREATE_MEDIA_MUTATION, {
      productId: productByHandle.id,
      media: imageIds.map((id) => ({
        originalSource: unsplash(id),
        alt: productByHandle.title,
        mediaContentType: "IMAGE",
      })),
    });

    if (productCreateMedia.mediaUserErrors.length > 0) {
      console.log(`✖ ${handle}: ${JSON.stringify(productCreateMedia.mediaUserErrors)}`);
    } else {
      console.log(`✔ ${handle} — replaced with ${imageIds.length} corrected image(s)`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
