import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function PaymentIconBadge({
  src,
  alt,
  size = 30,
  className,
  style,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const iconSize = Math.round(size * 0.62);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/8",
        className,
      )}
      style={{ width: size, height: size, ...style }}
    >
      <Image src={src} alt={alt} width={iconSize} height={iconSize} className="object-contain" />
    </span>
  );
}

export function PaymentIconGroup({
  icons,
  size = 30,
  overlap = 10,
}: {
  icons: readonly { src: string; alt: string }[];
  size?: number;
  overlap?: number;
}) {
  return (
    <div className="flex items-center">
      {icons.map(({ src, alt }, index) => (
        <PaymentIconBadge
          key={src}
          src={src}
          alt={alt}
          size={size}
          className={cn(index > 0 && "relative")}
          style={index > 0 ? { marginLeft: -overlap } : undefined}
        />
      ))}
    </div>
  );
}
