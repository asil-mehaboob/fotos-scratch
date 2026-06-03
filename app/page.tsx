"use client";

import { useState, useEffect, useCallback } from "react";
import { FormStep } from "@/components/steps/FormStep";
import { OtpStep } from "@/components/steps/OtpStep";
import { SuccessStep } from "@/components/steps/SuccessStep";
import { ScratchStep } from "@/components/steps/ScratchStep";
import { RevealStep } from "@/components/steps/RevealStep";
import { SplashStep } from "@/components/steps/SplashStep";
import { Confetti } from "@/components/Confetti";
import { getPrizeById, type Prize } from "@/lib/prizes";

type Step = "splash" | "form" | "otp" | "success" | "scratch" | "reveal";

export default function Home() {
  // Navigation
  const [step, setStep] = useState<Step>("splash");
  const [animKey, setAnimKey] = useState(0);

  // Form
  const [name, setName] = useState("");
  const [studioName, setStudioName] = useState("");
  const [countryDial, setCountryDial] = useState("+91");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [isAkpaMember, setIsAkpaMember] = useState(false);

  // OTP
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);

  // UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Prize
  const [prize, setPrize] = useState<Prize | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [eligibilityNote, setEligibilityNote] = useState<string | null>(null);

  // ── Helpers ────────────────────────────────────────────────
  const goTo = (next: Step) => {
    setError("");
    setStep(next);
    setAnimKey((k) => k + 1);
  };

  // ── Handlers ───────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!studioName.trim()) { setError("Please enter your studio name."); return; }
    if (!phoneLocal.trim()) { setError("Please enter your phone number."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: countryDial + phoneLocal }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to send OTP."); return; }
      setResendCooldown(60);
      goTo("otp");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpDigits.join("").length < 6) { setError("Please enter all 6 digits."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: countryDial + phoneLocal,
          code: otpDigits.join(""),
          name,
          studioName,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Invalid OTP."); return; }
      setPrize(getPrizeById(data.prizeId) ?? null);
      setCouponCode(data.couponCode ?? null);
      setEligibilityNote(data.eligibilityNote ?? null);
      goTo("success");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setOtpDigits(Array(6).fill(""));
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: countryDial + phoneLocal }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to resend OTP."); return; }
      setResendCooldown(60);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScratchComplete = useCallback(() => goTo("reveal"), []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setName("");
    setStudioName("");
    setPhoneLocal("");
    setCountryDial("+91");
    setOtpDigits(Array(6).fill(""));
    setIsAkpaMember(false);
    setPrize(null);
    setCouponCode(null);
    setEligibilityNote(null);
    setError("");
    goTo("form");
  };

  // ── Effects ────────────────────────────────────────────────
  useEffect(() => {
    if (step !== "success") return;
    const t = setTimeout(() => goTo("scratch"), 2600);
    return () => clearTimeout(t);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Render ─────────────────────────────────────────────────
  if (step === "splash") {
    return <SplashStep onNext={() => goTo("form")} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] relative overflow-hidden">
      {/* Subtle warm glow — matches splash */}
      <div
        className="absolute top-0 left-0 right-0 h-80 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(250,79,0,0.07) 0%, transparent 80%)",
        }}
      />
      {step === "reveal" && <Confetti />}

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {step === "form" && (
            <FormStep
              key={`form-${animKey}`}
              name={name}
              studioName={studioName}
              countryDial={countryDial}
              phoneLocal={phoneLocal}
              isAkpaMember={isAkpaMember}
              isLoading={isLoading}
              error={error}
              onNameChange={setName}
              onStudioNameChange={setStudioName}
              onCountryDialChange={setCountryDial}
              onPhoneLocalChange={setPhoneLocal}
              onAkpaMemberChange={setIsAkpaMember}
              onSubmit={handleSendOtp}
            />
          )}

          {step === "otp" && (
            <OtpStep
              key={`otp-${animKey}`}
              countryDial={countryDial}
              phoneLocal={phoneLocal}
              otpDigits={otpDigits}
              resendCooldown={resendCooldown}
              isLoading={isLoading}
              error={error}
              onOtpChange={setOtpDigits}
              onVerify={handleVerifyOtp}
              onResend={handleResend}
              onBack={() => goTo("form")}
            />
          )}

          {step === "success" && (
            <SuccessStep key={`success-${animKey}`} />
          )}

          {step === "scratch" && prize && (
            <ScratchStep
              key={`scratch-${animKey}`}
              prize={prize}
              onComplete={handleScratchComplete}
            />
          )}

          {step === "reveal" && prize && (
            <RevealStep
              key={`reveal-${animKey}`}
              prize={prize}
              name={name}
              couponCode={couponCode}
              eligibilityNote={eligibilityNote}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
