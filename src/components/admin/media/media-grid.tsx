import Image from "next/image";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/lib/admin/media-actions";

export function MediaGrid({
  items,
  selectedId,
  onSelect,
  selectable = false,
}: {
  items: MediaItem[];
  selectedId?: string;
  onSelect?: (item: MediaItem) => void;
  selectable?: boolean;
}) {
  if (items.length === 0) {
    return <p className="text-muted-foreground py-8 text-center text-sm">No images yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={!selectable}
          onClick={() => onSelect?.(item)}
          className={cn(
            "group relative aspect-square overflow-hidden rounded-lg border",
            selectable && "cursor-pointer",
            selectedId === item.id && "ring-foreground ring-2",
          )}
        >
          <Image
            src={item.url}
            alt={item.altText}
            fill
            sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="truncate text-[10px] text-white">{item.altText || "No alt text"}</p>
            {item.width && item.height && (
              <p className="text-[10px] text-white/70">
                {item.width}×{item.height}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
