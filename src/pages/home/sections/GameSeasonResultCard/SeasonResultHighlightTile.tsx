import type { GameSeasonResultHighlightItem } from '../../../../features/game/types';
import SeasonResultHighlightBadges from './SeasonResultHighlightBadges';
import SeasonResultHighlightMeta from './SeasonResultHighlightMeta';
import SeasonResultHighlightThumb from './SeasonResultHighlightThumb';

interface Props {
  item: GameSeasonResultHighlightItem;
  label: string;
  value: string;
}

export default function SeasonResultHighlightTile({ item, label, value }: Props) {
  return (
    <article className="game-season-result-highlight-card">
      <SeasonResultHighlightThumb src={item.thumbnailUrl} />
      <div className="game-season-result-highlight-card__copy">
        <span>{`${label} · ${value}`}</span>
        <strong>{item.title}</strong>
        <p>{item.channelTitle}</p>
        <SeasonResultHighlightMeta item={item} />
        <SeasonResultHighlightBadges item={item} />
      </div>
    </article>
  );
}
