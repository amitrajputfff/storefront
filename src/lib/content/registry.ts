import type { z } from "zod";
import {
  heroSchema,
  announcementSchema,
  pressSchema,
  valuePropsSchema,
  testimonialsSchema,
  lifestyleBannerSchema,
  featuredCollectionSchema,
  flashSaleSchema,
  categoryTabsSchema,
  faqSchema,
  contactIntroSchema,
} from "./schemas";
import {
  HERO_DEFAULTS,
  ANNOUNCEMENT_DEFAULTS,
  PRESS_DEFAULTS,
  VALUE_PROPS_DEFAULTS,
  TESTIMONIALS_DEFAULTS,
  LIFESTYLE_BANNER_DEFAULTS,
  FEATURED_COLLECTION_DEFAULTS,
  FLASH_SALE_DEFAULTS,
  CATEGORY_TABS_DEFAULTS,
  FAQ_DEFAULTS,
  CONTACT_INTRO_DEFAULTS,
} from "./defaults";

interface ContentEntry<S extends z.ZodType> {
  label: string;
  group: "Homepage" | "Content";
  schema: S;
  defaults: z.infer<S>;
  previewPath: string;
}

function entry<S extends z.ZodType>(e: ContentEntry<S>): ContentEntry<S> {
  return e;
}

export const CONTENT_REGISTRY = {
  "home.hero": entry({
    label: "Hero",
    group: "Homepage",
    schema: heroSchema,
    defaults: HERO_DEFAULTS,
    previewPath: "/",
  }),
  "home.announcement": entry({
    label: "Announcement Bar",
    group: "Homepage",
    schema: announcementSchema,
    defaults: ANNOUNCEMENT_DEFAULTS,
    previewPath: "/",
  }),
  "home.press": entry({
    label: "Press Mentions",
    group: "Homepage",
    schema: pressSchema,
    defaults: PRESS_DEFAULTS,
    previewPath: "/",
  }),
  "home.value_props": entry({
    label: "Value Props",
    group: "Homepage",
    schema: valuePropsSchema,
    defaults: VALUE_PROPS_DEFAULTS,
    previewPath: "/",
  }),
  "home.testimonials": entry({
    label: "Testimonials",
    group: "Homepage",
    schema: testimonialsSchema,
    defaults: TESTIMONIALS_DEFAULTS,
    previewPath: "/",
  }),
  "home.lifestyle_banner": entry({
    label: "Lifestyle Banner",
    group: "Homepage",
    schema: lifestyleBannerSchema,
    defaults: LIFESTYLE_BANNER_DEFAULTS,
    previewPath: "/",
  }),
  "home.featured_collection": entry({
    label: "Featured Collection",
    group: "Homepage",
    schema: featuredCollectionSchema,
    defaults: FEATURED_COLLECTION_DEFAULTS,
    previewPath: "/",
  }),
  "home.flash_sale": entry({
    label: "Flash Sale Banner",
    group: "Homepage",
    schema: flashSaleSchema,
    defaults: FLASH_SALE_DEFAULTS,
    previewPath: "/",
  }),
  "home.category_tabs": entry({
    label: "Category Tabs",
    group: "Homepage",
    schema: categoryTabsSchema,
    defaults: CATEGORY_TABS_DEFAULTS,
    previewPath: "/",
  }),
  faq: entry({
    label: "FAQ",
    group: "Content",
    schema: faqSchema,
    defaults: FAQ_DEFAULTS,
    previewPath: "/faq",
  }),
  "contact.intro": entry({
    label: "Contact Page",
    group: "Content",
    schema: contactIntroSchema,
    defaults: CONTACT_INTRO_DEFAULTS,
    previewPath: "/contact",
  }),
} as const;

export type ContentKey = keyof typeof CONTENT_REGISTRY;

export type ContentValue<K extends ContentKey> = z.infer<(typeof CONTENT_REGISTRY)[K]["schema"]>;

export const CONTENT_KEYS = Object.keys(CONTENT_REGISTRY) as ContentKey[];

export const CONTENT_TAG = "site-content";
