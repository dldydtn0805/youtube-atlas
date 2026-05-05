import { useEffect, useMemo, useState } from 'react';
import { formatSeasonTimeLeft } from './gameSeasonCountdownFormat';
import './GameSeasonCountdown.css';

const MINUTE_MS = 60_000;

interface GameSeasonCountdownProps {
  endAt: string;
}

export default function GameSeasonCountdown({ endAt }: GameSeasonCountdownProps) {
  const [nowMs, setNowMs] = useState(Date.now);
  const label = useMemo(() => formatSeasonTimeLeft(endAt, nowMs), [endAt, nowMs]);

  useEffect(() => {
    const timerId = window.setInterval(() => setNowMs(Date.now()), MINUTE_MS);

    return () => window.clearInterval(timerId);
  }, []);

  if (!label) {
    return null;
  }

  return <p className="app-shell__game-season-countdown">{label}</p>;
}
