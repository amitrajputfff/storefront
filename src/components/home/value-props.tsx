import { Leaf, RotateCcw, Ruler, Gem } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { SectionHeading } from "@/components/shared/section-heading";

const VALUES = [
  {
    icon: Gem,
    title: "Considered Materials",
    description: "Stoneware, wood, and textiles chosen for how they age, not just how they photograph.",
  },
  {
    icon: RotateCcw,
    title: "7-Day Returns, No Questions",
    description: "Free returns within 7 days on unused items — simple, no fine print.",
  },
  {
    icon: Leaf,
    title: "Carbon-Neutral Shipping",
    description: "Every order ships carbon-neutral across India, at no extra cost to you.",
  },
  {
    icon: Ruler,
    title: "Design-Led, Not Trend-Led",
    description: "We ship fewer, better things — built to still look right a year from now.",
  },
];

export function ValueProps() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <SectionHeading eyebrow="Why ZEEVARA" title="Why Choose Us" className="mb-10" />
      <BentoGrid className="md:auto-rows-[12rem] md:grid-cols-4">
        {VALUES.map((value) => (
          <BentoGridItem
            key={value.title}
            icon={<value.icon className="size-5" />}
            title={value.title}
            description={value.description}
          />
        ))}
      </BentoGrid>
    </section>
  );
}
