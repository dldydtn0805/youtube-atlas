import type { GameSeasonResultHighlightItem } from '../../../../features/game/types';
import SeasonResultHighlightCopy from './SeasonResultHighlightCopy';

interface Props {
  item: GameSeasonResultHighlightItem;
  label: string;
  onOpen: (item: GameSeasonResultHighlightItem) => void;
  value: string;
}

export default function SeasonResultHighlightCopyButton({ item, label, onOpen, value }: Props) {
  return (
    <button
      className="game-season-result-highlight-card__copy-button"
      onClick={() => onOpen(item)}
      title="순위 추이 차트를 봅니다."
      type="button"
    >
      <SeasonResultHighlightCopy item={item} label={label} value={value} />
    </button>
  );
}
