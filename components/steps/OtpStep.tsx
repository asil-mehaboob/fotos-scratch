"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/ui/OtpInput";
import { Spinner } from "@/components/ui/Spinner";

interface OtpStepProps {
  countryDial: string;
  phoneLocal: string;
  otpDigits: string[];
  resendCooldown: number;
  isLoading: boolean;
  error: string;
  onOtpChange: (digits: string[]) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export function OtpStep({
  countryDial,
  phoneLocal,
  otpDigits,
  resendCooldown,
  isLoading,
  error,
  onOtpChange,
  onVerify,
  onResend,
  onBack,
}: OtpStepProps) {
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

      {/* Back */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6"
        {...fadeUp(0.05)}
        whileHover={{ x: -3 }}
      >
        <ArrowLeft size={15} weight="bold" />
        Change number
      </motion.button>

      {/* Header */}
      <motion.div className="text-center mb-10" {...fadeUp(0.1)}>
        <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-[#fa4f00]">
          Step 2 of 2
        </span>
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Verify your number
        </h2>
        <p className="mt-2 text-base text-gray-500">
          OTP sent to{" "}
          <span className="font-medium text-gray-700">
            {countryDial} {phoneLocal}
          </span>
        </p>
      </motion.div>

      <motion.div {...fadeUp(0.18)}>
        <OtpInput value={otpDigits} onChange={onOtpChange} />
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-sm text-red-500 mt-3"
        >
          <WarningCircle size={16} weight="fill" className="shrink-0" />
          {error}
        </motion.div>
      )}

      <motion.div className="mt-6" {...fadeUp(0.24)} whileTap={{ scale: 0.98 }}>
        <Button fullWidth onClick={onVerify} disabled={isLoading}>
          {isLoading ? (
            <><Spinner /> Verifying…</>
          ) : (
            <>Verify &amp; Continue <ArrowRight size={16} weight="bold" /></>
          )}
        </Button>
      </motion.div>

      <motion.div className="text-center mt-4" {...fadeUp(0.3)}>
        {resendCooldown > 0 ? (
          <span className="text-sm text-gray-400">
            Resend OTP in{" "}
            <span className="font-medium text-gray-600">{resendCooldown}s</span>
          </span>
        ) : (
          <button
            onClick={onResend}
            className="text-sm text-[#fa4f00] hover:underline underline-offset-4 transition-colors"
          >
            Resend OTP
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
