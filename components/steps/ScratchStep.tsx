"use client";

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
    <div className="animate-blurIn">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#fa4f00]">
          Your card is ready
        </span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
          Scratch to reveal
        </h2>
      </div>

      {/* Scratch card container */}
      <div
        className="relative mx-auto rounded-2xl overflow-hidden"
        style={{ width: "100%", maxWidth: 320, height: 200 }}
      >
        {/* Prize layer (shown underneath as canvas is scratched) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100">
          <PrizeIcon size={48} weight="duotone" className="text-[#fa4f00]" />
          <p className="mt-3 text-base font-semibold text-gray-800">{label}</p>
        </div>

        {/* Gold scratch canvas on top */}
        <ScratchCard onComplete={onComplete} width={320} height={200} />
      </div>

      {/* Hint */}
      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
        <HandPointing size={14} />
        Use your finger or cursor to scratch
      </div>
    </div>
  );
}
