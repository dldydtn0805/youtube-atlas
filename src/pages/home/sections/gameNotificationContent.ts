import type { GameNotification } from '../../../features/game/types';
import { isTierPromotionNotification, isTitleUnlockNotification } from './gameNotificationEventType';
import { getTierPromotionMeta } from './gameNotificationTierVisualUtils';

function trimText(value: string | null | undefined) {
  return typeof value === 'string' ? value.trim() : '';
}

const titleGradeLabels = {
  NORMAL: '노말',
  RARE: '레어',
  SUPER: '슈퍼',
  ULTIMATE: '얼티밋',
} as const;

export function getGameNotificationHeading(notification: GameNotification) {
  const videoTitle = trimText(notification.videoTitle);
  const title = trimText(notification.title);
  const titleDisplayName = trimText(notification.titleDisplayName);

  if (isTitleUnlockNotification(notification)) {
    return titleDisplayName || title || '새 칭호 획득';
  }

  if (isTierPromotionNotification(notification)) {
    if (title) {
      return title;
    }

    const tierMeta = getTierPromotionMeta(notification);
    return tierMeta ? `${tierMeta.displayName} 티어 승급` : '티어 승급';
  }

  return videoTitle || title || '게임 알림';
}

export function getGameNotificationMessage(notification: GameNotification) {
  const message = trimText(notification.message);

  if (message) {
    return message;
  }

  if (!isTierPromotionNotification(notification)) {
    return '';
  }

  const tierMeta = getTierPromotionMeta(notification);
  return tierMeta ? `${tierMeta.displayName} 티어에 도달했습니다.` : '새 티어에 도달했습니다.';
}

export function getGameNotificationStatus(notification: GameNotification) {
  if (isTitleUnlockNotification(notification)) {
    return notification.titleGrade ? `${titleGradeLabels[notification.titleGrade]} 희귀도` : '칭호 획득';
  }

  if (!isTierPromotionNotification(notification)) {
    if (typeof notification.highlightScore !== 'number' || !Number.isFinite(notification.highlightScore)) {
      return '매도 시 점수 확정';
    }

    return `+${notification.highlightScore.toLocaleString('ko-KR')}점`;
  }

  const tierMeta = getTierPromotionMeta(notification);
  return tierMeta ? `${tierMeta.displayName} 티어 달성` : '티어 승급';
}
