import { supabase } from '../../lib/supabase';
import type { VideoTrendSignal } from './types';

const VIDEO_TREND_SIGNALS_TABLE = 'video_trend_signals';

function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return supabase;
}

interface VideoTrendSignalRow {
  category_id: string;
  category_label: string;
  captured_at: string;
  current_rank: number;
  current_view_count: number | null;
  is_new: boolean;
  previous_rank: number | null;
  previous_view_count: number | null;
  rank_change: number | null;
  region_code: string;
  video_id: string;
  view_count_delta: number | null;
}

function toVideoTrendSignal(row: VideoTrendSignalRow): VideoTrendSignal {
  return {
    categoryId: row.category_id,
    categoryLabel: row.category_label,
    capturedAt: row.captured_at,
    currentRank: row.current_rank,
    currentViewCount: row.current_view_count,
    isNew: row.is_new,
    previousRank: row.previous_rank,
    previousViewCount: row.previous_view_count,
    rankChange: row.rank_change,
    regionCode: row.region_code,
    videoId: row.video_id,
    viewCountDelta: row.view_count_delta,
  };
}

export async function fetchVideoTrendSignals(
  regionCode: string,
  categoryId: string,
  videoIds: string[],
): Promise<Record<string, VideoTrendSignal>> {
  if (videoIds.length === 0) {
    return {};
  }

  const client = getSupabaseClient();
  const { data, error } = await client
    .from(VIDEO_TREND_SIGNALS_TABLE)
    .select(
      'category_id, category_label, captured_at, current_rank, current_view_count, is_new, previous_rank, previous_view_count, rank_change, region_code, video_id, view_count_delta',
    )
    .eq('region_code', regionCode)
    .eq('category_id', categoryId)
    .in('video_id', videoIds);

  if (error) {
    throw new Error(error.message);
  }

  return Object.fromEntries(
    ((data ?? []) as VideoTrendSignalRow[]).map((row) => {
      const signal = toVideoTrendSignal(row);

      return [signal.videoId, signal];
    }),
  );
}
