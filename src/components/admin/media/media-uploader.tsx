"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { createMediaUploadUrl, registerMedia, type MediaItem } from "@/lib/admin/media-actions";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_DIMENSION = 2400;

interface PendingFile {
  id: string;
  file: File;
  previewUrl: string;
  altText: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

async function readDimensions(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const dims = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dims;
}

/** Downscales anything wider than MAX_DIMENSION before upload — keeps a
 * photo straight off a phone from becoming a 12MB hero image. */
async function downscaleIfNeeded(file: File): Promise<{ file: File; width: number; height: number }> {
  const { width, height } = await readDimensions(file);
  if (width <= MAX_DIMENSION) return { file, width, height };

  const scale = MAX_DIMENSION / width;
  const targetWidth = MAX_DIMENSION;
  const targetHeight = Math.round(height * scale);

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { file, width, height };
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, file.type, 0.9));
  if (!blob) return { file, width, height };

  return { file: new File([blob], file.name, { type: file.type }), width: targetWidth, height: targetHeight };
}

export function MediaUploader({
  folder = "general",
  onUploaded,
  onPendingCountChange,
}: {
  folder?: string;
  onUploaded: (item: MediaItem) => void;
  /** Lets a parent (e.g. a review/form dialog) know whether files are staged
   * here but not yet uploaded, so it can block submission until they finish
   * — otherwise a submit before the upload completes silently drops them. */
  onPendingCountChange?: (count: number) => void;
}) {
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function setPendingAndNotify(updater: (prev: PendingFile[]) => PendingFile[]) {
    setPending((prev) => {
      const next = updater(prev);
      onPendingCountChange?.(next.length);
      return next;
    });
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const accepted: PendingFile[] = [];
    for (const file of Array.from(fileList)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: unsupported file type`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`${file.name}: file is too large (max 8MB)`);
        continue;
      }
      accepted.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        altText: "",
        status: "pending",
      });
    }
    setPendingAndNotify((prev) => [...prev, ...accepted]);
  }

  function updateAlt(id: string, altText: string) {
    setPending((prev) => prev.map((p) => (p.id === id ? { ...p, altText } : p)));
  }

  function removePending(id: string) {
    setPendingAndNotify((prev) => prev.filter((p) => p.id !== id));
  }

  const canUpload = pending.length > 0 && pending.every((p) => p.altText.trim().length > 0);

  async function handleUpload() {
    setIsUploading(true);
    for (const item of pending) {
      if (item.status === "done") continue;
      setPending((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: "uploading" } : p)));
      try {
        const { file, width, height } = await downscaleIfNeeded(item.file);
        const urlResult = await createMediaUploadUrl({ fileName: file.name, contentType: file.type, folder });
        if (!urlResult.ok) throw new Error(urlResult.error);

        const supabase = getSupabaseBrowserClient();
        const { error: uploadError } = await supabase.storage
          .from("site-media")
          .uploadToSignedUrl(urlResult.data.path, urlResult.data.token, file);
        if (uploadError) throw uploadError;

        const registerResult = await registerMedia({
          path: urlResult.data.path,
          altText: item.altText.trim(),
          width,
          height,
          mimeType: file.type,
          sizeBytes: file.size,
          folder,
        });
        if (!registerResult.ok) throw new Error(registerResult.error);

        setPending((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: "done" } : p)));
        onUploaded(registerResult.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Upload failed";
        setPending((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: "error", error: message } : p)));
        toast.error(`${item.file.name}: ${message}`);
      }
    }
    setIsUploading(false);
    setPendingAndNotify((prev) => prev.filter((p) => p.status !== "done"));
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging ? "border-foreground bg-muted/50" : "border-border"
        }`}
      >
        <UploadCloud className="text-muted-foreground size-8" />
        <p className="text-sm font-medium">Drop images here, or click to choose</p>
        <p className="text-muted-foreground text-xs">JPEG, PNG, WebP, or AVIF — up to 8MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {pending.length > 0 && (
        <div className="flex flex-col gap-2">
          {pending.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- transient object-URL preview, not a next/image asset */}
              <img src={item.previewUrl} alt="" className="size-12 shrink-0 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{item.file.name}</p>
                <Input
                  placeholder="Alt text (required)"
                  value={item.altText}
                  onChange={(e) => updateAlt(item.id, e.target.value)}
                  className="mt-1 h-7 text-xs"
                  disabled={item.status === "uploading" || item.status === "done"}
                />
                {item.status === "error" && <p className="text-destructive mt-1 text-xs">{item.error}</p>}
              </div>
              {item.status === "uploading" && <Loader2 className="size-4 shrink-0 animate-spin" />}
              {item.status !== "uploading" && (
                <Button variant="ghost" size="icon-sm" onClick={() => removePending(item.id)} aria-label="Remove">
                  <X className="size-4" />
                </Button>
              )}
            </div>
          ))}
          <Button onClick={handleUpload} disabled={!canUpload || isUploading} className="self-start">
            {isUploading && <Loader2 className="size-4 animate-spin" />}
            Upload {pending.length} file{pending.length === 1 ? "" : "s"}
          </Button>
        </div>
      )}
    </div>
  );
}
