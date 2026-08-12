import type { LucideIcon } from "lucide-react";
import {
  Image as ImageIcon,
  Megaphone,
  Newspaper,
  Sparkles,
  MessageSquareQuote,
  Mountain,
  ShoppingBag,
  Zap,
  LayoutGrid,
  HelpCircle,
  FileText,
  Images,
  Settings,
  Star,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Homepage",
    items: [
      { label: "Hero", href: "/admin/homepage/hero", icon: ImageIcon, description: "The full-bleed banner at the top of the homepage." },
      { label: "Announcement Bar", href: "/admin/homepage/announcement-bar", icon: Megaphone, description: "The scrolling strip above the header." },
      { label: "Press Mentions", href: "/admin/homepage/press-mentions", icon: Newspaper, description: "The \"As Featured In\" logo strip." },
      { label: "Value Props", href: "/admin/homepage/value-props", icon: Sparkles, description: "The \"Why Choose Us\" bento grid." },
      { label: "Testimonials", href: "/admin/homepage/testimonials", icon: MessageSquareQuote, description: "The scrolling customer quote strip." },
      { label: "Lifestyle Banner", href: "/admin/homepage/lifestyle-banner", icon: Mountain, description: "The full-bleed quote banner with parallax." },
      { label: "Featured Collection", href: "/admin/homepage/featured-collection", icon: ShoppingBag, description: "The split-image collection callout." },
      { label: "Flash Sale Banner", href: "/admin/homepage/flash-sale", icon: Zap, description: "The sticky countdown strip." },
      { label: "Category Tabs", href: "/admin/homepage/category-tabs", icon: LayoutGrid, description: "The \"Shop by Category\" tab section." },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "FAQ", href: "/admin/faq", icon: HelpCircle, description: "Frequently asked questions, by category." },
      { label: "Pages", href: "/admin/pages", icon: FileText, description: "About, Contact, and policy pages." },
      { label: "Reviews", href: "/admin/reviews", icon: Star, description: "Moderate and add customer reviews." },
    ],
  },
  {
    label: "Library",
    items: [{ label: "Media", href: "/admin/media", icon: Images, description: "Uploaded images." }],
  },
  {
    label: "Settings",
    items: [{ label: "Site Settings", href: "/admin/settings", icon: Settings, description: "Contact details and account." }],
  },
];

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap((g) => g.items);
