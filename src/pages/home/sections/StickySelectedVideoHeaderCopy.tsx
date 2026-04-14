interface StickySelectedVideoHeaderCopyProps {
  label: string;
  onLabelClick?: () => void;
  title?: string;
}

export default function StickySelectedVideoHeaderCopy({
  label,
  onLabelClick,
  title,
}: StickySelectedVideoHeaderCopyProps) {
  return (
    <div className="app-shell__game-panel-actions-header-copy">
      {onLabelClick ? (
        <button
          className="app-shell__game-panel-actions-eyebrow app-shell__game-panel-actions-eyebrow-button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onLabelClick();
          }}
          onKeyDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          {label}
        </button>
      ) : (
        <p className="app-shell__game-panel-actions-eyebrow">{label}</p>
      )}
      {title ? (
        <p
          className="app-shell__game-panel-actions-header-title"
          title={title}
        >
          {title}
        </p>
      ) : null}
    </div>
  );
}
