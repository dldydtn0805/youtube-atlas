import { useQuery } from '@tanstack/react-query';
import { fetchVideoTrendSignals } from './api';

export function useVideoTrendSignals(
  regionCode: string | undefined,
  categoryId: string | undefined,
  videoIds: string[],
  enabled = true,
) {
  const normalizedVideoIds = [...new Set(videoIds)].filter(Boolean).sort();

  return useQuery({
    enabled: enabled && Boolean(regionCode) && Boolean(categoryId) && normalizedVideoIds.length > 0,
    queryKey: ['videoTrendSignals', regionCode, categoryId, normalizedVideoIds],
    queryFn: () => fetchVideoTrendSignals(regionCode as string, categoryId as string, normalizedVideoIds),
    staleTime: 1000 * 60 * 10,
  });
}
