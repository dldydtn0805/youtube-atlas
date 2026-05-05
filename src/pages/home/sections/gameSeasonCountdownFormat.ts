const SECOND_MS = 1_000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const seasonMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatOrdinal(value: number) {
  if (value === 1) {
    return '1st';
  }

  if (value === 2) {
    return '2nd';
  }

  if (value === 3) {
    return '3rd';
  }

  return `${value}th`;
}

function formatSeasonWeekLabel(startAt: string) {
  const startDate = new Date(startAt);

  if (!Number.isFinite(startDate.getTime())) {
    return null;
  }

  const month = seasonMonths[startDate.getMonth()];
  const week = Math.max(1, Math.ceil(startDate.getDate() / 7));

  return `${month}, ${formatOrdinal(week)}`;
}

export function formatSeasonTimeLeft(endAt: string, nowMs = Date.now(), startAt = endAt) {
  const endDate = new Date(endAt);
  const endMs = endDate.getTime();

  if (!Number.isFinite(endMs)) {
    return null;
  }

  const seasonLabel = formatSeasonWeekLabel(startAt);

  if (!seasonLabel) {
    return null;
  }

  const remainingMs = endMs - nowMs;

  if (remainingMs <= 0) {
    return `${seasonLabel} 시즌 종료`;
  }

  const hours = Math.floor(remainingMs / HOUR_MS);
  const minutes = Math.floor((remainingMs % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((remainingMs % MINUTE_MS) / SECOND_MS);

  return `${seasonLabel} 시즌 종료까지 ${hours}시간 ${minutes}분 ${seconds} 초 남음`;
}
