import { CHART_RANKING_MAX_ITEM_COUNT, CHART_RANKING_PAGE_SIZE } from './constants';

export function getSectionRenderKey(itemIds: string[], baseKey: string) {
  return `${baseKey}:${itemIds.join(':')}`;
}

export function getPageCount(itemCount: number, hasNextPage: boolean) {
  const totalItemCount = hasNextPage ? CHART_RANKING_MAX_ITEM_COUNT : itemCount;

  return Math.max(1, Math.ceil(totalItemCount / CHART_RANKING_PAGE_SIZE));
}

export function shouldPrefetchNextPage(nextPageIndex: number, loadedPageCount: number) {
  return nextPageIndex >= Math.max(loadedPageCount - 2, 0);
}

