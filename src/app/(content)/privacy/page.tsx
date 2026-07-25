import { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL } from "@/constants/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: "How ZEEVARA collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="mb-2 text-3xl font-medium tracking-tight md:text-4xl">Privacy Policy</h1>
      <p className="text-muted-foreground mb-12 text-sm">Last updated: July 2026</p>

      <div className="space-y-10 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-lg font-medium">Information We Collect</h2>
          <p className="text-muted-foreground">
            When you browse ZEEVARA or place an order, we collect information you provide
            directly (name, email, shipping address, phone number, payment details) and
            information collected automatically (device type, browser, pages viewed, and
            approximate location via IP address) to operate and improve the site.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">How We Use Your Information</h2>
          <ul className="text-muted-foreground list-disc space-y-1.5 pl-5">
            <li>To process and deliver your orders, and communicate about their status</li>
            <li>To respond to customer support requests</li>
            <li>To send order-related and, if you&apos;ve opted in, marketing emails</li>
            <li>To improve our product catalog, site performance, and shopping experience</li>
            <li>To detect and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Cookies</h2>
          <p className="text-muted-foreground">
            We use cookies and similar technologies to keep you signed in, remember your cart
            and wishlist, and understand how the site is used. You can disable cookies in your
            browser settings, though some features may not work correctly as a result.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Third-Party Processors</h2>
          <p className="text-muted-foreground">
            When our commerce platform is connected, order and payment information will be
            shared with the payment processor and shipping/logistics partners solely to
            fulfil your order. We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Your Rights</h2>
          <p className="text-muted-foreground">
            You can request a copy of the personal data we hold about you, ask us to correct
            inaccurate information, or request deletion of your account and associated data,
            subject to legal record-keeping requirements. Contact {CONTACT_EMAIL} to make a
            request.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Data Retention &amp; Security</h2>
          <p className="text-muted-foreground">
            We retain order data for as long as needed to comply with tax and accounting
            obligations, and use industry-standard safeguards to protect it against
            unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Governing Law</h2>
          <p className="text-muted-foreground">
            This policy is governed by the laws of India. For any privacy-related questions or
            concerns, reach out to {CONTACT_EMAIL}.
          </p>
        </section>
      </div>
    </main>
  );
}
