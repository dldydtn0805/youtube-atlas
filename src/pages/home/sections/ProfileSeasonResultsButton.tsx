interface Props {
  onOpen: () => void;
  resultCount?: number;
}

function formatResultCount(resultCount = 0) {
  return resultCount > 0 ? `${resultCount}개` : '없음';
}

export default function ProfileSeasonResultsButton({ onOpen, resultCount }: Props) {
  return (
    <button
      aria-label="지난 시즌 기록 열기"
      className="app-shell__profile-card-grid-button"
      onClick={onOpen}
      type="button"
    >
      <span>지난 시즌</span>
      <strong>{formatResultCount(resultCount)}</strong>
    </button>
  );
}
