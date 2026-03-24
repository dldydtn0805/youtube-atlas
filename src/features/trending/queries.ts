import { useQuery } from '@tanstack/react-query';
import { ALL_VIDEO_CATEGORY_ID } from '../../constants/videoCategories';
import { fetchVideoTrendSignals } from './api';

export function useVideoTrendSignals(
  regionCode: string | undefined,
  categoryId: string | undefined,
  videoIds: string[],
  enabled = true,
) {
  const normalizedVideoIds = [...new Set(videoIds)].filter(Boolean).sort();
  const isAllCategory = categoryId === ALL_VIDEO_CATEGORY_ID;

  return useQuery({
    enabled: enabled && Boolean(regionCode) && isAllCategory && normalizedVideoIds.length > 0,
    queryKey: ['videoTrendSignals', regionCode, categoryId, normalizedVideoIds],
    queryFn: () => fetchVideoTrendSignals(regionCode as string, categoryId as string, normalizedVideoIds),
    staleTime: 1000 * 60 * 10,
  });
}
