import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties } from 'react';
import './VideoPlayer.css';

let youtubeIframeApiPromise: Promise<void> | undefined;

type YouTubePlayerWithPlaybackControls = YT.Player & {
  getIframe?: () => HTMLIFrameElement;
  pauseVideo?: () => void;
  playVideo?: () => void;
};

const YOUTUBE_IFRAME_ALLOW_VALUE =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

function applyYouTubeIframePermissions(player: { getIframe?: () => HTMLIFrameElement } | null) {
  const iframe = player?.getIframe?.();

  if (!iframe) {
    return;
  }

  iframe.allow = YOUTUBE_IFRAME_ALLOW_VALUE;
}

function loadYouTubeIframeApi() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  if (youtubeIframeApiPromise) {
    return youtubeIframeApiPromise;
  }

  youtubeIframeApiPromise = new Promise<void>((resolve) => {
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

  return youtubeIframeApiPromise;
}

interface VideoPlayerProps {
  selectedVideoId?: string;
  dockStyle?: CSSProperties;
  isLoading?: boolean;
  isCinematic?: boolean;
  isDocked?: boolean;
  showOverlayNavigation?: boolean;
  onVideoEnd?: () => void;
  canNavigateVideos?: boolean;
  onPreviousVideo?: () => void;
  onNextVideo?: () => void;
  playbackRestore?: {
    restoreId: number;
    videoId: string;
    positionSeconds: number;
  } | null;
  onPlaybackRestoreApplied?: (restoreId: number) => void;
  onPlaybackStateChange?: (state: 'paused' | 'playing') => void;
}

export interface VideoPlayerHandle {
  pausePlayback: () => void;
  resumePlayback: () => void;
  readPlaybackSnapshot: () => {
    videoId: string;
    positionSeconds: number;
  } | null;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(function VideoPlayer({
  selectedVideoId,
  dockStyle,
  isLoading = false,
  isCinematic = false,
  isDocked = false,
  showOverlayNavigation = false,
  onVideoEnd,
  canNavigateVideos = false,
  onPreviousVideo,
  onNextVideo,
  playbackRestore,
  onPlaybackRestoreApplied,
  onPlaybackStateChange,
}, ref) {
  const videoId = selectedVideoId;
  const playerFrameRef = useRef<HTMLDivElement | null>(null);
  const playerHostRef = useRef<HTMLDivElement | null>(null);
  const [playerHostElement, setPlayerHostElement] = useState<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayerWithPlaybackControls | null>(null);
  const currentVideoIdRef = useRef(videoId);
  const onVideoEndRef = useRef(onVideoEnd);
  const onPlaybackRestoreAppliedRef = useRef(onPlaybackRestoreApplied);
  const onPlaybackStateChangeRef = useRef(onPlaybackStateChange);
  const playbackRestoreRef = useRef(playbackRestore);
  const lastAppliedRestoreIdRef = useRef<number | null>(null);
  const isPlayerReadyRef = useRef(false);
  const autoplayRetryCleanupRef = useRef<(() => void) | null>(null);

  const setPlayerHost = useCallback((element: HTMLDivElement | null) => {
    if (playerHostRef.current === element) {
      return;
    }

    playerHostRef.current = element;
    setPlayerHostElement(element);
  }, []);

  useEffect(() => {
    onVideoEndRef.current = onVideoEnd;
  }, [onVideoEnd]);

  useEffect(() => {
    currentVideoIdRef.current = videoId;
  }, [videoId]);

  useEffect(() => {
    playbackRestoreRef.current = playbackRestore;
  }, [playbackRestore]);

  useEffect(() => {
    onPlaybackRestoreAppliedRef.current = onPlaybackRestoreApplied;
  }, [onPlaybackRestoreApplied]);

  useEffect(() => {
    onPlaybackStateChangeRef.current = onPlaybackStateChange;
  }, [onPlaybackStateChange]);

  const clearAutoplayRetry = useCallback(() => {
    autoplayRetryCleanupRef.current?.();
    autoplayRetryCleanupRef.current = null;
  }, []);

  const attemptPlaybackStart = useCallback(
    (player: YouTubePlayerWithPlaybackControls | null, options?: { scheduleRetry?: boolean }) => {
      if (!player || !isPlayerReadyRef.current || typeof player.playVideo !== 'function') {
        return;
      }

      const playVideo = player.playVideo.bind(player);

      playVideo();
      onPlaybackStateChangeRef.current?.('playing');

      if (!options?.scheduleRetry || typeof document === 'undefined') {
        return;
      }

      clearAutoplayRetry();

      const retryPlayback = () => {
        if (playerRef.current === player && isPlayerReadyRef.current) {
          playVideo();
        }

        clearAutoplayRetry();
      };

      const listenerOptions = { capture: true, once: true } as const;

      document.addEventListener('click', retryPlayback, listenerOptions);
      document.addEventListener('pointerup', retryPlayback, listenerOptions);
      document.addEventListener('touchend', retryPlayback, listenerOptions);

      autoplayRetryCleanupRef.current = () => {
        document.removeEventListener('click', retryPlayback, true);
        document.removeEventListener('pointerup', retryPlayback, true);
        document.removeEventListener('touchend', retryPlayback, true);
      };
    },
    [clearAutoplayRetry],
  );

  const readCurrentPlaybackPositionSeconds = useCallback(() => {
    const player = playerRef.current;

    if (!player || !isPlayerReadyRef.current || typeof player.getCurrentTime !== 'function') {
      return null;
    }

    const currentTimeSeconds = player.getCurrentTime();

    if (!Number.isFinite(currentTimeSeconds) || currentTimeSeconds < 0) {
      return null;
    }

    return Math.floor(currentTimeSeconds);
  }, []);

  const readCurrentPlaybackVideoId = useCallback(() => {
    const player = playerRef.current;

    if (!player || !isPlayerReadyRef.current || typeof player.getVideoData !== 'function') {
      return undefined;
    }

    const currentPlaybackVideoId = player.getVideoData()?.video_id?.trim();

    return currentPlaybackVideoId ? currentPlaybackVideoId : undefined;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      pausePlayback() {
        const player = playerRef.current;

        if (!player || !isPlayerReadyRef.current || typeof player.pauseVideo !== 'function') {
          return;
        }

        player.pauseVideo();
        onPlaybackStateChangeRef.current?.('paused');
      },
      resumePlayback() {
        attemptPlaybackStart(playerRef.current);
      },
      readPlaybackSnapshot() {
        const snapshotVideoId = readCurrentPlaybackVideoId() ?? currentVideoIdRef.current;
        const positionSeconds = readCurrentPlaybackPositionSeconds();

        if (!snapshotVideoId || positionSeconds === null) {
          return null;
        }

        return {
          positionSeconds,
          videoId: snapshotVideoId,
        };
      },
    }),
    [attemptPlaybackStart, readCurrentPlaybackPositionSeconds, readCurrentPlaybackVideoId],
  );

  function markPlaybackRestoreApplied(restoreId?: number) {
    if (!restoreId || lastAppliedRestoreIdRef.current === restoreId) {
      return;
    }

    lastAppliedRestoreIdRef.current = restoreId;
    onPlaybackRestoreAppliedRef.current?.(restoreId);
  }

  function getRestoreStartSeconds(nextVideoId?: string) {
    const restore = playbackRestoreRef.current;

    if (!nextVideoId || !restore || restore.videoId !== nextVideoId) {
      return undefined;
    }

    return Math.max(0, Math.floor(restore.positionSeconds));
  }

  useEffect(() => {
    let isCancelled = false;

    async function initializePlayer() {
      await loadYouTubeIframeApi();

      if (
        isCancelled ||
        !videoId ||
        !playerHostElement ||
        !window.YT?.Player ||
        playerRef.current
      ) {
        return;
      }

      const restoreStartSeconds = getRestoreStartSeconds(videoId);
      isPlayerReadyRef.current = false;

      playerRef.current = new window.YT.Player(playerHostElement, {
        height: '100%',
        width: '100%',
        videoId,
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          rel: 0,
          ...(restoreStartSeconds !== undefined ? { start: restoreStartSeconds } : {}),
        },
        events: {
          onReady: () => {
            isPlayerReadyRef.current = true;
            applyYouTubeIframePermissions(playerRef.current);
            attemptPlaybackStart(playerRef.current, { scheduleRetry: true });

            if (restoreStartSeconds !== undefined) {
              markPlaybackRestoreApplied(playbackRestoreRef.current?.restoreId);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.ENDED) {
              onPlaybackStateChangeRef.current?.('paused');
              onVideoEndRef.current?.();
              return;
            }

            if (event.data === window.YT?.PlayerState.PAUSED) {
              onPlaybackStateChangeRef.current?.('paused');
              return;
            }

            if (event.data === window.YT?.PlayerState.PLAYING) {
              onPlaybackStateChangeRef.current?.('playing');
            }
          },
        },
      }) as YouTubePlayerWithPlaybackControls;
    }

    void initializePlayer();

    return () => {
      isCancelled = true;
    };
  }, [attemptPlaybackStart, playerHostElement, videoId]);

  useEffect(() => {
    const player = playerRef.current;

    if (!player || !isPlayerReadyRef.current) {
      return;
    }

    if (!videoId) {
      clearAutoplayRetry();
      onPlaybackStateChangeRef.current?.('paused');

      if (typeof player.stopVideo === 'function') {
        player.stopVideo();
      }
      return;
    }

    const restoreStartSeconds = getRestoreStartSeconds(videoId);

    if (typeof player.loadVideoById === 'function') {
      player.loadVideoById(
        restoreStartSeconds === undefined
          ? videoId
          : {
              startSeconds: restoreStartSeconds,
              videoId,
            },
      );
    }

    attemptPlaybackStart(player, { scheduleRetry: true });

    if (restoreStartSeconds !== undefined) {
      markPlaybackRestoreApplied(playbackRestoreRef.current?.restoreId);
    }
  }, [attemptPlaybackStart, clearAutoplayRetry, videoId]);

  useEffect(() => {
    const restore = playbackRestore;
    const player = playerRef.current;

    if (
      !player ||
      !isPlayerReadyRef.current ||
      !restore ||
      restore.videoId !== currentVideoIdRef.current ||
      typeof player.seekTo !== 'function'
    ) {
      return;
    }

    player.seekTo(Math.max(0, Math.floor(restore.positionSeconds)), true);
    markPlaybackRestoreApplied(restore.restoreId);
  }, [playbackRestore]);

  useEffect(() => {
    return () => {
      clearAutoplayRetry();
      isPlayerReadyRef.current = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [clearAutoplayRetry]);

  const playerFrame = (
    <div
      ref={playerFrameRef}
      className="video-player__frame"
      data-docked={isDocked ? 'true' : 'false'}
    >
      <div className="video-player__embed-shell" data-visible={Boolean(videoId)}>
        <div
          ref={setPlayerHost}
          className="video-player__embed"
        />
      </div>
      {showOverlayNavigation && canNavigateVideos && videoId ? (
        <div className="video-player__overlay-nav">
          <button
            aria-label="이전 영상"
            className="video-player__overlay-button video-player__overlay-button--previous"
            onClick={onPreviousVideo}
            type="button"
          >
            <span className="video-player__overlay-icon">‹</span>
          </button>
          <button
            aria-label="다음 영상"
            className="video-player__overlay-button video-player__overlay-button--next"
            onClick={onNextVideo}
            type="button"
          >
            <span className="video-player__overlay-icon">›</span>
          </button>
        </div>
      ) : null}
      {!videoId ? (
        <div className="video-player__placeholder">
          {isLoading ? '선택한 카테고리 영상을 불러오는 중입니다.' : '재생할 영상을 선택해 주세요.'}
        </div>
      ) : null}
    </div>
  );

  return (
    <section
      className="video-player"
      data-cinematic={isCinematic}
      data-docked={isDocked ? 'true' : 'false'}
      style={dockStyle}
    >
      <div
        className="video-player__frame-slot"
        data-docked={isDocked ? 'true' : 'false'}
      >
        {playerFrame}
      </div>
    </section>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
