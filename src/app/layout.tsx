import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { QuickViewDialog } from "@/components/product/quick-view-dialog";
import { RecentPurchaseToastMounter } from "@/components/shared/recent-purchase-toast-mounter";
import { ChatWidget } from "@/components/chat/chat-widget";
import { JsonLd, buildOrganizationJsonLd } from "@/lib/jsonld";
import { getNavMenu } from "@/lib/nav-menu";
import { getAllProducts } from "@/mock/products";
import { getActivePromoCodes } from "@/lib/shopify/discounts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/constants/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navMenu, products, promoCodes] = await Promise.all([
    getNavMenu(),
    getAllProducts(),
    getActivePromoCodes(),
  ]);
  const productTitles = products.map((p) => p.title);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={buildOrganizationJsonLd()} />
        <AppProviders>
          <AnnouncementBar promoCodes={promoCodes} />
          <SiteHeader navMenu={navMenu} />
          <div className="flex-1">{children}</div>
          <SiteFooter navMenu={navMenu} />
          <CartDrawer />
          <QuickViewDialog />
          <RecentPurchaseToastMounter productTitles={productTitles} />
          <ChatWidget />
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
