import { Money } from "@/types";

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatMoney(money: Money): string {
  return inrFormatter.format(money.amount);
}

export function formatPrice(amount: number): string {
  return inrFormatter.format(amount);
}

export function discountPercent(price: Money, compareAt?: Money): number | null {
  if (!compareAt || compareAt.amount <= price.amount) return null;
  return Math.round(((compareAt.amount - price.amount) / compareAt.amount) * 100);
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
});

export function formatShortDate(date: Date): string {
  return dateFormatter.format(date);
}

/** Adds N business days (Mon–Sat) to a date, skipping Sundays. */
export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0) added++;
  }
  return result;
}

export function estimatedDeliveryLabel(fromDate: Date, minDays = 2, maxDays = 5): string {
  const min = addBusinessDays(fromDate, minDays);
  const max = addBusinessDays(fromDate, maxDays);
  return `Arrives ${formatShortDate(min)} – ${formatShortDate(max)}`;
}

const fullDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatFullDate(iso: string): string {
  return fullDateFormatter.format(new Date(iso));
}
