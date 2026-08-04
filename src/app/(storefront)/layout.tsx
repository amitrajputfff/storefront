import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { QuickViewDialog } from "@/components/product/quick-view-dialog";
import { RecentPurchaseToastMounter } from "@/components/shared/recent-purchase-toast-mounter";
import { WelcomeOfferPopup } from "@/components/shared/welcome-offer-popup";
import { ChatWidget } from "@/components/chat/chat-widget";
import { PreviewBanner } from "@/components/admin/preview-banner";
import { getNavMenu } from "@/lib/nav-menu";
import { getAllProducts } from "@/mock/products";
import { getActivePromoCodes } from "@/lib/shopify/discounts";
import { getContent } from "@/lib/content/get-content";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navMenu, products, promoCodes, announcement] = await Promise.all([
    getNavMenu(),
    getAllProducts(),
    getActivePromoCodes(),
    getContent("home.announcement"),
  ]);
  const productTitles = products.map((p) => p.title);

  return (
    <>
      <PreviewBanner />
      <AnnouncementBar promoCodes={promoCodes} messages={announcement.messages} />
      <SiteHeader navMenu={navMenu} />
      <div className="flex-1">{children}</div>
      <SiteFooter navMenu={navMenu} />
      <CartDrawer />
      <QuickViewDialog />
      <RecentPurchaseToastMounter productTitles={productTitles} />
      <WelcomeOfferPopup promoCodes={promoCodes} />
      <ChatWidget />
    </>
  );
}
