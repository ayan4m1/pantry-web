import { useQueryClient } from '@tanstack/react-query';

import { useApiQuery } from '../hooks/useApiQuery';
import { useApiMutation } from '../hooks/useApiMutation';

export type Me = { id: string; username: string };
export type Household = { id: string; name: string };

export const identityKeys = {
  me: ['me'] as const,
  households: ['households'] as const
};

export const useMe = () => useApiQuery<Me>(identityKeys.me, '/me');

export const useHouseholds = () =>
  useApiQuery<Household[]>(identityKeys.households, '/households');

// body
export function useCreateHousehold() {
  const queryClient = useQueryClient();
  return useApiMutation<Household, { name: string }>({
    path: '/households',
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: identityKeys.households })
  });
}

// url + body
export function useRenameHousehold() {
  const queryClient = useQueryClient();
  return useApiMutation<Household, { id: string; name: string }>({
    path: ({ id }) => `/households/${id}`,
    method: 'PATCH',
    body: ({ name }) => ({ name }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: identityKeys.households });
      queryClient.invalidateQueries({
        queryKey: [...identityKeys.households, id]
      });
    }
  });
}

// url
export const useLeaveHousehold = () =>
  useApiMutation<void, string>({
    path: (id) => `/households/${id}/membership`,
    method: 'DELETE',
    body: () => undefined
  });
