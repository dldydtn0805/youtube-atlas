const CLICKED_GAME_NOTIFICATION_STORAGE_PREFIX = 'youtube-atlas-clicked-game-notifications';
const CLICKED_GAME_NOTIFICATION_LIMIT = 80;

export function getClickedGameNotificationStorageKey(userId?: number | null) {
  return `${CLICKED_GAME_NOTIFICATION_STORAGE_PREFIX}:${userId ?? 'guest'}`;
}

export function readClickedGameNotificationIds(storageKey: string) {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsedValue = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]');

    return Array.isArray(parsedValue)
      ? parsedValue.filter((value): value is string => typeof value === 'string')
      : [];
  } catch {
    return [];
  }
}

export function writeClickedGameNotificationIds(storageKey: string, notificationIds: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    storageKey,
    JSON.stringify(notificationIds.slice(-CLICKED_GAME_NOTIFICATION_LIMIT)),
  );
}
