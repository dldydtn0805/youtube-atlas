import { useCallback, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { AuthStatus } from '../../../features/auth/types';
import type {
  GameCoinOverview,
  GameCoinTierProgress,
  GameCurrentSeason,
  GameLeaderboardEntry,
  GamePosition,
} from '../../../features/game/types';
import type { VideoTrendSignal } from '../../../features/trending/types';
import type { YouTubeCategorySection } from '../../../features/youtube/types';
import { findPlaybackQueueIdForVideo } from '../utils';
import type { OpenGameHolding } from '../gameHelpers';
import {
  RankingGameCoinOverview,
  RankingGameHistoryTab,
  RankingGameLeaderboardTab,
  RankingGamePanelShell,
  RankingGamePositionsTab,
} from './RankingGamePanel';

type GameTab = 'positions' | 'history' | 'leaderboard' | 'guide';

interface GamePanelSectionProps {
  activeGameTab: GameTab;
  activePlaybackQueueId?: string;
  authStatus: AuthStatus;
  canShowGameActions: boolean;
  coinOverview?: GameCoinOverview;
  coinTierProgress?: GameCoinTierProgress;
  computedWalletTotalAssetPoints: number | null;
  currentGameSeason?: GameCurrentSeason;
  currentGameSeasonUpdatedAt: number;
  favoriteStreamerVideoSection?: YouTubeCategorySection;
  favoriteTrendSignalsByVideoId: Record<string, VideoTrendSignal>;
  gameHistoryPositions: GamePosition[];
  gameLeaderboard: GameLeaderboardEntry[];
  gameLeaderboardError: unknown;
  gameMarketSignalsByVideoId: Record<string, VideoTrendSignal>;
  gamePortfolioSection: YouTubeCategorySection;
  hasApiConfigured: boolean;
  historyPlaybackLoadingVideoId: string | null;
  historyPlaybackSection?: YouTubeCategorySection;
  isGameHistoryLoading: boolean;
  isGameLeaderboardError: boolean;
  isGameLeaderboardLoading: boolean;
  isCollapsed: boolean;
  isSelectedLeaderboardPositionsError: boolean;
  isSelectedLeaderboardPositionsLoading: boolean;
  newChartEntriesSection?: YouTubeCategorySection;
  onOpenCoinModal: () => void;
  onSelectGameHistoryVideo: (position: GamePosition, playbackQueueId?: string) => void | Promise<void>;
  onSelectGamePositionVideo: (position: GamePosition) => void;
  onSelectLeaderboardPositionVideo: (position: GamePosition, playbackQueueId?: string) => void | Promise<void>;
  onSelectTab: (tab: GameTab) => void;
  onToggleCollapse: () => void;
  openDistinctVideoCount: number;
  openGameHoldings: OpenGameHolding[];
  openPositionsBuyPoints: number;
  openPositionsEvaluationPoints: number;
  openPositionsProfitPoints: number;
  positionsEmptyMessage: string | null;
  realtimeSurgingSection?: YouTubeCategorySection;
  selectedLeaderboardPositions: GamePosition[];
  selectedLeaderboardPositionsError: unknown;
  selectedLeaderboardUserId: number | null;
  selectedPositionId?: number | null;
  selectedPlaybackSection?: YouTubeCategorySection;
  selectedVideoActions?: ReactNode;
  selectedVideoId?: string;
  setSelectedLeaderboardUserId: Dispatch<SetStateAction<number | null>>;
  trendSignalsByVideoId: Record<string, VideoTrendSignal>;
}

export default function GamePanelSection({
  activeGameTab,
  activePlaybackQueueId,
  authStatus,
  canShowGameActions,
  coinOverview,
  coinTierProgress,
  computedWalletTotalAssetPoints,
  currentGameSeason,
  currentGameSeasonUpdatedAt,
  favoriteStreamerVideoSection,
  favoriteTrendSignalsByVideoId,
  gameHistoryPositions,
  gameLeaderboard,
  gameLeaderboardError,
  gameMarketSignalsByVideoId,
  gamePortfolioSection,
  hasApiConfigured,
  historyPlaybackLoadingVideoId,
  historyPlaybackSection,
  isGameHistoryLoading,
  isGameLeaderboardError,
  isGameLeaderboardLoading,
  isCollapsed,
  isSelectedLeaderboardPositionsError,
  isSelectedLeaderboardPositionsLoading,
  newChartEntriesSection,
  onOpenCoinModal,
  onSelectGameHistoryVideo,
  onSelectGamePositionVideo,
  onSelectLeaderboardPositionVideo,
  onSelectTab,
  onToggleCollapse,
  openDistinctVideoCount,
  openGameHoldings,
  openPositionsBuyPoints,
  openPositionsEvaluationPoints,
  openPositionsProfitPoints,
  positionsEmptyMessage,
  realtimeSurgingSection,
  selectedLeaderboardPositions,
  selectedLeaderboardPositionsError,
  selectedLeaderboardUserId,
  selectedPositionId,
  selectedPlaybackSection,
  selectedVideoActions,
  selectedVideoId,
  setSelectedLeaderboardUserId,
  trendSignalsByVideoId,
}: GamePanelSectionProps) {
  const historyEmptyMessage = currentGameSeason ? '아직 현재 시즌 거래내역이 없습니다.' : null;
  const selectedLeaderboardEntry = selectedLeaderboardUserId
    ? gameLeaderboard.find((entry) => entry.userId === selectedLeaderboardUserId) ?? null
    : null;
  const selectedLeaderboardPositionsTitle = selectedLeaderboardEntry
    ? `${selectedLeaderboardEntry.displayName}님의 보유 포지션`
    : '보유 포지션';

  const resolvePlaybackQueueId = useCallback(
    (videoId: string) =>
      findPlaybackQueueIdForVideo(videoId, {
        favoriteStreamerVideoSection,
        gamePortfolioSection,
        historyPlaybackSection,
        newChartEntriesSection,
        realtimeSurgingSection,
        selectedSection: selectedPlaybackSection,
      }),
    [
      favoriteStreamerVideoSection,
      gamePortfolioSection,
      historyPlaybackSection,
      newChartEntriesSection,
      realtimeSurgingSection,
      selectedPlaybackSection,
    ],
  );

  if (!hasApiConfigured || authStatus !== 'authenticated') {
    return null;
  }

  const leaderboardContent = (
    <RankingGameLeaderboardTab
      entries={gameLeaderboard}
      error={gameLeaderboardError}
      isError={isGameLeaderboardError}
      isLoading={isGameLeaderboardLoading}
      isPositionsError={isSelectedLeaderboardPositionsError}
      isPositionsLoading={isSelectedLeaderboardPositionsLoading}
      loadingVideoId={historyPlaybackLoadingVideoId}
      onSelectPosition={(position, playbackQueueId) => {
        void onSelectLeaderboardPositionVideo(position, playbackQueueId);
      }}
      onToggleUser={(userId) =>
        setSelectedLeaderboardUserId((currentUserId) => (currentUserId === userId ? null : userId))
      }
      positions={selectedLeaderboardPositions}
      positionsError={selectedLeaderboardPositionsError}
      positionsTitle={selectedLeaderboardPositionsTitle}
      resolvePlaybackQueueId={resolvePlaybackQueueId}
      season={currentGameSeason}
      selectedUserId={selectedLeaderboardUserId}
    />
  );

  const positionsContent = (
    <RankingGamePositionsTab
      activePlaybackQueueId={activePlaybackQueueId}
      canShowGameActions={canShowGameActions}
      coinOverview={coinOverview}
      emptyMessage={positionsEmptyMessage}
      favoriteTrendSignalsByVideoId={favoriteTrendSignalsByVideoId}
      gameMarketSignalsByVideoId={gameMarketSignalsByVideoId}
      holdings={openGameHoldings}
      onSelectPosition={onSelectGamePositionVideo}
      selectedPositionId={selectedPositionId}
      trendSignalsByVideoId={trendSignalsByVideoId}
    />
  );

  const historyContent = (
    <RankingGameHistoryTab
      activePlaybackQueueId={activePlaybackQueueId}
      emptyMessage={historyEmptyMessage}
      historyPlaybackLoadingVideoId={historyPlaybackLoadingVideoId}
      isLoading={isGameHistoryLoading}
      onSelectPosition={(position, playbackQueueId) => {
        void onSelectGameHistoryVideo(position, playbackQueueId);
      }}
      positions={gameHistoryPositions}
      resolvePlaybackQueueId={resolvePlaybackQueueId}
      selectedPositionId={selectedPositionId}
      selectedVideoId={selectedVideoId}
    />
  );

  const guideContent = (
    <div className="app-shell__game-guide" aria-label="랭킹 게임 설명">
      <ol className="app-shell__game-guide-list">
        <li className="app-shell__game-guide-item">
          <strong className="app-shell__game-guide-title">사고 팔아 포인트 벌기</strong>
          <p className="app-shell__game-guide-copy">
            홈에서 영상 차트를 확인하고, 순위가 오를 것 같은 영상을 싸게 사보세요. 나중에 순위가 오르면
            비싸게 팔아 차익을 포인트로 챙길 수 있어요!
          </p>
        </li>
        <li className="app-shell__game-guide-item">
          <strong className="app-shell__game-guide-title">코인 모아 티어 올리기</strong>
          <p className="app-shell__game-guide-copy">
            영상을 보유하고 있으면 포인트에 비례해서 코인이 자동으로 들어와요. 인기 영상일수록 코인이 더
            많이 쌓이니, 좋은 영상을 잘 고를수록 티어가 빨리 올라가요!
          </p>
        </li>
        <li className="app-shell__game-guide-item">
          <strong className="app-shell__game-guide-title">기록과 경쟁</strong>
          <p className="app-shell__game-guide-copy">
            거래내역에서 내가 했던 선택들을 돌아보고, 리더보드에서 다른 유저들과 이번 시즌 순위를
            비교해보세요. 1위를 노려봐요!
          </p>
        </li>
      </ol>
    </div>
  );

  const activeGameTabContent =
    activeGameTab === 'positions'
      ? positionsContent
      : activeGameTab === 'history'
        ? historyContent
        : activeGameTab === 'leaderboard'
          ? leaderboardContent
          : guideContent;

  return (
    <RankingGamePanelShell
      activeGameTab={activeGameTab}
      coinTierProgress={coinTierProgress}
      dividendOverview={
        <RankingGameCoinOverview
          coinTierProgress={coinTierProgress}
          onOpenDetails={onOpenCoinModal}
          overview={coinOverview}
          season={currentGameSeason}
        />
      }
      isCollapsed={isCollapsed}
      onSelectTab={onSelectTab}
      onToggleCollapse={onToggleCollapse}
      season={currentGameSeason}
      walletUpdatedAt={currentGameSeasonUpdatedAt}
      selectedVideoActions={selectedVideoActions}
      summary={{
        computedWalletTotalAssetPoints,
        openDistinctVideoCount,
        openPositionsBuyPoints,
        openPositionsEvaluationPoints,
        openPositionsProfitPoints,
      }}
      tabContent={activeGameTabContent}
    />
  );
}
