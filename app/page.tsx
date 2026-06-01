"use client";

import { useState, useEffect, useCallback } from "react";
import { OtpInput } from "@/components/ui/OtpInput";
import { ScratchCard } from "@/components/ui/ScratchCard";
import { pickPrize, type Prize } from "@/lib/prizes";

// ── Country codes (matching fotos signup) ────────────────────
const COUNTRY_CODES = [
  { code: "IN", dial: "+91",  flag: "🇮🇳", label: "India" },
  { code: "US", dial: "+1",   flag: "🇺🇸", label: "USA" },
  { code: "GB", dial: "+44",  flag: "🇬🇧", label: "UK" },
  { code: "AE", dial: "+971", flag: "🇦🇪", label: "UAE" },
  { code: "SG", dial: "+65",  flag: "🇸🇬", label: "Singapore" },
  { code: "AU", dial: "+61",  flag: "🇦🇺", label: "Australia" },
  { code: "CA", dial: "+1",   flag: "🇨🇦", label: "Canada" },
  { code: "MY", dial: "+60",  flag: "🇲🇾", label: "Malaysia" },
  { code: "NZ", dial: "+64",  flag: "🇳🇿", label: "New Zealand" },
  { code: "ZA", dial: "+27",  flag: "🇿🇦", label: "South Africa" },
  { code: "DE", dial: "+49",  flag: "🇩🇪", label: "Germany" },
  { code: "FR", dial: "+33",  flag: "🇫🇷", label: "France" },
  { code: "LK", dial: "+94",  flag: "🇱🇰", label: "Sri Lanka" },
  { code: "PK", dial: "+92",  flag: "🇵🇰", label: "Pakistan" },
  { code: "BD", dial: "+880", flag: "🇧🇩", label: "Bangladesh" },
  { code: "NP", dial: "+977", flag: "🇳🇵", label: "Nepal" },
  { code: "PH", dial: "+63",  flag: "🇵🇭", label: "Philippines" },
  { code: "NG", dial: "+234", flag: "🇳🇬", label: "Nigeria" },
  { code: "KE", dial: "+254", flag: "🇰🇪", label: "Kenya" },
  { code: "BR", dial: "+55",  flag: "🇧🇷", label: "Brazil" },
];

const CONFETTI_COLORS = [
  "#fa4f00", "#f5c842", "#22c55e", "#3b82f6", "#ec4899", "#a855f7", "#f97316",
];

type Step = "form" | "otp" | "success" | "scratch" | "reveal";

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
  isCircle: boolean;
}

// ── Shared input class ───────────────────────────────────────
const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150 focus:border-[#fa4f00] focus:ring-2 focus:ring-[#fa4f00]/20 bg-white";

// ── Primary button ───────────────────────────────────────────
const primaryBtnCls =
  "w-full bg-[#fa4f00] text-white rounded-full py-3.5 text-sm font-medium hover:bg-[#c93e00] transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

// ── Label ────────────────────────────────────────────────────
const labelCls = "block text-xs font-medium text-gray-700 mb-1.5";

// ── Card wrapper ─────────────────────────────────────────────
const cardCls =
  "bg-white rounded-2xl p-8 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] w-full max-w-sm";

export default function Home() {
  const [step, setStep] = useState<Step>("form");
  const [animKey, setAnimKey] = useState(0); // re-mount card on step change to replay animation

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryDial, setCountryDial] = useState("+91");
  const [phoneLocal, setPhoneLocal] = useState("");

  // OTP
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);

  // UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Prize
  const [prize, setPrize] = useState<Prize | null>(null);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  // ── Step transition helper ──────────────────────────────────
  const goTo = (next: Step) => {
    setError("");
    setStep(next);
    setAnimKey((k) => k + 1);
  };

  // ── Form submit ─────────────────────────────────────────────
  const handleSendOtp = () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    if (!phoneLocal.trim()) { setError("Please enter your phone number."); return; }
    setError("");
    setIsLoading(true);
    // Mock: 1s delay then advance
    setTimeout(() => {
      setIsLoading(false);
      setResendCooldown(60);
      goTo("otp");
    }, 1000);
  };

  // ── OTP verify ──────────────────────────────────────────────
  const handleVerifyOtp = () => {
    const code = otpDigits.join("");
    if (code.length < 6) { setError("Please enter all 6 digits."); return; }
    setError("");
    setIsLoading(true);
    // Mock: any 6 digits pass
    setTimeout(() => {
      setIsLoading(false);
      setPrize(pickPrize());
      goTo("success");
    }, 1000);
  };

  // ── Resend OTP ──────────────────────────────────────────────
  const handleResend = () => {
    setResendCooldown(60);
    setOtpDigits(Array(6).fill(""));
    setError("");
  };

  // ── Scratch complete ────────────────────────────────────────
  const handleScratchComplete = useCallback(() => {
    goTo("reveal");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reset ───────────────────────────────────────────────────
  const handleReset = () => {
    setName("");
    setEmail("");
    setPhoneLocal("");
    setCountryDial("+91");
    setOtpDigits(Array(6).fill(""));
    setPrize(null);
    setError("");
    goTo("form");
  };

  // ── Auto-advance success → scratch ─────────────────────────
  useEffect(() => {
    if (step !== "success") return;
    const t = setTimeout(() => goTo("scratch"), 2600);
    return () => clearTimeout(t);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Resend cooldown ─────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Generate confetti on reveal ─────────────────────────────
  useEffect(() => {
    if (step !== "reveal") return;
    setConfetti(
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 1.2,
        duration: 2.2 + Math.random() * 1.8,
        size: 6 + Math.floor(Math.random() * 9),
        rotate: Math.floor(Math.random() * 360),
        isCircle: Math.random() > 0.5,
      }))
    );
  }, [step]);

  // ── Render ──────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(250,79,0,0.04) 0%, #ffffff 70%)",
      }}
    >
      {/* Confetti layer */}
      {step === "reveal" && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {confetti.map((p) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.left}%`,
                top: "-24px",
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.isCircle ? "50%" : "2px",
                transform: `rotate(${p.rotate}deg)`,
                animation: `confettiFall ${p.duration}s ease ${p.delay}s both`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── STEP: FORM ─────────────────────────────────────── */}
      {step === "form" && (
        <div key={`form-${animKey}`} className={`${cardCls} animate-blurIn`}>
          {/* Header */}
          <div className="text-center mb-7">
            <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#fa4f00]">
              Exclusive Offer
            </span>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
              Scratch &amp; Win 🎁
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Enter your details to reveal your prize
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                className={inputCls}
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>

            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                className={inputCls}
                placeholder="john@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className={labelCls}>WhatsApp Number</label>
              <div className="flex gap-2">
                <select
                  value={countryDial}
                  onChange={(e) => setCountryDial(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-2.5 text-sm text-gray-900 outline-none transition-all duration-150 focus:border-[#fa4f00] focus:ring-2 focus:ring-[#fa4f00]/20 bg-white cursor-pointer shrink-0"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.dial}>
                      {c.flag} {c.dial}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phoneLocal}
                  onChange={(e) => setPhoneLocal(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  className={inputCls}
                  placeholder="9876543210"
                  autoComplete="tel-national"
                  inputMode="numeric"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 animate-fadeIn">{error}</p>
            )}

            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className={primaryBtnCls}
            >
              {isLoading ? (
                <>
                  <Spinner /> Sending OTP…
                </>
              ) : (
                <>
                  Send OTP
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP: OTP ──────────────────────────────────────── */}
      {step === "otp" && (
        <div key={`otp-${animKey}`} className={`${cardCls} animate-blurIn`}>
          {/* Back */}
          <button
            onClick={() => goTo("form")}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
          <OtpInput value={otpDigits} onChange={setOtpDigits} />

          {error && (
            <p className="text-sm text-red-500 text-center mt-3 animate-fadeIn">
              {error}
            </p>
          )}

          <button
            onClick={handleVerifyOtp}
            disabled={isLoading}
            className={`${primaryBtnCls} mt-6`}
          >
            {isLoading ? (
              <>
                <Spinner /> Verifying…
              </>
            ) : (
              "Verify & Continue"
            )}
          </button>

          {/* Resend */}
          <div className="text-center mt-4">
            {resendCooldown > 0 ? (
              <span className="text-sm text-gray-400">
                Resend OTP in{" "}
                <span className="font-medium text-gray-600">{resendCooldown}s</span>
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-[#fa4f00] hover:underline underline-offset-4 transition-colors"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── STEP: SUCCESS ───────────────────────────────────── */}
      {step === "success" && (
        <div key={`success-${animKey}`} className={`${cardCls} animate-slideUp text-center py-4`}>
          {/* Animated checkmark */}
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

          {/* Progress dots */}
          <div
            className="flex justify-center gap-1.5 mt-8 animate-fadeIn"
            style={{ animationDelay: "1.3s", opacity: 0, animationFillMode: "both" }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gray-200"
                style={{
                  animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── STEP: SCRATCH ───────────────────────────────────── */}
      {step === "scratch" && (
        <div key={`scratch-${animKey}`} className={`${cardCls} animate-blurIn`}>
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#fa4f00]">
              Your card is ready
            </span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
              Scratch to reveal
            </h2>
          </div>

          {/* Scratch card */}
          <div
            className="relative mx-auto rounded-2xl overflow-hidden"
            style={{ width: "100%", maxWidth: 320, height: 200 }}
          >
            {/* Prize layer underneath */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100">
              <span className="text-5xl leading-none">{prize?.emoji}</span>
              <p className="mt-3 text-base font-semibold text-gray-800">{prize?.label}</p>
            </div>
            {/* Scratch canvas on top */}
            <ScratchCard onComplete={handleScratchComplete} width={320} height={200} />
          </div>

          <p className="text-center mt-4 text-xs text-gray-400 tracking-wide">
            ☝️ &nbsp;Use your finger or cursor to scratch
          </p>
        </div>
      )}

      {/* ── STEP: REVEAL ────────────────────────────────────── */}
      {step === "reveal" && (
        <div key={`reveal-${animKey}`} className={`${cardCls} animate-scaleIn text-center`}>
          {/* Prize */}
          <div className="py-2">
            <div className="text-7xl leading-none mb-5">{prize?.emoji}</div>

            <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#fa4f00]">
              You won
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              {prize?.label}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Congratulations, <span className="font-medium text-gray-700">{name}</span>! 🎉
            </p>

            {/* Divider */}
            <div className="my-7 h-px bg-gray-100" />

            {/* CTAs */}
            <div className="space-y-3">
              <button className={primaryBtnCls}>
                Claim Your Prize
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={handleReset}
                className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Spinner ──────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="2"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
