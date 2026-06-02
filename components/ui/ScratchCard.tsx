"use client";

import { useEffect, useRef } from "react";

interface ScratchCardProps {
  onComplete: () => void;
  width?: number;
  height?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
}

const PARTICLE_COLORS = ["#ffffff", "#ffd166", "#ffe599", "#ffb347", "#fff0c0"];

function drawFourStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const radius = i % 2 === 0 ? r : r * 0.32;
    if (i === 0) ctx.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
    else ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function ScratchCard({ onComplete, width = 320, height = 200 }: ScratchCardProps) {
  const scratchRef  = useRef<HTMLCanvasElement>(null);
  const particleRef = useRef<HTMLCanvasElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);
  const isDown      = useRef(false);
  const lastPos     = useRef<{ x: number; y: number } | null>(null);
  const completed   = useRef(false);
  const textFaded   = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const particles   = useRef<Particle[]>([]);
  const rafRef      = useRef<number>(0);

  useEffect(() => {
    const canvas  = scratchRef.current;
    const pCanvas = particleRef.current;
    if (!canvas || !pCanvas) return;
    const ctx  = canvas.getContext("2d", { willReadFrequently: true });
    const pCtx = pCanvas.getContext("2d");
    if (!ctx || !pCtx) return;

    // ── Orange glossy surface (no text — rendered as HTML) ───
    const base = ctx.createLinearGradient(0, 0, 0, height);
    base.addColorStop(0,   "#ff6a20");
    base.addColorStop(0.4, "#fa4f00");
    base.addColorStop(1,   "#c93e00");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    // Primary gloss — large oval highlight top-center
    const g1 = ctx.createRadialGradient(width * 0.5, height * -0.45, 0, width * 0.5, height * -0.45, width * 0.95);
    g1.addColorStop(0,   "rgba(255,255,255,0.55)");
    g1.addColorStop(0.3, "rgba(255,255,255,0.22)");
    g1.addColorStop(0.6, "rgba(255,255,255,0.04)");
    g1.addColorStop(1,   "rgba(255,255,255,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, width, height);

    // Secondary gloss — tight offset highlight top-left
    const g2 = ctx.createRadialGradient(width * 0.28, height * 0.04, 0, width * 0.28, height * 0.04, width * 0.38);
    g2.addColorStop(0,   "rgba(255,255,255,0.38)");
    g2.addColorStop(0.5, "rgba(255,255,255,0.1)");
    g2.addColorStop(1,   "rgba(255,255,255,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, width, height);

    // Crisp top-edge specular line
    const te = ctx.createLinearGradient(0, 0, width, 0);
    te.addColorStop(0,   "rgba(255,255,255,0)");
    te.addColorStop(0.2, "rgba(255,255,255,0.8)");
    te.addColorStop(0.5, "rgba(255,255,255,0.95)");
    te.addColorStop(0.8, "rgba(255,255,255,0.8)");
    te.addColorStop(1,   "rgba(255,255,255,0)");
    ctx.fillStyle = te;
    ctx.fillRect(0, 0, width, 1.5);

    // Bottom darkening
    const btm = ctx.createLinearGradient(0, height * 0.55, 0, height);
    btm.addColorStop(0, "rgba(0,0,0,0)");
    btm.addColorStop(1, "rgba(0,0,0,0.18)");
    ctx.fillStyle = btm;
    ctx.fillRect(0, 0, width, height);

    // Sparse white glints
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.25 + Math.random() * 0.45})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.0 + 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Inner white rim
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.strokeRect(9, 9, width - 18, height - 18);

    // ── Particle system ──────────────────────────────────────
    const emit = (x: number, y: number) => {
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.5;
        particles.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 1,
          size: Math.random() * 4.5 + 2,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.3,
        });
      }
    };

    const tick = () => {
      pCtx.clearRect(0, 0, width, height);
      particles.current = particles.current.filter(p => p.life > 0.01);
      for (const p of particles.current) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.13;
        p.life -= 0.035; p.rotation += p.rotSpeed;
        pCtx.globalAlpha = Math.max(0, p.life * p.life);
        pCtx.fillStyle = p.color;
        drawFourStar(pCtx, p.x, p.y, p.size, p.rotation);
      }
      pCtx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // ── Scratch logic ────────────────────────────────────────
    const getPos = (e: MouseEvent | Touch) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (width / r.width), y: (e.clientY - r.top) * (height / r.height) };
    };

    const fadeText = () => {
      if (textFaded.current || !textRef.current) return;
      textFaded.current = true;
      textRef.current.style.transition = "opacity 0.25s ease";
      textRef.current.style.opacity = "0";
    };

    const scratch = (x: number, y: number) => {
      fadeText();
      ctx.globalCompositeOperation = "destination-out";
      // Must be fully opaque — destination-out uses source alpha to determine
      // how much to erase. Partial alpha = partial erase (the "fading" bug).
      ctx.fillStyle   = "rgba(0,0,0,1)";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = 66; ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (lastPos.current) {
        ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(x, y); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(x, y, 33, 0, Math.PI * 2); ctx.fill();
      lastPos.current = { x, y };
      emit(x, y);
    };

    const onDown = (e: MouseEvent)  => { isDown.current = true;  const p = getPos(e); scratch(p.x, p.y); };
    const onMove = (e: MouseEvent)  => { if (!isDown.current) return; const p = getPos(e); scratch(p.x, p.y); };
    const onUp   = ()               => { isDown.current = false; lastPos.current = null; };
    const onTS   = (e: TouchEvent)  => { e.preventDefault(); isDown.current = true;  const p = getPos(e.touches[0]); scratch(p.x, p.y); };
    const onTM   = (e: TouchEvent)  => { e.preventDefault(); if (!isDown.current) return; const p = getPos(e.touches[0]); scratch(p.x, p.y); };
    const onTE   = ()               => { isDown.current = false; lastPos.current = null; };

    canvas.addEventListener("mousedown",  onDown);
    canvas.addEventListener("mousemove",  onMove);
    window.addEventListener("mouseup",    onUp);
    canvas.addEventListener("touchstart", onTS, { passive: false });
    canvas.addEventListener("touchmove",  onTM, { passive: false });
    canvas.addEventListener("touchend",   onTE);

    intervalRef.current = setInterval(() => {
      if (completed.current) return;
      const data = ctx.getImageData(0, 0, width, height).data;
      let t = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] < 128) t++;
      if (t / (width * height) > 0.55) {
        completed.current = true;
        canvas.style.transition = "opacity 0.55s ease";
        canvas.style.opacity = "0";
        pCanvas.style.transition = "opacity 0.55s ease";
        pCanvas.style.opacity = "0";
        setTimeout(onComplete, 560);
      }
    }, 200);

    return () => {
      canvas.removeEventListener("mousedown",  onDown);
      canvas.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseup",    onUp);
      canvas.removeEventListener("touchstart", onTS);
      canvas.removeEventListener("touchmove",  onTM);
      canvas.removeEventListener("touchend",   onTE);
      if (intervalRef.current) clearInterval(intervalRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [width, height, onComplete]);

  return (
    <>
      {/* Scratch canvas — orange glossy surface */}
      <canvas
        ref={scratchRef}
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full cursor-crosshair rounded-2xl"
        style={{ touchAction: "none", zIndex: 1 }}
      />

      {/* HTML text overlay — real Manrope, fades on first scratch */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none rounded-2xl"
        style={{ zIndex: 2 }}
      >
        {/* Flanking rules + SCRATCH */}
        <div className="flex items-center gap-3 mb-2">
          <div style={{ width: 36, height: 1, background: "rgba(255,255,255,0.35)" }} />
          <span
            className="text-white tracking-[0.22em] uppercase"
            style={{ fontSize: 22, fontWeight: 800, textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}
          >
            Scratch
          </span>
          <div style={{ width: 36, height: 1, background: "rgba(255,255,255,0.35)" }} />
        </div>

        {/* Subtitle */}
        <span
          className="tracking-[0.18em] uppercase"
          style={{ fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.58)" }}
        >
          to reveal your prize
        </span>

        {/* Three hint lines */}
        <div className="flex gap-1.5 mt-4">
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 18, height: 1.5, borderRadius: 2, background: "rgba(255,255,255,0.28)" }} />
          ))}
        </div>
      </div>

      {/* Particle canvas — always on top */}
      <canvas
        ref={particleRef}
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl"
        style={{ zIndex: 3 }}
      />
    </>
  );
}
