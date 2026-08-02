import { getContent } from "@/lib/content/get-content";
import { AnnouncementBarForm } from "./announcement-bar-form";

export default async function AnnouncementBarPage() {
  const content = await getContent("home.announcement");
  return <AnnouncementBarForm initialValue={content} />;
}
