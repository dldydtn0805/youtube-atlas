import { videoCategories } from '../../constants/videoCategories';
import { YouTubeCategorySection, YouTubeVideoListResponse } from './types';

const MAX_RESULTS_PER_CATEGORY = '12';

async function fetchMostPopularVideos(
  regionCode: string,
  categoryId: string,
): Promise<YouTubeVideoListResponse> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_YOUTUBE_API_KEY is not configured.');
  }

  const params = new URLSearchParams({
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    regionCode,
    videoCategoryId: categoryId,
    maxResults: MAX_RESULTS_PER_CATEGORY,
    key: apiKey,
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`YouTube API request failed with status ${response.status}.`);
  }

  const result = (await response.json()) as YouTubeVideoListResponse & {
    error?: { message?: string };
  };

  if (result.error?.message) {
    throw new Error(result.error.message);
  }

  return result;
}

export async function fetchPopularVideosByCategory(
  regionCode: string,
): Promise<YouTubeCategorySection[]> {
  const responses = await Promise.all(
    videoCategories.map(async (category) => {
      const result = await fetchMostPopularVideos(regionCode, category.id);

      return {
        categoryId: category.id,
        label: category.label,
        description: category.description,
        items: result.items,
      };
    }),
  );

  return responses.filter((section) => section.items.length > 0);
}
