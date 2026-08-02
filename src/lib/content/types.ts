import type { z } from "zod";
import type {
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
  aboutPageSchema,
  richTextPageSchema,
} from "./schemas";

export type HeroContent = z.infer<typeof heroSchema>;
export type AnnouncementContent = z.infer<typeof announcementSchema>;
export type PressContent = z.infer<typeof pressSchema>;
export type ValuePropsContent = z.infer<typeof valuePropsSchema>;
export type TestimonialsContent = z.infer<typeof testimonialsSchema>;
export type LifestyleBannerContent = z.infer<typeof lifestyleBannerSchema>;
export type FeaturedCollectionContent = z.infer<typeof featuredCollectionSchema>;
export type FlashSaleContent = z.infer<typeof flashSaleSchema>;
export type CategoryTabsContent = z.infer<typeof categoryTabsSchema>;
export type FaqContent = z.infer<typeof faqSchema>;
export type ContactIntroContent = z.infer<typeof contactIntroSchema>;
export type AboutPageContent = z.infer<typeof aboutPageSchema>;
export type RichTextPageContent = z.infer<typeof richTextPageSchema>;
