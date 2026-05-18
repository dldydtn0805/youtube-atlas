import type { ChartViewMode } from './types';

export type HomeRouteMode = 'explore' | 'play';

export interface HomeRouteFilters {
  categoryId?: string;
  chartView?: ChartViewMode;
  regionCode?: string;
}

export interface PlayRouteSelection extends HomeRouteFilters {
  playbackQueueId: string;
  videoId: string;
}

export function getHomeRouteMode(pathname: string): HomeRouteMode {
  return pathname.startsWith('/play') ? 'play' : 'explore';
}

function appendHomeRouteFilterParams(params: URLSearchParams, filters: HomeRouteFilters) {
  if (filters.regionCode) {
    params.set('region', filters.regionCode);
  }

  if (filters.categoryId) {
    params.set('categoryId', filters.categoryId);
  }

  if (filters.chartView) {
    params.set('view', filters.chartView);
  }
}

export function createExploreRoutePath(filters: HomeRouteFilters) {
  const params = new URLSearchParams();

  appendHomeRouteFilterParams(params, filters);

  const queryString = params.toString();

  return queryString ? `/explore?${queryString}` : '/explore';
}

export function createPlayRoutePath(selection: PlayRouteSelection) {
  const params = new URLSearchParams({
    queueId: selection.playbackQueueId,
    videoId: selection.videoId,
  });

  appendHomeRouteFilterParams(params, selection);

  return `/play?${params.toString()}`;
}

export function readHomeRouteFilters(search: string): HomeRouteFilters {
  const params = new URLSearchParams(search);
  const regionCode = params.get('region')?.trim();
  const categoryId = params.get('categoryId')?.trim();
  const chartView = params.get('view')?.trim() as ChartViewMode | undefined;

  return {
    categoryId: categoryId || undefined,
    chartView,
    regionCode: regionCode || undefined,
  };
}

export function readPlayRouteSelection(search: string) {
  const filters = readHomeRouteFilters(search);
  const params = new URLSearchParams(search);
  const videoId = params.get('videoId')?.trim();
  const playbackQueueId = params.get('queueId')?.trim();

  if (!videoId || !playbackQueueId) {
    return null;
  }

  return {
    ...filters,
    playbackQueueId,
    videoId,
  };
}
