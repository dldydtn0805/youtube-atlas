import GoogleLoginButton from '../../../components/GoogleLoginButton/GoogleLoginButton';
import type { AuthStatus, AuthUser } from '../../../features/auth/types';
import { formatPoints } from '../gameHelpers';
import './AppHeader.css';

interface AppHeaderProps {
  authStatus: AuthStatus;
  currentTierCode?: string | null;
  currentTierName?: string | null;
  isDarkMode: boolean;
  isLoggingOut: boolean;
  onLogout: () => void;
  onOpenGameModal?: () => void;
  onOpenTierModal?: () => void;
  onOpenWalletModal?: () => void;
  onToggleThemeMode: () => void;
  themeToggleLabel: string;
  user?: AuthUser | null;
  walletBalancePoints?: number | null;
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
  currentTierCode,
  currentTierName,
  isDarkMode,
  isLoggingOut,
  onLogout,
  onOpenGameModal,
  onOpenTierModal,
  onOpenWalletModal,
  onToggleThemeMode,
  themeToggleLabel,
  user,
  walletBalancePoints,
}: AppHeaderProps) {
  const userIdentityLabel = user?.displayName || user?.email || 'Google 계정';
  const walletSummary =
    typeof walletBalancePoints === 'number' && Number.isFinite(walletBalancePoints)
      ? formatPoints(walletBalancePoints)
      : '집계 중';
  const tierSummary = currentTierName?.trim() || '미정';
  const canOpenGameModalFromProfile = typeof onOpenGameModal === 'function';
  const profileButtonLabel = `${userIdentityLabel} 프로필로 게임 내역 열기`;

  return (
    <header className="app-shell__header">
      <div className="app-shell__header-top">
        <h1 className="app-shell__title">YouTube Atlas</h1>
        <div className="app-shell__header-actions">
          {authStatus === 'authenticated' && user ? (
            <div className="app-shell__auth-summary" aria-label="내 지갑 및 티어">
              <button
                aria-label="지갑 현황 열기"
                className="app-shell__auth-summary-item app-shell__auth-summary-item--button"
                onClick={onOpenWalletModal}
                type="button"
              >
                <span className="app-shell__auth-summary-label">잔액</span>
                <strong className="app-shell__auth-summary-value">{walletSummary}</strong>
              </button>
              <button
                aria-label="티어 현황 열기"
                className="app-shell__auth-summary-item app-shell__auth-summary-item--button"
                data-tier-code={currentTierCode ?? undefined}
                onClick={onOpenTierModal}
                type="button"
              >
                <span className="app-shell__auth-summary-label">티어</span>
                <strong className="app-shell__auth-summary-value">{tierSummary}</strong>
              </button>
              <button
                aria-label="게임 패널 열기"
                className="app-shell__auth-summary-item app-shell__auth-summary-item--button"
                onClick={onOpenGameModal}
                type="button"
              >
                <span className="app-shell__auth-summary-label">게임</span>
                <strong className="app-shell__auth-summary-value">열기</strong>
              </button>
            </div>
          ) : null}
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
              {canOpenGameModalFromProfile ? (
                <button
                  aria-label={profileButtonLabel}
                  className="app-shell__auth-avatar-button"
                  onClick={onOpenGameModal}
                  title={profileButtonLabel}
                  type="button"
                >
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
                </button>
              ) : (
                <>
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
                </>
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
