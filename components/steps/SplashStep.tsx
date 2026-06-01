"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

interface SplashStepProps {
  onNext: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.9, ease: "easeOut" as const, delay },
});

export function SplashStep({ onNext }: SplashStepProps) {
  return (
    <div className="fixed inset-0 flex flex-col bg-[#fdfcfb] overflow-hidden md:flex-row">
      {/* Warm glow — mobile only */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-80 pointer-events-none md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(250,79,0,0.09) 0%, transparent 80%)",
        }}
      />

      {/* ── Mobile: Logo (top) ── Desktop: hidden here, shown inside content panel */}
      <motion.div
        className="relative z-10 pt-14 flex justify-center md:hidden"
        {...fadeIn(0.1)}
      >
        <Image
          src="/logo.png"
          alt="fotos.studio"
          width={220}
          height={58}
          className="h-14 w-auto object-contain"
          priority
        />
      </motion.div>

      {/* Illustration — left panel on desktop */}
      <div className="relative z-10 flex-1 flex items-center justify-center md:flex-none md:w-1/2 md:flex md:items-center md:justify-center md:p-12">
        <motion.div
          className="w-full md:max-w-lg"
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 }}
        >
          <Image
            src="/image.png"
            alt="Photographer at work"
            width={800}
            height={600}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </div>

      {/* Content — bottom on mobile, right panel on desktop */}
      <div className="relative z-10 px-8 pb-12 md:w-1/2 md:flex md:flex-col md:justify-center md:px-16 md:pb-0 md:py-12 lg:px-24">
        {/* Desktop-only logo */}
        <motion.div
          className="hidden md:flex mb-10"
          {...fadeIn(0.1)}
        >
          <Image
            src="/logo.png"
            alt="fotos.studio"
            width={220}
            height={58}
            className="h-14 w-auto object-contain"
            priority
          />
        </motion.div>

        <motion.h1
          className="text-[2.4rem] font-bold text-gray-900 leading-[1.15] tracking-tight md:text-5xl lg:text-6xl"
          {...fadeUp(0.5)}
        >
          Capture Every Moment,{" "}
          <span className="text-[#fa4f00]">Win Every Time.</span>
        </motion.h1>

        <motion.p
          className="mt-3 text-[15px] text-gray-500 leading-relaxed md:text-base md:mt-5 md:max-w-md"
          {...fadeUp(0.65)}
        >
          Join fotos.studio&apos;s exclusive scratch &amp; win celebration.
          Register and reveal your surprise prize.
        </motion.p>

        <motion.button
          onClick={onNext}
          className="mt-8 w-full py-4 rounded-full bg-[#fa4f00] text-white font-semibold text-base flex items-center justify-center gap-2 md:max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.82 }}
          whileHover={{ backgroundColor: "#d44200", scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          Register Now <ArrowRight size={18} weight="bold" />
        </motion.button>
      </div>
    </div>
  );
}
