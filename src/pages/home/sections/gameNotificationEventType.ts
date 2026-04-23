import type { GameNotification } from '../../../features/game/types';

export function getGameNotificationEventType(notification: GameNotification) {
  if (notification.notificationEventType) {
    return notification.notificationEventType;
  }

  if (notification.notificationType === 'TIER_PROMOTION') {
    return 'TIER_PROMOTION';
  }

  if (notification.notificationType === 'TITLE_UNLOCK') {
    return 'TITLE_UNLOCK';
  }

  return notification.showModal === false ? 'PROJECTED_HIGHLIGHT' : 'TIER_SCORE_GAIN';
}

export function isTierPromotionNotification(notification: GameNotification) {
  return getGameNotificationEventType(notification) === 'TIER_PROMOTION';
}

export function isProjectedHighlightNotification(notification: GameNotification) {
  return getGameNotificationEventType(notification) === 'PROJECTED_HIGHLIGHT';
}

export function isTierScoreGainNotification(notification: GameNotification) {
  return getGameNotificationEventType(notification) === 'TIER_SCORE_GAIN';
}

export function isTitleUnlockNotification(notification: GameNotification) {
  return getGameNotificationEventType(notification) === 'TITLE_UNLOCK';
}
