import type { ReactNode, RefObject } from 'react';
import VideoPlayer from '../../../components/VideoPlayer/VideoPlayer';
import type { AuthStatus } from '../../../features/auth/types';
import type { PendingPlaybackRestore } from '../utils';

interface PlayerStageProps {
  authStatus: AuthStatus;
  canNavigateVideos: boolean;
  chartContent?: ReactNode;
  cinematicQuickFiltersContent?: ReactNode;
  cinematicToggleLabel: string;
  favoriteToggleHelperText: string;
  favoriteToggleLabel: string;
  favoriteVideosContent?: ReactNode;
  isChartLoading: boolean;
  isDesktopCinematicMode: boolean;
  isFavoriteToggleDisabled: boolean;
  isMobileLayout: boolean;
  isSelectedChannelFavorited: boolean;
  onNextVideo: () => void;
  onPreviousVideo: () => void;
  onPlaybackProgress?: (videoId: string, positionSeconds: number) => void;
  onPlaybackRestoreApplied?: (restoreId: number) => void;
  onToggleCinematicMode: () => void;
  onToggleFavoriteStreamer: () => void;
  playbackRestore?: PendingPlaybackRestore | null;
  playerSectionRef: RefObject<HTMLElement | null>;
  playerStageRef: RefObject<HTMLDivElement | null>;
  playerViewportRef: RefObject<HTMLDivElement | null>;
  selectedCategoryLabel?: string;
  selectedCountryName: string;
  selectedVideoChannelTitle?: string;
  selectedVideoId?: string;
  selectedVideoStatLabel?: string;
  selectedVideoTitle?: string;
  toggleFavoriteStreamerPending: boolean;
}

function PlayerStage({
  authStatus,
  canNavigateVideos,
  chartContent,
  cinematicQuickFiltersContent,
  cinematicToggleLabel,
  favoriteToggleHelperText,
  favoriteToggleLabel,
  favoriteVideosContent,
  isChartLoading,
  isDesktopCinematicMode,
  isFavoriteToggleDisabled,
  isMobileLayout,
  isSelectedChannelFavorited,
  onNextVideo,
  onPreviousVideo,
  onPlaybackProgress,
  onPlaybackRestoreApplied,
  onToggleCinematicMode,
  onToggleFavoriteStreamer,
  playbackRestore,
  playerSectionRef,
  playerStageRef,
  playerViewportRef,
  selectedCategoryLabel,
  selectedCountryName,
  selectedVideoChannelTitle,
  selectedVideoId,
  selectedVideoStatLabel,
  selectedVideoTitle,
  toggleFavoriteStreamerPending,
}: PlayerStageProps) {
  const hasSelectedVideo = Boolean(selectedVideoId);

  return (
    <div ref={playerStageRef} className="app-shell__stage" data-cinematic={isDesktopCinematicMode}>
      <div className="app-shell__stage-stack" data-cinematic={isDesktopCinematicMode}>
        <section
          ref={playerSectionRef}
          className="app-shell__panel app-shell__panel--player"
          data-cinematic={isDesktopCinematicMode}
        >
          <div className="app-shell__section-heading app-shell__section-heading--player">
            <div className="app-shell__section-heading-copy">
              <p className="app-shell__section-eyebrow">Now Playing</p>
              <h2 className="app-shell__section-title">
                {selectedCountryName}
                {selectedCategoryLabel ? ` · ${selectedCategoryLabel}` : ''}
              </h2>
            </div>
            <div className="app-shell__player-actions">
              {!isMobileLayout ? (
                <button
                  aria-label={cinematicToggleLabel}
                  className="app-shell__mode-toggle"
                  data-active={isDesktopCinematicMode}
                  onClick={onToggleCinematicMode}
                  title={cinematicToggleLabel}
                  type="button"
                >
                  {cinematicToggleLabel}
                </button>
              ) : null}
            </div>
          </div>
          <div ref={playerViewportRef} className="app-shell__player-viewport">
            <VideoPlayer
              canNavigateVideos={canNavigateVideos}
              isCinematic={isDesktopCinematicMode}
              isLoading={isChartLoading}
              onNextVideo={onNextVideo}
              onPlaybackProgress={onPlaybackProgress}
              onPlaybackRestoreApplied={onPlaybackRestoreApplied}
              onPreviousVideo={onPreviousVideo}
              onVideoEnd={onNextVideo}
              playbackRestore={playbackRestore}
              selectedVideoId={selectedVideoId}
              showOverlayNavigation={!isMobileLayout}
            />
          </div>
          {hasSelectedVideo ? (
            <div className="app-shell__stage-meta">
              <div className="app-shell__stage-copy">
                <div className="app-shell__stage-headline">
                  <h3 className="app-shell__stage-title">{selectedVideoTitle}</h3>
                  {selectedVideoStatLabel ? (
                    <span className="app-shell__stage-stat">{selectedVideoStatLabel}</span>
                  ) : null}
                </div>
                <p className="app-shell__stage-channel">{selectedVideoChannelTitle}</p>
                <p className="app-shell__stage-helper">{favoriteToggleHelperText}</p>
              </div>
              <div className="app-shell__stage-side">
                <button
                  aria-label={favoriteToggleLabel}
                  className="app-shell__favorite-toggle"
                  data-active={isSelectedChannelFavorited}
                  disabled={authStatus !== 'authenticated' || isFavoriteToggleDisabled}
                  onClick={onToggleFavoriteStreamer}
                  title={favoriteToggleLabel}
                  type="button"
                >
                  <span className="app-shell__favorite-toggle-icon" aria-hidden="true">
                    {toggleFavoriteStreamerPending ? '⋯' : isSelectedChannelFavorited ? '★' : '☆'}
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </section>
        {cinematicQuickFiltersContent}
        {isDesktopCinematicMode ? favoriteVideosContent : null}
        {isDesktopCinematicMode ? chartContent : null}
      </div>
    </div>
  );
}

export default PlayerStage;
