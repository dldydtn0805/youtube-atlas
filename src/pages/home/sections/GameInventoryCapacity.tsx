import { getGameInventoryNextTierText } from '../../../features/game/inventory';
import type { GameCurrentSeason } from '../../../features/game/types';

interface GameInventoryCapacityProps {
  currentGameSeason?: GameCurrentSeason | null;
  maxOpenPositions?: number | null;
  openDistinctVideoCount: number;
}

export default function GameInventoryCapacity({
  currentGameSeason = null,
  maxOpenPositions: max = null,
  openDistinctVideoCount: used,
}: GameInventoryCapacityProps) {
  const remaining = typeof max === 'number' ? Math.max(0, max - used) : null;
  const nextTierText = getGameInventoryNextTierText(currentGameSeason);
  const percent =
    typeof max === 'number' && max > 0
      ? Math.min((used / max) * 100, 100)
      : 0;

  return (
    <section className="app-shell__game-inventory-capacity" aria-label="슬롯 사용량">
      <span className="app-shell__game-inventory-capacity-row">
        <span className="app-shell__game-inventory-capacity-remaining">
          {remaining !== null ? `남은 슬롯 ${remaining}개` : '슬롯 집계 중'}
        </span>
        <span className="app-shell__game-inventory-capacity-count">
          {`${used}/${max ?? '-'}`}
        </span>
      </span>
      {nextTierText ? (
        <span className="app-shell__game-inventory-capacity-next">{nextTierText}</span>
      ) : null}
      <span className="app-shell__game-panel-metric-meter" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </span>
    </section>
  );
}
