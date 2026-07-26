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

export const metadata: Metadata = {
  title: `FAQ | ${SITE_NAME}`,
  description: "Answers to common questions about orders, shipping, returns, and payments.",
};

const FAQ_CATEGORIES = [
  {
    heading: "Orders & Shipping",
    items: [
      {
        question: "How long does delivery take?",
        answer:
          "Most orders are processed within 1-2 business days and delivered within 2-5 business days, depending on your location. Metro cities typically see faster delivery, while remote areas may take a day or two longer.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "Yes — every order ships free across India, with no minimum order value.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Once your order ships, you'll receive a tracking link by email and SMS. You can also check order status by contacting our support team with your order number.",
      },
      {
        question: "Is Cash on Delivery available?",
        answer:
          "Cash on Delivery is available on most pincodes for orders under ₹5,000. Prepaid orders are processed and dispatched faster, and occasionally carry a small additional discount.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Not yet — we currently ship only within India. We're evaluating international shipping and will announce it here when it becomes available.",
      },
    ],
  },
  {
    heading: "Returns & Exchanges",
    items: [
      {
        question: "What is your return policy?",
        answer:
          "We accept returns within 7 days of delivery on unused items in their original packaging. See our full Return Policy page for the complete process and exceptions.",
      },
      {
        question: "How do I start a return?",
        answer:
          "Contact support@zeevara.com with your order number and reason for return. We'll send a prepaid return label for eligible items and process your refund once the item passes inspection.",
      },
      {
        question: "How long do refunds take?",
        answer:
          "Refunds are issued within 5-7 business days of us receiving and inspecting the returned item, back to your original payment method.",
      },
      {
        question: "Can I exchange an item for a different size or color?",
        answer:
          "Yes, subject to availability. Request an exchange the same way you'd request a return, and let us know the size or color you'd like instead.",
      },
    ],
  },
  {
    heading: "Product Care",
    items: [
      {
        question: "How should I care for ceramic and stoneware pieces?",
        answer:
          "Most of our ceramic pieces are dishwasher and microwave safe unless noted otherwise on the product page. Avoid abrasive scouring pads, which can dull the glaze over time.",
      },
      {
        question: "Are your textiles machine washable?",
        answer:
          "Check each product's care instructions — most linen and cotton pieces are machine washable on a cold, gentle cycle, while wool and specialty textiles are spot-clean or dry-clean only.",
      },
      {
        question: "How do I care for wood and metal home pieces?",
        answer:
          "Wipe wood pieces with a dry or slightly damp cloth and avoid prolonged direct sunlight. Brass and metal hardware can be polished occasionally with a soft cloth to maintain its finish.",
      },
    ],
  },
  {
    heading: "Payments & Pricing",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit and debit cards, UPI, net banking, and Cash on Delivery on eligible orders.",
      },
      {
        question: "Is it safe to pay online on ZEEVARA?",
        answer:
          "Yes — all payments are processed through secure, encrypted checkout. We never store your full card details on our servers.",
      },
      {
        question: "Do prices include taxes?",
        answer:
          "Yes, all prices shown are inclusive of applicable taxes. The price you see at checkout is the price you pay, with no hidden fees.",
      },
    ],
  },
];

export default function FaqPage() {
  const allFaqs = FAQ_CATEGORIES.flatMap((c) => c.items);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <JsonLd data={buildFaqJsonLd(allFaqs)} />
      <SectionHeading
        eyebrow="Support"
        title="Frequently Asked Questions"
        description="Can't find what you're looking for? Reach out at support@zeevara.com."
        align="center"
        className="mb-12"
      />
      <div className="space-y-12">
        {FAQ_CATEGORIES.map((category) => (
          <div key={category.heading}>
            <h2 className="mb-4 text-lg font-medium">{category.heading}</h2>
            <Accordion>
              {category.items.map((item, index) => (
                <AccordionItem key={item.question} value={`${category.heading}-${index}`}>
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
