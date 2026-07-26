#!/usr/bin/env node
/**
 * One-off local OAuth helper: exchanges a Shopify custom-app Client ID +
 * Client Secret for a real Admin API access token, then writes it into
 * .env.local as SHOPIFY_ADMIN_ACCESS_TOKEN.
 *
 * Usage:
 *   SHOPIFY_CLIENT_ID=... SHOPIFY_CLIENT_SECRET=... node scripts/oauth-get-admin-token.mjs
 *
 * The client id/secret are read from env vars only (never written to disk),
 * so they don't linger in any file after this script finishes.
 */

import { createServer } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(__dirname, "..", ".env.local");
const PORT = 8787;
const REDIRECT_URI = `http://localhost:${PORT}/shopify/callback`;
const SCOPES = "write_products,read_products";

const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;

function readEnvLocal() {
  if (!existsSync(ENV_PATH)) return {};
  const content = readFileSync(ENV_PATH, "utf8");
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

const existingEnv = readEnvLocal();
const DOMAIN = existingEnv.SHOPIFY_STORE_DOMAIN;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET as env vars before running this script.");
  process.exit(1);
}
if (!DOMAIN) {
  console.error("SHOPIFY_STORE_DOMAIN not found in .env.local.");
  process.exit(1);
}

const state = Math.random().toString(36).slice(2);

function verifyHmac(query) {
  const { hmac, ...rest } = query;
  const message = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("&");
  const digest = createHmac("sha256", CLIENT_SECRET).update(message).digest("hex");
  const a = Buffer.from(digest);
  const b = Buffer.from(hmac ?? "");
  return a.length === b.length && timingSafeEqual(a, b);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname !== "/shopify/callback") {
    res.writeHead(404).end();
    return;
  }

  const query = Object.fromEntries(url.searchParams.entries());

  if (query.state !== state) {
    res.writeHead(400).end("State mismatch — possible CSRF, aborting.");
    server.close();
    return;
  }

  if (!verifyHmac(query)) {
    res.writeHead(400).end("HMAC verification failed — aborting.");
    server.close();
    return;
  }

  try {
    const tokenRes = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: query.code,
      }),
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok || !data.access_token) {
      throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
    }

    const envContent = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
    const withoutOldToken = envContent
      .split("\n")
      .filter((line) => !line.startsWith("SHOPIFY_ADMIN_ACCESS_TOKEN="))
      .join("\n");
    const newContent = `${withoutOldToken.trimEnd()}\nSHOPIFY_ADMIN_ACCESS_TOKEN=${data.access_token}\n`;
    writeFileSync(ENV_PATH, newContent);

    res.writeHead(200, { "Content-Type": "text/html" }).end(
      "<html><body style='font-family: sans-serif; padding: 2rem;'><h2>Done — you can close this tab.</h2></body></html>",
    );

    console.log(`\n✔ Admin API access token saved to .env.local (scope: ${data.scope})`);
    server.close();
  } catch (err) {
    res.writeHead(500).end(`Error: ${err.message}`);
    console.error("Token exchange error:", err.message);
    server.close();
  }
});

server.listen(PORT, () => {
  const authorizeUrl =
    `https://${DOMAIN}/admin/oauth/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&scope=${SCOPES}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${state}`;

  console.log(`\nListening on ${REDIRECT_URI} — now open this URL in your browser and approve access:\n`);
  console.log(authorizeUrl);
  console.log("\nWaiting for you to approve in the browser...\n");
});
