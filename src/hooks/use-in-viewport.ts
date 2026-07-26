"use client";

import { useEffect, useState, type RefObject } from "react";

/** Defaults to true so nothing that depends on "is this out of view" flashes on before hydration. */
export function useInViewport(ref: RefObject<Element | null>): boolean {
  const [inViewport, setInViewport] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return inViewport;
}
