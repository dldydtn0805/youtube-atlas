import type { ReactNode } from 'react';

interface StickySelectedVideoControlsProps {
  isMobileLayout: boolean;
  isMobilePlayerPreviewEnabled?: boolean;
  isPlaybackPaused?: boolean;
  onCollapsePanel?: () => void;
  onExpandPanel?: () => void;
  onJumpToTop?: () => void;
  onNextVideo?: () => void;
  onPauseVideo?: () => void;
  onPreviousVideo?: () => void;
  onResumeVideo?: () => void;
  onScrollToTop?: () => void;
  onToggleMobilePlayerPreviewEnabled?: () => void;
}

function ControlButton({
  ariaLabel,
  children,
  isActive = false,
  onClick,
  title,
}: {
  ariaLabel: string;
  children: ReactNode;
  isActive?: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="app-shell__game-panel-action-utility"
      data-active={isActive ? 'true' : undefined}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

export default function StickySelectedVideoControls({
  isMobileLayout,
  isMobilePlayerPreviewEnabled = false,
  isPlaybackPaused = false,
  onCollapsePanel,
  onExpandPanel,
  onJumpToTop,
  onNextVideo,
  onPauseVideo,
  onPreviousVideo,
  onResumeVideo,
  onScrollToTop,
  onToggleMobilePlayerPreviewEnabled,
}: StickySelectedVideoControlsProps) {
  const hasPlaybackControls = Boolean(onPreviousVideo && onNextVideo && ((isPlaybackPaused && onResumeVideo) || (!isPlaybackPaused && onPauseVideo)));

  return (
    <>
      {hasPlaybackControls ? (
        <>
          <ControlButton ariaLabel="이전 영상" onClick={onPreviousVideo!} title="이전 영상">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M14.5 7.5 10 12l4.5 4.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </ControlButton>
          {isPlaybackPaused ? (
            <ControlButton ariaLabel="재생" onClick={onResumeVideo!} title="재생">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M10 8.25v7.5l5.75-3.75L10 8.25Z"
                  fill="currentColor"
                />
              </svg>
            </ControlButton>
          ) : (
            <ControlButton ariaLabel="일시 정지" onClick={onPauseVideo!} title="일시 정지">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M9.25 7.5v9"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
                <path
                  d="M14.75 7.5v9"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
            </ControlButton>
          )}
          <ControlButton ariaLabel="다음 영상" onClick={onNextVideo!} title="다음 영상">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9.5 7.5 14 12l-4.5 4.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </ControlButton>
        </>
      ) : null}
      {isMobileLayout && onJumpToTop ? (
        <ControlButton ariaLabel="페이지 맨 위로 즉시 이동" onClick={onJumpToTop} title="맨 위로">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7.5 13.5 12 9l4.5 4.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="M12 9v10"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="M7 5h10"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </svg>
        </ControlButton>
      ) : null}
      {isMobileLayout && onToggleMobilePlayerPreviewEnabled ? (
        <button
          aria-label={isMobilePlayerPreviewEnabled ? '미니 플레이어 숨기기' : '미니 플레이어 보기'}
          className="app-shell__game-panel-action-utility app-shell__game-panel-action-utility--preview-toggle"
          data-active={isMobilePlayerPreviewEnabled ? 'true' : 'false'}
          onClick={onToggleMobilePlayerPreviewEnabled}
          title={isMobilePlayerPreviewEnabled ? '미니 플레이어 숨기기' : '미니 플레이어 보기'}
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect
              x="3.5"
              y="5"
              width="17"
              height="11"
              rx="2.5"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M9 19h6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="M12 16v3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path
              d="M8 3.5 12 5.8 16 3.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <rect
              x="6.75"
              y="8"
              width="10.5"
              height="5.5"
              rx="1.25"
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="1.4"
            />
          </svg>
        </button>
      ) : null}
      {!isMobileLayout && onExpandPanel ? (
        <ControlButton ariaLabel="선택한 영상 패널 펼치기" onClick={onExpandPanel} title="펼치기">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 6v12M6 12h12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </ControlButton>
      ) : null}
      {!isMobileLayout && onCollapsePanel ? (
        <ControlButton ariaLabel="선택한 영상 패널 접기" onClick={onCollapsePanel} title="접기">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 12h12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </ControlButton>
      ) : null}
      {!isMobileLayout && onScrollToTop ? (
        <ControlButton ariaLabel="선택한 영상 패널을 맨 위로 이동" onClick={onScrollToTop} title="맨 위로">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7.5 14.5 12 10l4.5 4.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </ControlButton>
      ) : null}
    </>
  );
}
