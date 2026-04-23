import { useEffect, useRef, useState } from 'react';
import { isApiConfigured } from '../../lib/api';
import { useAuth } from '../../features/auth/useAuth';
import './GoogleLoginButton.css';

const GOOGLE_IDENTITY_SCRIPT_SELECTOR = 'script[data-google-identity-script="true"]';
const GOOGLE_IDENTITY_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const GOOGLE_AUTH_SCOPES = 'openid email profile';

let googleIdentityScriptPromise: Promise<void> | null = null;
type GoogleButtonStatus = 'idle' | 'loading' | 'ready' | 'failed';
type GoogleCodeClient = {
  requestCode: () => void;
};

function loadGoogleIdentityScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  if (googleIdentityScriptPromise) {
    return googleIdentityScriptPromise;
  }

  googleIdentityScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(GOOGLE_IDENTITY_SCRIPT_SELECTOR);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('failed_to_load_google_identity')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');

    script.src = GOOGLE_IDENTITY_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentityScript = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('failed_to_load_google_identity'));

    document.head.appendChild(script);
  });

  return googleIdentityScriptPromise;
}

export default function GoogleLoginButton() {
  const {
    authError,
    clearAuthError,
    googleClientId,
    isGoogleAuthAvailable,
    isGoogleAuthLoading,
    isLoggingIn,
    loginWithGoogleAuthorizationCode,
    status,
  } = useAuth();
  const codeClientRef = useRef<GoogleCodeClient | null>(null);
  const loginWithGoogleAuthorizationCodeRef = useRef(loginWithGoogleAuthorizationCode);
  const [buttonError, setButtonError] = useState<string | null>(null);
  const [buttonStatus, setButtonStatus] = useState<GoogleButtonStatus>('idle');
  const isLoginReady = isApiConfigured && isGoogleAuthAvailable && Boolean(googleClientId);
  const shouldRenderButton = status !== 'authenticated' && !isGoogleAuthLoading && isLoginReady;
  const isButtonReady = buttonStatus === 'ready' && !isLoggingIn;
  const infoMessage = !isApiConfigured
    ? '백엔드 연결 필요'
    : status === 'loading'
      ? '로그인 확인 중'
      : isGoogleAuthLoading
        ? '로그인 설정 확인 중'
        : !isLoginReady
          ? '로그인 설정 필요'
          : buttonStatus === 'loading'
            ? '로그인 준비 중'
            : isLoggingIn
              ? '로그인 처리 중'
              : null;
  const isLoadingState =
    status === 'loading' || isGoogleAuthLoading || buttonStatus === 'loading' || isLoggingIn;
  const statusMessage = buttonError ?? authError ?? infoMessage;
  const isStatusError = Boolean(buttonError || authError);

  useEffect(() => {
    loginWithGoogleAuthorizationCodeRef.current = loginWithGoogleAuthorizationCode;
  }, [loginWithGoogleAuthorizationCode]);

  useEffect(() => {
    if (!isStatusError || !statusMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setButtonError(null);
      clearAuthError();
    }, 3600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [clearAuthError, isStatusError, statusMessage]);

  useEffect(() => {
    if (!shouldRenderButton) {
      setButtonStatus('idle');
      codeClientRef.current = null;
      return;
    }

    let isCancelled = false;

    setButtonStatus('loading');
    setButtonError(null);

    const markButtonFailure = (message: string) => {
      if (isCancelled) {
        return;
      }

      codeClientRef.current = null;
      setButtonStatus('failed');
      setButtonError(message);
    };

    void loadGoogleIdentityScript()
      .then(() => {
        if (isCancelled) {
          return;
        }

        const googleOAuth = window.google?.accounts?.oauth2;

        if (!googleOAuth) {
          markButtonFailure('로그인 초기화 실패');
          return;
        }

        codeClientRef.current = googleOAuth.initCodeClient({
          callback: (response) => {
            if (response.error || !response.code) {
              setButtonError(
                response.error_description || '로그인에 실패했어요. 다시 시도해 주세요.',
              );
              return;
            }

            setButtonError(null);
            clearAuthError();
            void loginWithGoogleAuthorizationCodeRef.current(response.code, window.location.origin).catch(() => {
              // The provider stores the user-facing error message for the header.
            });
          },
          client_id: googleClientId,
          error_callback: (error) => {
            if (error.type === 'popup_closed') {
              return;
            }

            markButtonFailure('팝업 허용 후 다시 시도해 주세요');
          },
          scope: GOOGLE_AUTH_SCOPES,
          select_account: true,
          ux_mode: 'popup',
        });
        setButtonStatus('ready');
      })
      .catch(() => {
        markButtonFailure('로그인 로드 실패');
      });

    return () => {
      isCancelled = true;
      codeClientRef.current = null;
    };
  }, [clearAuthError, googleClientId, shouldRenderButton]);

  const handleStartLogin = () => {
    if (!codeClientRef.current || !isButtonReady) {
      return;
    }

    setButtonError(null);
    clearAuthError();
    codeClientRef.current.requestCode();
  };

  return (
    <div className="app-shell__google-login">
      <button
        aria-describedby={statusMessage ? 'google-login-status' : undefined}
        aria-busy={isLoggingIn}
        aria-label="Google로 로그인"
        className="app-shell__google-login-trigger"
        disabled={!isLoginReady || !isButtonReady}
        onClick={handleStartLogin}
        type="button"
      >
        {isLoadingState ? (
          <span aria-hidden="true" className="app-shell__google-login-spinner" />
        ) : (
          <span aria-hidden="true" className="app-shell__google-login-trigger-glyph">
            G
          </span>
        )}
      </button>
      {statusMessage ? (
        <aside
          aria-live={isStatusError ? 'assertive' : 'polite'}
          className={`app-shell__auth-status${isStatusError ? ' app-shell__auth-status--error' : ''}`}
          id="google-login-status"
          role={isStatusError ? 'alert' : 'status'}
        >
          <p>{statusMessage}</p>
          {isStatusError ? (
            <button
              aria-label="로그인 상태 토스트 닫기"
              className="app-shell__auth-status-close"
              onClick={() => {
                setButtonError(null);
                clearAuthError();
              }}
              type="button"
            >
              닫기
            </button>
          ) : null}
        </aside>
      ) : null}
    </div>
  );
}
