"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HandPointing } from "@phosphor-icons/react";
import { ScratchCard } from "@/components/ui/ScratchCard";
import type { Prize } from "@/lib/prizes";

interface ScratchStepProps {
  prize: Prize;
  onComplete: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
});

export function ScratchStep({ prize, onComplete }: ScratchStepProps) {
  const { Icon: PrizeIcon, label } = prize;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <motion.div className="flex justify-center mb-8" {...fadeUp(0)}>
        <Image src="/logo.png" alt="fotos.studio" width={160} height={42} className="h-10 w-auto object-contain" />
      </motion.div>

      {/* Header */}
      <motion.div className="text-center mb-10" {...fadeUp(0.08)}>
        <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-[#fa4f00]">
          Your card is ready
        </span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Scratch to reveal
        </h2>
      </motion.div>

      {/* Scratch card */}
      <motion.div
        className="relative mx-auto rounded-2xl overflow-hidden"
        style={{ width: "100%", maxWidth: 480, height: 280 }}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100">
          <PrizeIcon size={64} weight="duotone" className="text-[#fa4f00]" />
          <p className="mt-3 text-lg font-semibold text-gray-800">{label}</p>
        </div>
        <ScratchCard onComplete={onComplete} width={480} height={280} />
      </motion.div>

      <motion.div
        className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400"
        {...fadeUp(0.3)}
      >
        <HandPointing size={14} />
        Use your finger or cursor to scratch
      </motion.div>
    </motion.div>
  );
}
