export interface Prize {
  id: number;
  label: string;
  emoji: string;
  probability: number;
}

export const PRIZES: Prize[] = [
  { id: 1, label: "₹500 Voucher",          emoji: "🎁",  probability: 0.05 },
  { id: 2, label: "₹100 Voucher",          emoji: "💳",  probability: 0.15 },
  { id: 3, label: "10% Off",               emoji: "🏷️",  probability: 0.30 },
  { id: 4, label: "Free Shipping",         emoji: "🚚",  probability: 0.25 },
  { id: 5, label: "Better Luck Next Time", emoji: "🍀",  probability: 0.25 },
];

export function pickPrize(): Prize {
  const rand = Math.random();
  let cumulative = 0;
  for (const prize of PRIZES) {
    cumulative += prize.probability;
    if (rand < cumulative) return prize;
  }
  return PRIZES[PRIZES.length - 1];
}
