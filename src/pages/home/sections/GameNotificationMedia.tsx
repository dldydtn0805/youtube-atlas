import type { GameNotification } from '../../../features/game/types';
import { isTitleUnlockNotification } from './gameNotificationEventType';
import './GameNotificationMedia.css';

interface GameNotificationMediaProps {
  className: string;
  notification: GameNotification;
}

export default function GameNotificationMedia({ className, notification }: GameNotificationMediaProps) {
  if (!isTitleUnlockNotification(notification)) {
    return <img alt="" className={className} src={notification.thumbnailUrl ?? ''} />;
  }

  return (
    <div className={`${className} game-notification-media`} data-grade={notification.titleGrade ?? 'NORMAL'}>
      <span className="game-notification-media__eyebrow">TITLE</span>
      <strong className="game-notification-media__name">{notification.titleDisplayName ?? notification.title}</strong>
    </div>
  );
}
