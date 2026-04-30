import type { KeyboardEvent, MouseEvent } from 'react';
import { formatGameQuantity, type OpenGameHolding } from '../gameHelpers';

interface RankingGameReservedSellBadgeProps {
  holding: OpenGameHolding;
  onOpenScheduledSellOrder?: (holding: OpenGameHolding) => void;
}

export default function RankingGameReservedSellBadge({
  holding,
  onOpenScheduledSellOrder,
}: RankingGameReservedSellBadgeProps) {
  if (!holding.reservedForSell) {
    return null;
  }

  const label = `${formatGameQuantity(Math.max(holding.scheduledSellQuantity, 1))} 예약 중`;
  const canOpenScheduledOrder = Boolean(onOpenScheduledSellOrder && holding.scheduledSellOrderId);

  if (!canOpenScheduledOrder) {
    return (
      <span className="app-shell__game-position-trend" data-tone="info">
        {label}
      </span>
    );
  }

  const stopNestedAction = (event: KeyboardEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <button
      aria-label={`${holding.title} 예약 매도 대기열로 이동`}
      className="app-shell__game-position-trend app-shell__game-position-trend-button"
      data-tone="info"
      onClick={(event) => {
        stopNestedAction(event);
        onOpenScheduledSellOrder?.(holding);
      }}
      onKeyDown={stopNestedAction}
      title="대기열에서 예약 주문 보기"
      type="button"
    >
      {label}
    </button>
  );
}
