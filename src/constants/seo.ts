import { SITE_NAME, SITE_URL } from "./site";

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-default.jpg`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — Discover more everyday`,
};

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo/zeevara-mark.svg`,
} as const;
