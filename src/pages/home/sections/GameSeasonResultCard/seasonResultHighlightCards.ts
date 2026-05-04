import type { GameSeasonResultHighlightItem as Item, GameSeasonResultHighlights as Highlights } from '../../../../features/game/types';
import { formatHighlightHold, formatHighlightMove } from './seasonResultHighlightFormat';

type Card = { item: Item; key: string; label: string; value: string };
const card = (item: Item, key: string, label: string, value: string): Card => ({ item, key, label, value });

export function getSeasonResultHighlightCards(h: Highlights | null | undefined) {
  if (!h) return [];
  const riser = h.topRankRiser;
  const tagged = h.mostTaggedPositions?.[0];
  const held = h.longestHeld;
  return [
    riser && card(riser, 'riser', '순위 상승왕', formatHighlightMove(riser)),
    tagged && card(tagged, `tagged-${tagged.positionId}`, '태그 최다', `${tagged.tagCount ?? tagged.strategyTags.length}태그`),
    held && card(held, 'held', '최장 보유', formatHighlightHold(held.holdDurationSeconds)),
  ].filter(Boolean) as Card[];
}
