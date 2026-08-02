"use client";

import Image from "next/image";
import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateMediaAlt, deleteMedia, type MediaItem } from "@/lib/admin/media-actions";

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Keyed by item.id from the parent, so switching items remounts this with
 * a fresh uncontrolled input instead of syncing state via an effect. */
function MediaDetailContent({
  item,
  onOpenChange,
  onDeleted,
}: {
  item: MediaItem;
  onOpenChange: (open: boolean) => void;
  onDeleted: (id: string) => void;
}) {
  async function handleAltBlur(e: React.FocusEvent<HTMLInputElement>) {
    const altText = e.target.value;
    if (altText === item.altText) return;
    const result = await updateMediaAlt(item.id, altText);
    if (result.ok) toast.success("Alt text updated");
    else toast.error(result.error);
  }

  async function handleDelete() {
    const result = await deleteMedia(item.id);
    if (result.ok) {
      toast.success("Image removed");
      onDeleted(item.id);
      onOpenChange(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>Image details</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-4 px-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
          <Image src={item.url} alt={item.altText} fill sizes="400px" className="object-contain" />
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Dimensions</dt>
          <dd>{item.width && item.height ? `${item.width}×${item.height}` : "—"}</dd>
          <dt className="text-muted-foreground">Size</dt>
          <dd>{formatBytes(item.sizeBytes)}</dd>
          <dt className="text-muted-foreground">Uploaded</dt>
          <dd>{new Date(item.uploadedAt).toLocaleDateString()}</dd>
        </dl>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="media-alt">
            Alt text
          </label>
          <Input id="media-alt" defaultValue={item.altText} onBlur={handleAltBlur} />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => {
            navigator.clipboard.writeText(item.url);
            toast.success("URL copied");
          }}
        >
          <Copy className="size-4" />
          Copy URL
        </Button>
      </div>
      <SheetFooter>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="destructive" className="w-full">
                <Trash2 className="size-4" />
                Delete
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this image?</AlertDialogTitle>
              <AlertDialogDescription>
                This can&apos;t be undone, and may break any page still using it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetFooter>
    </>
  );
}

export function MediaDetailSheet({
  item,
  onOpenChange,
  onDeleted,
}: {
  item: MediaItem | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: (id: string) => void;
}) {
  return (
    <Sheet open={!!item} onOpenChange={onOpenChange}>
      <SheetContent>
        {item && <MediaDetailContent key={item.id} item={item} onOpenChange={onOpenChange} onDeleted={onDeleted} />}
      </SheetContent>
    </Sheet>
  );
}
