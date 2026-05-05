import type { GameStrategyType, ScheduledSellTriggerType } from '../../features/game/types';
import { GAME_ORDER_QUANTITY_STEP, normalizeGameOrderCapacity } from './gameHelpers';

export interface ScheduledSellStrategyPreset {
  triggerType: ScheduledSellTriggerType;
  targetRank: number | null;
  targetProfitRatePercent: number | null;
}

const TARGET_RANK_BY_STRATEGY: Partial<Record<GameStrategyType, number>> = {
  ATLAS_SHOT: 1,
  GALAXY_SHOT: 5,
  MOONSHOT: 50,
  SNIPE: 100,
  SOLAR_SHOT: 20,
};

const CASHOUT_PROFIT_RATE_BY_STRATEGY: Partial<Record<GameStrategyType, number>> = {
  BIG_CASHOUT: 1000,
  SMALL_CASHOUT: 300,
};

export function getScheduledSellTargetRankForStrategy(strategyType: GameStrategyType) {
  return TARGET_RANK_BY_STRATEGY[strategyType] ?? null;
}

export function getScheduledSellPresetForStrategy(
  strategyType: GameStrategyType,
): ScheduledSellStrategyPreset | null {
  const targetRank = getScheduledSellTargetRankForStrategy(strategyType);
  if (targetRank !== null) {
    return { targetProfitRatePercent: null, targetRank, triggerType: 'RANK' };
  }

  const targetProfitRatePercent = CASHOUT_PROFIT_RATE_BY_STRATEGY[strategyType];
  return typeof targetProfitRatePercent === 'number'
    ? { targetProfitRatePercent, targetRank: null, triggerType: 'PROFIT_RATE' }
    : null;
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
