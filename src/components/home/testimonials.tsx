import { Marquee } from "@/components/ui/marquee";
import { RatingStars } from "@/components/product/rating-stars";
import { SectionHeading } from "@/components/shared/section-heading";
import { getContent } from "@/lib/content/get-content";

export async function Testimonials() {
  const { title, items } = await getContent("home.testimonials");

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading title={title} align="center" className="mb-10" />
      </div>
      <Marquee className="[--duration:45s]">
        {items.map((t) => (
          <figure
            key={t.id}
            className="w-80 shrink-0 rounded-xl border bg-card p-6"
          >
            <RatingStars rating={t.rating} />
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
