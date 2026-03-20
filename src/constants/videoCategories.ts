export interface VideoCategory {
  id: string;
  label: string;
  description: string;
}

export const videoCategories: VideoCategory[] = [
  {
    id: '10',
    label: '음악',
    description: '현재 국가에서 많이 보는 음악 카테고리 인기 영상입니다.',
  },
  {
    id: '24',
    label: '예능',
    description: '엔터테인먼트 중심의 인기 영상을 따로 모았습니다.',
  },
  {
    id: '17',
    label: '스포츠',
    description: '경기 하이라이트와 스포츠 이슈 영상을 확인할 수 있습니다.',
  },
  {
    id: '20',
    label: '게임',
    description: '게임 방송, 리뷰, 신작 반응 등 게임 카테고리 인기 영상입니다.',
  },
];
