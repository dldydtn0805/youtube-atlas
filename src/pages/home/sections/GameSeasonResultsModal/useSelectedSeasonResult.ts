import { useEffect, useState } from 'react';
import type { GameSeasonResult } from '../../../../features/game/types';

export default function useSelectedSeasonResult(results: GameSeasonResult[]) {
  const [selectedResultId, setSelectedResultId] = useState(() => results[0]?.id ?? 0);
  const selectedResult = results.find((result) => result.id === selectedResultId) ?? results[0];

  useEffect(() => {
    setSelectedResultId((currentId) => {
      const hasCurrent = results.some((result) => result.id === currentId);

      return hasCurrent ? currentId : results[0]?.id ?? 0;
    });
  }, [results]);

  return { selectedResult, setSelectedResultId };
}
