import { useEffect, useRef, useState, type RefObject } from 'react';
import type { VideoPlayerHandle } from '../../../components/VideoPlayer/VideoPlayer';

let miniVideoPreviewApiPromise: Promise<void> | undefined;
const MINI_VIDEO_PREVIEW_LOWEST_QUALITY = 'small';
const YOUTUBE_IFRAME_ALLOW_VALUE =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

function loadMiniVideoPreviewApi() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (miniVideoPreviewApiPromise) {
    return miniVideoPreviewApiPromise;
  }

  miniVideoPreviewApiPromise = new Promise<void>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.append(script);
    }

    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };
  });

  return miniVideoPreviewApiPromise;
}

function applyYouTubeIframePermissions(player: YT.Player) {
  const iframe = (player as YT.Player & { getIframe?: () => HTMLIFrameElement }).getIframe?.();

  if (!iframe) {
    return;
  }

  iframe.allow = YOUTUBE_IFRAME_ALLOW_VALUE;
}

export function resetMiniVideoPreviewSingletonForTests() {
  miniVideoPreviewApiPromise = undefined;
}

interface MiniVideoPreviewProps {
  containerClassName: string;
  frameClassName: string;
  mainPlayerRef?: RefObject<VideoPlayerHandle | null>;
  selectedVideoId: string;
}

export default function MiniVideoPreview({
  containerClassName,
  frameClassName,
  mainPlayerRef,
  selectedVideoId,
}: MiniVideoPreviewProps) {
  const previewSlotRefs = useRef<[HTMLDivElement | null, HTMLDivElement | null]>([null, null]);
  const previewPlayersRef = useRef<[YT.Player | null, YT.Player | null]>([null, null]);
  const slotVideoIdsRef = useRef<[string | null, string | null]>([null, null]);
  const latestSelectedVideoIdRef = useRef(selectedVideoId);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);

  useEffect(() => {
    latestSelectedVideoIdRef.current = selectedVideoId;
  }, [selectedVideoId]);

  useEffect(() => {
    let isCancelled = false;

    async function preparePlayer() {
      if (!selectedVideoId) {
        return;
      }

      const existingSlotIndex = slotVideoIdsRef.current.findIndex((videoId) => videoId === selectedVideoId);

      if (existingSlotIndex >= 0) {
        setActiveSlotIndex(existingSlotIndex);
        return;
      }

      const inactiveSlotIndex =
        slotVideoIdsRef.current[0] === null ? 0 : slotVideoIdsRef.current[1] === null ? 1 : (activeSlotIndex === 0 ? 1 : 0);
      const previewSlot = previewSlotRefs.current[inactiveSlotIndex];

      if (!previewSlot) {
        return;
      }

      await loadMiniVideoPreviewApi();

      if (isCancelled || !window.YT?.Player) {
        return;
      }

      previewSlot.replaceChildren();

      const mountElement = document.createElement('div');
      mountElement.className = frameClassName;
      previewSlot.append(mountElement);

      previewPlayersRef.current[inactiveSlotIndex]?.destroy();
      previewPlayersRef.current[inactiveSlotIndex] = new window.YT.Player(mountElement, {
        height: '100%',
        width: '100%',
        videoId: selectedVideoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          modestbranding: 1,
          mute: 1,
          playsinline: 1,
          playlist: selectedVideoId,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            if (isCancelled) {
              return;
            }

            const player = event.target as YT.Player & {
              mute?: () => void;
              seekTo?: (seconds: number, allowSeekAhead?: boolean) => void;
              setPlaybackQuality?: (quality: string) => void;
            };

            applyYouTubeIframePermissions(player);
            player.mute?.();
            player.setPlaybackQuality?.(MINI_VIDEO_PREVIEW_LOWEST_QUALITY);

            slotVideoIdsRef.current[inactiveSlotIndex] = selectedVideoId;
            const playbackSnapshot = mainPlayerRef?.current?.readPlaybackSnapshot();

            if (
              playbackSnapshot &&
              playbackSnapshot.videoId === selectedVideoId &&
              playbackSnapshot.positionSeconds > 0
            ) {
              player.seekTo?.(playbackSnapshot.positionSeconds, true);
            }

            if (latestSelectedVideoIdRef.current === selectedVideoId) {
              setActiveSlotIndex(inactiveSlotIndex);
            }
          },
        },
      });
    }

    void preparePlayer();

    return () => {
      isCancelled = true;
    };
  }, [activeSlotIndex, frameClassName, mainPlayerRef, selectedVideoId]);

  useEffect(() => {
    return () => {
      previewPlayersRef.current.forEach((player, index) => {
        player?.destroy();
        previewPlayersRef.current[index] = null;
        slotVideoIdsRef.current[index] = null;
        previewSlotRefs.current[index]?.replaceChildren();
      });
    };
  }, []);

  return (
    <div className={containerClassName} style={{ overflow: 'hidden', position: 'relative' }}>
      {[0, 1].map((slotIndex) => (
        <div
          key={slotIndex}
          ref={(node) => {
            previewSlotRefs.current[slotIndex as 0 | 1] = node;
          }}
          aria-hidden={activeSlotIndex !== slotIndex}
          className={frameClassName}
          style={{
            inset: 0,
            opacity: activeSlotIndex === slotIndex ? 1 : 0,
            pointerEvents: 'none',
            position: 'absolute',
            transition: 'opacity 140ms ease',
          }}
        />
      ))}
    </div>
  );
}
