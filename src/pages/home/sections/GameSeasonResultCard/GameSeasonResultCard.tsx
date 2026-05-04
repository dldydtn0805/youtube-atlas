import type { GameSeasonResult } from '../../../../features/game/types';
import SeasonResultBest from './SeasonResultBest';
import SeasonResultStats from './SeasonResultStats';
import './layout.css';
import './stats.css';

interface GameSeasonResultCardProps {
  result?: GameSeasonResult | null;
}

export default function GameSeasonResultCard({ result }: GameSeasonResultCardProps) {
  if (!result) {
    return null;
  }

  return (
    <section className="game-season-result" aria-label="지난 시즌 결과">
      <div className="game-season-result__head">
        <div>
          <p className="game-season-result__eyebrow">지난 시즌 결과</p>
          <h4 className="game-season-result__title">{result.seasonName}</h4>
        </div>
        <strong className="game-season-result__rank">#{result.finalRank}</strong>
      </div>
      <SeasonResultStats result={result} />
      <SeasonResultBest result={result} />
    </section>
  );
}
