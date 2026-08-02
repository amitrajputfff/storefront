import { getContent } from "@/lib/content/get-content";
import { ValuePropsForm } from "./value-props-form";

export default async function ValuePropsPage() {
  const content = await getContent("home.value_props");
  return <ValuePropsForm initialValue={content} />;
}
