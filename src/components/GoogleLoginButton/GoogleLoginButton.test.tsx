import { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import GoogleLoginButton from './GoogleLoginButton';

const useAuthMock = vi.fn();
const initCodeClientMock = vi.fn();
const requestCodeMock = vi.fn();

vi.mock('../../lib/api', () => ({
  isApiConfigured: true,
}));

vi.mock('../../features/auth/useAuth', () => ({
  useAuth: () => useAuthMock(),
}));

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

describe('GoogleLoginButton', () => {
  beforeEach(() => {
    initCodeClientMock.mockReset();
    requestCodeMock.mockReset();
    initCodeClientMock.mockReturnValue({
      requestCode: requestCodeMock,
    });
    window.google = {
      accounts: {
        oauth2: {
          initCodeClient: initCodeClientMock,
        },
      },
    };
    useAuthMock.mockReturnValue({
      authError: null,
      clearAuthError: vi.fn(),
      googleClientId: 'client-id',
      isGoogleAuthAvailable: true,
      isGoogleAuthLoading: false,
      isLoggingIn: false,
      loginWithGoogleAuthorizationCode: vi.fn(),
      status: 'anonymous',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('initializes the Google OAuth code client and renders the custom trigger', async () => {
    render(<GoogleLoginButton />);

    await act(async () => {
      await flushPromises();
    });

    expect(screen.getByRole('button', { name: 'Google로 로그인' })).toBeEnabled();
    expect(screen.queryByText('구글 로그인 준비 중입니다.')).not.toBeInTheDocument();
    expect(initCodeClientMock).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: 'client-id',
        scope: 'openid email profile',
        ux_mode: 'popup',
      }),
    );
  });

  it('requests an authorization code when the custom button is clicked', async () => {
    render(<GoogleLoginButton />);

    await act(async () => {
      await flushPromises();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Google로 로그인' }));

    expect(requestCodeMock).toHaveBeenCalledTimes(1);
  });

  it('forwards the authorization code to the auth provider with the current origin', async () => {
    const loginWithGoogleAuthorizationCode = vi.fn().mockResolvedValue(undefined);
    useAuthMock.mockReturnValue({
      authError: null,
      clearAuthError: vi.fn(),
      googleClientId: 'client-id',
      isGoogleAuthAvailable: true,
      isGoogleAuthLoading: false,
      isLoggingIn: false,
      loginWithGoogleAuthorizationCode,
      status: 'anonymous',
    });

    render(<GoogleLoginButton />);

    await act(async () => {
      await flushPromises();
    });

    const config = initCodeClientMock.mock.calls[0]?.[0];

    await act(async () => {
      config.callback({ code: 'auth-code' });
      await flushPromises();
    });

    expect(loginWithGoogleAuthorizationCode).toHaveBeenCalledWith('auth-code', window.location.origin);
  });

  it('shows a clear error when the OAuth client cannot be initialized', async () => {
    window.google = {};
    const appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
      const script = node as HTMLScriptElement;

      script.onload?.(new Event('load'));
      return node;
    });

    render(<GoogleLoginButton />);

    await act(async () => {
      await flushPromises();
    });

    expect(screen.getByText('로그인 초기화 실패')).toBeInTheDocument();
    appendChildSpy.mockRestore();
  });
});
