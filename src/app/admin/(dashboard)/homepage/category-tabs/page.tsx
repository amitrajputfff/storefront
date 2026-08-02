import { getContent } from "@/lib/content/get-content";
import { categories } from "@/mock/categories";
import { CategoryTabsForm } from "./category-tabs-form";

export default async function CategoryTabsPage() {
  const content = await getContent("home.category_tabs");
  const categoryOptions = categories.map((c) => ({ handle: c.handle, name: c.name }));
  return <CategoryTabsForm initialValue={content} categoryOptions={categoryOptions} />;
}
