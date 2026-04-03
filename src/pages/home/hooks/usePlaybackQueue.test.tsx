import { act, renderHook, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { VideoCategory } from '../../../constants/videoCategories';
import type { YouTubeCategorySection, YouTubeVideoItem } from '../../../features/youtube/types';
import { GAME_PORTFOLIO_QUEUE_ID, getCategoryPlaybackQueueId } from '../utils';
import usePlaybackQueue from './usePlaybackQueue';

function createVideo(id: string, categoryId: string): YouTubeVideoItem {
  return {
    id,
    contentDetails: {
      duration: '',
    },
    snippet: {
      categoryId,
      channelId: 'channel-1',
      channelTitle: 'Channel',
      thumbnails: {
        default: { url: 'https://example.com/default.jpg', width: 120, height: 90 },
        high: { url: 'https://example.com/high.jpg', width: 480, height: 360 },
        medium: { url: 'https://example.com/medium.jpg', width: 320, height: 180 },
      },
      title: `Video ${id}`,
    },
  };
}

function createSection(categoryId: string, videoIds: string[]): YouTubeCategorySection {
  return {
    categoryId,
    description: 'Section',
    items: videoIds.map((videoId) => createVideo(videoId, categoryId)),
    label: categoryId,
  };
}

describe('usePlaybackQueue', () => {
  const sortedVideoCategories: VideoCategory[] = [
    { id: '0', label: 'All', description: 'All videos', sourceIds: [] },
    { id: '10', label: 'Music', description: 'Music videos', sourceIds: [] },
  ];

  it('does not auto-select the top chart video on initial load', () => {
    const setSelectedCategoryId = vi.fn();
    const { result } = renderHook(() =>
      usePlaybackQueue({
        favoriteStreamerVideoSection: undefined,
        isMobileLayout: false,
        playerSectionRef: createRef<HTMLElement>(),
        playerViewportRef: createRef<HTMLDivElement>(),
        realtimeSurgingSection: undefined,
        restoredPlaybackVideo: undefined,
        selectedCategoryId: '0',
        selectedSection: createSection(getCategoryPlaybackQueueId('0'), ['video-top']),
        setSelectedCategoryId,
        sortedVideoCategories,
      }),
    );

    expect(result.current.selectedVideoId).toBeUndefined();
  });

  it('auto-selects the first video after a user changes category', async () => {
    const setSelectedCategoryId = vi.fn();
    let selectedCategoryId = '0';
    let selectedSection = createSection(getCategoryPlaybackQueueId('0'), ['video-top']);

    const { result, rerender } = renderHook(() =>
      usePlaybackQueue({
        favoriteStreamerVideoSection: undefined,
        isMobileLayout: false,
        playerSectionRef: createRef<HTMLElement>(),
        playerViewportRef: createRef<HTMLDivElement>(),
        realtimeSurgingSection: undefined,
        restoredPlaybackVideo: undefined,
        selectedCategoryId,
        selectedSection,
        setSelectedCategoryId: (categoryId) => {
          selectedCategoryId = categoryId;
          setSelectedCategoryId(categoryId);
        },
        sortedVideoCategories,
      }),
    );

    act(() => {
      result.current.handleSelectCategory('10');
    });

    rerender();

    expect(result.current.selectedVideoId).toBeUndefined();

    selectedSection = createSection(getCategoryPlaybackQueueId('10'), ['video-music']);
    rerender();

    await waitFor(() => {
      expect(result.current.selectedVideoId).toBe('video-music');
    });
  });

  it('waits for the selected category chart instead of auto-selecting an owned video', async () => {
    const setSelectedCategoryId = vi.fn();
    let selectedCategoryId = '0';
    let selectedSection = createSection(getCategoryPlaybackQueueId('0'), ['video-top']);

    const { result, rerender } = renderHook(() =>
      usePlaybackQueue({
        favoriteStreamerVideoSection: undefined,
        gamePortfolioSection: createSection(GAME_PORTFOLIO_QUEUE_ID, ['video-owned']),
        isMobileLayout: false,
        playerSectionRef: createRef<HTMLElement>(),
        playerViewportRef: createRef<HTMLDivElement>(),
        realtimeSurgingSection: undefined,
        restoredPlaybackVideo: undefined,
        selectedCategoryId,
        selectedSection,
        setSelectedCategoryId: (categoryId) => {
          selectedCategoryId = categoryId;
          setSelectedCategoryId(categoryId);
        },
        sortedVideoCategories,
      }),
    );

    act(() => {
      result.current.handleSelectCategory('10');
    });

    rerender();

    expect(result.current.selectedVideoId).toBeUndefined();

    selectedSection = createSection(getCategoryPlaybackQueueId('10'), ['video-music']);
    rerender();

    await waitFor(() => {
      expect(result.current.selectedVideoId).toBe('video-music');
    });
  });

  it('scrolls to the player immediately when a category is selected', () => {
    vi.useFakeTimers();

    const setSelectedCategoryId = vi.fn();
    let selectedCategoryId = '0';
    const scrollIntoView = vi.fn();
    const playerSectionRef = {
      current: {
        scrollIntoView,
      } as unknown as HTMLElement,
    };

    const { result } = renderHook(() =>
      usePlaybackQueue({
        favoriteStreamerVideoSection: undefined,
        isMobileLayout: false,
        playerSectionRef,
        playerViewportRef: createRef<HTMLDivElement>(),
        realtimeSurgingSection: undefined,
        restoredPlaybackVideo: undefined,
        selectedCategoryId,
        selectedSection: createSection(getCategoryPlaybackQueueId('0'), ['video-top']),
        setSelectedCategoryId: (categoryId) => {
          selectedCategoryId = categoryId;
          setSelectedCategoryId(categoryId);
        },
        sortedVideoCategories,
      }),
    );

    act(() => {
      result.current.handleSelectCategory('10');
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    vi.useRealTimers();
  });
});
