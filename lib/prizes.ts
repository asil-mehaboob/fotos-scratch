import { Gift, CreditCard, Tag, Truck, Clover, type Icon } from "@phosphor-icons/react";

export interface Prize {
  id: number;
  label: string;
  Icon: Icon;
  probability: number;
}

export const PRIZES: Prize[] = [
  { id: 1, label: "₹500 Voucher",          Icon: Gift,       probability: 0.05 },
  { id: 2, label: "₹100 Voucher",          Icon: CreditCard, probability: 0.15 },
  { id: 3, label: "10% Off",               Icon: Tag,        probability: 0.30 },
  { id: 4, label: "Free Shipping",         Icon: Truck,      probability: 0.25 },
  { id: 5, label: "Better Luck Next Time", Icon: Clover,     probability: 0.25 },
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
