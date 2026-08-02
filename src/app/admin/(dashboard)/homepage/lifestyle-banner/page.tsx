import { getContent } from "@/lib/content/get-content";
import { LifestyleBannerForm } from "./lifestyle-banner-form";

export default async function LifestyleBannerPage() {
  const content = await getContent("home.lifestyle_banner");
  return <LifestyleBannerForm initialValue={content} />;
}
