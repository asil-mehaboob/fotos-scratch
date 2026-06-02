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

export function ScratchStep({ prize, onComplete }: ScratchStepProps) {
  const { Icon: PrizeIcon, label } = prize;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <Image src="/logo.png" alt="fotos.studio" width={160} height={42} className="h-10 w-auto object-contain" />
      </motion.div>

      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 }}
      >
        <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-[#fa4f00]">
          Your card is ready
        </span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Scratch to reveal
        </h2>
      </motion.div>

      {/* Card */}
      <motion.div
        className="relative mx-auto"
        style={{ maxWidth: 480 }}
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay: 0.16 }}
      >
        {/* Card body — clean border + neutral shadow, no orange */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            height: 280,
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 20px 56px rgba(0,0,0,0.09), 0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {/* Prize area underneath — clean white */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "#fafaf9" }}
          >
            {/* Subtle radial glow behind medal */}
            <div
              className="absolute"
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(250,79,0,0.06) 0%, transparent 70%)",
                filter: "blur(16px)",
              }}
            />

            {/* Medal */}
            <div className="relative flex flex-col items-center">
              <div
                style={{
                  width: 136,
                  height: 136,
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "radial-gradient(circle at 38% 30%, #ffffff 0%, #f5f3ef 100%)",
                  boxShadow: [
                    "0 0 0 1.5px rgba(0,0,0,0.07)",
                    "0 0 0 5px #ffffff",
                    "0 0 0 6.5px rgba(0,0,0,0.05)",
                    "0 12px 32px rgba(0,0,0,0.1)",
                    "0 2px 6px rgba(0,0,0,0.06)",
                  ].join(", "),
                  position: "relative",
                }}
              >
                {/* Top-left gloss */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.7) 0%, transparent 48%)",
                }} />
                <PrizeIcon
                  size={40}
                  weight="duotone"
                  className="text-[#fa4f00]"
                  style={{ position: "relative", zIndex: 1 }}
                />
                <p style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1f2937",
                  marginTop: 6,
                  position: "relative",
                  zIndex: 1,
                  textAlign: "center",
                  paddingInline: 12,
                  lineHeight: 1.25,
                }}>
                  {label}
                </p>
              </div>

              {/* Prize tag — sits just below the medal */}
              <div
                style={{
                  marginTop: 10,
                  background: "#1f2937",
                  borderRadius: 20,
                  padding: "4px 14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                }}
              >
                <span style={{
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}>
                  You Won
                </span>
              </div>
            </div>
          </div>

          {/* Scratch canvas overlay */}
          <ScratchCard onComplete={onComplete} width={480} height={280} />
        </div>
      </motion.div>

      {/* Hint */}
      <motion.div
        className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <HandPointing size={14} />
        </motion.div>
        Use your finger or cursor to scratch
      </motion.div>
    </motion.div>
  );
}
