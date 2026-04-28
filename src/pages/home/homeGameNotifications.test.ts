import { describe, expect, it } from 'vitest';
import type { GameNotification } from '../../features/game/types';
import {
  createRankHistoryPositionFromNotification,
  mergeGameNotifications,
} from './homeGameNotifications';

function createNotification(overrides: Partial<GameNotification> = {}): GameNotification {
  return {
    channelTitle: 'channel',
    createdAt: '2026-04-28T00:00:00.000Z',
    highlightScore: 10,
    id: 'notification-1',
    message: 'message',
    notificationType: 'MOONSHOT',
    positionId: 1,
    readAt: null,
    strategyTags: ['MOONSHOT'],
    thumbnailUrl: 'thumb',
    title: 'title',
    videoId: 'video-1',
    videoTitle: 'video title',
    ...overrides,
  };
}

describe('mergeGameNotifications', () => {
  it('deduplicates by id and keeps the latest notifications first', () => {
    const newest = createNotification({
      createdAt: '2026-04-28T12:00:00.000Z',
      id: 'newest',
    });
    const duplicated = createNotification({
      createdAt: '2026-04-28T11:00:00.000Z',
      id: 'dup',
      title: 'first copy',
    });
    const olderDuplicate = createNotification({
      createdAt: '2026-04-28T10:00:00.000Z',
      id: 'dup',
      title: 'second copy',
    });

    const merged = mergeGameNotifications([duplicated], [newest, olderDuplicate]);

    expect(merged.map((notification) => notification.id)).toEqual(['newest', 'dup']);
    expect(merged[1]?.title).toBe('first copy');
  });
});

describe('createRankHistoryPositionFromNotification', () => {
  it('maps notification data into a closed position snapshot', () => {
    const notification = createNotification({
      channelTitle: null,
      createdAt: '2026-04-28T09:30:00.000Z',
      positionId: null,
      thumbnailUrl: null,
      videoId: null,
      videoTitle: null,
    });

    expect(createRankHistoryPositionFromNotification(notification)).toMatchObject({
      buyCapturedAt: '2026-04-28T09:30:00.000Z',
      channelTitle: '',
      closedAt: '2026-04-28T09:30:00.000Z',
      currentPricePoints: null,
      id: 0,
      profitPoints: null,
      quantity: 0,
      stakePoints: 0,
      status: 'CLOSED',
      thumbnailUrl: '',
      title: 'title',
      videoId: '',
    });
  });
});
