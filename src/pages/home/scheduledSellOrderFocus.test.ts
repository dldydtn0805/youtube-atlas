import { describe, expect, it } from 'vitest';
import type { GameScheduledSellOrder } from '../../features/game/types';
import type { OpenGameHolding } from './gameHelpers';
import { getPendingScheduledSellOrdersForHolding } from './scheduledSellOrderFocus';

function createHolding(overrides: Partial<OpenGameHolding> = {}): OpenGameHolding {
  return {
    achievedStrategyTags: [],
    buyRank: 15,
    channelTitle: 'Channel',
    chartOut: false,
    createdAt: '2026-04-24T00:00:00.000Z',
    currentPricePoints: 5000,
    currentRank: 12,
    lockedQuantity: 100,
    nextSellableInSeconds: null,
    positionId: 10,
    profitPoints: 0,
    projectedHighlightScore: 0,
    quantity: 100,
    reservedForSell: true,
    scheduledSellOrderId: 1,
    scheduledSellQuantity: 100,
    scheduledSellTriggerType: 'RANK',
    scheduledSellTargetRank: 10,
    scheduledSellTargetProfitRatePercent: null,
    scheduledSellTriggerDirection: 'RANK_IMPROVES_TO',
    sellableQuantity: 0,
    stakePoints: 5000,
    strategyTags: [],
    targetStrategyTags: [],
    thumbnailUrl: 'https://example.com/a.jpg',
    title: 'Holding Video',
    videoId: 'video-1',
    ...overrides,
  };
}

function createOrder(overrides: Partial<GameScheduledSellOrder> = {}): GameScheduledSellOrder {
  return {
    buyRank: 15,
    canceledAt: null,
    channelTitle: 'Channel',
    createdAt: '2026-04-24T00:00:00.000Z',
    currentRank: 12,
    executedAt: null,
    failureReason: null,
    id: 1,
    pnlPoints: null,
    positionId: 10,
    quantity: 100,
    regionCode: 'KR',
    seasonId: 1,
    sellPricePoints: null,
    settledPoints: null,
    stakePoints: 5000,
    status: 'PENDING',
    triggerType: 'RANK',
    targetRank: 10,
    targetProfitRatePercent: null,
    thumbnailUrl: 'https://example.com/a.jpg',
    triggeredAt: null,
    triggerDirection: 'RANK_IMPROVES_TO',
    updatedAt: '2026-04-24T00:00:00.000Z',
    userId: 1,
    videoId: 'video-1',
    videoTitle: 'Holding Video',
    ...overrides,
  };
}

describe('getPendingScheduledSellOrdersForHolding', () => {
  it('lists only pending orders for the holding position', () => {
    const orders = getPendingScheduledSellOrdersForHolding(
      createHolding(),
      [
        createOrder({ id: 1 }),
        createOrder({ id: 2, status: 'CANCELED' }),
        createOrder({ id: 3, positionId: 11 }),
      ],
    );

    expect(orders.map((order) => order.id)).toEqual([1]);
  });
});
