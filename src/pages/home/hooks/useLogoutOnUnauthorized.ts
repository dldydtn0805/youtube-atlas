import { useEffect } from 'react';
import { ApiRequestError } from '../../../lib/api';

function useLogoutOnUnauthorized(error: unknown, logout: () => Promise<unknown>) {
  useEffect(() => {
    if (!(error instanceof ApiRequestError)) {
      return;
    }

    if (error.code !== 'unauthorized' && error.code !== 'session_expired') {
      return;
    }

    void logout();
  }, [error, logout]);
}

export default useLogoutOnUnauthorized;
