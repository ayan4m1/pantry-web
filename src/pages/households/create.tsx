import { ChangeEvent, Fragment, useCallback, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createHouseholdMutation,
  listHouseholdsQueryKey
} from '../../client/identity/@tanstack/react-query.gen';
import { useNavigate } from 'react-router-dom';

export const Component = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>();
  const queryClient = useQueryClient();
  const createHousehold = useMutation({
    ...createHouseholdMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listHouseholdsQueryKey() });
      navigate('/households');
    }
  });
  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    []
  );

  return (
    <Fragment>
      <h1>Create Household</h1>
      <Form.Group>
        <Form.Label htmlFor="name">Name</Form.Label>
        <Form.Control id="name" onChange={handleNameChange} type="text" />
      </Form.Group>
      <Button
        disabled={!name || createHousehold.isPending}
        onClick={() => createHousehold.mutate({ body: { name: name ?? '' } })}
        variant="success"
      >
        Create
      </Button>
    </Fragment>
  );
};
