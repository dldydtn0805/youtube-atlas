import { useEffect, useRef, useState } from 'react';
import type { Client } from '@stomp/stompjs';
import { subscribeToAuthenticatedRealtimeTopic } from '../realtime/stompClient';
import type { CommentHighlightMessage } from './highlightTypes';

const COMMENT_HIGHLIGHTS_QUEUE = '/user/queue/comments/highlights';
const COMMENT_HIGHLIGHTS_START_DESTINATION = '/app/comments/highlights/start';
const COMMENT_HIGHLIGHTS_STOP_DESTINATION = '/app/comments/highlights/stop';

function isHighlightForVideo(highlight: CommentHighlightMessage, videoId: string) {
  return highlight.video_id === videoId && highlight.ephemeral;
}

export function useCommentHighlights(
  videoId?: string,
  accessToken?: string | null,
  enabled = true,
) {
  const [highlights, setHighlights] = useState<CommentHighlightMessage[]>([]);
  const seenHighlightIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setHighlights([]);
    seenHighlightIdsRef.current = new Set();

    if (!enabled || !videoId || !accessToken) {
      return;
    }

    let activeClient: Client | null = null;
    const startBody = JSON.stringify({ videoId });
    const unsubscribe = subscribeToAuthenticatedRealtimeTopic(
      COMMENT_HIGHLIGHTS_QUEUE,
      accessToken,
      (messageBody) => {
        try {
          const nextHighlight = JSON.parse(messageBody) as CommentHighlightMessage;

          if (!isHighlightForVideo(nextHighlight, videoId)) {
            return;
          }

          setHighlights((current) => {
            if (seenHighlightIdsRef.current.has(nextHighlight.id)) {
              return current;
            }

            seenHighlightIdsRef.current.add(nextHighlight.id);
            return [...current, nextHighlight];
          });
        } catch {
          // Ignore malformed highlight messages.
        }
      },
      (client) => {
        activeClient = client;
        client.publish({
          body: startBody,
          destination: COMMENT_HIGHLIGHTS_START_DESTINATION,
        });
      },
    );

    return () => {
      if (activeClient?.connected) {
        activeClient.publish({ destination: COMMENT_HIGHLIGHTS_STOP_DESTINATION });
      }

      unsubscribe();
    };
  }, [accessToken, enabled, videoId]);

  return highlights;
}
