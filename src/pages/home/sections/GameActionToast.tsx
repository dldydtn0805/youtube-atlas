import './GameActionToast.css';

interface GameActionToastProps {
  message: string | null;
  onDismiss: () => void;
}

export default function GameActionToast({
  message,
  onDismiss,
}: GameActionToastProps) {
  if (!message) {
    return null;
  }

  return (
    <aside className="game-action-toast" role="status" aria-live="polite">
      <div className="game-action-toast__copy">
        <strong>게임 알림</strong>
        <p>{message}</p>
      </div>
      <button
        aria-label="게임 알림 토스트 닫기"
        className="game-action-toast__close"
        onClick={onDismiss}
        type="button"
      >
        닫기
      </button>
    </aside>
  );
}
