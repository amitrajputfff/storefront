import Link from "next/link";
import type { SVGProps } from "react";
import { BadgeCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { routes } from "@/constants/routes";
import { NavMenu } from "@/types";
import { CONTACT_EMAIL, CONTACT_HOURS, RETURN_WINDOW_DAYS, SITE_NAME } from "@/constants/site";
import { NewsletterForm } from "./newsletter-form";
import { ZeevaraWordmark } from "@/components/shared/zeevara-wordmark";

const trustItems = [
  { icon: Truck, label: "Free shipping on every order" },
  { icon: RotateCcw, label: `${RETURN_WINDOW_DAYS}-day returns` },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: BadgeCheck, label: "Considered, quality-checked" },
];

// lucide-react dropped brand/logo icons — small inline marks instead.
function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M15 4h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h2.5l.5-4h-3V8a1 1 0 0 1 1-1h2z" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const socialLinks = [
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: YoutubeIcon, label: "YouTube", href: "https://youtube.com" },
];

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

export function SiteFooter({ navMenu }: { navMenu: NavMenu }) {
  const shopLinks = navMenu.columns
    .slice(0, 5)
    .map((column) => ({ label: column.heading, href: routes.collection(column.categoryHandle) }));

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 border-b border-footer-foreground/10 px-6 py-8 sm:grid-cols-4">
        {trustItems.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="size-5 shrink-0 text-primary" />
            <span className="text-sm text-footer-foreground/75">{label}</span>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <ZeevaraWordmark size="sm" className="invert" />
            <p className="max-w-xs text-sm text-footer-foreground/75">
              Join the list for new arrivals, considered edits, and offers you won&apos;t find
              anywhere else.
            </p>
            <NewsletterForm />
            <div className="mt-2 flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-footer-foreground/15 text-footer-foreground/75 transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {shopLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-footer-foreground">Shop</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-footer-foreground/75 hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-footer-foreground">Help</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-footer-foreground/75 hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-footer-foreground/60">
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
              <br />
              {CONTACT_HOURS}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-footer-foreground">Company</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-footer-foreground/75 hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-footer-foreground">Legal</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-footer-foreground/75 hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-footer-foreground/10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-6 py-6">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="rounded-full bg-footer-foreground/10 px-3 py-1 text-xs font-medium text-footer-foreground/80"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-footer-foreground/10 px-6 py-4">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 text-xs text-footer-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {SITE_NAME}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <Link key={`bottom-${link.label}`} href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
