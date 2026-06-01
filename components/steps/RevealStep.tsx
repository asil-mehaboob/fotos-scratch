"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import type { Prize } from "@/lib/prizes";

interface RevealStepProps {
  prize: Prize;
  name: string;
  onReset: () => void;
}

export function RevealStep({ prize, name, onReset }: RevealStepProps) {
  const { Icon: PrizeIcon, label } = prize;

  return (
    <div className="animate-scaleIn text-center">
      {/* Large prize icon */}
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-50 border border-orange-100 mb-5">
        <PrizeIcon size={52} weight="duotone" className="text-[#fa4f00]" />
      </div>

      <span className="block text-[10px] font-mono tracking-[0.15em] uppercase text-[#fa4f00]">
        You won
      </span>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
        {label}
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Congratulations,{" "}
        <span className="font-medium text-gray-700">{name}</span>!
      </p>

      {/* Divider */}
      <div className="my-7 h-px bg-gray-100" />

      {/* CTAs */}
      <div className="space-y-3">
        <Button fullWidth>
          Claim Your Prize <ArrowRight size={16} weight="bold" />
        </Button>
        <button
          onClick={onReset}
          className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
