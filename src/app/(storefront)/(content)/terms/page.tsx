import { Metadata } from "next";
import { SITE_NAME } from "@/constants/site";
import { getPage } from "@/lib/content/get-content";
import { RichText } from "@/components/content/rich-text";

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_NAME}`,
  description: "The terms governing your use of ZEEVARA and purchases made on the site.",
};

export default async function TermsPage() {
  const page = await getPage("terms");

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="mb-2 text-3xl font-medium tracking-tight md:text-4xl">{page.title}</h1>
      <p className="text-muted-foreground mb-12 text-sm">{page.lastUpdatedLabel}</p>
      <RichText html={page.bodyHtml} className="text-sm" />
    </main>
  );
}
