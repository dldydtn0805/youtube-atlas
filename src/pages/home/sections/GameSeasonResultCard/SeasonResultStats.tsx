import type { GameSeasonResult } from '../../../../features/game/types';
import { formatPoints } from '../../gameHelpers';

interface SeasonResultStatsProps {
  result: GameSeasonResult;
}

export default function SeasonResultStats({ result }: SeasonResultStatsProps) {
  return (
    <dl className="game-season-result__stats">
      <div>
        <dt>최종 자산</dt>
        <dd>{formatPoints(result.finalAssetPoints)}</dd>
      </div>
      <div>
        <dt>실현 손익</dt>
        <dd data-tone={result.realizedPnlPoints >= 0 ? 'gain' : 'loss'}>
          {formatPoints(result.realizedPnlPoints)}
        </dd>
      </div>
      <div>
        <dt>거래 포지션</dt>
        <dd>{result.positionCount.toLocaleString('ko-KR')}개</dd>
      </div>
    </dl>
  );
}
