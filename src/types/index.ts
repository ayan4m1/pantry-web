import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

import { ApiError } from '../utils/api';

export type QueryOpts<T> = Omit<
  UseQueryOptions<T, ApiError>,
  'queryKey' | 'queryFn' | 'enabled'
> & { enabled?: boolean };

export type MutationOpts<TData, TVars> = Omit<
  UseMutationOptions<TData, ApiError, TVars>,
  'mutationFn'
> & {
  path: string | ((vars: TVars) => string);
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Maps variables to the request body. Defaults to sending the variables as-is. Return undefined for no body. */
  body?: (vars: TVars) => unknown;
};
