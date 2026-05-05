import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { GameScheduledSellOrder } from '../../../features/game/types';
import { SCHEDULED_SELL_ORDERS_QUEUE_ID } from '../utils';
import GameScheduledSellOrdersTab from './GameScheduledSellOrdersTab';

function createScheduledSellOrder(overrides: Partial<GameScheduledSellOrder> = {}): GameScheduledSellOrder {
  return {
    id: 1,
    userId: 1,
    seasonId: 1,
    positionId: 10,
    videoId: 'video-1',
    videoTitle: '대기 주문',
    channelTitle: '채널 A',
    thumbnailUrl: 'https://example.com/a.jpg',
    regionCode: 'KR',
    triggerType: 'RANK',
    targetRank: 10,
    targetProfitRatePercent: null,
    triggerDirection: 'RANK_IMPROVES_TO',
    status: 'PENDING',
    currentRank: 12,
    buyRank: 15,
    quantity: 100,
    stakePoints: 5000,
    sellPricePoints: null,
    settledPoints: null,
    pnlPoints: null,
    failureReason: null,
    triggeredAt: null,
    executedAt: null,
    canceledAt: null,
    createdAt: '2026-04-24T00:00:00.000Z',
    updatedAt: '2026-04-24T00:00:00.000Z',
    ...overrides,
  };
}

describe('GameScheduledSellOrdersTab', () => {
  it('shows a loading overlay instead of the old loading sentence', () => {
    render(<GameScheduledSellOrdersTab isLoading orders={[]} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('예약 매도 주문을 불러오는 중입니다.')).not.toBeInTheDocument();
  });

  it('shows pending orders by default and lets the user switch filters', async () => {
    const user = userEvent.setup();

    render(
      <GameScheduledSellOrdersTab
        isLoading={false}
        onCancelOrder={vi.fn()}
        orders={[
          {
            id: 1,
            userId: 1,
            seasonId: 1,
            positionId: 10,
            videoId: 'video-1',
            videoTitle: '대기 주문',
            channelTitle: '채널 A',
            thumbnailUrl: 'https://example.com/a.jpg',
            regionCode: 'KR',
            targetRank: 10,
            triggerDirection: 'RANK_IMPROVES_TO',
            status: 'PENDING',
            currentRank: 12,
            buyRank: 15,
            quantity: 100,
            stakePoints: 5000,
            sellPricePoints: null,
            settledPoints: null,
            pnlPoints: null,
            failureReason: null,
            triggeredAt: null,
            executedAt: null,
            canceledAt: null,
            createdAt: '2026-04-24T00:00:00.000Z',
            updatedAt: '2026-04-24T00:00:00.000Z',
          },
          {
            id: 2,
            userId: 1,
            seasonId: 1,
            positionId: 11,
            videoId: 'video-2',
            videoTitle: '취소 주문',
            channelTitle: '채널 B',
            thumbnailUrl: 'https://example.com/b.jpg',
            regionCode: 'KR',
            targetRank: 20,
            triggerDirection: 'RANK_DROPS_TO',
            status: 'CANCELED',
            currentRank: 18,
            buyRank: 16,
            quantity: 100,
            stakePoints: 4000,
            sellPricePoints: null,
            settledPoints: null,
            pnlPoints: null,
            failureReason: null,
            triggeredAt: null,
            executedAt: null,
            canceledAt: '2026-04-24T01:00:00.000Z',
            createdAt: '2026-04-24T00:30:00.000Z',
            updatedAt: '2026-04-24T01:00:00.000Z',
          },
        ]}
      />,
    );

    expect(screen.getByText('대기 주문')).toBeInTheDocument();
    expect(screen.queryByText('취소 주문')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: '취소' }));

    expect(screen.queryByText('대기 주문')).not.toBeInTheDocument();
    expect(screen.getByText('취소 주문')).toBeInTheDocument();
  });

  it('shows the status-specific empty message when a filter has no matching orders', async () => {
    const user = userEvent.setup();

    render(
      <GameScheduledSellOrdersTab
        isLoading={false}
        orders={[
          {
            id: 2,
            userId: 1,
            seasonId: 1,
            positionId: 11,
            videoId: 'video-2',
            videoTitle: '취소 주문',
            channelTitle: '채널 B',
            thumbnailUrl: 'https://example.com/b.jpg',
            regionCode: 'KR',
            targetRank: 20,
            triggerDirection: 'RANK_DROPS_TO',
            status: 'CANCELED',
            currentRank: 18,
            buyRank: 16,
            quantity: 100,
            stakePoints: 4000,
            sellPricePoints: null,
            settledPoints: null,
            pnlPoints: null,
            failureReason: null,
            triggeredAt: null,
            executedAt: null,
            canceledAt: '2026-04-24T01:00:00.000Z',
            createdAt: '2026-04-24T00:30:00.000Z',
            updatedAt: '2026-04-24T01:00:00.000Z',
          },
        ]}
      />,
    );

    expect(screen.getByText('예약 매도 주문이 아직 없습니다.')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: '완료' }));

    expect(screen.getByText('완료된 예약 매도 주문이 아직 없습니다.')).toBeInTheDocument();
  });

  it('calls cancel when the pending order cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancelOrder = vi.fn();

    render(
      <GameScheduledSellOrdersTab
        isLoading={false}
        onCancelOrder={onCancelOrder}
        orders={[
          {
            id: 1,
            userId: 1,
            seasonId: 1,
            positionId: 10,
            videoId: 'video-1',
            videoTitle: '대기 주문',
            channelTitle: '채널 A',
            thumbnailUrl: 'https://example.com/a.jpg',
            regionCode: 'KR',
            targetRank: 10,
            triggerDirection: 'RANK_IMPROVES_TO',
            status: 'PENDING',
            currentRank: 12,
            buyRank: 15,
            quantity: 100,
            stakePoints: 5000,
            sellPricePoints: null,
            settledPoints: null,
            pnlPoints: null,
            failureReason: null,
            triggeredAt: null,
            executedAt: null,
            canceledAt: null,
            createdAt: '2026-04-24T00:00:00.000Z',
            updatedAt: '2026-04-24T00:00:00.000Z',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: '예약 취소' }));

    expect(onCancelOrder).toHaveBeenCalledWith(1);
  });

  it('opens the chart when the order title is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChart = vi.fn();

    render(
      <GameScheduledSellOrdersTab
        isLoading={false}
        onOpenChart={onOpenChart}
        orders={[
          {
            id: 1,
            userId: 1,
            seasonId: 1,
            positionId: 10,
            videoId: 'video-1',
            videoTitle: '대기 주문',
            channelTitle: '채널 A',
            thumbnailUrl: 'https://example.com/a.jpg',
            regionCode: 'KR',
            targetRank: 10,
            triggerDirection: 'RANK_IMPROVES_TO',
            status: 'PENDING',
            currentRank: 12,
            buyRank: 15,
            quantity: 100,
            stakePoints: 5000,
            sellPricePoints: null,
            settledPoints: null,
            pnlPoints: null,
            failureReason: null,
            triggeredAt: null,
            executedAt: null,
            canceledAt: null,
            createdAt: '2026-04-24T00:00:00.000Z',
            updatedAt: '2026-04-24T00:00:00.000Z',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: '대기 주문 차트 보기' }));

    expect(onOpenChart).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        videoId: 'video-1',
        videoTitle: '대기 주문',
      }),
    );
  });

  it('opens the chart when the order body is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChart = vi.fn();

    render(
      <GameScheduledSellOrdersTab
        isLoading={false}
        onOpenChart={onOpenChart}
        orders={[
          {
            id: 1,
            userId: 1,
            seasonId: 1,
            positionId: 10,
            videoId: 'video-1',
            videoTitle: '대기 주문',
            channelTitle: '채널 A',
            thumbnailUrl: 'https://example.com/a.jpg',
            regionCode: 'KR',
            targetRank: 10,
            triggerDirection: 'RANK_IMPROVES_TO',
            status: 'PENDING',
            currentRank: 12,
            buyRank: 15,
            quantity: 100,
            stakePoints: 5000,
            sellPricePoints: null,
            settledPoints: null,
            pnlPoints: null,
            failureReason: null,
            triggeredAt: null,
            executedAt: null,
            canceledAt: null,
            createdAt: '2026-04-24T00:00:00.000Z',
            updatedAt: '2026-04-24T00:00:00.000Z',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: '대기 주문 본문 차트 보기' }));

    expect(onOpenChart).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        videoId: 'video-1',
        videoTitle: '대기 주문',
      }),
    );
  });

  it('selects the order video when the thumbnail is clicked', async () => {
    const user = userEvent.setup();
    const onSelectOrderVideo = vi.fn();

    render(
      <GameScheduledSellOrdersTab
        isLoading={false}
        onSelectOrderVideo={onSelectOrderVideo}
        orders={[
          {
            id: 1,
            userId: 1,
            seasonId: 1,
            positionId: 10,
            videoId: 'video-1',
            videoTitle: '대기 주문',
            channelTitle: '채널 A',
            thumbnailUrl: 'https://example.com/a.jpg',
            regionCode: 'KR',
            targetRank: 10,
            triggerDirection: 'RANK_IMPROVES_TO',
            status: 'PENDING',
            currentRank: 12,
            buyRank: 15,
            quantity: 100,
            stakePoints: 5000,
            sellPricePoints: null,
            settledPoints: null,
            pnlPoints: null,
            failureReason: null,
            triggeredAt: null,
            executedAt: null,
            canceledAt: null,
            createdAt: '2026-04-24T00:00:00.000Z',
            updatedAt: '2026-04-24T00:00:00.000Z',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: '대기 주문 재생' }));

    expect(onSelectOrderVideo).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        videoId: 'video-1',
        videoTitle: '대기 주문',
      }),
    );
  });

  it('marks only the matching selected order when duplicate video positions exist', () => {
    render(
      <GameScheduledSellOrdersTab
        activePlaybackQueueId={SCHEDULED_SELL_ORDERS_QUEUE_ID}
        isLoading={false}
        orders={[
          {
            id: 1,
            userId: 1,
            seasonId: 1,
            positionId: 10,
            videoId: 'video-1',
            videoTitle: '첫 예약',
            channelTitle: '채널 A',
            thumbnailUrl: 'https://example.com/a.jpg',
            regionCode: 'KR',
            targetRank: 10,
            triggerDirection: 'RANK_IMPROVES_TO',
            status: 'PENDING',
            currentRank: 12,
            buyRank: 15,
            quantity: 100,
            stakePoints: 5000,
            sellPricePoints: null,
            settledPoints: null,
            pnlPoints: null,
            failureReason: null,
            triggeredAt: null,
            executedAt: null,
            canceledAt: null,
            createdAt: '2026-04-24T00:00:00.000Z',
            updatedAt: '2026-04-24T00:00:00.000Z',
          },
          {
            id: 2,
            userId: 1,
            seasonId: 1,
            positionId: 10,
            videoId: 'video-1',
            videoTitle: '두 번째 예약',
            channelTitle: '채널 A',
            thumbnailUrl: 'https://example.com/a.jpg',
            regionCode: 'KR',
            targetRank: 8,
            triggerDirection: 'RANK_IMPROVES_TO',
            status: 'PENDING',
            currentRank: 12,
            buyRank: 15,
            quantity: 50,
            stakePoints: 2500,
            sellPricePoints: null,
            settledPoints: null,
            pnlPoints: null,
            failureReason: null,
            triggeredAt: null,
            executedAt: null,
            canceledAt: null,
            createdAt: '2026-04-24T00:10:00.000Z',
            updatedAt: '2026-04-24T00:10:00.000Z',
          },
        ]}
        selectedOrderId={2}
        selectedVideoId="video-1"
      />,
    );

    expect(screen.getByText('첫 예약').closest('li')).toHaveAttribute('data-selected', 'false');
    expect(screen.getByText('두 번째 예약').closest('li')).toHaveAttribute('data-selected', 'true');
  });

  it('reveals and focuses a requested scheduled sell order', async () => {
    const user = userEvent.setup();
    const pendingOrder = createScheduledSellOrder();
    const canceledOrder = createScheduledSellOrder({
      id: 2,
      positionId: 11,
      status: 'CANCELED',
      videoId: 'video-2',
      videoTitle: '취소 주문',
    });

    try {
      const { rerender } = render(
        <div className="app-shell__game-tab-slide-panel">
          <GameScheduledSellOrdersTab
            isLoading={false}
            orders={[pendingOrder, canceledOrder]}
          />
        </div>,
      );

      const scrollContainer = document.querySelector('.app-shell__game-tab-slide-panel') as HTMLDivElement;
      Object.defineProperty(scrollContainer, 'clientHeight', { configurable: true, value: 60 });
      Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, writable: true, value: 0 });

      await user.click(screen.getByRole('tab', { name: '취소' }));
      expect(screen.queryByText('대기 주문')).not.toBeInTheDocument();

      rerender(
        <div className="app-shell__game-tab-slide-panel">
          <GameScheduledSellOrdersTab
            focusedOrderRequest={{ orderId: 1, requestId: 1 }}
            isLoading={false}
            orders={[pendingOrder, canceledOrder]}
          />
        </div>,
      );

      const focusedRow = (await screen.findByText('대기 주문')).closest('li');

      Object.defineProperty(focusedRow, 'offsetTop', { configurable: true, value: 120 });
      Object.defineProperty(focusedRow, 'offsetHeight', { configurable: true, value: 40 });

      expect(screen.getByRole('tab', { name: '대기' })).toHaveAttribute('aria-selected', 'true');
      expect(focusedRow).toHaveAttribute('data-focused', 'true');
      await waitFor(() => expect(scrollContainer.scrollTop).toBe(108));
    } finally {
      vi.restoreAllMocks();
    }
  });

  it('waits until the scheduled orders tab is active before moving to the focused order', async () => {
    const pendingOrder = createScheduledSellOrder();
    const { rerender } = render(
      <div className="app-shell__game-tab-slide-panel">
        <GameScheduledSellOrdersTab
          focusedOrderRequest={{ orderId: 1, requestId: 1 }}
          isActive={false}
          isLoading={false}
          orders={[pendingOrder]}
        />
      </div>,
    );
    const scrollContainer = document.querySelector('.app-shell__game-tab-slide-panel') as HTMLDivElement;
    Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, writable: true, value: 0 });
    const focusedRow = screen.getByText('대기 주문').closest('li');
    Object.defineProperty(focusedRow, 'offsetTop', { configurable: true, value: 120 });

    expect(focusedRow).toHaveAttribute('data-focused', 'true');
    expect(scrollContainer.scrollTop).toBe(0);

    rerender(
      <div className="app-shell__game-tab-slide-panel">
        <GameScheduledSellOrdersTab
          focusedOrderRequest={{ orderId: 1, requestId: 1 }}
          isActive
          isLoading={false}
          orders={[pendingOrder]}
        />
      </div>,
    );

    await waitFor(() => expect(scrollContainer.scrollTop).toBe(108));
  });

  it('keeps focus by position when the scheduled order id changes', async () => {
    const pendingOrder = createScheduledSellOrder({ id: 44, positionId: 10 });

    render(
      <div className="app-shell__game-tab-slide-panel">
        <GameScheduledSellOrdersTab
          focusedOrderRequest={{ orderId: -123, positionId: 10, requestId: 1 }}
          isLoading={false}
          orders={[pendingOrder]}
        />
      </div>,
    );

    const scrollContainer = document.querySelector('.app-shell__game-tab-slide-panel') as HTMLDivElement;
    Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, writable: true, value: 0 });
    const focusedRow = screen.getByText('대기 주문').closest('li');
    Object.defineProperty(focusedRow, 'offsetTop', { configurable: true, value: 120 });

    expect(focusedRow).toHaveAttribute('data-focused', 'true');
    await waitFor(() => expect(scrollContainer.scrollTop).toBe(108));
  });

  it('shows a failed order reason when one is provided', async () => {
    const user = userEvent.setup();

    render(
      <GameScheduledSellOrdersTab
        isLoading={false}
        orders={[
          {
            id: 3,
            userId: 1,
            seasonId: 1,
            positionId: 12,
            videoId: 'video-3',
            videoTitle: '실패 주문',
            channelTitle: '채널 C',
            thumbnailUrl: 'https://example.com/c.jpg',
            regionCode: 'KR',
            targetRank: 30,
            triggerDirection: 'RANK_IMPROVES_TO',
            status: 'FAILED',
            currentRank: 40,
            buyRank: 33,
            quantity: 100,
            stakePoints: 5000,
            sellPricePoints: null,
            settledPoints: null,
            pnlPoints: null,
            failureReason: '최소 보유 시간이 지나야 매도할 수 있습니다.',
            triggeredAt: null,
            executedAt: null,
            canceledAt: null,
            createdAt: '2026-04-24T00:00:00.000Z',
            updatedAt: '2026-04-24T00:00:00.000Z',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('tab', { name: '전체' }));

    expect(screen.getByText('최소 보유 시간이 지나야 매도할 수 있습니다.')).toBeInTheDocument();
  });
});
