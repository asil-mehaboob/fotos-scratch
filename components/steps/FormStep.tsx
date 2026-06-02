"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { Spinner } from "@/components/ui/Spinner";

interface FormStepProps {
  name: string;
  studioName: string;
  countryDial: string;
  phoneLocal: string;
  isAkpaMember: boolean;
  isLoading: boolean;
  error: string;
  onNameChange: (v: string) => void;
  onStudioNameChange: (v: string) => void;
  onCountryDialChange: (v: string) => void;
  onPhoneLocalChange: (v: string) => void;
  onAkpaMemberChange: (v: boolean) => void;
  onSubmit: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export function FormStep({
  name,
  studioName,
  countryDial,
  phoneLocal,
  isAkpaMember,
  isLoading,
  error,
  onNameChange,
  onStudioNameChange,
  onCountryDialChange,
  onPhoneLocalChange,
  onAkpaMemberChange,
  onSubmit,
}: FormStepProps) {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSubmit();
  };

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
          Exclusive Offer
        </span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Scratch &amp; Win
        </h1>
        <p className="mt-2 text-base text-gray-500">
          Enter your details to reveal your prize
        </p>
      </motion.div>

      {/* Fields */}
      <motion.div className="space-y-5" {...fadeUp(0.16)}>
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="John Doe"
          autoComplete="name"
        />

        <Input
          label="Studio Name"
          type="text"
          value={studioName}
          onChange={(e) => onStudioNameChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Your Studio Name"
          autoComplete="organization"
        />

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            WhatsApp Number
          </label>
          <div className="flex gap-2">
            <CountrySelect value={countryDial} onChange={onCountryDialChange} />
            <input
              type="tel"
              value={phoneLocal}
              onChange={(e) => onPhoneLocalChange(e.target.value.replace(/\D/g, ""))}
              onKeyDown={handleKey}
              placeholder="9876543210"
              autoComplete="tel-national"
              inputMode="numeric"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150 focus:border-[#fa4f00] focus:ring-2 focus:ring-[#fa4f00]/20 bg-white"
            />
          </div>
        </div>

        {/* Akpa member checkbox */}
        <button
          type="button"
          onClick={() => onAkpaMemberChange(!isAkpaMember)}
          className="flex items-center gap-3 group"
        >
          <motion.div
            className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors duration-150"
            animate={{
              borderColor: isAkpaMember ? "#fa4f00" : "#d1d5db",
              backgroundColor: isAkpaMember ? "#fa4f00" : "#ffffff",
            }}
            transition={{ duration: 0.15 }}
          >
            {isAkpaMember && (
              <motion.svg
                width="11" height="9" viewBox="0 0 11 9" fill="none"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                <polyline
                  points="1,4.5 4,7.5 10,1"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </motion.div>
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors select-none">
            I am an <span className="font-medium">AKPA member.</span>
          </span>
        </button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-red-500"
          >
            <WarningCircle size={16} weight="fill" className="shrink-0" />
            {error}
          </motion.div>
        )}

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button fullWidth onClick={onSubmit} disabled={isLoading}>
            {isLoading ? (
              <><Spinner /> Sending OTP…</>
            ) : (
              <>Send OTP <ArrowRight size={16} weight="bold" /></>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
