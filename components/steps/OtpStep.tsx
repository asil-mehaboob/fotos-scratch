"use client";

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
    <div className="animate-blurIn">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeft size={15} weight="bold" />
        Change number
      </button>

      {/* Header */}
      <div className="text-center mb-7">
        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#fa4f00]">
          Step 2 of 2
        </span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
          Verify your number
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          OTP sent to{" "}
          <span className="font-medium text-gray-700">
            {countryDial} {phoneLocal}
          </span>
        </p>
      </div>

      {/* OTP boxes */}
      <OtpInput value={otpDigits} onChange={onOtpChange} />

      {error && (
        <div className="flex items-center justify-center gap-2 text-sm text-red-500 mt-3 animate-fadeIn">
          <WarningCircle size={16} weight="fill" className="shrink-0" />
          {error}
        </div>
      )}

      <Button fullWidth onClick={onVerify} disabled={isLoading} className="mt-6">
        {isLoading ? (
          <>
            <Spinner /> Verifying…
          </>
        ) : (
          <>
            Verify &amp; Continue <ArrowRight size={16} weight="bold" />
          </>
        )}
      </Button>

      {/* Resend */}
      <div className="text-center mt-4">
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
      </div>
    </div>
  );
}
