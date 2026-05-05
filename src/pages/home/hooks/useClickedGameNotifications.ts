import { useCallback, useEffect, useState } from 'react';
import {
  getClickedGameNotificationStorageKey as getStorageKey,
  readClickedGameNotificationIds as readIds,
  writeClickedGameNotificationIds as writeIds,
} from '../homeClickedGameNotifications';

export default function useClickedGameNotifications(userId?: number | null) {
  const storageKey = getStorageKey(userId);
  const [clickedNotificationIds, setIds] = useState<ReadonlySet<string>>(
    () => new Set(readIds(storageKey)),
  );

  useEffect(() => {
    setIds(new Set(readIds(storageKey)));
  }, [storageKey]);

  const markClicked = useCallback((notificationId: string) => {
    setIds((currentIds) => {
      if (currentIds.has(notificationId)) {
        return currentIds;
      }

      const nextIds = [...currentIds, notificationId];
      writeIds(storageKey, nextIds);

      return new Set(nextIds);
    });
  }, [storageKey]);

  return { clickedNotificationIds, markGameNotificationClicked: markClicked };
}
