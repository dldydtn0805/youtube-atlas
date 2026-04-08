import { useCallback, useEffect, useMemo, type Dispatch, type SetStateAction } from 'react';
import type { FeaturedVideoSection } from '../../../components/VideoList/VideoList';
import type { AuthStatus } from '../../../features/auth/types';
import type { VideoTrendSignal } from '../../../features/trending/types';
import type { YouTubeCategorySection, YouTubeVideoItem } from '../../../features/youtube/types';
import { NEW_CHART_ENTRIES_QUEUE_ID, REALTIME_SURGING_QUEUE_ID, formatTrendRankLabel } from '../utils';
import type { ChartViewMode } from '../types';

interface ChartViewOption {
  disabled?: boolean;
  id: ChartViewMode;
  label: string;
}

interface UseHomeChartViewStateOptions {
  authStatus: AuthStatus;
  buyableFavoriteChartSection?: YouTubeCategorySection;
  buyableVideoSearchStatus?: string;
  chartErrorMessage?: string;
  chartTrendSignalsByVideoId: Record<string, VideoTrendSignal>;
  displaySelectedPlaybackSection?: YouTubeCategorySection;
  favoriteStreamerVideoErrorMessage: string;
  favoriteStreamersCount: number;
  favoriteTrendSignalsByVideoId: Record<string, VideoTrendSignal>;
  fetchNextFavoriteStreamerVideosPage: () => Promise<unknown>;
  fetchNextPage: () => Promise<unknown>;
  featuredChartSections: FeaturedVideoSection[];
  hasNextFavoriteStreamerVideosPage: boolean;
  hasNextPage: boolean;
  hasResolvedChartTrendSignals: boolean;
  hasResolvedFavoriteTrendSignals: boolean;
  isBuyableOnlyFilterActive: boolean;
  isBuyableOnlyFilterAvailable: boolean;
  isChartError: boolean;
  isChartLoading: boolean;
  isFavoriteStreamerVideosError: boolean;
  isFavoriteStreamerVideosLoading: boolean;
  isFavoriteStreamersError: boolean;
  isFavoriteStreamersLoading: boolean;
  isFetchingNextFavoriteStreamerVideosPage: boolean;
  isFetchingNextPage: boolean;
  isNewChartEntriesError: boolean;
  isNewChartEntriesLoading: boolean;
  isRealtimeSurgingError: boolean;
  isRealtimeSurgingLoading: boolean;
  isTrendRegionSelected: boolean;
  selectedChartView: ChartViewMode;
  setCollapsedHomeSectionIds: Dispatch<SetStateAction<string[]>>;
  setSelectedChartView: Dispatch<SetStateAction<ChartViewMode>>;
}

interface HomeChartViewState {
  activeChartBuyableOnlyFilterActive: boolean;
  activeChartBuyableOnlyFilterAvailable: boolean;
  activeChartBuyableVideoSearchStatus?: string;
  activeChartEmptyMessage?: string;
  activeChartErrorMessage?: string;
  activeChartFeaturedSections: FeaturedVideoSection[];
  activeChartHasNextPage: boolean;
  activeChartHasResolvedTrendSignals: boolean;
  activeChartIsError: boolean;
  activeChartIsFetchingNextPage: boolean;
  activeChartIsLoading: boolean;
  activeChartMainSectionCollapseKey?: string;
  activeChartOnLoadMore: () => void;
  activeChartRankLabel?: (item: YouTubeVideoItem, index: number) => string;
  activeChartSection?: YouTubeCategorySection;
  activeChartSectionEyebrow?: string;
  activeChartTrendSignalsByVideoId: Record<string, VideoTrendSignal>;
  chartViewOptions: ChartViewOption[];
  effectiveChartView: ChartViewMode;
  handleSelectChartView: (viewId: string, triggerElement?: HTMLButtonElement) => void;
  selectedChartViewOption: ChartViewOption;
}

export default function useHomeChartViewState({
  authStatus,
  buyableFavoriteChartSection,
  buyableVideoSearchStatus,
  chartErrorMessage,
  chartTrendSignalsByVideoId,
  displaySelectedPlaybackSection,
  favoriteStreamerVideoErrorMessage,
  favoriteStreamersCount,
  favoriteTrendSignalsByVideoId,
  fetchNextFavoriteStreamerVideosPage,
  fetchNextPage,
  featuredChartSections,
  hasNextFavoriteStreamerVideosPage,
  hasNextPage,
  hasResolvedChartTrendSignals,
  hasResolvedFavoriteTrendSignals,
  isBuyableOnlyFilterActive,
  isBuyableOnlyFilterAvailable,
  isChartError,
  isChartLoading,
  isFavoriteStreamerVideosError,
  isFavoriteStreamerVideosLoading,
  isFavoriteStreamersError,
  isFavoriteStreamersLoading,
  isFetchingNextFavoriteStreamerVideosPage,
  isFetchingNextPage,
  isNewChartEntriesError,
  isNewChartEntriesLoading,
  isRealtimeSurgingError,
  isRealtimeSurgingLoading,
  isTrendRegionSelected,
  selectedChartView,
  setCollapsedHomeSectionIds,
  setSelectedChartView,
}: UseHomeChartViewStateOptions): HomeChartViewState {
  const chartViewOptions = useMemo(
    () =>
      [
        { id: 'all', label: '전체' },
        { id: 'popular', label: 'TOP 200' },
        {
          id: 'favorites',
          label: '즐겨찾기',
          disabled: authStatus !== 'authenticated',
        },
        {
          id: 'realtime-surging',
          label: '실시간 급상승',
          disabled: !isTrendRegionSelected,
        },
        {
          id: 'new-chart-entries',
          label: '신규 진입',
          disabled: !isTrendRegionSelected,
        },
      ] satisfies ChartViewOption[],
    [authStatus, isTrendRegionSelected],
  );

  useEffect(() => {
    if (selectedChartView === 'favorites' && authStatus !== 'authenticated') {
      setSelectedChartView('all');
      return;
    }

    if (
      isTrendRegionSelected ||
      selectedChartView === 'all' ||
      selectedChartView === 'favorites' ||
      selectedChartView === 'popular'
    ) {
      return;
    }

    setSelectedChartView('all');
  }, [authStatus, isTrendRegionSelected, selectedChartView, setSelectedChartView]);

  const effectiveChartView: ChartViewMode =
    !isTrendRegionSelected &&
    selectedChartView !== 'all' &&
    selectedChartView !== 'favorites' &&
    selectedChartView !== 'popular'
      ? 'all'
      : authStatus !== 'authenticated' && selectedChartView === 'favorites'
        ? 'all'
        : selectedChartView;

  const selectedChartViewOption =
    chartViewOptions.find((option) => option.id === effectiveChartView) ?? chartViewOptions[0];

  const favoriteChartGetRankLabel = useCallback(
    (item: YouTubeVideoItem) =>
      formatTrendRankLabel(
        favoriteTrendSignalsByVideoId[item.id],
        hasResolvedFavoriteTrendSignals,
      ),
    [favoriteTrendSignalsByVideoId, hasResolvedFavoriteTrendSignals],
  );

  const popularChartGetRankLabel = useCallback(
    (item: YouTubeVideoItem) =>
      formatTrendRankLabel(chartTrendSignalsByVideoId[item.id], hasResolvedChartTrendSignals),
    [chartTrendSignalsByVideoId, hasResolvedChartTrendSignals],
  );

  const realtimeSurgingFeaturedSection = useMemo(
    () =>
      featuredChartSections.find(
        (featuredSection) => featuredSection.section.categoryId === REALTIME_SURGING_QUEUE_ID,
      ),
    [featuredChartSections],
  );
  const newChartEntriesFeaturedSection = useMemo(
    () =>
      featuredChartSections.find(
        (featuredSection) => featuredSection.section.categoryId === NEW_CHART_ENTRIES_QUEUE_ID,
      ),
    [featuredChartSections],
  );
  const favoriteFeaturedSection = useMemo(
    () =>
      authStatus === 'authenticated' && buyableFavoriteChartSection
        ? {
            section: buyableFavoriteChartSection,
            eyebrow: 'Favorite Videos',
            emptyMessage:
              favoriteStreamersCount === 0
                ? '저장한 채널이 생기면 해당 채널의 인기 영상을 여기에서 바로 볼 수 있습니다.'
                : isBuyableOnlyFilterActive
                  ? '지금 매수 가능한 즐겨찾기 영상이 없습니다. 필터를 해제하거나 다른 보기를 확인해 보세요.'
                  : undefined,
            getRankLabel: favoriteChartGetRankLabel,
          }
        : undefined,
    [
      authStatus,
      buyableFavoriteChartSection,
      favoriteChartGetRankLabel,
      favoriteStreamersCount,
      isBuyableOnlyFilterActive,
    ],
  );

  const activeChartSection =
    effectiveChartView === 'realtime-surging'
      ? realtimeSurgingFeaturedSection?.section
      : effectiveChartView === 'new-chart-entries'
        ? newChartEntriesFeaturedSection?.section
        : effectiveChartView === 'favorites'
          ? buyableFavoriteChartSection
          : displaySelectedPlaybackSection;
  const activeChartFeaturedSections =
    effectiveChartView === 'all'
      ? favoriteFeaturedSection
        ? [...featuredChartSections, favoriteFeaturedSection]
        : featuredChartSections
      : [];
  const activeChartSectionEyebrow =
    effectiveChartView === 'realtime-surging'
      ? realtimeSurgingFeaturedSection?.eyebrow
      : effectiveChartView === 'new-chart-entries'
        ? newChartEntriesFeaturedSection?.eyebrow
        : effectiveChartView === 'favorites'
          ? 'Favorite Videos'
          : effectiveChartView === 'popular'
            ? 'Popular Videos'
            : 'Category Ranking';
  const activeChartRankLabel =
    effectiveChartView === 'realtime-surging'
      ? realtimeSurgingFeaturedSection?.getRankLabel
      : effectiveChartView === 'new-chart-entries'
        ? newChartEntriesFeaturedSection?.getRankLabel
        : effectiveChartView === 'favorites'
          ? favoriteChartGetRankLabel
          : popularChartGetRankLabel;
  const activeChartEmptyMessage =
    effectiveChartView === 'realtime-surging'
      ? realtimeSurgingFeaturedSection?.emptyMessage
      : effectiveChartView === 'new-chart-entries'
        ? newChartEntriesFeaturedSection?.emptyMessage
        : effectiveChartView === 'favorites'
          ? favoriteStreamersCount === 0
            ? '저장한 채널이 생기면 해당 채널의 인기 영상을 여기에서 바로 볼 수 있습니다.'
            : isBuyableOnlyFilterActive
              ? '지금 매수 가능한 즐겨찾기 영상이 없습니다. 필터를 해제하거나 다른 보기를 확인해 보세요.'
              : undefined
          : undefined;
  const isTrendOnlyViewSelected = effectiveChartView !== 'all';
  const activeTrendViewIsLoading =
    effectiveChartView === 'realtime-surging'
      ? isRealtimeSurgingLoading
      : effectiveChartView === 'new-chart-entries'
        ? isNewChartEntriesLoading
        : effectiveChartView === 'favorites'
          ? isFavoriteStreamersLoading || isFavoriteStreamerVideosLoading
          : false;
  const activeTrendViewIsError =
    effectiveChartView === 'realtime-surging'
      ? isRealtimeSurgingError
      : effectiveChartView === 'new-chart-entries'
        ? isNewChartEntriesError
        : effectiveChartView === 'favorites'
          ? isFavoriteStreamersError || isFavoriteStreamerVideosError
          : false;
  const activeChartIsLoading =
    effectiveChartView === 'favorites'
      ? activeTrendViewIsLoading
      : isTrendOnlyViewSelected
        ? isChartLoading || activeTrendViewIsLoading
        : isChartLoading;
  const activeChartIsError =
    effectiveChartView === 'favorites'
      ? activeTrendViewIsError
      : isTrendOnlyViewSelected
        ? isChartError || activeTrendViewIsError
        : isChartError;
  const activeChartErrorMessage =
    effectiveChartView === 'favorites'
      ? isFavoriteStreamersError
        ? '즐겨찾기 채널을 불러오지 못했습니다.'
        : favoriteStreamerVideoErrorMessage
      : activeTrendViewIsError && !chartErrorMessage
        ? '선택한 차트 보기를 불러오지 못했습니다.'
        : chartErrorMessage;
  const activeChartHasNextPage =
    effectiveChartView === 'favorites'
      ? hasNextFavoriteStreamerVideosPage
      : effectiveChartView === 'realtime-surging' || effectiveChartView === 'new-chart-entries'
        ? false
        : hasNextPage;
  const activeChartMainSectionCollapseKey = isTrendOnlyViewSelected
    ? activeChartSection?.categoryId
    : 'chart-main-list';
  const activeChartHasResolvedTrendSignals =
    effectiveChartView === 'favorites' ? hasResolvedFavoriteTrendSignals : hasResolvedChartTrendSignals;
  const activeChartIsFetchingNextPage =
    effectiveChartView === 'favorites' ? isFetchingNextFavoriteStreamerVideosPage : isFetchingNextPage;
  const activeChartTrendSignalsByVideoId =
    effectiveChartView === 'favorites' ? favoriteTrendSignalsByVideoId : chartTrendSignalsByVideoId;
  const activeChartOnLoadMore = useCallback(() => {
    if (effectiveChartView === 'favorites') {
      void fetchNextFavoriteStreamerVideosPage();
      return;
    }

    void fetchNextPage();
  }, [effectiveChartView, fetchNextFavoriteStreamerVideosPage, fetchNextPage]);
  const chartViewExpandedSectionIds = useMemo(
    (): Partial<Record<ChartViewMode, string[]>> => ({
      all: [
        'chart-main-list',
        ...featuredChartSections.map(({ section }) => section.categoryId),
        ...(favoriteFeaturedSection ? [favoriteFeaturedSection.section.categoryId] : []),
      ],
      favorites: buyableFavoriteChartSection?.categoryId ? [buyableFavoriteChartSection.categoryId] : [],
      'new-chart-entries': newChartEntriesFeaturedSection?.section.categoryId
        ? [newChartEntriesFeaturedSection.section.categoryId]
        : [],
      popular: displaySelectedPlaybackSection?.categoryId ? [displaySelectedPlaybackSection.categoryId] : [],
      'realtime-surging': realtimeSurgingFeaturedSection?.section.categoryId
        ? [realtimeSurgingFeaturedSection.section.categoryId]
        : [],
    }),
    [
      buyableFavoriteChartSection?.categoryId,
      displaySelectedPlaybackSection?.categoryId,
      favoriteFeaturedSection,
      featuredChartSections,
      newChartEntriesFeaturedSection?.section.categoryId,
      realtimeSurgingFeaturedSection?.section.categoryId,
    ],
  );

  const handleSelectChartView = useCallback(
    (viewId: string, triggerElement?: HTMLButtonElement) => {
      const nextView = chartViewOptions.find((option) => option.id === viewId);

      if (!nextView || nextView.disabled) {
        triggerElement?.blur();
        return;
      }

      const nextSectionIds = chartViewExpandedSectionIds[nextView.id] ?? [];

      if (nextSectionIds.length > 0) {
        setCollapsedHomeSectionIds((currentSectionIds) =>
          currentSectionIds.filter((currentSectionId) => !nextSectionIds.includes(currentSectionId)),
        );
      }

      setSelectedChartView(nextView.id);
      triggerElement?.blur();
    },
    [chartViewExpandedSectionIds, chartViewOptions, setCollapsedHomeSectionIds, setSelectedChartView],
  );

  return {
    activeChartBuyableOnlyFilterActive: isBuyableOnlyFilterActive,
    activeChartBuyableOnlyFilterAvailable: isBuyableOnlyFilterAvailable,
    activeChartBuyableVideoSearchStatus: buyableVideoSearchStatus,
    activeChartEmptyMessage,
    activeChartErrorMessage,
    activeChartFeaturedSections,
    activeChartHasNextPage,
    activeChartHasResolvedTrendSignals,
    activeChartIsError,
    activeChartIsFetchingNextPage,
    activeChartIsLoading,
    activeChartMainSectionCollapseKey,
    activeChartOnLoadMore,
    activeChartRankLabel,
    activeChartSection,
    activeChartSectionEyebrow,
    activeChartTrendSignalsByVideoId,
    chartViewOptions,
    effectiveChartView,
    handleSelectChartView,
    selectedChartViewOption,
  };
}
