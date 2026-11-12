import { useMutation } from '@tanstack/react-query';

import { useAuthedFetch } from './useAuthedFetch';
import { MutationOpts } from '../types';
import { ApiError } from '../utils/api';

export function useApiMutation<TData, TVars = void>({
  path,
  method = 'POST',
  body = (vars) => vars,
  ...options
}: MutationOpts<TData, TVars>) {
  const authedFetch = useAuthedFetch();

  return useMutation<TData, ApiError, TVars>({
    ...options,
    mutationFn: (vars) => {
      const payload = body(vars);

      return authedFetch<TData>(
        typeof path === 'function' ? path(vars) : path,
        {
          method,
          body: payload === undefined ? undefined : JSON.stringify(payload)
        }
      );
    }
  });
}
