import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150 bg-white",
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-400/20"
            : "border-gray-200 focus:border-[#fa4f00] focus:ring-2 focus:ring-[#fa4f00]/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
