import GoogleLoginButton from '../../../components/GoogleLoginButton/GoogleLoginButton';
import type { AuthStatus, AuthUser } from '../../../features/auth/types';
import './AppHeader.css';

interface AppHeaderProps {
  authStatus: AuthStatus;
  isDarkMode: boolean;
  isLoggingOut: boolean;
  onLogout: () => void;
  onToggleThemeMode: () => void;
  themeToggleLabel: string;
  user?: AuthUser | null;
}

function ThemeToggleIcon({ isDarkMode }: { isDarkMode: boolean }) {
  if (isDarkMode) {
    return (
      <svg
        aria-hidden="true"
        className="app-shell__theme-toggle-icon"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M14.5 3.5a7.5 7.5 0 1 0 6 12 8.5 8.5 0 1 1-6-12Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="app-shell__theme-toggle-icon"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" fill="currentColor" r="4.5" />
      <path
        d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.54 5.46l-1.77 1.77M7.23 16.77l-1.77 1.77M18.54 18.54l-1.77-1.77M7.23 7.23 5.46 5.46"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function AppHeader({
  authStatus,
  isDarkMode,
  isLoggingOut,
  onLogout,
  onToggleThemeMode,
  themeToggleLabel,
  user,
}: AppHeaderProps) {
  const userIdentityLabel = user?.displayName || user?.email || 'Google 계정';

  return (
    <header className="app-shell__header">
      <div className="app-shell__header-top">
        <h1 className="app-shell__title">YouTube Atlas</h1>
        <div className="app-shell__header-actions">
          <button
            aria-label={themeToggleLabel}
            aria-pressed={isDarkMode}
            className="app-shell__theme-toggle"
            data-active={isDarkMode}
            onClick={onToggleThemeMode}
            type="button"
          >
            <ThemeToggleIcon isDarkMode={isDarkMode} />
          </button>
          {authStatus === 'authenticated' && user ? (
            <div className="app-shell__auth-session">
              {user.pictureUrl ? (
                <img
                  alt={`${userIdentityLabel} 프로필`}
                  className="app-shell__auth-avatar"
                  src={user.pictureUrl}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="app-shell__auth-avatar app-shell__auth-avatar--fallback"
                >
                  {userIdentityLabel.slice(0, 1).toUpperCase()}
                </span>
              )}
              <button
                className="app-shell__auth-logout"
                onClick={onLogout}
                title={userIdentityLabel}
                type="button"
              >
                {isLoggingOut ? '...' : '로그아웃'}
              </button>
            </div>
          ) : (
            <div className="app-shell__auth-panel">
              <GoogleLoginButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
