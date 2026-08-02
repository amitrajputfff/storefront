"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MediaGrid } from "@/components/admin/media/media-grid";
import { MediaUploader } from "@/components/admin/media/media-uploader";
import { MediaDetailSheet } from "@/components/admin/media/media-detail-sheet";
import type { MediaItem } from "@/lib/admin/media-actions";

export function MediaLibraryClient({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [showUploader, setShowUploader] = useState(false);
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{items.length} image{items.length === 1 ? "" : "s"}</p>
        <Button variant="outline" size="sm" onClick={() => setShowUploader((v) => !v)}>
          {showUploader ? "Hide uploader" : "Upload images"}
        </Button>
      </div>

      {showUploader && (
        <MediaUploader onUploaded={(item) => setItems((prev) => [item, ...prev])} />
      )}

      <MediaGrid items={items} selectable onSelect={setDetailItem} />

      <MediaDetailSheet
        item={detailItem}
        onOpenChange={(open) => !open && setDetailItem(null)}
        onDeleted={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
      />
    </div>
  );
}
