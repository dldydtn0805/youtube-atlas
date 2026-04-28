export type TierModalTab = 'tier' | 'criteria' | 'highlights' | 'ranking';

export interface TierModalTabItem {
  id: TierModalTab;
  label: string;
}

export const TIER_MODAL_TABS: ReadonlyArray<TierModalTabItem> = [
  { id: 'tier', label: '내 카드' },
  { id: 'criteria', label: '기준' },
  { id: 'highlights', label: '하이라이트' },
  { id: 'ranking', label: '랭킹' },
];

export const TIER_MODAL_CAROUSEL_GAP = 0;
export const TIER_MODAL_CAROUSEL_SIDE_PADDING = 0;

export function getTierModalTabIndex(tabId: TierModalTab) {
  return TIER_MODAL_TABS.findIndex((tab) => tab.id === tabId);
}

export function getTierModalTabsBetween(fromTab: TierModalTab, toTab: TierModalTab) {
  const fromIndex = getTierModalTabIndex(fromTab);
  const toIndex = getTierModalTabIndex(toTab);

  if (fromIndex < 0 || toIndex < 0) {
    return [toTab];
  }

  const startIndex = Math.min(fromIndex, toIndex);
  const endIndex = Math.max(fromIndex, toIndex);

  return TIER_MODAL_TABS.slice(startIndex, endIndex + 1).map((tab) => tab.id);
}
