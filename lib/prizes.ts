import { Crown, Star, Tag, CurrencyInr, type Icon } from "@phosphor-icons/react";
import { PRIZE_CONFIGS, type PrizeConfig } from "./prizes-config";

export interface Prize extends PrizeConfig {
  Icon: Icon;
}

const ICON_MAP: Record<number, Icon> = {
  1: Crown,       // JACKPOT
  2: Star,        // GOLD
  3: Tag,         // SILVER
  4: CurrencyInr, // BRONZE
};

export const PRIZES: Prize[] = PRIZE_CONFIGS.map((p) => ({
  ...p,
  Icon: ICON_MAP[p.id],
}));

export function getPrizeById(id: number): Prize | undefined {
  return PRIZES.find((p) => p.id === id);
}
