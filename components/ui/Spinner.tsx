import { CircleNotch } from "@phosphor-icons/react";

interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 16 }: SpinnerProps) {
  return <CircleNotch size={size} className="animate-spin" />;
}
