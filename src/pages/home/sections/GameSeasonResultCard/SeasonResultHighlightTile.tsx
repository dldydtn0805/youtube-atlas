import type { GameSeasonResultHighlightItem } from '../../../../features/game/types';
import SeasonResultHighlightCopyButton from './SeasonResultHighlightCopyButton';
import SeasonResultHighlightCopy from './SeasonResultHighlightCopy';
import SeasonResultHighlightThumb from './SeasonResultHighlightThumb';
import SeasonResultHighlightThumbButton from './SeasonResultHighlightThumbButton';

interface Props {
  item: GameSeasonResultHighlightItem;
  label: string;
  onOpenChart?: (item: GameSeasonResultHighlightItem) => void;
  onPlayVideo?: (item: GameSeasonResultHighlightItem) => void;
  value: string;
}

export default function SeasonResultHighlightTile({ item, label, onOpenChart, onPlayVideo, value }: Props) {
  const copy = <SeasonResultHighlightCopy item={item} label={label} value={value} />;
  return (
    <article className="game-season-result-highlight-card">
      {onPlayVideo ? (
        <SeasonResultHighlightThumbButton item={item} onPlay={onPlayVideo} />
      ) : (
        <SeasonResultHighlightThumb src={item.thumbnailUrl} />
      )}
      {onOpenChart ? (
        <SeasonResultHighlightCopyButton item={item} label={label} onOpen={onOpenChart} value={value} />
      ) : copy}
    </article>
  );
}
