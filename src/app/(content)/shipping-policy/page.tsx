import { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL } from "@/constants/site";

export const metadata: Metadata = {
  title: `Shipping Policy | ${SITE_NAME}`,
  description: "ZEEVARA's shipping policy — processing times, delivery estimates, and costs.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="mb-2 text-3xl font-medium tracking-tight md:text-4xl">Shipping Policy</h1>
      <p className="text-muted-foreground mb-12 text-sm">Last updated: July 2026</p>

      <div className="space-y-10 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-lg font-medium">Processing Time</h2>
          <p className="text-muted-foreground">
            Orders are processed within 1-2 business days of being placed. During high-demand
            periods (like sale events), processing may take up to 3 business days. You&apos;ll
            receive a shipping confirmation email as soon as your order leaves our warehouse.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Delivery Estimates by Region</h2>
          <p className="text-muted-foreground">
            Once shipped, delivery typically takes:
          </p>
          <ul className="text-muted-foreground mt-3 list-disc space-y-1.5 pl-5">
            <li>Metro cities (Mumbai, Delhi NCR, Bengaluru, Chennai, Hyderabad, Kolkata, Pune): 2-4 business days</li>
            <li>Other cities and towns: 4-6 business days</li>
            <li>Remote and rural pincodes: 6-8 business days</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Shipping Costs</h2>
          <p className="text-muted-foreground">
            Every order ships free across India, with no minimum order value.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Order Tracking</h2>
          <p className="text-muted-foreground">
            You&apos;ll receive a tracking link by email and SMS as soon as your order ships.
            If you haven&apos;t received tracking within 3 business days of ordering, contact
            us at {CONTACT_EMAIL} with your order number.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">International Shipping</h2>
          <p className="text-muted-foreground">
            We currently ship only within India. We know international shipping is frequently
            requested, and we&apos;re actively evaluating it — this page will be updated when
            it becomes available.
          </p>
        </section>
      </div>
    </main>
  );
}
