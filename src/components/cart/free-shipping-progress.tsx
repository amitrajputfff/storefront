import { CheckCircle2 } from "lucide-react";

export function FreeShippingProgress() {
  return (
    <div className="flex items-center gap-2 px-6 py-4 text-sm font-medium text-success">
      <CheckCircle2 className="size-4 shrink-0" />
      <span>Free shipping on every order</span>
    </div>
  );
}
