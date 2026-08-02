import { getContent } from "@/lib/content/get-content";
import { FaqForm } from "./faq-form";

export default async function AdminFaqPage() {
  const content = await getContent("faq");
  return <FaqForm initialValue={content} />;
}
