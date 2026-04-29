import { describe, expect, it } from 'vitest';
import { buildChartTrendSignalsByVideoId, mapInlineTrendSignalsByVideoId } from './useHomeTrendSections';

describe('buildChartTrendSignalsByVideoId', () => {
  it('keeps the selected chart signal map untouched', () => {
    const chartSignalsByVideoId = buildChartTrendSignalsByVideoId(
      true,
      {},
      {
        'video-1': {
          categoryId: '0',
          categoryLabel: '전체',
          capturedAt: '2026-04-17T09:00:00.000Z',
          currentRank: 15,
          currentViewCount: 1500,
          isNew: false,
          previousRank: 9,
          previousViewCount: 1200,
          rankChange: -6,
          regionCode: 'KR',
          videoId: 'video-1',
          viewCountDelta: 300,
        },
      },
    );

    expect(chartSignalsByVideoId['video-1']?.rankChange).toBe(-6);
  });

  it('prefers inline chart response trend data over separately fetched signals', () => {
    const chartSignalsByVideoId = buildChartTrendSignalsByVideoId(
      true,
      {
        'video-1': {
          categoryId: '0',
          categoryLabel: '전체',
          capturedAt: '2026-04-17T10:00:00.000Z',
          currentRank: 8,
          currentViewCount: 1800,
          isNew: false,
          previousRank: 12,
          previousViewCount: 1200,
          rankChange: 4,
          regionCode: 'KR',
          videoId: 'video-1',
          viewCountDelta: 600,
        },
      },
      {
        'video-1': {
          categoryId: '0',
          categoryLabel: '전체',
          capturedAt: '2026-04-17T09:00:00.000Z',
          currentRank: 15,
          currentViewCount: 1500,
          isNew: false,
          previousRank: 9,
          previousViewCount: 1200,
          rankChange: -6,
          regionCode: 'KR',
          videoId: 'video-1',
          viewCountDelta: 300,
        },
      },
    );

    expect(chartSignalsByVideoId['video-1']?.currentRank).toBe(8);
  });

  it('returns an empty signal map when trend signals are not supported', () => {
    expect(
      buildChartTrendSignalsByVideoId(
        false,
        {},
        {
          'video-1': {
            categoryId: '0',
            categoryLabel: '전체',
            capturedAt: '2026-04-17T09:00:00.000Z',
            currentRank: 15,
            currentViewCount: 1500,
            isNew: false,
            previousRank: 9,
            previousViewCount: 1200,
            rankChange: -6,
            regionCode: 'KR',
            videoId: 'video-1',
            viewCountDelta: 300,
          },
        },
      ),
    ).toEqual({});
  });
});

describe('mapInlineTrendSignalsByVideoId', () => {
  it('maps current ranks from the chart list response immediately', () => {
    const signalsByVideoId = mapInlineTrendSignalsByVideoId(
      {
        categoryId: '0',
        description: 'TOP 200',
        label: 'TOP 200',
        items: [
          {
            id: 'video-1',
            contentDetails: { duration: '' },
            statistics: { viewCount: '1000' },
            snippet: {
              title: 'Video 1',
              channelTitle: 'Channel',
              channelId: 'channel-1',
              categoryId: '10',
              thumbnails: {
                default: { url: 'https://example.com/default.jpg', width: 120, height: 90 },
                medium: { url: 'https://example.com/medium.jpg', width: 320, height: 180 },
                high: { url: 'https://example.com/high.jpg', width: 480, height: 360 },
              },
            },
            trend: {
              currentRank: 51,
              previousRank: 60,
              rankChange: 9,
              capturedAt: '2026-04-17T10:00:00.000Z',
            },
          },
        ],
      },
      'KR',
      '0',
    );

    expect(signalsByVideoId['video-1']?.currentRank).toBe(51);
    expect(signalsByVideoId['video-1']?.rankChange).toBe(9);
  });
});
