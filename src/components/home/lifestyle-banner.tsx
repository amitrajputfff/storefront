"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { lifestyleBannerImage } from "@/mock/images";

export function LifestyleBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative h-[60vh] min-h-[420px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -top-[8%] -bottom-[8%]">
        <Image
          src={lifestyleBannerImage.url}
          alt={lifestyleBannerImage.altText}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <p className="max-w-lg text-xl font-medium text-white md:text-2xl">
          &ldquo;Discover more everyday&rdquo; isn&apos;t a tagline — it&apos;s how we choose
          what to make.
        </p>
      </div>
    </section>
  );
}
