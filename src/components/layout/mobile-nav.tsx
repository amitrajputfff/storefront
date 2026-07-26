"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, Mail, Package, RotateCcw, Search, Truck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SearchCommand } from "@/components/shared/search-command";
import { useUiStore } from "@/stores/ui-store";
import { routes } from "@/constants/routes";
import { RETURN_WINDOW_DAYS } from "@/constants/site";
import { NavMenu } from "@/types";

export function MobileNav({ navMenu }: { navMenu: NavMenu }) {
  const isMobileNavOpen = useUiStore((s) => s.isMobileNavOpen);
  const toggleMobileNav = useUiStore((s) => s.toggleMobileNav);
  const [searchOpen, setSearchOpen] = useState(false);

  function closeNav() {
    toggleMobileNav(false);
  }

  function openSearch() {
    setSearchOpen(true);
    closeNav();
  }

  return (
    <>
      <Sheet open={isMobileNavOpen} onOpenChange={(open) => toggleMobileNav(open)}>
        <SheetContent side="left" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription className="sr-only">Site navigation</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {navMenu.columns.length > 0 && (
              <Accordion>
                {navMenu.columns.map((column) => (
                  <AccordionItem key={column.categoryHandle} value={column.categoryHandle}>
                    <AccordionTrigger>{column.heading}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col gap-2">
                        {column.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={closeNav}
                              className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4">
              <button
                type="button"
                onClick={openSearch}
                className="flex items-center gap-2 py-2 text-sm font-medium text-foreground"
              >
                <Search className="size-4" />
                Search
              </button>
              <Link
                href={routes.trackOrder()}
                onClick={closeNav}
                className="flex items-center gap-2 py-2 text-sm font-medium text-foreground"
              >
                <Package className="size-4" />
                Track Order
              </Link>
              <Link
                href={routes.contact()}
                onClick={closeNav}
                className="flex items-center gap-2 py-2 text-sm font-medium text-foreground"
              >
                <Mail className="size-4" />
                Contact
              </Link>
              <Link
                href={routes.faq()}
                onClick={closeNav}
                className="flex items-center gap-2 py-2 text-sm font-medium text-foreground"
              >
                <HelpCircle className="size-4" />
                FAQ
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-medium text-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>

          <SheetFooter className="border-t border-border p-4">
            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="size-4" />
                Free shipping on every order
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="size-4" />
                {RETURN_WINDOW_DAYS}-day returns
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
