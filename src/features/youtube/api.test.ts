import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchPopularVideosByCategory, fetchVideoCategories } from './api';

describe('fetchVideoCategories', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('excludes the shorts category from the selectable category list', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: '42',
              snippet: {
                assignable: true,
                title: 'Shorts',
              },
            },
            {
              id: '20',
              snippet: {
                assignable: true,
                title: 'Gaming',
              },
            },
          ],
        }),
      }),
    );

    const categories = await fetchVideoCategories('US');

    expect(categories).toEqual([
      {
        id: '0',
        label: '전체',
        description: '카테고리 구분 없이 현재 국가 전체 인기 영상을 보여줍니다.',
        sourceIds: [],
      },
      {
        id: 'gaming',
        label: '게임',
        description: '게임 방송, 리뷰, 신작 반응 등 게임 인기 영상을 확인할 수 있습니다.',
        sourceIds: ['20'],
      },
    ]);
  });

  it('excludes the education category from the selectable category list', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: '27',
              snippet: {
                assignable: true,
                title: 'Education',
              },
            },
            {
              id: '20',
              snippet: {
                assignable: true,
                title: 'Gaming',
              },
            },
          ],
        }),
      }),
    );

    const categories = await fetchVideoCategories('US');

    expect(categories.map((category) => category.id)).toEqual(['0', 'gaming']);
  });

  it('merges detailed categories into a smaller top-level category list', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: '23',
              snippet: {
                assignable: true,
                title: 'Comedy',
              },
            },
            {
              id: '24',
              snippet: {
                assignable: true,
                title: 'Entertainment',
              },
            },
            {
              id: '26',
              snippet: {
                assignable: true,
                title: 'Howto & Style',
              },
            },
          ],
        }),
      }),
    );

    const categories = await fetchVideoCategories('KR');

    expect(categories).toEqual([
      {
        id: '0',
        label: '전체',
        description: '카테고리 구분 없이 현재 국가 전체 인기 영상을 보여줍니다.',
        sourceIds: [],
      },
      {
        id: 'entertainment',
        label: '엔터테인먼트',
        description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
        sourceIds: ['24', '23', '26'],
      },
    ]);
  });
});

describe('fetchPopularVideosByCategory', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('filters shorts-like videos out of the returned video list', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'short-video',
              contentDetails: {
                duration: 'PT2M40S',
              },
              snippet: {
                title: 'quick clip',
                channelTitle: 'alpha',
                categoryId: '20',
                thumbnails: {
                  default: { url: 'https://example.com/1.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/1.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/1.jpg', width: 480, height: 360 },
                },
              },
            },
            {
              id: 'normal-video',
              contentDetails: {
                duration: 'PT5M12S',
              },
              snippet: {
                title: 'full review',
                channelTitle: 'beta',
                categoryId: '20',
                thumbnails: {
                  default: { url: 'https://example.com/2.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/2.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/2.jpg', width: 480, height: 360 },
                },
              },
            },
          ],
        }),
      }),
    );

    const section = await fetchPopularVideosByCategory(
      'US',
      {
        id: 'gaming',
        label: '게임',
        description: '게임',
        sourceIds: ['20'],
      },
    );

    expect(section.items.map((item) => item.id)).toEqual(['normal-video']);
  });

  it('filters title-based shorts markers even when the duration is longer than 3 minutes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'keyword-short',
              contentDetails: {
                duration: 'PT4M10S',
              },
              snippet: {
                title: 'best moments short',
                channelTitle: 'alpha',
                categoryId: '20',
                thumbnails: {
                  default: { url: 'https://example.com/1.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/1.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/1.jpg', width: 480, height: 360 },
                },
              },
            },
            {
              id: 'full-video',
              contentDetails: {
                duration: 'PT6M5S',
              },
              snippet: {
                title: 'complete breakdown',
                channelTitle: 'beta',
                categoryId: '20',
                thumbnails: {
                  default: { url: 'https://example.com/2.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/2.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/2.jpg', width: 480, height: 360 },
                },
              },
            },
          ],
        }),
      }),
    );

    const section = await fetchPopularVideosByCategory(
      'US',
      {
        id: 'gaming',
        label: '게임',
        description: '게임',
        sourceIds: ['20'],
      },
    );

    expect(section.items.map((item) => item.id)).toEqual(['full-video']);
  });

  it('keeps requesting additional pages until a minimum number of non-shorts videos is collected', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'first-page-video-1',
              contentDetails: {
                duration: 'PT5M12S',
              },
              snippet: {
                title: 'full review 1',
                channelTitle: 'alpha',
                categoryId: '20',
                thumbnails: {
                  default: { url: 'https://example.com/1.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/1.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/1.jpg', width: 480, height: 360 },
                },
              },
            },
            {
              id: 'first-page-video-2',
              contentDetails: {
                duration: 'PT6M5S',
              },
              snippet: {
                title: 'full review 2',
                channelTitle: 'beta',
                categoryId: '20',
                thumbnails: {
                  default: { url: 'https://example.com/2.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/2.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/2.jpg', width: 480, height: 360 },
                },
              },
            },
          ],
          nextPageToken: 'page-2',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: Array.from({ length: 10 }, (_, index) => ({
            id: `second-page-video-${index + 1}`,
            contentDetails: {
              duration: 'PT4M30S',
            },
            snippet: {
              title: `full review ${index + 3}`,
              channelTitle: `channel-${index + 1}`,
              categoryId: '20',
              thumbnails: {
                default: { url: 'https://example.com/3.jpg', width: 120, height: 90 },
                medium: { url: 'https://example.com/3.jpg', width: 320, height: 180 },
                high: { url: 'https://example.com/3.jpg', width: 480, height: 360 },
              },
            },
          })),
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const section = await fetchPopularVideosByCategory('US', {
      id: 'gaming',
      label: '게임',
      description: '게임',
      sourceIds: ['20'],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(section.items).toHaveLength(12);
  });

  it('requests the next api page when the current page only contains shorts', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'shorts-only',
              contentDetails: {
                duration: 'PT12S',
              },
              snippet: {
                title: '#shorts teaser',
                channelTitle: 'alpha',
                categoryId: '24',
                thumbnails: {
                  default: { url: 'https://example.com/1.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/1.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/1.jpg', width: 480, height: 360 },
                },
              },
            },
          ],
          nextPageToken: 'page-2',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'long-video',
              contentDetails: {
                duration: 'PT4M30S',
              },
              snippet: {
                title: 'episode highlight',
                channelTitle: 'beta',
                categoryId: '24',
                thumbnails: {
                  default: { url: 'https://example.com/2.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/2.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/2.jpg', width: 480, height: 360 },
                },
              },
            },
          ],
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const section = await fetchPopularVideosByCategory(
      'KR',
      {
        id: 'entertainment',
        label: '엔터테인먼트',
        description: '엔터테인먼트',
        sourceIds: ['24'],
      },
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(section.items.map((item) => item.id)).toEqual(['long-video']);
  });

  it('fetches videos from every source category in a merged top-level category', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'ent-video',
              contentDetails: {
                duration: 'PT7M10S',
              },
              snippet: {
                title: 'variety clip',
                channelTitle: 'alpha',
                categoryId: '24',
                thumbnails: {
                  default: { url: 'https://example.com/1.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/1.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/1.jpg', width: 480, height: 360 },
                },
              },
            },
          ],
          nextPageToken: 'ent-page-2',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'travel-video',
              contentDetails: {
                duration: 'PT8M5S',
              },
              snippet: {
                title: 'travel vlog',
                channelTitle: 'beta',
                categoryId: '19',
                thumbnails: {
                  default: { url: 'https://example.com/2.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/2.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/2.jpg', width: 480, height: 360 },
                },
              },
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'ent-video-2',
              contentDetails: {
                duration: 'PT6M40S',
              },
              snippet: {
                title: 'variety clip 2',
                channelTitle: 'gamma',
                categoryId: '24',
                thumbnails: {
                  default: { url: 'https://example.com/3.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/3.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/3.jpg', width: 480, height: 360 },
                },
              },
            },
          ],
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const firstSection = await fetchPopularVideosByCategory('KR', {
      id: 'entertainment',
      label: '엔터테인먼트',
      description: '엔터테인먼트',
      sourceIds: ['24', '19'],
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(firstSection.items.map((item) => item.id)).toEqual(['ent-video', 'ent-video-2', 'travel-video']);
    expect(firstSection.nextPageToken).toBeUndefined();

    const firstRequestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    const secondRequestUrl = new URL(fetchMock.mock.calls[1][0] as string);
    const thirdRequestUrl = new URL(fetchMock.mock.calls[2][0] as string);

    expect(firstRequestUrl.searchParams.get('videoCategoryId')).toBe('24');
    expect(secondRequestUrl.searchParams.get('videoCategoryId')).toBe('19');
    expect(thirdRequestUrl.searchParams.get('videoCategoryId')).toBe('24');
    expect(thirdRequestUrl.searchParams.get('pageToken')).toBe('ent-page-2');
  });

  it('skips unsupported source categories inside a merged category instead of failing the whole request', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            message: 'The requested video chart is not supported or is not available.',
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'creator-video',
              contentDetails: {
                duration: 'PT9M2S',
              },
              snippet: {
                title: 'creator vlog',
                channelTitle: 'beta',
                categoryId: '22',
                thumbnails: {
                  default: { url: 'https://example.com/2.jpg', width: 120, height: 90 },
                  medium: { url: 'https://example.com/2.jpg', width: 320, height: 180 },
                  high: { url: 'https://example.com/2.jpg', width: 480, height: 360 },
                },
              },
            },
          ],
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const section = await fetchPopularVideosByCategory('KR', {
      id: 'entertainment',
      label: '엔터테인먼트',
      description: '엔터테인먼트',
      sourceIds: ['43', '22'],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(section.items.map((item) => item.id)).toEqual(['creator-video']);
  });

  it('fetches overall rankings without sending a category filter for the synthetic all category', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          {
            id: 'overall-video',
            contentDetails: {
              duration: 'PT9M1S',
            },
            snippet: {
              title: 'global ranking video',
              channelTitle: 'gamma',
              categoryId: '10',
              thumbnails: {
                default: { url: 'https://example.com/3.jpg', width: 120, height: 90 },
                medium: { url: 'https://example.com/3.jpg', width: 320, height: 180 },
                high: { url: 'https://example.com/3.jpg', width: 480, height: 360 },
              },
            },
          },
        ],
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await fetchPopularVideosByCategory(
      'JP',
      {
        id: '0',
        label: '전체',
        description: '전체',
        sourceIds: [],
      },
    );

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);

    expect(requestUrl.searchParams.get('videoCategoryId')).toBeNull();
  });
});
