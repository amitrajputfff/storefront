import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { RichText } from "@/components/content/rich-text";
import { getPage } from "@/lib/content/get-content";
import { SITE_NAME } from "@/constants/site";

export const metadata: Metadata = {
  title: `About | ${SITE_NAME}`,
  description:
    "ZEEVARA designs considered, everyday objects across home, kitchen, travel, and more — built to be used, not just displayed.",
};

export default async function AboutPage() {
  const page = await getPage("about");

  return (
    <main>
      <section className="relative flex h-[50vh] min-h-[380px] items-end overflow-hidden">
        <Image
          src={page.heroImage.url}
          alt={page.heroImage.altText}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-12 text-white">
          <Reveal>
            <p className="mb-3 text-xs font-medium tracking-widest uppercase opacity-80">
              {page.eyebrow}
            </p>
            <h1 className="max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">
              {page.title}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Reveal>
          <RichText html={page.bodyHtml} className="text-lg" />
        </Reveal>
      </section>

      <section className="bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <StaggerGroup className="grid gap-10 md:grid-cols-3">
            {page.principles.map((p) => (
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
          {page.stats.map((stat) => (
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
          <h2 className="text-2xl font-medium md:text-3xl">{page.closing.heading}</h2>
          <div className="mt-6">
            <Button size="lg" render={<Link href={page.closing.ctaHref} />} nativeButton={false}>
              <span>{page.closing.ctaLabel}</span>
            </Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
