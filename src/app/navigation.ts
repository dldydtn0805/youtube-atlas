export const APP_NAVIGATION_EVENT = 'youtube-atlas:navigation';

export function getCurrentAppPath() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return `${window.location.pathname}${window.location.search}`;
}

export function navigateToAppPath(path: string, options?: { replace?: boolean }) {
  if (typeof window === 'undefined' || getCurrentAppPath() === path) {
    return;
  }

  if (options?.replace) {
    window.history.replaceState(null, '', path);
  } else {
    window.history.pushState(null, '', path);
  }

  window.dispatchEvent(new Event(APP_NAVIGATION_EVENT));
}

export function subscribeToAppNavigation(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('popstate', listener);
  window.addEventListener(APP_NAVIGATION_EVENT, listener);

  return () => {
    window.removeEventListener('popstate', listener);
    window.removeEventListener(APP_NAVIGATION_EVENT, listener);
  };
}
