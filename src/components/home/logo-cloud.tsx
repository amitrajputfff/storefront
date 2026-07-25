import { Marquee } from "@/components/ui/marquee";

const PRESS_MENTIONS = [
  "THE MODERN HOME",
  "DWELL WEEKLY",
  "APARTMENT EDIT",
  "CURATED LIVING",
  "HOUSE & HABIT",
  "SLOW LIVING JOURNAL",
  "SOUTH ON MAIN",
  "THE CONSIDERED LIFE",
];

export function LogoCloud() {
  return (
    <section className="border-y py-10">
      <p className="text-muted-foreground mb-6 text-center text-xs font-medium tracking-widest uppercase">
        As Featured In
      </p>
      <Marquee className="[--duration:32s] [--gap:4rem]">
        {PRESS_MENTIONS.map((name) => (
          <span
            key={name}
            className="text-foreground/60 shrink-0 text-lg font-medium tracking-wide whitespace-nowrap grayscale select-none"
          >
            {name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
