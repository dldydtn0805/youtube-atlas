import type { GameSeasonResult } from '../../../../features/game/types';
import SeasonResultProfileAvatar from './SeasonResultProfileAvatar';
import { formatScore } from './seasonResultFormat';

interface Props {
  profileImageUrl?: string | null;
  profileLabel?: string | null;
  result: GameSeasonResult;
}

export default function SeasonResultTierCard({ profileImageUrl, profileLabel, result }: Props) {
  return (
    <section
      aria-label="해당 시즌 최종 티어"
      className="game-season-result-tier-card"
      data-tier-code={result.finalTierCode ?? undefined}
    >
      <SeasonResultProfileAvatar
        imageUrl={profileImageUrl}
        label={profileLabel}
        tierName={result.finalTierName}
      />
      <div className="game-season-result-tier-card__copy">
        <span>Coverage Rating</span>
        <strong>{result.finalTierName ?? '티어 집계중'}</strong>
      </div>
      <div className="game-season-result-tier-card__score">
        <span>Highlight Score</span>
        <strong>{formatScore(result.finalHighlightScore)}</strong>
      </div>
    </section>
  );
}
