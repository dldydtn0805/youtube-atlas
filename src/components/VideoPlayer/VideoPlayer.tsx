import { useEffect, useRef } from 'react';
import './VideoPlayer.css';

const DEFAULT_VIDEO_ID = '61JHONRXhjs';
let youtubeIframeApiPromise: Promise<void> | undefined;

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
  onVideoEnd?: () => void;
}

function VideoPlayer({ selectedVideoId, onVideoEnd }: VideoPlayerProps) {
  const videoId = selectedVideoId ?? DEFAULT_VIDEO_ID;
  const playerHostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const onVideoEndRef = useRef(onVideoEnd);

  useEffect(() => {
    onVideoEndRef.current = onVideoEnd;
  }, [onVideoEnd]);

  useEffect(() => {
    let isCancelled = false;

    async function initializePlayer() {
      await loadYouTubeIframeApi();

      if (isCancelled || !playerHostRef.current || !window.YT?.Player) {
        return;
      }

      playerRef.current?.destroy();
      playerRef.current = new window.YT.Player(playerHostRef.current, {
        height: '100%',
        width: '100%',
        videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.ENDED) {
              onVideoEndRef.current?.();
            }
          },
        },
      });
    }

    initializePlayer();

    return () => {
      isCancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  return (
    <section className="video-player">
      <div className="video-player__frame">
        <div
          ref={playerHostRef}
          className="video-player__embed"
        />
      </div>
    </section>
  );
}

export default VideoPlayer;
