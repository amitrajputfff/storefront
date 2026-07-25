"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { heroImages } from "@/mock/images";
import { routes } from "@/constants/routes";

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex h-[90vh] min-h-[560px] items-end overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[index].url}
            alt={heroImages[index].altText}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl text-white"
        >
          <h1 className="text-4xl font-medium tracking-tight md:text-6xl">
            Considered objects for everyday life.
          </h1>
          <p className="mt-4 text-base opacity-90 md:text-lg">
            Home, kitchen, travel, and more — designed to be used, not just displayed.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              render={<Link href={routes.collection("new-arrivals")} />}
              nativeButton={false}
            >
              <span>Shop New Arrivals</span>
            </Button>
            <Link href={routes.shop()} className="text-sm font-medium underline underline-offset-4">
              Explore the Edit
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
