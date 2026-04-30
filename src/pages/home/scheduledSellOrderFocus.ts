import type { GameScheduledSellOrder } from '../../features/game/types';
import type { OpenGameHolding } from './gameHelpers';

export function getPendingScheduledSellOrdersForHolding(
  holding: OpenGameHolding,
  orders: GameScheduledSellOrder[],
) {
  return orders.filter((order) => order.status === 'PENDING' && order.positionId === holding.positionId);
}
