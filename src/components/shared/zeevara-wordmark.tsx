import { cn } from "@/lib/utils";

const SIZES = {
  sm: { z: "text-[1.75rem]", rest: "text-[10px] tracking-[0.2em]" },
  md: { z: "text-[2.25rem]", rest: "text-[11px] tracking-[0.22em]" },
  lg: { z: "text-[2.75rem]", rest: "text-xs tracking-[0.24em]" },
} as const;

export function ZeevaraWordmark({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];

  return (
    <span className={cn("inline-flex items-baseline text-foreground", className)}>
      <span className={cn(s.z, "font-serif leading-none")}>Z</span>
      <span className={cn(s.rest, "font-sans font-normal uppercase")}>EEVARA</span>
    </span>
  );
}
