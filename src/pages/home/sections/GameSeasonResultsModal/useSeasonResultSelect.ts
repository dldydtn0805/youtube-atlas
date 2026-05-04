import type { GameSeasonResult } from '../../../../features/game/types';
import { getSeasonResultOptionLabel } from './seasonResultOptionLabel';
import useSeasonResultDropdown from './useSeasonResultDropdown';

interface Params {
  onChange: (resultId: number) => void;
  results: GameSeasonResult[];
  selectedResultId: number;
}

export default function useSeasonResultSelect({ onChange, results, selectedResultId }: Params) {
  const dropdown = useSeasonResultDropdown();
  const selected = results.find(({ id }) => id === selectedResultId) ?? results[0];

  const selectResult = (resultId: number) => {
    onChange(resultId);
    dropdown.close();
  };

  return {
    ...dropdown,
    label: getSeasonResultOptionLabel(selected),
    selectResult,
  };
}
