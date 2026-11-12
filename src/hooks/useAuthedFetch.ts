import { useCallback } from 'react';
import { useAuth } from 'react-oidc-context';

import { ApiError, apiFetch } from '../utils/api';

/** Calls apiFetch with the current token; on a 401, renews the token silently and retries once. */
export function useAuthedFetch() {
  const auth = useAuth();

  return useCallback(
    async <T>(path: string, init: RequestInit = {}): Promise<T> => {
      try {
        return await apiFetch<T>(path, auth.user?.access_token, init);
      } catch (err) {
        if (!(err instanceof ApiError) || err.status !== 401) throw err;

        const renewed = await auth.signinSilent().catch(() => null);
        if (!renewed) {
          await auth.signinRedirect();
          throw err;
        }

        return apiFetch<T>(path, renewed.access_token, init);
      }
    },
    [auth]
  );
}
