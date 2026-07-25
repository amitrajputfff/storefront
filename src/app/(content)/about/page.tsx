import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { aboutHeroImage } from "@/mock/images";
import { routes } from "@/constants/routes";
import { SITE_NAME } from "@/constants/site";

export const metadata: Metadata = {
  title: `About | ${SITE_NAME}`,
  description:
    "ZEEVARA designs considered, everyday objects across home, kitchen, travel, and more — built to be used, not just displayed.",
};

const PRINCIPLES = [
  {
    title: "Considered Materials",
    body: "We choose materials for how they age, not just how they photograph — stoneware that develops character, wood that softens with use, textiles that get better after every wash.",
  },
  {
    title: "Design-Led, Not Trend-Led",
    body: "We'd rather ship fewer, better things than chase every micro-trend. Most of what we sell today looked the same a year ago, and will look the same a year from now.",
  },
  {
    title: "Priced Honestly",
    body: "No inflated 'original' prices marked down to look generous. What you see is what it costs, with margin only where it's earned.",
  },
];

const STATS = [
  { value: 6, suffix: "", label: "Years designing everyday objects" },
  { value: 50000, suffix: "+", label: "Customers across India" },
  { value: 12, suffix: "", label: "Product categories" },
  { value: 4.6, suffix: "/5", label: "Average customer rating", decimals: 1 },
];

export default function AboutPage() {
  return (
    <main>
      <section className="relative flex h-[50vh] min-h-[380px] items-end overflow-hidden">
        <Image
          src={aboutHeroImage.url}
          alt={aboutHeroImage.altText}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-12 text-white">
          <Reveal>
            <p className="mb-3 text-xs font-medium tracking-widest uppercase opacity-80">
              Our story
            </p>
            <h1 className="max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">
              Considered objects for everyday life.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Reveal>
          <p className="text-lg leading-relaxed">
            ZEEVARA started with a simple frustration: most home goods online were either
            disposable and cheap, or beautiful and absurdly overpriced. We wanted a third
            option — pieces considered enough to keep for years, priced honestly enough to
            actually use every day.
          </p>
          <p className="text-muted-foreground mt-6 leading-relaxed">
            Today that's grown into a catalog spanning home decor, kitchen, office, travel,
            fitness, and more — but the standard hasn't changed. Every product we add has to
            earn its place: it has to be genuinely useful, built to last, and worth the price
            on the tag. Discover more everyday.
          </p>
        </Reveal>
      </section>

      <section className="bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <StaggerGroup className="grid gap-10 md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <StaggerItem key={p.title} className="space-y-3">
                <h3 className="text-lg font-medium">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.body}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <StaggerGroup className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {STATS.map((stat) => (
            <StaggerItem key={stat.label} className="space-y-1">
              <div className="text-3xl font-medium tabular-nums md:text-4xl">
                <NumberTicker value={stat.value} decimalPlaces={stat.decimals ?? 0} />
                {stat.suffix}
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="border-t px-6 py-16 text-center md:py-24">
        <Reveal>
          <h2 className="text-2xl font-medium md:text-3xl">
            Discover the collection.
          </h2>
          <div className="mt-6">
            <Button size="lg" render={<Link href={routes.shop()} />} nativeButton={false}>
              <span>Shop All</span>
            </Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
