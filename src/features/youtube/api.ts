import {
  ALL_VIDEO_CATEGORY,
  ALL_VIDEO_CATEGORY_ID,
  VideoCategory,
  mergeVideoCategories,
  toVideoCategory,
} from '../../constants/videoCategories';
import {
  YouTubeCategorySection,
  YouTubeVideoCategoryListResponse,
  YouTubeVideoListResponse,
} from './types';

const MAX_RESULTS_PER_CATEGORY = 50;
const CATEGORY_LANGUAGE = 'ko';
const EXCLUDED_CATEGORY_IDS = new Set(['27', '42']);
const SHORTS_MAX_DURATION_SECONDS = 180;
const SHORTS_TITLE_PATTERN = /#shorts\b|\bshorts?\b|쇼츠/i;
const MIN_VIDEOS_PER_SOURCE_PAGE = 12;

interface MergedCategoryPageState {
  exhaustedSourceIds: string[];
  nextPageTokens: Record<string, string>;
}

interface SourceCategoryPageResult {
  items: YouTubeVideoListResponse['items'];
  nextPageToken?: string;
  unavailableReason?: 'unsupported';
}

function parseIso8601DurationToSeconds(duration: string) {
  const match = duration.match(
    /^P(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/,
  );

  if (!match) {
    return Number.POSITIVE_INFINITY;
  }

  const [, hours = '0', minutes = '0', seconds = '0'] = match;

  return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
}

function isShortFormVideo(
  item: YouTubeVideoListResponse['items'][number],
) {
  const durationInSeconds = parseIso8601DurationToSeconds(item.contentDetails.duration);

  if (durationInSeconds <= SHORTS_MAX_DURATION_SECONDS) {
    return true;
  }

  return SHORTS_TITLE_PATTERN.test(item.snippet.title);
}

function isIgnorableCategoryFetchError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes('The requested video chart is not supported or is not available.') ||
    error.message.includes('Requested entity was not found.')
  );
}

function dedupeVideos(items: YouTubeVideoListResponse['items']) {
  const uniqueItems = new Map<string, YouTubeVideoListResponse['items'][number]>();

  for (const item of items) {
    if (!uniqueItems.has(item.id)) {
      uniqueItems.set(item.id, item);
    }
  }

  return [...uniqueItems.values()];
}

function parseMergedCategoryPageState(pageToken: string | undefined): MergedCategoryPageState {
  if (!pageToken) {
    return {
      exhaustedSourceIds: [],
      nextPageTokens: {},
    };
  }

  try {
    const parsed = JSON.parse(pageToken) as Partial<MergedCategoryPageState>;

    return {
      exhaustedSourceIds: Array.isArray(parsed.exhaustedSourceIds)
        ? parsed.exhaustedSourceIds.filter((sourceId): sourceId is string => typeof sourceId === 'string')
        : [],
      nextPageTokens:
        parsed.nextPageTokens && typeof parsed.nextPageTokens === 'object'
          ? Object.fromEntries(
              Object.entries(parsed.nextPageTokens).filter(
                (entry): entry is [string, string] =>
                  typeof entry[0] === 'string' && typeof entry[1] === 'string',
              ),
            )
          : {},
    };
  } catch {
    return {
      exhaustedSourceIds: [],
      nextPageTokens: {},
    };
  }
}

function buildMergedCategoryPageToken(pageState: MergedCategoryPageState, sourceIds: string[]) {
  const hasRemainingPages = sourceIds.some((sourceId) => Boolean(pageState.nextPageTokens[sourceId]));

  if (!hasRemainingPages) {
    return undefined;
  }

  return JSON.stringify(pageState);
}

async function fetchVideoCategoryList(regionCode: string): Promise<YouTubeVideoCategoryListResponse> {
  const params = new URLSearchParams({
    part: 'snippet',
    regionCode,
    hl: CATEGORY_LANGUAGE,
    key: getApiKey(),
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/videoCategories?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`YouTube API request failed with status ${response.status}.`);
  }

  const result = (await response.json()) as YouTubeVideoCategoryListResponse & {
    error?: { message?: string };
  };

  if (result.error?.message) {
    throw new Error(result.error.message);
  }

  return result;
}

async function fetchMostPopularVideos(
  regionCode: string,
  categoryId?: string,
  pageToken?: string,
): Promise<YouTubeVideoListResponse> {
  const params = new URLSearchParams({
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    regionCode,
    maxResults: String(MAX_RESULTS_PER_CATEGORY),
    key: getApiKey(),
  });

  if (categoryId) {
    params.set('videoCategoryId', categoryId);
  }

  if (pageToken) {
    params.set('pageToken', pageToken);
  }

  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params.toString()}`);
  const result = (await response.json()) as YouTubeVideoListResponse & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(result.error?.message ?? `YouTube API request failed with status ${response.status}.`);
  }

  if (result.error?.message) {
    throw new Error(result.error.message);
  }

  return result;
}

async function fetchPopularVideosPageForSource(
  regionCode: string,
  sourceCategoryId?: string,
  pageToken?: string,
): Promise<SourceCategoryPageResult> {
  let nextToken = pageToken;
  let result: YouTubeVideoListResponse | undefined;
  let items: YouTubeVideoListResponse['items'] = [];

  try {
    do {
      result = await fetchMostPopularVideos(regionCode, sourceCategoryId, nextToken);
      items = [...items, ...result.items.filter((item) => !isShortFormVideo(item))];
      nextToken = result.nextPageToken;
    } while (items.length < MIN_VIDEOS_PER_SOURCE_PAGE && nextToken);
  } catch (error) {
    if (!isIgnorableCategoryFetchError(error)) {
      throw error;
    }

    return {
      items: [],
      nextPageToken: undefined,
      unavailableReason: 'unsupported',
    };
  }

  return {
    items,
    nextPageToken: nextToken,
  };
}

function getApiKey() {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_YOUTUBE_API_KEY is not configured.');
  }

  return apiKey;
}

export async function fetchVideoCategories(regionCode: string): Promise<VideoCategory[]> {
  const result = await fetchVideoCategoryList(regionCode);
  const categories = mergeVideoCategories(
    result.items
      .filter((item) => !EXCLUDED_CATEGORY_IDS.has(item.id))
      .map((item) => toVideoCategory(item))
      .filter((item): item is VideoCategory => item !== null),
  )
    .sort((left, right) => left.label.localeCompare(right.label, 'ko'));

  if (categories.length === 0) {
    throw new Error('표시할 수 있는 카테고리가 없습니다.');
  }

  return [ALL_VIDEO_CATEGORY, ...categories];
}

export async function fetchPopularVideosByCategory(
  regionCode: string,
  category: VideoCategory,
  pageToken?: string,
): Promise<YouTubeCategorySection> {
  if (category.id === ALL_VIDEO_CATEGORY_ID) {
    const overallPage = await fetchPopularVideosPageForSource(regionCode, undefined, pageToken);

    return {
      categoryId: category.id,
      label: category.label,
      description: category.description,
      items: overallPage.items,
      nextPageToken: overallPage.nextPageToken,
    };
  }

  if (category.sourceIds.length <= 1) {
    const sourceCategoryId = category.sourceIds[0] ?? category.id;
    const sourcePage = await fetchPopularVideosPageForSource(regionCode, sourceCategoryId, pageToken);

    if (sourcePage.unavailableReason === 'unsupported') {
      throw new Error(`현재 ${regionCode}에서는 ${category.label} 인기 차트를 지원하지 않습니다.`);
    }

    return {
      categoryId: category.id,
      label: category.label,
      description: category.description,
      items: sourcePage.items,
      nextPageToken: sourcePage.nextPageToken,
    };
  }

  const pageState = parseMergedCategoryPageState(pageToken);
  const activeSourceIds = category.sourceIds.filter(
    (sourceId) => !pageState.exhaustedSourceIds.includes(sourceId),
  );
  const sourcePages = await Promise.all(
    activeSourceIds.map((sourceId) =>
      fetchPopularVideosPageForSource(regionCode, sourceId, pageState.nextPageTokens[sourceId]),
    ),
  );
  const nextPageState: MergedCategoryPageState = {
    exhaustedSourceIds: [...pageState.exhaustedSourceIds],
    nextPageTokens: {},
  };

  for (const [index, sourceId] of activeSourceIds.entries()) {
    const nextSourceToken = sourcePages[index]?.nextPageToken;

    if (nextSourceToken) {
      nextPageState.nextPageTokens[sourceId] = nextSourceToken;
      continue;
    }

    nextPageState.exhaustedSourceIds.push(sourceId);
  }

  return {
    categoryId: category.id,
    label: category.label,
    description: category.description,
    items: dedupeVideos(sourcePages.flatMap((sourcePage) => sourcePage.items)),
    nextPageToken: buildMergedCategoryPageToken(nextPageState, category.sourceIds),
  };
}
