import { Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { QuickViewDialog } from "@/components/product/quick-view-dialog";
import { RecentPurchaseToastLoader } from "@/components/shared/recent-purchase-toast-loader";
import { ChatWidget } from "@/components/chat/chat-widget";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { getNavMenu } from "@/lib/nav-menu";
import { getActivePromoCodes } from "@/lib/shopify/discounts";
import { getContent } from "@/lib/content/get-content";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navMenu, promoCodes, announcement] = await Promise.all([
    getNavMenu(),
    getActivePromoCodes(),
    getContent("home.announcement"),
  ]);

  return (
    <>
      <PreviewBanner />
      <AnnouncementBar promoCodes={promoCodes} messages={announcement.messages} />
      <SiteHeader navMenu={navMenu} />
      <div className="flex-1">{children}</div>
      <SiteFooter navMenu={navMenu} />
      <CartDrawer />
      <QuickViewDialog />
      <Suspense fallback={null}>
        <RecentPurchaseToastLoader />
      </Suspense>
      <ChatWidget />
    </>
  );
}
