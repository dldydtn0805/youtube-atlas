import { formatPercent, formatPoints } from '../../gameHelpers';

export function formatScore(score: number) {
  return formatPoints(score).replace(/P$/, '점');
}

export function formatSignedPercent(value?: number | null) {
  if (typeof value !== 'number') {
    return '집계 중';
  }

  if (value > 0) {
    return `+${formatPercent(value)}`;
  }

  if (value < 0) {
    return `-${formatPercent(Math.abs(value))}`;
  }

  return formatPercent(0);
}
