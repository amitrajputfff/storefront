import { ShieldCheck } from "lucide-react";
import { RETURN_WINDOW_DAYS } from "@/constants/site";
import { cn } from "@/lib/utils";

export function GuaranteeBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-success/30 bg-success/10 flex items-start gap-3 rounded-xl border p-4",
        className,
      )}
    >
      <ShieldCheck className="text-success size-6 shrink-0" />
      <div>
        <p className="text-sm font-semibold">{RETURN_WINDOW_DAYS}-Day Money-Back Guarantee</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Not the right fit? Return it unused within {RETURN_WINDOW_DAYS} days for a full refund —
          no questions asked.
        </p>
      </div>
    </div>
  );
}
