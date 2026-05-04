import type { GameSeasonResult } from '../../../../features/game/types';
import Button from './SeasonResultSelectButton';
import Menu from './SeasonResultSelectMenu';
import useSelect from './useSeasonResultSelect';

type Props = {
  onChange: (resultId: number) => void;
  results: GameSeasonResult[];
  selectedResultId: number;
};

export default function SeasonResultSelect({ onChange, results, selectedResultId }: Props) {
  const { isOpen, label, menuId, rootRef, selectResult, toggle } = useSelect({ onChange, results, selectedResultId });

  return (
    <div className="game-season-results-select" ref={rootRef}>
      <span>시즌 선택</span>
      <Button isOpen={isOpen} label={label} menuId={menuId} onClick={toggle} />
      {isOpen ? (
        <Menu
          menuId={menuId}
          onSelect={selectResult}
          results={results}
          selectedResultId={selectedResultId}
        />
      ) : null}
    </div>
  );
}
