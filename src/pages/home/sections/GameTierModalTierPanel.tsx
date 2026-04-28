import { memo } from 'react';
import type { GameTierProgress } from '../../../features/game/types';
import GameTierSummary from './GameTierSummary';

interface GameTierModalTierPanelProps {
  isTierProgressLoading: boolean;
  tierProgress?: GameTierProgress;
}

const GameTierModalTierPanel = memo(function GameTierModalTierPanel({
  isTierProgressLoading,
  tierProgress,
}: GameTierModalTierPanelProps) {
  return (
    <div className="app-shell__modal-fields">
      {tierProgress || isTierProgressLoading ? (
        <section
          className="app-shell__modal-field app-shell__modal-field--tier app-shell__tier-modal-card-shell"
          data-loading={isTierProgressLoading}
        >
          {tierProgress ? (
            <GameTierSummary
              progress={tierProgress}
              showLadder={false}
              surfaceVariant="highlight-tier"
              title=""
            />
          ) : null}
          {isTierProgressLoading ? (
            <div className="app-shell__tier-modal-card-overlay" role="status" aria-live="polite">
              <span className="app-shell__tier-modal-card-spinner" aria-hidden="true" />
              <span className="sr-only">티어 카드 불러오는 중</span>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
});

export default GameTierModalTierPanel;
