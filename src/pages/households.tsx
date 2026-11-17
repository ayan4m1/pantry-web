import { Fragment } from 'react';
import { Button } from 'react-bootstrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createHouseholdMutation,
  listHouseholdsOptions,
  listHouseholdsQueryKey
} from '../client/identity/@tanstack/react-query.gen';

export const Component = () => {
  const queryClient = useQueryClient();
  const {
    data: households,
    isPending,
    error
  } = useQuery(listHouseholdsOptions());
  const createHousehold = useMutation({
    ...createHouseholdMutation(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: listHouseholdsQueryKey() })
  });

  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Couldn&apos;t load households ({error.status})</p>;

  return (
    <Fragment>
      <title>Pantry - Households</title>
      <h1>Your households</h1>
      <ul>
        {households.map((h) => (
          <li key={h.id}>{h.name}</li>
        ))}
      </ul>
      <Button
        disabled={createHousehold.isPending}
        onClick={() => createHousehold.mutate({ query: { name: 'Home' } })}
      >
        Add
      </Button>
    </Fragment>
  );
};
