import Link from "next/link";
import { BadgeCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { routes } from "@/constants/routes";
import { categories } from "@/mock/categories";
import { CONTACT_EMAIL, CONTACT_HOURS, FREE_SHIPPING_THRESHOLD, SITE_NAME } from "@/constants/site";
import { formatPrice } from "@/lib/format";
import { NewsletterForm } from "./newsletter-form";
import { ZeevaraWordmark } from "@/components/shared/zeevara-wordmark";

const trustItems = [
  { icon: Truck, label: `Free shipping over ${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
  { icon: RotateCcw, label: "30-day returns" },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: BadgeCheck, label: "Considered, quality-checked" },
];

const shopLinks = categories
  .slice(0, 5)
  .map((category) => ({ label: category.name, href: routes.collection(category.handle) }));

const helpLinks = [
  { label: "FAQ", href: routes.faq() },
  { label: "Shipping Policy", href: routes.shippingPolicy() },
  { label: "Return Policy", href: routes.returnPolicy() },
  { label: "Contact", href: routes.contact() },
];

const companyLinks = [
  { label: "About", href: routes.about() },
  { label: "Contact", href: routes.contact() },
];

const legalLinks = [
  { label: "Privacy", href: routes.privacy() },
  { label: "Terms", href: routes.terms() },
  { label: "Shipping Policy", href: routes.shippingPolicy() },
  { label: "Return Policy", href: routes.returnPolicy() },
];

const paymentMethods = ["Visa", "Mastercard", "UPI", "RuPay"];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 border-b border-border px-6 py-8 sm:grid-cols-4">
        {trustItems.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="size-5 shrink-0 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <ZeevaraWordmark size="sm" />
            <p className="max-w-xs text-sm text-muted-foreground">
              Join the list for new arrivals, considered edits, and offers you won&apos;t find
              anywhere else.
            </p>
            <NewsletterForm />
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground">Shop</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground">Help</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              {CONTACT_EMAIL}
              <br />
              {CONTACT_HOURS}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground">Company</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-foreground">Legal</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-6 py-6">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-border px-6 py-4">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {SITE_NAME}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <Link key={`bottom-${link.label}`} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
