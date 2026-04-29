import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { supportsVideoTrendSignals } from '../../constants/videoCategories';
import {
  fetchNewChartEntries,
  fetchRealtimeSurging,
  fetchTopRankRisers,
  fetchVideoRankHistory,
  fetchVideoTrendSignals,
} from './api';
import type { VideoTrendSignal } from './types';

function mergeCachedTrendSignals(
  entries: Array<[unknown, Record<string, VideoTrendSignal> | undefined]>,
  videoIds: string[],
) {
  const videoIdSet = new Set(videoIds);
  const cachedSignals: Record<string, VideoTrendSignal> = {};

  for (const [, signals] of entries) {
    if (!signals) {
      continue;
    }

    for (const [videoId, signal] of Object.entries(signals)) {
      if (videoIdSet.has(videoId)) {
        cachedSignals[videoId] = signal;
      }
    }
  }

  return cachedSignals;
}

export function useVideoTrendSignals(
  regionCode: string | undefined,
  categoryId: string | undefined,
  videoIds: string[],
  enabled = true,
) {
  const queryClient = useQueryClient();
  const normalizedVideoIds = [...new Set(videoIds)].filter(Boolean).sort();
  const isSupportedCategory = supportsVideoTrendSignals(categoryId, regionCode);

  return useQuery({
    enabled: enabled && Boolean(regionCode) && isSupportedCategory && normalizedVideoIds.length > 0,
    queryKey: ['videoTrendSignals', regionCode, categoryId, normalizedVideoIds],
    queryFn: async () => {
      const cachedSignals = mergeCachedTrendSignals(
        queryClient.getQueriesData<Record<string, VideoTrendSignal>>({
          queryKey: ['videoTrendSignals', regionCode, categoryId],
        }),
        normalizedVideoIds,
      );
      const missingVideoIds = normalizedVideoIds.filter((videoId) => !cachedSignals[videoId]);

      if (missingVideoIds.length === 0) {
        return cachedSignals;
      }

      const fetchedSignals = await fetchVideoTrendSignals(
        regionCode as string,
        categoryId as string,
        missingVideoIds,
      );

      return {
        ...cachedSignals,
        ...fetchedSignals,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  });
}

export function useRealtimeSurging(regionCode: string | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(regionCode),
    queryKey: ['realtimeSurging', regionCode],
    queryFn: () => fetchRealtimeSurging(regionCode as string),
    staleTime: 1000 * 60 * 5,
  });
}

export function useTopRankRisers(regionCode: string | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(regionCode),
    queryKey: ['topRankRisers', regionCode],
    queryFn: () => fetchTopRankRisers(regionCode as string),
    staleTime: 1000 * 60 * 5,
  });
}

export function useNewChartEntries(regionCode: string | undefined, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(regionCode),
    queryKey: ['newChartEntries', regionCode],
    queryFn: () => fetchNewChartEntries(regionCode as string),
    staleTime: 1000 * 60 * 5,
  });
}

export function useVideoRankHistory(
  regionCode: string | undefined,
  videoId: string | undefined,
  enabled = true,
) {
  return useQuery({
    enabled: enabled && Boolean(regionCode) && Boolean(videoId),
    queryKey: ['videoRankHistory', regionCode, videoId],
    queryFn: () => fetchVideoRankHistory(regionCode as string, videoId as string),
    staleTime: 1000 * 30,
  });
}
