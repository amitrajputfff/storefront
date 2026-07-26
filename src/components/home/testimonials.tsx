import { Marquee } from "@/components/ui/marquee";
import { RatingStars } from "@/components/product/rating-stars";
import { SectionHeading } from "@/components/shared/section-heading";
import { testimonials } from "@/mock/testimonials";

function seededRating(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000000007;
  }
  return 4 + (Math.abs(hash) % 2 === 0 ? 0 : 1) + (Math.abs(hash) % 5 === 0 ? -1 : 0);
}

export function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Social proof" title="What our customers say about us" align="center" className="mb-10" />
      </div>
      <Marquee className="[--duration:45s]">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="w-80 shrink-0 rounded-xl border bg-card p-6"
          >
            <RatingStars rating={seededRating(t.id)} />
            <blockquote className="mt-3 text-sm leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm font-medium">
              {t.author}
              <span className="text-muted-foreground ml-1.5 font-normal">
                — {t.location}
              </span>
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}
