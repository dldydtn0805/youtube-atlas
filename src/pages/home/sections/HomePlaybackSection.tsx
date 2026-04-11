import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { ChartPanel, CommunityPanel } from './ContentPanels';
import { FilterBar } from './FilterPanels';
import PlayerStage from './PlayerStage';
import './HomePlaybackSection.css';

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

    const applyStickyVisibility = (nextIsVisible: boolean) => {
      setIsStickySelectedVideoVisible((currentValue) =>
        currentValue === nextIsVisible ? currentValue : nextIsVisible,
      );
    };

    const updateStickyVisibility = () => {
      const nextIsVisible = playerViewport.getBoundingClientRect().bottom <= 12;

      applyStickyVisibility(nextIsVisible);
    };

    updateStickyVisibility();

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsVisible = !entry.isIntersecting && entry.boundingClientRect.bottom <= 12;

        applyStickyVisibility(nextIsVisible);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(playerViewport);
    window.addEventListener('resize', updateStickyVisibility);
    window.addEventListener('scroll', updateStickyVisibility, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateStickyVisibility);
      window.removeEventListener('scroll', updateStickyVisibility);
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
        <div className="app-shell__sticky-selected-video-slot">
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
