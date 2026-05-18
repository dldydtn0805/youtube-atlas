import { type ComponentProps } from 'react';
import { ChartPanel } from './ContentPanels';
import type { FilterBarProps } from './FilterPanels';

interface HomeExploreSectionProps {
  chartPanelProps: Omit<
    ComponentProps<typeof ChartPanel>,
    'onOpenRegionModal' | 'onSelectView' | 'selectedViewId' | 'viewOptions'
  >;
  filterBarProps: FilterBarProps;
}

export default function HomeExploreSection({
  chartPanelProps,
  filterBarProps,
}: HomeExploreSectionProps) {
  return (
    <ChartPanel
      {...chartPanelProps}
      onOpenRegionModal={filterBarProps.onOpenRegionModal}
      onSelectView={filterBarProps.onSelectView}
      selectedViewId={filterBarProps.selectedViewId}
      viewOptions={filterBarProps.viewOptions}
    />
  );
}
