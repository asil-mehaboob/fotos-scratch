import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[#fa4f00] text-white hover:bg-[#c93e00] disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "text-gray-400 hover:text-gray-700 bg-transparent",
  outline:
    "border border-gray-200 text-gray-700 hover:border-gray-400 bg-white",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-sm px-8 py-3.5",
};

export function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150",
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
