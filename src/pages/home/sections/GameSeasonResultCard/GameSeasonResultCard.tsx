import type { GameSeasonResult } from '../../../../features/game/types';
import SeasonResultHeader from './SeasonResultHeader';
import SeasonResultBest from './SeasonResultBest';
import SeasonResultStats from './SeasonResultStats';
import './layout.css';
import './stats.css';

interface GameSeasonResultCardProps {
  label?: string;
  onOpenRecords?: () => void;
  recordCount?: number;
  result?: GameSeasonResult | null;
}

export default function GameSeasonResultCard({
  label = '지난 시즌 결과',
  onOpenRecords,
  recordCount,
  result,
}: GameSeasonResultCardProps) {
  if (!result) {
    return null;
  }

  return (
    <section className="game-season-result" aria-label={label}>
      <SeasonResultHeader
        label={label}
        onOpenRecords={onOpenRecords}
        recordCount={recordCount}
        result={result}
      />
      <SeasonResultStats result={result} />
      <SeasonResultBest result={result} />
    </section>
  );
}
