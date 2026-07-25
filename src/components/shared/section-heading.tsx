import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start",
        action ? "sm:flex-row sm:items-end sm:justify-between" : "",
        className,
      )}
    >
      <div className={cn(align === "center" ? "text-center" : "text-left")}>
        {eyebrow && (
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-widest uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-medium tracking-tight md:text-4xl">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-3 max-w-xl text-base">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
