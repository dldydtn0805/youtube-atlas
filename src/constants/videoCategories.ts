export interface VideoCategory {
  id: string;
  label: string;
  description: string;
  sourceIds: string[];
}

export const ALL_VIDEO_CATEGORY_ID = '0';

export const ALL_VIDEO_CATEGORY: VideoCategory = {
  id: ALL_VIDEO_CATEGORY_ID,
  label: '전체',
  description: '카테고리 구분 없이 현재 국가 전체 인기 영상을 보여줍니다.',
  sourceIds: [],
};

interface VideoCategoryMetadata {
  groupId?: string;
  label: string;
  description: string;
  priority?: number;
}

interface VideoCategorySnippetLike {
  title: string;
  assignable: boolean;
}

interface VideoCategoryLike {
  id: string;
  snippet: VideoCategorySnippetLike;
}

const CATEGORY_METADATA_BY_ID: Record<string, VideoCategoryMetadata> = {
  '1': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 영화, 애니메이션 등 대중적인 인기 영상을 모아봅니다.',
    priority: 4,
  },
  '2': {
    groupId: 'automotive',
    label: '자동차',
    description: '자동차 리뷰, 시승기, 모빌리티 중심의 인기 영상을 모아봅니다.',
    priority: 1,
  },
  '10': {
    groupId: 'music',
    label: '음악',
    description: '뮤직비디오, 라이브, 음원 관련 인기 영상을 확인할 수 있습니다.',
    priority: 1,
  },
  '15': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 18,
  },
  '17': {
    groupId: 'sports',
    label: '스포츠',
    description: '경기 하이라이트와 스포츠 이슈 중심의 인기 영상을 확인할 수 있습니다.',
    priority: 1,
  },
  '19': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 19,
  },
  '20': {
    groupId: 'gaming',
    label: '게임',
    description: '게임 방송, 리뷰, 신작 반응 등 게임 인기 영상을 확인할 수 있습니다.',
    priority: 1,
  },
  '22': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 20,
  },
  '23': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 2,
  },
  '24': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 1,
  },
  '25': {
    groupId: 'news',
    label: '뉴스/시사',
    description: '뉴스, 시사, 공공 이슈 중심의 인기 영상을 확인할 수 있습니다.',
    priority: 1,
  },
  '26': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 21,
  },
  '28': {
    groupId: 'technology',
    label: '테크',
    description: '과학 이슈, 기술 리뷰, IT 트렌드 중심의 인기 영상을 모아봅니다.',
    priority: 1,
  },
  '29': {
    groupId: 'social',
    label: '사회/공익',
    description: '공익 활동과 사회적 메시지를 담은 인기 영상을 모아봅니다.',
    priority: 1,
  },
  '30': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 5,
  },
  '31': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 6,
  },
  '32': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 7,
  },
  '33': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 8,
  },
  '34': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 9,
  },
  '35': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 10,
  },
  '36': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 11,
  },
  '37': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 12,
  },
  '38': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 13,
  },
  '39': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 14,
  },
  '40': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 15,
  },
  '41': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 16,
  },
  '42': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 99,
  },
  '43': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 3,
  },
  '44': {
    groupId: 'entertainment',
    label: '엔터테인먼트',
    description: '예능, 코미디, 라이프스타일, 여행, 영화 등 대중적인 인기 영상을 모아봅니다.',
    priority: 17,
  },
};

function buildFallbackDescription(label: string) {
  return `${label} 카테고리 인기 영상을 확인할 수 있습니다.`;
}

export function toVideoCategory(category: VideoCategoryLike): VideoCategory | null {
  if (!category.snippet.assignable) {
    return null;
  }

  const metadata = CATEGORY_METADATA_BY_ID[category.id];
  const id = metadata?.groupId ?? category.id;
  const label = metadata?.label ?? category.snippet.title;

  return {
    id,
    label,
    description: metadata?.description ?? buildFallbackDescription(label),
    sourceIds: [category.id],
  };
}

function getCategoryPriority(sourceId: string) {
  return CATEGORY_METADATA_BY_ID[sourceId]?.priority ?? Number.MAX_SAFE_INTEGER;
}

export function mergeVideoCategories(categories: VideoCategory[]) {
  const merged = new Map<string, VideoCategory>();

  for (const category of categories) {
    const existing = merged.get(category.id);

    if (!existing) {
      merged.set(category.id, category);
      continue;
    }

    const sourceIds = [...new Set([...existing.sourceIds, ...category.sourceIds])].sort((left, right) => {
      const priorityDiff = getCategoryPriority(left) - getCategoryPriority(right);

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return left.localeCompare(right, 'en');
    });

    merged.set(category.id, {
      ...existing,
      sourceIds,
    });
  }

  return [...merged.values()];
}
