import GoogleLoginButton from '../../../components/GoogleLoginButton/GoogleLoginButton';
import type { AuthStatus, AuthUser } from '../../../features/auth/types';
import './AppHeader.css';

interface AppHeaderProps {
  authStatus: AuthStatus;
  isDarkMode: boolean;
  isLoggingOut: boolean;
  onLogout: () => void;
  onToggleThemeMode: () => void;
  themeToggleDisplayLabel: string;
  themeToggleLabel: string;
  user?: AuthUser | null;
}

function AppHeader({
  authStatus,
  isDarkMode,
  isLoggingOut,
  onLogout,
  onToggleThemeMode,
  themeToggleDisplayLabel,
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
            {themeToggleDisplayLabel}
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
