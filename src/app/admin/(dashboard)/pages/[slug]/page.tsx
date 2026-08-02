import { notFound } from "next/navigation";
import { getPage } from "@/lib/content/get-content";
import { PAGES_REGISTRY, type PageSlug } from "@/lib/content/pages-registry";
import { RichTextPageForm } from "./richtext-page-form";

type RichTextSlug = Exclude<PageSlug, "about">;
const RICHTEXT_SLUGS: RichTextSlug[] = ["privacy", "terms", "shipping-policy", "return-policy"];

export default async function AdminPageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!RICHTEXT_SLUGS.includes(slug as RichTextSlug)) notFound();

  const pageSlug = slug as RichTextSlug;
  const entry = PAGES_REGISTRY[pageSlug];
  const content = await getPage(pageSlug);

  return <RichTextPageForm slug={pageSlug} title={entry.title} previewPath={entry.previewPath} initialValue={content} />;
}
