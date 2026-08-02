import type { z } from "zod";
import { aboutPageSchema, richTextPageSchema } from "./schemas";
import {
  ABOUT_PAGE_DEFAULTS,
  PRIVACY_PAGE_DEFAULTS,
  TERMS_PAGE_DEFAULTS,
  SHIPPING_POLICY_PAGE_DEFAULTS,
  RETURN_POLICY_PAGE_DEFAULTS,
} from "./defaults";

interface PageEntry<S extends z.ZodType> {
  title: string;
  schema: S;
  defaults: z.infer<S>;
  previewPath: string;
  /** "about" gets its own bespoke tabbed screen; the rest share one generic
   * WYSIWYG editor screen. */
  editor: "hybrid" | "richtext";
}

function entry<S extends z.ZodType>(e: PageEntry<S>): PageEntry<S> {
  return e;
}

export const PAGES_REGISTRY = {
  about: entry({
    title: "About",
    schema: aboutPageSchema,
    defaults: ABOUT_PAGE_DEFAULTS,
    previewPath: "/about",
    editor: "hybrid",
  }),
  privacy: entry({
    title: "Privacy Policy",
    schema: richTextPageSchema,
    defaults: PRIVACY_PAGE_DEFAULTS,
    previewPath: "/privacy",
    editor: "richtext",
  }),
  terms: entry({
    title: "Terms of Service",
    schema: richTextPageSchema,
    defaults: TERMS_PAGE_DEFAULTS,
    previewPath: "/terms",
    editor: "richtext",
  }),
  "shipping-policy": entry({
    title: "Shipping Policy",
    schema: richTextPageSchema,
    defaults: SHIPPING_POLICY_PAGE_DEFAULTS,
    previewPath: "/shipping-policy",
    editor: "richtext",
  }),
  "return-policy": entry({
    title: "Return Policy",
    schema: richTextPageSchema,
    defaults: RETURN_POLICY_PAGE_DEFAULTS,
    previewPath: "/return-policy",
    editor: "richtext",
  }),
} as const;

export type PageSlug = keyof typeof PAGES_REGISTRY;

export type PageValue<S extends PageSlug> = z.infer<(typeof PAGES_REGISTRY)[S]["schema"]>;

export const PAGE_SLUGS = Object.keys(PAGES_REGISTRY) as PageSlug[];

export const PAGES_TAG = "pages";
