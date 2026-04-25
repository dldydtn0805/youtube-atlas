import { fireEvent, render, screen } from '@testing-library/react';
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

  it('moves to the next tab when the modal panel is swiped left', () => {
    render(
      <GameTierModal
        highlightsContent={<div>하이라이트 목록</div>}
        isOpen
        onClose={() => undefined}
        rankingContent={<div>랭킹 목록</div>}
        tierProgress={tierProgress}
      />,
    );

    const panel = screen.getByRole('tabpanel');

    fireEvent.pointerDown(panel, { clientX: 220, clientY: 32, pointerId: 1 });
    fireEvent.pointerMove(panel, { clientX: 120, clientY: 36, pointerId: 1 });
    fireEvent.pointerUp(panel, { clientX: 120, clientY: 36, pointerId: 1 });

    expect(screen.getByText('하이라이트 목록')).toBeInTheDocument();
  });

  it('wraps from the first tab to the last tab on swipe right', () => {
    render(
      <GameTierModal
        highlightsContent={<div>하이라이트 목록</div>}
        isOpen
        onClose={() => undefined}
        rankingContent={<div>랭킹 목록</div>}
        tierProgress={tierProgress}
      />,
    );

    const panel = screen.getByRole('tabpanel');

    fireEvent.pointerDown(panel, { clientX: 120, clientY: 32, pointerId: 2 });
    fireEvent.pointerMove(panel, { clientX: 220, clientY: 36, pointerId: 2 });
    fireEvent.pointerUp(panel, { clientX: 220, clientY: 36, pointerId: 2 });

    expect(screen.getByText('랭킹 목록')).toBeInTheDocument();
  });
});
