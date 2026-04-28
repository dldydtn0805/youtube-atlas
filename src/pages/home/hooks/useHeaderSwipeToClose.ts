import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';

const TOUCH_SWIPE_CLOSE_THRESHOLD_RATIO = 0.3;
const TOUCH_MIN_SWIPE_CLOSE_THRESHOLD = 184;
const TOUCH_MAX_SWIPE_CLOSE_THRESHOLD = 252;
const MAX_DRAG_OFFSET_RATIO = 0.6;
const MIN_DRAG_OFFSET = 216;
const INTERACTIVE_TARGET_SELECTOR = 'button, a, input, textarea, select, label';
const BACKDROP_FADE_START_PROGRESS = 0.08;
const MIN_BACKDROP_OPACITY = 0.18;
const TOUCH_VISIBLE_DRAG_CLOSE_THRESHOLD = 188;
const CLOSE_ANIMATION_DURATION_MS = 220;
const MIN_CLOSE_ANIMATION_OFFSET = 360;

interface HeaderSwipeToCloseOptions {
  disabled?: boolean;
  onClose: () => void;
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && target.closest(INTERACTIVE_TARGET_SELECTOR);
}

function clampDragOffset(offset: number) {
  return Math.max(0, offset);
}

function getFadeProgress(progress: number, fadeStartProgress: number) {
  if (progress <= fadeStartProgress) {
    return 0;
  }

  return Math.min((progress - fadeStartProgress) / (1 - fadeStartProgress), 1);
}

export default function useHeaderSwipeToClose({ disabled = false, onClose }: HeaderSwipeToCloseOptions) {
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const pendingDragOffsetRef = useRef(0);
  const isSwipeCandidateRef = useRef(false);
  const swipeCloseThresholdRef = useRef(TOUCH_MIN_SWIPE_CLOSE_THRESHOLD);
  const maxDragOffsetRef = useRef(MIN_DRAG_OFFSET);
  const closeTimerRef = useRef<number | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [motionState, setMotionState] = useState<'idle' | 'dragging' | 'closing'>('idle');

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const cancelDragFrame = useCallback(() => {
    if (dragFrameRef.current !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(dragFrameRef.current);
      dragFrameRef.current = null;
    }
  }, []);

  const flushDragOffset = useCallback((nextOffset: number) => {
    pendingDragOffsetRef.current = nextOffset;
    dragOffsetRef.current = nextOffset;
    cancelDragFrame();
    setDragOffset(nextOffset);
  }, [cancelDragFrame]);

  const scheduleDragOffset = useCallback((nextOffset: number) => {
    pendingDragOffsetRef.current = nextOffset;
    dragOffsetRef.current = nextOffset;

    if (typeof window === 'undefined') {
      setDragOffset(nextOffset);
      return;
    }

    if (dragFrameRef.current !== null) {
      return;
    }

    dragFrameRef.current = window.requestAnimationFrame(() => {
      dragFrameRef.current = null;
      setDragOffset(pendingDragOffsetRef.current);
    });
  }, []);

  const resetSwipeState = useCallback(() => {
    clearCloseTimer();
    cancelDragFrame();
    pointerIdRef.current = null;
    dragOffsetRef.current = 0;
    pendingDragOffsetRef.current = 0;
    isSwipeCandidateRef.current = false;
    setMotionState('idle');
    setDragOffset(0);
  }, [cancelDragFrame, clearCloseTimer]);

  useEffect(
    () => () => {
      clearCloseTimer();
      cancelDragFrame();
    },
    [cancelDragFrame, clearCloseTimer],
  );

  useEffect(() => {
    if (disabled) {
      resetSwipeState();
    }
  }, [disabled, resetSwipeState]);

  const swipeHandlers = useMemo(
    () => ({
      onPointerCancel(event: ReactPointerEvent<HTMLElement>) {
        if (pointerIdRef.current !== event.pointerId) {
          return;
        }

        resetSwipeState();
      },
      onPointerDown(event: ReactPointerEvent<HTMLElement>) {
        if (
          disabled ||
          motionState === 'closing' ||
          event.pointerType === 'mouse' ||
          (event.pointerType !== 'touch' && event.pointerType !== 'pen') ||
          isInteractiveTarget(event.target)
        ) {
          return;
        }

        pointerIdRef.current = event.pointerId;
        startXRef.current = event.clientX;
        startYRef.current = event.clientY;
        dragOffsetRef.current = 0;
        pendingDragOffsetRef.current = 0;
        isSwipeCandidateRef.current = true;
        const viewportHeight = typeof window === 'undefined' ? 0 : window.innerHeight;
        swipeCloseThresholdRef.current = Math.min(
          TOUCH_MAX_SWIPE_CLOSE_THRESHOLD,
          Math.max(
            TOUCH_MIN_SWIPE_CLOSE_THRESHOLD,
            Math.round(viewportHeight * TOUCH_SWIPE_CLOSE_THRESHOLD_RATIO),
          ),
        );
        maxDragOffsetRef.current = Math.max(
          MIN_DRAG_OFFSET,
          Math.round(viewportHeight * MAX_DRAG_OFFSET_RATIO),
        );
        setMotionState('dragging');
        setDragOffset(0);
        if (typeof event.currentTarget.setPointerCapture === 'function') {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      },
      onPointerMove(event: ReactPointerEvent<HTMLElement>) {
        if (disabled || pointerIdRef.current !== event.pointerId || !isSwipeCandidateRef.current) {
          return;
        }

        const deltaX = Math.abs(event.clientX - startXRef.current);
        const deltaY = event.clientY - startYRef.current;

        if (deltaY <= 0) {
          isSwipeCandidateRef.current = false;
          setMotionState('idle');
          setDragOffset(0);
          dragOffsetRef.current = 0;
          pendingDragOffsetRef.current = 0;
          return;
        }

        if (deltaY < 10) {
          return;
        }

        if (deltaX > deltaY * 0.7) {
          isSwipeCandidateRef.current = false;
          setMotionState('idle');
          dragOffsetRef.current = 0;
          setDragOffset(0);
          return;
        }

        const nextDragOffset = Math.min(clampDragOffset(deltaY * 0.92), maxDragOffsetRef.current);
        scheduleDragOffset(nextDragOffset);

        if (event.cancelable) {
          event.preventDefault();
        }
      },
      onPointerUp(event: ReactPointerEvent<HTMLElement>) {
        if (disabled || pointerIdRef.current !== event.pointerId) {
          return;
        }

        const deltaX = Math.abs(event.clientX - startXRef.current);
        const deltaY = event.clientY - startYRef.current;
        const resolvedDragOffset = dragOffsetRef.current;
        const shouldClose =
          isSwipeCandidateRef.current &&
          deltaX <= deltaY * 0.7 &&
          (
            deltaY >= swipeCloseThresholdRef.current ||
            resolvedDragOffset >= TOUCH_VISIBLE_DRAG_CLOSE_THRESHOLD
          );

        if (
          typeof event.currentTarget.hasPointerCapture === 'function' &&
          typeof event.currentTarget.releasePointerCapture === 'function' &&
          event.currentTarget.hasPointerCapture(event.pointerId)
        ) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }

        if (shouldClose) {
          clearCloseTimer();
          pointerIdRef.current = null;
          isSwipeCandidateRef.current = false;
          const viewportHeight = typeof window === 'undefined' ? MIN_CLOSE_ANIMATION_OFFSET : window.innerHeight;
          const closeOffset = Math.max(
            MIN_CLOSE_ANIMATION_OFFSET,
            Math.round(viewportHeight * 0.9),
            resolvedDragOffset + 180,
          );
          setMotionState('closing');
          flushDragOffset(closeOffset);
          if (typeof window !== 'undefined') {
            closeTimerRef.current = window.setTimeout(() => {
              closeTimerRef.current = null;
              onClose();
            }, CLOSE_ANIMATION_DURATION_MS);
          } else {
            onClose();
          }
          return;
        }

        resetSwipeState();
      },
    }),
    [clearCloseTimer, disabled, flushDragOffset, motionState, onClose, resetSwipeState, scheduleDragOffset],
  );

  const modalStyle = useMemo<CSSProperties>(
    () => {
      const isDragging = motionState === 'dragging';
      const isClosing = motionState === 'closing';

      return {
        transform: dragOffset > 0 ? `translate3d(0, ${dragOffset}px, 0)` : undefined,
        transition: isDragging ? 'none' : `transform ${CLOSE_ANIMATION_DURATION_MS}ms ease-out`,
        willChange: isDragging || isClosing ? 'transform' : undefined,
      };
    },
    [dragOffset, motionState],
  );

  const backdropStyle = useMemo<CSSProperties>(
    () => {
      const isDragging = motionState === 'dragging';
      const isClosing = motionState === 'closing';
      const dragProgress =
        maxDragOffsetRef.current > 0 ? Math.min(Math.max(dragOffset / maxDragOffsetRef.current, 0), 1) : 0;
      const fadeProgress = getFadeProgress(dragProgress, BACKDROP_FADE_START_PROGRESS);
      const easedFadeProgress = fadeProgress ** 2;

      return {
        opacity: dragOffset > 0 ? Math.max(MIN_BACKDROP_OPACITY, 1 - easedFadeProgress * 0.82) : undefined,
        transition: isDragging ? 'none' : `opacity ${CLOSE_ANIMATION_DURATION_MS}ms ease-out`,
        willChange: isDragging || isClosing ? 'opacity' : undefined,
      };
    },
    [dragOffset, motionState],
  );

  return {
    backdropStyle,
    headerSwipeHandlers: swipeHandlers,
    modalStyle,
  };
}
