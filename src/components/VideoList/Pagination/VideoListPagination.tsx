import './VideoListPagination.css';

interface VideoListPaginationProps {
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentPage: number;
  label: string;
  onNext: () => void;
  onOpenPageSelect?: () => void;
  onPageChange: (pageIndex: number) => void;
  onPrevious: () => void;
  totalPages: number;
}

export default function VideoListPagination({
  canGoNext,
  canGoPrevious,
  currentPage,
  label,
  onNext,
  onOpenPageSelect,
  onPageChange,
  onPrevious,
  totalPages,
}: VideoListPaginationProps) {
  return (
    <div className="video-list__pagination" aria-label={label} role="navigation">
      <button
        aria-label="이전"
        className="video-list__page-button"
        disabled={!canGoPrevious}
        onClick={onPrevious}
        title="이전"
        type="button"
      >
        <span className="video-list__page-icon" aria-hidden="true">‹</span>
      </button>
      <span className="video-list__page-status">
        <select
          aria-label="현재 페이지"
          className="video-list__page-select"
          onFocus={onOpenPageSelect}
          onChange={(event) => onPageChange(Number(event.target.value) - 1)}
          onPointerDown={onOpenPageSelect}
          value={currentPage}
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <span className="video-list__page-divider" aria-hidden="true">/</span>
        <span className="video-list__page-total">{totalPages}</span>
      </span>
      <button
        aria-label="다음"
        className="video-list__page-button"
        disabled={!canGoNext}
        onClick={onNext}
        title="다음"
        type="button"
      >
        <span className="video-list__page-icon" aria-hidden="true">›</span>
      </button>
    </div>
  );
}
