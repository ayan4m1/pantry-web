import { Fragment } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getHouseholdOptions,
  getHouseholdQueryKey,
  removeHouseholdMemberMutation
} from '../client/identity/@tanstack/react-query.gen';

export const Component = () => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const removeMember = useMutation({
    ...removeHouseholdMemberMutation(),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: getHouseholdQueryKey({ path: { id: id ?? '' } })
      })
  });
  const {
    data: household,
    isPending,
    error
  } = useQuery({
    ...getHouseholdOptions({ path: { id: id ?? '' } }),
    enabled: Boolean(id)
  });

  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Couldn&apos;t load household ({error.status})</p>;

  return (
    <Fragment>
      <title>Pantry - View Household</title>
      <h1>{household.name}</h1>
      <ul>
        {household.members.map((member) => (
          <li key={member.userId}>
            {member.username}
            <Button
              onClick={() =>
                removeMember.mutate({
                  path: { householdId: household.id, userId: member.userId }
                })
              }
              variant="danger"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};
