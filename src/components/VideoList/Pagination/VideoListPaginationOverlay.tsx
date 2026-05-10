import { createPortal } from 'react-dom';
import './VideoListPaginationOverlay.css';

export default function VideoListPaginationOverlay() {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="video-list-pagination-overlay" role="status" aria-live="polite">
      <div className="video-list-pagination-overlay__panel">
        <span className="video-list-pagination-overlay__spinner" aria-hidden="true" />
        <span>페이지를 준비하는 중입니다.</span>
      </div>
    </div>,
    document.body,
  );
}
