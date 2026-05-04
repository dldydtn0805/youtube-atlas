import type { GameSeasonResult } from '../../../../features/game/types';

interface Props {
  label: string;
  onOpenRecords?: () => void;
  recordCount?: number;
  result: GameSeasonResult;
}

export default function SeasonResultHeader({ label, onOpenRecords, recordCount = 0, result }: Props) {
  return (
    <div className="game-season-result__head">
      <div>
        <p className="game-season-result__eyebrow">{label}</p>
        <h4 className="game-season-result__title">{result.seasonName}</h4>
        {result.finalTierName ? <p className="game-season-result__tier">{result.finalTierName}</p> : null}
      </div>
      <div className="game-season-result__head-actions">
        <strong className="game-season-result__rank">#{result.finalRank}</strong>
        {onOpenRecords && recordCount > 0 ? (
          <button className="game-season-result__records-button" onClick={onOpenRecords} type="button">
            전체 기록
          </button>
        ) : null}
      </div>
    </div>
  );
}
