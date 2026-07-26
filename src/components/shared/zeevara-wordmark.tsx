import Image from "next/image";
import { cn } from "@/lib/utils";

const MARK_ASPECT_RATIO = 902 / 338;

const HEIGHTS = {
  sm: 34,
  md: 42,
  lg: 52,
} as const;

export function ZeevaraWordmark({
  size = "md",
  className,
}: {
  size?: keyof typeof HEIGHTS;
  className?: string;
}) {
  const height = HEIGHTS[size];
  const width = Math.round(height * MARK_ASPECT_RATIO);

  return (
    <Image
      src="/logo/zeevara-mark.png"
      alt="ZEEVARA"
      width={width}
      height={height}
      className={cn("dark:invert", className)}
      priority
    />
  );
}
