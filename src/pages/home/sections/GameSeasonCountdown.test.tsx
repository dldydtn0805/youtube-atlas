import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import GameSeasonCountdown from './GameSeasonCountdown';
import { formatSeasonTimeLeft } from './gameSeasonCountdownFormat';

describe('GameSeasonCountdown', () => {
  it('formats the remaining season time by largest useful units', () => {
    const nowMs = new Date('2026-04-01T00:00:00.000Z').getTime();

    expect(formatSeasonTimeLeft('2026-04-03T05:10:00.000Z', nowMs)).toBe('2일 5시간 남음');
    expect(formatSeasonTimeLeft('2026-04-01T03:20:00.000Z', nowMs)).toBe('3시간 20분 남음');
    expect(formatSeasonTimeLeft('2026-04-01T00:09:00.000Z', nowMs)).toBe('9분 남음');
    expect(formatSeasonTimeLeft('2026-04-01T00:00:30.000Z', nowMs)).toBe('1분 미만 남음');
  });

  it('shows that the season has ended after the end time', () => {
    const nowMs = new Date('2026-04-02T00:00:00.000Z').getTime();

    expect(formatSeasonTimeLeft('2026-04-01T00:00:00.000Z', nowMs)).toBe('시즌 종료');
  });

  it('renders the countdown label', () => {
    render(<GameSeasonCountdown endAt="2099-04-01T00:00:00.000Z" />);

    expect(screen.getByText(/남음$/)).toBeInTheDocument();
  });
});
