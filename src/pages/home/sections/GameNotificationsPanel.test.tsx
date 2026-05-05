import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { GameNotification } from '../../../features/game/types';
import GameNotificationsPanel from './GameNotificationsPanel';

function createNotification(overrides: Partial<GameNotification> = {}): GameNotification {
  return {
    id: 'notification-1',
    notificationEventType: 'PROJECTED_HIGHLIGHT',
    notificationType: 'MOONSHOT',
    title: '하이라이트 포착',
    message: '매도 시 점수가 확정됩니다.',
    positionId: 10,
    videoId: 'video-1',
    videoTitle: '테스트 영상',
    channelTitle: '테스트 채널',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    strategyTags: ['MOONSHOT'],
    highlightScore: 1200,
    readAt: null,
    createdAt: '2026-05-03T00:00:00.000Z',
    showModal: false,
    ...overrides,
  };
}

describe('GameNotificationsPanel', () => {
  it('opens the sell modal from a projected highlight thumbnail', () => {
    const onOpenSell = vi.fn();
    const onMarkClicked = vi.fn();

    render(
      <GameNotificationsPanel
        notifications={[createNotification()]}
        onMarkClicked={onMarkClicked}
        onOpenSell={onOpenSell}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /즉시 매도 열기/ }));

    expect(onOpenSell).toHaveBeenCalledWith(expect.objectContaining({ id: 'notification-1' }));
    expect(onMarkClicked).toHaveBeenCalledWith('notification-1');
  });

  it('opens the highlights tab from a tier score notification thumbnail', () => {
    const onOpenHighlights = vi.fn();

    render(
      <GameNotificationsPanel
        notifications={[
          createNotification({
            notificationEventType: 'TIER_SCORE_GAIN',
            showModal: true,
            title: '티어 점수 상승',
          }),
        ]}
        onOpenHighlights={onOpenHighlights}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /하이라이트 탭 열기/ }));

    expect(onOpenHighlights).toHaveBeenCalledWith(expect.objectContaining({ id: 'notification-1' }));
  });

  it('hides notifications that have already been opened', () => {
    render(
      <GameNotificationsPanel
        clickedNotificationIds={new Set(['notification-1'])}
        notifications={[createNotification()]}
      />,
    );

    expect(screen.queryByText('테스트 영상')).not.toBeInTheDocument();
    expect(screen.getByText('아직 도착한 게임 알림이 없습니다.')).toBeInTheDocument();
  });

  it('does not show the unread badge', () => {
    render(<GameNotificationsPanel notifications={[createNotification()]} />);

    expect(screen.queryByText('미확인')).not.toBeInTheDocument();
  });

  it('does not mark a notification when the main content is clicked', () => {
    const onMarkClicked = vi.fn();

    render(
      <GameNotificationsPanel
        notifications={[createNotification()]}
        onMarkClicked={onMarkClicked}
      />,
    );

    fireEvent.click(screen.getByText('테스트 영상'));

    expect(onMarkClicked).not.toHaveBeenCalled();
  });
});
