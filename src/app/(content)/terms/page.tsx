import { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL } from "@/constants/site";

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_NAME}`,
  description: "The terms governing your use of ZEEVARA and purchases made on the site.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="mb-2 text-3xl font-medium tracking-tight md:text-4xl">Terms of Service</h1>
      <p className="text-muted-foreground mb-12 text-sm">Last updated: July 2026</p>

      <div className="space-y-10 text-sm leading-relaxed">
        <section>
          <h2 className="mb-3 text-lg font-medium">Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using {SITE_NAME}, you agree to be bound by these Terms of
            Service. If you don&apos;t agree with any part of these terms, please don&apos;t
            use the site.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Orders &amp; Pricing</h2>
          <p className="text-muted-foreground">
            All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes
            unless stated otherwise. We reserve the right to correct pricing errors and to
            limit order quantities. An order is confirmed only once you receive an order
            confirmation email.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Product Descriptions</h2>
          <p className="text-muted-foreground">
            We aim to describe and photograph every product as accurately as possible. Minor
            variations in color or finish (particularly for handmade ceramic and wood pieces)
            are natural and not considered defects.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Account Responsibilities</h2>
          <p className="text-muted-foreground">
            If you create an account, you&apos;re responsible for maintaining the
            confidentiality of your login details and for all activity under your account.
            Notify us immediately of any unauthorized use.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Intellectual Property</h2>
          <p className="text-muted-foreground">
            All content on this site — including product photography, copy, and the ZEEVARA
            name and logo — is the property of ZEEVARA and may not be reproduced without
            permission.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            ZEEVARA is not liable for indirect or incidental damages arising from the use of
            our products or site, to the fullest extent permitted by law.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Changes to These Terms</h2>
          <p className="text-muted-foreground">
            We may update these terms from time to time. Continued use of the site after
            changes are posted constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Governing Law</h2>
          <p className="text-muted-foreground">
            These terms are governed by the laws of India. Questions about these terms can be
            sent to {CONTACT_EMAIL}.
          </p>
        </section>
      </div>
    </main>
  );
}
