import { fetchApi } from '../../lib/api';
import type {
  CreateGamePositionInput,
  GameCoinOverview,
  GameCoinTier,
  GameCoinTierProgress,
  GameCurrentSeason,
  GameHighlight,
  GameLeaderboardEntry,
  GameMarketVideo,
  GameNotification,
  GamePosition,
  GamePositionRankHistory,
  GameSeasonCoinResult,
  SellGamePreviewResponse,
  SellGamePositionsInput,
  SellGamePositionResponse,
} from './types';
import type { YouTubeCategorySection } from '../youtube/types';

type ApiGameWallet = GameCurrentSeason['wallet'] & {
  coinBalance?: number | null;
};

type ApiGameCoinTier = Omit<GameCoinTier, 'minCoinBalance'> & {
  minCoinBalance?: number | null;
  minScore?: number | null;
};

type ApiGameCoinTierProgress = Omit<GameCoinTierProgress, 'currentTier' | 'nextTier' | 'tiers' | 'coinBalance'> & {
  coinBalance?: number | null;
  currentTier: ApiGameCoinTier;
  nextTier: ApiGameCoinTier | null;
  tiers: ApiGameCoinTier[];
};

type ApiGameLeaderboardEntry = Omit<GameLeaderboardEntry, 'coinBalance' | 'currentTier'> & {
  coinBalance?: number | null;
  currentTier: ApiGameCoinTier;
};

type ApiGameCurrentSeason = Omit<GameCurrentSeason, 'wallet'> & {
  wallet: ApiGameWallet;
};

function createAuthorizationHeader(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

function normalizeCoinBalance(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function normalizeGameCoinTier(tier: ApiGameCoinTier): GameCoinTier {
  return {
    ...tier,
    minCoinBalance:
      typeof tier.minCoinBalance === 'number' && Number.isFinite(tier.minCoinBalance)
        ? tier.minCoinBalance
        : typeof tier.minScore === 'number' && Number.isFinite(tier.minScore)
          ? tier.minScore
          : 0,
  };
}

function normalizeGameCoinTierProgress(progress: ApiGameCoinTierProgress): GameCoinTierProgress {
  return {
    ...progress,
    coinBalance: normalizeCoinBalance(progress.coinBalance),
    currentTier: normalizeGameCoinTier(progress.currentTier),
    nextTier: progress.nextTier ? normalizeGameCoinTier(progress.nextTier) : null,
    tiers: progress.tiers.map(normalizeGameCoinTier),
  };
}

function normalizeGameCurrentSeason(season: ApiGameCurrentSeason): GameCurrentSeason {
  return {
    ...season,
    wallet: {
      ...season.wallet,
      coinBalance: normalizeCoinBalance(season.wallet.coinBalance),
    },
  };
}

function normalizeGameLeaderboardEntry(entry: ApiGameLeaderboardEntry): GameLeaderboardEntry {
  return {
    ...entry,
    coinBalance: normalizeCoinBalance(entry.coinBalance),
    currentTier: normalizeGameCoinTier(entry.currentTier),
  };
}

export async function fetchCurrentGameSeason(accessToken: string, regionCode: string) {
  const params = new URLSearchParams({ regionCode });

  const season = await fetchApi<ApiGameCurrentSeason>(`/api/game/seasons/current?${params.toString()}`, {
    headers: createAuthorizationHeader(accessToken),
  });

  return normalizeGameCurrentSeason(season);
}

export async function fetchGameMarket(accessToken: string, regionCode: string) {
  const params = new URLSearchParams({ regionCode });

  return fetchApi<GameMarketVideo[]>(`/api/game/market?${params.toString()}`, {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchBuyableMarketChart(accessToken: string, regionCode: string, pageToken?: string) {
  const params = new URLSearchParams({ regionCode });

  if (pageToken) {
    params.set('pageToken', pageToken);
  }

  return fetchApi<YouTubeCategorySection>(`/api/game/market/buyable-chart?${params.toString()}`, {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchGameLeaderboard(accessToken: string, regionCode: string) {
  const params = new URLSearchParams({ regionCode });

  const leaderboard = await fetchApi<ApiGameLeaderboardEntry[]>(`/api/game/leaderboard?${params.toString()}`, {
    headers: createAuthorizationHeader(accessToken),
  });

  return leaderboard.map(normalizeGameLeaderboardEntry);
}

export async function fetchGameCoinOverview(accessToken: string, regionCode: string) {
  const params = new URLSearchParams({ regionCode });

  return fetchApi<GameCoinOverview>(`/api/game/coins/overview?${params.toString()}`, {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchGameHighlights(accessToken: string, regionCode: string) {
  const params = new URLSearchParams({ regionCode });

  return fetchApi<GameHighlight[]>(`/api/game/highlights?${params.toString()}`, {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchGameNotifications(accessToken: string, regionCode: string) {
  const params = new URLSearchParams({ regionCode });

  return fetchApi<GameNotification[]>(`/api/game/notifications?${params.toString()}`, {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function markGameNotificationsRead(accessToken: string, regionCode: string) {
  const params = new URLSearchParams({ regionCode });

  return fetchApi<void>(`/api/game/notifications/read?${params.toString()}`, {
    method: 'PATCH',
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function deleteGameNotifications(accessToken: string, regionCode: string) {
  const params = new URLSearchParams({ regionCode });

  return fetchApi<void>(`/api/game/notifications?${params.toString()}`, {
    method: 'DELETE',
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function deleteGameNotification(accessToken: string, notificationId: string) {
  return fetchApi<void>(`/api/game/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchGameCoinTierProgress(accessToken: string, regionCode: string) {
  const params = new URLSearchParams({ regionCode });

  const progress = await fetchApi<ApiGameCoinTierProgress>(`/api/game/tiers/current?${params.toString()}`, {
    headers: createAuthorizationHeader(accessToken),
  });

  return normalizeGameCoinTierProgress(progress);
}

export async function fetchMySeasonCoinResult(accessToken: string, seasonId: number) {
  return fetchApi<GameSeasonCoinResult>(`/api/game/seasons/${seasonId}/results/me`, {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchGameLeaderboardPositions(accessToken: string, userId: number, regionCode: string) {
  const params = new URLSearchParams({ regionCode });

  return fetchApi<GamePosition[]>(`/api/game/leaderboard/${userId}/positions?${params.toString()}`, {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchGameLeaderboardHighlights(accessToken: string, userId: number, regionCode: string) {
  const params = new URLSearchParams({ regionCode });

  return fetchApi<GameHighlight[]>(`/api/game/leaderboard/${userId}/highlights?${params.toString()}`, {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchMyGamePositions(accessToken: string, regionCode: string, status = 'OPEN', limit?: number) {
  const params = new URLSearchParams({ regionCode });

  if (status.trim()) {
    params.set('status', status);
  }

  if (typeof limit === 'number' && Number.isFinite(limit) && limit > 0) {
    params.set('limit', String(Math.floor(limit)));
  }

  const queryString = params.toString();

  return fetchApi<GamePosition[]>(
    queryString ? `/api/game/positions/me?${queryString}` : '/api/game/positions/me',
    {
      headers: createAuthorizationHeader(accessToken),
    },
  );
}

export async function fetchGamePositionRankHistory(accessToken: string, positionId: number) {
  return fetchApi<GamePositionRankHistory>(`/api/game/positions/${positionId}/rank-history`, {
    headers: createAuthorizationHeader(accessToken),
  });
}

export async function fetchGameLeaderboardPositionRankHistory(
  accessToken: string,
  userId: number,
  positionId: number,
  regionCode: string,
) {
  const params = new URLSearchParams({ regionCode });

  return fetchApi<GamePositionRankHistory>(
    `/api/game/leaderboard/${userId}/positions/${positionId}/rank-history?${params.toString()}`,
    {
      headers: createAuthorizationHeader(accessToken),
    },
  );
}

export async function buyGamePosition(accessToken: string, input: CreateGamePositionInput) {
  return fetchApi<GamePosition[]>('/api/game/positions', {
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

export async function sellGamePositions(accessToken: string, input: SellGamePositionsInput) {
  return fetchApi<SellGamePositionResponse[]>('/api/game/positions/sell', {
    method: 'POST',
    headers: {
      ...createAuthorizationHeader(accessToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
}

export async function fetchSellGamePreview(accessToken: string, input: SellGamePositionsInput) {
  return fetchApi<SellGamePreviewResponse>('/api/game/positions/sell-preview', {
    method: 'POST',
    headers: {
      ...createAuthorizationHeader(accessToken),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
}
