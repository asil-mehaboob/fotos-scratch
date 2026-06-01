"use client";

export function SuccessStep() {
  return (
    <div className="animate-slideUp text-center py-4">
      {/* Animated SVG checkmark */}
      <div className="mx-auto w-24 h-24">
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#22c55e"
            strokeWidth="2.5"
            fill="none"
            className="draw-circle"
          />
          <polyline
            points="24,41 34,53 57,27"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="draw-check"
          />
        </svg>
      </div>

      <h2
        className="mt-5 text-2xl font-semibold tracking-tight text-gray-900 animate-fadeIn"
        style={{ animationDelay: "0.9s", opacity: 0, animationFillMode: "both" }}
      >
        You&apos;re in!
      </h2>
      <p
        className="mt-2 text-sm text-gray-500 animate-fadeIn"
        style={{ animationDelay: "1.1s", opacity: 0, animationFillMode: "both" }}
      >
        Get ready to scratch your card…
      </p>

      {/* Pulsing dots */}
      <div
        className="flex justify-center gap-1.5 mt-8 animate-fadeIn"
        style={{ animationDelay: "1.3s", opacity: 0, animationFillMode: "both" }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-300"
            style={{ animation: `pulse 1.2s ease ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
