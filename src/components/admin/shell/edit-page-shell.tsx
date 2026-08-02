"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function EditPageShell({
  title,
  description,
  previewPath,
  isDirty,
  isSaving,
  isPublishing,
  savedAt,
  onSaveDraft,
  onPublish,
  children,
}: {
  title: string;
  description?: string;
  previewPath: string;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  savedAt: Date | null;
  onSaveDraft: () => void;
  onPublish: () => void;
  children: React.ReactNode;
}) {
  const busy = isSaving || isPublishing;

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {savedAt && !isDirty && (
            <Badge variant="secondary" className="text-xs font-normal">
              Saved
            </Badge>
          )}
          {isDirty && (
            <Badge variant="outline" className="text-xs font-normal">
              Unsaved changes
            </Badge>
          )}
        </div>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>

      <div className="flex flex-col gap-6">{children}</div>

      <div className="bg-background/95 fixed inset-x-0 bottom-0 z-10 border-t backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-2 px-6 py-3 sm:pl-[calc(var(--sidebar-width,0px)+1.5rem)]">
          {isDirty ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span>
                    <Button variant="outline" disabled>
                      Preview
                    </Button>
                  </span>
                }
              />
              <TooltipContent>Save a draft first</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="outline"
              render={<Link href={`/api/admin/preview?path=${encodeURIComponent(previewPath)}`} target="_blank" />}
              nativeButton={false}
            >
              Preview
            </Button>
          )}
          <Button variant="secondary" onClick={onSaveDraft} disabled={busy}>
            {isSaving && <Loader2 className="size-4 animate-spin" />}
            Save Draft
          </Button>
          <Button onClick={onPublish} disabled={busy}>
            {isPublishing && <Loader2 className="size-4 animate-spin" />}
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
