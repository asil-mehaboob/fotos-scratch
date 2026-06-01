"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "#fa4f00", "#f5c842", "#22c55e", "#3b82f6", "#ec4899", "#a855f7", "#f97316",
];

interface Piece {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
  isCircle: boolean;
}

function generatePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 1.2,
    duration: 2.2 + Math.random() * 1.8,
    size: 6 + Math.floor(Math.random() * 9),
    rotate: Math.floor(Math.random() * 360),
    isCircle: Math.random() > 0.5,
  }));
}

interface ConfettiProps {
  count?: number;
}

export function Confetti({ count = 36 }: ConfettiProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    setPieces(generatePieces(count));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
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
  );
}
