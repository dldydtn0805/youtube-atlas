import { describe, expect, it } from 'vitest';
import { mergeVideoCategories, toVideoCategory } from './videoCategories';

describe('toVideoCategory', () => {
  it('maps known category ids to localized labels and descriptions', () => {
    expect(
      toVideoCategory({
        id: '20',
        snippet: {
          assignable: true,
          title: 'Gaming',
        },
      }),
    ).toEqual({
      id: 'gaming',
      label: '게임',
      description: '게임 방송, 리뷰, 신작 반응 등 게임 인기 영상을 확인할 수 있습니다.',
      sourceIds: ['20'],
    });
  });

  it('filters out categories that cannot be assigned to videos', () => {
    expect(
      toVideoCategory({
        id: '44',
        snippet: {
          assignable: false,
          title: 'Trailers',
        },
      }),
    ).toBeNull();
  });

  it('falls back to the api title for unknown categories', () => {
    expect(
      toVideoCategory({
        id: '999',
        snippet: {
          assignable: true,
          title: 'Experimental',
        },
      }),
    ).toEqual({
      id: '999',
      label: 'Experimental',
      description: 'Experimental 카테고리 인기 영상을 확인할 수 있습니다.',
      sourceIds: ['999'],
    });
  });
});

describe('mergeVideoCategories', () => {
  it('merges detailed youtube categories into one top-level category and keeps the preferred source first', () => {
    expect(
      mergeVideoCategories([
        {
          id: 'entertainment',
          label: '엔터테인먼트',
          description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
          sourceIds: ['23'],
        },
        {
          id: 'entertainment',
          label: '엔터테인먼트',
          description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
          sourceIds: ['24'],
        },
      ]),
    ).toEqual([
      {
        id: 'entertainment',
        label: '엔터테인먼트',
        description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
        sourceIds: ['24', '23'],
      },
    ]);
  });
});
