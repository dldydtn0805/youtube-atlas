import type { GameNotification } from '../../../features/game/types';

const CASHOUT_NAMES = {
  BIG_CASHOUT: '빅',
  SMALL_CASHOUT: '스몰',
} as const;

export function getGameNotificationLabel(notification: GameNotification) {
  if (notification.notificationType in CASHOUT_NAMES) {
    const name = CASHOUT_NAMES[notification.notificationType as keyof typeof CASHOUT_NAMES];

    if (notification.showModal === false) {
      return `하이라이트 포착 : ${name} 캐시아웃`;
    }

    return `매도 완료 : ${name} 캐시 아웃`;
  }

  return notification.title;
}
