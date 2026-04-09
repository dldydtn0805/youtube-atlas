import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { AuthStatus } from '../../../features/auth/types';
import type { GameCurrentSeason, GamePosition } from '../../../features/game/types';
import { DEFAULT_GAME_QUANTITY } from '../gameHelpers';

interface UseHomeGameUiStateOptions {
  authStatus: AuthStatus;
  currentGameSeason?: GameCurrentSeason;
  openGamePositions: GamePosition[];
  selectedVideoId?: string;
}

interface UseHomeGameUiStateResult {
  activeTradeModal: 'buy' | 'sell' | null;
  buyQuantity: number;
  closeCoinModal: () => void;
  closeRankHistoryModal: () => void;
  closeTradeModal: () => void;
  gameActionStatus: string | null;
  getRemainingHoldSeconds: (position: GamePosition) => number;
  isCoinModalOpen: boolean;
  openBuyTradeModal: () => void;
  openCoinModal: () => void;
  openRankHistoryModal: (
    videoId: string | undefined,
    position: GamePosition | null,
  ) => void;
  openSellTradeModal: () => void;
  selectedRankHistoryPosition: GamePosition | null;
  selectedVideoRankHistoryVideoId: string | null;
  sellQuantity: number;
  setActiveTradeModal: Dispatch<SetStateAction<'buy' | 'sell' | null>>;
  setBuyQuantity: Dispatch<SetStateAction<number>>;
  setGameActionStatus: Dispatch<SetStateAction<string | null>>;
  setSellQuantity: Dispatch<SetStateAction<number>>;
}

export default function useHomeGameUiState({
  authStatus,
  currentGameSeason,
  openGamePositions,
  selectedVideoId,
}: UseHomeGameUiStateOptions): UseHomeGameUiStateResult {
  const [activeTradeModal, setActiveTradeModal] = useState<'buy' | 'sell' | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(DEFAULT_GAME_QUANTITY);
  const [gameActionStatus, setGameActionStatus] = useState<string | null>(null);
  const [gameClock, setGameClock] = useState(() => Date.now());
  const [isCoinModalOpen, setIsCoinModalOpen] = useState(false);
  const [selectedRankHistoryPosition, setSelectedRankHistoryPosition] = useState<GamePosition | null>(null);
  const [selectedVideoRankHistoryVideoId, setSelectedVideoRankHistoryVideoId] = useState<string | null>(null);
  const [sellQuantity, setSellQuantity] = useState(DEFAULT_GAME_QUANTITY);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      return;
    }

    setGameActionStatus(null);
    setIsCoinModalOpen(false);
    setSelectedRankHistoryPosition(null);
    setSelectedVideoRankHistoryVideoId(null);
  }, [authStatus]);

  useEffect(() => {
    setBuyQuantity(DEFAULT_GAME_QUANTITY);
    setSellQuantity(DEFAULT_GAME_QUANTITY);
    setActiveTradeModal(null);
  }, [selectedVideoId]);

  useEffect(() => {
    setGameActionStatus(null);
  }, [selectedVideoId]);

  useEffect(() => {
    if (openGamePositions.length === 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setGameClock(Date.now());
    }, 30_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [openGamePositions.length]);

  const getRemainingHoldSeconds = useCallback(
    (position: GamePosition) => {
      if (!currentGameSeason) {
        return 0;
      }

      const elapsedSeconds = Math.floor((gameClock - new Date(position.createdAt).getTime()) / 1000);

      return Math.max(0, currentGameSeason.minHoldSeconds - elapsedSeconds);
    },
    [currentGameSeason, gameClock],
  );

  const openRankHistoryModal = useCallback(
    (videoId: string | undefined, position: GamePosition | null) => {
      if (!videoId) {
        return;
      }

      if (position) {
        setSelectedVideoRankHistoryVideoId(null);
        setSelectedRankHistoryPosition(position);
        return;
      }

      setSelectedRankHistoryPosition(null);
      setSelectedVideoRankHistoryVideoId(videoId);
    },
    [],
  );

  return {
    activeTradeModal,
    buyQuantity,
    closeCoinModal: () => setIsCoinModalOpen(false),
    closeRankHistoryModal: () => {
      setSelectedRankHistoryPosition(null);
      setSelectedVideoRankHistoryVideoId(null);
    },
    closeTradeModal: () => setActiveTradeModal(null),
    gameActionStatus,
    getRemainingHoldSeconds,
    isCoinModalOpen,
    openBuyTradeModal: () => setActiveTradeModal('buy'),
    openCoinModal: () => setIsCoinModalOpen(true),
    openRankHistoryModal,
    openSellTradeModal: () => setActiveTradeModal('sell'),
    selectedRankHistoryPosition,
    selectedVideoRankHistoryVideoId,
    sellQuantity,
    setActiveTradeModal,
    setBuyQuantity,
    setGameActionStatus,
    setSellQuantity,
  };
}
