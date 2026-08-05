import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd, buildFaqJsonLd } from "@/lib/jsonld";
import { getContent } from "@/lib/content/get-content";

// Curated for objection-handling on the product page: COD trust, delivery
// timing, return policy/process, and payment safety — not the full FAQ list.
const PDP_FAQ_IDS = ["faq-q4", "faq-q1", "faq-q6", "faq-q7", "faq-q14"];

export async function ProductFaq() {
  const content = await getContent("faq");
  const items = content.categories
    .flatMap((c) => c.items)
    .filter((item) => PDP_FAQ_IDS.includes(item.id));

  if (items.length === 0) return null;

  return (
    <section>
      <SectionHeading
        eyebrow="Questions"
        title="Still deciding?"
        action={{ label: "View all FAQs", href: "/faq" }}
        className="mb-6"
      />
      <JsonLd data={buildFaqJsonLd(items)} />
      <Accordion>
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
