import { getContent } from "@/lib/content/get-content";
import { PressMentionsForm } from "./press-mentions-form";

export default async function PressMentionsPage() {
  const content = await getContent("home.press");
  return <PressMentionsForm initialValue={content} />;
}
