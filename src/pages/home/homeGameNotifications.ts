import type { GameNotification, GamePosition } from '../../features/game/types';

export function mergeGameNotifications(...groups: Array<GameNotification[] | undefined>) {
  const notificationsById = new Map<string, GameNotification>();

  groups.flatMap((group) => group ?? []).forEach((notification) => {
    if (!notificationsById.has(notification.id)) {
      notificationsById.set(notification.id, notification);
    }
  });

  return [...notificationsById.values()]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 20);
}

export function logRealtimeGameNotificationDebug(
  notification: GameNotification,
  currentNotifications: GameNotification[],
) {
  if (!import.meta.env.DEV) {
    return;
  }

  const duplicatedNotification = currentNotifications.find(
    (currentNotification) => currentNotification.id === notification.id,
  );

  console.info('[game-notification] incoming', {
    id: notification.id,
    notificationEventType: notification.notificationEventType ?? null,
    notificationType: notification.notificationType,
    createdAt: notification.createdAt,
    title: notification.title,
    videoTitle: notification.videoTitle,
    duplicatedWithExistingId: Boolean(duplicatedNotification),
    duplicatedNotificationEventType: duplicatedNotification?.notificationEventType ?? null,
    duplicatedNotificationType: duplicatedNotification?.notificationType ?? null,
    currentNotificationIds: currentNotifications.map((currentNotification) => currentNotification.id),
  });
}

export function createRankHistoryPositionFromNotification(notification: GameNotification): GamePosition {
  return {
    id: notification.positionId ?? 0,
    videoId: notification.videoId ?? '',
    title: notification.videoTitle ?? notification.title,
    channelTitle: notification.channelTitle ?? '',
    thumbnailUrl: notification.thumbnailUrl ?? '',
    buyRank: 0,
    currentRank: null,
    rankDiff: null,
    quantity: 0,
    stakePoints: 0,
    currentPricePoints: null,
    profitPoints: null,
    chartOut: false,
    status: 'CLOSED',
    buyCapturedAt: notification.createdAt,
    createdAt: notification.createdAt,
    closedAt: notification.createdAt,
  };
}
