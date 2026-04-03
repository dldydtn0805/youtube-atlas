import { fetchApi } from '../../lib/api';
import type {
  CreateGamePositionInput,
  GameCurrentSeason,
  GameLeaderboardEntry,
  GameMarketVideo,
  GamePosition,
  SellGamePositionResponse,
} from './types';

function createAuthorizationHeader(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

export async function fetchCurrentGameSeason(accessToken: string) {
  return fetchApi<GameCurrentSeason>('/api/game/seasons/current', {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchGameMarket(accessToken: string) {
  return fetchApi<GameMarketVideo[]>('/api/game/market', {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchGameLeaderboard(accessToken: string) {
  return fetchApi<GameLeaderboardEntry[]>('/api/game/leaderboard', {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchMyGamePositions(accessToken: string, status = 'OPEN') {
  const params = new URLSearchParams();

  if (status.trim()) {
    params.set('status', status);
  }

  const queryString = params.toString();

  return fetchApi<GamePosition[]>(
    queryString ? `/api/game/positions/me?${queryString}` : '/api/game/positions/me',
    {
      headers: createAuthorizationHeader(accessToken),
    },
  );
}

export async function buyGamePosition(accessToken: string, input: CreateGamePositionInput) {
  return fetchApi<GamePosition>('/api/game/positions', {
    method: 'POST',
    headers: {
      ...createAuthorizationHeader(accessToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
}

export async function sellGamePosition(accessToken: string, positionId: number) {
  return fetchApi<SellGamePositionResponse>(`/api/game/positions/${positionId}/sell`, {
    method: 'POST',
    headers: createAuthorizationHeader(accessToken),
  });
}
