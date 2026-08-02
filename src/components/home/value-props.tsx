import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { getContent } from "@/lib/content/get-content";
import { AdminIcon } from "@/lib/content/icon-map";

export async function ValueProps() {
  const { eyebrow, title, items } = await getContent("home.value_props");

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <SectionHeading eyebrow={eyebrow} title={title} className="mb-10" />
      <BentoGrid className="md:auto-rows-[12rem] md:grid-cols-4">
        {items.map((value) => (
          <BentoGridItem
            key={value.title}
            icon={<AdminIcon name={value.icon} className="size-5" />}
            title={value.title}
            description={value.description}
          />
        ))}
      </BentoGrid>
    </section>
  );
}
