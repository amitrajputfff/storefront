"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/constants/routes";
import { NavMenu } from "@/types";

const OPEN_DELAY_MS = 150;
const CLOSE_DELAY_MS = 250;

export function MegaMenu({ navMenu }: { navMenu: NavMenu }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, []);

  const scheduleOpen = useCallback(() => {
    clearTimers();
    openTimeoutRef.current = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
  }, [clearTimers]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimeoutRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, [clearTimers]);

  const toggleImmediate = useCallback(() => {
    clearTimers();
    setOpen((prev) => !prev);
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (navMenu.columns.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggleImmediate}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground aria-expanded:text-foreground"
      >
        Categories
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 z-40 w-screen -translate-x-1/2 border-b border-border bg-background shadow-soft-lg"
          >
            <div className="mx-auto max-w-[1400px] px-6 py-8">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
                {navMenu.columns.map((column) => (
                  <div key={column.categoryHandle}>
                    <Link
                      href={routes.collection(column.categoryHandle)}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      {column.heading}
                    </Link>
                    <ul className="mt-3 flex flex-col gap-2">
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            role="menuitem"
                            onClick={() => setOpen(false)}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2">
                {navMenu.promos.map((promo) => (
                  <Link
                    key={promo.href}
                    href={promo.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="group relative block aspect-[21/9] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={promo.image.url}
                      alt={promo.image.altText}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/25" />
                    <span className="absolute bottom-4 left-4 text-sm font-medium text-white">
                      {promo.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
