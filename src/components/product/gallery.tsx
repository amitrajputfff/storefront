"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/types";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProductBadge } from "@/lib/product-badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const MAX_VISIBLE_THUMBNAILS = 5;
const DOT_WINDOW_SIZE = 5;
const SWIPE_THRESHOLD_PX = 40;

/** Always shows a small sliding window of dots (never one-per-image for
 * large galleries) — the window shifts to keep the active dot inside it. */
function getDotWindow(activeIndex: number, total: number): number[] {
  if (total <= DOT_WINDOW_SIZE) return Array.from({ length: total }, (_, i) => i);
  const half = Math.floor(DOT_WINDOW_SIZE / 2);
  let start = Math.max(0, activeIndex - half);
  const end = Math.min(total, start + DOT_WINDOW_SIZE);
  start = Math.max(0, end - DOT_WINDOW_SIZE);
  return Array.from({ length: end - start }, (_, i) => start + i);
}

export function Gallery({
  images,
  badge,
}: {
  images: ProductImage[];
  badge?: ProductBadge | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [zooming, setZooming] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  const active = images[activeIndex];
  const visibleThumbnails = images.slice(0, MAX_VISIBLE_THUMBNAILS);
  const overflowCount = images.length - visibleThumbnails.length;
  const touchStartX = useRef<number | null>(null);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    if (api.selectedScrollSnap() !== activeIndex) api.scrollTo(activeIndex);
  }, [activeIndex, api]);

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta > 0) goPrev();
    else goNext();
  }

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, goPrev, goNext]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  }

  if (!active) return null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:gap-4">
      <div className="flex min-w-0 gap-2 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:overflow-visible">
        {visibleThumbnails.map((image, index) => {
          const isLastVisible = index === visibleThumbnails.length - 1;
          const showOverflow = isLastVisible && overflowCount > 0;

          return (
            <button
              key={image.id}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                if (showOverflow) setLightboxOpen(true);
              }}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border transition-colors sm:size-20",
                index === activeIndex ? "border-foreground" : "border-border",
              )}
            >
              <Image src={image.url} alt={image.altText} fill sizes="80px" className="object-contain" />
              {showOverflow && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">
                  +{overflowCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <Carousel setApi={setApi} className="w-full min-w-0 flex-1 sm:order-2">
        <CarouselContent className="-ml-3">
          {images.map((image, index) => (
            <CarouselItem key={image.id} className="pl-3">
              <div
                className="relative aspect-square cursor-zoom-in overflow-hidden rounded-lg bg-muted"
                onMouseEnter={() => setZooming(true)}
                onMouseLeave={() => {
                  setZooming(false);
                  setZoomStyle({});
                }}
                onMouseMove={handleMouseMove}
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={image.url}
                  alt={image.altText}
                  fill
                  sizes="(min-width: 640px) 60vw, 100vw"
                  priority={index === 0}
                  className="object-contain transition-transform duration-150 ease-out"
                  style={index === activeIndex && zooming ? zoomStyle : undefined}
                />
                {index === 0 && badge && (
                  <Badge
                    className={cn(
                      "absolute top-3 left-3 z-10",
                      badge.className,
                      badge.pulse && "animate-pulse",
                    )}
                  >
                    {badge.icon}
                    {badge.label}
                  </Badge>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:hidden">
          {getDotWindow(activeIndex, images.length).map((index) => (
            <button
              key={images[index].id}
              type="button"
              aria-label={`Show image ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "size-1.5 rounded-full transition-colors",
                index === activeIndex ? "bg-foreground" : "bg-muted-foreground/30",
              )}
            />
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="flex h-screen max-h-screen w-screen max-w-none cursor-zoom-out items-center justify-center rounded-none bg-background/95 p-0 sm:max-w-none"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <DialogTitle className="sr-only">{active.altText}</DialogTitle>
          <Image
            src={active.url}
            alt={active.altText}
            width={active.width}
            height={active.height}
            sizes="90vw"
            className="max-h-[90vh] max-w-[90vw] cursor-default object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute top-1/2 left-4 -translate-y-1/2"
              >
                <ChevronLeft className="size-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute top-1/2 right-4 -translate-y-1/2"
              >
                <ChevronRight className="size-6" />
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
