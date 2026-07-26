"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}

const sizeClasses = {
  sm: "text-xs font-semibold px-1.5 py-0.5",
  md: "text-sm font-semibold px-2 py-1",
  lg: "text-lg font-bold px-2.5 py-1.5",
} as const;

export function CountdownTimer({
  endsAt,
  onExpire,
  size = "md",
  className,
}: {
  endsAt: Date | string;
  onExpire?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const target = typeof endsAt === "string" ? new Date(endsAt) : endsAt;
  // Starts null so the server-rendered markup never has to guess the client's clock,
  // matching the hydration-safe pattern used by useSocialProof.
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setRemaining(target.getTime() - Date.now());
    const interval = setInterval(() => {
      setRemaining(target.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.getTime()]);

  useEffect(() => {
    if (remaining !== null && remaining <= 0) onExpire?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining !== null && remaining <= 0]);

  return (
    <span
      className={cn(
        "bg-foreground text-background inline-flex items-center gap-1 rounded-md font-mono tabular-nums",
        sizeClasses[size],
        className,
      )}
    >
      {formatRemaining(remaining ?? 0)}
    </span>
  );
}
