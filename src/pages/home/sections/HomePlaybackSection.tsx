import type { ComponentProps } from 'react';
import { ChartPanel, CommunityPanel } from './ContentPanels';
import { FilterBar } from './FilterPanels';
import PlayerStage from './PlayerStage';

interface HomePlaybackSectionProps {
  chartPanelProps: ComponentProps<typeof ChartPanel>;
  communityPanelProps: ComponentProps<typeof CommunityPanel>;
  filterBarProps: ComponentProps<typeof FilterBar>;
  playerStageProps: Omit<ComponentProps<typeof PlayerStage>, 'chartContent' | 'filterContent'>;
}

function getCinematicChartClassName(className?: string) {
  return className ? `${className} app-shell__panel--chart-cinematic` : 'app-shell__panel--chart-cinematic';
}

export default function HomePlaybackSection({
  chartPanelProps,
  communityPanelProps,
  filterBarProps,
  playerStageProps,
}: HomePlaybackSectionProps) {
  const renderFilterBar = () => <FilterBar {...filterBarProps} />;
  const renderChartPanel = (isCinematic = false) => (
    <ChartPanel
      {...chartPanelProps}
      className={isCinematic ? getCinematicChartClassName(chartPanelProps.className) : chartPanelProps.className}
    />
  );

  return (
    <>
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
