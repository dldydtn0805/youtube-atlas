import type { GameSeasonResultHighlightItem as Item } from '../../../../features/game/types';
import { getPointTone } from '../../gameHelpers';
import { formatSignedHighlightPoints, formatSignedHighlightRate } from './seasonResultHighlightProfit';

export default function SeasonResultHighlightProfitMeta({ item }: { item: Item }) {
  const tone = getPointTone(item.profitPoints);
  return (
    <>
      <span>손익금</span> <b data-tone={tone}>{formatSignedHighlightPoints(item)}</b>
      {' · '}
      <span>손익률</span> <b data-tone={tone}>{formatSignedHighlightRate(item)}</b>
    </>
  );
}
