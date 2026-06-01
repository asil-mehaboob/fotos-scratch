"use client";

import { useEffect, useRef } from "react";

interface ScratchCardProps {
  onComplete: () => void;
  width?: number;
  height?: number;
}

export function ScratchCard({ onComplete, width = 320, height = 200 }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPointerDown = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const hasCompleted = useRef(false);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Gold gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#f7d060");
    grad.addColorStop(0.35, "#e8b830");
    grad.addColorStop(0.7, "#d4a017");
    grad.addColorStop(1, "#c49010");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle crosshatch pattern for texture
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= width; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Diagonal shine lines
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    for (let i = -height; i < width; i += 28) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Center text
    ctx.fillStyle = "rgba(120, 80, 0, 0.55)";
    ctx.font = `bold 13px Manrope, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦  Scratch here  ✦", width / 2, height / 2);

    // ── Scratch helpers ──────────────────────────────────────
    const getCanvasPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 56;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (lastPos.current) {
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();

      lastPos.current = { x, y };
    };

    // ── Event handlers ───────────────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      isPointerDown.current = true;
      const pos = getCanvasPos(e);
      scratch(pos.x, pos.y);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerDown.current) return;
      const pos = getCanvasPos(e);
      scratch(pos.x, pos.y);
    };
    const onMouseUp = () => {
      isPointerDown.current = false;
      lastPos.current = null;
    };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      isPointerDown.current = true;
      const pos = getCanvasPos(e.touches[0]);
      scratch(pos.x, pos.y);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isPointerDown.current) return;
      const pos = getCanvasPos(e.touches[0]);
      scratch(pos.x, pos.y);
    };
    const onTouchEnd = () => {
      isPointerDown.current = false;
      lastPos.current = null;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    // ── Progress check ───────────────────────────────────────
    checkIntervalRef.current = setInterval(() => {
      if (hasCompleted.current) return;
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      let transparent = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) transparent++;
      }
      const pct = transparent / (width * height);
      if (pct > 0.55) {
        hasCompleted.current = true;
        canvas.style.transition = "opacity 0.6s ease";
        canvas.style.opacity = "0";
        setTimeout(onComplete, 600);
      }
    }, 250);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [width, height, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 w-full h-full cursor-crosshair rounded-2xl"
      style={{ touchAction: "none" }}
    />
  );
}
