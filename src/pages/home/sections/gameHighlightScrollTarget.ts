import type { GameHighlight } from '../../../features/game/types';

export interface GameHighlightScrollTarget {
  positionId?: number | null;
  videoId?: string | null;
}

export function matchesGameHighlightScrollTarget(
  highlight: GameHighlight,
  target: GameHighlightScrollTarget | null,
) {
  if (!target) {
    return false;
  }

  if (target.positionId != null) {
    return highlight.positionId === target.positionId;
  }

  return Boolean(target.videoId) && highlight.videoId === target.videoId;
}
