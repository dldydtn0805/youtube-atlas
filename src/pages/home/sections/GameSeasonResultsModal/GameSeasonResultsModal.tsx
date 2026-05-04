import { createPortal } from 'react-dom';
import type { GameSeasonResult } from '../../../../features/game/types';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';
import useHeaderSwipeToClose from '../../hooks/useHeaderSwipeToClose';
import { getFullscreenElement } from '../../utils';
import GameSeasonResultsDialog from './GameSeasonResultsDialog';
import './GameSeasonResultsModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  results: GameSeasonResult[];
}

export default function GameSeasonResultsModal({ isOpen, onClose, results }: Props) {
  useBodyScrollLock(isOpen);
  const swipe = useHeaderSwipeToClose({ disabled: !isOpen, onClose });

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  const portalTarget = getFullscreenElement();
  const container = portalTarget instanceof HTMLElement ? portalTarget : document.body;

  return createPortal(
    <div className="app-shell__modal-backdrop" onClick={onClose} role="presentation" style={swipe.backdropStyle}>
      <section
        aria-labelledby="game-season-results-modal-title"
        aria-modal="true"
        className="app-shell__modal game-season-results-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        style={swipe.modalStyle}
      >
        <GameSeasonResultsDialog
          bodySwipeHandlers={swipe.bodySwipeHandlers}
          headerSwipeHandlers={swipe.headerSwipeHandlers}
          onClose={onClose}
          results={results}
        />
      </section>
    </div>,
    container,
  );
}
