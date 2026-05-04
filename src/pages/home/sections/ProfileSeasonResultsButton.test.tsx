import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProfileSeasonResultsButton from './ProfileSeasonResultsButton';

describe('ProfileSeasonResultsButton', () => {
  it('opens season records from the profile card', () => {
    const onOpen = vi.fn();

    render(<ProfileSeasonResultsButton onOpen={onOpen} resultCount={3} />);

    fireEvent.click(screen.getByRole('button', { name: '지난 시즌 기록 열기' }));

    expect(screen.getByText('지난 시즌')).toBeInTheDocument();
    expect(screen.getByText('3개')).toBeInTheDocument();
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
