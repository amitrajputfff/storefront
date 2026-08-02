import { Metadata } from "next";
import { SITE_NAME } from "@/constants/site";
import { getPage } from "@/lib/content/get-content";
import { RichText } from "@/components/content/rich-text";

export const metadata: Metadata = {
  title: `Return Policy | ${SITE_NAME}`,
  description: "ZEEVARA's return and exchange policy — eligibility, process, and refund timelines.",
};

export default async function ReturnPolicyPage() {
  const page = await getPage("return-policy");

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="mb-2 text-3xl font-medium tracking-tight md:text-4xl">{page.title}</h1>
      <p className="text-muted-foreground mb-12 text-sm">{page.lastUpdatedLabel}</p>
      <RichText html={page.bodyHtml} className="text-sm" />
    </main>
  );
}
