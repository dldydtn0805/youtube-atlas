import type { FeaturedVideoSection, VideoCardTradeActionState } from '../../../../components/VideoList/VideoList';
import type { VideoTrendSignal } from '../../../../features/trending/types';
import type { YouTubeCategorySection, YouTubeVideoItem } from '../../../../features/youtube/types';

export type ChartRankingAction = (
  videoId: string,
  sectionCategoryId: string,
  triggerElement?: HTMLButtonElement,
) => void;

export interface ChartRankingBoardProps {
  activePlaybackQueueId?: string;
  collapsedSectionIds?: string[];
  currentTierCode?: string;
  errorMessage?: string;
  featuredSections?: FeaturedVideoSection[];
  getRankLabel?: (item: YouTubeVideoItem, index: number) => string;
  getTradeActionState?: (item: YouTubeVideoItem) => VideoCardTradeActionState | undefined;
  hasNextPage: boolean;
  hasResolvedTrendSignals?: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isPrimarySectionCollapsible?: boolean;
  marketPriceByVideoId?: Record<string, number>;
  onLoadMore: () => void;
  onOpenBuyTradeModal?: ChartRankingAction;
  onOpenChart?: ChartRankingAction;
  onOpenSellTradeModal?: ChartRankingAction;
  onSelectVideo: ChartRankingAction;
  onToggleSectionCollapse?: (sectionId: string) => void;
  primarySectionCollapseKey?: string;
  primarySectionEyebrow?: string;
  section?: YouTubeCategorySection;
  sectionEmptyMessage?: string;
  selectedVideoId?: string;
  trendSignalsByVideoId?: Record<string, VideoTrendSignal>;
}

