import { fetchApi } from '../../lib/api';
import type { PlaybackProgress, UpsertPlaybackProgressInput } from './types';

function createAuthorizationHeader(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

export async function fetchPlaybackProgress(accessToken: string) {
  return fetchApi<PlaybackProgress | null>('/api/me/playback-progress', {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function upsertPlaybackProgress(
  accessToken: string,
  input: UpsertPlaybackProgressInput,
) {
  return fetchApi<PlaybackProgress>('/api/me/playback-progress', {
    method: 'POST',
    headers: {
      ...createAuthorizationHeader(accessToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channelTitle: input.channelTitle,
      positionSeconds: Math.max(0, Math.floor(input.positionSeconds)),
      thumbnailUrl: input.thumbnailUrl,
      videoId: input.videoId,
      videoTitle: input.videoTitle,
    }),
  });
}
