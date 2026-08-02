import { listMedia } from "@/lib/admin/media-actions";
import { MediaLibraryClient } from "./media-library-client";

export default async function AdminMediaPage() {
  const result = await listMedia({ limit: 200 });
  const items = result.ok ? result.data : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Media</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Images available to use across the site.
        </p>
      </div>
      <MediaLibraryClient initialItems={items} />
    </div>
  );
}
