import ThumbnailPlayOverlay from '../../../../components/ThumbnailPlayOverlay/ThumbnailPlayOverlay';
import type { GameSeasonResultHighlightItem } from '../../../../features/game/types';
import SeasonResultHighlightThumb from './SeasonResultHighlightThumb';

interface Props {
  item: GameSeasonResultHighlightItem;
  onPlay: (item: GameSeasonResultHighlightItem) => void;
}

export default function SeasonResultHighlightThumbButton({ item, onPlay }: Props) {
  return (
    <button
      aria-label={`${item.title} 재생`}
      className="game-season-result-highlight-card__thumb-button thumbnail-play-overlay-host thumbnail-play-overlay-host--sm"
      onClick={() => onPlay(item)}
      type="button"
    >
      <SeasonResultHighlightThumb src={item.thumbnailUrl} />
      <ThumbnailPlayOverlay />
    </button>
  );
}
