import VideoListPagination from '../../../../components/VideoList/Pagination/VideoListPagination';
import VideoListPaginationOverlay from '../../../../components/VideoList/Pagination/VideoListPaginationOverlay';
import type { YouTubeCategorySection, YouTubeVideoItem } from '../../../../features/youtube/types';
import {
  formatRankingPrice,
  formatRankingViews,
  getRankingTrendBadge,
  getRankNumber,
} from './format';
import ChartRankingRow from './ChartRankingRow';
import type { ChartRankingAction, ChartRankingBoardProps } from './types';

interface ChartRankingSectionProps {
  activePlaybackQueueId?: string;
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentPage: number;
  emptyMessage?: string;
  eyebrow: string;
  getRankLabel?: (item: YouTubeVideoItem, index: number) => string;
  getTradeActionState?: ChartRankingBoardProps['getTradeActionState'];
  hasNextPage: boolean;
  hasResolvedTrendSignals: boolean;
  isCollapsed?: boolean;
  isCollapsible?: boolean;
  isPrefetchingAllPages: boolean;
  marketPriceByVideoId?: Record<string, number>;
  onOpenBuyTradeModal?: ChartRankingAction;
  onOpenChart?: ChartRankingAction;
  onOpenPageSelect: () => void;
  onOpenSellTradeModal?: ChartRankingAction;
  onPageChange: (nextPageIndex: number) => void;
  onSelectVideo: ChartRankingAction;
  onToggle?: () => void;
  pageStartIndex: number;
  section: YouTubeCategorySection;
  selectedVideoId?: string;
  shouldPaginate: boolean;
  totalPages: number;
  trendSignalsByVideoId?: ChartRankingBoardProps['trendSignalsByVideoId'];
  visibleItems: YouTubeVideoItem[];
}

export default function ChartRankingSection({
  activePlaybackQueueId,
  canGoNext,
  canGoPrevious,
  currentPage,
  emptyMessage,
  eyebrow,
  getRankLabel,
  getTradeActionState,
  hasNextPage,
  hasResolvedTrendSignals,
  isCollapsed = false,
  isCollapsible = false,
  isPrefetchingAllPages,
  marketPriceByVideoId,
  onOpenBuyTradeModal,
  onOpenChart,
  onOpenPageSelect,
  onOpenSellTradeModal,
  onPageChange,
  onSelectVideo,
  onToggle,
  pageStartIndex,
  section,
  selectedVideoId,
  shouldPaginate,
  totalPages,
  trendSignalsByVideoId,
  visibleItems,
}: ChartRankingSectionProps) {
  return (
    <section className="chart-ranking-board__section" aria-label={`${section.label} 영상`}>
      <header className="chart-ranking-board__header">
        <div className="chart-ranking-board__title-wrap">
          <p className="chart-ranking-board__eyebrow">{eyebrow}</p>
          <div className="chart-ranking-board__title-row">
            <h3 className="chart-ranking-board__title-text">{section.label}</h3>
            {isCollapsible ? (
              <button
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? `${section.label} 펼치기` : `${section.label} 숨기기`}
                className="chart-ranking-board__toggle"
                data-active={isCollapsed}
                onClick={onToggle}
                type="button"
              >
                ▾
              </button>
            ) : null}
          </div>
        </div>
        <span className="chart-ranking-board__badge">TOP 200</span>
      </header>
      {!isCollapsed && visibleItems.length > 0 ? (
        <div className="chart-ranking-board__table-shell">
          <table className="chart-ranking-board__table">
            <thead>
              <tr>
                <th>순위</th>
                <th className="chart-ranking-board__left">영상</th>
                <th>현재가</th>
                <th>전일비</th>
                <th>조회수</th>
                <th>거래</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item, visibleIndex) => {
                const index = pageStartIndex + visibleIndex;
                const rankLabel = getRankLabel?.(item, index) ?? `${index + 1}위`;
                const rankNumber = getRankNumber(item, rankLabel, index);
                const badge = getRankingTrendBadge(item, trendSignalsByVideoId, hasResolvedTrendSignals);
                const playbackQueueId = section.categoryId;

                return (
                  <ChartRankingRow
                    actionState={getTradeActionState?.(item)}
                    badge={badge}
                    isSelected={selectedVideoId === item.id && activePlaybackQueueId === playbackQueueId}
                    item={item}
                    key={`${section.categoryId}-${item.id}`}
                    onOpenBuyTradeModal={(triggerElement) =>
                      onOpenBuyTradeModal?.(item.id, playbackQueueId, triggerElement)
                    }
                    onOpenChart={(triggerElement) => {
                      if (onOpenChart) {
                        onOpenChart(item.id, playbackQueueId, triggerElement);
                        return;
                      }

                      onSelectVideo(item.id, playbackQueueId, triggerElement);
                    }}
                    onOpenSellTradeModal={(triggerElement) =>
                      onOpenSellTradeModal?.(item.id, playbackQueueId, triggerElement)
                    }
                    onSelectVideo={(triggerElement) => onSelectVideo(item.id, playbackQueueId, triggerElement)}
                    priceLabel={formatRankingPrice(marketPriceByVideoId?.[item.id])}
                    rankLabel={rankLabel}
                    rankNumber={rankNumber}
                    viewsLabel={formatRankingViews(item)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : !isCollapsed ? (
        <p className="chart-ranking-board__section-status">{emptyMessage}</p>
      ) : null}
      {isPrefetchingAllPages ? <VideoListPaginationOverlay /> : null}
      {!isCollapsed && shouldPaginate && (section.items.length > visibleItems.length || hasNextPage) ? (
        <VideoListPagination
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          currentPage={currentPage}
          label={`${section.label} 페이지 이동`}
          onNext={() => onPageChange(currentPage)}
          onOpenPageSelect={onOpenPageSelect}
          onPageChange={onPageChange}
          onPrevious={() => onPageChange(currentPage - 2)}
          shouldPreparePages={hasNextPage}
          totalPages={totalPages}
        />
      ) : null}
    </section>
  );
}
