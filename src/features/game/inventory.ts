import type { GameCurrentSeason } from './types';

type SeasonSlotSource = Pick<GameCurrentSeason, 'inventorySlots' | 'maxOpenPositions'>;

export function getGameInventorySlotLimit(season?: SeasonSlotSource | null) {
  return season?.inventorySlots?.totalSlots ?? season?.maxOpenPositions ?? 0;
}

export function getGameInventoryNextTierText(season?: SeasonSlotSource | null) {
  const nextTier = season?.inventorySlots?.nextTier;

  if (!nextTier) {
    return null;
  }

  return `${nextTier.displayName} 달성 시 ${nextTier.inventorySlots}칸`;
}
