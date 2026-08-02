import { getContent } from "@/lib/content/get-content";
import { ContactPageForm } from "./contact-page-form";

export default async function AdminContactPage() {
  const content = await getContent("contact.intro");
  return <ContactPageForm initialValue={content} />;
}
