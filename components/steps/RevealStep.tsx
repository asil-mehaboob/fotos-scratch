"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Check, ShareNetwork, SmileyMeh } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import type { Prize } from "@/lib/prizes";

interface RevealStepProps {
  prize: Prize;
  name: string;
  couponCode: string | null;
  eligibilityNote: string | null;
  onReset: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const CLAIM_URL = "https://app.usefotos.com/signup";

const TIER_COLORS: Record<string, { from: string; via: string; to: string }> = {
  JACKPOT: { from: "#7c3aed", via: "#6d28d9", to: "#4c1d95" },
  GOLD:    { from: "#d97706", via: "#b45309", to: "#92400e" },
  SILVER:  { from: "#475569", via: "#334155", to: "#1e293b" },
  BRONZE:  { from: "#ff6820", via: "#fa4f00", to: "#cc3d00" },
};

const TIER_DESCRIPTIONS: Record<string, string> = {
  JACKPOT: "Valid on Prime or Focal. Enter at checkout on app.usefotos.com — no payment required.",
  GOLD:    "Valid on Prime or Focal yearly plan. Enter at checkout on app.usefotos.com.",
  SILVER:  "Valid on Prime or Focal. Enter at checkout on app.usefotos.com — yearly or half-yearly only.",
  BRONZE:  "Valid on Prime plan. Enter at checkout on app.usefotos.com — yearly or half-yearly only.",
};

export function RevealStep({ prize, name, couponCode, eligibilityNote, onReset }: RevealStepProps) {
  const { label, tier } = prize;
  const [copied, setCopied] = useState(false);

  const handleCopyCode = useCallback(async () => {
    if (!couponCode) return;
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [couponCode]);

  const handleShare = useCallback(async () => {
    const text = couponCode
      ? `🎉 I just won ${label} from fotos.studio! Use my coupon code ${couponCode} and sign up at ${CLAIM_URL}`
      : `🎉 I just played the fotos.studio Photofest Scratch & Win! Sign up at ${CLAIM_URL}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "fotos.studio Photofest", text, url: CLAIM_URL });
        return;
      } catch {
        // user cancelled — fall through
      }
    }
    const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank", "noopener,noreferrer");
  }, [label, couponCode]);

  const colors = tier ? TIER_COLORS[tier] : null;
  const gradientStyle = colors
    ? { background: `linear-gradient(140deg, ${colors.from} 0%, ${colors.via} 55%, ${colors.to} 100%)` }
    : { background: "linear-gradient(140deg, #64748b 0%, #475569 55%, #1e293b 100%)" };

  // No-prize view
  if (!tier) {
    return (
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div className="flex justify-center mb-6" {...fadeUp(0)}>
          <Image src="/logo.png" alt="fotos.studio" width={160} height={42} className="h-10 w-auto object-contain" />
        </motion.div>

        <motion.div className="mb-8" {...fadeUp(0.07)}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <SmileyMeh size={32} className="text-gray-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Better Luck Next Time</h2>
          <p className="text-gray-500 text-sm">Thank you for participating in Fotos Photofest!</p>
        </motion.div>

        <motion.div className="space-y-3" {...fadeUp(0.25)}>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              fullWidth
              onClick={() => window.open(CLAIM_URL, "_blank", "noopener,noreferrer")}
              style={{
                background: "linear-gradient(135deg, #fa4f00 0%, #ff6b2b 100%)",
                boxShadow: "0 8px 24px rgba(250,79,0,0.28)",
              }}
            >
              Sign Up for Free <ArrowRight size={15} weight="bold" />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.98 }}>
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl py-2.5 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <ShareNetwork size={15} weight="bold" />
              Share
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* App logo */}
      <motion.div className="flex justify-center mb-6" {...fadeUp(0)}>
        <Image src="/logo.png" alt="fotos.studio" width={160} height={42} className="h-10 w-auto object-contain" />
      </motion.div>

      <motion.div className="mb-7" {...fadeUp(0.07)}>
        <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-[#fa4f00]">
          Congratulations, {name.split(" ")[0]}
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Here&apos;s your gift card
        </h2>
      </motion.div>

      {/* Gift card */}
      <motion.div
        className="mx-auto mb-8"
        style={{ maxWidth: 400 }}
        initial={{ opacity: 0, y: 28, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
      >
        <div className="rounded-2xl overflow-hidden" style={gradientStyle}>
          {/* Main face */}
          <div style={{ padding: "28px 28px 22px" }}>
            <div className="flex items-center justify-between mb-8">
              <Image
                src="/logo.png"
                alt="fotos.studio"
                width={110}
                height={30}
                className="h-7 w-auto object-contain brightness-0 invert opacity-95"
              />
              <p style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}>
                {tier}
              </p>
            </div>

            <div className="mb-4">
              <p style={{
                color: "#fff",
                fontSize: 28,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}>
                {label}
              </p>
            </div>

            <p style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.04em",
              marginTop: 12,
            }}>
              {name}
            </p>
          </div>

          {/* Code strip */}
          <div style={{ background: "rgba(0,0,0,0.18)", padding: "16px 28px 20px" }}>
            <p style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 8,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}>
              Coupon Code
            </p>
            <div className="flex items-center justify-between gap-3">
              <p style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "0.18em",
                fontVariantNumeric: "tabular-nums",
              }}>
                {couponCode ?? "—"}
              </p>
              {couponCode && (
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-xs font-semibold transition-colors shrink-0"
                  style={{ color: copied ? "rgba(134,239,172,1)" : "rgba(255,255,255,0.7)" }}
                >
                  {copied ? <Check size={13} weight="bold" /> : <Copy size={13} weight="bold" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Coupon usage description */}
      {tier && TIER_DESCRIPTIONS[tier] && (
        <motion.div className="mb-5 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-left" {...fadeUp(0.35)}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">How to use</p>
          <p className="text-xs text-gray-500 leading-relaxed">{TIER_DESCRIPTIONS[tier]}</p>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div className="space-y-3" {...fadeUp(0.42)}>
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            fullWidth
            onClick={() => window.open(CLAIM_URL, "_blank", "noopener,noreferrer")}
            style={{
              background: "linear-gradient(135deg, #fa4f00 0%, #ff6b2b 100%)",
              boxShadow: "0 8px 24px rgba(250,79,0,0.28)",
            }}
          >
            Claim Your Prize <ArrowRight size={15} weight="bold" />
          </Button>
        </motion.div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl py-2.5 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <ShareNetwork size={15} weight="bold" />
            Share
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
