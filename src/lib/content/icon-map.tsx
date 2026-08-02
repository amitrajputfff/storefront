import {
  Gem,
  RotateCcw,
  Leaf,
  Ruler,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Package,
  Heart,
  Sparkles,
  Clock,
  CreditCard,
  Recycle,
  Award,
  type LucideIcon,
} from "lucide-react";

/**
 * A closed, curated set — not a free-text lucide icon name. Storing an
 * arbitrary name would mean bundling ~1500 icons (or a dynamic import map)
 * and one admin typo would silently render nothing. This keeps the bundle
 * static and the visual language coherent.
 */
export const ICON_MAP = {
  gem: Gem,
  "rotate-ccw": RotateCcw,
  leaf: Leaf,
  ruler: Ruler,
  truck: Truck,
  "shield-check": ShieldCheck,
  "badge-check": BadgeCheck,
  package: Package,
  heart: Heart,
  sparkles: Sparkles,
  clock: Clock,
  "credit-card": CreditCard,
  recycle: Recycle,
  award: Award,
} as const satisfies Record<string, LucideIcon>;

export const ICON_NAMES = Object.keys(ICON_MAP) as [IconName, ...IconName[]];

export type IconName = keyof typeof ICON_MAP;

export function AdminIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = ICON_MAP[name] ?? ICON_MAP.sparkles;
  return <Icon className={className} />;
}
