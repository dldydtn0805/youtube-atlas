import type { GameSeasonResultHighlightItem } from '../../../../features/game/types';
import { buildGameStrategyBadges } from '../../gameStrategyTags';

export default function SeasonResultHighlightBadges({ item }: { item: GameSeasonResultHighlightItem }) {
  const badges = buildGameStrategyBadges(item.strategyTags).slice(0, 5);
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="game-season-result-highlight-card__tags">
      {badges.map((badge) => (
        <span
          key={`${item.positionId}-${badge.type}`}
          className="app-shell__game-highlight-tag"
          data-tone={badge.tone}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
