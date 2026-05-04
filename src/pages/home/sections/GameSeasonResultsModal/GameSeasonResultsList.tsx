import type { GameSeasonResult } from '../../../../features/game/types';
import GameSeasonResultCard from '../GameSeasonResultCard/GameSeasonResultCard';

interface Props {
  results: GameSeasonResult[];
}

export default function GameSeasonResultsList({ results }: Props) {
  if (results.length === 0) {
    return <p className="game-season-results-modal__empty">아직 종료된 시즌 기록이 없어요.</p>;
  }

  return (
    <ol className="game-season-results-modal__list">
      {results.map((result, index) => (
        <li key={result.id}>
          <GameSeasonResultCard
            label={index === 0 ? '최근 종료 시즌' : '시즌 기록'}
            result={result}
          />
        </li>
      ))}
    </ol>
  );
}
