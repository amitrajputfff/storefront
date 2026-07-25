"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { motion } from "motion/react";
import { CartItem } from "@/types";
import { routes } from "@/constants/routes";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/hooks/use-cart";

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  const lineTotal = {
    amount: item.price.amount * item.quantity,
    currencyCode: item.price.currencyCode,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex gap-3 overflow-hidden py-4"
    >
      <Link
        href={routes.product(item.productHandle)}
        className="relative size-18 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        <Image
          src={item.image.url}
          alt={item.image.altText}
          fill
          sizes="72px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={routes.product(item.productHandle)}
            className="text-sm font-medium hover:underline"
          >
            {item.title}
          </Link>
          <span className="shrink-0 text-sm font-medium tabular-nums">
            {formatMoney(lineTotal)}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">{item.variantTitle}</p>

        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="flex size-6 items-center justify-center disabled:opacity-30"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-6 text-center text-xs tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={item.quantity >= item.maxQuantity}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="flex size-6 items-center justify-center disabled:opacity-30"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}
