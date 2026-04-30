import type { GameHighlightStrategyScore } from '../../../../features/game/types';
import {
  formatScorePart,
  formatStrategyScoreLabel,
} from './scoreBreakdownFormat';

interface ScoreBreakdownRowProps {
  score: GameHighlightStrategyScore;
}

export default function ScoreBreakdownRow({ score }: ScoreBreakdownRowProps) {
  return (
    <div className="game-highlight-score-breakdown__row">
      <strong>{formatStrategyScoreLabel(score)}</strong>
      <span>기본 {formatScorePart(score.baseScore)}</span>
      <span>순위 {formatScorePart(score.rankDiffBonus)}</span>
      <span>수익률 {formatScorePart(score.profitRateBonus)}</span>
      <span>수익금 {formatScorePart(score.profitPointsBonus)}</span>
      <b>{formatScorePart(score.totalScore)}</b>
    </div>
  );
}
