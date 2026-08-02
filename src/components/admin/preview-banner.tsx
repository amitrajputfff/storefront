import { draftMode } from "next/headers";
import { Eye } from "lucide-react";

/** Renders only for the logged-in admin currently previewing unpublished
 * drafts — draftMode().isEnabled is false for every real visitor, so this
 * adds zero cost/markup to the actual public site. */
export async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div className="bg-amber-500 text-black">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 px-4 py-2 text-xs font-medium">
        <Eye className="size-3.5 shrink-0" />
        <span>Previewing unpublished changes — visitors don&apos;t see this.</span>
        <a href="/api/admin/preview/exit" className="underline underline-offset-2">
          Exit preview
        </a>
      </div>
    </div>
  );
}
