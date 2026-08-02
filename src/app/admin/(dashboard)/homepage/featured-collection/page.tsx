import { getContent } from "@/lib/content/get-content";
import { FeaturedCollectionForm } from "./featured-collection-form";

export default async function FeaturedCollectionPage() {
  const content = await getContent("home.featured_collection");
  return <FeaturedCollectionForm initialValue={content} />;
}
