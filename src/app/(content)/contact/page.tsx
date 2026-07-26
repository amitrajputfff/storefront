import { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, MessageCircleQuestion } from "lucide-react";
import { ContactForm } from "@/components/content/contact-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { CONTACT_EMAIL, CONTACT_HOURS, SITE_NAME } from "@/constants/site";
import { routes } from "@/constants/routes";

export const metadata: Metadata = {
  title: `Contact | ${SITE_NAME}`,
  description: "Get in touch with the ZEEVARA support team.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <SectionHeading
        eyebrow="Get in touch"
        title="Contact Us"
        description="Questions about an order, a product, or anything else — we're here to help."
        className="mb-12"
      />
      <div className="grid gap-12 md:grid-cols-[1fr_320px]">
        <ContactForm />
        <aside className="space-y-6 border-t pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-10">
          <div className="flex gap-3">
            <Mail className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-muted-foreground text-sm hover:text-foreground hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Support hours</p>
              <p className="text-muted-foreground text-sm">{CONTACT_HOURS}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MessageCircleQuestion className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Looking for quick answers?</p>
              <Link href={routes.faq()} className="text-sm underline underline-offset-4">
                Check our FAQ
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
