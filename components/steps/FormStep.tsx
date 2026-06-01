"use client";

import { ArrowRight, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { Spinner } from "@/components/ui/Spinner";

interface FormStepProps {
  name: string;
  email: string;
  countryDial: string;
  phoneLocal: string;
  isLoading: boolean;
  error: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onCountryDialChange: (v: string) => void;
  onPhoneLocalChange: (v: string) => void;
  onSubmit: () => void;
}

export function FormStep({
  name,
  email,
  countryDial,
  phoneLocal,
  isLoading,
  error,
  onNameChange,
  onEmailChange,
  onCountryDialChange,
  onPhoneLocalChange,
  onSubmit,
}: FormStepProps) {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className="animate-blurIn">
      {/* Header */}
      <div className="text-center mb-7">
        <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#fa4f00]">
          Exclusive Offer
        </span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
          Scratch &amp; Win
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Enter your details to reveal your prize
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-4">
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
          label="Email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="john@example.com"
          autoComplete="email"
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

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500 animate-fadeIn">
            <WarningCircle size={16} weight="fill" className="shrink-0" />
            {error}
          </div>
        )}

        <Button fullWidth onClick={onSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner /> Sending OTP…
            </>
          ) : (
            <>
              Send OTP <ArrowRight size={16} weight="bold" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
