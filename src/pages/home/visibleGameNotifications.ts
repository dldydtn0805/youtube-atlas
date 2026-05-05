import type { GameNotification } from '../../features/game/types';

export function getVisibleGameNotifications(
  notifications: GameNotification[],
  clickedNotificationIds?: ReadonlySet<string>,
) {
  if (!clickedNotificationIds) {
    return notifications;
  }

  return notifications.filter((notification) => !clickedNotificationIds.has(notification.id));
}
