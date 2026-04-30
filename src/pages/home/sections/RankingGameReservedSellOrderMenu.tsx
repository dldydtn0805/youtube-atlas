import { forwardRef, type CSSProperties } from 'react';
import type { GameScheduledSellOrder } from '../../../features/game/types';
import {
  formatGameOrderQuantity,
  formatGameTimestamp,
  formatRank,
} from '../gameHelpers';

interface RankingGameReservedSellOrderMenuProps {
  holdingTitle: string;
  isCancelingOrderId?: number | null;
  orders: GameScheduledSellOrder[];
  onCancelOrder: (orderId: number) => void;
  style?: CSSProperties;
}

function getConditionLabel(order: GameScheduledSellOrder) {
  return order.triggerDirection === 'RANK_DROPS_TO'
    ? `${formatRank(order.targetRank)} 이하 이탈`
    : `${formatRank(order.targetRank)} 이내 진입`;
}

const RankingGameReservedSellOrderMenu = forwardRef<HTMLSpanElement, RankingGameReservedSellOrderMenuProps>(
function RankingGameReservedSellOrderMenu({
  holdingTitle,
  isCancelingOrderId = null,
  orders,
  onCancelOrder,
  style,
}, ref) {
  return (
    <span ref={ref} className="app-shell__game-reserved-sell-menu" role="menu" style={style}>
      {orders.map((order) => {
        const isCanceling = isCancelingOrderId === order.id;

        return (
          <button
            key={order.id}
            aria-label={`${holdingTitle} 예약 주문 ${order.id} 취소`}
            className="app-shell__game-reserved-sell-option"
            disabled={isCanceling}
            onClick={(event) => {
              event.stopPropagation();
              onCancelOrder(order.id);
            }}
            onKeyDown={(event) => event.stopPropagation()}
            role="menuitem"
            type="button"
          >
            <span className="app-shell__game-reserved-sell-option-title">
              {getConditionLabel(order)}
            </span>
            <span className="app-shell__game-reserved-sell-option-meta">
              {formatGameOrderQuantity(order.quantity)} · {formatGameTimestamp(order.createdAt)}
            </span>
            <span className="app-shell__game-reserved-sell-option-action">
              {isCanceling ? '취소 중' : '예약 취소'}
            </span>
          </button>
        );
      })}
    </span>
  );
});

export default RankingGameReservedSellOrderMenu;
