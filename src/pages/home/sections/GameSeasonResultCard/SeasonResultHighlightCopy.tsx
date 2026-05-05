import type { GameSeasonResultHighlightItem } from '../../../../features/game/types';
import SeasonResultHighlightBadges from './SeasonResultHighlightBadges';
import SeasonResultHighlightMeta from './SeasonResultHighlightMeta';

interface Props {
  item: GameSeasonResultHighlightItem;
  label: string;
  value: string;
}

export default function SeasonResultHighlightCopy({ item, label, value }: Props) {
  return (
    <div className="game-season-result-highlight-card__copy">
      <span>{`${label} · ${value}`}</span>
      <strong>{item.title}</strong>
      <p>{item.channelTitle}</p>
      <SeasonResultHighlightMeta item={item} />
      <SeasonResultHighlightBadges item={item} />
    </div>
  );
}
