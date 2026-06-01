"use client";

import { COUNTRY_CODES } from "@/lib/country-codes";

interface CountrySelectProps {
  value: string;
  onChange: (dial: string) => void;
}

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Country dial code"
      className="shrink-0 border border-gray-200 rounded-lg px-2 py-2.5 text-sm text-gray-900 outline-none transition-all duration-150 focus:border-[#fa4f00] focus:ring-2 focus:ring-[#fa4f00]/20 bg-white cursor-pointer"
    >
      {COUNTRY_CODES.map((c) => (
        <option key={c.code} value={c.dial}>
          {c.flag} {c.dial}
        </option>
      ))}
    </select>
  );
}
