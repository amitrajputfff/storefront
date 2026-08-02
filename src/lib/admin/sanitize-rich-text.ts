import sanitizeHtml from "sanitize-html";

/**
 * Allowlist matches exactly the Tiptap schema used by RichTextEditor (see
 * src/components/admin/editor/rich-text-editor.tsx) — StarterKit defaults
 * plus Image and TextAlign. Sanitizing here, at save time, means the public
 * read path (RichText component) stays a bare dangerouslySetInnerHTML with
 * no per-request cost.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "h2", "h3", "ul", "ol", "li", "strong", "em", "u", "s", "blockquote", "hr", "a", "img", "br", "code",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "class"],
      p: ["style"],
      h2: ["style"],
      h3: ["style"],
    },
    allowedStyles: {
      "*": { "text-align": [/^left$|^center$|^right$|^justify$/] },
    },
    allowedSchemes: ["https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
    },
  });
}
