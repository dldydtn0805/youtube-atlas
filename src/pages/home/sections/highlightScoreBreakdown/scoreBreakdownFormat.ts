import type { GameHighlightStrategyScore, GameStrategyType } from '../../../../features/game/types';

const strategyLabels: Record<GameStrategyType, string> = {
  ATLAS_SHOT: '아틀라스 샷',
  GALAXY_SHOT: '갤럭시 샷',
  SOLAR_SHOT: '솔라 샷',
  MOONSHOT: '문샷',
  SMALL_CASHOUT: '스몰 캐시아웃',
  BIG_CASHOUT: '빅 캐시아웃',
  SNIPE: '스나이프',
};

export function formatScorePart(score: number) {
  return `+${score.toLocaleString('ko-KR')}점`;
}

export function formatStrategyScoreLabel(score: GameHighlightStrategyScore) {
  return strategyLabels[score.strategyType] ?? '하이라이트';
}
