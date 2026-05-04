import type { GameSeasonResult } from '../../../../features/game/types';
import SeasonResultHighlightTile from './SeasonResultHighlightTile';
import { getSeasonResultHighlightCards } from './seasonResultHighlightCards';

export default function SeasonResultHighlights({ result }: { result: GameSeasonResult }) {
  const cards = getSeasonResultHighlightCards(result.highlights);
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="game-season-result-highlights" aria-label="지난 시즌 하이라이트">
      <div className="game-season-result-highlights__list">
        {cards.map((card) => (
          <SeasonResultHighlightTile key={card.key} item={card.item} label={card.label} value={card.value} />
        ))}
      </div>
    </section>
  );
}
