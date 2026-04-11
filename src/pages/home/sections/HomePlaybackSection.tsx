import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { ChartPanel, CommunityPanel } from './ContentPanels';
import { FilterBar } from './FilterPanels';
import PlayerStage from './PlayerStage';
import './HomePlaybackSection.css';

const STICKY_SELECTED_VIDEO_TOP_OFFSET = 12;
const STICKY_SELECTED_VIDEO_RELEASE_GAP = 16;

interface HomePlaybackSectionProps {
  chartPanelProps: ComponentProps<typeof ChartPanel>;
  communityPanelProps: ComponentProps<typeof CommunityPanel>;
  filterBarProps: ComponentProps<typeof FilterBar>;
  playerStageProps: Omit<ComponentProps<typeof PlayerStage>, 'chartContent' | 'filterContent'>;
  stickySelectedVideoContent?: ReactNode;
}

function getCinematicChartClassName(className?: string) {
  return className ? `${className} app-shell__panel--chart-cinematic` : 'app-shell__panel--chart-cinematic';
}

export default function HomePlaybackSection({
  chartPanelProps,
  communityPanelProps,
  filterBarProps,
  playerStageProps,
  stickySelectedVideoContent,
}: HomePlaybackSectionProps) {
  const [isStickySelectedVideoVisible, setIsStickySelectedVideoVisible] = useState(false);
  const stickySelectedVideoSlotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const playerViewport = playerStageProps.playerViewportRef.current;

    if (
      typeof window === 'undefined' ||
      !playerViewport ||
      !stickySelectedVideoContent ||
      playerStageProps.isCinematicModeActive
    ) {
      setIsStickySelectedVideoVisible(false);
      return;
    }

    let animationFrameId: number | null = null;

    const syncStickyVisibility = (playerViewportBottom: number) => {
      setIsStickySelectedVideoVisible((currentValue) => {
        const releaseThreshold =
          STICKY_SELECTED_VIDEO_TOP_OFFSET +
          (currentValue
            ? (stickySelectedVideoSlotRef.current?.offsetHeight ?? 0) + STICKY_SELECTED_VIDEO_RELEASE_GAP
            : 0);
        const nextIsVisible = playerViewportBottom <= releaseThreshold;

        return currentValue === nextIsVisible ? currentValue : nextIsVisible;
      });
    };

    const updateStickyVisibility = () => {
      animationFrameId = null;
      syncStickyVisibility(playerViewport.getBoundingClientRect().bottom);
    };

    const scheduleStickyVisibilityUpdate = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(updateStickyVisibility);
    };

    scheduleStickyVisibilityUpdate();

    const observer = new IntersectionObserver(
      ([entry]) => {
        syncStickyVisibility(entry.boundingClientRect.bottom);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(playerViewport);
    window.addEventListener('resize', scheduleStickyVisibilityUpdate);
    window.addEventListener('scroll', scheduleStickyVisibilityUpdate, { passive: true });

    return () => {
      observer.disconnect();
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', scheduleStickyVisibilityUpdate);
      window.removeEventListener('scroll', scheduleStickyVisibilityUpdate);
    };
  }, [
    playerStageProps.isCinematicModeActive,
    playerStageProps.playerViewportRef,
    stickySelectedVideoContent,
  ]);

  const renderFilterBar = () => <FilterBar {...filterBarProps} />;
  const renderChartPanel = (isCinematic = false) => (
    <ChartPanel
      {...chartPanelProps}
      className={isCinematic ? getCinematicChartClassName(chartPanelProps.className) : chartPanelProps.className}
    />
  );

  return (
    <>
      {stickySelectedVideoContent && !playerStageProps.isCinematicModeActive && isStickySelectedVideoVisible ? (
        <div ref={stickySelectedVideoSlotRef} className="app-shell__sticky-selected-video-slot">
          <div className="app-shell__sticky-selected-video-frame">
            {stickySelectedVideoContent}
          </div>
        </div>
      ) : null}
      <PlayerStage
        {...playerStageProps}
        chartContent={renderChartPanel(true)}
        filterContent={renderFilterBar()}
      />
      {!playerStageProps.isCinematicModeActive ? renderFilterBar() : null}
      {!playerStageProps.isCinematicModeActive ? renderChartPanel() : null}
      <CommunityPanel {...communityPanelProps} />
    </>
  );
}
