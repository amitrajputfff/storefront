import { Metadata } from "next";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { JsonLd, buildFaqJsonLd } from "@/lib/jsonld";
import { SectionHeading } from "@/components/shared/section-heading";
import { SITE_NAME } from "@/constants/site";
import { getContent } from "@/lib/content/get-content";

export const metadata: Metadata = {
  title: `FAQ | ${SITE_NAME}`,
  description: "Answers to common questions about orders, shipping, returns, and payments.",
};

export default async function FaqPage() {
  const content = await getContent("faq");
  const allFaqs = content.categories.flatMap((c) => c.items);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <JsonLd data={buildFaqJsonLd(allFaqs)} />
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        align="center"
        className="mb-12"
      />
      <div className="space-y-12">
        {content.categories.map((category) => (
          <div key={category.id}>
            <h2 className="mb-4 text-lg font-medium">{category.heading}</h2>
            <Accordion>
              {category.items.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </main>
  );
}
