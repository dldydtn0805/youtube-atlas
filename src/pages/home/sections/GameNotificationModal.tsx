import { createPortal } from 'react-dom';
import type { GameNotification } from '../../../features/game/types';
import { formatPoints } from '../gameHelpers';
import { getFullscreenElement } from '../utils';
import './GameNotificationModal.css';

interface GameNotificationModalProps {
  notification: GameNotification | null;
  onClose: () => void;
}

function GameNotificationModal({ notification, onClose }: GameNotificationModalProps) {
  if (!notification || typeof document === 'undefined') {
    return null;
  }

  const portalTarget = getFullscreenElement();
  const container = portalTarget instanceof HTMLElement ? portalTarget : document.body;

  return createPortal(
    <div className="app-shell__modal-backdrop" onClick={onClose} role="presentation">
      <section
        aria-labelledby="game-notification-modal-title"
        aria-modal="true"
        className="app-shell__modal game-notification-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <img alt="" className="game-notification-modal__thumb" src={notification.thumbnailUrl} />
        <div className="game-notification-modal__body">
          <span>{notification.title}</span>
          <h2 id="game-notification-modal-title">{notification.videoTitle}</h2>
          <p>{notification.message}</p>
          <strong>{formatPoints(notification.highlightScore)} 하이라이트</strong>
        </div>
        <button aria-label="게임 알림 모달 닫기" className="app-shell__modal-close" onClick={onClose} type="button">
          닫기
        </button>
      </section>
    </div>,
    container,
  );
}

export default GameNotificationModal;

