import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      <div className="bg-muted flex size-14 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground size-6" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
        )}
      </div>
      {action && (
        <Button render={<Link href={action.href} />} nativeButton={false}>
          <span>{action.label}</span>
        </Button>
      )}
    </div>
  );
}
