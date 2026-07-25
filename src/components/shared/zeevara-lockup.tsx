import { SITE_TAGLINE } from "@/constants/site";
import { cn } from "@/lib/utils";
import { ZeevaraWordmark } from "@/components/shared/zeevara-wordmark";

export function ZeevaraLockup({
  size = "md",
  showTagline = true,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <ZeevaraWordmark size={size} />
      {showTagline && (
        <>
          <span className="h-5 w-px shrink-0 bg-border" aria-hidden="true" />
          <span className="hidden font-sans text-[10px] font-normal tracking-[0.2em] text-muted-foreground uppercase md:inline">
            {SITE_TAGLINE}
          </span>
        </>
      )}
    </span>
  );
}
