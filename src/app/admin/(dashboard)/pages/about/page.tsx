import { getPage } from "@/lib/content/get-content";
import { AboutPageForm } from "./about-page-form";

export default async function AdminAboutPage() {
  const content = await getPage("about");
  return <AboutPageForm initialValue={content} />;
}
