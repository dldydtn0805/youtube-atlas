import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const fetchRealtimeSurging = vi.fn();
const fetchNewChartEntries = vi.fn();
const fetchTopRankRisers = vi.fn();
const fetchVideoTrendSignals = vi.fn();

vi.mock('./api', () => ({
  fetchNewChartEntries,
  fetchRealtimeSurging,
  fetchTopRankRisers,
  fetchVideoTrendSignals,
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useVideoTrendSignals', () => {
  afterEach(() => {
    fetchNewChartEntries.mockReset();
    fetchRealtimeSurging.mockReset();
    fetchTopRankRisers.mockReset();
    fetchVideoTrendSignals.mockReset();
  });

  it('does not request trend signals for non-all categories', async () => {
    const { useVideoTrendSignals } = await import('./queries');

    renderHook(() => useVideoTrendSignals('KR', '10', ['video-1']), {
      wrapper: createWrapper(),
    });

    renderHook(() => useVideoTrendSignals('KR', '24', ['video-1']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(fetchVideoTrendSignals).not.toHaveBeenCalled();
    });
  });

  it('does not request trend signals outside the supported region', async () => {
    const { useVideoTrendSignals } = await import('./queries');

    renderHook(() => useVideoTrendSignals('FR', '0', ['video-1']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(fetchVideoTrendSignals).not.toHaveBeenCalled();
    });
  });

  it('requests trend signals for the all category', async () => {
    fetchVideoTrendSignals.mockResolvedValue({
      'video-1': {
        categoryId: '0',
      },
    });

    const { useVideoTrendSignals } = await import('./queries');

    renderHook(() => useVideoTrendSignals('KR', '0', ['video-1']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(fetchVideoTrendSignals).toHaveBeenCalledWith('KR', '0', ['video-1']);
    });
  });

  it('only requests missing trend signals while loading an expanded video id set', async () => {
    let resolveNextSignals: (value: Record<string, { categoryId: string; currentRank: number }>) => void = () => {};
    const nextSignals = new Promise<Record<string, { categoryId: string; currentRank: number }>>((resolve) => {
      resolveNextSignals = resolve;
    });

    fetchVideoTrendSignals.mockImplementation((_, __, videoIds: string[]) => {
      if (videoIds.includes('video-2')) {
        return nextSignals;
      }

      return Promise.resolve({
        'video-1': {
          categoryId: '0',
          currentRank: 4,
        },
      });
    });

    const { useVideoTrendSignals } = await import('./queries');

    const { result, rerender } = renderHook(
      ({ videoIds }) => useVideoTrendSignals('KR', '0', videoIds),
      {
        initialProps: { videoIds: ['video-1'] },
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.data?.['video-1']?.currentRank).toBe(4);
    });

    rerender({ videoIds: ['video-1', 'video-2'] });

    await waitFor(() => {
      expect(fetchVideoTrendSignals).toHaveBeenLastCalledWith('KR', '0', ['video-2']);
    });

    expect(result.current.data?.['video-1']?.currentRank).toBe(4);
    expect(result.current.isFetching).toBe(true);

    await act(async () => {
      resolveNextSignals({
        'video-2': {
          categoryId: '0',
          currentRank: 51,
        },
      });
    });

    await waitFor(() => {
      expect(result.current.data?.['video-1']?.currentRank).toBe(4);
      expect(result.current.data?.['video-2']?.currentRank).toBe(51);
    });
  });

  it('requests realtime surging feed for the selected region', async () => {
    fetchRealtimeSurging.mockResolvedValue({
      items: [],
      regionCode: 'KR',
    });

    const { useRealtimeSurging } = await import('./queries');

    renderHook(() => useRealtimeSurging('KR'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(fetchRealtimeSurging).toHaveBeenCalledWith('KR');
    });
  });

  it('requests new chart entries feed for the selected region', async () => {
    fetchNewChartEntries.mockResolvedValue({
      items: [],
      regionCode: 'KR',
    });

    const { useNewChartEntries } = await import('./queries');

    renderHook(() => useNewChartEntries('KR'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(fetchNewChartEntries).toHaveBeenCalledWith('KR');
    });
  });
});
