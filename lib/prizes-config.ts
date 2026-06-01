export interface PrizeConfig {
  id: number;
  label: string;
  probability: number;
}

export const PRIZE_CONFIGS: PrizeConfig[] = [
  { id: 1, label: "₹500 Voucher",          probability: 0.05 },
  { id: 2, label: "₹100 Voucher",          probability: 0.15 },
  { id: 3, label: "10% Off",               probability: 0.30 },
  { id: 4, label: "Free Shipping",         probability: 0.25 },
  { id: 5, label: "Better Luck Next Time", probability: 0.25 },
];

export function pickPrizeConfig(): PrizeConfig {
  const rand = Math.random();
  let cumulative = 0;
  for (const p of PRIZE_CONFIGS) {
    cumulative += p.probability;
    if (rand < cumulative) return p;
  }
  return PRIZE_CONFIGS[PRIZE_CONFIGS.length - 1];
}
