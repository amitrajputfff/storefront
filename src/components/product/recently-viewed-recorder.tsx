"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";

export function RecentlyViewedRecorder({ handle }: { handle: string }) {
  const addHandle = useRecentlyViewedStore((s) => s.addHandle);

  useEffect(() => {
    addHandle(handle);
  }, [handle, addHandle]);

  return null;
}
