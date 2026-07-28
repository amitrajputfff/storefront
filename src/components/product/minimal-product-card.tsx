import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { routes } from "@/constants/routes";
import { discountPercent, formatMoney } from "@/lib/format";

export function MinimalProductCard({ product }: { product: Product }) {
  const price = product.priceRange.min;
  const compareAtPrice = product.compareAtPriceRange?.min;
  const hasDiscount = Boolean(discountPercent(price, compareAtPrice));

  return (
    <Link href={routes.product(product.handle)} className="group flex flex-col gap-4">
      <div className="bg-muted relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src={product.images[0]?.url}
          alt={product.images[0]?.altText ?? product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="bg-background absolute right-3 bottom-3 rounded-full px-3 py-1 text-xs font-semibold shadow-soft">
            Sale
          </span>
        )}
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-semibold">{product.title}</p>
        <div className="flex items-baseline gap-2">
          {hasDiscount && (
            <span className="text-muted-foreground text-xs tabular-nums line-through">
              {formatMoney(compareAtPrice!)}
            </span>
          )}
          <span className="text-sm font-bold tabular-nums">{formatMoney(price)}</span>
        </div>
      </div>
    </Link>
  );
}
