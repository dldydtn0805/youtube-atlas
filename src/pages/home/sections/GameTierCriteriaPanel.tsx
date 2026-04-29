import GameTierGuide from './GameTierGuide';
import type { GameTierProgress } from '../../../features/game/types';

interface GameTierCriteriaPanelProps {
  tierProgress?: GameTierProgress;
}

export default function GameTierCriteriaPanel({ tierProgress }: GameTierCriteriaPanelProps) {
  return (
    <div className="app-shell__modal-fields">
      <GameTierGuide tiers={tierProgress?.tiers} />
    </div>
  );
}
