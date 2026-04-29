export const MOBILE_BREAKPOINT = 768;
export const MOBILE_MIN_HEIGHT = 500;
export const MOBILE_LANDSCAPE_MAX_WIDTH = 1024;
export const MOBILE_LANDSCAPE_MAX_HEIGHT = MOBILE_MIN_HEIGHT;

const MOBILE_PORTRAIT_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px) and (min-height: ${MOBILE_MIN_HEIGHT}px)`;
const MOBILE_LANDSCAPE_QUERY = [
  `(max-width: ${MOBILE_LANDSCAPE_MAX_WIDTH}px)`,
  `(max-height: ${MOBILE_LANDSCAPE_MAX_HEIGHT}px)`,
  '(orientation: landscape)',
  '(pointer: coarse)',
].join(' and ');
export const MOBILE_LAYOUT_MEDIA_QUERY = [
  MOBILE_PORTRAIT_QUERY,
  MOBILE_LANDSCAPE_QUERY,
].join(', ');

export function getInitialIsMobileLayout() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(MOBILE_LAYOUT_MEDIA_QUERY).matches;
}
