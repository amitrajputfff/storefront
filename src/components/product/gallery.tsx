"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/types";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MAX_VISIBLE_THUMBNAILS = 5;

export function Gallery({ images }: { images: ProductImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [zooming, setZooming] = useState(false);

  const active = images[activeIndex];
  const visibleThumbnails = images.slice(0, MAX_VISIBLE_THUMBNAILS);
  const overflowCount = images.length - visibleThumbnails.length;

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length);
  }, [images.length]);

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
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex gap-2 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:overflow-visible">
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
                "relative size-16 shrink-0 overflow-hidden rounded-md border transition-colors sm:size-20",
                index === activeIndex ? "border-foreground" : "border-border",
              )}
            >
              <Image src={image.url} alt={image.altText} fill sizes="80px" className="object-cover" />
              {showOverflow && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">
                  +{overflowCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-lg bg-muted sm:order-2"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => {
          setZooming(false);
          setZoomStyle({});
        }}
        onMouseMove={handleMouseMove}
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={active.url}
          alt={active.altText}
          fill
          sizes="(min-width: 640px) 60vw, 100vw"
          priority
          className="object-contain transition-transform duration-150 ease-out"
          style={zooming ? zoomStyle : undefined}
        />
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="flex h-screen max-h-screen w-screen max-w-none cursor-zoom-out items-center justify-center rounded-none bg-background/95 p-0 sm:max-w-none"
          onClick={() => setLightboxOpen(false)}
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
