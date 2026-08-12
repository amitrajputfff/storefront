const ADMIN_API_VERSION = "2025-01";

function redact(value: string | undefined): string {
  if (!value) return "(unset)";
  if (value.length <= 8) return `${value.length} chars`;
  return `${value.slice(0, 4)}...${value.slice(-4)} (${value.length} chars)`;
}

export function isShopifyAdminConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_APP_CLIENT_ID &&
      process.env.SHOPIFY_ADMIN_CLIENT_SECRET,
  );
}

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

/** Mints a fresh Admin API token via the client-credentials grant, cached
 * in-memory until shortly before it expires (tokens are valid ~24h). */
async function getAdminAccessToken(): Promise<string> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_APP_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;

  const sensitiveNamePattern = /secret|token|key|password/i;
  const envDump = Object.fromEntries(
    Object.keys(process.env)
      .sort()
      .map((k) => [k, sensitiveNamePattern.test(k) ? redact(process.env[k]) : process.env[k]]),
  );
  console.error("[admin-client] full env dump:", envDump);

  console.error("[admin-client] env check:", {
    domain,
    clientId: redact(clientId),
    clientSecret: redact(clientSecret),
  });

  if (!domain || !clientId || !clientSecret) {
    throw new Error(
      "Shopify Admin API is not configured — set SHOPIFY_STORE_DOMAIN, SHOPIFY_APP_CLIENT_ID, and SHOPIFY_ADMIN_CLIENT_SECRET",
    );
  }

  if (cachedToken && Date.now() < cachedTokenExpiresAt) {
    console.error("[admin-client] using cached token:", redact(cachedToken));
    return cachedToken;
  }

  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[admin-client] token mint failed: ${res.status}`, body);
    throw new Error(`Failed to mint Shopify Admin API token: ${res.status}`);
  }

  const data = await res.json();
  console.error("[admin-client] token minted:", redact(data.access_token), "expires_in:", data.expires_in);
  cachedToken = data.access_token;
  // Refresh 10 minutes before actual expiry as a safety margin.
  cachedTokenExpiresAt = Date.now() + (data.expires_in - 600) * 1000;
  return cachedToken!;
}

export async function adminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = await getAdminAccessToken();

  const res = await fetch(`https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    console.error("[admin-client] graphql call failed:", {
      domain,
      status: res.status,
      tokenUsed: redact(token),
      errors: json.errors ?? res.statusText,
    });
    throw new Error(`Shopify Admin API request failed: ${JSON.stringify(json.errors ?? res.statusText)}`);
  }

  return json.data as T;
}
