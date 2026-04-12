import { act } from 'react';
import { render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MiniVideoPreview, { resetMiniVideoPreviewSingletonForTests } from './MiniVideoPreview';

type MockPreviewPlayerApi = {
  destroy: ReturnType<typeof vi.fn>;
  mute: ReturnType<typeof vi.fn>;
  setPlaybackQuality: ReturnType<typeof vi.fn>;
};

describe('MiniVideoPreview', () => {
  let onReady: YT.PlayerEvents['onReady'];
  let playerApis: MockPreviewPlayerApi[] = [];
  let createdVideoIds: Array<string | undefined> = [];
  let playerConstructorCallCount = 0;

  beforeEach(() => {
    playerApis = [];
    createdVideoIds = [];
    playerConstructorCallCount = 0;
    onReady = undefined;

    function Player(this: MockPreviewPlayerApi, _element: HTMLElement, configuration: YT.PlayerOptions) {
      playerConstructorCallCount += 1;
      onReady = configuration.events?.onReady;
      createdVideoIds.push(typeof configuration.videoId === 'string' ? configuration.videoId : undefined);

      this.destroy = vi.fn();
      this.mute = vi.fn();
      this.setPlaybackQuality = vi.fn();
      playerApis.push({
        destroy: this.destroy,
        mute: this.mute,
        setPlaybackQuality: this.setPlaybackQuality,
      });
    }

    Object.defineProperty(window, 'YT', {
      configurable: true,
      value: {
        Player,
      },
    });
  });

  afterEach(() => {
    resetMiniVideoPreviewSingletonForTests();
    delete (window as Window & { YT?: unknown }).YT;
  });

  it('creates a new preview player for a newly selected video', async () => {
    const firstRender = render(
      <MiniVideoPreview
        containerClassName="preview-shell"
        frameClassName="preview-frame"
        selectedVideoId="video-a"
      />,
    );

    await waitFor(() => expect(playerConstructorCallCount).toBe(1));

    act(() => {
      onReady?.({ target: playerApis[0] as unknown as YT.Player });
    });

    firstRender.unmount();

    expect(playerApis[0]?.destroy).toHaveBeenCalled();

    render(
      <MiniVideoPreview
        containerClassName="preview-shell"
        frameClassName="preview-frame"
        selectedVideoId="video-b"
      />,
    );

    await waitFor(() => expect(playerConstructorCallCount).toBe(2));
    expect(createdVideoIds).toEqual(['video-a', 'video-b']);
  });

  it('recreates the preview player when the selected video changes', async () => {
    const { rerender, unmount } = render(
      <MiniVideoPreview
        containerClassName="preview-shell"
        frameClassName="preview-frame"
        selectedVideoId="video-a"
      />,
    );

    await waitFor(() => expect(playerConstructorCallCount).toBe(1));

    act(() => {
      onReady?.({ target: playerApis[0] as unknown as YT.Player });
    });

    rerender(
      <MiniVideoPreview
        containerClassName="preview-shell"
        frameClassName="preview-frame"
        selectedVideoId="video-b"
      />,
    );

    await waitFor(() => expect(playerConstructorCallCount).toBe(2));
    expect(createdVideoIds).toEqual(['video-a', 'video-b']);

    unmount();
    expect(playerApis[0]?.destroy).toHaveBeenCalled();
    expect(playerApis[1]?.destroy).toHaveBeenCalled();
  });

  it('recreates the player when remounted into another slot with the same video', async () => {
    const firstRender = render(
      <MiniVideoPreview
        containerClassName="preview-shell"
        frameClassName="preview-frame"
        selectedVideoId="video-a"
      />,
    );

    await waitFor(() => expect(playerConstructorCallCount).toBe(1));

    act(() => {
      onReady?.({ target: playerApis[0] as unknown as YT.Player });
    });

    firstRender.unmount();

    render(
      <MiniVideoPreview
        containerClassName="preview-shell"
        frameClassName="preview-frame"
        selectedVideoId="video-a"
      />,
    );

    await waitFor(() => expect(playerConstructorCallCount).toBe(2));
    expect(createdVideoIds).toEqual(['video-a', 'video-a']);
  });

  it('applies mute and low quality when the player becomes ready', async () => {
    const firstRender = render(
      <MiniVideoPreview
        containerClassName="preview-shell"
        frameClassName="preview-frame"
        selectedVideoId="video-a"
      />,
    );

    await waitFor(() => expect(playerConstructorCallCount).toBe(1));

    act(() => {
      onReady?.({ target: playerApis[0] as unknown as YT.Player });
    });

    expect(playerApis[0]?.mute).toHaveBeenCalled();
    expect(playerApis[0]?.setPlaybackQuality).toHaveBeenCalledWith('small');
    firstRender.unmount();
  });
});
