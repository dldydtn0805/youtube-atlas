import type { GameSeasonResult, GameSeasonResultHighlightItem } from '../../../../features/game/types';
import GameSeasonResultCard from '../GameSeasonResultCard/GameSeasonResultCard';
import SeasonResultSelect from './SeasonResultSelect';
import useSelectedSeasonResult from './useSelectedSeasonResult';

interface Props {
  profileImageUrl?: string | null;
  profileLabel?: string | null;
  onOpenHighlightChart?: (result: GameSeasonResult, item: GameSeasonResultHighlightItem) => void;
  onPlayHighlightVideo?: (item: GameSeasonResultHighlightItem) => void;
  results: GameSeasonResult[];
}

export default function SeasonResultPickerPanel({
  onOpenHighlightChart,
  onPlayHighlightVideo,
  profileImageUrl,
  profileLabel,
  results,
}: Props) {
  const { selectedResult, setSelectedResultId } = useSelectedSeasonResult(results);

  if (!selectedResult) {
    return <p className="game-season-results-modal__empty">아직 종료된 시즌 기록이 없어요.</p>;
  }

  return (
    <div className="game-season-results-picker">
      <SeasonResultSelect onChange={setSelectedResultId} results={results} selectedResultId={selectedResult.id} />
      <GameSeasonResultCard
        label="선택한 시즌"
        onOpenHighlightChart={onOpenHighlightChart}
        onPlayHighlightVideo={onPlayHighlightVideo}
        profileImageUrl={profileImageUrl}
        profileLabel={profileLabel}
        result={selectedResult}
      />
    </div>
  );
}
