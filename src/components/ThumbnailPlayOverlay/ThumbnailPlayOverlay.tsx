import './ThumbnailPlayOverlay.css';

interface ThumbnailPlayOverlayProps {
  className?: string;
}

export default function ThumbnailPlayOverlay({ className }: ThumbnailPlayOverlayProps) {
  return (
    <span className={className ? `thumbnail-play-overlay ${className}` : 'thumbnail-play-overlay'} aria-hidden="true">
      <span className="thumbnail-play-overlay__icon" />
    </span>
  );
}
