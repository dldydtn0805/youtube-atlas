import type { GameSeasonResultHighlightItem as Item } from '../../../../features/game/types';

export function formatHighlightMove(item?: Item | null) {
  if (!item || typeof item.rankDiff !== 'number') return '집계 중';
  return item.rankDiff > 0 ? `+${item.rankDiff}계단` : `${item.rankDiff}계단`;
}

export function formatHighlightHold(seconds?: number | null) {
  if (typeof seconds !== 'number' || seconds <= 0) return '집계 중';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}일 ${hours}시간`;
  return hours > 0 ? `${hours}시간` : `${Math.floor(seconds / 60)}분`;
}

export function formatHighlightScore(score?: number | null) {
  return typeof score === 'number' ? `+${score.toLocaleString('ko-KR')}점` : '집계 중';
}
