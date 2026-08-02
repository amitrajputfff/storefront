import { getContent } from "@/lib/content/get-content";
import { HeroForm } from "./hero-form";

export default async function HeroPage() {
  const content = await getContent("home.hero");
  return <HeroForm initialValue={content} />;
}
