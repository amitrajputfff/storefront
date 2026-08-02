import { z } from "zod";
import { ICON_NAMES } from "./icon-map";

export const hrefSchema = z
  .string()
  .trim()
  .min(1, "Required")
  .refine(
    (v) => v.startsWith("/") || /^https?:\/\//.test(v) || v.startsWith("mailto:"),
    "Use a path like /collections/new-arrivals or a full https:// URL",
  );

export const ctaSchema = z.object({
  label: z.string().trim().min(1).max(40),
  href: hrefSchema,
});

export const imageSchema = z.object({
  mediaId: z.string().nullable().optional(),
  url: z.url(),
  altText: z.string().trim().min(1, "Alt text is required for accessibility"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

// ---------------------------------------------------------------- home.hero --
export const heroSchema = z.object({
  headline: z.string().trim().min(1).max(90),
  subtext: z.string().trim().max(160),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,
  images: z.array(imageSchema).min(1).max(6),
});

// --------------------------------------------------------- home.announcement --
export const announcementSchema = z.object({
  messages: z.array(z.string().trim().min(1).max(70)).min(1).max(8),
});

// --------------------------------------------------------------- home.press --
export const pressSchema = z.object({
  eyebrow: z.string().trim().max(40),
  items: z.array(z.string().trim().min(1).max(40)).min(3).max(16),
});

// --------------------------------------------------------- home.value_props --
export const valuePropItemSchema = z.object({
  icon: z.enum(ICON_NAMES),
  title: z.string().trim().min(1).max(48),
  description: z.string().trim().min(1).max(180),
});

export const valuePropsSchema = z.object({
  eyebrow: z.string().trim().max(40),
  title: z.string().trim().min(1).max(60),
  items: z.array(valuePropItemSchema).min(2).max(8),
});

// --------------------------------------------------------- home.testimonials --
export const testimonialItemSchema = z.object({
  id: z.string(),
  author: z.string().trim().min(1).max(60),
  location: z.string().trim().min(1).max(60),
  rating: z.number().int().min(1).max(5),
  quote: z.string().trim().min(1).max(320),
});

export const testimonialsSchema = z.object({
  title: z.string().trim().min(1).max(80),
  items: z.array(testimonialItemSchema).min(1).max(24),
});

// ---------------------------------------------------- home.lifestyle_banner --
export const lifestyleBannerSchema = z.object({
  quote: z.string().trim().min(1).max(200),
  image: imageSchema,
});

// ------------------------------------------------- home.featured_collection --
export const featuredCollectionSchema = z.object({
  eyebrow: z.string().trim().min(1).max(32),
  ctaLabel: z.string().trim().min(1).max(24),
  image: imageSchema,
});

// --------------------------------------------------------- home.flash_sale --
export const flashSaleSchema = z.object({
  enabled: z.boolean(),
  message: z.string().trim().min(1).max(80),
  showCountdown: z.boolean(),
  windowHours: z.number().int().min(1).max(72),
});

// ------------------------------------------------------- home.category_tabs --
export const categoryTabsSchema = z.object({
  eyebrow: z.string().trim().max(40),
  title: z.string().trim().min(1).max(60),
  featured: z
    .array(
      z.object({
        handle: z.string().trim().min(1),
        description: z.string().trim().min(1).max(120),
      }),
    )
    .min(1)
    .max(10),
});

// ------------------------------------------------------------------- faq --
export const faqItemSchema = z.object({
  id: z.string(),
  question: z.string().trim().min(1).max(160),
  answer: z.string().trim().min(1).max(800),
});

export const faqCategorySchema = z.object({
  id: z.string(),
  heading: z.string().trim().min(1).max(60),
  items: z.array(faqItemSchema).min(1),
});

export const faqSchema = z.object({
  eyebrow: z.string().trim().max(40),
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(200),
  categories: z.array(faqCategorySchema).min(1),
});

// ------------------------------------------------------------ contact.intro --
export const contactIntroSchema = z.object({
  eyebrow: z.string().trim().max(40),
  title: z.string().trim().min(1).max(60),
  description: z.string().trim().max(200),
  contactEmail: z.email(),
  contactHours: z.string().trim().min(1).max(80),
  faqPrompt: ctaSchema,
});

// ------------------------------------------------------------- pages (about) --
export const aboutPrincipleSchema = z.object({
  title: z.string().trim().min(1).max(60),
  body: z.string().trim().min(1).max(320),
});

export const aboutStatSchema = z.object({
  value: z.number(),
  suffix: z.string().trim().max(8),
  label: z.string().trim().min(1).max(60),
  decimals: z.number().int().min(0).max(2).optional(),
});

export const aboutPageSchema = z.object({
  eyebrow: z.string().trim().max(40),
  title: z.string().trim().min(1).max(90),
  heroImage: imageSchema,
  bodyHtml: z.string(),
  principles: z.array(aboutPrincipleSchema).min(2).max(6),
  stats: z.array(aboutStatSchema).min(2).max(6),
  closing: z.object({
    heading: z.string().trim().min(1).max(60),
    ctaLabel: z.string().trim().min(1).max(24),
    ctaHref: hrefSchema,
  }),
});

// ------------------------------------------------------ pages (rich text) --
export const richTextPageSchema = z.object({
  title: z.string().trim().min(1).max(90),
  lastUpdatedLabel: z.string().trim().max(40),
  bodyHtml: z.string(),
});
