"use client";

import { motion } from "framer-motion";

export function SuccessStep() {
  return (
    <motion.div
      className="text-center py-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {/* Animated SVG checkmark */}
      <div className="mx-auto w-24 h-24">
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#22c55e"
            strokeWidth="2.5"
            fill="none"
            className="draw-circle"
          />
          <polyline
            points="24,41 34,53 57,27"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="draw-check"
          />
        </svg>
      </div>

      <motion.h2
        className="mt-6 text-4xl font-bold tracking-tight text-gray-900"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: 0.9 }}
      >
        You&apos;re in!
      </motion.h2>

      <motion.p
        className="mt-2 text-sm text-gray-500"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: 1.1 }}
      >
        Get ready to scratch your card…
      </motion.p>

      <motion.div
        className="flex justify-center gap-1.5 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-300"
            style={{ animation: `pulse 1.2s ease ${i * 0.2}s infinite` }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
