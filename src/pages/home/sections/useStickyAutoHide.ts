import { useLayoutEffect, useState, type RefObject } from 'react';

type ScrollTarget = HTMLElement | Window;
type ScrollTargetRef = RefObject<HTMLElement | null>;

const HIDE_DELTA = 6;
const SHOW_TOP = 12;

function readScrollTop(target: ScrollTarget) {
  if (target instanceof HTMLElement) {
    return Math.max(0, Math.round(target.scrollTop || 0));
  }

  return Math.max(0, Math.round(
    target.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0,
  ));
}

function getScrollTargets(refs: ScrollTargetRef[]) {
  const targets: ScrollTarget[] = [window];

  refs.forEach((ref) => {
    if (ref.current && !targets.includes(ref.current)) {
      targets.push(ref.current);
    }
  });

  return targets;
}

export default function useStickyAutoHide(enabled: boolean, refs: ScrollTargetRef[] = []) {
  const [hidden, setHidden] = useState(false);

  useLayoutEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setHidden(false);
      return;
    }

    let frame = 0;
    const targets = getScrollTargets(refs);
    const previousPositions = new Map(
      targets.map((target) => [target, readScrollTop(target)]),
    );

    setHidden(targets.some((target) => readScrollTop(target) > SHOW_TOP));

    const sync = () => {
      frame = 0;
      let shouldHide = false;
      let shouldShow = false;

      targets.forEach((target) => {
        const next = readScrollTop(target);
        const previous = previousPositions.get(target) ?? next;
        const diff = next - previous;

        if (diff < -HIDE_DELTA || (next <= SHOW_TOP && previous > SHOW_TOP)) {
          shouldShow = true;
        } else if (diff > HIDE_DELTA) {
          shouldHide = true;
        }

        if (Math.abs(diff) >= HIDE_DELTA || next <= SHOW_TOP) {
          previousPositions.set(target, next);
        }
      });

      if (shouldShow) {
        setHidden(false);
      } else if (shouldHide) {
        setHidden(true);
      }
    };

    const schedule = () => {
      frame ||= window.requestAnimationFrame(sync);
    };

    window.addEventListener('resize', schedule);
    targets.forEach((target) => {
      target.addEventListener('scroll', schedule, { passive: true });
    });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener('resize', schedule);
      targets.forEach((target) => {
        target.removeEventListener('scroll', schedule);
      });
    };
  }, [enabled, refs]);

  return hidden;
}
