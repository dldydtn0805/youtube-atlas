import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HomePlaybackSection from './HomePlaybackSection';

vi.mock('./ContentPanels', () => ({
  ChartPanel: () => <div data-testid="chart-panel" />,
  CommunityPanel: () => <div data-testid="community-panel" />,
}));

vi.mock('./FilterPanels', () => ({
  FilterBar: () => <div data-testid="filter-bar" />,
}));

vi.mock('./PlayerStage', () => ({
  default: ({ playerViewportRef }: { playerViewportRef: React.RefObject<HTMLDivElement | null> }) => (
    <div data-testid="player-stage">
      <div ref={playerViewportRef} data-testid="player-viewport" />
    </div>
  ),
}));

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    void callback;
  }
}

describe('HomePlaybackSection', () => {
  const originalOffsetHeightDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
  let animationFrameCallbacks = new Map<number, FrameRequestCallback>();
  let nextAnimationFrameId = 1;

  const flushAnimationFrames = () => {
    const callbacks = Array.from(animationFrameCallbacks.values());
    animationFrameCallbacks.clear();
    callbacks.forEach((callback) => callback(0));
  };

  beforeEach(() => {
    animationFrameCallbacks = new Map<number, FrameRequestCallback>();
    nextAnimationFrameId = 1;

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      const frameId = nextAnimationFrameId;
      nextAnimationFrameId += 1;
      animationFrameCallbacks.set(frameId, callback);
      return frameId;
    });
    vi.stubGlobal('cancelAnimationFrame', (frameId: number) => {
      animationFrameCallbacks.delete(frameId);
    });

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return this.classList.contains('app-shell__sticky-selected-video-slot') ? 132 : 0;
      },
    });
  });

  afterEach(() => {
    if (originalOffsetHeightDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeightDescriptor);
    }

    vi.unstubAllGlobals();
  });

  it('keeps the sticky selected video visible through its own layout shift near the threshold', async () => {
    render(
      <HomePlaybackSection
        chartPanelProps={{} as never}
        communityPanelProps={{} as never}
        filterBarProps={{} as never}
        playerStageProps={
          {
            isCinematicModeActive: false,
            playerSectionRef: createRef<HTMLElement>(),
            playerStageRef: createRef<HTMLDivElement>(),
            playerViewportRef: createRef<HTMLDivElement>(),
          } as never
        }
        stickySelectedVideoContent={<div>Selected video actions</div>}
      />,
    );

    const playerViewport = screen.getByTestId('player-viewport');
    let viewportBottom = 48;

    vi.spyOn(playerViewport, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          bottom: viewportBottom,
          height: 0,
          left: 0,
          right: 0,
          top: 0,
          width: 0,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect,
    );

    flushAnimationFrames();
    expect(screen.queryByText('Selected video actions')).not.toBeInTheDocument();

    viewportBottom = 0;
    window.dispatchEvent(new Event('scroll'));
    flushAnimationFrames();

    await waitFor(() => {
      expect(screen.getByText('Selected video actions')).toBeInTheDocument();
    });

    viewportBottom = 140;
    window.dispatchEvent(new Event('scroll'));
    flushAnimationFrames();

    await waitFor(() => {
      expect(screen.getByText('Selected video actions')).toBeInTheDocument();
    });

    viewportBottom = 200;
    window.dispatchEvent(new Event('scroll'));
    flushAnimationFrames();

    await waitFor(() => {
      expect(screen.queryByText('Selected video actions')).not.toBeInTheDocument();
    });
  });
});
