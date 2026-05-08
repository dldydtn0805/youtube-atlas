interface LazyModalFallbackProps {
  title: string;
}

export default function LazyModalFallback({ title }: LazyModalFallbackProps) {
  return (
    <div className="app-shell__fullscreen-loading" role="status" aria-live="polite" aria-modal="true">
      <div className="app-shell__fullscreen-loading-card">
        <span className="app-shell__fullscreen-loading-spinner" aria-hidden="true" />
        <p className="app-shell__fullscreen-loading-eyebrow">Loading</p>
        <p className="app-shell__fullscreen-loading-title">{title}</p>
      </div>
    </div>
  );
}
