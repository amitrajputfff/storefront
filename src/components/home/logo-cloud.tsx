import { Marquee } from "@/components/ui/marquee";
import { getContent } from "@/lib/content/get-content";

export async function LogoCloud() {
  const { eyebrow, items } = await getContent("home.press");

  return (
    <section className="border-y py-10">
      <p className="text-muted-foreground mb-6 text-center text-xs font-medium tracking-widest uppercase">
        {eyebrow}
      </p>
      <Marquee className="[--duration:32s] [--gap:4rem]">
        {items.map((name) => (
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
