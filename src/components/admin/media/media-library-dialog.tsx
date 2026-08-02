"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MediaGrid } from "./media-grid";
import { MediaUploader } from "./media-uploader";
import { listMedia, type MediaItem } from "@/lib/admin/media-actions";

export function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: MediaItem) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [tab, setTab] = useState("library");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listMedia({ search: search || undefined }).then((result) => {
      if (result.ok) setItems(result.data);
      setLoading(false);
    });
  }, [open, search]);

  function handleUploaded(item: MediaItem) {
    setItems((prev) => [item, ...prev]);
    setSelected(item);
    setTab("library");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="library" className="flex flex-col gap-3">
            <Input placeholder="Search by alt text…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="max-h-[50vh] overflow-y-auto">
              {loading ? (
                <p className="text-muted-foreground py-8 text-center text-sm">Loading…</p>
              ) : (
                <MediaGrid items={items} selectedId={selected?.id} onSelect={setSelected} selectable />
              )}
            </div>
          </TabsContent>
          <TabsContent value="upload">
            <MediaUploader onUploaded={handleUploaded} />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!selected}
            onClick={() => {
              if (selected) onSelect(selected);
              onOpenChange(false);
            }}
          >
            Use image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
