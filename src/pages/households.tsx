import { Fragment } from 'react';

import { useCreateHousehold, useHouseholds } from '../apis/identity';

export const Component = () => {
  const { data: households, isPending, error } = useHouseholds();
  const createHousehold = useCreateHousehold();

  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Couldn&apos;t load households ({error.status})</p>;

  return (
    <Fragment>
      <title>Pantry - Households</title>
      <ul>
        {households.map((h) => (
          <li key={h.id}>{h.name}</li>
        ))}
      </ul>
      <button
        disabled={createHousehold.isPending}
        onClick={() => createHousehold.mutate({ name: 'Home' })}
      >
        New household
      </button>
    </Fragment>
  );
};
