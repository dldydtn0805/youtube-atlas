import { beforeEach, describe, expect, it } from 'vitest';
import {
  getClickedGameNotificationStorageKey,
  readClickedGameNotificationIds,
  writeClickedGameNotificationIds,
} from './homeClickedGameNotifications';

describe('clicked game notification storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('stores clicked notification ids per user', () => {
    const storageKey = getClickedGameNotificationStorageKey(12);

    writeClickedGameNotificationIds(storageKey, ['notification-1']);

    expect(readClickedGameNotificationIds(storageKey)).toEqual(['notification-1']);
    expect(readClickedGameNotificationIds(getClickedGameNotificationStorageKey(13))).toEqual([]);
  });

  it('falls back to an empty list for broken storage values', () => {
    const storageKey = getClickedGameNotificationStorageKey(12);

    window.localStorage.setItem(storageKey, '{');

    expect(readClickedGameNotificationIds(storageKey)).toEqual([]);
  });
});
