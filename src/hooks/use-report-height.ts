"use client";

import { useEffect, useRef } from "react";

/** Measures the ref'd element's rendered height and publishes it as a CSS var on <html>,
 * without wrapping the element (a wrapper would give sticky children a shorter containing
 * block to stick within, breaking stickiness once scrolled past that wrapper's height). */
export function useReportHeight<T extends HTMLElement>(cssVarName: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const setVar = () => {
      document.documentElement.style.setProperty(cssVarName, `${node.offsetHeight}px`);
    };
    setVar();
    const observer = new ResizeObserver(setVar);
    observer.observe(node);
    return () => observer.disconnect();
  }, [cssVarName]);

  return ref;
}
