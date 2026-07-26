import { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL } from "@/constants/site";

export const metadata: Metadata = {
  title: `Return Policy | ${SITE_NAME}`,
  description: "ZEEVARA's return and exchange policy — eligibility, process, and refund timelines.",
};

export default function ReturnPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="mb-2 text-3xl font-medium tracking-tight md:text-4xl">Return Policy</h1>
      <p className="text-muted-foreground mb-12 text-sm">Last updated: July 2026</p>

      <div className="prose-content space-y-10 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-lg font-medium">Our Promise</h2>
          <p className="text-muted-foreground">
            If something you ordered doesn&apos;t work out, we want to make it right. We
            accept returns on eligible items within 7 days of delivery, no complicated
            reasons required.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Eligibility Window</h2>
          <p className="text-muted-foreground">
            Returns are accepted within 7 days of the delivery date shown on your tracking
            confirmation. Items must be unused, in their original packaging, and in resellable
            condition. Products showing signs of use, damage not caused by shipping, or missing
            original packaging may not be eligible for a full refund.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">How to Start a Return</h2>
          <ol className="text-muted-foreground list-decimal space-y-2 pl-5">
            <li>
              Email {CONTACT_EMAIL} with your order number and the item(s) you&apos;d like to
              return, along with a brief reason.
            </li>
            <li>
              Our support team will confirm eligibility and send a prepaid return shipping
              label within 1-2 business days.
            </li>
            <li>
              Pack the item securely in its original packaging where possible and hand it to
              the courier using the provided label.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Refund Timelines</h2>
          <p className="text-muted-foreground">
            Once we receive and inspect your return, refunds are processed within 5-7 business
            days to your original payment method. For Cash on Delivery orders, refunds are
            issued via bank transfer or store credit, whichever you prefer. You&apos;ll receive
            an email confirmation once your refund has been issued.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Exchanges</h2>
          <p className="text-muted-foreground">
            Need a different size or color instead of a refund? Let us know when you request
            your return and we&apos;ll ship the replacement as soon as the original item is on
            its way back to us, subject to stock availability.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Non-Returnable Items</h2>
          <p className="text-muted-foreground">
            For hygiene reasons, opened beauty and personal care items cannot be returned
            unless defective. Final-sale items (marked as such on the product page) and
            personalized or made-to-order pieces are also not eligible for return.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Damaged or Incorrect Items</h2>
          <p className="text-muted-foreground">
            If your order arrives damaged or you received the wrong item, contact us within 48
            hours of delivery with photos of the item and packaging. We&apos;ll arrange a free
            replacement or full refund — no return shipping cost to you.
          </p>
        </section>
      </div>
    </main>
  );
}
