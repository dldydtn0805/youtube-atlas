export interface VideoTrendSignal {
  categoryId: string;
  categoryLabel: string;
  capturedAt: string;
  currentRank: number;
  currentViewCount: number | null;
  isNew: boolean;
  previousRank: number | null;
  previousViewCount: number | null;
  rankChange: number | null;
  regionCode: string;
  videoId: string;
  viewCountDelta: number | null;
}
