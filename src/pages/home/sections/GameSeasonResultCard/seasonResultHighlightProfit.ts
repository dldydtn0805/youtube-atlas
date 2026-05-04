import type { GameSeasonResultHighlightItem as Item } from '../../../../features/game/types';
import { formatPoints } from '../../gameHelpers';

export function formatSignedHighlightPoints(item: Item) {
  if (typeof item.profitPoints !== 'number') return '집계 중';
  if (item.profitPoints > 0) return `+${formatPoints(item.profitPoints)}`;
  if (item.profitPoints < 0) return `-${formatPoints(Math.abs(item.profitPoints))}`;
  return '0P';
}

export function formatSignedHighlightRate(item: Item) {
  if (typeof item.profitRatePercent !== 'number') return '집계 중';
  return `${item.profitRatePercent > 0 ? '+' : ''}${item.profitRatePercent.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}%`;
}
