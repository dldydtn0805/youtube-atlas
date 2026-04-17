import { describe, expect, it } from 'vitest';
import { buildChartTrendSignalsByVideoId } from './useHomeTrendSections';

describe('buildChartTrendSignalsByVideoId', () => {
  it('keeps the selected chart signal map untouched', () => {
    const chartSignalsByVideoId = buildChartTrendSignalsByVideoId(true, {
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
    });

    expect(chartSignalsByVideoId['video-1']?.rankChange).toBe(-6);
  });

  it('returns an empty signal map when trend signals are not supported', () => {
    expect(
      buildChartTrendSignalsByVideoId(false, {
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
      }),
    ).toEqual({});
  });
});
