import { type ComponentProps } from 'react';
import { ChartPanel } from './ContentPanels';
import type { FilterBarProps } from './FilterPanels';

interface HomeExploreSectionProps {
  chartPanelProps: Omit<
    ComponentProps<typeof ChartPanel>,
    'onChangeRegion' | 'onSelectView' | 'regionOptions' | 'selectedRegionCode' | 'selectedViewId' | 'viewOptions'
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
      onChangeRegion={filterBarProps.onChangeRegion}
      onSelectView={filterBarProps.onSelectView}
      regionOptions={filterBarProps.regionOptions}
      selectedRegionCode={filterBarProps.selectedRegionCode}
      selectedViewId={filterBarProps.selectedViewId}
      viewOptions={filterBarProps.viewOptions}
    />
  );
}
