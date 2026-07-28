"use client";

import { motion, Variants } from "motion/react";
import { ReactNode } from "react";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={revealVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

/**
 * Each item observes its own viewport visibility rather than inheriting a
 * "visible" state cascaded from a parent's whileInView — a parent-level
 * trigger only fires once (viewport.once), so items added later (e.g. via
 * "Load More" appending to the same grid) would mount already past that
 * trigger and stay stuck at opacity: 0 forever, looking like they never
 * loaded at all.
 */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={revealVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
