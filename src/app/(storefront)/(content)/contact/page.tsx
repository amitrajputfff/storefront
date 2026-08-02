import { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, MessageCircleQuestion } from "lucide-react";
import { ContactForm } from "@/components/content/contact-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { SITE_NAME } from "@/constants/site";
import { getContent } from "@/lib/content/get-content";

export const metadata: Metadata = {
  title: `Contact | ${SITE_NAME}`,
  description: "Get in touch with the ZEEVARA support team.",
};

export default async function ContactPage() {
  const content = await getContent("contact.intro");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
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
                href={`mailto:${content.contactEmail}`}
                className="text-muted-foreground text-sm hover:text-foreground hover:underline"
              >
                {content.contactEmail}
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Support hours</p>
              <p className="text-muted-foreground text-sm">{content.contactHours}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MessageCircleQuestion className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Looking for quick answers?</p>
              <Link href={content.faqPrompt.href} className="text-sm underline underline-offset-4">
                {content.faqPrompt.label}
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
