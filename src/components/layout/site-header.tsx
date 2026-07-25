"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SearchCommand } from "@/components/shared/search-command";
import { ZeevaraLockup } from "@/components/shared/zeevara-lockup";
import { MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { useUiStore } from "@/stores/ui-store";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useMounted } from "@/hooks/use-mounted";
import { PRIMARY_NAV } from "@/constants/nav";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";

const TRANSPARENT_SCROLL_THRESHOLD = 80;

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isHome) setScrolled(latest > TRANSPARENT_SCROLL_THRESHOLD);
  });

  const transparent = isHome && !scrolled;

  const toggleMobileNav = useUiStore((s) => s.toggleMobileNav);
  const openCart = useUiStore((s) => s.openCart);
  const { totalQuantity } = useCart();
  const { items: wishlistItems } = useWishlist();
  const mounted = useMounted();

  return (
    <>
      <header
        className={cn(
          "sticky top-9 z-30 w-full transition-colors duration-300",
          transparent
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border bg-background shadow-sm",
        )}
      >
        <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6 md:px-6 md:py-4">
          <Link href={routes.home()} aria-label="ZEEVARA home">
            <ZeevaraLockup size="lg" />
          </Link>

          <nav aria-label="Primary" className="flex items-center justify-center gap-1">
            {PRIMARY_NAV.map((item) =>
              item.hasMegaMenu ? (
                <MegaMenu key="mega-menu" />
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Wishlist"
              className="relative"
              render={<Link href={routes.wishlist()} />}
              nativeButton={false}
            >
              <Heart className="size-4" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                  {wishlistItems.length}
                </span>
              )}
            </Button>

            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="size-4" />
            </Button>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              aria-label="Open cart"
              className="relative"
              onClick={openCart}
            >
              <ShoppingBag className="size-4" />
              {mounted && totalQuantity > 0 && (
                <AnimatePresence>
                  <motion.span
                    key={totalQuantity}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background"
                  >
                    {totalQuantity}
                  </motion.span>
                </AnimatePresence>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            onClick={() => toggleMobileNav(true)}
          >
            <Menu className="size-5" />
          </Button>

          <Link href={routes.home()} aria-label="ZEEVARA home">
            <ZeevaraLockup size="md" showTagline={false} />
          </Link>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open cart"
              className="relative"
              onClick={openCart}
            >
              <ShoppingBag className="size-4" />
              {mounted && totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                  {totalQuantity}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <MobileNav />
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
