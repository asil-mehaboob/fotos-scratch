export type CouponTier = "JACKPOT" | "GOLD" | "SILVER" | "BRONZE";

export interface PrizeConfig {
  id: number;
  label: string;
  probability: number;
  tier: CouponTier | null;
  eligibilityNote: string | null;
}

export const PRIZE_CONFIGS: PrizeConfig[] = [
  {
    id: 1,
    tier: "JACKPOT",
    label: "1 Year Free Subscription",
    probability: 0.01,
    eligibilityNote: "Valid for Prime & Focal plans only • Fully free for 12 months",
  },
  {
    id: 2,
    tier: "GOLD",
    label: "6 Months Free on Annual Plan",
    probability: 0.04,
    eligibilityNote: "Valid for Prime & Focal plans • First 6 months free, then billed annually",
  },
  {
    id: 3,
    tier: "SILVER",
    label: "40% Off Your Plan",
    probability: 0.20,
    eligibilityNote: "Valid for all plans • Yearly or half-yearly billing only",
  },
  {
    id: 4,
    tier: "BRONZE",
    label: "Prime at ₹589/month for 1 Year",
    probability: 0.35,
    eligibilityNote: "Valid for Prime plan • Annual or half-yearly • ₹589/month locked for 12 months",
  },
  {
    id: 5,
    tier: null,
    label: "Better Luck Next Time",
    probability: 0.40,
    eligibilityNote: null,
  },
];

export function pickPrizeConfig(excludeTiers: CouponTier[] = []): PrizeConfig {
  const pool = excludeTiers.length
    ? PRIZE_CONFIGS.filter((p) => !p.tier || !excludeTiers.includes(p.tier))
    : PRIZE_CONFIGS;

  const total = pool.reduce((sum, p) => sum + p.probability, 0);
  const rand = Math.random() * total;
  let cumulative = 0;
  for (const p of pool) {
    cumulative += p.probability;
    if (rand < cumulative) return p;
  }
  return pool[pool.length - 1];
}
