const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function formatSeasonTimeLeft(endAt: string, nowMs = Date.now()) {
  const endMs = new Date(endAt).getTime();

  if (!Number.isFinite(endMs)) {
    return null;
  }

  const remainingMs = endMs - nowMs;

  if (remainingMs <= 0) {
    return '시즌 종료';
  }

  const days = Math.floor(remainingMs / DAY_MS);
  const hours = Math.floor((remainingMs % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((remainingMs % HOUR_MS) / MINUTE_MS);

  if (days > 0) {
    return `${days}일 ${hours}시간 남음`;
  }

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  }

  return minutes > 0 ? `${minutes}분 남음` : '1분 미만 남음';
}
