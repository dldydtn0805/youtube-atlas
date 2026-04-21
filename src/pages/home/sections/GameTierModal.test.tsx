import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { GameTierProgress } from '../../../features/game/types';
import GameTierModal from './GameTierModal';

const tierProgress: GameTierProgress = {
  currentTier: {
    badgeCode: 'BRONZE',
    displayName: '브론즈',
    minScore: 0,
    profileThemeCode: 'BRONZE',
    tierCode: 'BRONZE',
    titleCode: 'BRONZE',
  },
  highlightScore: 1200,
  nextTier: null,
  regionCode: 'KR',
  seasonId: 1,
  seasonName: '테스트 시즌',
  tiers: [],
};

describe('GameTierModal', () => {
  it('shows highlight tier guidance in the tier modal', () => {
    render(<GameTierModal isOpen onClose={() => undefined} tierProgress={tierProgress} />);

    expect(screen.getByRole('heading', { name: '티어' })).toBeInTheDocument();
    expect(screen.getByText('하이라이트 티어 기준')).toBeInTheDocument();
    expect(screen.getByText('하이라이트 점수로 티어가 정해집니다')).toBeInTheDocument();
  });

  it('shows the highlights tab when highlight content is provided', () => {
    render(
      <GameTierModal
        highlightsContent={<div>하이라이트 목록</div>}
        isOpen
        onClose={() => undefined}
        tierProgress={tierProgress}
      />,
    );

    expect(screen.getByRole('tab', { name: '하이라이트' })).toBeInTheDocument();
  });
});
