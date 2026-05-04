import type { GameSeasonResult } from '../../../../features/game/types';
import { formatPoints, formatSeasonDateTime } from '../../gameHelpers';

export default function SeasonResultBest({ result }: { result: GameSeasonResult }) {
  const rankMove =
    typeof result.bestPositionBuyRank === 'number' && typeof result.bestPositionSellRank === 'number'
      ? ` · #${result.bestPositionBuyRank} -> #${result.bestPositionSellRank}`
      : '';

  return (
    <div className="game-season-result__best">
      {result.bestPositionThumbnailUrl ? (
        <img alt="" className="game-season-result__thumb" src={result.bestPositionThumbnailUrl} />
      ) : null}
      <div>
        <p className="game-season-result__best-label">최고 수익 영상</p>
        <p className="game-season-result__best-title">{result.bestPositionTitle ?? '기록 없음'}</p>
        <p className="game-season-result__meta">
          {formatSeasonDateTime(result.seasonEndAt)}
          {typeof result.bestPositionProfitPoints === 'number'
            ? ` · ${formatPoints(result.bestPositionProfitPoints)}`
            : ''}
          {rankMove}
        </p>
      </div>
    </div>
  );
}
