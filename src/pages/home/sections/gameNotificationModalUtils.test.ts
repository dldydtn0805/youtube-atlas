import { describe, expect, it } from 'vitest';
import type { GameNotification } from '../../../features/game/types';
import { shouldOpenGameNotificationModal } from './gameNotificationModalUtils';

const baseNotification: GameNotification = {
  id: 'game-1-MOONSHOT',
  notificationType: 'MOONSHOT',
  title: '문샷 적중',
  message: '100위에서 잡은 영상이 10위까지 올라왔습니다.',
  positionId: 1,
  videoId: 'video-1',
  videoTitle: '테스트 영상',
  channelTitle: '테스트 채널',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  strategyTags: ['MOONSHOT'],
  highlightScore: 5000,
  readAt: null,
  createdAt: '2026-04-21T03:00:00Z',
  showModal: true,
};

describe('shouldOpenGameNotificationModal', () => {
  it('returns true when the backend marks the notification for modal display', () => {
    expect(shouldOpenGameNotificationModal(baseNotification)).toBe(true);
  });

  it('returns false without the backend modal signal', () => {
    expect(shouldOpenGameNotificationModal({ ...baseNotification, showModal: false })).toBe(false);
  });
});
