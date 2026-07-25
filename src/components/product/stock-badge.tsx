export function StockBadge({ quantity }: { quantity: number }) {
  if (quantity > 5) return null;

  return (
    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
      <span className="bg-muted-foreground size-1 rounded-full" />
      <span>Only {quantity} left</span>
    </div>
  );
}
