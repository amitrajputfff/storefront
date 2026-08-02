import { getContent } from "@/lib/content/get-content";
import { TestimonialsForm } from "./testimonials-form";

export default async function TestimonialsPage() {
  const content = await getContent("home.testimonials");
  return <TestimonialsForm initialValue={content} />;
}
