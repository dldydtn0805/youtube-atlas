import type { GameStrategyType } from '../../features/game/types';
import { GAME_ORDER_QUANTITY_STEP, normalizeGameOrderCapacity } from './gameHelpers';

const TARGET_RANK_BY_STRATEGY: Partial<Record<GameStrategyType, number>> = {
  ATLAS_SHOT: 1,
  GALAXY_SHOT: 5,
  MOONSHOT: 50,
  SNIPE: 100,
  SOLAR_SHOT: 20,
};

export function getScheduledSellTargetRankForStrategy(strategyType: GameStrategyType) {
  return TARGET_RANK_BY_STRATEGY[strategyType] ?? null;
}

export function getScheduledSellHalfQuantity(maxQuantity: number) {
  const normalizedMaxQuantity = normalizeGameOrderCapacity(maxQuantity);

  if (normalizedMaxQuantity <= 0) {
    return 0;
  }

  return Math.max(
    GAME_ORDER_QUANTITY_STEP,
    Math.ceil(normalizedMaxQuantity * 0.5 / GAME_ORDER_QUANTITY_STEP) * GAME_ORDER_QUANTITY_STEP,
  );
}
