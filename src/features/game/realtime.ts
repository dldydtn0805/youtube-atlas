import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { subscribeToRealtimeTopic } from '../realtime/stompClient';
import { invalidateGameQueries } from './queries';
import type { GameRealtimeEvent } from './types';

const GAME_TOPIC_PREFIX = '/topic/game';
const WALLET_UPDATED_EVENT = 'wallet-updated';

function toRealtimeEventKey(event: GameRealtimeEvent) {
  return [
    event.eventType,
    event.regionCode,
    event.seasonId ?? 'season',
    event.capturedAt ?? 'captured',
    event.occurredAt ?? 'occurred',
  ].join(':');
}

export function useGameRealtimeInvalidation(
  accessToken: string | null,
  regionCode: string | null,
  enabled = true,
) {
  const queryClient = useQueryClient();
  const handledEventKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !accessToken || !regionCode) {
      handledEventKeyRef.current = null;
      return;
    }

    const unsubscribe = subscribeToRealtimeTopic(`${GAME_TOPIC_PREFIX}/${regionCode}`, (messageBody) => {
      try {
        const event = JSON.parse(messageBody) as GameRealtimeEvent;

        if (event.eventType !== WALLET_UPDATED_EVENT || event.regionCode !== regionCode) {
          return;
        }

        const nextEventKey = toRealtimeEventKey(event);

        if (handledEventKeyRef.current === nextEventKey) {
          return;
        }

        handledEventKeyRef.current = nextEventKey;

        void invalidateGameQueries(queryClient, {
          accessToken,
          includeLeaderboardPositions: true,
          regionCode,
          seasonId: event.seasonId,
        });
      } catch {
        // Ignore malformed realtime messages so game queries keep working.
      }
    });

    return () => {
      unsubscribe();
    };
  }, [accessToken, enabled, queryClient, regionCode]);
}
