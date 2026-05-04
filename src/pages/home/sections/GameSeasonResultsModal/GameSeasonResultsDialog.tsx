import type { HTMLAttributes } from 'react';
import type { GameSeasonResult } from '../../../../features/game/types';
import GameSeasonResultsList from './GameSeasonResultsList';

interface Props {
  bodySwipeHandlers: HTMLAttributes<HTMLElement>;
  headerSwipeHandlers: HTMLAttributes<HTMLElement>;
  onClose: () => void;
  results: GameSeasonResult[];
}

export default function GameSeasonResultsDialog({
  bodySwipeHandlers,
  headerSwipeHandlers,
  onClose,
  results,
}: Props) {
  return (
    <>
      <div className="app-shell__modal-header app-shell__modal-header--swipe-close" {...headerSwipeHandlers}>
        <div className="app-shell__section-heading">
          <p className="app-shell__section-eyebrow">Season Records</p>
          <h2 className="app-shell__section-title" id="game-season-results-modal-title">
            시즌 기록
          </h2>
        </div>
        <button aria-label="시즌 기록 모달 닫기" className="app-shell__modal-close" onClick={onClose} type="button">
          닫기
        </button>
      </div>
      <div className="app-shell__modal-body game-season-results-modal__body" {...bodySwipeHandlers}>
        <GameSeasonResultsList results={results} />
      </div>
    </>
  );
}
