import type { GameNotification } from '../../../features/game/types';

export function shouldOpenGameNotificationModal(notification: GameNotification) {
  return notification.showModal === true;
}
