import { useEffect, useRef, useState } from 'react';
import { isApiConfigured } from '../../lib/api';
import { useAuth } from '../../features/auth/useAuth';

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

  useEffect(() => {
    loginWithGoogleAuthorizationCodeRef.current = loginWithGoogleAuthorizationCode;
  }, [loginWithGoogleAuthorizationCode]);

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
          markButtonFailure('구글 로그인 스크립트를 초기화하지 못했습니다.');
          return;
        }

        codeClientRef.current = googleOAuth.initCodeClient({
          callback: (response) => {
            if (response.error || !response.code) {
              setButtonError(
                response.error_description || '구글 로그인 승인 코드를 받지 못했습니다. 잠시 후 다시 시도해 주세요.',
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

            markButtonFailure('구글 로그인 창을 열지 못했습니다. 팝업 차단 설정을 확인해 주세요.');
          },
          scope: GOOGLE_AUTH_SCOPES,
          select_account: true,
          ux_mode: 'popup',
        });
        setButtonStatus('ready');
      })
      .catch(() => {
        markButtonFailure('구글 로그인 스크립트를 불러오지 못했습니다.');
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

  if (!isApiConfigured) {
    return <p className="app-shell__auth-status">백엔드 연결 후 로그인 기능을 사용할 수 있습니다.</p>;
  }

  if (status === 'loading') {
    return <p className="app-shell__auth-status">저장된 로그인 세션을 확인하는 중입니다.</p>;
  }

  if (isGoogleAuthLoading) {
    return <p className="app-shell__auth-status">구글 로그인 설정을 불러오는 중입니다.</p>;
  }

  if (!isLoginReady) {
    return <p className="app-shell__auth-status">백엔드에 구글 로그인 Client ID가 아직 설정되지 않았습니다.</p>;
  }

  return (
    <div className="app-shell__google-login">
      <button
        aria-busy={isLoggingIn}
        aria-label="Google로 로그인"
        className="app-shell__google-login-trigger"
        disabled={!isButtonReady}
        onClick={handleStartLogin}
        type="button"
      >
        <span aria-hidden="true" className="app-shell__google-login-trigger-glyph">
          G
        </span>
      </button>
      {buttonStatus === 'loading' ? (
        <p className="app-shell__auth-status">구글 로그인 준비 중입니다.</p>
      ) : null}
      {isLoggingIn ? <p className="app-shell__auth-status">구글 계정을 확인하고 있습니다.</p> : null}
      {buttonError || authError ? (
        <p className="app-shell__auth-status app-shell__auth-status--error">
          {buttonError ?? authError}
        </p>
      ) : null}
    </div>
  );
}
