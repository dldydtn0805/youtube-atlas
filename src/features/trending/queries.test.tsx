import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const fetchVideoTrendSignals = vi.fn();

vi.mock('./api', () => ({
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
    fetchVideoTrendSignals.mockReset();
  });

  it('does not request trend signals for non-all categories', async () => {
    const { useVideoTrendSignals } = await import('./queries');

    renderHook(() => useVideoTrendSignals('KR', '10', ['video-1']), {
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
});
