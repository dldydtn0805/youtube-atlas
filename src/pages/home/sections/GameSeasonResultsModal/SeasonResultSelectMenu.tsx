import type { GameSeasonResult } from '../../../../features/game/types';
import { getSeasonResultOptionLabel } from './seasonResultOptionLabel';

interface Props {
  menuId: string;
  onSelect: (resultId: number) => void;
  results: GameSeasonResult[];
  selectedResultId: number;
}

export default function SeasonResultSelectMenu({ menuId, onSelect, results, selectedResultId }: Props) {
  return (
    <div className="game-season-results-select__menu" id={menuId} role="listbox">
      {results.map((result) => {
        const isSelected = result.id === selectedResultId;

        return (
          <button
            aria-selected={isSelected}
            className="game-season-results-select__option"
            key={result.id}
            onClick={() => onSelect(result.id)}
            role="option"
            type="button"
          >
            {getSeasonResultOptionLabel(result)}
          </button>
        );
      })}
    </div>
  );
}
