import { cn } from "@/lib/utils";

/**
 * Renders admin-authored HTML — sanitized server-side at save time (see
 * src/lib/admin/rich-text.ts), so the read path here stays a bare
 * dangerouslySetInnerHTML with no per-request cost. Same trust boundary as
 * the Shopify descriptionHtml rendering elsewhere in this app: only the
 * store owner can author this content, not customers.
 */
export function RichText({ html, className }: { html: string; className?: string }) {
  return <div className={cn("prose-content", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
