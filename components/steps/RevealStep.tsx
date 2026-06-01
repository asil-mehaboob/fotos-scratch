"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import type { Prize } from "@/lib/prizes";

interface RevealStepProps {
  prize: Prize;
  name: string;
  onReset: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
});

export function RevealStep({ prize, name, onReset }: RevealStepProps) {
  const { Icon: PrizeIcon, label } = prize;

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <motion.div className="flex justify-center mb-8" {...fadeUp(0)}>
        <Image src="/logo.png" alt="fotos.studio" width={160} height={42} className="h-10 w-auto object-contain" />
      </motion.div>

      {/* Prize icon */}
      <motion.div
        className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-orange-50 border border-orange-100 mb-6"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <PrizeIcon size={72} weight="duotone" className="text-[#fa4f00]" />
      </motion.div>

      <motion.span
        className="block text-[11px] font-mono tracking-[0.18em] uppercase text-[#fa4f00]"
        {...fadeUp(0.2)}
      >
        You won
      </motion.span>

      <motion.h2
        className="mt-3 text-4xl font-bold tracking-tight text-gray-900"
        {...fadeUp(0.26)}
      >
        {label}
      </motion.h2>

      <motion.p className="mt-3 text-base text-gray-500" {...fadeUp(0.32)}>
        Congratulations,{" "}
        <span className="font-medium text-gray-700">{name}</span>!
      </motion.p>

      <motion.div className="my-7 h-px bg-gray-100" {...fadeUp(0.38)} />

      <motion.div className="space-y-3" {...fadeUp(0.44)}>
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button fullWidth>
            Claim Your Prize <ArrowRight size={16} weight="bold" />
          </Button>
        </motion.div>
        <button
          onClick={onReset}
          className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
}
