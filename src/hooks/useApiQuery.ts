import { useAuth } from 'react-oidc-context';
import { useAuthedFetch } from './useAuthedFetch';
import { QueryKey, useQuery } from '@tanstack/react-query';

import { QueryOpts } from '../types';
import { ApiError } from '../utils/api';

export function useApiQuery<T>(
  queryKey: QueryKey,
  path: string,
  options: QueryOpts<T> = {}
) {
  const auth = useAuth();
  const authedFetch = useAuthedFetch();
  const { enabled = true, ...rest } = options;

  return useQuery<T, ApiError>({
    ...rest,
    queryKey,
    queryFn: ({ signal }) => authedFetch<T>(path, { signal }),
    enabled: auth.isAuthenticated && enabled // never fires before login
  });
}
